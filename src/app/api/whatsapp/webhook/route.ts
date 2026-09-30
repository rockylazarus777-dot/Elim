import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { secureCompare } from "@/lib/secure-compare";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { maskPhone } from "@/lib/whatsapp";
import { type InboundMessage, parseWebhookPayload, type StatusEvent } from "@/lib/whatsapp-webhook";

/**
 * Meta WhatsApp Cloud API webhook.
 *
 * GET  — subscription verification handshake. Meta calls this once when the
 *        callback URL is saved in the App dashboard; we echo `hub.challenge`
 *        back as plain text only if `hub.verify_token` matches
 *        WHATSAPP_WEBHOOK_VERIFY_TOKEN.
 * POST — event delivery (incoming messages + message status updates).
 *        When WHATSAPP_APP_SECRET is set, the X-Hub-Signature-256 header is
 *        verified against the raw body before anything is parsed.
 *
 * Verified events are stored in the EMC Inbox database (Supabase) through
 * exactly two database functions — public.wa_ingest_inbound and
 * public.wa_apply_status (supabase/migrations/) — which handle Meta retries
 * (duplicate wamids), unread counts, forward-only status and opt-outs.
 * Unsigned events are NEVER stored: without WHATSAPP_APP_SECRET they are
 * only logged, as before.
 *
 * Responses: 200 for every event we accepted (including duplicates, unknown
 * statuses and unsupported types); 401/400 only for a bad signature or
 * unparseable body; 500 only when the database is temporarily unreachable,
 * so Meta retries — safe, because ingestion is idempotent.
 *
 * Logs never contain message text, full phone numbers or any secret.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Meta sends a numeric challenge; allow a conservative charset so this
// endpoint can never be used to reflect arbitrary content.
const CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{1,256}$/;

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!expected) {
    // eslint-disable-next-line no-console
    console.warn("[whatsapp-webhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN is not set — rejecting verification.");
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (mode === "subscribe" && token !== null && secureCompare(token, expected) && challenge && CHALLENGE_PATTERN.test(challenge)) {
    return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  // eslint-disable-next-line no-console
  console.warn("[whatsapp-webhook] Verification rejected.");
  return new NextResponse("Forbidden", { status: 403 });
}

function isValidSignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const provided = Buffer.from(header.slice("sha256=".length), "hex");
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest();
  // Both are 32 bytes when the header is well-formed; a malformed hex value
  // decodes to a different length and is rejected before timingSafeEqual.
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

function logIncomingMessage(message: InboundMessage) {
  // Content (text, media, location…) is deliberately never logged.
  // eslint-disable-next-line no-console
  console.log("[whatsapp-webhook] Incoming message", {
    id: message.metaMessageId,
    from: maskPhone(message.phone),
    type: message.type,
    timestamp: message.sentAt,
  });
}

function logStatusUpdate(status: StatusEvent) {
  // eslint-disable-next-line no-console
  console.log("[whatsapp-webhook] Message status", {
    id: status.metaMessageId,
    status: status.status,
    recipient: status.recipient ? maskPhone(status.recipient) : undefined,
    timestamp: status.statusAt,
    errors: status.errorCode !== null ? [{ code: status.errorCode, title: status.errorTitle }] : undefined,
  });
}

type DbError = { code?: string; message?: string };

/** Thrown for database failures worth a Meta retry (outage, timeout…). */
class TransientDbError extends Error {}

/**
 * Postgres "invalid_parameter_value" / check violations are raised by the
 * functions for data that will never be valid (e.g. a malformed phone):
 * retrying can't help, so those are logged and skipped. Anything else is
 * treated as transient.
 */
function isPermanentDbError(error: DbError): boolean {
  return error.code === "22023" || error.code === "23514" || error.code === "22P02";
}

async function storeEvents(inbound: InboundMessage[], statuses: StatusEvent[]) {
  const supabase = createSupabaseAdminClient();

  for (const message of inbound) {
    const { data, error } = await supabase.rpc("wa_ingest_inbound", {
      p_phone: message.phone,
      p_meta_message_id: message.metaMessageId,
      p_message_type: message.type,
      p_body: message.body,
      p_media_id: message.mediaId,
      p_profile_name: message.profileName,
      p_sent_at: message.sentAt,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[whatsapp-webhook] Could not store incoming message", {
        id: message.metaMessageId,
        from: maskPhone(message.phone),
        code: error.code,
      });
      if (isPermanentDbError(error)) continue;
      throw new TransientDbError("wa_ingest_inbound failed");
    }

    const result = (data ?? {}) as { duplicate?: boolean; opted_out?: boolean };
    // eslint-disable-next-line no-console
    console.log("[whatsapp-webhook] Stored incoming message", {
      id: message.metaMessageId,
      duplicate: result.duplicate === true,
      ...(result.opted_out ? { optedOut: true } : {}),
    });
  }

  for (const status of statuses) {
    const { data, error } = await supabase.rpc("wa_apply_status", {
      p_meta_message_id: status.metaMessageId,
      p_status: status.status,
      p_status_at: status.statusAt,
      p_error_code: status.errorCode,
      p_error_title: status.errorTitle,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[whatsapp-webhook] Could not apply message status", { id: status.metaMessageId, code: error.code });
      if (isPermanentDbError(error)) continue;
      throw new TransientDbError("wa_apply_status failed");
    }

    // 'not_found' is expected for messages sent outside the Inbox (e.g. the
    // send-template route) — nothing is created for them.
    // eslint-disable-next-line no-console
    console.log("[whatsapp-webhook] Applied message status", { id: status.metaMessageId, status: status.status, result: data });
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (appSecret) {
    if (!isValidSignature(rawBody, request.headers.get("x-hub-signature-256"), appSecret)) {
      // eslint-disable-next-line no-console
      console.warn("[whatsapp-webhook] Rejected event with missing/invalid signature.");
      return new NextResponse("Invalid signature", { status: 401 });
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn("[whatsapp-webhook] WHATSAPP_APP_SECRET is not set — event accepted WITHOUT signature verification and NOT stored.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const parsed = parseWebhookPayload(payload, process.env.WHATSAPP_PHONE_NUMBER_ID);
  if (!parsed) {
    // Not a WhatsApp event — acknowledge so Meta doesn't retry, but do nothing.
    return NextResponse.json({ received: true });
  }

  parsed.inbound.forEach(logIncomingMessage);
  parsed.statuses.forEach(logStatusUpdate);
  if (parsed.skipped > 0) {
    // eslint-disable-next-line no-console
    console.warn("[whatsapp-webhook] Skipped events (missing IDs or another phone number ID)", { count: parsed.skipped });
  }

  // Only signature-verified events ever reach the database.
  if (!appSecret || (parsed.inbound.length === 0 && parsed.statuses.length === 0)) {
    return NextResponse.json({ received: true });
  }

  if (!isSupabaseAdminConfigured()) {
    // eslint-disable-next-line no-console
    console.warn("[whatsapp-webhook] Supabase is not configured — event logged but not stored.");
    return NextResponse.json({ received: true });
  }

  try {
    await storeEvents(parsed.inbound, parsed.statuses);
  } catch (error) {
    if (!(error instanceof TransientDbError)) {
      // eslint-disable-next-line no-console
      console.error("[whatsapp-webhook] Unexpected error while storing events:", error instanceof Error ? error.name : "unknown");
    }
    // Ask Meta to retry the whole delivery later; already-stored messages
    // come back as duplicates and are ignored.
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
