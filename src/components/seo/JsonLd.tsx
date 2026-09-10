import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";
import { ServiceContent, FAQItem, BlogPost } from "@/types/content";

/** Renders any JSON-LD object as an inline script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization schema — upgrades to `LocalBusiness` with a `PostalAddress`
 * now that the company has confirmed a real, public address; falls back to
 * plain `Organization` (no address) if that field ever reverts to a
 * placeholder, so we never publish fabricated structured data.
 */
export function organizationSchema() {
  const hasAddress = !siteConfig.address.isPlaceholder;
  return {
    "@context": "https://schema.org",
    "@type": hasAddress ? "LocalBusiness" : "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: [siteConfig.brandName, siteConfig.formerlyKnownAs],
    url: siteConfig.url,
    description: siteConfig.description,
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.streetAddress,
            addressLocality: siteConfig.address.addressLocality,
            addressRegion: siteConfig.address.addressRegion,
            postalCode: siteConfig.address.postalCode,
            addressCountry: siteConfig.address.addressCountry,
          },
        }
      : {}),
    ...(siteConfig.email.isPlaceholder
      ? {}
      : {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: siteConfig.email.display,
              telephone: siteConfig.phone.isPlaceholder ? undefined : siteConfig.phone.display,
            },
            ...(siteConfig.phoneSecondary.isPlaceholder
              ? []
              : [
                  {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    telephone: siteConfig.phoneSecondary.display,
                  },
                ]),
          ],
        }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.brandName,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: FAQItem[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceSchema(service: ServiceContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.shortDescription,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: siteConfig.serviceAreas.some((a) => a.startsWith("PLACEHOLDER"))
      ? undefined
      : siteConfig.serviceAreas,
    url: absoluteUrl(`/services/${service.slug}`),
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
