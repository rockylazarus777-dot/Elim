import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ServiceDetailBody from "@/components/services/ServiceDetailBody";
import { getServiceBySlug } from "@/content/services";
import { complianceSubServices, getComplianceSubServiceBySubslug } from "@/content/compliance-subservices";
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

      <ServiceDetailBody service={service} complianceContent={content} />
    </>
  );
}
