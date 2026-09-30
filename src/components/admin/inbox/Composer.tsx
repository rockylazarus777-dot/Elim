"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { InboxQuickReply } from "@/lib/inbox/model";
import { BoltIcon, PaperclipIcon, SendIcon } from "@/components/admin/inbox/icons";

const MAX_LENGTH = 4096;

type Props = {
  quickReplies: InboxQuickReply[];
  /** Resolves with an error message to show, or null on success (the box is then cleared). */
  onSend: (body: string) => Promise<string | null>;
  windowOpen: boolean;
  windowHint: string | null;
  conversationKey: string;
};

/** `/nabh` → quick replies whose shortcut or title matches "nabh". */
function slashQuery(value: string): string | null {
  const match = /^\/([\w-]*)$/.exec(value);
  return match ? match[1]!.toLowerCase() : null;
}

export default function Composer({ quickReplies, onSend, windowOpen, windowHint, conversationKey }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuId = useId();

  // Fresh composer per conversation.
  useEffect(() => {
    setText("");
    setError(null);
    setMenuOpen(false);
  }, [conversationKey]);

  // Grow with the text, up to ~6 lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const query = slashQuery(text);
  const showMenu = menuOpen || query !== null;
  const matches = useMemo(() => {
    const q = (query ?? "").trim();
    const list = q ? quickReplies.filter((r) => r.shortcut.startsWith(q) || r.title.toLowerCase().includes(q)) : quickReplies;
    // Personal replies first, then team, alphabetically.
    return [...list].sort((a, b) => (a.scope === b.scope ? a.shortcut.localeCompare(b.shortcut) : a.scope === "personal" ? -1 : 1));
  }, [quickReplies, query]);

  useEffect(() => setHighlight(0), [query, menuOpen]);

  function insertReply(reply: InboxQuickReply) {
    // Replaces the "/shortcut" being typed (or fills an empty box) — never sends.
    setText((current) => (slashQuery(current) !== null || current.trim() === "" ? reply.body : `${current.trimEnd()} ${reply.body}`));
    setMenuOpen(false);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  async function submit() {
    const body = text.trim();
    if (!body || sending || !windowOpen) return;
    setSending(true);
    setError(null);
    const failure = await onSend(body);
    setSending(false);
    if (failure) {
      setError(failure);
    } else {
      setText("");
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showMenu && matches.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % matches.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + matches.length) % matches.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertReply(matches[highlight]!);
        return;
      }
    }
    if (e.key === "Escape" && showMenu) {
      e.preventDefault();
      setMenuOpen(false);
      if (query !== null) setText("");
      return;
    }
    // Enter sends on desktop; on touch keyboards Enter is a new line (like WhatsApp).
    const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (e.key === "Enter" && !e.shiftKey && !touch && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    }
  }

  if (!windowOpen) {
    return (
      <div className="border-t border-ink-100 bg-white px-4 py-3">
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
          <p className="font-semibold">24-hour reply window closed</p>
          <p className="mt-0.5">
            WhatsApp only allows an approved template message until this customer writes to EMC again. Template sending will be added to the
            Inbox soon — until then, please call the customer or use WhatsApp on the phone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border-t border-ink-100 bg-white px-3 pb-3 pt-2 sm:px-4">
      {showMenu && (
        <div
          id={menuId}
          role="listbox"
          aria-label="Quick replies"
          className="absolute bottom-full left-3 right-3 mb-2 max-h-72 overflow-y-auto rounded-xl bg-white p-1.5 shadow-card-hover ring-1 ring-ink-200 sm:left-4 sm:right-auto sm:w-[26rem]"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">Quick replies</p>
          {matches.length === 0 && <p className="px-2.5 py-2 text-sm text-ink-500">No quick reply matches “/{query}”.</p>}
          {matches.map((reply, i) => (
            <button
              key={reply.id}
              type="button"
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => insertReply(reply)}
              className={`block w-full rounded-lg px-2.5 py-2 text-left ${i === highlight ? "bg-sky-50" : ""}`}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold text-sky-800">/{reply.shortcut}</span>
                <span className="truncate text-[13px] font-medium text-ink-800">{reply.title}</span>
                {reply.scope === "personal" && <span className="ml-auto text-[10px] font-semibold uppercase text-ink-400">Mine</span>}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-xs text-ink-500">{reply.body}</span>
            </button>
          ))}
        </div>
      )}

      {windowHint && <p className="mb-1.5 px-1 text-[11px] text-ink-500">{windowHint}</p>}

      <div className="flex items-end gap-2">
        <button
          type="button"
          disabled
          title="Attachments are coming soon"
          aria-label="Attach a file (coming soon)"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-300"
        >
          <PaperclipIcon />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={showMenu}
          aria-controls={menuId}
          aria-label="Quick replies"
          title="Quick replies (or type /)"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
            showMenu ? "bg-sky-100 text-sky-800" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
          }`}
        >
          <BoltIcon />
        </button>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a message…  (/ for quick replies)"
            aria-autocomplete="list"
            aria-controls={showMenu ? menuId : undefined}
            className="block max-h-40 min-h-[44px] w-full resize-none rounded-2xl border-0 bg-ink-50 px-4 py-2.5 text-[15px] leading-6 text-ink-900 ring-1 ring-inset ring-ink-100 placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
          />
        </label>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!text.trim() || sending}
          aria-label={sending ? "Sending" : "Send"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-card transition-colors hover:bg-brand-600 disabled:bg-ink-200 disabled:text-ink-400 disabled:shadow-none"
        >
          {sending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <SendIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 px-1 text-sm text-clay-700">
          {error}
        </p>
      )}
      {text.length > MAX_LENGTH - 200 && (
        <p className="mt-1 px-1 text-right text-[11px] text-ink-500">
          {text.length}/{MAX_LENGTH}
        </p>
      )}
    </div>
  );
}
