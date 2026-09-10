export interface ChatAction {
  id: string;
  label: string;
}

export interface ChatProgress {
  step: number;
  total: number;
}

export type ChatMessage =
  | { id: string; from: "bot"; kind: "text"; text: string; progress?: ChatProgress }
  | { id: string; from: "bot"; kind: "actions"; text?: string; actions: ChatAction[]; progress?: ChatProgress }
  | { id: string; from: "bot"; kind: "service-card"; slug: string; actions: ChatAction[] }
  | { id: string; from: "bot"; kind: "typing" }
  | { id: string; from: "bot"; kind: "form"; defaultService: string }
  | { id: string; from: "user"; kind: "text"; text: string };

/**
 * Everything the bot has learned about the visitor's requirement during the
 * current conversation — read by the WhatsApp message builder, the lead
 * form's pre-fill, and contextual replies (e.g. "since you're exploring
 * NABH support for your hospital..."). Session-only, in memory; never
 * persisted or sent anywhere except the visitor's own enquiry submission.
 */
export interface ChatbotContext {
  serviceSlug?: string;
  facilityType?: string;
  bedStrength?: string;
  requirementType?: string;
  urgency?: string;
  staffType?: string;
}
