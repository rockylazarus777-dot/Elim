"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import type { StaffProfile } from "@/lib/auth/access";
import { isManagerRole } from "@/lib/auth/access";
import {
  CONVERSATION_STATUS_LABELS,
  CONVERSATION_STATUSES,
  type ConversationStatus,
  contactDisplayName,
  formatPhone,
  type InboxConversation,
  type InboxLabel,
  type InboxMessage,
  type InboxQuickReply,
  type InboxStaffMember,
} from "@/lib/inbox/model";
import { formatDayLabel, startsNewDay } from "@/lib/inbox/format";
import Composer from "@/components/admin/inbox/Composer";
import MessageBubble from "@/components/admin/inbox/MessageBubble";
import { ArrowLeftIcon, CheckIcon, InfoIcon } from "@/components/admin/inbox/icons";
import { Avatar, LabelChip, UnreadBadge } from "@/components/admin/inbox/ui";

type Props = {
  conversation: InboxConversation;
  messages: InboxMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  me: StaffProfile;
  staff: InboxStaffMember[];
  staffById: Map<string, InboxStaffMember>;
  labels: InboxLabel[];
  labelsById: Map<string, InboxLabel>;
  quickReplies: InboxQuickReply[];
  windowOpen: boolean;
  windowHint: string | null;
  busy: boolean;
  onBack: () => void;
  onToggleDetails: () => void;
  onStatusChange: (status: ConversationStatus) => void;
  onAssign: (staffId: string | null) => void;
  onMarkRead: () => void;
  onAddLabel: (labelId: string) => void;
  onRemoveLabel: (labelId: string) => void;
  onSend: (body: string) => Promise<string | null>;
};

const controlClass =
  "h-9 rounded-lg border-0 bg-white pl-2.5 pr-7 text-[13px] font-medium text-ink-800 ring-1 ring-inset ring-ink-200 hover:ring-ink-300 focus:ring-2 focus:ring-sky-500 disabled:opacity-60";

/** Admin/BDM pick anyone; other roles can only take an unassigned chat or release their own (the database enforces the same). */
function AssignControl({ conversation, me, staff, staffById, busy, onAssign }: Pick<Props, "conversation" | "me" | "staff" | "staffById" | "busy" | "onAssign">) {
  const current = conversation.assigned_staff_id;
  if (isManagerRole(me.role)) {
    return (
      <label className="min-w-0">
        <span className="sr-only">Assigned to</span>
        <select value={current ?? ""} disabled={busy} onChange={(e) => onAssign(e.target.value || null)} className={`${controlClass} max-w-[11rem]`}>
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id === me.id ? `${s.full_name} (me)` : s.full_name}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (!current) {
    return (
      <button type="button" disabled={busy} onClick={() => onAssign(me.id)} className="h-9 rounded-lg bg-sky-600 px-3 text-[13px] font-semibold text-white hover:bg-sky-700 disabled:opacity-60">
        Assign to me
      </button>
    );
  }
  if (current === me.id) {
    return (
      <button type="button" disabled={busy} onClick={() => onAssign(null)} className="h-9 rounded-lg bg-white px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:opacity-60">
        Unassign me
      </button>
    );
  }
  return <span className="text-[13px] text-ink-600">Assigned to {staffById.get(current)?.full_name ?? "another staff member"}</span>;
}

export default function ChatPanel(props: Props) {
  const { conversation, messages, messagesLoading, messagesError, me, staff, staffById, labels, labelsById, quickReplies } = props;
  const name = contactDisplayName(conversation.contact);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const lastConversation = useRef<string | null>(null);

  const appliedLabelIds = new Set(conversation.labels.map((l) => l.label_id));
  const applied = labels.filter((l) => appliedLabelIds.has(l.id));
  const available = labels.filter((l) => !appliedLabelIds.has(l.id));

  // Jump to the newest message when a conversation opens; afterwards follow
  // new messages only if the user hasn't scrolled up to read history.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (lastConversation.current !== conversation.id || stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
    if (messages.length > 0) lastConversation.current = conversation.id;
  }, [messages, conversation.id]);

  useEffect(() => {
    stickToBottom.current = true;
  }, [conversation.id]);

  return (
    <section aria-label={`Chat with ${name}`} className="flex h-full min-h-0 flex-col bg-[#f5f7f9]">
      <header className="border-b border-ink-100 bg-white px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={props.onBack} className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-ink-50 md:hidden" aria-label="Back to conversations">
            <ArrowLeftIcon />
          </button>
          <button type="button" onClick={props.onToggleDetails} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left" aria-label="Show customer details">
            <Avatar name={name} />
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-base font-semibold text-ink-900">{name}</span>
                <UnreadBadge count={conversation.unread_count} />
              </span>
              <span className="block truncate text-[13px] text-ink-500">
                {formatPhone(conversation.contact.phone)}
                {conversation.contact.opted_out && <span className="ml-2 font-semibold text-clay-700">· Opted out of marketing</span>}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={props.onToggleDetails}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 hover:text-ink-800"
            aria-label="Customer details"
            title="Customer details"
          >
            <InfoIcon />
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <label>
            <span className="sr-only">Conversation status</span>
            <select
              value={conversation.status}
              disabled={props.busy}
              onChange={(e) => props.onStatusChange(e.target.value as ConversationStatus)}
              className={controlClass}
            >
              {CONVERSATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CONVERSATION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <AssignControl conversation={conversation} me={me} staff={staff} staffById={staffById} busy={props.busy} onAssign={props.onAssign} />
          {conversation.unread_count > 0 && (
            <button
              type="button"
              disabled={props.busy}
              onClick={props.onMarkRead}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:opacity-60"
            >
              <CheckIcon className="h-4 w-4" /> Mark read
            </button>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {applied.map((l) => (
            <LabelChip key={l.id} label={l} onRemove={props.busy ? undefined : () => props.onRemoveLabel(l.id)} />
          ))}
          {available.length > 0 && (
            <label>
              <span className="sr-only">Add label</span>
              <select
                value=""
                disabled={props.busy}
                onChange={(e) => e.target.value && props.onAddLabel(e.target.value)}
                className="h-7 rounded-full border border-dashed border-sky-300 bg-transparent py-0 pl-2 pr-7 text-[12px] font-semibold text-sky-700 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
              >
                <option value="">+ Label</option>
                {available.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.emoji ? `${l.emoji} ` : ""}
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messagesError && (
          <p role="alert" className="mx-auto max-w-md rounded-lg bg-clay-50 px-3 py-2 text-center text-sm text-clay-700 ring-1 ring-inset ring-clay-200">
            {messagesError}
          </p>
        )}
        {messagesLoading && messages.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Loading messages…</p>}
        {!messagesLoading && messages.length === 0 && !messagesError && <p className="py-10 text-center text-sm text-ink-500">No messages yet.</p>}
        {messages.map((m, i) => (
          <Fragment key={m.id}>
            {startsNewDay(m, messages[i - 1]) && (
              <div className="flex justify-center py-2">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ink-500 shadow-sm ring-1 ring-ink-100">
                  {formatDayLabel(m.direction === "inbound" ? (m.sent_at ?? m.created_at) : m.created_at)}
                </span>
              </div>
            )}
            <MessageBubble
              message={m}
              isAdmin={me.role === "admin"}
              authorName={m.direction === "outbound" && m.created_by ? (m.created_by === me.id ? "You" : staffById.get(m.created_by)?.full_name) : undefined}
            />
          </Fragment>
        ))}
      </div>

      <Composer
        quickReplies={quickReplies}
        onSend={props.onSend}
        windowOpen={props.windowOpen}
        windowHint={props.windowHint}
        conversationKey={conversation.id}
      />
    </section>
  );
}
