"use client";

import { useState } from "react";
import Link from "next/link";
import ThemedVisual from "@/components/shared/ThemedVisual";
import ServiceIcon from "@/components/shared/ServiceIcon";
import { serviceFamilies } from "@/content/service-families";
import { getFamilyTheme } from "@/lib/theme";

export default function WhyEmc() {
  const [activeId, setActiveId] = useState(serviceFamilies[0]!.id);
  const active = serviceFamilies.find((f) => f.id === activeId) ?? serviceFamilies[0]!;
  const theme = getFamilyTheme(active.id);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="order-2 lg:order-1">
        <ThemedVisual
          family={active.id}
          icon={active.icon}
          label="Why EMC Healthcare"
          photoSrc="/images/home/why-choose-emc-healthcare.png"
          photoAlt="Why EMC Healthcare — trusted expertise, end-to-end solutions, a result-driven approach and a true partner in progress, backed by quality, compliance and better patient outcomes."
          className="aspect-[5/3] w-full rounded-2xl"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>

      <div className="order-1 lg:order-2">
        <p className="eyebrow mb-4">Why EMC Healthcare</p>
        <h2 className="text-display-lg font-display text-ink-900">One partner, nine ways to support your facility</h2>

        <ul className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
          {serviceFamilies.map((family) => {
            const isActive = family.id === activeId;
            const familyTheme = getFamilyTheme(family.id);
            return (
              <li key={family.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(family.id)}
                  onFocus={() => setActiveId(family.id)}
                  onClick={() => setActiveId(family.id)}
                  aria-current={isActive}
                  className="flex w-full items-center gap-4 py-5 text-left transition-colors"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isActive ? `${familyTheme.iconBg} ${familyTheme.iconText}` : "bg-ink-50 text-ink-400"
                    }`}
                  >
                    <ServiceIcon name={family.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className={`block text-base font-semibold transition-colors ${isActive ? "text-ink-900" : "text-ink-600"}`}>
                      {family.name}
                    </span>
                    <span className={`mt-1 block text-sm text-ink-500 transition-[max-height,opacity] duration-300 ${isActive ? "opacity-100" : "opacity-0 lg:hidden"}`}>
                      {family.description}
                    </span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 ${isActive ? "translate-x-1" : ""} ${theme.text}`}
                  >
                    <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        <Link href="/services" className="link-underline mt-8 inline-block text-sm font-semibold text-brand-700">
          Explore all services →
        </Link>
      </div>
    </div>
  );
}
