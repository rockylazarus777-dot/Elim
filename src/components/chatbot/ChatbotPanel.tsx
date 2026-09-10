"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ChatEnquiryForm from "@/components/chatbot/ChatEnquiryForm";
import { getServiceCard } from "@/content/chatbot-services";
import type { ChatAction, ChatMessage, ChatProgress } from "@/components/chatbot/chatbot-types";

function TypingDots() {
  return (
    <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-card">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400" />
    </span>
  );
}

/** Subtle step indicator for the qualification flow — "Requirement ●──○──○──○", never a form-feeling progress bar. */
function ProgressDots({ progress }: { progress: ChatProgress }) {
  return (
    <div className="mb-1 flex items-center gap-1.5 pl-0.5" aria-hidden="true">
      <span className="text-[0.65rem] font-medium uppercase tracking-wide text-ink-400">Requirement</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: progress.total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i < progress.step ? "bg-brand-700" : "bg-ink-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.5a.5.5 0 0 1-.8-.4V16h-.5A2.5 2.5 0 0 1 4 13.5v-8Z"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="9.5" r="1" fill="white" />
        <circle cx="12" cy="9.5" r="1" fill="white" />
        <circle cx="15.5" cy="9.5" r="1" fill="white" />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-700 bg-emerald-400" aria-hidden="true" />
    </div>
  );
}

function ServiceCardBubble({ slug, actions, onAction }: { slug: string; actions: ChatAction[]; onAction: (id: string, label: string) => void }) {
  const card = getServiceCard(slug);
  if (!card) return null;
  return (
    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-card">
      <p className="text-sm font-semibold text-ink-900">{card.name}</p>

      <p className="mt-2 text-sm leading-relaxed text-ink-700">{card.whatIs}</p>

      <p className="mt-2 text-sm leading-snug text-ink-700">
        <span className="font-medium text-brand-700">EMC supports:</span>{" "}
        {card.supports.join(" · ")}
      </p>

      <p className="mt-1.5 text-sm leading-snug text-ink-700">
        <span className="font-medium text-brand-700">Good for:</span> {card.goodFor}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action.id, action.label)}
            className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatbotPanel({
  panelId,
  messages,
  onAction,
  onSendText,
  onFormSubmitted,
  onFormCancelled,
  onClose,
  closeButtonRef,
}: {
  panelId: string;
  messages: ChatMessage[];
  onAction: (actionId: string, label: string) => void;
  onSendText: (text: string) => void;
  onFormSubmitted: () => void;
  onFormCancelled: () => void;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSendText(text);
    setDraft("");
  }

  return (
    <div
      id={panelId}
      role="dialog"
      aria-label="EMC Healthcare Assistant chat"
      className="animate-chat-pop fixed left-3 right-3 z-[55] flex h-[min(600px,calc(100dvh-5.5rem))] flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_24px_60px_-16px_rgba(10,13,16,0.28)] sm:left-auto sm:right-6 sm:w-[390px]"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink-100 bg-brand-700 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <AssistantAvatar />
          <div>
            <p className="text-sm font-semibold text-white">EMC Healthcare Assistant</p>
            <p className="text-xs text-white/70">Online • Here to help</p>
          </div>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-ink-50/40 px-4 py-4">
        {messages.map((message) => {
          if (message.from === "user") {
            return (
              <div key={message.id} className="animate-msg-in flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand-700 px-3.5 py-2.5 text-sm leading-relaxed text-white">
                  {message.text}
                </p>
              </div>
            );
          }

          if (message.kind === "typing") {
            return (
              <div key={message.id} className="animate-msg-in flex justify-start">
                <TypingDots />
              </div>
            );
          }

          if (message.kind === "form") {
            return (
              <div key={message.id} className="animate-msg-in flex justify-start">
                <ChatEnquiryForm defaultService={message.defaultService} onSubmitted={onFormSubmitted} onCancel={onFormCancelled} />
              </div>
            );
          }

          if (message.kind === "service-card") {
            return (
              <div key={message.id} className="animate-msg-in flex justify-start">
                <ServiceCardBubble slug={message.slug} actions={message.actions} onAction={onAction} />
              </div>
            );
          }

          // "text" and "actions" bot messages
          return (
            <div key={message.id} className="animate-msg-in flex flex-col items-start gap-2">
              {message.progress ? <ProgressDots progress={message.progress} /> : null}
              {message.text ? (
                <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 shadow-card">
                  {message.text}
                </p>
              ) : null}
              {message.kind === "actions" ? (
                <div className="flex flex-wrap gap-1.5">
                  {message.actions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => onAction(action.id, action.label)}
                      className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-ink-100 bg-white p-3">
        <label htmlFor="chatbot-text-input" className="sr-only">
          Type a message
        </label>
        <input
          id="chatbot-text-input"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type your question…"
          className="flex-1 rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
