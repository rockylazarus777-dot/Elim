import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import { services, getServiceBySlug, getServiceHref, isComplianceLongForm } from "@/content/services";
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

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />

      <ServiceDetailBody service={service} />
    </>
  );
}
