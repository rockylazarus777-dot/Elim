/**
 * Send route tests. Meta is simulated by stubbing `fetch` — no real WhatsApp
 * message is ever sent. Auth and Supabase are replaced by recording fakes so
 * we can assert exactly what the route reads, writes and sends.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const STAFF = { id: "11111111-1111-4111-8111-111111111111", full_name: "Arun", email: "arun@example.com", role: "telecaller", is_active: true };
const CONVERSATION_ID = "22222222-2222-4222-8222-222222222222";
const CONTACT_ID = "33333333-3333-4333-8333-333333333333";

// ---- auth: requireStaff() ----------------------------------------------------------------
type AuthMode = "active" | "unauthenticated" | "denied";
let authMode: AuthMode = "active";
let staffRole = "telecaller";
let visibleConversation: Record<string, unknown> | null = null;
const userQueries: { table: string; filters: unknown[] }[] = [];

vi.mock("@/lib/auth/staff", () => ({
  requireStaff: async () => {
    if (authMode === "unauthenticated") return { ok: false, response: NextResponse.json({ message: "Please sign in." }, { status: 401 }) };
    if (authMode === "denied") return { ok: false, response: NextResponse.json({ message: "Your account is not authorized for the EMC Inbox." }, { status: 403 }) };
    const filters: unknown[] = [];
    const query = {
      select: () => query,
      eq: (...args: unknown[]) => (filters.push(args), query),
      maybeSingle: async () => ({ data: visibleConversation, error: null }),
    };
    return {
      ok: true,
      access: { status: "active", email: STAFF.email, profile: { ...STAFF, role: staffRole } },
      supabase: {
        from: (table: string) => {
          userQueries.push({ table, filters });
          return query;
        },
      },
    };
  },
}));

// ---- service-role client ---------------------------------------------------------------
type Op = { table: string; op: "select" | "insert" | "update"; payload: Record<string, unknown> | null; filters: unknown[][] };
const adminOps: Op[] = [];
let recentSends = 0;

vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: () => true,
  createSupabaseAdminClient: () => ({
    from: (table: string) => {
      const state: Op = { table, op: "select", payload: null, filters: [] };
      const resolve = async () => {
        adminOps.push(state);
        if (state.op === "select") return { count: recentSends, error: null };
        return { data: { id: "msg-1", ...(state.payload ?? {}) }, error: null };
      };
      const builder = {
        select: () => builder,
        insert: (p: Record<string, unknown>) => ((state.op = "insert"), (state.payload = p), builder),
        update: (p: Record<string, unknown>) => ((state.op = "update"), (state.payload = p), builder),
        eq: (...a: unknown[]) => (state.filters.push(["eq", ...a]), builder),
        gte: (...a: unknown[]) => (state.filters.push(["gte", ...a]), builder),
        single: resolve,
        maybeSingle: resolve,
        then: (ok: (v: unknown) => unknown, err: (e: unknown) => unknown) => resolve().then(ok, err),
      };
      return builder;
    },
  }),
}));

// ---- Meta Graph API (fetch) --------------------------------------------------------------
type MetaCall = { url: string; auth: string | null; body: Record<string, unknown> };
const metaCalls: MetaCall[] = [];
let metaResponse: () => Promise<Response> = async () => new Response(JSON.stringify({ messages: [{ id: "wamid.SENT1" }] }), { status: 200 });

const { POST } = await import("@/app/api/admin/whatsapp/send/route");

function send(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest("https://www.emcforyou.com/api/admin/whatsapp/send", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
      headers: { "content-type": "application/json", origin: "https://www.emcforyou.com", ...headers },
    }),
  );
}
const inserts = () => adminOps.filter((o) => o.op === "insert");
const updates = () => adminOps.filter((o) => o.op === "update");

beforeEach(() => {
  process.env.WHATSAPP_ACCESS_TOKEN = "test-access-token-SECRET";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "1397259290130216";
  authMode = "active";
  staffRole = "telecaller";
  recentSends = 0;
  visibleConversation = {
    id: CONVERSATION_ID,
    contact_id: CONTACT_ID,
    last_inbound_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    contact: { phone: "919840922491" },
  };
  adminOps.length = 0;
  metaCalls.length = 0;
  userQueries.length = 0;
  metaResponse = async () => new Response(JSON.stringify({ messages: [{ id: "wamid.SENT1" }] }), { status: 200 });
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    metaCalls.push({ url, auth: new Headers(init.headers).get("authorization"), body: JSON.parse(String(init.body)) });
    return metaResponse();
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("who can send", () => {
  it("cross-site requests are rejected before anything else", async () => {
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" }, { origin: "https://evil.example" });
    expect(res.status).toBe(403);
    expect(metaCalls).toHaveLength(0);
  });

  it("non-JSON (form) posts are rejected", async () => {
    const res = await send("conversationId=x", { "content-type": "application/x-www-form-urlencoded" });
    expect(res.status).toBe(403);
  });

  it("signed out → 401, nothing sent or stored", async () => {
    authMode = "unauthenticated";
    expect((await send({ conversationId: CONVERSATION_ID, body: "hi" })).status).toBe(401);
    expect(metaCalls).toHaveLength(0);
    expect(adminOps).toHaveLength(0);
  });

  it("no staff profile / inactive → 403, nothing sent or stored", async () => {
    authMode = "denied";
    expect((await send({ conversationId: CONVERSATION_ID, body: "hi" })).status).toBe(403);
    expect(metaCalls).toHaveLength(0);
    expect(adminOps).toHaveLength(0);
  });
});

describe("validation and authorization of the conversation", () => {
  it.each([
    [{ conversationId: "not-a-uuid", body: "hi" }],
    [{ conversationId: CONVERSATION_ID, body: "   " }],
    [{ conversationId: CONVERSATION_ID, body: "x".repeat(4097) }],
    [{ body: "hi" }],
  ])("invalid input %# → 400", async (payload) => {
    expect((await send(payload)).status).toBe(400);
    expect(metaCalls).toHaveLength(0);
  });

  it("conversation not visible to this staff member (RLS) → 404, nothing sent", async () => {
    visibleConversation = null;
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(404);
    expect(metaCalls).toHaveLength(0);
    expect(inserts()).toHaveLength(0);
  });

  it("the conversation is looked up with the staff member's own session, by the requested id", async () => {
    await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(userQueries[0]).toEqual({ table: "wa_conversations", filters: [["id", CONVERSATION_ID]] });
  });
});

describe("24-hour window", () => {
  it("customer wrote 25h ago → 409 window_closed, nothing sent or stored", async () => {
    visibleConversation!.last_inbound_at = new Date(Date.now() - 25 * 3600_000).toISOString();
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe("window_closed");
    expect(metaCalls).toHaveLength(0);
    expect(inserts()).toHaveLength(0);
  });

  it("customer never wrote → 409", async () => {
    visibleConversation!.last_inbound_at = null;
    expect((await send({ conversationId: CONVERSATION_ID, body: "hi" })).status).toBe(409);
  });

  it("Meta itself reports the window closed (131047) → 409, row marked failed", async () => {
    metaResponse = async () => new Response(JSON.stringify({ error: { code: 131047, message: "Re-engagement message" } }), { status: 400 });
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(409);
    expect(updates()[0]!.payload).toMatchObject({ status: "failed", error_code: 131047 });
  });
});

describe("rate limit", () => {
  it("20 sends in the last minute → 429, nothing sent", async () => {
    recentSends = 20;
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(429);
    expect(metaCalls).toHaveLength(0);
    const countQuery = adminOps.find((o) => o.op === "select")!;
    expect(countQuery.filters).toContainEqual(["eq", "created_by", STAFF.id]);
  });
});

describe("successful send", () => {
  it("records the message, sends it via Meta server-side, stores the wamid", async () => {
    const res = await send({ conversationId: CONVERSATION_ID, body: "  Sure, our team can help with NABH.  " });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.row).toMatchObject({ meta_message_id: "wamid.SENT1" });

    // 1. queued row — staff id from the verified session, never from the request
    expect(inserts()).toHaveLength(1);
    expect(inserts()[0]!.payload).toEqual({
      conversation_id: CONVERSATION_ID,
      contact_id: CONTACT_ID,
      direction: "outbound",
      message_type: "text",
      body: "Sure, our team can help with NABH.",
      status: "queued",
      created_by: STAFF.id,
    });

    // 2. exactly one Graph API call, token only in the server's Authorization header
    expect(metaCalls).toHaveLength(1);
    expect(metaCalls[0]!.url).toBe("https://graph.facebook.com/v26.0/1397259290130216/messages");
    expect(metaCalls[0]!.auth).toBe("Bearer test-access-token-SECRET");
    expect(metaCalls[0]!.body).toEqual({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "919840922491",
      type: "text",
      text: { preview_url: false, body: "Sure, our team can help with NABH." },
    });

    // 3. wamid saved so the webhook can apply sent/delivered/read/failed
    expect(updates()).toHaveLength(1);
    expect(updates()[0]!.payload).toEqual({ meta_message_id: "wamid.SENT1" });
    expect(updates()[0]!.filters).toContainEqual(["eq", "id", "msg-1"]);

    // 4. the access token never appears in the response
    expect(JSON.stringify(json)).not.toContain("test-access-token-SECRET");
  });

  it("client-supplied identity/role fields are ignored", async () => {
    await send({ conversationId: CONVERSATION_ID, body: "hi", created_by: "someone-else", role: "admin", to: "910000000000" });
    expect(inserts()[0]!.payload!.created_by).toBe(STAFF.id);
    expect(metaCalls[0]!.body.to).toBe("919840922491");
  });
});

describe("Meta failures", () => {
  it("rejection → 502, row marked failed; staff see no technical details", async () => {
    metaResponse = async () => new Response(JSON.stringify({ error: { code: 131026, message: "Message undeliverable" } }), { status: 400 });
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.code).toBe("send_failed");
    expect(json.details).toBeUndefined();
    expect(updates()[0]!.payload).toMatchObject({ status: "failed", error_code: 131026, error_title: "Message undeliverable" });
    expect(updates()[0]!.filters).toContainEqual(["eq", "status", "queued"]);
  });

  it("admins get Meta's code and message", async () => {
    staffRole = "admin";
    metaResponse = async () => new Response(JSON.stringify({ error: { code: 131026, message: "Message undeliverable" } }), { status: 400 });
    const json = await (await send({ conversationId: CONVERSATION_ID, body: "hi" })).json();
    expect(json.details).toEqual({ metaCode: 131026, metaTitle: "Message undeliverable" });
  });

  it("timeout → 502 'timeout', clearly flagged as possibly sent", async () => {
    metaResponse = async () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      throw error;
    };
    const res = await send({ conversationId: CONVERSATION_ID, body: "hi" });
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe("timeout");
    expect(String(updates()[0]!.payload!.error_title)).toMatch(/may or may not have been sent/);
  });
});
