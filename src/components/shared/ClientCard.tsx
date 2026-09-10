import Link from "next/link";
import { ClientEntry } from "@/types/content";
import { getServiceBySlug, getServiceHref } from "@/content/services";
import { serviceFamilies } from "@/content/service-families";
import { ServiceFamily } from "@/types/content";
import ThemedVisual from "./ThemedVisual";

/** Deterministic family assignment per client name, purely for visual variety (no meaning implied). */
function familyForName(name: string): ServiceFamily {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return serviceFamilies[sum % serviceFamilies.length]!.id;
}

export default function ClientCard({ client }: { client: ClientEntry }) {
  const services = client.serviceSlugs.map((slug) => getServiceBySlug(slug)).filter(Boolean) as ReturnType<
    typeof getServiceBySlug
  >[];
  const primary = services[0];
  const family = familyForName(client.name);

  return (
    <Link
      href={primary ? getServiceHref(primary) : "/services"}
      className="group flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow duration-300 hover:shadow-card-hover"
    >
      <ThemedVisual
        family={family}
        icon={primary?.icon ?? "handshake"}
        label={client.name}
        photoSrc={client.photoSrc}
        photoAlt={client.photoAlt}
        className="aspect-[4/3] w-full"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-semibold text-ink-900">{client.name}</h3>
        <div className="mt-3 flex flex-1 flex-wrap gap-1.5">
          {services.map((service) =>
            service ? (
              <span key={service.slug} className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600">
                {service.name}
              </span>
            ) : null,
          )}
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          View service
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
            <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
