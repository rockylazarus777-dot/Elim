"use client";

import {
  CONVERSATION_STATUS_LABELS,
  CONVERSATION_STATUSES,
  contactDisplayName,
  formatPhone,
  type InboxConversation,
  type InboxLabel,
  type InboxStaffMember,
} from "@/lib/inbox/model";
import type { ConversationQuery } from "@/lib/inbox/data";
import { formatListTime } from "@/lib/inbox/format";
import { SearchIcon } from "@/components/admin/inbox/icons";
import { Avatar, LabelChip, StatusBadge, UnreadBadge } from "@/components/admin/inbox/ui";

export type ListFilters = ConversationQuery & { labelId: string; search: string };

type Props = {
  conversations: InboxConversation[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filters: ListFilters;
  onFiltersChange: (next: ListFilters) => void;
  staff: InboxStaffMember[];
  labelsById: Map<string, InboxLabel>;
  staffById: Map<string, InboxStaffMember>;
  meId: string;
};

const selectClass =
  "h-9 w-full min-w-0 rounded-lg border-0 bg-white pl-2.5 pr-7 text-[13px] text-ink-800 ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-sky-500";

export default function ConversationList(props: Props) {
  const { conversations, loading, error, selectedId, onSelect, filters, onFiltersChange, staff, labelsById, staffById, meId } = props;
  const set = (patch: Partial<ListFilters>) => onFiltersChange({ ...filters, ...patch });
  const hasFilters = filters.status !== "all" || filters.unreadOnly || filters.assigned !== "all" || filters.labelId !== "all" || filters.search !== "";

  return (
    <section aria-label="Conversations" className="flex h-full min-h-0 flex-col bg-white">
      <div className="space-y-2.5 border-b border-ink-100 p-3">
        <label className="relative block">
          <span className="sr-only">Search conversations</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search name, number, hospital, message…"
            className="h-10 w-full rounded-xl border-0 bg-ink-50 pl-9 pr-3 text-sm text-ink-900 ring-1 ring-inset ring-transparent placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={filters.unreadOnly}
            onClick={() => set({ unreadOnly: !filters.unreadOnly })}
            className={`h-9 shrink-0 rounded-lg px-3 text-[13px] font-semibold ring-1 ring-inset transition-colors ${
              filters.unreadOnly ? "bg-sky-600 text-white ring-sky-600" : "bg-white text-ink-700 ring-ink-200 hover:bg-ink-50"
            }`}
          >
            Unread
          </button>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Status</span>
            <select value={filters.status} onChange={(e) => set({ status: e.target.value as ListFilters["status"] })} className={selectClass}>
              <option value="all">All statuses</option>
              {CONVERSATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CONVERSATION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Assigned to</span>
            <select value={filters.assigned} onChange={(e) => set({ assigned: e.target.value })} className={selectClass}>
              <option value="all">Anyone</option>
              <option value="me">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
              {staff
                .filter((s) => s.id !== meId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
            </select>
          </label>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Label</span>
            <select value={filters.labelId} onChange={(e) => set({ labelId: e.target.value })} className={selectClass}>
              <option value="all">All labels</option>
              {Array.from(labelsById.values()).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {error && (
          <p role="alert" className="m-3 rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700 ring-1 ring-inset ring-clay-200">
            {error}
          </p>
        )}

        {loading && conversations.length === 0 && !error && (
          <ul aria-hidden="true" className="divide-y divide-ink-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex gap-3 px-4 py-3.5">
                <span className="h-11 w-11 animate-pulse rounded-full bg-ink-100" />
                <span className="flex-1 space-y-2 pt-1">
                  <span className="block h-3 w-1/2 animate-pulse rounded bg-ink-100" />
                  <span className="block h-3 w-4/5 animate-pulse rounded bg-ink-100" />
                </span>
              </li>
            ))}
          </ul>
        )}

        {!loading && conversations.length === 0 && !error && (
          <div className="px-6 py-14 text-center">
            <p className="font-medium text-ink-800">{hasFilters ? "No conversations match" : "No conversations yet"}</p>
            <p className="mt-1 text-sm text-ink-500">
              {hasFilters ? "Try clearing a filter or the search." : "New WhatsApp messages to EMC will appear here."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => onFiltersChange({ status: "all", unreadOnly: false, assigned: "all", labelId: "all", search: "" })}
                className="mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <ul className="divide-y divide-ink-100">
          {conversations.map((c) => {
            const name = contactDisplayName(c.contact);
            const unread = c.unread_count > 0;
            const selected = c.id === selectedId;
            const assignee = c.assigned_staff_id ? staffById.get(c.assigned_staff_id) : undefined;
            const labels = c.labels.map((l) => labelsById.get(l.label_id)).filter((l): l is InboxLabel => Boolean(l));
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`relative flex w-full gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-offset-[-2px] ${
                    selected ? "bg-sky-50" : "hover:bg-ink-50"
                  }`}
                >
                  {unread && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-r bg-sky-600" />}
                  <Avatar name={name} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`truncate text-[15px] ${unread ? "font-bold text-ink-950" : "font-semibold text-ink-900"}`}>{name}</span>
                      <span className={`shrink-0 text-xs ${unread ? "font-semibold text-sky-700" : "text-ink-500"}`}>{formatListTime(c.last_message_at)}</span>
                    </span>
                    {name !== formatPhone(c.contact.phone) && <span className="block truncate text-xs text-ink-500">{formatPhone(c.contact.phone)}</span>}
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-[13px] ${unread ? "font-medium text-ink-900" : "text-ink-600"}`}>{c.last_message_preview ?? "—"}</span>
                      <UnreadBadge count={c.unread_count} />
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={c.status} />
                      <span className="text-[11px] text-ink-500">{assignee ? (assignee.id === meId ? "You" : assignee.full_name) : "Unassigned"}</span>
                      {labels.slice(0, 2).map((l) => (
                        <LabelChip key={l.id} label={l} />
                      ))}
                      {labels.length > 2 && <span className="text-[11px] text-ink-500">+{labels.length - 2}</span>}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
