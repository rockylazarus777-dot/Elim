import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin, type EnquiryRow } from '@/lib/supabase';
import {
  getTransporter,
  adminEmailTemplate,
  userEmailTemplate,
  type EnquiryPayload,
} from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const enquirySchema = z.object({
  name: z.string().min(2).max(120),
  hospitalName: z.string().min(2).max(160),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d\s()-]+$/),
  email: z.string().email().max(180),
  message: z.string().min(10).max(2000),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
  recaptchaToken: z.string().optional(),
});

// Naive in-memory rate limit (per server instance). For production scale,
// swap for Upstash/Redis or a Supabase function.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(key: string) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot check
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true }); // silent success
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken);
    if (!recaptcha.ok) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed.' },
        { status: 400 }
      );
    }

    const payload: EnquiryPayload = {
      name: parsed.data.name.trim(),
      hospitalName: parsed.data.hospitalName.trim(),
      phone: parsed.data.phone.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      message: parsed.data.message.trim(),
    };

    // 1) Save to Supabase (best-effort — logs and continues if not configured)
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: EnquiryRow = {
        name: payload.name,
        hospital_name: payload.hospitalName,
        phone: payload.phone,
        email: payload.email,
        message: payload.message,
        source: 'website',
        user_agent: userAgent,
        ip,
      };
      const { error } = await supabase.from('enquiries').insert(row);
      if (error) {
        console.error('[enquiry] supabase insert error:', error.message);
      }
    } else {
      console.warn('[enquiry] Supabase not configured — skipping persistence');
    }

    // 2) Send emails (admin + confirmation)
    const transporter = getTransporter();
    const adminTo = process.env.ADMIN_EMAIL || 'info@emcforyou.com';
    const from =
      process.env.SMTP_FROM ||
      'Elim Medical Consultancy <noreply@emcforyou.com>';

    if (transporter) {
      try {
        await Promise.all([
          transporter.sendMail({
            from,
            to: adminTo,
            replyTo: payload.email,
            subject: `New enquiry — ${payload.hospitalName}`,
            html: adminEmailTemplate(payload, { ip, userAgent }),
          }),
          transporter.sendMail({
            from,
            to: payload.email,
            subject: 'We received your enquiry — Elim Medical Consultancy',
            html: userEmailTemplate(payload),
          }),
        ]);
      } catch (err) {
        console.error('[enquiry] email send error:', err);
        // Do not fail the request — the lead is already persisted.
      }
    } else {
      console.warn('[enquiry] SMTP not configured — skipping email');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[enquiry] unexpected error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
