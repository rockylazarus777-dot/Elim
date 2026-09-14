import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCard from "@/components/shared/ServiceCard";
import CTASection from "@/components/shared/CTASection";
import ServicesExplorer from "@/components/home/ServicesExplorer";
import ServicesHeroSlideshow from "@/components/shared/ServicesHeroSlideshow";
import { services } from "@/content/services";
import { servicesHeroSlides } from "@/content/services-hero-slides";
import { buildMetadata } from "@/lib/seo";

// Kept in `services.ts`'s own family-grouped order (compliance, then
// accreditation, marketing, and so on) so the flat grid below reads in the
// same order the old per-family sections did.
const coreServices = services.filter((service) => service.isCore);

export const metadata: Metadata = buildMetadata({
  title: "Healthcare Compliance, Accreditation, Marketing & Operations Services",
  description:
    "Explore EMC Healthcare Services' integrated healthcare service groups for hospitals and clinics: compliance & licensing, NABH/NABL accreditation, PRO & digital marketing, medical camps, MRD, manpower, facility setup, insurance/TPA coordination and medical equipment.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />

      <ServicesHeroSlideshow slides={servicesHeroSlides} />

      <section className="border-b border-ink-100 bg-white">
        <div className="container-page py-14 sm:py-16">
          <SectionHeading
            as="h1"
            title="Integrated Expertise Across Healthcare."
            description="Specialised healthcare services brought together through one coordinated approach."
            size="lg"
          />
        </div>
      </section>

      <section id="service-overview" className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Explore"
          title="Explore Our Expertise"
          description="Discover how EMC supports healthcare organisations across each area of service."
          align="left"
        />
        <div className="mt-8">
          <ServicesExplorer />
        </div>
      </section>

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const seenFamilies = new Set<string>();
              return coreServices.map((service) => {
                const isFirstOfFamily = !seenFamilies.has(service.family);
                seenFamilies.add(service.family);
                // Invisible anchor on each family's first card only — preserves
                // the existing /services#family-id links used by the navbar
                // dropdown, footer and homepage (unchanged files) now that
                // there's no separate section per family to attach an id to.
                return isFirstOfFamily ? (
                  <div key={service.slug} id={service.family} className="scroll-mt-24">
                    <ServiceCard service={service} />
                  </div>
                ) : (
                  <ServiceCard key={service.slug} service={service} />
                );
              });
            })()}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
