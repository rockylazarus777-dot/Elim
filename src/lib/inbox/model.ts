/**
 * Shared EMC Inbox definitions — used by the browser UI and the server send
 * route alike, so both apply the same rules. Pure (no I/O).
 *
 * Statuses, message types and columns mirror the Phase 1 migration
 * (supabase/migrations/20260930120000_whatsapp_inbox_phase1.sql).
 */
import type { StaffRole } from "@/lib/auth/access";

// ---- Conversation status ----------------------------------------------------

/** Exactly the values allowed by the wa_conversations.status CHECK constraint. */
export const CONVERSATION_STATUSES = ["new", "open", "follow_up", "waiting", "appointment", "closed"] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, string> = {
  new: "New",
  open: "Open",
  follow_up: "Follow-up",
  waiting: "Waiting for customer",
  appointment: "Appointment",
  closed: "Closed",
};

// ---- Meta's 24-hour customer service window ---------------------------------

export const CUSTOMER_SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Stop a minute early so a reply typed at 23:59:59 isn't rejected by Meta in transit. */
const WINDOW_SAFETY_MARGIN_MS = 60 * 1000;

/**
 * Free-form replies are only allowed within 24 hours of the customer's last
 * message. No inbound message at all → closed (a template is required).
 */
export function isWithinServiceWindow(lastInboundAt: string | null, now: number = Date.now()): boolean {
  if (!lastInboundAt) return false;
  const last = Date.parse(lastInboundAt);
  if (Number.isNaN(last)) return false;
  return now - last < CUSTOMER_SERVICE_WINDOW_MS - WINDOW_SAFETY_MARGIN_MS;
}

/** Milliseconds left in the window (0 when closed). */
export function serviceWindowRemainingMs(lastInboundAt: string | null, now: number = Date.now()): number {
  if (!isWithinServiceWindow(lastInboundAt, now)) return 0;
  return CUSTOMER_SERVICE_WINDOW_MS - WINDOW_SAFETY_MARGIN_MS - (now - Date.parse(lastInboundAt!));
}

// ---- Row types (columns selected by the Inbox) --------------------------------

export type InboxContact = {
  id: string;
  phone: string;
  name: string | null;
  whatsapp_profile_name: string | null;
  email: string | null;
  organization: string | null;
  city: string | null;
  requirement: string | null;
  notes: string | null;
  marketing_opt_in: boolean;
  opt_in_at: string | null;
  opt_in_source: string | null;
  opted_out: boolean;
  opted_out_at: string | null;
  created_at: string;
};

export type InboxConversation = {
  id: string;
  status: ConversationStatus;
  assigned_staff_id: string | null;
  unread_count: number;
  last_message_preview: string | null;
  last_message_at: string | null;
  last_inbound_at: string | null;
  created_at: string;
  contact: InboxContact;
  labels: { label_id: string }[];
};

export type MessageStatus = "received" | "queued" | "sent" | "delivered" | "read" | "failed";

export type InboxMessage = {
  id: string;
  direction: "inbound" | "outbound";
  message_type: string;
  body: string | null;
  template_name: string | null;
  media_id: string | null;
  status: MessageStatus;
  error_code: number | null;
  error_title: string | null;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
};

export type InboxLabel = { id: string; name: string; color: string; emoji: string | null; is_system: boolean };

export type InboxStaffMember = { id: string; full_name: string; role: StaffRole; is_active: boolean };

export type InboxQuickReply = {
  id: string;
  shortcut: string;
  title: string;
  body: string;
  category: string | null;
  scope: "team" | "personal";
};

export type InboxNote = { id: string; author_id: string; body: string; created_at: string; updated_at: string };

/** Columns the Inbox reads — one place, so the UI and tests agree. */
export const CONTACT_COLUMNS =
  "id, phone, name, whatsapp_profile_name, email, organization, city, requirement, notes, marketing_opt_in, opt_in_at, opt_in_source, opted_out, opted_out_at, created_at";
export const CONVERSATION_SELECT = `id, status, assigned_staff_id, unread_count, last_message_preview, last_message_at, last_inbound_at, created_at, contact:contacts!inner(${CONTACT_COLUMNS}), labels:wa_conversation_labels(label_id)`;
export const MESSAGE_COLUMNS =
  "id, direction, message_type, body, template_name, media_id, status, error_code, error_title, created_by, created_at, sent_at, delivered_at, read_at, failed_at";

// ---- Display helpers ----------------------------------------------------------

/** Best name for a contact: saved name → WhatsApp profile name → phone. */
export function contactDisplayName(contact: Pick<InboxContact, "name" | "whatsapp_profile_name" | "phone">): string {
  return contact.name?.trim() || contact.whatsapp_profile_name?.trim() || formatPhone(contact.phone);
}

/** 919840922491 → "+91 98409 22491"; other countries → "+<digits>". */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}
