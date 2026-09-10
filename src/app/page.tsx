import type { Metadata } from "next";
import HeroVideo from "@/components/home/HeroVideo";
import ServicesEcosystem from "@/components/home/ServicesEcosystem";
import PartneringHealthcareSection from "@/components/home/PartneringHealthcareSection";
import ProcessSection from "@/components/home/ProcessSection";
import WhoWeServeEcosystem from "@/components/home/WhoWeServeEcosystem";
import ClientsShowcase from "@/components/home/ClientsShowcase";
import SectionHeading from "@/components/shared/SectionHeading";
import CTASection from "@/components/shared/CTASection";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.brandName} — A-to-Z Healthcare Partner for Hospitals & Clinics`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroVideo />

      <ServicesEcosystem />

      <PartneringHealthcareSection />

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-14 sm:py-20">
          <SectionHeading eyebrow="How we work" title="From Requirement to Results" align="left" size="lg" />
          <div className="mt-10">
            <ProcessSection />
          </div>
        </div>
      </section>

      <WhoWeServeEcosystem />

      <section className="relative overflow-hidden border-t border-ink-100 bg-[radial-gradient(circle_at_top,_rgba(214,233,230,0.44),_rgba(255,255,255,0.8)_30%,_rgba(255,255,255,1)_70%)]">
        <div className="container-page py-14 sm:py-20">
          <ClientsShowcase />
        </div>
      </section>

      <CTASection imageSrc="/images/home/Section 7.png" imageAlt="EMC Healthcare Services Pvt. Ltd. — corporate headquarters" />
    </>
  );
}
