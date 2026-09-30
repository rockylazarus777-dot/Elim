"use client";

import { useState } from "react";
import type { InboxMessage } from "@/lib/inbox/model";
import { formatClock, formatDateTime, messageTime, TICK_LABELS, tickState } from "@/lib/inbox/format";
import { AlertIcon, ClockIcon, Ticks } from "@/components/admin/inbox/icons";

const MEDIA: Record<string, { icon: string; label: string }> = {
  image: { icon: "📷", label: "Photo" },
  video: { icon: "🎥", label: "Video" },
  audio: { icon: "🎤", label: "Voice message" },
  document: { icon: "📄", label: "Document" },
  sticker: { icon: "🙂", label: "Sticker" },
};

/** Media isn't downloaded yet: show what it is, plus any caption. */
function MediaPlaceholder({ message }: { message: InboxMessage }) {
  const media = MEDIA[message.message_type]!;
  return (
    <div className="mb-1 flex items-center gap-3 rounded-lg bg-ink-900/[0.04] px-3 py-2.5">
      <span aria-hidden="true" className="text-xl">
        {media.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-800">{media.label}</span>
        <span className="block text-xs text-ink-500">Open WhatsApp on the phone to view · preview coming soon</span>
      </span>
    </div>
  );
}

function Body({ message }: { message: InboxMessage }) {
  const text = message.body?.trim() || null;
  switch (message.message_type) {
    case "image":
    case "video":
    case "audio":
    case "document":
    case "sticker":
      return (
        <>
          <MediaPlaceholder message={message} />
          {text && <p className="whitespace-pre-wrap break-words">{text}</p>}
        </>
      );
    case "location":
      return <p className="break-words">📍 {text ?? "Location shared"}</p>;
    case "contacts":
      return <p className="break-words">👤 {text ?? "Contact card shared"}</p>;
    case "reaction":
      return <p className="text-ink-600">{text ? <>Reacted {text}</> : "Removed a reaction"}</p>;
    case "button":
    case "interactive":
      return (
        <p className="break-words">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Tapped</span>
          {text ?? "a button"}
        </p>
      );
    case "template":
      return (
        <p className="whitespace-pre-wrap break-words">
          {text ?? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Template</span> {message.template_name}
            </>
          )}
        </p>
      );
    case "text":
      return <p className="whitespace-pre-wrap break-words">{text ?? ""}</p>;
    default:
      return <p className="italic text-ink-500">This message type can&apos;t be shown here yet. Check WhatsApp on the phone.</p>;
  }
}

export default function MessageBubble({ message, authorName, isAdmin }: { message: InboxMessage; authorName?: string; isAdmin: boolean }) {
  const [showDetails, setShowDetails] = useState(false);
  const outbound = message.direction === "outbound";
  const tick = tickState(message);
  const time = messageTime(message);

  return (
    <div className={`flex ${outbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[14.5px] leading-relaxed text-ink-900 shadow-[0_1px_1px_rgba(10,13,16,0.06)] sm:max-w-[70%] ${
          outbound
            ? `rounded-br-md ${message.status === "failed" ? "bg-clay-50 ring-1 ring-clay-200" : "bg-sky-100/70 ring-1 ring-sky-200/60"}`
            : "rounded-bl-md bg-white ring-1 ring-ink-100"
        }`}
      >
        {outbound && authorName && <p className="mb-0.5 text-[11px] font-semibold text-sky-800">{authorName}</p>}
        <Body message={message} />
        <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-ink-500" title={formatDateTime(time)}>
          <time dateTime={time}>{formatClock(time)}</time>
          {tick === "clock" && <ClockIcon className="h-3.5 w-3.5" />}
          {(tick === "single" || tick === "double" || tick === "double-read") && <Ticks state={tick} />}
          {tick && <span className="sr-only">{TICK_LABELS[tick]}</span>}
        </p>
        {tick === "failed" && (
          <div className="mt-1.5 border-t border-clay-200 pt-1.5 text-xs text-clay-700">
            <p className="flex items-center gap-1.5 font-semibold">
              <AlertIcon className="h-4 w-4" /> Message not delivered
            </p>
            {isAdmin && (message.error_code !== null || message.error_title) && (
              <>
                <button type="button" onClick={() => setShowDetails((v) => !v)} className="mt-1 font-medium underline underline-offset-2">
                  {showDetails ? "Hide details" : "View details"}
                </button>
                {showDetails && (
                  <p className="mt-1 text-clay-700/90">
                    {message.error_code !== null && <>Error {message.error_code} · </>}
                    {message.error_title ?? "No details from WhatsApp"}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
