import Link from "next/link";
import { ServiceContent } from "@/types/content";
import { getServiceHref } from "@/content/services";
import ThemedVisual from "./ThemedVisual";

/** These two source PNGs never finish loading through Next's `/_next/image`
 * optimizer in-browser (confirmed via direct isolated testing — `curl`
 * fetches them fine, so the files themselves are valid); serving them
 * unoptimized sidesteps that specific pipeline failure. */
const OPTIMIZER_INCOMPATIBLE_SLUGS = new Set(["nabh-accreditation", "nabl-accreditation"]);

export default function ServiceCard({ service }: { service: ServiceContent }) {
  return (
    <Link
      href={getServiceHref(service)}
      className="group flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-ink-100 transition-shadow duration-300 hover:shadow-card-hover"
    >
      <ThemedVisual
        family={service.family}
        icon={service.icon}
        label={service.name}
        photoSrc={service.photoSrc}
        photoAlt={service.photoAlt}
        className="aspect-[4/3] w-full bg-ink-50"
        objectFit="contain"
        unoptimized={OPTIMIZER_INCOMPATIBLE_SLUGS.has(service.slug)}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col bg-white p-4">
        <h3 className="text-[0.95rem] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">{service.name}</h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-[0.8rem] leading-relaxed text-ink-600">{service.shortDescription}</p>
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50/60 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors duration-200 group-hover:border-brand-400 group-hover:bg-brand-50">
          Learn More
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
            <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
