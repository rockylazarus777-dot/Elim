"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackCtaClick, trackEvent, trackWhatsAppClick } from "@/lib/tracking";
import {
  applyNabhSituation,
  buildAskMoreMessages,
  buildCatalogueMessages,
  buildCategoryMessages,
  buildContextualContactMessages,
  buildFallbackMessages,
  buildLeadPromptMessages,
  buildLifeSituationMessages,
  buildMedicalSafetyMessages,
  buildMultiMatchMessages,
  buildNabhSituationMessages,
  buildPricingMessages,
  buildQualificationStepMessage,
  buildServiceMessages,
  buildWelcomeMessages,
  buildWhatsAppMessage,
  findNextQuestionIndex,
  getServiceCard,
  matchLifeSituation,
  matchServicesFromText,
  nextId,
  QUALIFICATION_QUESTIONS,
  TOP_LEVEL_ACTIONS,
} from "@/components/chatbot/chatbot-engine";
import {
  isContactIntent,
  isMedicalSafetyIntent,
  isPricingIntent,
  isWhatsAppIntent,
} from "@/content/chatbot-services";
import ChatbotPanel from "@/components/chatbot/ChatbotPanel";
import type { ChatbotContext, ChatMessage } from "@/components/chatbot/chatbot-types";

const TYPING_DELAY_MS = 550;
const PANEL_ID = "emc-chatbot-panel";
const CATALOGUE_INTENT = /\bwhat\s+(services\s+)?do\s+you\s+(offer|provide)\b|\bwhat\s+services\b/i;

/**
 * Rule-based conversational engine — no external AI API is configured, so
 * per the brief this is a sophisticated structured system built entirely
 * from EMC's own existing service data (src/content/chatbot-services.ts),
 * not an invented AI integration. Conversation flow/matching/qualification
 * logic lives in chatbot-engine.ts; this component owns only UI state
 * (open/closed, message list, conversation context) and wires user
 * interactions to that engine.
 */
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const contextRef = useRef<ChatbotContext>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
  }, []);

  useEffect(() => {
    if (!open || hasGreeted) return;
    setHasGreeted(true);
    setMessages(buildWelcomeMessages());
    trackEvent("chatbot_open");
  }, [open, hasGreeted]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  const pushBotTyping = useCallback(
    (then: () => ChatMessage[]) => {
      const typingId = nextId();
      setMessages((prev) => [...prev, { id: typingId, from: "bot", kind: "typing" }]);
      window.setTimeout(
        () => {
          setMessages((prev) => [...prev.filter((m) => m.id !== typingId), ...then()]);
        },
        prefersReducedMotion ? 120 : TYPING_DELAY_MS,
      );
    },
    [prefersReducedMotion],
  );

  const openWhatsApp = useCallback((location: string) => {
    const message = buildWhatsAppMessage(contextRef.current);
    const url = `${siteConfig.whatsapp.href}?text=${encodeURIComponent(message)}`;
    trackWhatsAppClick(location);
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const patchContext = useCallback((patch: Partial<ChatbotContext>) => {
    contextRef.current = { ...contextRef.current, ...patch };
  }, []);

  const resolveDefaultService = useCallback(() => {
    const slug = contextRef.current.serviceSlug;
    return slug ? (getServiceCard(slug)?.name ?? "") : "";
  }, []);

  const startQualification = useCallback(
    (slug: string) => {
      patchContext({ serviceSlug: slug });
      const nextIndex = findNextQuestionIndex(contextRef.current);
      pushBotTyping(() => (nextIndex === -1 ? buildLeadPromptMessages() : [buildQualificationStepMessage(nextIndex)]));
    },
    [patchContext, pushBotTyping],
  );

  const handleAction = useCallback(
    (actionId: string, label: string) => {
      if (actionId !== "close-chat") {
        setMessages((prev) => [...prev, { id: nextId(), from: "user", kind: "text", text: label }]);
        trackCtaClick(label, "chatbot");
      }

      const [kind, ...rest] = actionId.split(":");
      const arg = rest.join(":");

      switch (kind) {
        case "cat":
          pushBotTyping(() => buildCategoryMessages(arg));
          return;
        case "svc":
          if (arg === "nabh-accreditation") {
            patchContext({ serviceSlug: arg });
            pushBotTyping(() => buildNabhSituationMessages());
          } else {
            patchContext({ serviceSlug: arg });
            pushBotTyping(() => buildServiceMessages(arg));
          }
          return;
        case "nabh-situation":
          patchContext(applyNabhSituation(arg as "starting" | "have" | "renewal" | "unsure"));
          pushBotTyping(() => buildServiceMessages("nabh-accreditation"));
          return;
        case "qualify":
          startQualification(arg);
          return;
        case "ask-more":
          pushBotTyping(() => buildAskMoreMessages());
          return;
        case "answer": {
          const [stepIndexRaw, ...valueParts] = arg.split(":");
          const stepIndex = Number(stepIndexRaw);
          const value = valueParts.join(":");
          const questionKey = QUALIFICATION_QUESTIONS[stepIndex]?.key;
          if (questionKey) patchContext({ [questionKey]: value });
          const nextIndex = findNextQuestionIndex(contextRef.current, stepIndex + 1);
          pushBotTyping(() => (nextIndex === -1 ? buildLeadPromptMessages() : [buildQualificationStepMessage(nextIndex)]));
          return;
        }
        case "lead":
          if (arg === "call") {
            pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "form", defaultService: resolveDefaultService() }]);
          } else if (arg === "whatsapp") {
            openWhatsApp("chatbot");
            pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "text", text: "Opening WhatsApp for you — we look forward to hearing from you!" }]);
          } else if (arg === "continue") {
            pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "actions", text: "What else can I help you with?", actions: TOP_LEVEL_ACTIONS }]);
          }
          return;
        case "talk-to-emc":
          pushBotTyping(() => [
            {
              id: nextId(),
              from: "bot",
              kind: "actions",
              text: "Sure — how would you like to connect with our team?",
              actions: [{ id: "lead:call", label: "Request a Call" }, { id: "lead:whatsapp", label: "WhatsApp EMC" }],
            },
          ]);
          return;
        case "whatsapp-now":
          openWhatsApp("chatbot");
          pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "text", text: "Opening WhatsApp for you — we look forward to hearing from you!" }]);
          return;
        case "back-to-services":
          pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "actions", text: "What are you looking for today?", actions: TOP_LEVEL_ACTIONS }]);
          return;
        case "close-chat":
          setOpen(false);
          triggerRef.current?.focus();
          return;
        default:
          return;
      }
    },
    [openWhatsApp, patchContext, pushBotTyping, resolveDefaultService, startQualification],
  );

  const handleSendText = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, { id: nextId(), from: "user", kind: "text", text }]);

      if (isMedicalSafetyIntent(text)) {
        pushBotTyping(() => buildMedicalSafetyMessages());
        return;
      }
      if (isPricingIntent(text)) {
        pushBotTyping(() => buildPricingMessages());
        return;
      }
      if (isWhatsAppIntent(text)) {
        openWhatsApp("chatbot");
        pushBotTyping(() => [{ id: nextId(), from: "bot", kind: "text", text: "Opening WhatsApp for you — we look forward to hearing from you!" }]);
        return;
      }
      if (isContactIntent(text)) {
        pushBotTyping(() => buildContextualContactMessages(contextRef.current));
        return;
      }
      if (CATALOGUE_INTENT.test(text)) {
        pushBotTyping(() => buildCatalogueMessages());
        return;
      }

      const situation = matchLifeSituation(text);
      if (situation) {
        pushBotTyping(() => buildLifeSituationMessages(situation));
        return;
      }

      const matches = matchServicesFromText(text);
      if (matches.length === 1) {
        const slug = matches[0]!.slug;
        patchContext({ serviceSlug: slug });
        if (slug === "nabh-accreditation") {
          pushBotTyping(() => buildNabhSituationMessages());
        } else {
          pushBotTyping(() => buildServiceMessages(slug));
        }
        return;
      }
      if (matches.length > 1) {
        pushBotTyping(() => buildMultiMatchMessages(matches));
        return;
      }

      pushBotTyping(() => buildFallbackMessages(text));
    },
    [openWhatsApp, patchContext, pushBotTyping],
  );

  const handleFormSubmitted = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        from: "bot",
        kind: "actions",
        text: "Thank you! Your enquiry has been recorded.\n\nOur team can follow up regarding your requirement.",
        actions: [{ id: "lead:whatsapp", label: "Continue on WhatsApp" }, { id: "close-chat", label: "Close Chat" }],
      },
    ]);
  }, []);

  const handleFormCancelled = useCallback(() => {
    pushBotTyping(() => [
      { id: nextId(), from: "bot", kind: "actions", text: "No problem — is there anything else I can help you with?", actions: TOP_LEVEL_ACTIONS },
    ]);
  }, [pushBotTyping]);

  return (
    <div ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close EMC chat assistant" : "Chat with EMC"}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((v) => !v)}
        className="group fixed right-4 z-[55] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-700 text-white shadow-card-hover transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:-translate-y-0.5 sm:right-6"
        style={{ bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.5a.5.5 0 0 1-.8-.4V16h-.5A2.5 2.5 0 0 1 4 13.5v-8Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="9.5" r="1" fill="currentColor" />
            <circle cx="12" cy="9.5" r="1" fill="currentColor" />
            <circle cx="15.5" cy="9.5" r="1" fill="currentColor" />
          </svg>
        )}

        {!open && !hasGreeted ? (
          <span
            className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#20E0D0]"
            aria-hidden="true"
          />
        ) : null}

        {!open ? (
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Chat with EMC
          </span>
        ) : null}
      </button>

      {open ? (
        <ChatbotPanel
          panelId={PANEL_ID}
          messages={messages}
          onAction={handleAction}
          onSendText={handleSendText}
          onFormSubmitted={handleFormSubmitted}
          onFormCancelled={handleFormCancelled}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          closeButtonRef={closeButtonRef}
        />
      ) : null}
    </div>
  );
}
