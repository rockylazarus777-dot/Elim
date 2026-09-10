/**
 * Gmail SMTP email delivery, shared by every API route that needs to notify
 * EMC of a new lead (contact form, chatbot enquiry).
 *
 * Credentials are read from environment variables only — GMAIL_USER,
 * GMAIL_APP_PASSWORD (a Gmail *App Password*, not the account password —
 * see https://myaccount.google.com/apppasswords, requires 2-Step
 * Verification on the sending account) and CONTACT_FORM_TO_EMAIL. Nothing
 * here is ever exposed to the browser: this module only runs in API routes.
 *
 * If any of those three are missing, `sendMail` throws rather than
 * pretending to succeed — callers (the API routes) already turn that into a
 * proper error response instead of a false "email sent" success message.
 */

import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export function isMailerConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.CONTACT_FORM_TO_EMAIL);
}

export async function sendMail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const transport = getTransporter();
  const to = process.env.CONTACT_FORM_TO_EMAIL;
  if (!transport || !to) {
    throw new Error("Gmail SMTP is not configured (GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_FORM_TO_EMAIL missing).");
  }

  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  });
}
