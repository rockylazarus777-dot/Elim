"use client";

import { useState } from "react";
import Reveal from "@/components/shared/Reveal";

interface Stage {
  title: string;
  description: string;
}

interface PathChoice {
  heading: string;
  pathA: { title: string; description: string };
  pathB: { title: string; description: string };
  note?: string;
}

/**
 * The main "how EMC supports you" journey — used for every service. Takes
 * whichever stage list the service actually has (a compliance sub-service's
 * `supportStages`, or a standard service's `process`) so there's one shared
 * component instead of two parallel implementations. `pathChoice` (only the
 * 5 compliance services with a New Registration / Renewal split) renders as
 * a compact intro inside this same section rather than a separate one.
 */
export default function HowEmcSupportsYou({
  serviceName,
  stages,
  pathChoice,
}: {
  serviceName: string;
  stages: Stage[];
  pathChoice?: PathChoice;
}) {
  const [active, setActive] = useState(0);
  if (!stages.length) return null;
  const activeStage = stages[active] ?? stages[0]!;

  return (
    <section className="border-t border-ink-100 bg-ink-950 text-white" aria-labelledby="how-emc-supports-heading">
      <div className="container-page py-16 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-brand-300">The EMC support journey</p>
          <h2 id="how-emc-supports-heading" className="mt-4 text-display-md font-display text-white">
            How EMC Supports You
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
            A coordinated path from understanding the requirement through follow-up and completion support.
          </p>
        </Reveal>

        {pathChoice ? (
          <Reveal delay={80} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 md:grid-cols-2">
            <article className="bg-white/[0.04] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">{pathChoice.pathA.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{pathChoice.pathA.description}</p>
            </article>
            <article className="bg-white/[0.04] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">{pathChoice.pathB.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{pathChoice.pathB.description}</p>
            </article>
          </Reveal>
        ) : null}

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(220px,0.7fr)_1fr]">
          <div className="hidden flex-col md:flex" role="tablist" aria-label={`${serviceName} support stages`}>
            {stages.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls={`support-stage-${index}`}
                onClick={() => setActive(index)}
                className={`flex gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors ${
                  active === index ? "border-white text-white" : "border-white/15 text-white/50 hover:text-white"
                }`}
              >
                <span>{stage.title}</span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-white/15 border-y border-white/15 md:hidden">
            {stages.map((stage, index) => (
              <details key={stage.title} className="group py-1" open={index === 0}>
                <summary className="flex cursor-pointer list-none gap-3 py-4 text-left text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{stage.title}</span>
                  <span aria-hidden="true" className="text-white/60 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-white/70">{stage.description}</p>
              </details>
            ))}
          </div>

          <div
            id={`support-stage-${active}`}
            role="tabpanel"
            className="hidden border-t border-white/20 pt-7 md:block md:border-t-0 md:border-l md:pl-8 md:pt-0"
          >
            <h3 className="text-2xl font-semibold text-white">{activeStage.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">{activeStage.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
