import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/staff";
import { isWithinServiceWindow, MESSAGE_COLUMNS } from "@/lib/inbox/model";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { isWhatsAppConfigured, maskPhone, sendWhatsAppText, WHATSAPP_TEXT_MAX_LENGTH, WhatsAppApiError } from "@/lib/whatsapp";

/**
 * EMC Inbox → customer: sends one free-form WhatsApp text reply.
 *
 *   browser (staff session) → this route → Meta Graph API → customer
 *
 * The browser never talks to Meta and never sees WHATSAPP_ACCESS_TOKEN or
 * SUPABASE_SERVICE_ROLE_KEY. Steps:
 *   1. same-origin JSON request from an ACTIVE staff member (role read from
 *      the database, never from the request)
 *   2. conversation loaded with the staff member's own session, so RLS
 *      decides which conversation IDs they may use (unknown → 404)
 *   3. Meta's 24-hour customer service window enforced (409 otherwise —
 *      a template is required, nothing is sent)
 *   4. per-staff rate limit, counted in the database (works across instances)
 *   5. message row written as 'queued' (service role — staff can't insert
 *      messages themselves), then sent; Meta's wamid is saved so the webhook
 *      can apply sent / delivered / read / failed through wa_apply_status.
 *      If Meta rejects the request no wamid exists and no webhook will ever
 *      report it, so this route marks that row 'failed' itself.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEND_LIMIT_PER_MINUTE = 20;
/** Meta: "more than 24 hours have passed since the customer last replied". */
const META_REENGAGEMENT_ERROR = 131047;

const SendSchema = z.object({
  conversationId: z.string().uuid("Unknown conversation."),
  body: z
    .string()
    .max(WHATSAPP_TEXT_MAX_LENGTH, `Messages can be at most ${WHATSAPP_TEXT_MAX_LENGTH} characters.`)
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length > 0, "Type a message first."),
});

const WINDOW_CLOSED_MESSAGE =
  "This customer's 24-hour reply window has closed. WhatsApp only allows an approved template message until they write to you again.";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Rejects cross-site requests (defence in depth on top of SameSite cookies). */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return false;
  return (request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return json(403, { code: "forbidden", message: "Request not allowed." });

  const auth = await requireStaff();
  if (!auth.ok) return auth.response;
  const staff = auth.access.profile;

  if (!isWhatsAppConfigured() || !isSupabaseAdminConfigured()) {
    return json(503, { code: "not_configured", message: "Sending isn't set up on this server yet." });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { code: "invalid", message: "Invalid request." });
  }
  const parsed = SendSchema.safeParse(payload);
  if (!parsed.success) {
    return json(400, { code: "invalid", message: parsed.error.issues[0]?.message ?? "Invalid request." });
  }
  const { conversationId, body } = parsed.data;

  // (2) Read through the staff member's own session: RLS is the authority.
  const { data: conversation, error: conversationError } = await auth.supabase
    .from("wa_conversations")
    .select("id, contact_id, last_inbound_at, contact:contacts!inner(phone)")
    .eq("id", conversationId)
    .maybeSingle();

  if (conversationError) {
    // eslint-disable-next-line no-console
    console.error("[inbox-send] conversation lookup failed", { code: conversationError.code });
    return json(503, { code: "unavailable", message: "We couldn't load this conversation. Please try again." });
  }
  if (!conversation) return json(404, { code: "not_found", message: "Conversation not found." });

  const row = conversation as unknown as { id: string; contact_id: string; last_inbound_at: string | null; contact: { phone: string } };

  // (3) Meta's customer service window.
  if (!isWithinServiceWindow(row.last_inbound_at)) {
    return json(409, { code: "window_closed", message: WINDOW_CLOSED_MESSAGE });
  }

  const admin = createSupabaseAdminClient();

  // (4) Per-staff rate limit.
  const { count, error: countError } = await admin
    .from("wa_messages")
    .select("id", { count: "exact", head: true })
    .eq("created_by", staff.id)
    .eq("direction", "outbound")
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if (countError) {
    // eslint-disable-next-line no-console
    console.error("[inbox-send] rate-limit check failed", { code: countError.code });
    return json(503, { code: "unavailable", message: "We couldn't send right now. Please try again." });
  }
  if ((count ?? 0) >= SEND_LIMIT_PER_MINUTE) {
    return json(429, { code: "rate_limited", message: "You're sending very quickly. Please wait a minute and try again." });
  }

  // (5) Record the attempt, then send.
  const { data: queued, error: insertError } = await admin
    .from("wa_messages")
    .insert({
      conversation_id: row.id,
      contact_id: row.contact_id,
      direction: "outbound",
      message_type: "text",
      body,
      status: "queued",
      created_by: staff.id,
    })
    .select(MESSAGE_COLUMNS)
    .single();
  if (insertError || !queued) {
    // eslint-disable-next-line no-console
    console.error("[inbox-send] could not record outbound message", { code: insertError?.code });
    return json(503, { code: "unavailable", message: "We couldn't send right now. Please try again." });
  }
  const queuedId = (queued as { id: string }).id;

  try {
    const { messageId } = await sendWhatsAppText({ to: row.contact.phone, body });
    if (!messageId) throw new WhatsAppApiError("WhatsApp Cloud API returned no message id.");

    const { data: sent, error: updateError } = await admin
      .from("wa_messages")
      .update({ meta_message_id: messageId })
      .eq("id", queuedId)
      .select(MESSAGE_COLUMNS)
      .single();
    if (updateError) {
      // Sent to the customer, but status updates won't attach to this row.
      // eslint-disable-next-line no-console
      console.error("[inbox-send] sent, but could not save Meta message id", { id: messageId, code: updateError.code });
    }
    return json(200, { ok: true, row: sent ?? queued });
  } catch (error) {
    const apiError = error instanceof WhatsAppApiError ? error : null;
    const windowClosed = apiError?.metaCode === META_REENGAGEMENT_ERROR;
    const errorTitle = apiError?.timedOut
      ? "Timed out waiting for WhatsApp — it may or may not have been sent. Check before resending."
      : (apiError?.metaTitle ?? "WhatsApp did not accept this message.");

    const { data: failed } = await admin
      .from("wa_messages")
      .update({
        status: "failed",
        error_code: apiError?.metaCode ?? null,
        error_title: errorTitle.slice(0, 500),
        failed_at: new Date().toISOString(),
      })
      .eq("id", queuedId)
      .eq("status", "queued")
      .select(MESSAGE_COLUMNS)
      .maybeSingle();

    if (!apiError) {
      // eslint-disable-next-line no-console
      console.error("[inbox-send] unexpected error", { to: maskPhone(row.contact.phone), error: error instanceof Error ? error.name : "unknown" });
    }

    return json(windowClosed ? 409 : 502, {
      code: windowClosed ? "window_closed" : apiError?.timedOut ? "timeout" : "send_failed",
      message: windowClosed
        ? WINDOW_CLOSED_MESSAGE
        : apiError?.timedOut
          ? "WhatsApp didn't respond in time. The message may not have been sent — please check before trying again."
          : "WhatsApp didn't accept this message. Please try again.",
      row: failed ?? null,
      // Technical details for admins only.
      ...(staff.role === "admin" && apiError ? { details: { metaCode: apiError.metaCode ?? null, metaTitle: apiError.metaTitle ?? null } } : {}),
    });
  }
}
