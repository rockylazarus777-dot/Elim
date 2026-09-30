"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StaffProfile } from "@/lib/auth/access";
import { STAFF_ROLE_LABELS } from "@/lib/auth/access";
import {
  addConversationLabel,
  addNote,
  type ContactPatch,
  deleteNote,
  fetchConversation,
  fetchConversations,
  fetchMessages,
  fetchNotes,
  InboxError,
  removeConversationLabel,
  searchMessageConversationIds,
  sendReply,
  updateContact,
  updateConversation,
} from "@/lib/inbox/data";
import { formatRemaining } from "@/lib/inbox/format";
import {
  type ConversationStatus,
  type InboxConversation,
  type InboxLabel,
  type InboxMessage,
  type InboxNote,
  type InboxQuickReply,
  type InboxStaffMember,
  isWithinServiceWindow,
  serviceWindowRemainingMs,
} from "@/lib/inbox/model";
import { usePolling } from "@/lib/inbox/usePolling";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import SignOutButton from "@/components/admin/SignOutButton";
import ChatPanel from "@/components/admin/inbox/ChatPanel";
import ConversationList, { type ListFilters } from "@/components/admin/inbox/ConversationList";
import DetailsPanel from "@/components/admin/inbox/DetailsPanel";
import { ChatIcon } from "@/components/admin/inbox/icons";

const LIST_POLL_MS = 5000;
const CHAT_POLL_MS = 4000;
const DEFAULT_FILTERS: ListFilters = { status: "all", unreadOnly: false, assigned: "all", labelId: "all", search: "" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  me: StaffProfile;
  staff: InboxStaffMember[];
  labels: InboxLabel[];
  quickReplies: InboxQuickReply[];
};

const errorText = (e: unknown, fallback = "Something went wrong. Please try again.") => (e instanceof InboxError ? e.message : fallback);

/** Does a conversation match the search box (contact fields here; message text via the server)? */
function matchesSearch(c: InboxConversation, term: string, messageMatches: Set<string> | null): boolean {
  const q = term.trim().toLowerCase();
  if (!q) return true;
  const digits = q.replace(/\D/g, "");
  const { contact } = c;
  const fields = [contact.name, contact.whatsapp_profile_name, contact.organization, contact.requirement, contact.city, contact.email];
  return (
    fields.some((f) => f?.toLowerCase().includes(q)) ||
    (digits.length >= 3 && contact.phone.includes(digits)) ||
    Boolean(messageMatches?.has(c.id))
  );
}

export default function InboxApp({ me, staff, labels, quickReplies }: Props) {
  const sb = useMemo(() => createSupabaseBrowserClient(), []);
  const staffById = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);
  const labelsById = useMemo(() => new Map(labels.map((l) => [l.id, l])), [labels]);

  // ---- conversation list ------------------------------------------------------
  const [filters, setFilters] = useState<ListFilters>(DEFAULT_FILTERS);
  const [conversations, setConversations] = useState<InboxConversation[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [messageMatches, setMessageMatches] = useState<Set<string> | null>(null);

  const query = useMemo(
    () => ({ status: filters.status, unreadOnly: filters.unreadOnly, assigned: filters.assigned }),
    [filters.status, filters.unreadOnly, filters.assigned],
  );
  const queryKey = JSON.stringify(query);

  const loadConversations = useCallback(async () => {
    try {
      const rows = await fetchConversations(sb, query, me.id);
      setConversations(rows);
      setListError(null);
    } catch (e) {
      setListError(errorText(e, "We couldn't load conversations."));
    } finally {
      setListLoading(false);
    }
  }, [sb, query, me.id]);

  usePolling(loadConversations, LIST_POLL_MS, queryKey);

  // Message-text search runs server-side, debounced.
  useEffect(() => {
    const term = filters.search.trim();
    if (term.length < 2) {
      setMessageMatches(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const ids = await searchMessageConversationIds(sb, term);
        if (!cancelled) setMessageMatches(ids);
      } catch {
        if (!cancelled) setMessageMatches(null);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters.search, sb]);

  const visible = useMemo(
    () =>
      conversations.filter(
        (c) => (filters.labelId === "all" || c.labels.some((l) => l.label_id === filters.labelId)) && matchesSearch(c, filters.search, messageMatches),
      ),
    [conversations, filters.labelId, filters.search, messageMatches],
  );

  // ---- selected conversation ----------------------------------------------
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const [selected, setSelected] = useState<InboxConversation | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [notes, setNotes] = useState<InboxNote[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const markingRead = useRef<string | null>(null);

  const loadSelected = useCallback(async () => {
    const id = selectedIdRef.current;
    if (!id) return;
    try {
      const [conversation, rows, noteRows] = await Promise.all([fetchConversation(sb, id), fetchMessages(sb, id), fetchNotes(sb, id)]);
      if (selectedIdRef.current !== id) return; // user switched conversations meanwhile
      if (!conversation) {
        setSelectedId(null);
        selectedIdRef.current = null;
        setSelected(null);
        setToast("That conversation is no longer available.");
        return;
      }
      setSelected(conversation);
      setMessages(rows);
      setNotes(noteRows);
      setMessagesError(null);

      // Staff are looking at it: clear unread (EMC Inbox only — this does not send a WhatsApp read receipt).
      if (conversation.unread_count > 0 && document.visibilityState === "visible" && document.hasFocus() && markingRead.current !== id) {
        markingRead.current = id;
        updateConversation(sb, id, { unread_count: 0 })
          .then(() => {
            setSelected((s) => (s && s.id === id ? { ...s, unread_count: 0 } : s));
            setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c)));
          })
          .catch(() => {})
          .finally(() => {
            markingRead.current = null;
          });
      }
    } catch (e) {
      if (selectedIdRef.current === id) setMessagesError(errorText(e, "We couldn't load messages."));
    } finally {
      if (selectedIdRef.current === id) setMessagesLoading(false);
    }
  }, [sb]);

  usePolling(loadSelected, CHAT_POLL_MS, selectedId);

  const selectConversation = useCallback(
    (id: string) => {
      if (id !== selectedIdRef.current) {
        selectedIdRef.current = id;
        setSelectedId(id);
        setSelected(conversations.find((c) => c.id === id) ?? null);
        setMessages([]);
        setNotes([]);
        setMessagesError(null);
        setMessagesLoading(true);
      }
      setMobileView("chat");
      const url = new URL(window.location.href);
      url.searchParams.set("c", id);
      window.history.replaceState(null, "", url);
    },
    [conversations],
  );

  // Deep link / browser refresh: /admin/whatsapp?c=<id> reopens that conversation.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("c");
    if (id && UUID.test(id)) selectConversation(id);
    if (window.matchMedia("(min-width: 1280px)").matches) setDetailsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the reply-window countdown current.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ---- actions (all run as the signed-in staff member; RLS decides) ------------
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
      await Promise.all([loadSelected(), loadConversations()]);
    } catch (e) {
      setToast(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  /** Same as run(), but returns an error message for inline display instead of a toast. */
  async function runInline(action: () => Promise<void>): Promise<string | null> {
    try {
      await action();
      await Promise.all([loadSelected(), loadConversations()]);
      return null;
    } catch (e) {
      return errorText(e);
    }
  }

  async function handleSend(body: string): Promise<string | null> {
    const id = selectedIdRef.current;
    if (!id) return "Choose a conversation first.";
    const result = await sendReply(id, body);
    const row = result.row;
    if (row) setMessages((list) => (list.some((m) => m.id === row.id) ? list : [...list, row]));
    void loadSelected();
    void loadConversations();
    if (result.ok) return null;
    return result.details ? `${result.message} (WhatsApp error ${result.details.metaCode ?? "?"}: ${result.details.metaTitle ?? "no details"})` : result.message;
  }

  const windowOpen = selected ? isWithinServiceWindow(selected.last_inbound_at, now) : false;
  const windowHint = selected && windowOpen ? `24-hour reply window · ${formatRemaining(serviceWindowRemainingMs(selected.last_inbound_at, now))}` : null;

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-ink-100 bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/images/Emc Pvt ltd logo/logo.png" alt="EMC Healthcare Services" width={120} height={35} priority className="h-8 w-auto" />
          <span className="hidden h-6 w-px bg-ink-200 sm:block" aria-hidden="true" />
          <h1 className="hidden truncate font-display text-lg text-ink-900 sm:block">WhatsApp Inbox</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-right leading-tight md:block">
            <span className="block text-sm font-semibold text-ink-900">{me.full_name}</span>
            <span className="block text-xs text-ink-500">{STAFF_ROLE_LABELS[me.role]}</span>
          </span>
          <SignOutButton className="btn-ghost px-3 py-2 text-[13px]" />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <div className={`${mobileView === "list" ? "flex" : "hidden"} w-full min-w-0 shrink-0 flex-col border-r border-ink-100 md:flex md:w-[330px] xl:w-[360px]`}>
          <ConversationList
            conversations={visible}
            loading={listLoading}
            error={listError}
            selectedId={selectedId}
            onSelect={selectConversation}
            filters={filters}
            onFiltersChange={setFilters}
            staff={staff}
            labelsById={labelsById}
            staffById={staffById}
            meId={me.id}
          />
        </div>

        <div className={`${mobileView === "chat" ? "flex" : "hidden"} min-w-0 flex-1 flex-col md:flex`}>
          {selected ? (
            <ChatPanel
              conversation={selected}
              messages={messages}
              messagesLoading={messagesLoading}
              messagesError={messagesError}
              me={me}
              staff={staff}
              staffById={staffById}
              labels={labels}
              labelsById={labelsById}
              quickReplies={quickReplies}
              windowOpen={windowOpen}
              windowHint={windowHint}
              busy={busy}
              onBack={() => setMobileView("list")}
              onToggleDetails={() => setDetailsOpen((open) => !open)}
              onStatusChange={(status: ConversationStatus) => void run(() => updateConversation(sb, selected.id, { status }))}
              onAssign={(staffId) => void run(() => updateConversation(sb, selected.id, { assigned_staff_id: staffId }))}
              onMarkRead={() => void run(() => updateConversation(sb, selected.id, { unread_count: 0 }))}
              onAddLabel={(labelId) => void run(() => addConversationLabel(sb, selected.id, labelId, me.id))}
              onRemoveLabel={(labelId) => void run(() => removeConversationLabel(sb, selected.id, labelId))}
              onSend={handleSend}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-[#f5f7f9] px-6 text-center">
              {selectedId && messagesLoading ? (
                <p className="text-sm text-ink-500">Loading conversation…</p>
              ) : (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <ChatIcon className="h-8 w-8" />
                  </span>
                  <p className="mt-4 font-display text-xl text-ink-900">EMC WhatsApp Inbox</p>
                  <p className="mt-1 max-w-sm text-sm text-ink-500">Choose a conversation to read and reply. New messages appear automatically.</p>
                </>
              )}
            </div>
          )}
        </div>

        {selected && detailsOpen && (
          <div
            className="fixed inset-0 z-40 flex justify-end bg-ink-950/30 xl:static xl:z-auto xl:w-[340px] xl:shrink-0 xl:border-l xl:border-ink-100 xl:bg-transparent"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDetailsOpen(false);
            }}
          >
            <div className="h-full w-full max-w-[400px] shadow-2xl xl:max-w-none xl:shadow-none">
              <DetailsPanel
                conversation={selected}
                me={me}
                staffById={staffById}
                notes={notes}
                onClose={() => setDetailsOpen(false)}
                onSaveContact={(patch: ContactPatch) => runInline(() => updateContact(sb, selected.contact.id, patch))}
                onAddNote={(body) => runInline(() => addNote(sb, selected.id, me.id, body))}
                onDeleteNote={(noteId) => runInline(() => deleteNote(sb, noteId))}
              />
            </div>
          </div>
        )}

        {toast && (
          <div role="alert" className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-ink-900 px-4 py-3 text-sm text-white shadow-2xl">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
