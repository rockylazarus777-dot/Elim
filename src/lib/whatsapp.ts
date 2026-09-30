/**
 * Server-side Meta WhatsApp Cloud API client — used only by
 * src/app/api/whatsapp/ and src/app/api/admin/whatsapp/ routes. Never import
 * this from a "use client" component: WHATSAPP_ACCESS_TOKEN must never
 * reach the browser.
 *
 * Graph API version verified directly against Meta's own changelog
 * (developers.facebook.com/docs/graph-api/changelog) at the time this was
 * written — latest stable was v26.0. Bump the constant below (not an env
 * var — this isn't a per-environment credential) once Meta deprecates it.
 */

const GRAPH_API_VERSION = "v26.0";
const GRAPH_API_BASE = "https://graph.facebook.com";
const GRAPH_API_TIMEOUT_MS = 10_000;

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Never log/return a full customer phone number — only the last 4 digits, for correlating support requests. */
export function maskPhone(phone: string): string {
  return phone.length <= 4 ? "***" : `***${phone.slice(-4)}`;
}

type GraphApiErrorBody = {
  error?: { message?: string; type?: string; code?: number; error_subcode?: number; fbtrace_id?: string; error_data?: { details?: string } };
};

export class WhatsAppApiError extends Error {
  status?: number;
  /** Meta's error code when the Graph API rejected the request (e.g. 131047, 131026). */
  metaCode?: number;
  /** Meta's short error message, for admin diagnostics only — never shown to customers. */
  metaTitle?: string;
  /** True when the request timed out: Meta may or may not have sent the message. */
  timedOut?: boolean;

  constructor(message: string, status?: number, details: { metaCode?: number; metaTitle?: string; timedOut?: boolean } = {}) {
    super(message);
    this.name = "WhatsAppApiError";
    this.status = status;
    this.metaCode = details.metaCode;
    this.metaTitle = details.metaTitle;
    this.timedOut = details.timedOut;
  }
}

/**
 * POSTs one message object to /{phone-number-id}/messages and returns Meta's
 * message id (wamid). Shared by every sender below; logs are masked and
 * never include the message content or the access token.
 */
async function postGraphMessage(to: string, message: Record<string, unknown>, description: string): Promise<{ messageId?: string }> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new WhatsAppApiError(
      "WhatsApp Cloud API is not configured (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing).",
    );
  }

  const url = `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;
  const requestBody = { messaging_product: "whatsapp", recipient_type: "individual", to, ...message };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GRAPH_API_TIMEOUT_MS);

  let response: Response;
  let data: unknown;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: "no-store",
    });
    data = await response.json().catch(() => null);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    // eslint-disable-next-line no-console
    console.error(
      timedOut
        ? `[whatsapp] Graph API request timed out after ${GRAPH_API_TIMEOUT_MS}ms for ${maskPhone(to)}`
        : `[whatsapp] Network error reaching Graph API for ${maskPhone(to)}: ${error instanceof Error ? error.name : "unknown"}`,
    );
    throw new WhatsAppApiError(
      timedOut ? "WhatsApp Cloud API request timed out." : "Could not reach the WhatsApp Cloud API.",
      undefined,
      { timedOut },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    // Diagnostic fields only — Meta's error body never contains the access
    // token. Callers decide what (if anything) to show; never raw to customers.
    const errorObj = data && typeof data === "object" ? (data as GraphApiErrorBody).error : undefined;
    // eslint-disable-next-line no-console
    console.error(`[whatsapp] Graph API rejected send to ${maskPhone(to)}`, {
      status: response.status,
      code: errorObj?.code,
      subcode: errorObj?.error_subcode,
      type: errorObj?.type,
      message: errorObj?.message,
      fbtrace_id: errorObj?.fbtrace_id,
    });
    throw new WhatsAppApiError("WhatsApp Cloud API rejected the request.", response.status, {
      metaCode: errorObj?.code,
      metaTitle: errorObj?.message,
    });
  }

  const messageId =
    data && typeof data === "object"
      ? (data as { messages?: { id?: string }[] }).messages?.[0]?.id
      : undefined;

  // eslint-disable-next-line no-console
  console.log(`[whatsapp] ${description} sent to ${maskPhone(to)}${messageId ? ` (id: ${messageId})` : ""}`);

  return { messageId };
}

/** A VIDEO header's media: a public HTTPS MP4 URL, or an uploaded media ID (expires after ~30 days). */
export type TemplateHeaderVideo = { link: string } | { id: string };

type TemplateComponent =
  | { type: "header"; parameters: { type: "video"; video: TemplateHeaderVideo }[] }
  | { type: "body"; parameters: { type: "text"; text: string; parameter_name?: string }[] };

/**
 * Sends one approved WhatsApp template message via the Graph API.
 * `languageCode` must exactly match the language code shown for this
 * template in WhatsApp Manager (Meta Business Suite) — commonly "en" for a
 * template created as plain "English", but verify before the first send;
 * a mismatch returns a "template not found" error from Meta, not a crash.
 *
 * Body variables: pass `bodyParams` for a POSITIONAL template ({{1}}, {{2}}…)
 * or `namedBodyParams` for a NAMED one ({{customer_name}}) — never both.
 * `headerVideo` is required by templates with a VIDEO header. Static buttons
 * need no parameters. With none of these, no `components` are sent at all.
 */
export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode,
  bodyParams = [],
  namedBodyParams = {},
  headerVideo,
}: {
  to: string;
  templateName: string;
  languageCode: string;
  bodyParams?: string[];
  namedBodyParams?: Record<string, string>;
  headerVideo?: TemplateHeaderVideo;
}): Promise<{ messageId?: string }> {
  const namedEntries = Object.entries(namedBodyParams);
  if (namedEntries.length > 0 && bodyParams.length > 0) {
    throw new WhatsAppApiError("A template's body parameters are either positional or named, not both.");
  }

  const components: TemplateComponent[] = [];
  if (headerVideo) {
    components.push({ type: "header", parameters: [{ type: "video", video: headerVideo }] });
  }
  if (namedEntries.length > 0) {
    components.push({
      type: "body",
      parameters: namedEntries.map(([parameter_name, text]) => ({ type: "text", parameter_name, text })),
    });
  } else if (bodyParams.length > 0) {
    components.push({ type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) });
  }

  return postGraphMessage(
    to,
    {
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(components.length > 0 ? { components } : {}),
      },
    },
    `Template "${templateName}"`,
  );
}

/** Maximum length of a WhatsApp text message body. */
export const WHATSAPP_TEXT_MAX_LENGTH = 4096;

/**
 * Sends one free-form text message. Meta only accepts these inside the
 * 24-hour customer service window (since the customer's last message);
 * callers must check that first — outside it, Meta rejects the request and
 * a template is required instead.
 */
export async function sendWhatsAppText({ to, body }: { to: string; body: string }): Promise<{ messageId?: string }> {
  return postGraphMessage(to, { type: "text", text: { preview_url: false, body } }, "Text message");
}
