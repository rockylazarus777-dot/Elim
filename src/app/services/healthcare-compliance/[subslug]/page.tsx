import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/shared/Reveal";
import ThemedVisual from "@/components/shared/ThemedVisual";
import ComplianceLongForm from "@/components/services/ComplianceLongForm";
import CTASection from "@/components/shared/CTASection";
import { getServiceBySlug } from "@/content/services";
import { complianceSubServices, getComplianceSubServiceBySubslug } from "@/content/compliance-subservices";
import { getFamily } from "@/content/service-families";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";

interface Props {
  params: { subslug: string };
}

export function generateStaticParams() {
  return complianceSubServices.map((c) => ({ subslug: c.subslug }));
}

function resolve(subslug: string) {
  const content = getComplianceSubServiceBySubslug(subslug);
  if (!content) return null;
  const service = getServiceBySlug(content.slug);
  if (!service) return null;
  return { content, service };
}

export function generateMetadata({ params }: Props): Metadata {
  const resolved = resolve(params.subslug);
  if (!resolved) return {};
  const { service } = resolved;
  return buildMetadata({
    title: `${service.name} | EMC Healthcare Services`,
    description: service.seoDescription,
    path: `/services/healthcare-compliance/${params.subslug}`,
    ogImage: service.photoSrc,
    keywords: service.keywords,
  });
}

export default function ComplianceSubServicePage({ params }: Props) {
  const resolved = resolve(params.subslug);
  if (!resolved) notFound();
  const { service, content } = resolved;
  const family = getFamily(service.family);
  const index = complianceSubServices.findIndex((c) => c.subslug === params.subslug);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: "Healthcare Compliance & Licensing", path: "/services#compliance-licensing" },
          { name: service.name, path: `/services/healthcare-compliance/${params.subslug}` },
        ]}
      />

      <section className="overflow-hidden bg-ink-950 text-white">
        <div className="container-page grid min-h-[620px] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.8fr)] lg:gap-16 lg:py-28">
          <Reveal>
            <p className="eyebrow text-brand-300">{family?.name ?? "Healthcare Compliance & Licensing"}</p>
            <h1 className="mt-6 max-w-2xl text-display-xl font-display leading-[0.96] text-white">{service.name}</h1>
            {service.positioning ? (
              <p className="mt-6 max-w-xl font-display text-2xl leading-tight text-white/90 sm:text-3xl">{service.positioning}</p>
            ) : null}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{service.whatIsIt}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Book a Free Consultation</Link>
              <Link href="/contact" className="btn-secondary bg-white/10 text-white ring-white/30 hover:bg-white hover:text-ink-900">Talk to EMC</Link>
            </div>
          </Reveal>

          <Reveal className="relative lg:justify-self-end">
            <div className="relative overflow-hidden border border-white/15 bg-ink-900 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
              <ThemedVisual
                family={service.family}
                icon={service.icon}
                label={service.name}
                photoSrc={service.photoSrc}
                photoAlt={service.photoAlt}
                className="aspect-[4/3] w-full"
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 text-xs uppercase tracking-[0.14em] text-white/55">
              <span>Clinical establishment support</span>
              <span aria-hidden="true" className="text-brand-300">
                {String(index + 1).padStart(2, "0")} / {String(complianceSubServices.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <ComplianceLongForm service={service} content={content} />

      <CTASection
        title={`Have a ${service.name.toLowerCase()} requirement?`}
        description="Tell us about your facility and current status — we'll help you identify the right next step."
        family={service.family}
        icon={service.icon}
      />
    </>
  );
}
