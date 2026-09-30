/**
 * End-to-end webhook tests: signed Meta requests → route → parser →
 * the REAL wa_ingest_inbound / wa_apply_status functions from the migration
 * (in PGlite, as service_role). No network, no Meta, no real messages.
 */
import { createHmac } from "node:crypto";
import type { PGlite } from "@electric-sql/pglite";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createTestDatabase, rpcAs } from "@/test/pglite-supabase";

const APP_SECRET = "test-app-secret";
const PHONE_NUMBER_ID = "1397259290130216";

let db: PGlite;
const rpcCalls: string[] = [];
let failNextRpc: string | null = null; // simulate a Supabase outage (error code)

vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  createSupabaseAdminClient: () => ({
    rpc: async (fn: string, params: Record<string, unknown>) => {
      rpcCalls.push(fn);
      if (failNextRpc) {
        const code = failNextRpc;
        failNextRpc = null;
        return { data: null, error: { code, message: "simulated" } };
      }
      return rpcAs(db, "service_role")(fn, params);
    },
  }),
}));

const { POST, GET } = await import("@/app/api/whatsapp/webhook/route");

// ---- helpers ---------------------------------------------------------------
let seq = 0;
const uniquePhone = () => `9190000${String(++seq).padStart(5, "0")}`;
const ts = (offsetSeconds = 0) => String(Math.floor(Date.UTC(2026, 8, 30, 8, 0, 0) / 1000) + offsetSeconds);

const envelope = (value: Record<string, unknown>) => ({
  object: "whatsapp_business_account",
  entry: [
    {
      id: "1470397824898596",
      changes: [
        {
          field: "messages",
          value: { messaging_product: "whatsapp", metadata: { display_phone_number: "919150008116", phone_number_id: PHONE_NUMBER_ID }, ...value },
        },
      ],
    },
  ],
});

const inbound = (phone: string, message: Record<string, unknown>, name = "Ramesh Kumar") =>
  envelope({ contacts: [{ wa_id: phone, profile: { name } }], messages: [{ from: phone, timestamp: ts(), ...message }] });

const statusEvent = (wamid: string, status: string, offset: number, errors?: unknown[]) =>
  envelope({ statuses: [{ id: wamid, status, timestamp: ts(offset), recipient_id: "919840922491", ...(errors ? { errors } : {}) }] });

const sign = (body: string, secret = APP_SECRET) => `sha256=${createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;

function post(payload: unknown, signature: string | null | "valid" = "valid") {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (signature === "valid") headers["x-hub-signature-256"] = sign(body);
  else if (signature) headers["x-hub-signature-256"] = signature;
  return POST(new NextRequest("https://www.emcforyou.com/api/whatsapp/webhook", { method: "POST", body, headers }));
}

const one = async <T,>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows[0];
const count = async (sql: string, params: unknown[] = []) => (await one<{ n: number }>(`select count(*)::int as n from ${sql}`, params))!.n;

async function conversationFor(phone: string) {
  return one<{ id: string; contact_id: string; unread_count: number; last_message_preview: string; last_inbound_at: string | null; status: string }>(
    `select c.* from wa_conversations c join contacts ct on ct.id = c.contact_id where ct.phone = $1`,
    [phone],
  );
}

/** Simulates the (future) Inbox send route: an outbound row already carrying Meta's wamid. */
async function createOutbound(wamid: string) {
  const phone = uniquePhone();
  await post(inbound(phone, { id: `wamid.seed.${wamid}`, type: "text", text: { body: "hello" } }));
  const conv = (await conversationFor(phone))!;
  await db.query(
    `insert into wa_messages (conversation_id, contact_id, direction, message_type, body, meta_message_id, status)
     values ($1, $2, 'outbound', 'text', 'Sure, we can help', $3, 'queued')`,
    [conv.id, conv.contact_id, wamid],
  );
}
const messageStatus = (wamid: string) =>
  one<{ status: string; sent_at: string | null; delivered_at: string | null; read_at: string | null; error_code: number | null; error_title: string | null }>(
    `select status, sent_at, delivered_at, read_at, error_code, error_title from wa_messages where meta_message_id = $1`,
    [wamid],
  );

// ---- setup -----------------------------------------------------------------
beforeAll(async () => {
  db = await createTestDatabase();
}, 60_000);

beforeEach(() => {
  process.env.WHATSAPP_APP_SECRET = APP_SECRET;
  process.env.WHATSAPP_PHONE_NUMBER_ID = PHONE_NUMBER_ID;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  rpcCalls.length = 0;
  failNextRpc = null;
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---- tests -----------------------------------------------------------------
describe("signature", () => {
  it("1. valid Meta signature → accepted (200)", async () => {
    const res = await post(inbound(uniquePhone(), { id: "wamid.sig.ok", type: "text", text: { body: "hi" } }));
    expect(res.status).toBe(200);
    expect(rpcCalls).toEqual(["wa_ingest_inbound"]);
  });

  it("2. invalid signature → 401, nothing stored", async () => {
    const res = await post(inbound(uniquePhone(), { id: "wamid.sig.bad", type: "text", text: { body: "hi" } }), sign("different body"));
    expect(res.status).toBe(401);
    expect(rpcCalls).toEqual([]);
    expect(await count(`wa_messages where meta_message_id = 'wamid.sig.bad'`)).toBe(0);
  });

  it("3. missing signature → 401, nothing stored", async () => {
    const res = await post(inbound(uniquePhone(), { id: "wamid.sig.none", type: "text", text: { body: "hi" } }), null);
    expect(res.status).toBe(401);
    expect(rpcCalls).toEqual([]);
  });

  it("signature made with the wrong secret → 401", async () => {
    const payload = JSON.stringify(inbound(uniquePhone(), { id: "wamid.sig.wrong", type: "text", text: { body: "hi" } }));
    expect((await post(payload, sign(payload, "not-the-app-secret"))).status).toBe(401);
  });

  it("without WHATSAPP_APP_SECRET events are acknowledged but NEVER stored", async () => {
    delete process.env.WHATSAPP_APP_SECRET;
    const res = await post(inbound(uniquePhone(), { id: "wamid.unsigned", type: "text", text: { body: "hi" } }), null);
    expect(res.status).toBe(200);
    expect(rpcCalls).toEqual([]);
    expect(await count(`wa_messages where meta_message_id = 'wamid.unsigned'`)).toBe(0);
  });

  it("malformed JSON with a valid signature → 400", async () => {
    expect((await post("{not json")).status).toBe(400);
  });

  it("GET verification is unchanged", async () => {
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = "verify-me";
    const ok = GET(new NextRequest("https://x/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=12345"));
    expect(ok.status).toBe(200);
    expect(await ok.text()).toBe("12345");
    const bad = GET(new NextRequest("https://x/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=12345"));
    expect(bad.status).toBe(403);
  });
});

describe("incoming messages", () => {
  it("4–6. text → contact, conversation and message created", async () => {
    const phone = uniquePhone();
    expect((await post(inbound(phone, { id: "wamid.text.1", type: "text", text: { body: "Hi, I need NABH support" } }))).status).toBe(200);

    const contact = await one<{ phone: string; whatsapp_profile_name: string }>(`select * from contacts where phone = $1`, [phone]);
    expect(contact).toMatchObject({ phone, whatsapp_profile_name: "Ramesh Kumar" });

    const conv = await conversationFor(phone);
    expect(conv).toMatchObject({ unread_count: 1, last_message_preview: "Hi, I need NABH support", status: "new" });
    expect(new Date(conv!.last_inbound_at!).toISOString()).toBe(new Date(Number(ts()) * 1000).toISOString());

    const msg = await one<{ direction: string; message_type: string; body: string; status: string }>(
      `select direction, message_type, body, status from wa_messages where meta_message_id = 'wamid.text.1'`,
    );
    expect(msg).toEqual({ direction: "inbound", message_type: "text", body: "Hi, I need NABH support", status: "received" });
  });

  it("7–8. Meta retry of the same wamid → one message, unread counted once, still 200", async () => {
    const phone = uniquePhone();
    const event = inbound(phone, { id: "wamid.dup.1", type: "text", text: { body: "Hello" } });
    expect((await post(event)).status).toBe(200);
    expect((await post(event)).status).toBe(200);
    expect(await count(`wa_messages where meta_message_id = 'wamid.dup.1'`)).toBe(1);
    expect((await conversationFor(phone))!.unread_count).toBe(1);

    // The database function itself reports duplicate=false then duplicate=true.
    const rpc = rpcAs(db, "service_role");
    const args = { p_phone: phone, p_meta_message_id: "wamid.dup.2", p_message_type: "text", p_body: "x", p_media_id: null, p_profile_name: null, p_sent_at: null };
    expect(((await rpc("wa_ingest_inbound", args)).data as { duplicate: boolean }).duplicate).toBe(false);
    expect(((await rpc("wa_ingest_inbound", args)).data as { duplicate: boolean }).duplicate).toBe(true);
  });

  it("9. media → media_id and caption stored (not downloaded)", async () => {
    const phone = uniquePhone();
    await post(inbound(phone, { id: "wamid.img.1", type: "image", image: { id: "1234567890", mime_type: "image/jpeg", caption: "Our OT" } }));
    const msg = await one<{ message_type: string; media_id: string; body: string }>(
      `select message_type, media_id, body from wa_messages where meta_message_id = 'wamid.img.1'`,
    );
    expect(msg).toEqual({ message_type: "image", media_id: "1234567890", body: "Our OT" });
    expect((await conversationFor(phone))!.last_message_preview).toBe("📷 Our OT");
  });

  it.each([
    ["video", { video: { id: "V1" } }, "video"],
    ["audio", { audio: { id: "A1" } }, "audio"],
    ["document", { document: { id: "D1", filename: "licence.pdf" } }, "document"],
    ["sticker", { sticker: { id: "S1" } }, "sticker"],
    ["location", { location: { latitude: 13.08, longitude: 80.27 } }, "location"],
    ["interactive", { interactive: { type: "button_reply", button_reply: { id: "b", title: "Call me" } } }, "interactive"],
    ["button", { button: { text: "Know more", payload: "x" } }, "button"],
    ["contacts", { contacts: [{ name: { formatted_name: "Dr Priya" } }] }, "contacts"],
    ["reaction", { reaction: { message_id: "wamid.any", emoji: "👍" } }, "reaction"],
    ["unsupported", { errors: [{ code: 131051 }] }, "unsupported"],
  ])("%s → stored as %s", async (type, extra, storedAs) => {
    const phone = uniquePhone();
    const res = await post(inbound(phone, { id: `wamid.type.${type}`, type, ...extra }));
    expect(res.status).toBe(200);
    expect((await one<{ message_type: string }>(`select message_type from wa_messages where meta_message_id = $1`, [`wamid.type.${type}`]))!.message_type).toBe(storedAs);
  });

  it("10. unknown/unsupported Meta type → 200, stored as 'unsupported'", async () => {
    const res = await post(inbound(uniquePhone(), { id: "wamid.order.1", type: "order", order: { catalog_id: "c" } }));
    expect(res.status).toBe(200);
    expect((await one<{ message_type: string }>(`select message_type from wa_messages where meta_message_id = 'wamid.order.1'`))!.message_type).toBe("unsupported");
  });

  it("17. STOP → contact opted out, marketing off", async () => {
    const phone = uniquePhone();
    await post(inbound(phone, { id: "wamid.stop.1", type: "text", text: { body: "STOP" } }));
    const contact = await one<{ opted_out: boolean; marketing_opt_in: boolean; opted_out_at: string | null }>(`select * from contacts where phone = $1`, [phone]);
    expect(contact).toMatchObject({ opted_out: true, marketing_opt_in: false });
    expect(contact!.opted_out_at).not.toBeNull();
  });

  it("events for a different phone number ID are ignored", async () => {
    const payload = inbound(uniquePhone(), { id: "wamid.other.pnid", type: "text", text: { body: "x" } });
    (payload.entry[0]!.changes[0]!.value as { metadata: { phone_number_id: string } }).metadata.phone_number_id = "999";
    expect((await post(payload)).status).toBe(200);
    expect(rpcCalls).toEqual([]);
  });

  it("malformed sender phone → skipped with 200 (retrying can't fix it)", async () => {
    const res = await post(inbound("12", { id: "wamid.badphone", type: "text", text: { body: "x" } }));
    expect(res.status).toBe(200);
    expect(await count(`wa_messages where meta_message_id = 'wamid.badphone'`)).toBe(0);
  });

  it("database outage → 500 so Meta retries; the retry then stores it exactly once", async () => {
    const phone = uniquePhone();
    const event = inbound(phone, { id: "wamid.outage.1", type: "text", text: { body: "Are you there?" } });
    failNextRpc = "08006"; // connection failure
    expect((await post(event)).status).toBe(500);
    expect(await count(`wa_messages where meta_message_id = 'wamid.outage.1'`)).toBe(0);
    expect((await post(event)).status).toBe(200);
    expect(await count(`wa_messages where meta_message_id = 'wamid.outage.1'`)).toBe(1);
  });
});

describe("status events", () => {
  it("11–13. sent → delivered → read stored with timestamps", async () => {
    await createOutbound("wamid.out.1");
    await post(statusEvent("wamid.out.1", "sent", 10));
    expect((await messageStatus("wamid.out.1"))!.status).toBe("sent");
    await post(statusEvent("wamid.out.1", "delivered", 20));
    expect((await messageStatus("wamid.out.1"))!.status).toBe("delivered");
    await post(statusEvent("wamid.out.1", "read", 30));
    const m = (await messageStatus("wamid.out.1"))!;
    expect(m.status).toBe("read");
    expect(m.sent_at && m.delivered_at && m.read_at).toBeTruthy();
  });

  it("14. failed → error code and title stored", async () => {
    await createOutbound("wamid.out.fail");
    await post(statusEvent("wamid.out.fail", "sent", 10));
    const res = await post(statusEvent("wamid.out.fail", "failed", 20, [{ code: 131042, title: "Business eligibility payment issue" }]));
    expect(res.status).toBe(200);
    expect(await messageStatus("wamid.out.fail")).toMatchObject({ status: "failed", error_code: 131042, error_title: "Business eligibility payment issue" });
  });

  it("15. late 'delivered' after 'read' → stays read", async () => {
    await createOutbound("wamid.out.late");
    await post(statusEvent("wamid.out.late", "read", 30));
    await post(statusEvent("wamid.out.late", "delivered", 20));
    const m = (await messageStatus("wamid.out.late"))!;
    expect(m.status).toBe("read");
    expect(m.delivered_at).not.toBeNull(); // timestamp still recorded
  });

  it("16. unknown wamid (e.g. sent via send-template) → 200, no fake message created", async () => {
    const before = await count(`wa_messages`);
    const res = await post(statusEvent("wamid.sent.outside.inbox", "delivered", 5));
    expect(res.status).toBe(200);
    expect(rpcCalls).toEqual(["wa_apply_status"]);
    expect(await count(`wa_messages`)).toBe(before);
  });

  it("unknown status value (e.g. 'deleted') → 200, ignored", async () => {
    await createOutbound("wamid.out.weird");
    expect((await post(statusEvent("wamid.out.weird", "deleted", 5))).status).toBe(200);
    expect((await messageStatus("wamid.out.weird"))!.status).toBe("queued");
  });
});

describe("18. only service_role can call the webhook functions", () => {
  it.each(["anon", "authenticated"] as const)("%s gets permission denied", async (role) => {
    const ingest = await rpcAs(db, role)("wa_ingest_inbound", { p_phone: "919999999999", p_meta_message_id: "wamid.public", p_message_type: "text" });
    expect(ingest.error?.message).toMatch(/permission denied/);
    const status = await rpcAs(db, role)("wa_apply_status", { p_meta_message_id: "wamid.public", p_status: "read" });
    expect(status.error?.message).toMatch(/permission denied/);
    expect(await count(`wa_messages where meta_message_id = 'wamid.public'`)).toBe(0);
  });
});
