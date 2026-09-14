import FAQ from "@/components/shared/FAQ";
import ServiceHero from "@/components/services/ServiceHero";
import WhoWeSupport from "@/components/services/WhoWeSupport";
import WhyItMatters from "@/components/services/WhyItMatters";
import HowEmcSupportsYou from "@/components/services/HowEmcSupportsYou";
import ExpectedTimeline from "@/components/services/ExpectedTimeline";
import RelatedGallery from "@/components/services/RelatedGallery";
import ServiceFinalCTA from "@/components/services/ServiceFinalCTA";
import { getFamily } from "@/content/service-families";
import { getFamilyTheme } from "@/lib/theme";
import { ComplianceSubServiceContent, ServiceContent } from "@/types/content";

/**
 * The one master body every service-detail page renders through — the
 * standard `/services/[slug]` route and the compliance long-form
 * `/services/healthcare-compliance/[subslug]` route both call this with the
 * same section order: Hero → Who We Support → Why It Matters → How EMC
 * Supports You → Expected Timeline (if applicable) → FAQ (if any, kept for
 * its schema) → Related Gallery (only once a service actually has extra
 * approved images) → Final CTA. `complianceContent` is only passed for the
 * six compliance sub-services — it supplies the richer `supportStages` /
 * `pathChoice` that "How EMC Supports You" prefers over the shorter
 * `service.process` every other service falls back to.
 */
export default function ServiceDetailBody({
  service,
  complianceContent,
}: {
  service: ServiceContent;
  complianceContent?: ComplianceSubServiceContent;
}) {
  const family = getFamily(service.family);
  const theme = getFamilyTheme(service.family);
  const stages = complianceContent?.supportStages ?? service.process;

  return (
    <>
      <ServiceHero service={service} family={family} theme={theme} />

      <WhoWeSupport service={service} theme={theme} />

      <WhyItMatters service={service} theme={theme} />

      <HowEmcSupportsYou serviceName={service.name} stages={stages} pathChoice={complianceContent?.pathChoice} />

      {service.timeline ? <ExpectedTimeline timeline={service.timeline} theme={theme} /> : null}

      {service.faqs.length ? (
        <section className="border-t border-ink-100 bg-white">
          <div className="container-page py-16 sm:py-24">
            <FAQ items={service.faqs} title={`Frequently asked questions about ${service.name.toLowerCase()}`} />
          </div>
        </section>
      ) : null}

      <RelatedGallery serviceName={service.name} />

      <ServiceFinalCTA service={service} theme={theme} />
    </>
  );
}
