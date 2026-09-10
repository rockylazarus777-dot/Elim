import Image from "next/image";
import Reveal from "@/components/shared/Reveal";

/**
 * Section 3 — "Bridging Care, Building Trust". Sits directly after
 * ServicesEcosystem; text content is fixed per the brief and must not
 * change. Image (Section3.png) is on the left, copy on the right, in an
 * even ~50/50 desktop split — reversed from the section's original
 * text-left/image-right layout. DOM order is image-then-text so desktop's
 * natural left-to-right flow needs no override; mobile flips that back to
 * eyebrow/heading/body-then-image via `order` utilities. The image itself
 * is untouched — no overlays, icons, lines, or generated illustration.
 */

const ACCENT = "#20E0D0";

export default function PartneringHealthcareSection() {
  return (
    <section className="relative overflow-hidden border-t border-ink-100 bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-[-8%] h-72 w-72 rounded-full bg-brand-100/20 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8%] h-80 w-80 rounded-full bg-[#20E0D0]/[0.06] blur-3xl" />
      </div>

      <div className="container-page relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          {/* LEFT on desktop — Section3.png only, no overlays */}
          <Reveal delay={220} className="relative order-2 lg:order-1">
            <Image
              src="/images/home/Section3.png"
              alt="EMC Healthcare Services — coordinated healthcare team and service ecosystem"
              width={1004}
              height={1567}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </Reveal>

          {/* RIGHT on desktop — editorial copy */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow text-sm">PARTNERING FOR HEALTHCARE EXCELLENCE</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-4 text-[clamp(3rem,5.5vw,4.9rem)] font-display leading-[1.06] tracking-[-0.03em] text-ink-900">
                Bridging Care,
                <br />
                <span style={{ color: ACCENT }}>Building Trust</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-[1.3rem] leading-[1.7] text-ink-800">
                EMC brings specialised healthcare expertise together through one coordinated approach — helping
                healthcare organisations navigate regulatory requirements, establish strong foundations, strengthen
                operations, empower teams and accelerate growth through practical expertise and hands-on
                implementation.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
