import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { secureCompare } from "@/lib/secure-compare";
import {
  isWhatsAppConfigured,
  sendWhatsAppTemplate,
  type TemplateHeaderVideo,
  WhatsAppApiError,
} from "@/lib/whatsapp";

/**
 * Internal test endpoint for allowlisted WhatsApp Cloud API templates (see
 * TEMPLATES below; defaults to "emc_healthcare_services_intro"). Sends
 * exactly one template message per request. Not called from any UI and not
 * wired to the contact or chat-enquiry forms.
 *
 * Protected by WHATSAPP_INTERNAL_API_SECRET: callers must send it in the
 * `x-whatsapp-internal-secret` header, server-to-server only — never from
 * browser code. Fails closed: if the secret isn't configured on the server,
 * every request is rejected with 401.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPLATE_KEYS = ["emc_healthcare_services_intro", "hello_world"] as const;
type TemplateKey = (typeof TEMPLATE_KEYS)[number];

type TemplateConfig = {
  languageCode: string;
  /** Sends customer_name as the NAMED body variable {{customer_name}}. */
  usesCustomerName: boolean;
  /** Template has a VIDEO header — media comes from server config (getIntroVideo), never the caller. */
  requiresIntroVideo: boolean;
};

/**
 * Allowlist of sendable templates — callers pick one by key, never by an
 * arbitrary name. Each entry mirrors the template's approved structure in
 * WhatsApp Manager (WABA 1470397824898596); `languageCode` must match it
 * exactly (see src/lib/whatsapp.ts's note on sendWhatsAppTemplate).
 * Static buttons (e.g. "Call EMC", "Visit website") need no parameters.
 */
const TEMPLATES: Record<TemplateKey, TemplateConfig> = {
  // MARKETING · NAMED · VIDEO header · body {{customer_name}} · static buttons.
  emc_healthcare_services_intro: { languageCode: "en", usesCustomerName: true, requiresIntroVideo: true },
  // Meta's stock sample template — no variables. Used for connectivity tests.
  hello_world: { languageCode: "en_US", usesCustomerName: false, requiresIntroVideo: false },
};

const DEFAULT_TEMPLATE: TemplateKey = "emc_healthcare_services_intro";

const INTERNAL_SECRET_HEADER = "x-whatsapp-internal-secret";

const SendTemplateSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .min(8, "Please provide a valid phone number in international format (with country code).")
      .max(20)
      .regex(/^\+?[1-9][0-9]{7,14}$/, "Phone number must be digits only (optionally prefixed with +), including country code, no spaces or symbols."),
    template: z.enum(TEMPLATE_KEYS).default(DEFAULT_TEMPLATE),
    // Meta rejects text parameters containing new-lines, tabs or more than
    // 4 consecutive spaces — catch that here with a clear 400 instead.
    customer_name: z
      .string()
      .trim()
      .min(1, "customer_name cannot be empty.")
      .max(100, "customer_name must be 100 characters or fewer.")
      .refine((value) => !/[\r\n\t]/.test(value), "customer_name cannot contain line breaks or tabs.")
      .refine((value) => !/ {5,}/.test(value), "customer_name cannot contain more than 4 consecutive spaces.")
      .optional(),
  })
  .refine((data) => !TEMPLATES[data.template].usesCustomerName || Boolean(data.customer_name), {
    message: "customer_name is required for this template.",
  });

/**
 * VIDEO header media for emc_healthcare_services_intro, from server config
 * only. WHATSAPP_INTRO_VIDEO_URL (public HTTPS MP4, H.264/AAC, ≤16 MB) takes
 * precedence over WHATSAPP_INTRO_VIDEO_MEDIA_ID (uploaded media, expires
 * after ~30 days). Returns null when neither is usable.
 */
function getIntroVideo(): TemplateHeaderVideo | null {
  const link = process.env.WHATSAPP_INTRO_VIDEO_URL?.trim();
  if (link) {
    try {
      if (new URL(link).protocol === "https:") return { link };
    } catch {
      // fall through to the warning below
    }
    // eslint-disable-next-line no-console
    console.warn("[whatsapp] WHATSAPP_INTRO_VIDEO_URL is not a valid https:// URL — ignoring it.");
  }
  const id = process.env.WHATSAPP_INTRO_VIDEO_MEDIA_ID?.trim();
  return id ? { id } : null;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.WHATSAPP_INTERNAL_API_SECRET;
  if (!expected) {
    // eslint-disable-next-line no-console
    console.warn("[whatsapp] WHATSAPP_INTERNAL_API_SECRET is not set — send-template endpoint is locked.");
    return false;
  }
  const provided = request.headers.get(INTERNAL_SECRET_HEADER);
  return provided !== null && secureCompare(provided, expected);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit before auth so secret-guessing attempts are throttled too.
  if (isRateLimited(`whatsapp-send-template:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      { message: "WhatsApp Cloud API is not configured on this server yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = SendTemplateSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ message: firstIssue?.message ?? "Invalid submission." }, { status: 400 });
  }

  // Graph API expects digits only (with country code, no leading "+").
  const to = parsed.data.phone.replace(/^\+/, "");
  const template = TEMPLATES[parsed.data.template];

  const headerVideo = template.requiresIntroVideo ? getIntroVideo() : null;
  if (template.requiresIntroVideo && !headerVideo) {
    return NextResponse.json(
      { message: "The intro video for this template is not configured on this server yet." },
      { status: 503 },
    );
  }

  try {
    const { messageId } = await sendWhatsAppTemplate({
      to,
      templateName: parsed.data.template,
      languageCode: template.languageCode,
      namedBodyParams:
        template.usesCustomerName && parsed.data.customer_name ? { customer_name: parsed.data.customer_name } : {},
      headerVideo: headerVideo ?? undefined,
    });
    return NextResponse.json({ ok: true, messageId });
  } catch (error) {
    // Details are already logged server-side by sendWhatsAppTemplate; the
    // caller only ever gets a generic message, never Meta's raw error text.
    if (!(error instanceof WhatsAppApiError)) {
      // eslint-disable-next-line no-console
      console.error("[whatsapp] Unexpected error in send-template:", error instanceof Error ? error.name : "unknown");
    }
    return NextResponse.json({ ok: false, message: "We couldn't send the WhatsApp message right now." }, { status: 502 });
  }
}
