import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mailer";

/**
 * Contact form submission endpoint.
 *
 * Validates and sanitizes input server-side, rejects honeypot hits, and
 * applies a simple in-memory rate limit per IP. No credentials are read from
 * anywhere except environment variables (see .env.example) — nothing is
 * hardcoded here.
 *
 * IMPORTANT (production note): the in-memory rate limiter below resets on
 * every server restart/redeploy and does not share state across serverless
 * instances. For real production traffic, replace it with a durable store
 * (e.g. Upstash Redis, or your hosting platform's rate-limiting feature).
 *
 * Email delivery goes through Gmail SMTP (see src/lib/mailer.ts) —
 * GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_FORM_TO_EMAIL, documented in
 * .env.example. Until those are set in the environment, sendMail() throws
 * and this route correctly reports failure instead of a false success.
 */

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  organisation: z.string().trim().min(2, "Please enter your hospital/clinic name.").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
  email: z.union([z.string().trim().email("Please enter a valid email address."), z.literal("")]).optional(),
  service: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Please share a few details about your requirement.").max(4000),
  // Honeypot — deliberately unconstrained here (no .max(0)/error message) so
  // a non-empty value doesn't fail schema validation and short-circuit
  // straight to a 400 that reveals the honeypot to the bot; the handler
  // below checks this value itself and silently no-ops instead.
  company_website: z.string().max(500).optional(),
  // Meta/Google Ads campaign attribution, captured client-side from the
  // landing URL (see src/lib/utm.ts) and passed through so it's visible
  // alongside the enquiry, not just in analytics.
  utm_source: z.string().trim().max(200).optional(),
  utm_medium: z.string().trim().max(200).optional(),
  utm_campaign: z.string().trim().max(200).optional(),
  utm_content: z.string().trim().max(200).optional(),
  utm_term: z.string().trim().max(200).optional(),
  gclid: z.string().trim().max(200).optional(),
  fbclid: z.string().trim().max(200).optional(),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

async function sendEnquiryEmail(data: z.infer<typeof ContactSchema>) {
  const lines = [
    `Name: ${data.name}`,
    `Organisation: ${data.organisation}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    data.service ? `Service: ${data.service}` : null,
    "",
    "Message:",
    data.message,
    "",
    data.utm_source || data.utm_medium || data.utm_campaign || data.utm_content || data.utm_term || data.gclid || data.fbclid
      ? "--- Campaign attribution ---"
      : null,
    data.utm_source ? `utm_source: ${data.utm_source}` : null,
    data.utm_medium ? `utm_medium: ${data.utm_medium}` : null,
    data.utm_campaign ? `utm_campaign: ${data.utm_campaign}` : null,
    data.utm_content ? `utm_content: ${data.utm_content}` : null,
    data.utm_term ? `utm_term: ${data.utm_term}` : null,
    data.gclid ? `gclid: ${data.gclid}` : null,
    data.fbclid ? `fbclid: ${data.fbclid}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  await sendMail({
    subject: `New enquiry from ${data.organisation}`,
    text: lines,
  });

  // eslint-disable-next-line no-console
  console.log("[contact-form] New enquiry sent:", { name: data.name, organisation: data.organisation, service: data.service });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`contact:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ message: firstIssue?.message ?? "Invalid submission." }, { status: 400 });
  }

  if (parsed.data.company_website) {
    // Honeypot triggered — silently accept to avoid tipping off bots, but do nothing.
    return NextResponse.json({ ok: true });
  }

  try {
    await sendEnquiryEmail(parsed.data);
  } catch {
    return NextResponse.json(
      { message: "We couldn't send your enquiry right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
