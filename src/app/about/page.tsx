import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "EMC Healthcare Services Pvt. Ltd. (formerly Elim Medical Consultancy) is an A-to-Z healthcare partner supporting hospitals and clinics with compliance, operations, staffing, patient care and growth.",
  path: "/about",
});

const ACCENT = "#20E0D0";

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
    <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EVOLUTION_STEPS = [
  { date: "March 2024", label: "Elim Medical Consultancy" },
  { date: "August 2026", label: "EMC Healthcare Services Pvt. Ltd." },
  { date: "Today", label: "Coordinated Healthcare Expertise" },
];

const PILLARS = [
  {
    number: "01",
    title: "Our Purpose",
    body: "To help healthcare organisations move forward with greater clarity and confidence by turning their requirements and challenges into practical, coordinated solutions.",
  },
  {
    number: "02",
    title: "Our Vision",
    body: "To build EMC into a trusted healthcare support organisation with a growing presence across India, recognised for practical expertise, dependable implementation and long-term value.",
  },
  {
    number: "03",
    title: "The EMC Difference",
    body: "Healthcare-focused expertise. Coordinated support. Hands-on implementation. A partnership approach designed to go beyond individual assignments and support healthcare organisations as their requirements evolve.",
  },
];

const LEADERS = [
  {
    initials: "PM",
    photoSrc: "/images/about/prasad-mb-founder-emc.png",
    photoAlt: "Mr. Prasad MB, Founder of EMC Healthcare Services Pvt. Ltd.",
    name: "Mr. Prasad MB",
    title: "Founder, EMC Healthcare Services Pvt. Ltd.",
    bio: "With 20+ years of experience as a healthcare professional, Mr. Prasad brings extensive practical knowledge across healthcare operations, marketing, healthcare services, business development and healthcare provider support. As the Founder of EMC, his experience and understanding of the healthcare sector form an important foundation for the organisation's approach and continued growth.",
  },
  {
    initials: "WJ",
    photoSrc: "/images/about/william-joseph-managing-director-emc.png",
    photoAlt: "William Joseph M.P., CPC, Managing Director of EMC Healthcare Services Pvt. Ltd.",
    name: "William Joseph M.P., CPC",
    title: "Managing Director, EMC Healthcare Services Pvt. Ltd.",
    bio: "With experience as a healthcare professional across healthcare operations, consulting and medical services, William Joseph brings a practical and quality-focused approach to the strategic direction of EMC. As Managing Director, he is focused on strengthening organisational capabilities, driving sustainable growth and building trusted, long-term partnerships with healthcare organisations.",
  },
];

/** Subtle graph-paper texture used behind the two dark editorial panels
 * (evolution panel + closing CTA) — plain CSS gradients, no image asset. */
const GRID_TEXTURE = (size: number): React.CSSProperties => ({
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: `${size}px ${size}px`,
});

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: absoluteUrl("/about"),
    name: "About EMC Healthcare Services",
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

      {/* ================= SECTION 1 — ABOUT EMC + OUR STORY ================= */}
      <section className="overflow-hidden">
        <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
          <Reveal as="div">
            <p className="eyebrow text-sm">
              About
              <br />
              EMC
            </p>
            <h1 className="mt-4 text-[clamp(2.8rem,5.5vw,5rem)] font-display leading-[1.05] tracking-[-0.03em] text-ink-900">
              Bridging
              <br />
              Care.
              <br />
              Building Trust.
            </h1>
            <p className="mt-6 max-w-xl text-[1.15rem] leading-relaxed text-ink-800">
              EMC Healthcare Services Pvt. Ltd. is a healthcare consultancy and support organisation working alongside
              hospitals, clinics and other healthcare organisations to strengthen the foundations behind effective
              healthcare — from regulatory and quality requirements to establishment, operations, workforce,
              visibility and growth.
            </p>
            <p className="mt-5 max-w-xl border-l-2 pl-5 text-[1.05rem] leading-relaxed text-ink-700" style={{ borderColor: `${ACCENT}66` }}>
              Our journey began in March 2024 as Elim Medical Consultancy, with a focus on practical healthcare
              consultancy and growth-oriented support. As our experience, capabilities and understanding of healthcare
              organisations expanded, we evolved into EMC Healthcare Services Pvt. Ltd. in August 2026 — marking a new
              phase of structured growth and a broader commitment to supporting healthcare organisations through
              coordinated, implementation-focused expertise.
            </p>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-700">
              Today, EMC brings specialised healthcare expertise together through one coordinated approach,
              understanding each organisation&apos;s requirements and working alongside them with practical support
              that extends beyond advice into implementation and progress.
            </p>
          </Reveal>

          {/* Evolution visual — the EMC mark + a vertical, flowing evolution
              indicator, not a plain horizontal list of dates. */}
          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-7 py-10 sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={GRID_TEXTURE(36)} aria-hidden="true" />
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#20E0D0]/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />

              <div className="relative">
                <Image
                  src="/images/branding/footer-logo.png"
                  alt="EMC Healthcare Services"
                  width={96}
                  height={96}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/45">Our evolution</p>

                <div className="relative mt-7 pl-7">
                  <div
                    className="absolute bottom-1.5 left-[5px] top-1.5 w-px bg-gradient-to-b from-white/15 to-[#20E0D0]"
                    aria-hidden="true"
                  />
                  {EVOLUTION_STEPS.map((step, index) => (
                    <Reveal key={step.date} delay={300 + index * 130} className="relative pb-7 last:pb-0">
                      <span
                        className={`absolute -left-7 top-1 h-2.5 w-2.5 rounded-full ${
                          index === EVOLUTION_STEPS.length - 1 ? "bg-[#20E0D0]" : "bg-white/30"
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#20E0D0]">{step.date}</p>
                      <p className="mt-1 text-[0.95rem] font-medium leading-snug text-white">{step.label}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION 2 — WHAT DEFINES EMC ================= */}
      <section className="border-t border-ink-100 bg-ink-50/40">
        <div className="container-page py-14 sm:py-20">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-sm">
              What
              <br />
              defines EMC
            </p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-display leading-[1.12] tracking-[-0.02em] text-ink-900">
              More Than Advice.
              <br />
              Practical Support That Moves Healthcare Forward.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-ink-200">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.number} delay={index * 100} className="group sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-5xl text-ink-200 transition-colors duration-300 group-hover:text-[#20E0D0] sm:text-6xl">
                  {pillar.number}
                </span>
                <span className="mt-3 block h-px w-10 bg-ink-200 transition-all duration-300 group-hover:w-16 group-hover:bg-[#20E0D0]" />
                <h3 className="mt-4 text-lg font-semibold text-ink-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-700 transition-transform duration-300 group-hover:translate-x-1">
                  {pillar.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3 — LEADERSHIP ================= */}
      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-14 sm:py-20">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-sm">Leadership</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-display leading-[1.1] tracking-[-0.02em] text-ink-900">
              Experience.
              <br />
              Vision. Direction.
            </h2>
          </Reveal>

          <div className="mt-14 sm:mt-16">
            {LEADERS.map((leader, index) => (
              <Reveal key={leader.name} delay={index * 100}>
                <div className={`flex flex-col gap-6 sm:flex-row sm:gap-10 ${index % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                  {leader.photoSrc ? (
                    <div className="relative aspect-[1103/1426] w-40 shrink-0 overflow-hidden rounded-2xl border border-ink-200 sm:w-48 lg:w-56">
                      <Image
                        src={leader.photoSrc}
                        alt={leader.photoAlt}
                        fill
                        sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 160px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border border-ink-200 bg-gradient-to-br from-brand-50 to-white">
                      <span className="font-display text-4xl text-brand-700">{leader.initials}</span>
                    </div>
                  )}
                  <div
                    className={`border-t border-ink-100 pt-6 sm:border-t-0 sm:pt-0 ${
                      index % 2 === 1 ? "sm:max-w-2xl sm:ml-auto" : "flex-1"
                    }`}
                  >
                    <h3 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-display text-ink-900">{leader.name}</h3>
                    <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.06em] text-brand-700">{leader.title}</p>
                    <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-700">{leader.bio}</p>
                  </div>
                </div>
                {index < LEADERS.length - 1 ? <div className="my-14 h-px bg-ink-100 sm:my-16" aria-hidden="true" /> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4 — FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="pointer-events-none absolute inset-0 opacity-[0.3]" style={GRID_TEXTURE(44)} aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 -top-24 h-80 w-80 rounded-full bg-[#20E0D0]/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" aria-hidden="true" />

        <div className="container-page relative py-16 sm:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-sm text-[#20E0D0]">
              Let&apos;s
              <br />
              work together
            </p>
            <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.5rem)] font-display leading-[1.08] tracking-[-0.03em] text-white">
              Building
              <br />
              Stronger Healthcare, Together.
            </h2>
            <p className="mt-6 text-[1.1rem] leading-relaxed text-white/75">
              Whether you are establishing, strengthening or growing your healthcare organisation, EMC is ready to
              bring the expertise, coordination and practical support needed to move forward with confidence.
            </p>
            <Link href="/contact" className="btn group mt-9 bg-white px-8 py-4 text-base text-ink-900 shadow-card hover:bg-white/90">
              Talk to Our Team
              {ARROW_ICON}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
