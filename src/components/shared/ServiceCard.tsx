import Link from "next/link";
import { ServiceContent } from "@/types/content";
import { getFamily } from "@/content/service-families";
import { getServiceHref } from "@/content/services";
import ThemedVisual from "./ThemedVisual";

export default function ServiceCard({ service }: { service: ServiceContent }) {
  const family = getFamily(service.family);

  return (
    <Link
      href={getServiceHref(service)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow duration-300 hover:shadow-card-hover"
    >
      <ThemedVisual
        family={service.family}
        icon={service.icon}
        label={service.name}
        photoSrc={service.photoSrc}
        photoAlt={service.photoAlt}
        className="aspect-[16/11] w-full"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col bg-white p-6">
        {family ? <p className="eyebrow mb-2">{family.name}</p> : null}
        <h3 className="text-lg font-semibold text-ink-900 group-hover:text-brand-700">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Learn more
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
            <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
