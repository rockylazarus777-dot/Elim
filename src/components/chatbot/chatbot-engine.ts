import {
  categories,
  crossSell,
  getCategory,
  getCategoryForService,
  getServiceCard,
  matchLifeSituation,
  matchServicesFromText,
  CATALOGUE_SUMMARY,
  type ChatbotServiceCard,
  type LifeSituationMatch,
} from "@/content/chatbot-services";
import type { ChatAction, ChatMessage, ChatbotContext } from "@/components/chatbot/chatbot-types";

let counter = 0;
export function nextId(): string {
  counter += 1;
  return `chat-${counter}`;
}

export const TOP_LEVEL_ACTIONS: ChatAction[] = [
  ...categories.map((c) => ({ id: `cat:${c.id}`, label: `${c.emoji} ${c.label}` })),
  { id: "talk-to-emc", label: "Talk to EMC Team" },
];

export const QUALIFICATION_QUESTIONS: {
  key: keyof ChatbotContext;
  question: string;
  options: string[];
}[] = [
  { key: "facilityType", question: "What type of healthcare facility do you operate?", options: ["Hospital", "Clinic", "Diagnostic Centre", "Other"] },
  { key: "bedStrength", question: "What is your approximate bed strength?", options: ["1–10", "11–30", "31–50", "50+", "Not Applicable"] },
  { key: "requirementType", question: "Is this a new requirement or an existing issue?", options: ["New Requirement", "Renewal", "Existing Problem", "Planning Stage"] },
  { key: "urgency", question: "How soon would you like to discuss this?", options: ["Immediately", "This Week", "This Month", "Just Exploring"] },
];

const FOLLOW_UP_ACTIONS = (slug: string): ChatAction[] => [
  { id: `qualify:${slug}`, label: "Request Consultation" },
  { id: "whatsapp-now", label: "WhatsApp EMC" },
  { id: `ask-more:${slug}`, label: "Ask Another Question" },
];

const LEAD_PROMPT_ACTIONS: ChatAction[] = [
  { id: "lead:call", label: "Request a Call" },
  { id: "lead:whatsapp", label: "WhatsApp EMC" },
  { id: "lead:continue", label: "Continue Browsing" },
];

export function buildWelcomeMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "text",
      text: "Hello! 👋 Welcome to EMC Healthcare Services.\n\nI can help you understand our services, identify the right solution for your hospital or clinic, and connect you with our team.",
    },
    { id: nextId(), from: "bot", kind: "actions", text: "What are you looking for today?", actions: TOP_LEVEL_ACTIONS },
  ];
}

function serviceCardMessage(card: ChatbotServiceCard): ChatMessage {
  return { id: nextId(), from: "bot", kind: "service-card", slug: card.slug, actions: FOLLOW_UP_ACTIONS(card.slug) };
}

function crossSellMessages(slug: string): ChatMessage[] {
  const entry = crossSell[slug];
  if (!entry) return [];
  const options: ChatAction[] = [
    ...entry.slugs.map((s) => ({ id: `svc:${s}`, label: getServiceCard(s)?.name ?? s })),
    { id: `svc:${slug}`, label: `Continue with ${getServiceCard(slug)?.name ?? "this"}` },
  ];
  return [{ id: nextId(), from: "bot", kind: "actions", text: entry.intro, actions: options }];
}

/** Selecting NABH specifically opens the scripted "which best describes your situation" sub-flow before the card — see brief §2. */
export function buildNabhSituationMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "text",
      text: "Absolutely. EMC can support hospitals through the NABH preparation journey.\n\nTo understand your requirement better, may I ask a few quick questions?",
    },
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "Which best describes your situation?",
      actions: [
        { id: "nabh-situation:starting", label: "We are starting NABH" },
        { id: "nabh-situation:have", label: "We already have NABH" },
        { id: "nabh-situation:renewal", label: "Renewal / Reassessment" },
        { id: "nabh-situation:unsure", label: "Not sure" },
      ],
    },
  ];
}

export function buildServiceMessages(slug: string): ChatMessage[] {
  const card = getServiceCard(slug);
  if (!card) return buildFallbackMessages("");
  return [serviceCardMessage(card), ...crossSellMessages(slug)];
}

export function buildCategoryMessages(categoryId: string): ChatMessage[] {
  const category = getCategory(categoryId);
  if (!category) return buildFallbackMessages("");
  if (category.serviceSlugs.length === 1) {
    return buildServiceMessages(category.serviceSlugs[0]!);
  }
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: `Which service within ${category.label} would you like to explore?`,
      actions: category.serviceSlugs.map((slug) => ({ id: `svc:${slug}`, label: getServiceCard(slug)?.name ?? slug })),
    },
  ];
}

export function buildLifeSituationMessages(match: LifeSituationMatch): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: match.intro,
      actions: [...match.options.map((o) => ({ id: `svc:${o.slug}`, label: o.label })), { id: "talk-to-emc", label: "Speak to EMC" }],
    },
  ];
}

export function buildMultiMatchMessages(matches: ChatbotServiceCard[]): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "It sounds like you may need more than one EMC service.",
      actions: matches.slice(0, 4).map((m) => ({ id: `svc:${m.slug}`, label: m.name })),
    },
  ];
}

/** First qualification question not yet answered in this context, or -1 if all are known. */
export function findNextQuestionIndex(context: ChatbotContext, fromIndex = 0): number {
  for (let i = fromIndex; i < QUALIFICATION_QUESTIONS.length; i++) {
    if (!context[QUALIFICATION_QUESTIONS[i]!.key]) return i;
  }
  return -1;
}

export function buildAskMoreMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "Sure — what else would you like to know? You can type a question, or pick another area below.",
      actions: TOP_LEVEL_ACTIONS,
    },
  ];
}

export function buildQualificationStepMessage(stepIndex: number): ChatMessage {
  const step = QUALIFICATION_QUESTIONS[stepIndex]!;
  return {
    id: nextId(),
    from: "bot",
    kind: "actions",
    text: step.question,
    progress: { step: stepIndex + 1, total: QUALIFICATION_QUESTIONS.length },
    actions: step.options.map((opt) => ({ id: `answer:${stepIndex}:${opt}`, label: opt })),
  };
}

/** "We are starting NABH" / "Renewal / Reassessment" map cleanly onto the generic requirementType question, so it's never asked twice; "already have" / "not sure" don't map cleanly and are left for the full qualification flow to ask later. */
export function applyNabhSituation(value: "starting" | "have" | "renewal" | "unsure"): Partial<ChatbotContext> {
  if (value === "starting") return { requirementType: "New Requirement" };
  if (value === "renewal") return { requirementType: "Renewal" };
  return {};
}

export function buildLeadPromptMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "Thanks. I have a better understanding of your requirement.\n\nWould you like our team to contact you?",
      actions: LEAD_PROMPT_ACTIONS,
    },
  ];
}

export function buildContextualContactMessages(context: ChatbotContext): ChatMessage[] {
  const card = context.serviceSlug ? getServiceCard(context.serviceSlug) : undefined;
  const text = card
    ? `Of course. Since you're exploring ${card.name} support, you can speak directly with our EMC team.`
    : "Of course — you can speak directly with our EMC team.";
  return [{ id: nextId(), from: "bot", kind: "actions", text, actions: [{ id: "lead:whatsapp", label: "WhatsApp EMC" }, { id: "lead:call", label: "Request a Call" }] }];
}

export function buildPricingMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "Pricing depends on the hospital's size, scope and current requirements. Our team can assess your requirement and provide the appropriate quotation.",
      actions: [{ id: "lead:call", label: "Request Consultation" }, { id: "lead:whatsapp", label: "WhatsApp EMC" }],
    },
  ];
}

export function buildMedicalSafetyMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      kind: "actions",
      text: "I'm designed to help with EMC Healthcare Services and business/service enquiries rather than provide medical diagnosis or emergency medical advice. For an urgent medical situation, please contact appropriate emergency medical services or a qualified healthcare professional.",
      actions: [{ id: "back-to-services", label: "Back to EMC Services" }],
    },
  ];
}

export function buildCatalogueMessages(): ChatMessage[] {
  return [
    { id: nextId(), from: "bot", kind: "text", text: CATALOGUE_SUMMARY },
    { id: nextId(), from: "bot", kind: "actions", text: "Which would you like to explore?", actions: TOP_LEVEL_ACTIONS },
  ];
}

export function buildFallbackMessages(text: string): ChatMessage[] {
  const looksFactual = /^(is|does|do you|can you|are|will|has)\b/i.test(text.trim());
  const message = looksFactual
    ? "I don't have enough information to answer that accurately. Our EMC team can clarify this for you."
    : "I can help you with EMC Healthcare Services, hospital/clinic requirements, compliance, accreditation, documentation, staffing, growth, setup and related services.\n\nYou can tell me what you're trying to achieve in your own words.";
  const actions: ChatAction[] = looksFactual
    ? [{ id: "whatsapp-now", label: "WhatsApp EMC" }]
    : [{ id: "back-to-services", label: "Find My Service" }, { id: "talk-to-emc", label: "Talk to EMC" }, { id: "whatsapp-now", label: "WhatsApp EMC" }];
  return [{ id: nextId(), from: "bot", kind: "text", text: message }, { id: nextId(), from: "bot", kind: "actions", actions }];
}

export function buildWhatsAppMessage(context: ChatbotContext): string {
  const card = context.serviceSlug ? getServiceCard(context.serviceSlug) : undefined;
  const lines: string[] = ["Hello EMC Healthcare Services,", ""];
  lines.push(card ? `I am interested in ${card.name}.` : "I would like to know more about your healthcare consulting services.", "");

  const details: string[] = [];
  if (context.facilityType) details.push(`Facility: ${context.facilityType}`);
  if (context.bedStrength) details.push(`Bed Strength: ${context.bedStrength}`);
  if (context.requirementType) details.push(`Requirement: ${context.requirementType}`);
  if (context.staffType) details.push(`Staff type: ${context.staffType}`);
  if (details.length) lines.push(...details, "");

  lines.push("I would like to discuss this with your team.");
  return lines.join("\n");
}

/** Re-exported here so the widget has one import surface for engine-adjacent matching. */
export { matchServicesFromText, matchLifeSituation, getCategoryForService, getServiceCard };
