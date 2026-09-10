import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCard from "@/components/shared/ServiceCard";
import CTASection from "@/components/shared/CTASection";
import ServicesExplorer from "@/components/home/ServicesExplorer";
import ServicesHeroSlideshow from "@/components/shared/ServicesHeroSlideshow";
import Reveal from "@/components/shared/Reveal";
import { serviceFamilies } from "@/content/service-families";
import { getServicesByFamily } from "@/content/services";
import { servicesHeroSlides } from "@/content/services-hero-slides";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Healthcare Compliance, Accreditation, Marketing & Operations Services",
  description:
    "Explore EMC Healthcare Services' nine core service groups for hospitals and clinics: compliance & licensing, NABH/NABL accreditation, PRO & digital marketing, medical camps, MRD, manpower, facility setup, insurance/TPA coordination and medical equipment.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />

      <ServicesHeroSlideshow slides={servicesHeroSlides} />

      <section id="service-overview" className="container-page py-14 sm:py-20">
        <SectionHeading as="h1" eyebrow="Preview" title="See a service group in more depth" align="left" />
        <div className="mt-8">
          <ServicesExplorer />
        </div>
      </section>

      {serviceFamilies.map((family, index) => {
        const familyServices = getServicesByFamily(family.id).filter((s) => s.isCore);
        if (!familyServices.length) return null;
        return (
          <section
            key={family.id}
            id={family.id}
            className={`scroll-mt-24 border-t border-ink-100 ${index % 2 === 0 ? "bg-white" : "bg-ink-50/50"}`}
          >
            <div className="container-page py-14">
              <Reveal className="max-w-2xl">
                <p className="eyebrow mb-3">{String(index + 1).padStart(2, "0")} / {family.shortLabel}</p>
                <h2 className="text-display-md font-display text-ink-900">{family.name}</h2>
                <p className="prose-content mt-3">{family.description}</p>
              </Reveal>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {familyServices.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CTASection />
    </>
  );
}
