import Reveal from "@/components/shared/Reveal";
import ServiceIcon from "@/components/shared/ServiceIcon";
import { ServiceContent } from "@/types/content";
import { FamilyTheme } from "@/lib/theme";
import { IconKey } from "@/types/content";

/** Rotates through a small, deliberately generic icon set for audience
 * cards — avoids hand-picking a bespoke icon per audience group across 17
 * services while still giving each card a distinct shape. */
const CARD_ICONS: IconKey[] = ["building", "users", "flask", "shield-heart", "map-pin"];

export default function WhoWeSupport({ service, theme }: { service: ServiceContent; theme: FamilyTheme }) {
  const groups = service.audienceGroups ?? service.whoNeedsIt.map((item) => ({ title: item, detail: "" }));
  if (!groups.length) return null;

  return (
    <section className="border-t border-ink-100 bg-white" aria-labelledby="who-we-support-heading">
      <div className="container-page py-16 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Who we support</p>
          <h2 id="who-we-support-heading" className="text-display-md font-display text-ink-900">
            Who We Support
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 60}>
              <div className="group h-full rounded-2xl border border-ink-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconText}`}>
                  <ServiceIcon name={CARD_ICONS[index % CARD_ICONS.length] ?? "building"} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{group.title}</h3>
                {group.detail ? <p className="mt-2 text-sm leading-relaxed text-ink-600">{group.detail}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
