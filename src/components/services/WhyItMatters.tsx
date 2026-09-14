import Reveal from "@/components/shared/Reveal";
import ServiceIcon from "@/components/shared/ServiceIcon";
import { ServiceContent } from "@/types/content";
import { FamilyTheme } from "@/lib/theme";

export default function WhyItMatters({ service, theme }: { service: ServiceContent; theme: FamilyTheme }) {
  const cards = service.benefitCards ?? service.whyItMatters.map((item) => ({ title: item, detail: "" }));
  if (!cards.length) return null;

  return (
    <section className={`border-t border-ink-100 ${theme.wash}`} aria-labelledby="why-it-matters-heading">
      <div className="container-page py-16 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Why it matters</p>
          <h2 id="why-it-matters-heading" className="text-display-md font-display text-ink-900">
            Why Does This Matter?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 60}>
              <div className="h-full rounded-2xl bg-white p-7 shadow-card">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.chipBg} ${theme.chipText}`}>
                  <ServiceIcon name="shield-check" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{card.title}</h3>
                {card.detail ? <p className="mt-2 text-sm leading-relaxed text-ink-600">{card.detail}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>

        {service.scopeNote ? (
          <Reveal className="mt-10 max-w-3xl border-l-2 border-brand-600 pl-5">
            <p className="prose-content">{service.scopeNote}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
