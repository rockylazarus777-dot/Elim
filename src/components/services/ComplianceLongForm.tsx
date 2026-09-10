"use client";

import { useState } from "react";
import ThemedVisual from "@/components/shared/ThemedVisual";
import type { ComplianceSubServiceContent, ServiceContent } from "@/types/content";

interface ComplianceLongFormProps {
  service: ServiceContent;
  content: ComplianceSubServiceContent;
}

/**
 * Shared long-form landing page body for the six Healthcare Compliance &
 * Licensing sub-services (CEA, Drug Licence, Biomedical Waste, Fire Safety,
 * TNPCB, Stability Certificate) — generalized from the original
 * CEA-only CeaContent.tsx. "Who we support" reads service.whoNeedsIt
 * directly; the "path choice" section renders only when the sub-service's
 * content actually has one (e.g. Stability Certificate has none).
 */
export default function ComplianceLongForm({ service, content }: ComplianceLongFormProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [activeProcessStage, setActiveProcessStage] = useState(0);
  const activeSupportStage = content.supportStages[activeStage] ?? content.supportStages[0]!;
  const activeProcess = content.processStages[activeProcessStage] ?? content.processStages[0]!;

  const sectionOrder = [
    "understand",
    "why",
    "who",
    "journey",
    content.pathChoice ? "path" : null,
    "process",
    service.timeline ? "timeline" : null,
  ].filter((key): key is string => Boolean(key));
  const totalSections = sectionOrder.length;
  const sectionNumber = (key: string) => String(sectionOrder.indexOf(key) + 1).padStart(2, "0");
  const of = (key: string) => `${sectionNumber(key)} / ${String(totalSections).padStart(2, "0")}`;

  return (
    <>
      <section className="border-t border-ink-100 bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(300px,0.7fr)] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow mb-4">{of("understand")} / Understand the framework</p>
            <h2 className="text-display-md font-display text-ink-900">What Is {service.name}?</h2>
            <p className="prose-content mt-5">{service.whatIsIt}</p>
          </div>
          <ThemedVisual
            family={service.family}
            icon={service.icon}
            label={service.name}
            photoSrc={service.photoSrc}
            photoAlt={service.photoAlt}
            className="aspect-[4/3] w-full"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/70">
        <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">{of("why")} / Why it matters</p>
            <h2 className="text-display-md font-display text-ink-900">Why Does This Matter?</h2>
            <p className="prose-content mt-5">Understanding the requirement supports a structured approach to the establishment and the services it offers.</p>
          </div>
          <div>
            <ol className="divide-y divide-ink-200 border-y border-ink-200">
              {service.whyItMatters.map((point, index) => (
                <li key={point} className="flex gap-5 py-5">
                  <span className="font-display text-lg text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base leading-relaxed text-ink-800">{point}</span>
                </li>
              ))}
            </ol>
            {service.scopeNote ? (
              <p className="mt-7 border-l-2 border-brand-600 pl-4 text-sm leading-relaxed text-ink-600">{service.scopeNote}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.65fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">{of("who")} / Who we support</p>
            <h2 className="text-display-md font-display text-ink-900">Who Do We Support?</h2>
            <p className="prose-content mt-5">EMC assesses the requirements applicable to the facility before proceeding.</p>
          </div>
          <ul className="grid content-start gap-x-8 sm:grid-cols-2">
            {service.whoNeedsIt.map((establishment, index) => (
              <li key={establishment} className="group flex items-start gap-4 border-b border-ink-100 py-4 text-base font-medium text-ink-800 transition-colors hover:text-brand-700">
                <span className="font-display text-sm text-brand-700">{String(index + 1).padStart(2, "0")}</span>{establishment}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-950 text-white">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="eyebrow text-brand-300">{of("journey")} / The EMC support journey</p>
            <h2 className="mt-4 text-display-md font-display text-white">How EMC Supports You</h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">A coordinated path from understanding the requirement through follow-up and renewal support.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-[minmax(190px,0.7fr)_1fr]">
            <div className="hidden flex-col md:flex" role="tablist" aria-label={`${service.name} support stages`}>
              {content.supportStages.map((stage, index) => (
                <button key={stage.title} type="button" role="tab" aria-selected={activeStage === index} aria-controls={`compliance-stage-${index}`} onClick={() => setActiveStage(index)} className={`flex gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors ${activeStage === index ? "border-brand-300 text-white" : "border-white/15 text-white/50 hover:text-white"}`}>
                  <span className="font-display text-brand-300">{String(index + 1).padStart(2, "0")}</span><span>{stage.title}</span>
                </button>
              ))}
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15 md:hidden">
              {content.supportStages.map((stage, index) => (
                <details key={stage.title} className="group py-1" open={index === 0}>
                  <summary className="flex cursor-pointer list-none gap-3 py-4 text-left text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-brand-300">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{stage.title}</span>
                    <span aria-hidden="true" className="text-brand-300 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 pl-9 text-sm leading-relaxed text-white/70">{stage.description}</p>
                </details>
              ))}
            </div>
            <div id={`compliance-stage-${activeStage}`} role="tabpanel" className="border-t border-white/20 pt-7 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <span className="font-display text-5xl text-brand-300">{String(activeStage + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-2xl font-semibold text-white">{activeSupportStage.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">{activeSupportStage.description}</p>
            </div>
          </div>
        </div>
      </section>

      {content.pathChoice ? (
        <section className="border-t border-ink-100 bg-white">
          <div className="container-page py-16 sm:py-24">
            <p className="eyebrow mb-4">{of("path")} / Choose your path</p>
            <h2 className="text-display-md font-display text-ink-900">{content.pathChoice.heading}</h2>
            <div className="mt-10 grid gap-px overflow-hidden border border-ink-200 bg-ink-200 md:grid-cols-2">
              <article className="bg-white p-7 sm:p-10"><p className="font-display text-sm text-brand-700">01</p><h3 className="mt-4 text-2xl font-semibold text-ink-900">{content.pathChoice.pathA.title}</h3><p className="prose-content mt-4">{content.pathChoice.pathA.description}</p></article>
              <article className="bg-ink-50 p-7 sm:p-10"><p className="font-display text-sm text-brand-700">02</p><h3 className="mt-4 text-2xl font-semibold text-ink-900">{content.pathChoice.pathB.title}</h3><p className="prose-content mt-4">{content.pathChoice.pathB.description}</p></article>
            </div>
            {content.pathChoice.note ? (
              <div className="mt-8 max-w-3xl border-l-2 border-brand-600 pl-5"><p className="prose-content">{content.pathChoice.note}</p></div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="border-t border-ink-100 bg-white" aria-labelledby="process-heading">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">{of("process")} / Our process</p>
            <h2 id="process-heading" className="text-display-md font-display text-ink-900">A Clear Path From Requirement to Completion</h2>
            <p className="prose-content mt-5">A practical five-step process for discussing requirements, preparing the application, coordinating submission, and supporting completion.</p>
          </div>

          <div className="mt-14 hidden md:block">
            <div className="relative">
              <div className="absolute left-[10%] right-[10%] top-5 h-px bg-ink-200" aria-hidden="true" />
              <div className="relative grid grid-cols-5">
                {content.processStages.map((stage, index) => (
                  <button key={stage.title} type="button" role="tab" aria-selected={activeProcessStage === index} aria-controls={`process-stage-${index}`} onClick={() => setActiveProcessStage(index)} className={`group flex flex-col items-center gap-4 text-center ${activeProcessStage === index ? "text-ink-900" : "text-ink-500 hover:text-ink-900"}`}>
                    <span className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white font-display text-sm transition-colors ${activeProcessStage === index ? "border-brand-600 text-brand-700" : "border-ink-300 group-hover:border-brand-400"}`}>{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display text-xl">{stage.shortTitle}</span>
                  </button>
                ))}
              </div>
            </div>
            <div id={`process-stage-${activeProcessStage}`} role="tabpanel" className="mx-auto mt-12 max-w-2xl border-l-2 border-brand-600 pl-6">
              <p className="eyebrow">Step {String(activeProcessStage + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-ink-900">{activeProcess.title}</h3>
              <p className="prose-content mt-3">{activeProcess.description}</p>
            </div>
          </div>

          <div className="mt-10 divide-y divide-ink-200 border-y border-ink-200 md:hidden">
            {content.processStages.map((stage, index) => (
              <details key={stage.title} className="group py-1" open={index === 0}>
                <summary className="flex cursor-pointer list-none gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-base font-semibold text-ink-900">{stage.title}</span>
                  <span aria-hidden="true" className="text-xl text-brand-700 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 pl-10 text-base leading-relaxed text-ink-700">{stage.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {service.timeline ? (
        <section className="border-t border-ink-100 bg-brand-50" aria-labelledby="timeline-heading">
          <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.75fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow mb-4">{of("timeline")} / Expected timeline</p>
              <h2 id="timeline-heading" className="text-display-md font-display text-ink-900">Expected Timeline</h2>
              <p className="mt-5 font-display text-5xl text-brand-700 sm:text-6xl">{service.timeline.indicative}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink-600">Indicative only</p>
            </div>
            <div className="max-w-2xl border-l-2 border-brand-600 pl-5 text-base leading-relaxed text-ink-700 sm:pl-7 sm:text-lg">
              <p>{service.timeline.note}</p>
              <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">This is a service estimate, not a guaranteed approval period.</p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
