/**
 * Parses Meta WhatsApp Cloud API webhook payloads into the arguments of the
 * database functions public.wa_ingest_inbound / public.wa_apply_status
 * (supabase/migrations/). Pure — no I/O, no logging — so every message type
 * is unit-tested (src/lib/whatsapp-webhook.test.ts).
 *
 * Payload shape: entry[].changes[] with field "messages" and a value holding
 * metadata.phone_number_id, contacts[] (sender profile names), messages[]
 * (incoming) and statuses[] (delivery updates for messages WE sent).
 * Anything unexpected is skipped rather than thrown, so one odd event never
 * blocks the rest of a delivery.
 */

export type InboundMessage = {
  /** Sender's WhatsApp ID: country code + number, digits only. */
  phone: string;
  metaMessageId: string;
  /** Meta's type string; the database stores unknown types as 'unsupported'. */
  type: string;
  /** Text, media caption, button/list reply title, reaction emoji, etc. */
  body: string | null;
  /** Meta media ID (image/video/audio/document/sticker). Not downloaded yet. */
  mediaId: string | null;
  profileName: string | null;
  /** ISO timestamp from Meta's unix `timestamp`. */
  sentAt: string | null;
};

export type StatusEvent = {
  metaMessageId: string;
  status: string;
  statusAt: string | null;
  recipient: string | null;
  errorCode: number | null;
  errorTitle: string | null;
};

export type ParsedWebhook = {
  inbound: InboundMessage[];
  statuses: StatusEvent[];
  /** Events ignored: missing IDs, or sent to a different phone number ID. */
  skipped: number;
};

type Obj = Record<string, unknown>;

const obj = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string | null => (typeof v === "string" && v.trim() !== "" ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Meta sends unix seconds as a string, e.g. "1759212345". */
export function metaTimestampToIso(value: unknown): string | null {
  const s = typeof value === "number" ? String(value) : str(value);
  if (!s || !/^\d{1,12}$/.test(s)) return null;
  return new Date(Number(s) * 1000).toISOString();
}

const MEDIA_TYPES = new Set(["image", "video", "audio", "document", "sticker"]);

/** Extracts the storable body and media ID for one incoming message. */
export function extractMessageContent(message: Obj): { type: string; body: string | null; mediaId: string | null } {
  const type = str(message.type) ?? "unsupported";
  const part = obj(message[type]);

  if (type === "text") {
    return { type, body: str(part?.body), mediaId: null };
  }

  if (MEDIA_TYPES.has(type)) {
    // Captions exist on image/video/document; a document without one shows its file name.
    const body = str(part?.caption) ?? (type === "document" ? str(part?.filename) : null);
    return { type, body, mediaId: str(part?.id) };
  }

  if (type === "location") {
    const lat = num(part?.latitude);
    const lng = num(part?.longitude);
    const parts = [str(part?.name), str(part?.address), lat !== null && lng !== null ? `${lat}, ${lng}` : null];
    return { type, body: parts.filter(Boolean).join(" · ") || null, mediaId: null };
  }

  if (type === "interactive") {
    // Replies to list / reply-button messages; flows ("nfm_reply") have no title.
    const title = str(obj(part?.button_reply)?.title) ?? str(obj(part?.list_reply)?.title);
    return { type, body: title ?? (obj(part?.nfm_reply) ? "Form response" : null), mediaId: null };
  }

  if (type === "button") {
    // Customer tapped a quick-reply button on one of our templates.
    return { type, body: str(part?.text) ?? str(part?.payload), mediaId: null };
  }

  if (type === "reaction") {
    // An empty emoji means the customer removed their reaction.
    return { type, body: str(part?.emoji), mediaId: null };
  }

  if (type === "contacts") {
    // Only the shared contacts' display names — not their numbers.
    const names = arr(message.contacts)
      .map((c) => str(obj(obj(c)?.name)?.formatted_name))
      .filter((n): n is string => n !== null);
    return { type, body: names.length ? `Contact: ${names.join(", ")}` : null, mediaId: null };
  }

  if (type === "system") {
    return { type, body: str(part?.body), mediaId: null };
  }

  // "unsupported", "order", "request_welcome", future types… → stored as unsupported.
  return { type, body: null, mediaId: null };
}

/**
 * Returns null if this isn't a WhatsApp Business Account webhook at all.
 * Events addressed to a phone number ID other than `expectedPhoneNumberId`
 * (when given) are skipped, so only EMC's number reaches the database.
 */
export function parseWebhookPayload(payload: unknown, expectedPhoneNumberId?: string | null): ParsedWebhook | null {
  const root = obj(payload);
  if (!root || root.object !== "whatsapp_business_account" || !Array.isArray(root.entry)) return null;

  const result: ParsedWebhook = { inbound: [], statuses: [], skipped: 0 };

  for (const entry of arr(root.entry)) {
    for (const change of arr(obj(entry)?.changes)) {
      const c = obj(change);
      const value = obj(c?.value);
      if (c?.field !== "messages" || !value) continue;

      const messages = arr(value.messages);
      const statuses = arr(value.statuses);

      const phoneNumberId = str(obj(value.metadata)?.phone_number_id);
      if (expectedPhoneNumberId && phoneNumberId && phoneNumberId !== expectedPhoneNumberId) {
        result.skipped += messages.length + statuses.length;
        continue;
      }

      // Sender profile names, keyed by WhatsApp ID.
      const profileNames = new Map<string, string>();
      for (const contact of arr(value.contacts)) {
        const waId = str(obj(contact)?.wa_id);
        const name = str(obj(obj(contact)?.profile)?.name);
        if (waId && name) profileNames.set(waId, name);
      }

      for (const raw of messages) {
        const message = obj(raw);
        const phone = str(message?.from);
        const metaMessageId = str(message?.id);
        if (!message || !phone || !metaMessageId) {
          result.skipped++;
          continue;
        }
        const { type, body, mediaId } = extractMessageContent(message);
        result.inbound.push({
          phone,
          metaMessageId,
          type,
          body,
          mediaId,
          profileName: profileNames.get(phone) ?? null,
          sentAt: metaTimestampToIso(message.timestamp),
        });
      }

      for (const raw of statuses) {
        const status = obj(raw);
        const metaMessageId = str(status?.id);
        const statusValue = str(status?.status);
        if (!status || !metaMessageId || !statusValue) {
          result.skipped++;
          continue;
        }
        const firstError = obj(arr(status.errors)[0]);
        result.statuses.push({
          metaMessageId,
          status: statusValue,
          statusAt: metaTimestampToIso(status.timestamp),
          recipient: str(status.recipient_id),
          errorCode: num(firstError?.code),
          errorTitle: str(firstError?.title) ?? str(firstError?.message),
        });
      }
    }
  }

  return result;
}
