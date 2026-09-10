import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mailer";

/**
 * Chatbot "Yes, Contact Me" enquiry endpoint — a lighter-weight sibling of
 * /api/contact for leads that start inside the chat widget (see
 * src/components/chatbot/). Deliberately doesn't require the hospital/clinic
 * name the main Contact page form does; the chatbot flow doesn't collect it.
 * Same validation/rate-limit/Gmail-SMTP shape as the main contact route
 * (src/app/api/contact/route.ts) otherwise, sharing its rate limiter.
 */

const ChatEnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
  email: z.union([z.string().trim().email("Please enter a valid email address."), z.literal("")]).optional(),
  organization: z.string().trim().max(160).optional(),
  city: z.string().trim().max(120).optional(),
  service: z.string().trim().max(160).optional(),
  message: z.string().trim().min(3, "Please share a few words about your requirement.").max(4000),
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

async function sendChatEnquiryEmail(data: z.infer<typeof ChatEnquirySchema>) {
  const lines = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    data.organization ? `Organization: ${data.organization}` : null,
    data.city ? `City: ${data.city}` : null,
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
    subject: `New chatbot enquiry from ${data.name}`,
    text: lines,
  });

  // eslint-disable-next-line no-console
  console.log("[chat-enquiry] New chatbot enquiry sent:", { name: data.name, organization: data.organization, service: data.service });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`chat-enquiry:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = ChatEnquirySchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ message: firstIssue?.message ?? "Invalid submission." }, { status: 400 });
  }

  try {
    await sendChatEnquiryEmail(parsed.data);
  } catch {
    return NextResponse.json(
      { message: "We couldn't send your enquiry right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
