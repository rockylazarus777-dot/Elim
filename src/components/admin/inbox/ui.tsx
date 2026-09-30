import { CONVERSATION_STATUS_LABELS, type ConversationStatus, type InboxLabel } from "@/lib/inbox/model";

const STATUS_STYLES: Record<ConversationStatus, string> = {
  new: "bg-sky-50 text-sky-800 ring-sky-200",
  open: "bg-brand-50 text-brand-800 ring-brand-200",
  follow_up: "bg-amber-50 text-amber-800 ring-amber-200",
  waiting: "bg-ink-50 text-ink-700 ring-ink-200",
  appointment: "bg-plum-50 text-plum-700 ring-plum-200",
  closed: "bg-white text-ink-500 ring-ink-200",
};

export function StatusBadge({ status }: { status: ConversationStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      {CONVERSATION_STATUS_LABELS[status]}
    </span>
  );
}

export function LabelChip({ label, onRemove }: { label: InboxLabel; onRemove?: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-ink-700 ring-1 ring-inset ring-ink-200">
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
      <span className="truncate">{label.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-1 ml-0.5 rounded-full px-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          aria-label={`Remove label ${label.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

/** Initials avatar (no customer photos are fetched from WhatsApp). */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials =
    name
      .split(/\s+/)
      .filter((word) => /^[A-Za-z0-9\u0080-￿]/.test(word) && !word.startsWith("+"))
      .slice(0, 2)
      .map((word) => Array.from(word)[0]!.toUpperCase())
      .join("") || "#";
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg" };
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-800 ${sizes[size]}`}>
      {initials}
    </span>
  );
}

export function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 text-[11px] font-bold text-white">
      <span className="sr-only">{count} unread</span>
      <span aria-hidden="true">{count > 99 ? "99+" : count}</span>
    </span>
  );
}
