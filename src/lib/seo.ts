import type { Metadata } from "next";
import { siteConfig } from "./site-config";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative path to a page-specific Open Graph image. Falls back to the site default. */
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Reusable per-page metadata builder. Every route that calls this supplies
 * its own title/description/canonical/OG/Twitter data — nothing here is
 * shared globally across pages, per the site's SEO architecture.
 */
// Official EMC Meta Share Image (public/images/branding/og-image.png, sourced
// from the "Metashare.png" asset supplied by the company) — used as the
// default social-share image for every page that doesn't supply its own
// `ogImage` (e.g. service pages with real photography).
const DEFAULT_OG_IMAGE = { url: "/images/branding/og-image.png", width: 1672, height: 941 };

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
  noIndex = false,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  // Some content records (service/blog seoTitle fields) already end with a
  // short-form "| EMC Healthcare Services" suffix of their own — recognize
  // that too, or those get the full legal name appended a second time
  // (e.g. "... | EMC Healthcare Services | EMC Healthcare Services Pvt. Ltd.").
  const alreadyHasBrand = title.includes(siteConfig.brandName) || /\|\s*EMC Healthcare Services\b/i.test(title);
  const fullTitle = alreadyHasBrand ? title : `${title} | ${siteConfig.brandName}`;
  const image = ogImage
    ? { url: ogImage, width: 1200, height: 630, alt: fullTitle }
    : { ...DEFAULT_OG_IMAGE, alt: fullTitle };

  return {
    // `{ absolute: ... }` opts out of the root layout's `title.template`
    // (`%s | ${brandName}`) — fullTitle above already appends the brand
    // name itself, so applying the template on top would double it up
    // (e.g. "... | EMC Healthcare Services Pvt. Ltd. | EMC Healthcare
    // Services Pvt. Ltd.").
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brandName,
      images: [image],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
