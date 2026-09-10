import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ContactForm from "@/components/shared/ContactForm";
import PlaceholderNote from "@/components/shared/PlaceholderNote";
import TrackedContactLink from "@/components/shared/TrackedContactLink";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with EMC Healthcare Services to discuss compliance, documentation, technical, growth or community healthcare support for your hospital or clinic.",
  path: "/contact",
});

export default function ContactPage() {
  const mapQuery = encodeURIComponent(
    `${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}, India`,
  );

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl("/contact"),
    name: "Contact EMC Healthcare Services",
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <h1 className="text-display-lg font-display text-ink-900">Let&apos;s discuss your requirement</h1>
            <p className="prose-content mt-5">
              Whether it&apos;s a single compliance need or a broader growth strategy, tell us what your hospital or
              clinic needs and we&apos;ll help you identify the right next step.
            </p>

            <Reveal className="mt-8">
              {siteConfig.address.isPlaceholder ? (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50 text-sm text-ink-500">
                  Office location map needs a confirmed address
                </div>
              ) : (
                <iframe
                  title={`${siteConfig.brandName} office location`}
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="aspect-[4/3] w-full rounded-2xl border border-ink-100"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </Reveal>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-sm font-semibold text-ink-900">Phone</dt>
                <dd className="mt-1 space-y-1">
                  {siteConfig.phone.isPlaceholder ? (
                    <PlaceholderNote>Phone number needed</PlaceholderNote>
                  ) : (
                    <TrackedContactLink
                      kind="phone"
                      href={siteConfig.phone.href}
                      location="contact_page"
                      className="block text-brand-700 hover:text-brand-800"
                    >
                      {siteConfig.phone.display}
                    </TrackedContactLink>
                  )}
                  {!siteConfig.phoneSecondary.isPlaceholder ? (
                    <TrackedContactLink
                      kind="phone"
                      href={siteConfig.phoneSecondary.href}
                      location="contact_page"
                      className="block text-brand-700 hover:text-brand-800"
                    >
                      {siteConfig.phoneSecondary.display}
                    </TrackedContactLink>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-900">Email</dt>
                <dd className="mt-1">
                  {siteConfig.email.isPlaceholder ? (
                    <PlaceholderNote>Contact email needed</PlaceholderNote>
                  ) : (
                    <TrackedContactLink
                      kind="email"
                      href={siteConfig.email.href}
                      location="contact_page"
                      className="text-brand-700 hover:text-brand-800"
                    >
                      {siteConfig.email.display}
                    </TrackedContactLink>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-900">Address</dt>
                <dd className="mt-1">
                  {siteConfig.address.isPlaceholder ? (
                    <PlaceholderNote>Office address needed</PlaceholderNote>
                  ) : (
                    <address className="not-italic text-ink-700">
                      {siteConfig.address.streetAddress}
                      <br />
                      {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
                      {siteConfig.address.postalCode}
                    </address>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-900">Service areas</dt>
                <dd className="mt-1">
                  {siteConfig.serviceAreas[0]?.startsWith("PLACEHOLDER") ? (
                    <PlaceholderNote>Cities / districts served needed</PlaceholderNote>
                  ) : (
                    <p className="text-ink-700">{siteConfig.serviceAreas.join(", ")}</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
