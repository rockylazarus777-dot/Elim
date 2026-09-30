import { describe, expect, it } from "vitest";
import { extractMessageContent, metaTimestampToIso, parseWebhookPayload } from "@/lib/whatsapp-webhook";

const wrap = (value: Record<string, unknown>) => ({
  object: "whatsapp_business_account",
  entry: [{ id: "WABA", changes: [{ field: "messages", value: { messaging_product: "whatsapp", metadata: { phone_number_id: "PNID" }, ...value } }] }],
});

describe("extractMessageContent", () => {
  it.each([
    [{ type: "text", text: { body: "Hi, I need NABH support" } }, { type: "text", body: "Hi, I need NABH support", mediaId: null }],
    [{ type: "image", image: { id: "MEDIA1", caption: "Our lab", mime_type: "image/jpeg" } }, { type: "image", body: "Our lab", mediaId: "MEDIA1" }],
    [{ type: "image", image: { id: "MEDIA2" } }, { type: "image", body: null, mediaId: "MEDIA2" }],
    [{ type: "video", video: { id: "V1", caption: "Tour" } }, { type: "video", body: "Tour", mediaId: "V1" }],
    [{ type: "audio", audio: { id: "A1", voice: true } }, { type: "audio", body: null, mediaId: "A1" }],
    [{ type: "document", document: { id: "D1", filename: "licence.pdf" } }, { type: "document", body: "licence.pdf", mediaId: "D1" }],
    [{ type: "sticker", sticker: { id: "S1" } }, { type: "sticker", body: null, mediaId: "S1" }],
    [
      { type: "location", location: { latitude: 13.08, longitude: 80.27, name: "ABC Hospital", address: "Chennai" } },
      { type: "location", body: "ABC Hospital · Chennai · 13.08, 80.27", mediaId: null },
    ],
    [{ type: "interactive", interactive: { type: "button_reply", button_reply: { id: "b1", title: "Call me" } } }, { type: "interactive", body: "Call me", mediaId: null }],
    [{ type: "interactive", interactive: { type: "list_reply", list_reply: { id: "l1", title: "NABH" } } }, { type: "interactive", body: "NABH", mediaId: null }],
    [{ type: "button", button: { text: "Stop promotions", payload: "STOP" } }, { type: "button", body: "Stop promotions", mediaId: null }],
    [{ type: "reaction", reaction: { message_id: "wamid.X", emoji: "👍" } }, { type: "reaction", body: "👍", mediaId: null }],
    [{ type: "reaction", reaction: { message_id: "wamid.X", emoji: "" } }, { type: "reaction", body: null, mediaId: null }],
    [
      { type: "contacts", contacts: [{ name: { formatted_name: "Dr Priya" }, phones: [{ phone: "+91 90000 00000" }] }] },
      { type: "contacts", body: "Contact: Dr Priya", mediaId: null },
    ],
    [{ type: "unsupported", errors: [{ code: 131051 }] }, { type: "unsupported", body: null, mediaId: null }],
    [{ type: "order", order: { catalog_id: "c" } }, { type: "order", body: null, mediaId: null }],
    [{}, { type: "unsupported", body: null, mediaId: null }],
  ])("%j", (message, expected) => {
    expect(extractMessageContent(message)).toEqual(expected);
  });

  it("never includes a shared contact's phone number", () => {
    const { body } = extractMessageContent({ type: "contacts", contacts: [{ name: { formatted_name: "A" }, phones: [{ phone: "+919876543210" }] }] });
    expect(body).not.toContain("9876543210");
  });
});

describe("metaTimestampToIso", () => {
  it("converts unix seconds", () => {
    expect(metaTimestampToIso("1759212000")).toBe("2025-09-30T06:00:00.000Z");
  });
  it("rejects junk", () => {
    expect(metaTimestampToIso("tomorrow")).toBeNull();
    expect(metaTimestampToIso(undefined)).toBeNull();
  });
});

describe("parseWebhookPayload", () => {
  it("returns null for non-WhatsApp payloads", () => {
    expect(parseWebhookPayload({ object: "page", entry: [] })).toBeNull();
    expect(parseWebhookPayload("nope")).toBeNull();
  });

  it("pairs the sender with their profile name", () => {
    const parsed = parseWebhookPayload(
      wrap({
        contacts: [{ wa_id: "919840922491", profile: { name: "Ramesh Kumar" } }],
        messages: [{ from: "919840922491", id: "wamid.A", timestamp: "1759212000", type: "text", text: { body: "Hi" } }],
      }),
      "PNID",
    );
    expect(parsed?.inbound).toEqual([
      { phone: "919840922491", metaMessageId: "wamid.A", type: "text", body: "Hi", mediaId: null, profileName: "Ramesh Kumar", sentAt: "2025-09-30T06:00:00.000Z" },
    ]);
  });

  it("parses statuses including Meta's failure code/title", () => {
    const parsed = parseWebhookPayload(
      wrap({
        statuses: [
          {
            id: "wamid.OUT",
            status: "failed",
            timestamp: "1759212000",
            recipient_id: "918122309659",
            errors: [{ code: 131042, title: "Business eligibility payment issue" }],
          },
        ],
      }),
    );
    expect(parsed?.statuses).toEqual([
      { metaMessageId: "wamid.OUT", status: "failed", statusAt: "2025-09-30T06:00:00.000Z", recipient: "918122309659", errorCode: 131042, errorTitle: "Business eligibility payment issue" },
    ]);
  });

  it("skips events for another phone number ID and events without IDs", () => {
    const other = parseWebhookPayload(wrap({ messages: [{ from: "919840922491", id: "wamid.B", type: "text", text: { body: "x" } }] }), "SOMETHING_ELSE");
    expect(other).toEqual({ inbound: [], statuses: [], skipped: 1 });
    const broken = parseWebhookPayload(wrap({ messages: [{ type: "text" }], statuses: [{ status: "sent" }] }), "PNID");
    expect(broken).toEqual({ inbound: [], statuses: [], skipped: 2 });
  });

  it("ignores non-messages fields", () => {
    const parsed = parseWebhookPayload({ object: "whatsapp_business_account", entry: [{ changes: [{ field: "account_update", value: { x: 1 } }] }] });
    expect(parsed).toEqual({ inbound: [], statuses: [], skipped: 0 });
  });
});
