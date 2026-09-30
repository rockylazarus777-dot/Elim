/**
 * Browser data access for the EMC Inbox. Every call runs as the signed-in
 * staff member (anon key + their session), so Row Level Security and the
 * database guard triggers decide what they can read and change — and the
 * audit log records who did it. Nothing here can insert WhatsApp messages
 * (staff have no INSERT grant on wa_messages); sending goes through
 * /api/admin/whatsapp/send.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CONVERSATION_SELECT,
  type ConversationStatus,
  type InboxContact,
  type InboxConversation,
  type InboxMessage,
  type InboxNote,
  MESSAGE_COLUMNS,
} from "@/lib/inbox/model";

type DbError = { code?: string; message?: string } | null;

// Messages raised by our own guard triggers are written for staff; show them as-is.
const FRIENDLY_DB_MESSAGES = [
  /^Only admins and BDMs can assign conversations to other staff\.$/,
  /^Conversations can only be assigned to active staff\.$/,
  /^Staff can only mark a conversation as read\.$/,
  /^Not an active staff member\.$/,
  /^System labels cannot be deleted\.$/,
];

export class InboxError extends Error {}

function fail(error: DbError, fallback: string): never {
  const message = error?.message ?? "";
  if (FRIENDLY_DB_MESSAGES.some((re) => re.test(message))) throw new InboxError(message);
  if (error?.code === "42501") throw new InboxError("You don't have permission to do that.");
  if (error?.code === "23514" || error?.code === "22P02") throw new InboxError("Please check the details and try again.");
  throw new InboxError(fallback);
}

export type ConversationQuery = {
  status: ConversationStatus | "all";
  unreadOnly: boolean;
  /** "all" | "me" | "unassigned" | a staff id */
  assigned: string;
};

/** Most recent conversations first; status / unread / assignment filtered in the database. */
export async function fetchConversations(sb: SupabaseClient, query: ConversationQuery, meId: string): Promise<InboxConversation[]> {
  let request = sb.from("wa_conversations").select(CONVERSATION_SELECT);
  if (query.status !== "all") request = request.eq("status", query.status);
  if (query.unreadOnly) request = request.gt("unread_count", 0);
  if (query.assigned === "me") request = request.eq("assigned_staff_id", meId);
  else if (query.assigned === "unassigned") request = request.is("assigned_staff_id", null);
  else if (query.assigned !== "all") request = request.eq("assigned_staff_id", query.assigned);

  const { data, error } = await request.order("last_message_at", { ascending: false, nullsFirst: false }).limit(300);
  if (error) fail(error, "We couldn't load conversations.");
  return (data ?? []) as unknown as InboxConversation[];
}

/** One conversation (null if it doesn't exist or RLS hides it). */
export async function fetchConversation(sb: SupabaseClient, conversationId: string): Promise<InboxConversation | null> {
  const { data, error } = await sb.from("wa_conversations").select(CONVERSATION_SELECT).eq("id", conversationId).maybeSingle();
  if (error) fail(error, "We couldn't load this conversation.");
  return (data as unknown as InboxConversation | null) ?? null;
}

/** IDs of conversations whose message text contains `term` (server-side, trigram-indexed). */
export async function searchMessageConversationIds(sb: SupabaseClient, term: string): Promise<Set<string>> {
  const escaped = term.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data, error } = await sb.from("wa_messages").select("conversation_id").ilike("body", `%${escaped}%`).limit(200);
  if (error) fail(error, "Search failed.");
  return new Set((data ?? []).map((row) => (row as { conversation_id: string }).conversation_id));
}

/** The latest 300 messages of one conversation, oldest first. */
export async function fetchMessages(sb: SupabaseClient, conversationId: string): Promise<InboxMessage[]> {
  const { data, error } = await sb
    .from("wa_messages")
    .select(MESSAGE_COLUMNS)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) fail(error, "We couldn't load messages.");
  return ((data ?? []) as unknown as InboxMessage[]).reverse();
}

export async function updateConversation(
  sb: SupabaseClient,
  conversationId: string,
  patch: Partial<{ status: ConversationStatus; assigned_staff_id: string | null; unread_count: 0 }>,
): Promise<void> {
  const { error } = await sb.from("wa_conversations").update(patch).eq("id", conversationId);
  if (error) fail(error, "We couldn't update this conversation.");
}

export async function addConversationLabel(sb: SupabaseClient, conversationId: string, labelId: string, meId: string) {
  const { error } = await sb.from("wa_conversation_labels").insert({ conversation_id: conversationId, label_id: labelId, added_by: meId });
  if (error && error.code !== "23505") fail(error, "We couldn't add the label."); // 23505: already added
}

export async function removeConversationLabel(sb: SupabaseClient, conversationId: string, labelId: string) {
  const { error } = await sb.from("wa_conversation_labels").delete().eq("conversation_id", conversationId).eq("label_id", labelId);
  if (error) fail(error, "We couldn't remove the label.");
}

export type ContactPatch = Partial<
  Pick<InboxContact, "name" | "email" | "organization" | "city" | "requirement" | "notes" | "marketing_opt_in" | "opt_in_at" | "opt_in_source">
>;

/** Only columns staff are granted UPDATE on (phone and WhatsApp name come from the webhook). */
export async function updateContact(sb: SupabaseClient, contactId: string, patch: ContactPatch): Promise<void> {
  const { error } = await sb.from("contacts").update(patch).eq("id", contactId);
  if (error) fail(error, "We couldn't save the customer details.");
}

export async function fetchNotes(sb: SupabaseClient, conversationId: string): Promise<InboxNote[]> {
  const { data, error } = await sb
    .from("wa_internal_notes")
    .select("id, author_id, body, created_at, updated_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) fail(error, "We couldn't load notes.");
  return (data ?? []) as InboxNote[];
}

/** Internal notes are stored separately from messages and can never be sent to WhatsApp. */
export async function addNote(sb: SupabaseClient, conversationId: string, meId: string, body: string): Promise<void> {
  const { error } = await sb.from("wa_internal_notes").insert({ conversation_id: conversationId, author_id: meId, body });
  if (error) fail(error, "We couldn't save the note.");
}

export async function deleteNote(sb: SupabaseClient, noteId: string): Promise<void> {
  const { error } = await sb.from("wa_internal_notes").delete().eq("id", noteId);
  if (error) fail(error, "We couldn't delete the note.");
}

export type SendResult =
  | { ok: true; row: InboxMessage }
  | { ok: false; code: string; message: string; row: InboxMessage | null; details?: { metaCode: number | null; metaTitle: string | null } };

/** Sends a WhatsApp reply through the server (never directly to Meta). */
export async function sendReply(conversationId: string, body: string): Promise<SendResult> {
  try {
    const response = await fetch("/api/admin/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, body }),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (response.ok && data.ok) return { ok: true, row: data.row as InboxMessage };
    return {
      ok: false,
      code: typeof data.code === "string" ? data.code : "send_failed",
      message: typeof data.message === "string" ? data.message : "We couldn't send this message. Please try again.",
      row: (data.row as InboxMessage | null) ?? null,
      details: data.details as { metaCode: number | null; metaTitle: string | null } | undefined,
    };
  } catch {
    return { ok: false, code: "network", message: "You appear to be offline. Please check your connection and try again.", row: null };
  }
}
