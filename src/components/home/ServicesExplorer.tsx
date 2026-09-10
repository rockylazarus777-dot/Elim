"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { serviceFamilies } from "@/content/service-families";
import { getServicesByFamily, getServiceHref } from "@/content/services";
import { getFamilyTheme } from "@/lib/theme";
import ThemedVisual from "@/components/shared/ThemedVisual";
import ServiceIcon from "@/components/shared/ServiceIcon";

/**
 * The interactive services explorer used on both the homepage and the
 * /services index page. Category selection and the featured service are
 * pure client state — no page reloads — but every "Learn More" and preview
 * link is a real <Link> to a real, independently-SEO'd /services/[slug]
 * page, so nothing here is JS-only navigation.
 */
export default function ServicesExplorer() {
  const [activeFamilyId, setActiveFamilyId] = useState(serviceFamilies[0]!.id);
  const familyServices = useMemo(
    () => getServicesByFamily(activeFamilyId).filter((s) => s.isCore),
    [activeFamilyId],
  );
  const [activeSlug, setActiveSlug] = useState(familyServices[0]?.slug);

  const activeService = familyServices.find((s) => s.slug === activeSlug) ?? familyServices[0];
  const previews = familyServices.filter((s) => s.slug !== activeService?.slug);
  const theme = getFamilyTheme(activeFamilyId);

  function selectFamily(id: typeof activeFamilyId) {
    setActiveFamilyId(id);
    const first = getServicesByFamily(id).filter((s) => s.isCore)[0];
    setActiveSlug(first?.slug);
  }

  if (!activeService) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
      {/* Category navigation */}
      <div className="no-scrollbar -mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:gap-1 lg:self-start lg:px-0 lg:pb-0">
        {serviceFamilies.map((family) => {
          const isActive = family.id === activeFamilyId;
          const familyTheme = getFamilyTheme(family.id);
          return (
            <button
              key={family.id}
              type="button"
              onClick={() => selectFamily(family.id)}
              aria-pressed={isActive}
              className={`group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors lg:w-full ${
                isActive ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-700 hover:bg-ink-100"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                  isActive ? "bg-white" : `${familyTheme.dot} opacity-60 group-hover:opacity-100`
                }`}
              />
              <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{family.name}</span>
            </button>
          );
        })}
      </div>

      {/* Featured + previews */}
      <div className="min-w-0">
        <div key={activeService.slug} className="grid gap-8 md:grid-cols-2 md:items-center animate-fade-in">
          <Link
            href={getServiceHref(activeService)}
            className="group block overflow-hidden rounded-2xl"
            aria-label={`Learn more about ${activeService.name}`}
          >
            <ThemedVisual
              family={activeService.family}
              icon={activeService.icon}
              label={activeService.name}
              photoSrc={activeService.photoSrc}
              photoAlt={activeService.photoAlt}
              className="aspect-[4/3] w-full rounded-2xl"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Link>
          <div>
            <p className={`eyebrow mb-3 ${theme.text}`}>{serviceFamilies.find((f) => f.id === activeFamilyId)?.name}</p>
            <h3 className="text-display-md font-display text-ink-900">{activeService.name}</h3>
            <p className="prose-content mt-3">{activeService.shortDescription}</p>
            <Link
              href={getServiceHref(activeService)}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900"
            >
              Learn more
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
                <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {previews.length ? (
          <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {previews.map((service) => (
              <button
                key={service.slug}
                type="button"
                onClick={() => setActiveSlug(service.slug)}
                className="group flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl text-left ring-1 ring-ink-100 transition-shadow hover:shadow-card sm:w-auto"
              >
                <ThemedVisual
                  family={service.family}
                  icon={service.icon}
                  label={service.name}
                  photoSrc={service.photoSrc}
                  photoAlt={service.photoAlt}
                  className="aspect-[16/10] w-full"
                  hideIcon
                  sizes="220px"
                />
                <span className="flex items-center justify-between gap-2 bg-white px-4 py-3">
                  <span className="text-sm font-medium text-ink-800 group-hover:text-ink-900">{service.name}</span>
                  <ServiceIcon name={service.icon} className={`h-4 w-4 shrink-0 ${theme.text}`} />
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
