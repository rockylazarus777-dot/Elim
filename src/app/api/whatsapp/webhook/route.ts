import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { secureCompare } from "@/lib/secure-compare";
import { maskPhone } from "@/lib/whatsapp";

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
 * Events are currently only logged (masked, no message content) — there is
 * no database yet. Keep the POST handler fast: Meta retries deliveries that
 * don't get a 200 promptly, so any future slow processing belongs in a queue,
 * not inline here.
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

type WebhookMessage = { id?: string; from?: string; type?: string; timestamp?: string };
type WebhookStatus = {
  id?: string;
  status?: string;
  recipient_id?: string;
  timestamp?: string;
  errors?: { code?: number; title?: string }[];
};
type WebhookChange = { field?: string; value?: { messages?: WebhookMessage[]; statuses?: WebhookStatus[] } };
type WebhookPayload = { object?: string; entry?: { changes?: WebhookChange[] }[] };

function handleIncomingMessage(message: WebhookMessage) {
  // Content (text, media, location…) is deliberately never logged.
  // eslint-disable-next-line no-console
  console.log("[whatsapp-webhook] Incoming message", {
    id: message.id,
    from: message.from ? maskPhone(message.from) : undefined,
    type: message.type,
    timestamp: message.timestamp,
  });
}

function handleStatusUpdate(status: WebhookStatus) {
  // eslint-disable-next-line no-console
  console.log("[whatsapp-webhook] Message status", {
    id: status.id,
    status: status.status,
    recipient: status.recipient_id ? maskPhone(status.recipient_id) : undefined,
    timestamp: status.timestamp,
    errors: status.errors?.map((e) => ({ code: e.code, title: e.title })),
  });
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
    console.warn("[whatsapp-webhook] WHATSAPP_APP_SECRET is not set — event accepted WITHOUT signature verification.");
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (payload?.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) {
    // Not a WhatsApp event — acknowledge so Meta doesn't retry, but do nothing.
    return NextResponse.json({ received: true });
  }

  for (const entry of payload.entry) {
    for (const change of entry?.changes ?? []) {
      if (change?.field !== "messages" || !change.value) continue;
      for (const message of change.value.messages ?? []) handleIncomingMessage(message);
      for (const status of change.value.statuses ?? []) handleStatusUpdate(status);
    }
  }

  return NextResponse.json({ received: true });
}
