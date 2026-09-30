import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicOnly from "@/components/layout/PublicOnly";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import Analytics, { GtmNoScript } from "@/components/shared/Analytics";
import RouteTracker from "@/components/shared/RouteTracker";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const defaultTitle = `${siteConfig.brandName} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  // Per-page routes set their own openGraph/twitter via buildMetadata()
  // (src/lib/seo.ts) with page-specific title/description/canonical. This is
  // only the fallback for routes that don't call it (e.g. not-found.tsx).
  openGraph: {
    title: defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.brandName,
    images: [{ url: "/images/branding/og-image.png", width: 1672, height: 941, alt: defaultTitle }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: ["/images/branding/og-image.png"],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  // Meta (Facebook) domain verification via the HTML meta tag method — set
  // NEXT_PUBLIC_META_DOMAIN_VERIFICATION once Meta Business Manager issues a
  // code for this domain. (Meta's alternative DNS TXT record method is
  // configured at your domain registrar/DNS provider, not in this codebase.)
  ...(process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION
    ? { other: { "facebook-domain-verification": process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${plexSans.variable}`}>
      <body>
        {/* GTM noscript fallback — must be immediately after the opening <body> tag per Google's install instructions. */}
        {/* <PublicOnly> keeps the public site's chrome and analytics off the staff-only /admin area. */}
        <PublicOnly>
          <GtmNoScript />
        </PublicOnly>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PublicOnly>
          <Header />
        </PublicOnly>
        <main id="main-content">{children}</main>
        <PublicOnly>
          <Footer />
          <WhatsAppButton />
          <ChatbotWidget />
          <Analytics />
          <Suspense fallback={null}>
            <RouteTracker />
          </Suspense>
        </PublicOnly>
      </body>
    </html>
  );
}
