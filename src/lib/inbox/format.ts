/**
 * Display formatting for the Inbox (times, day separators, message status).
 * Pure functions with an injectable `now`, so they're unit-tested.
 */
import type { InboxMessage } from "@/lib/inbox/model";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** "14:05" */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

/** Conversation list: today → time, yesterday → "Yesterday", this week → weekday, else date. */
export function formatListTime(iso: string | null, now: number = Date.now()): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  const days = Math.round((startOfDay(now) - startOfDay(t)) / DAY_MS);
  if (days <= 0) return formatClock(iso);
  if (days === 1) return "Yesterday";
  if (days < 7) return new Date(t).toLocaleDateString("en-IN", { weekday: "short" });
  return new Date(t).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}

/** Chat day separator: "Today", "Yesterday", "30 September 2026". */
export function formatDayLabel(iso: string, now: number = Date.now()): string {
  const days = Math.round((startOfDay(now) - startOfDay(Date.parse(iso))) / DAY_MS);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Full date + time for tooltips and the details panel. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

/** When a message happened: the customer's send time for inbound, our send time for outbound. */
export function messageTime(message: Pick<InboxMessage, "direction" | "sent_at" | "created_at">): string {
  return message.direction === "inbound" ? (message.sent_at ?? message.created_at) : message.created_at;
}

/** True when a day separator belongs before `message` (first message, or a new calendar day). */
export function startsNewDay(message: InboxMessage, previous: InboxMessage | undefined): boolean {
  if (!previous) return true;
  return startOfDay(Date.parse(messageTime(message))) !== startOfDay(Date.parse(messageTime(previous)));
}

/** "23h 10m left" / "45m left" for the reply-window hint. */
export function formatRemaining(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
}

export type TickState = "clock" | "single" | "double" | "double-read" | "failed" | null;

/** WhatsApp-style ticks, straight from the status Meta reported (never guessed). */
export function tickState(message: Pick<InboxMessage, "direction" | "status">): TickState {
  if (message.direction !== "outbound") return null;
  switch (message.status) {
    case "queued":
      return "clock";
    case "sent":
      return "single";
    case "delivered":
      return "double";
    case "read":
      return "double-read";
    case "failed":
      return "failed";
    default:
      return null;
  }
}

export const TICK_LABELS: Record<Exclude<TickState, null>, string> = {
  clock: "Sending",
  single: "Sent",
  double: "Delivered",
  "double-read": "Read",
  failed: "Not delivered",
};
