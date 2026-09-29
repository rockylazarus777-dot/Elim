import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { secureCompare } from "@/lib/secure-compare";
import { isWhatsAppConfigured, sendWhatsAppTemplate, WhatsAppApiError } from "@/lib/whatsapp";

/**
 * Internal test endpoint for the approved "emc_healthcare_services_intro"
 * WhatsApp Cloud API template. Sends exactly one template message per
 * request. Not called from any UI and not wired to the contact or
 * chat-enquiry forms.
 *
 * Protected by WHATSAPP_INTERNAL_API_SECRET: callers must send it in the
 * `x-whatsapp-internal-secret` header, server-to-server only — never from
 * browser code. Fails closed: if the secret isn't configured on the server,
 * every request is rejected with 401.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPLATE_NAME = "emc_healthcare_services_intro";
// Must match the language code shown for this template in WhatsApp Manager
// exactly (commonly "en" for a template created as plain "English") — see
// src/lib/whatsapp.ts's note on sendWhatsAppTemplate.
const TEMPLATE_LANGUAGE_CODE = "en";

const INTERNAL_SECRET_HEADER = "x-whatsapp-internal-secret";

const SendTemplateSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(8, "Please provide a valid phone number in international format (with country code).")
    .max(20)
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Phone number must be digits only (optionally prefixed with +), including country code, no spaces or symbols."),
  customer_name: z.string().trim().min(1, "customer_name is required.").max(100),
});

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

  try {
    const { messageId } = await sendWhatsAppTemplate({
      to,
      templateName: TEMPLATE_NAME,
      languageCode: TEMPLATE_LANGUAGE_CODE,
      bodyParams: [parsed.data.customer_name],
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
