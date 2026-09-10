import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import FAQ from "@/components/shared/FAQ";
import CTASection from "@/components/shared/CTASection";
import ServiceCard from "@/components/shared/ServiceCard";
import ThemedVisual from "@/components/shared/ThemedVisual";
import Reveal from "@/components/shared/Reveal";
import { services, getServiceBySlug, getServiceHref, isComplianceLongForm } from "@/content/services";
import { getFamily } from "@/content/service-families";
import { getFamilyTheme } from "@/lib/theme";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return services.filter((service) => !isComplianceLongForm(service.slug)).map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    ogImage: service.photoSrc,
    keywords: service.keywords,
  });
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();
  // The six compliance sub-services have a dedicated long-form page — this
  // flat route redirects to it rather than serving duplicate content.
  if (isComplianceLongForm(service.slug)) redirect(getServiceHref(service));

  const family = getFamily(service.family);
  const theme = getFamilyTheme(service.family);
  const relatedServices = service.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean) as typeof services;

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <Reveal>
            {family ? <p className={`eyebrow mb-4 ${theme.text}`}>{family.name}</p> : null}
            <h1 className="text-display-lg font-display text-ink-900">{service.name}</h1>
            {service.positioning ? (
              <p className={`mt-4 font-display text-xl leading-snug sm:text-2xl ${theme.text}`}>{service.positioning}</p>
            ) : null}
            <p className="prose-content mt-5 text-lg">{service.whatIsIt}</p>
          </Reveal>
          <ThemedVisual
            family={service.family}
            icon={service.icon}
            label={service.name}
            photoSrc={service.photoSrc}
            photoAlt={service.photoAlt}
            className="aspect-[4/3] w-full rounded-2xl lg:sticky lg:top-24"
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
          />
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/60">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-display-md font-display text-ink-900">Who we support</h2>
            <ul className="prose-content mt-4">
              {service.whoNeedsIt.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-display-md font-display text-ink-900">Why it matters</h2>
            <ul className="prose-content mt-4">
              {service.whyItMatters.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-14">
          <h2 className="text-display-md font-display text-ink-900">What EMC does, step by step</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.process.map((step, index) => (
              <li key={step.title} className="card p-6">
                <span className={`font-display text-2xl ${theme.text}`}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {service.scopeNote ? (
        <section className="border-t border-ink-100 bg-ink-50/60">
          <div className="container-page py-10">
            <div className="max-w-3xl border-l-2 border-brand-600 pl-5">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">Scope</p>
              <p className="prose-content mt-2">{service.scopeNote}</p>
            </div>
          </div>
        </section>
      ) : null}

      {service.timeline ? (
        <section className="border-t border-ink-100 bg-brand-50" aria-labelledby="timeline-heading">
          <div className="container-page grid gap-8 py-14 lg:grid-cols-[0.75fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow mb-3">Expected timeline</p>
              <h2 id="timeline-heading" className="text-display-md font-display text-ink-900">{service.timeline.indicative}</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-ink-600">Indicative only</p>
            </div>
            <div className="max-w-2xl border-l-2 border-brand-600 pl-5 text-base leading-relaxed text-ink-700">
              <p>{service.timeline.note}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">This is a service estimate, not a guaranteed completion period.</p>
            </div>
          </div>
        </section>
      ) : null}

      {service.previousWork?.length ? (
        <section className="border-t border-ink-100 bg-white">
          <div className="container-page py-14">
            <h2 className="text-display-md font-display text-ink-900">Previously supported</h2>
            <p className="prose-content mt-3">
              Hospitals and clinics EMC has supported for {service.name.toLowerCase()}:
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {service.previousWork.map((name) => (
                <span key={name} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-800 ring-1 ring-ink-200">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`border-t border-ink-100 ${service.previousWork?.length ? "bg-ink-50/60" : "bg-white"}`}>
        <div className="container-page py-14">
          <FAQ items={service.faqs} title={`Frequently asked questions about ${service.name.toLowerCase()}`} />
        </div>
      </section>

      {relatedServices.length ? (
        <section className="border-t border-ink-100 bg-white">
          <div className="container-page py-14">
            <h2 className="text-display-md font-display text-ink-900">Related services</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((related) => (
                <ServiceCard key={related.slug} service={related} />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                ← Back to all services
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        title={`Have a ${service.name.toLowerCase()} requirement?`}
        description="Tell us about your facility and current status — we'll help you identify the right next step."
        family={service.family}
        icon={service.icon}
      />
    </>
  );
}
