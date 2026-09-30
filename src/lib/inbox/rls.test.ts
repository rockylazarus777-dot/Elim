/**
 * The Inbox UI writes straight to Supabase as the signed-in staff member.
 * These tests run the SAME writes against the real migration (PGlite, as the
 * `authenticated` role with a JWT `sub`) to prove RLS + guard triggers allow
 * exactly what the UI offers — and nothing more.
 */
import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDatabase, rpcAs } from "@/test/pglite-supabase";

const ADMIN = "00000000-0000-4000-8000-00000000000a";
const BDM = "00000000-0000-4000-8000-00000000000b";
const TELE = "00000000-0000-4000-8000-00000000000c";
const PRO = "00000000-0000-4000-8000-00000000000d";
const INACTIVE = "00000000-0000-4000-8000-00000000000e";
const OUTSIDER = "00000000-0000-4000-8000-00000000000f";

let db: PGlite;
let conversationId: string;
let contactId: string;
let nabhLabel: string;

async function asUser<T = Record<string, unknown>>(uid: string, sql: string, params: unknown[] = []) {
  await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ sub: uid, role: "authenticated" })]);
  await db.exec("set role authenticated");
  try {
    return await db.query<T>(sql, params);
  } finally {
    await db.exec("reset role");
    await db.query(`select set_config('request.jwt.claims', '', false)`);
  }
}
const expectDenied = (p: Promise<unknown>, pattern: RegExp) => expect(p).rejects.toThrow(pattern);

beforeAll(async () => {
  db = await createTestDatabase();
  await db.exec(`insert into auth.users values ('${ADMIN}'),('${BDM}'),('${TELE}'),('${PRO}'),('${INACTIVE}'),('${OUTSIDER}')`);
  await db.exec(`insert into staff_profiles (id, full_name, email, role, is_active) values
    ('${ADMIN}','Admin','admin@emc.test','admin',true), ('${BDM}','Priya','priya@emc.test','bdm',true),
    ('${TELE}','Arun','arun@emc.test','telecaller',true), ('${PRO}','Kumar','kumar@emc.test','pro',true),
    ('${INACTIVE}','Old','old@emc.test','staff',false)`);
  const { data } = await rpcAs(db, "service_role")("wa_ingest_inbound", {
    p_phone: "919840922491",
    p_meta_message_id: "wamid.rls.1",
    p_message_type: "text",
    p_body: "Hi, I need NABH support",
    p_media_id: null,
    p_profile_name: "Ramesh Kumar",
    p_sent_at: null,
  });
  conversationId = (data as { conversation_id: string }).conversation_id;
  contactId = (data as { contact_id: string }).contact_id;
  nabhLabel = (await db.query<{ id: string }>(`select id from wa_labels where name = 'NABH'`)).rows[0]!.id;
}, 60_000);

describe("reading the Inbox", () => {
  it("active staff see conversations, messages, labels and quick replies", async () => {
    expect((await asUser(TELE, `select id from wa_conversations`)).rows).toHaveLength(1);
    expect((await asUser(TELE, `select id from wa_messages where conversation_id = $1`, [conversationId])).rows).toHaveLength(1);
    expect((await asUser(TELE, `select id from wa_labels`)).rows).toHaveLength(7);
    expect((await asUser(TELE, `select id from wa_quick_replies`)).rows.length).toBeGreaterThanOrEqual(4);
  });

  it("inactive staff and outsiders see nothing", async () => {
    for (const uid of [INACTIVE, OUTSIDER]) {
      expect((await asUser(uid, `select id from wa_conversations`)).rows).toHaveLength(0);
      expect((await asUser(uid, `select id from wa_messages`)).rows).toHaveLength(0);
      expect((await asUser(uid, `select id from contacts`)).rows).toHaveLength(0);
    }
  });
});

describe("conversation actions", () => {
  it("any active staff can change status and mark read", async () => {
    await asUser(PRO, `update wa_conversations set status = 'follow_up' where id = $1`, [conversationId]);
    await asUser(PRO, `update wa_conversations set unread_count = 0 where id = $1`, [conversationId]);
    const row = (await db.query<{ status: string; unread_count: number }>(`select status, unread_count from wa_conversations where id = $1`, [conversationId])).rows[0]!;
    expect(row).toEqual({ status: "follow_up", unread_count: 0 });
  });

  it("statuses outside the six allowed values are rejected", async () => {
    await expectDenied(asUser(TELE, `update wa_conversations set status = 'archived' where id = $1`, [conversationId]), /check constraint/);
  });

  it("telecaller: assign to me / unassign me only", async () => {
    await expectDenied(asUser(TELE, `update wa_conversations set assigned_staff_id = $1 where id = $2`, [PRO, conversationId]), /Only admins and BDMs/);
    await asUser(TELE, `update wa_conversations set assigned_staff_id = $1 where id = $2`, [TELE, conversationId]);
    await expectDenied(asUser(PRO, `update wa_conversations set assigned_staff_id = null where id = $1`, [conversationId]), /Only admins and BDMs/);
    await asUser(TELE, `update wa_conversations set assigned_staff_id = null where id = $1`, [conversationId]);
  });

  it("BDM and admin can assign to anyone active", async () => {
    await asUser(BDM, `update wa_conversations set assigned_staff_id = $1 where id = $2`, [PRO, conversationId]);
    await asUser(ADMIN, `update wa_conversations set assigned_staff_id = $1 where id = $2`, [TELE, conversationId]);
    await expectDenied(asUser(ADMIN, `update wa_conversations set assigned_staff_id = $1 where id = $2`, [INACTIVE, conversationId]), /active staff/);
  });

  it("staff cannot touch message-derived fields (preview, last inbound time)", async () => {
    await expectDenied(asUser(TELE, `update wa_conversations set last_inbound_at = now() where id = $1`, [conversationId]), /permission denied/);
  });

  it("every action is audited with the real staff member", async () => {
    const { rows } = await db.query<{ n: number }>(
      `select count(*)::int as n from audit_log where entity_id = $1 and actor_id in ($2, $3, $4, $5)`,
      [conversationId, TELE, PRO, BDM, ADMIN],
    );
    expect(rows[0]!.n).toBeGreaterThanOrEqual(5);
  });
});

describe("labels", () => {
  it("staff add and remove labels as themselves", async () => {
    await asUser(TELE, `insert into wa_conversation_labels (conversation_id, label_id, added_by) values ($1, $2, $3)`, [conversationId, nabhLabel, TELE]);
    await expectDenied(
      asUser(TELE, `insert into wa_conversation_labels (conversation_id, label_id, added_by) select $1, id, $2 from wa_labels where name = 'CEA'`, [conversationId, ADMIN]),
      /row-level security/,
    );
    const removed = await asUser(PRO, `delete from wa_conversation_labels where conversation_id = $1 and label_id = $2`, [conversationId, nabhLabel]);
    expect(removed.affectedRows).toBe(1);
  });
});

describe("contact details and consent", () => {
  it("staff edit contact fields; the phone number is locked", async () => {
    await asUser(TELE, `update contacts set name = 'Ramesh Kumar', organization = 'ABC Hospital', city = 'Chennai', requirement = 'NABH' where id = $1`, [contactId]);
    await expectDenied(asUser(TELE, `update contacts set phone = '911111111111' where id = $1`, [contactId]), /permission denied/);
    await expectDenied(asUser(TELE, `update contacts set whatsapp_profile_name = 'x' where id = $1`, [contactId]), /permission denied/);
  });

  it("recording consent needs a source; it is audited", async () => {
    await expectDenied(asUser(TELE, `update contacts set marketing_opt_in = true, opt_in_at = now() where id = $1`, [contactId]), /contacts_opt_in_recorded/);
    await asUser(TELE, `update contacts set marketing_opt_in = true, opt_in_at = now(), opt_in_source = 'Signed form at camp' where id = $1`, [contactId]);
    const { rows } = await db.query<{ n: number }>(`select count(*)::int as n from audit_log where action = 'contact.consent_changed' and actor_id = $1`, [TELE]);
    expect(rows[0]!.n).toBe(1);
  });
});

describe("internal notes", () => {
  it("notes are written as yourself, readable by staff, never messages", async () => {
    await asUser(TELE, `insert into wa_internal_notes (conversation_id, author_id, body) values ($1, $2, 'Call tomorrow morning')`, [conversationId, TELE]);
    await expectDenied(
      asUser(TELE, `insert into wa_internal_notes (conversation_id, author_id, body) values ($1, $2, 'forged')`, [conversationId, PRO]),
      /row-level security/,
    );
    expect((await asUser(BDM, `select body from wa_internal_notes where conversation_id = $1`, [conversationId])).rows).toHaveLength(1);
    const messages = await db.query(`select 1 from wa_messages where body = 'Call tomorrow morning'`);
    expect(messages.rows).toHaveLength(0);
  });

  it("only the author (or an admin) can delete a note", async () => {
    expect((await asUser(PRO, `delete from wa_internal_notes where conversation_id = $1`, [conversationId])).affectedRows).toBe(0);
    expect((await asUser(TELE, `delete from wa_internal_notes where conversation_id = $1`, [conversationId])).affectedRows).toBe(1);
  });
});

describe("messages cannot be faked from the browser", () => {
  it("staff cannot insert or change WhatsApp messages", async () => {
    await expectDenied(
      asUser(ADMIN, `insert into wa_messages (conversation_id, contact_id, direction, message_type, body, status) values ($1, $2, 'outbound', 'text', 'fake', 'sent')`, [conversationId, contactId]),
      /permission denied/,
    );
    await expectDenied(asUser(ADMIN, `update wa_messages set status = 'read'`), /permission denied/);
  });
});
