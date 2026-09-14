import Reveal from "@/components/shared/Reveal";
import { FamilyTheme } from "@/lib/theme";

export default function ExpectedTimeline({
  timeline,
  theme,
}: {
  timeline: { indicative: string; note: string };
  theme: FamilyTheme;
}) {
  return (
    <section className="border-t border-ink-100 bg-white" aria-labelledby="timeline-heading">
      <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(240px,0.5fr)_1fr] lg:items-center lg:gap-20">
        <Reveal className="mx-auto lg:mx-0">
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="2" className="stroke-ink-100" />
            </svg>
            <div className="absolute inset-0 animate-[spin_16s_linear_infinite] motion-reduce:animate-none">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="70 207"
                  className={theme.text}
                  stroke="currentColor"
                />
              </svg>
            </div>
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-ink-100 bg-white text-center shadow-card">
              <p className={`font-display text-3xl ${theme.text} sm:text-4xl`}>{timeline.indicative}</p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Indicative only</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow mb-4">Expected timeline</p>
          <h2 id="timeline-heading" className="text-display-md font-display text-ink-900">
            Expected Timeline
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">{timeline.note}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-600">
            This is a service estimate, not a guaranteed completion date — actual timing depends on documentation, facility
            readiness, inspections and the relevant authority&apos;s own processing time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
