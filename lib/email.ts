import nodemailer from 'nodemailer';
import { SITE } from './utils';

let cachedTransporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE ?? 'true') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
  return cachedTransporter;
}

export type EnquiryPayload = {
  name: string;
  hospitalName: string;
  phone: string;
  email: string;
  message: string;
};

/* ============================================================
 * Branded HTML email templates
 * Inline styles only — required for email client compatibility.
 * ============================================================ */

const BRAND_PRIMARY = '#0B3C5D';
const BRAND_ACCENT = '#1D70B8';
const BRAND_BG = '#F4F8FC';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shellTemplate(opts: {
  preheader: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const { preheader, heading, intro, bodyHtml, ctaLabel, ctaHref } = opts;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:Inter,Arial,sans-serif;color:#1A1A1A;">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(11,60,93,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,${BRAND_ACCENT},${BRAND_PRIMARY});padding:28px 32px;color:#ffffff;">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:18px;font-weight:700;letter-spacing:0.3px;">Elim Medical Consultancy</td>
            <td align="right" style="font-size:12px;opacity:0.85;">www.emcforyou.com</td>
          </tr></table>
        </td>
      </tr>
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.25;color:${BRAND_PRIMARY};">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#444;">${intro}</p>
        ${bodyHtml}
        ${
          ctaHref && ctaLabel
            ? `<div style="margin:28px 0 4px 0;">
                <a href="${ctaHref}" style="display:inline-block;background:${BRAND_PRIMARY};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:14px;font-size:14px;">${escapeHtml(ctaLabel)}</a>
              </div>`
            : ''
        }
      </td></tr>
      <tr><td style="background:#F8FAFC;padding:20px 32px;border-top:1px solid #E5E7EB;">
        <p style="margin:0 0 4px 0;font-size:12px;color:#6B7280;">${escapeHtml(SITE.address)}</p>
        <p style="margin:0;font-size:12px;color:#6B7280;">${escapeHtml(SITE.phones[0])} · <a href="mailto:${SITE.email}" style="color:${BRAND_ACCENT};text-decoration:none;">${escapeHtml(SITE.email)}</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function adminEmailTemplate(p: EnquiryPayload, meta?: { ip?: string; userAgent?: string }) {
  const rows = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;">
      ${row('Name', p.name)}
      ${row('Hospital', p.hospitalName)}
      ${row('Phone', `<a href="tel:${escapeHtml(p.phone)}" style="color:${BRAND_ACCENT};text-decoration:none;">${escapeHtml(p.phone)}</a>`)}
      ${row('Email', `<a href="mailto:${escapeHtml(p.email)}" style="color:${BRAND_ACCENT};text-decoration:none;">${escapeHtml(p.email)}</a>`)}
      ${row('Message', escapeHtml(p.message).replace(/\n/g, '<br/>'))}
      ${meta?.ip ? row('IP', escapeHtml(meta.ip)) : ''}
      ${meta?.userAgent ? row('User Agent', escapeHtml(meta.userAgent)) : ''}
    </table>`;

  return shellTemplate({
    preheader: `New enquiry from ${p.name} (${p.hospitalName})`,
    heading: 'New website enquiry',
    intro: `A new enquiry was submitted on the EMC website. Details below.`,
    bodyHtml: rows,
    ctaLabel: 'Reply via email',
    ctaHref: `mailto:${p.email}`,
  });
}

export function userEmailTemplate(p: EnquiryPayload) {
  return shellTemplate({
    preheader: `Thanks ${p.name} — we received your enquiry.`,
    heading: `Thanks, ${escapeHtml(p.name)} — we've got your enquiry`,
    intro: `we've received your message and a senior consultant will reach out within one business day. Here&rsquo;s a copy of what you sent:`,
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;">
        ${row('Hospital', escapeHtml(p.hospitalName))}
        ${row('Phone', escapeHtml(p.phone))}
        ${row('Email', escapeHtml(p.email))}
        ${row('Message', escapeHtml(p.message).replace(/\n/g, '<br/>'))}
      </table>
      <p style="margin:24px 0 0 0;font-size:14px;line-height:1.6;color:#444;">
        In the meantime, you can also reach us on WhatsApp at
        <a href="https://wa.me/${SITE.whatsapp}" style="color:${BRAND_ACCENT};text-decoration:none;">+91 9600822491</a>.
      </p>`,
    ctaLabel: 'Visit our website',
    ctaHref: SITE.url,
  });
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:12px 16px;background:#F8FAFC;border-bottom:1px solid #E5E7EB;font-size:12px;color:#6B7280;width:140px;font-weight:600;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;border-bottom:1px solid #E5E7EB;font-size:14px;color:#1A1A1A;">${value}</td>
  </tr>`;
}
