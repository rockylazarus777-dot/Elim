# Elim Medical Consultancy (EMC) — Website

Production-ready, SEO-optimized, lead-generating website for Elim Medical
Consultancy — a hospital growth partner for 20–50 bed hospitals.

Stack:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + ShadCN-style UI primitives
- Framer Motion (section + interaction animations)
- Lottie (hero animation)
- Supabase (Postgres) for enquiry storage
- Nodemailer (admin + user confirmation emails)
- reCAPTCHA v3 (anti-spam)
- Google Analytics + Tag Manager hooks
- Auto sitemap.xml + robots.txt + OpenGraph image

---

## 1. Quick start

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env.local
# fill in Supabase, SMTP, reCAPTCHA, GA values

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## 2. Environment variables

See `.env.example`. The site degrades gracefully:

- **No Supabase** → enquiries are not persisted, but the form still works and emails still send.
- **No SMTP** → enquiries are persisted but no email goes out (the API logs a warning).
- **No reCAPTCHA** → verification is skipped (intended for local dev only).

For production, configure all three.

### Recommended SMTP

Gmail (app password), Zoho, Brevo, Resend (via SMTP), or AWS SES. For Gmail:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-account@gmail.com
SMTP_PASSWORD=<gmail-app-password>
SMTP_FROM="Elim Medical Consultancy <your-account@gmail.com>"
ADMIN_EMAIL=info@emcforyou.com
```

## 3. Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql` (creates `enquiries` table + RLS).
3. Copy your project URL → `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the **service role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only).
5. Optional: copy the anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public).

### Export enquiries to CSV

```bash
npm run export:enquiries
# writes ./exports/enquiries-<timestamp>.csv
```

## 4. SEO

Already wired:

- Auto-generated `sitemap.xml` (`/sitemap.xml`) — includes blog posts.
- `robots.txt` (`/robots.txt`).
- OpenGraph + Twitter card meta on every page.
- Dynamic OG image via `app/opengraph-image.tsx` (PNG generated at request time).
- JSON-LD structured data for `MedicalBusiness` + `WebSite`.
- Per-blog-post `BlogPosting` schema.
- Verification meta for Google Search Console + Bing Webmaster (set
  `NEXT_PUBLIC_GOOGLE_VERIFICATION` and `NEXT_PUBLIC_BING_VERIFICATION`).

After deploying:

1. Submit `https://www.emcforyou.com/sitemap.xml` to Google Search Console.
2. Submit the same URL to Bing Webmaster.
3. Add the GA / GTM IDs to `.env.production`.

## 5. Blog

The blog ships with a static-data adapter in `lib/blog.ts` (no CMS needed).
To migrate to a headless CMS like Sanity:

1. Install the Sanity client: `npm i @sanity/client`.
2. Replace the `getAllBlogPosts` and `getBlogPost` implementations in
   `lib/blog.ts` with Sanity GROQ queries.
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

## 6. Deployment

### Option A — Vercel (recommended)

1. Push the repo to GitHub.
2. In Vercel, "New Project" → import the repo.
3. Add all env vars from `.env.example` under Project → Settings → Environment Variables.
4. Deploy.
5. Add the production domain `www.emcforyou.com` and follow DNS instructions.

### Option B — Hostinger (Node hosting / VPS)

1. SSH into the VPS (or open Node hosting terminal).
2. Install Node.js 18+.
3. Clone repo, install deps, build:
   ```bash
   git clone <repo>
   cd emc
   npm ci
   npm run build
   ```
4. Add env vars in the Hostinger dashboard or as a `.env` file.
5. Start with PM2:
   ```bash
   npm i -g pm2
   pm2 start npm --name emc -- run start
   pm2 save && pm2 startup
   ```
6. Point your domain to the VPS, set up Nginx as a reverse proxy to port 3000,
   and enable HTTPS (Let's Encrypt).

### Option C — Static export to Hostinger shared hosting

Not recommended — the API route, OG image, and email sending all require a
Node server. Use Option A or B.

## 7. Project structure

```
app/
  api/enquiry/route.ts     ← form submission API (Supabase + email)
  api/health/route.ts      ← health check
  blog/page.tsx            ← blog index
  blog/[slug]/page.tsx     ← blog detail
  privacy/                 ← privacy policy
  terms/                   ← terms of service
  layout.tsx               ← root layout (SEO, fonts, providers)
  page.tsx                 ← home page (composes all sections)
  opengraph-image.tsx      ← dynamic OG image
  sitemap.ts               ← auto sitemap
  robots.ts                ← auto robots
  globals.css
components/
  ui/                      ← Button, Card, Input, Textarea, Label, Badge, Toaster
  Navbar.tsx               ← sticky nav with mobile drawer
  Hero.tsx                 ← Lottie + headline + CTAs
  TrustBar.tsx
  About.tsx
  Services.tsx             ← 7-card service grid (4+3 layout)
  Impact.tsx               ← 30-day timeline
  WhyChooseUs.tsx
  CTA.tsx
  Contact.tsx              ← contact info + form
  EnquiryForm.tsx          ← validated form, reCAPTCHA, fetch /api/enquiry
  Footer.tsx
  WhatsAppButton.tsx       ← floating WA button
  Logo.tsx
  Analytics.tsx            ← GA + GTM scripts
  StructuredData.tsx       ← JSON-LD
lib/
  utils.ts                 ← cn(), SITE constants
  supabase.ts              ← server admin client
  email.ts                 ← Nodemailer + branded HTML templates
  recaptcha.ts             ← v3 token verification
  blog.ts                  ← blog data adapter
public/
  favicon.svg
  og-image.svg             ← static fallback OG (also generated dynamically)
  site.webmanifest
scripts/
  export-enquiries.ts      ← CSV export from Supabase
supabase/
  schema.sql               ← enquiries table + RLS
```

## 8. Performance & accessibility

- All images use `next/image` with explicit sizes for LCP friendliness.
- Lottie animation is dynamically imported (no SSR overhead).
- Reduced-motion users still get fade-in via Framer Motion defaults.
- All interactive elements have visible focus rings.
- Color contrast meets WCAG AA on the primary palette.

## 9. License

© Elim Medical Consultancy. All rights reserved.
