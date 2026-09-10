"use client";

import { useState } from "react";
import ThemedVisual from "@/components/shared/ThemedVisual";
import { processSteps } from "@/content/process-steps";
import { getFamilyTheme } from "@/lib/theme";

export default function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = processSteps[activeIndex]!;
  const theme = getFamilyTheme(active.family);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div key={active.number} className="animate-fade-in">
        <ThemedVisual
          family={active.family}
          icon={active.icon}
          label={`How EMC works — ${active.title} — photo placeholder`}
          photoSrc={active.photoSrc}
          photoAlt={active.photoAlt}
          className="aspect-[4/3] w-full rounded-2xl"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>

      <div>
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className={`h-full rounded-full ${theme.progressBar} transition-[width] duration-500 ease-out`}
            style={{ width: `${((activeIndex + 1) / processSteps.length) * 100}%` }}
          />
        </div>

        <ol className="space-y-1">
          {processSteps.map((step, index) => {
            const isActive = index === activeIndex;
            const stepTheme = getFamilyTheme(step.family);
            return (
              <li key={step.number}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  aria-current={isActive}
                  className={`flex w-full items-start gap-4 rounded-xl px-3 py-4 text-left transition-colors ${
                    isActive ? "bg-ink-50" : "hover:bg-ink-50/60"
                  }`}
                >
                  <span
                    className={`font-display text-2xl transition-colors ${isActive ? stepTheme.text : "text-ink-300"}`}
                  >
                    {step.number}
                  </span>
                  <span className="flex-1">
                    <span className={`block text-base font-semibold ${isActive ? "text-ink-900" : "text-ink-600"}`}>
                      {step.title}
                    </span>
                    {isActive ? (
                      <span className="prose-content mt-1.5 block text-sm">{step.description}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
