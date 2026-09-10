# EMC Healthcare Services — Corporate Website

A production-ready Next.js website for **EMC Healthcare Services Pvt. Ltd.** (formerly Elim Medical Consultancy), built around the company's real service portfolio, with SEO/AEO/GEO baked into the architecture rather than bolted on.

> **Status: content-complete, asset-incomplete.** Every fact on this site comes from EMC's own internal training material — nothing about the company, its services, or its clients has been invented. What's still missing is company-supplied media and contact details. See **"What's still needed from you"** below before this goes live.

> **v2 — visual redesign.** The UI has been rebuilt from a text-heavy service-card grid into an image-forward, interactive, editorial site: an interactive Services Explorer, scroll-reveal storytelling, a horizontal-scroll Clients showcase, a filterable masonry Gallery with a full lightbox, an interactive "How We Work" process section, and a large visual "Why EMC" section — all built around one new component, `ThemedVisual`, so real photography can be dropped in later with a one-line prop change and no rewriting. See **Section C1** for exactly how. No company facts, statistics, or claims changed in this pass — only presentation.

---

## A. Project structure

```
emc-website/
├── public/
│   └── images/placeholders/     # Placeholder SVGs (hero, OG image) — replace with real photos
├── src/
│   ├── app/                     # Next.js App Router — one folder per route
│   │   ├── layout.tsx           # Root layout: fonts, header/footer, global JSON-LD, analytics
│   │   ├── page.tsx             # Homepage — visual storytelling flow (see Section B)
│   │   ├── sitemap.ts           # Auto-generated XML sitemap
│   │   ├── robots.ts            # Auto-generated robots.txt
│   │   ├── not-found.tsx        # Custom 404
│   │   ├── icon.svg             # Browser tab icon
│   │   ├── about/page.tsx               # Editorial split-screen About
│   │   ├── services/page.tsx            # Services index + interactive Services Explorer
│   │   ├── services/[slug]/page.tsx     # Dynamic service detail page (16 services)
│   │   ├── clients/page.tsx
│   │   ├── gallery/page.tsx             # Filterable masonry gallery + lightbox
│   │   ├── blog/page.tsx                # Blog index — featured + grid
│   │   ├── blog/[slug]/page.tsx         # Dynamic article page (5 articles)
│   │   ├── contact/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-and-conditions/page.tsx
│   │   ├── cookie-policy/page.tsx
│   │   └── api/contact/route.ts         # Contact form submission endpoint
│   ├── components/
│   │   ├── layout/     # Header (scroll-aware, active-link indicator), Footer, MobileNav
│   │   │                 (fullscreen slide-in), Logo
│   │   ├── home/        # HeroSlider (image-only carousel, Ken Burns), AboutEditorial,
│   │   │                 ServicesExplorer, ProcessSection, WhyEmc, ClientsShowcase,
│   │   │                 BlogPreview
│   │   ├── gallery/     # GalleryMasonry (category filters), Lightbox (keyboard/swipe)
│   │   ├── shared/      # SectionHeading, ServiceCard, ClientCard, Breadcrumbs,
│   │   │                  CTASection, FullWidthStory, FAQ, ContactForm, ThemedVisual,
│   │   │                  Reveal, Counter, ServiceIcon, PlaceholderNote, Analytics
│   │   └── seo/         # JsonLd + schema builder functions
│   ├── content/          # All page copy as typed data (see below), incl. gallery-items.ts,
│   │                        process-steps.ts
│   ├── lib/               # site-config.ts (company facts), seo.ts (metadata builder),
│   │                        theme.ts (family → colour/gradient tokens)
│   └── types/             # Shared TypeScript content types
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

### Content model (section 24 of the brief)

Every service and blog post is a typed object in `src/content/`, not hardcoded into a page. Each one already carries its own SEO title, meta description, keywords, FAQs, and related-content links — that's what makes every route's metadata independent (see Section D). To add a 17th service or 6th article, add one object to `src/content/services.ts` or `src/content/blog-posts.ts`; the route, sitemap entry, and JSON-LD are generated automatically.

---

## B. Pages built (23 static routes + 2 dynamic route types)

| Route | Purpose |
|---|---|
| `/` | Homepage — image-only hero, service families, 14 core services, FAQ |
| `/about` | Company overview, areas of support, who EMC serves |
| `/services` | All services grouped by family |
| `/services/[slug]` | 16 individual service pages (14 core + 2 additional support) |
| `/clients` | Hospitals/clinics EMC has supported, grouped by service |
| `/gallery` | Filterable masonry gallery + full lightbox (noindex until real photos are added) |
| `/blog` | Knowledge hub index |
| `/blog/[slug]` | 5 educational articles on compliance/documentation/safety topics |
| `/contact` | Contact details + enquiry form |
| `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy` | Legal placeholders — see Section M |
| 404 | Custom not-found page |

**Not built:** `/products`, `/industries`, `/projects` as separate top-level sections — EMC's offering is services-based (not products), industry-specific pages would duplicate the "Who We Serve" content already on Home/About, and there isn't yet enough distinct project narrative (beyond names) to justify individual `/projects/[slug]` pages. All of this can be added later if you send fuller project case studies (see below).

---

## C. Components

**Layout:** `Header` (backdrop-blur on scroll, active-page underline), `Footer`, `MobileNav` (fullscreen slide-in panel), `Logo`.

**Homepage sections:** `HeroSlider` (image-only carousel), `AboutEditorial`, `ServicesExplorer`, `ProcessSection`, `WhyEmc`, `ClientsShowcase`, `BlogPreview`.

**Gallery:** `GalleryMasonry` (category filters + CSS-columns masonry), `Lightbox` (keyboard nav, swipe, focus trap).

**Shared:** `SectionHeading`, `ServiceCard`, `ClientCard`, `Breadcrumbs`, `CTASection`, `FullWidthStory`, `FAQ`, `ContactForm`, `ThemedVisual`, `Reveal`, `Counter`, `ServiceIcon`, `PlaceholderNote`, `TrackedContactLink`, `TrackedCtaLink`.

**SEO:** `JsonLd` + schema builders, `Analytics`, `RouteTracker`. See **Section R** for the full analytics/tag-management architecture.

Every page composes these rather than duplicating markup.

### C1. The visual system — `ThemedVisual`, and how to add your real photos

Every photo-shaped space on the site — hero-adjacent sections, service cards, the Services Explorer, gallery tiles, client cards, blog imagery — renders through **one component**: `src/components/shared/ThemedVisual.tsx`.

Today, with no company photography supplied yet, `ThemedVisual` draws a tasteful, on-brand generated placeholder: a gradient in the section's colour family, a fine grid texture, a centred icon relevant to that service/topic, and a small "Photo placeholder" badge so it's never mistaken for a real photo or a broken image. Each of the 17 services, 12 gallery items, 5 blog posts and every client card already has its own family colour + icon assigned, so the site has real visual variety even before a single photo exists.

**To add a real photo, you don't touch any component or layout code.** You add two fields to the relevant content entry:

```ts
// src/content/services.ts — example
{
  slug: "nabh-accreditation",
  // ...existing fields unchanged...
  photoSrc: "/images/services/nabh-documentation-review-emc.webp",
  photoAlt: "EMC consultant reviewing NABH accreditation documentation with hospital staff",
}
```

The same `photoSrc` / `photoAlt` pair works on entries in `src/content/services.ts`, `src/content/blog-posts.ts`, `src/content/gallery-items.ts`, and `src/content/clients.ts` (via `ClientEntry`). The moment `photoSrc` is set, `ThemedVisual` renders the real photograph instead of the generated placeholder — same container, same aspect ratio, same hover/zoom interaction, same `sizes`/lazy-loading behaviour — with zero changes anywhere else. Drop the actual image file into `public/images/...` first (see Section J for the filename convention), then add the two fields.

The five family colour themes (compliance/teal, documentation/clay, technical/plum, growth/sand, community/moss) live in `src/lib/theme.ts` if you ever want to adjust the placeholder palette itself.

---

## D. SEO architecture

- **Independent metadata per page** via `buildMetadata()` in `src/lib/seo.ts` — every route calls it with its own title, description, canonical path, keywords and OG image. Nothing is shared globally except the site name suffix.
- **Canonical URLs** generated from `NEXT_PUBLIC_SITE_URL` + the page's path.
- **Open Graph + Twitter Cards** on every page — falls back to the official EMC Meta Share Image (`public/images/branding/og-image.png`, Section R) until a page supplies its own real photo via `ogImage`.
- **Semantic HTML**: one `<h1>` per page, ordered `<h2>`/`<h3>`, `<nav>`, `<address>`, `<dl>`/`<dt>`/`<dd>` for FAQs and contact details.
- **Breadcrumbs** (visual + `BreadcrumbList` JSON-LD) on every non-home page.
- **`sitemap.xml`** (`src/app/sitemap.ts`) and **`robots.txt`** (`src/app/robots.ts`) generated automatically from the content data — new services/articles are included with no manual step.
- **No duplicate metadata**: each service/article's SEO title & description is written individually in its content object.

## E. AEO (Answer Engine Optimization)

- Every service page and 3 of 5 blog articles include a **question-and-answer FAQ section**, marked up with `FAQPage` JSON-LD, written in direct, factual language (no keyword stuffing).
- Section headings follow real question patterns people search for ("What is X?", "Who needs X?", "How does EMC help with X?").
- Blog articles are written to stand alone as genuinely useful answers, not landing pages disguised as articles.

## F. GEO (Generative Engine Optimization)

- `Organization`/`WebSite` JSON-LD on every page (global, in the root layout) establishes the company entity consistently.
- `Service` JSON-LD on every service page; `Article` JSON-LD on every blog post.
- Company name is used consistently everywhere (`EMC Healthcare Services Pvt. Ltd.`, with `Elim Medical Consultancy` noted as the former name) — no conflicting variants.
- Service descriptions, process steps and FAQs are written as clear, factual, extractable statements — matching the no-guarantee, no-fabrication language EMC's own team is trained to use.

## G. Structured data implemented

`Organization`, `WebSite`, `Service` (per service page), `BreadcrumbList` (every page), `FAQPage` (service/article pages with FAQs), `Article` (blog posts), `AboutPage`, `ContactPage`. **Not implemented:** `LocalBusiness` / `PostalAddress` — adding a fake address would be fabricated structured data. The moment you confirm a real public office address, tell us and we'll add proper local SEO (`LocalBusiness` schema, a Google Business Profile-ready address block, and city/service-area pages if relevant).

## H. Sitemap — `/sitemap.xml`, auto-generated from live content (services + blog posts + static routes).

## I. robots.txt — `/robots.txt`, allows all crawling except `/api/`, points to the sitemap.

## J. Image optimization strategy

- `next/image` throughout, with `sizes="100vw"` on the hero and responsive `fill` layouts elsewhere.
- First hero slide loads with `priority` + `eager`; the rest are `lazy`.
- AVIF/WebP output configured in `next.config.mjs`.
- Every image (including every placeholder) has descriptive, non-generic alt text — see `src/content/hero-slides.ts` for the pattern to follow with real photos.
- **Action needed from you:** real photography, saved with descriptive filenames (e.g. `nabh-documentation-review-emc.webp`, not `IMG_2044.jpg`). See **Section C1** for exactly how a photo gets wired into the site once you send it — it's a two-field content change, not a code change.

## K. Performance strategy

- Static generation (`generateStaticParams`) for all 16 service pages and 5 blog posts — no server round-trip per request.
- Fonts self-hosted via `next/font/google` (no runtime request to Google, no layout shift from late font swap).
- Minimal client JavaScript: only `HeroSlider`, `MobileNav`, `ContactForm`, `RouteTracker`, and the small tracked-link wrappers are client components; everything else is a React Server Component.
- Analytics scripts (Section R) load with `next/script` and don't render at all unless you set the relevant env vars — no dead tracking code shipped by default. GTM (when configured) uses `beforeInteractive`, the highest-priority load strategy Next.js allows; GA4/Meta Pixel fallbacks use `afterInteractive` so they never block first paint.

## L. Accessibility strategy

- Skip-to-content link, visible focus rings site-wide (`:focus-visible`), semantic landmarks.
- `HeroSlider`: labelled prev/next buttons, `aria-current` on indicators, live-region slide announcements, full keyboard (arrow key) support, touch swipe, and autoplay fully disabled under `prefers-reduced-motion`.
- `Lightbox` (gallery): `role="dialog" aria-modal`, focus moves to the close button on open and is restored on close, Escape/Arrow-key handling, touch swipe, and an accessible `aria-label` announcing the current image position ("3 of 12").
- `MobileNav`: fullscreen panel closes on Escape, keeps focus trapped inside while open.
- `ServicesExplorer` / `ProcessSection` / `WhyEmc` interactive selectors use real `<button>` elements with `aria-pressed`/`aria-current` state, and every "Learn more" / detail link is a real crawlable `<Link>` — none of the interactivity depends on JavaScript to reach content.
- `Reveal` (scroll animations) and `Counter` (count-up stats) are both inert — content renders immediately, fully visible — under `prefers-reduced-motion`, via the same CSS rule that gates the hero's Ken Burns zoom and progress-bar indicators.
- Form fields all have associated `<label>`s; errors are announced via `role="alert"`.
- Colour palette meets WCAG AA contrast for body text and interactive states.

---

## M. What's still needed from you

The site works and reads correctly today, but the items below are placeholders by design — each is visibly marked in the UI (look for the dashed amber badges) or documented in code comments. Nothing fabricated is published as fact.

1. **Company logo** — currently a text wordmark (`src/components/layout/Logo.tsx`). The favicon and Meta Share Image now use the official uploaded EMC assets (Section R); a 4K logo PNG was also supplied (`public/images/fav icon/EMC_logo_4K.png`) but wasn't swapped into the header/footer wordmark — that's a design change outside this build's scope, so say the word if you'd like it done next.
2. **Photography** for the hero carousel (`src/content/hero-slides.ts`), About page, all 16 service pages, the Gallery, the Clients showcase, and blog article headers — see **Section C1** for exactly how to wire a photo in (it's a two-field content change, `photoSrc` + `photoAlt`, not a code rewrite) and Section J for the filename/alt-text convention.
3. **Public contact details**: phone number, contact email, and office address (`src/lib/site-config.ts`). Note: the internal email `admin@emcforyou.com` found in your training deck is used there for staff EOD reports only — we have **not** published it as your public contact address; tell us what the public one should be.
4. **Confirmed domain name** — set `NEXT_PUBLIC_SITE_URL` in `.env.local` (canonical URLs, sitemap and JSON-LD all read from this).
5. **Social media links**, if any (`src/lib/site-config.ts` → `social`).
6. **WhatsApp Business number**, if you'd like a click-to-chat option added.
7. **Service area / cities served** — for local SEO copy and (once you also confirm an address) `LocalBusiness` schema.
8. **Legal page content** — Privacy Policy, Terms & Conditions and Cookie Policy are structural placeholders only (clearly marked in-page) and need review by a qualified legal professional before launch.
9. **Client/case-study depth** — the Clients page currently lists names + service provided, pulled from your training deck's "Previous Work" mentions, per your go-ahead to publish them. If you can share fuller project narratives, photos, or (ideally) a quote from the client, we can build out real case-study pages instead of name badges.
10. **Tracking IDs** (GTM container ID, GA4 Measurement ID, Meta Pixel ID) and a decision on cookie consent before any of them go live in production — see **Section R**.

---

## N. Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain used everywhere (sitemap, OG, JSON-LD) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag verification |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID — the preferred, primary tracking loader (Section R) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID — configured as a tag inside GTM if `NEXT_PUBLIC_GTM_ID` is set, otherwise loads directly as a fallback |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID — same GTM-first/direct-fallback pattern as GA4 |
| `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | Meta domain verification meta tag value, if Meta gives you the HTML-tag method |
| `META_CONVERSIONS_API_ACCESS_TOKEN`, `META_DATASET_ID` | Reserved for a future server-side Meta Conversions API integration — **not implemented**, nothing reads these yet |
| `RESEND_API_KEY`, `CONTACT_FORM_TO_EMAIL`, `CONTACT_FORM_FROM_EMAIL` | Contact form email delivery — wire up in `src/app/api/contact/route.ts` (`sendEnquiryEmail`); currently logs to the server console only |

No secret is ever read anywhere except `process.env` — nothing is hardcoded in the codebase.

---

## O. Local development

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
npm run build                # production build (also type-checks + lints)
npm run typecheck
npm run lint
```

Note: `next/font/google` fetches font files at build time, so `npm run build` requires outbound internet access to `fonts.googleapis.com`. This is available on Vercel and virtually every CI/hosting platform, but will fail in a fully network-isolated environment.

## P. Deployment instructions (Vercel — recommended)

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. In Vercel: **New Project → Import** the repository (Next.js is auto-detected, no config needed).
3. Add the environment variables from Section N in **Project Settings → Environment Variables**.
4. Deploy. Vercel builds and serves the app on `*.vercel.app`; add your real domain under **Settings → Domains** once confirmed.
5. In Google Search Console, verify the domain (HTML tag method matches `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`), then submit `/sitemap.xml`.

Any other Node.js host (Netlify, Render, a VPS with `npm run build && npm run start`) works too — there's nothing Vercel-specific in the code.

---

## Q. SEO/AEO/GEO/accessibility audit — current status

- [x] Unique title & meta description per page (data-driven, see Section D)
- [x] One correct `<h1>` per page, logical `<h2>`/`<h3>` hierarchy
- [x] Canonical URL on every page
- [x] Open Graph + Twitter metadata on every page
- [x] Relevant JSON-LD schema per page type
- [x] Breadcrumbs (visual + schema) on every non-home page
- [x] Internal linking: services ↔ related services, blog ↔ related services, footer service links
- [x] Image alt text on every image (including placeholders, which say so explicitly)
- [x] Mobile-responsive at 320–1920px (Tailwind mobile-first breakpoints throughout)
- [x] Keyboard/reduced-motion/focus accessibility (Section L)
- [x] No duplicate titles/descriptions — verified: each of the 16 service pages and 5 articles has distinct copy
- [x] Correct robots directives (Gallery is `noIndex` until real photos exist; everything else indexable)
- [x] Sitemap includes every indexable route automatically
- [x] `npm run build` completes with zero type errors and zero ESLint errors (verified in this environment, with `next/font/google` temporarily swapped for system fonts only because this sandbox has no outbound internet access — reverted before delivery; a normal host will fetch the fonts directly). Re-verified after the v2 visual redesign — all 39 static routes generate cleanly. Re-verified again after the favicon/OG/analytics work in Section R — all 41 routes (including the new `/icon.png`, `/apple-icon.png`, `/manifest.webmanifest`) generate cleanly.
- [x] Interactive components (Services Explorer, Gallery lightbox, mobile nav, process selector) remain keyboard-operable and every content link stays a real, crawlable `<a href>` rather than JS-only navigation (Section L)
- [x] All new animations (scroll reveal, count-up stats, hero Ken Burns/progress bars) respect `prefers-reduced-motion`
- [x] Favicon + Meta Share Image use the official uploaded assets exactly, unmodified (Section R)
- [ ] **Fabrication check**: manually re-confirm every fact against your own records before launch — this build only used what your training deck stated, but you know the business better than any document does.

---

## R. Analytics & tracking architecture

```
Website events → dataLayer (src/lib/tracking.ts) → GTM → GA4 / Meta Pixel
```

**The rule: exactly one place loads tracking scripts** — `src/components/shared/Analytics.tsx`. No other file should ever add a `<script>` tag for GTM, gtag.js, or the Meta Pixel.

- **`NEXT_PUBLIC_GTM_ID` set** (recommended): GTM loads via `beforeInteractive` in the root layout's `<head>` (the documented App Router pattern — equivalent to "as high in `<head>` as possible" for a framework that renders the `<head>` itself), and its `<noscript>` fallback renders immediately after `<body>` (`layout.tsx`). Configure the **GA4 Configuration tag** and the **Meta Pixel base/event tags** *inside the GTM container itself* — paste `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` into those GTM tags as their values. GTM listens for the custom `dataLayer` events this site pushes (below) via Custom Event triggers you set up in the container.
- **`NEXT_PUBLIC_GTM_ID` NOT set**: GA4 (`gtag.js`) and/or the Meta Pixel load directly instead, as a standalone fallback, so tracking still works without setting up GTM. Whichever mode is active, only one of (GTM) or (direct gtag/Pixel) ever loads — never both — so nothing double-fires.

### Event helpers (`src/lib/tracking.ts`)

Every interactive component calls one of these instead of touching `dataLayer`/`gtag`/`fbq` itself:

| Helper | Fires | GA4 event | Meta Pixel event |
|---|---|---|---|
| `trackPageView(path)` | Every client-side route change (`RouteTracker.tsx`) — Next's App Router doesn't re-fire a pageview on its own the way a classic multi-page site does | `page_view` | — |
| `trackPhoneClick(location)` | Footer + Contact page phone links | `phone_click` | `Contact` |
| `trackEmailClick(location)` | Footer + Contact page email links | `email_click` | `Contact` |
| `trackWhatsAppClick(location)` | Not wired to any UI yet — no WhatsApp button exists (`site-config.ts`'s `whatsapp.number` is still a placeholder); call this once one is added | `whatsapp_click` | `Contact` |
| `trackCtaClick(label, location)` | Header/mobile-nav "Get in Touch", every `CTASection` primary/secondary button | `cta_click` | — |
| `trackFormStart(name)` | First focus into the contact form | `form_start` | — |
| `trackFormSubmit(name)` | Submit attempt (before the API call resolves) | `form_submit` | — |
| `trackLead(name, params)` | **Only** a confirmed successful submission (`ContactForm.tsx`'s success branch) — never on page view, never on a failed/pending submission | `generate_lead` | `Lead` |

`scroll` and outbound `click` tracking are intentionally **not** hand-rolled here — enable GA4's built-in **Enhanced Measurement** (GA4 Admin → Data Streams → your stream) once the GA4 property exists, and it covers both automatically without extra code, matching the "don't create hundreds of unnecessary events" brief.

### Campaign attribution (`src/lib/utm.ts`)

Internal navigation (header/footer/CTA links) doesn't carry query strings, so a visitor landing on `/?utm_source=meta&utm_medium=paid_social&utm_campaign=...` would otherwise lose that attribution the moment they click anywhere else. `RouteTracker.tsx` captures `utm_source/medium/campaign/content/term`, `gclid`, and `fbclid` from the URL into `sessionStorage` the first time they appear, and `ContactForm.tsx` reads them back and (a) submits them to `/api/contact` (logged server-side alongside the enquiry) and (b) attaches them to the `lead` event, so a submission can always be traced to its original ad click even after several pages of browsing.

### Meta Conversions API

Not implemented — no Pixel ID, access token, or dataset ID has been supplied. `.env.example` reserves `META_CONVERSIONS_API_ACCESS_TOKEN` / `META_DATASET_ID` (server-only, **no** `NEXT_PUBLIC_` prefix) for when you're ready; nothing reads them yet.

### Consent / cookie banner

**No cookie-consent mechanism exists on this site today** (the Cookie Policy page is a content placeholder only, not a functioning banner — see `src/app/cookie-policy/page.tsx`). This build does **not** add one — per the brief, a consent UI wasn't in scope and a decorative one that doesn't actually gate anything would be worse than none. Practically: once any of the IDs above are set, tracking scripts will start firing immediately for every visitor, with no consent gate. If EMC needs cooking consent (GDPR for EU visitors, or India's DPDP Act 2023), that's a separate decision — flag it before turning on any ID in production.

### Domain verification

- **Meta** (Business Manager → Brand Safety → Domains): if Meta gives you the **HTML meta tag** method, set `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` and it's rendered automatically in `<head>` (`src/app/layout.tsx`). If Meta instead gives you a **DNS TXT record**, that's added at your domain registrar/DNS provider — outside this codebase.
- **Google Search Console**: already wired via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Section N).

---

*Formerly known as Elim Medical Consultancy. Built for EMC Healthcare Services Pvt. Ltd.*
