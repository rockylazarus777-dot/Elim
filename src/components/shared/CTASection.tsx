import Image from "next/image";
import ThemedVisual from "@/components/shared/ThemedVisual";
import Reveal from "@/components/shared/Reveal";
import TrackedCtaLink from "@/components/shared/TrackedCtaLink";
import { IconKey, ServiceFamily } from "@/types/content";
import { getFamilyTheme } from "@/lib/theme";

export default function CTASection({
  title = "Our Expertise. Let’s Make It Happen..",
  description = "Whatever your healthcare organisation needs next, EMC brings the expertise, coordination and support to help move it forward.",
  primaryHref = "/contact",
  primaryLabel = "Connect with Our Team ",
  secondaryHref = "/services",
  secondaryLabel = "Explore All Services",
  family = "compliance-licensing",
  icon = "handshake",
  imageSrc,
  imageAlt,
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  family?: ServiceFamily;
  icon?: IconKey;
  /** Once supplied, replaces the generated placeholder with a real photo laid out beside the copy instead of behind it. */
  imageSrc?: string;
  imageAlt?: string;
}) {
  if (imageSrc) {
    const theme = getFamilyTheme(family);
    return (
      <section className={`relative isolate overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="cta-grid" width="34" height="34" patternUnits="userSpaceOnUse">
              <path d="M34 0H0V34" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>

        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
            <Reveal className="max-w-xl">
              <h2 className="text-display-lg font-display text-white">{title}</h2>
              <p className="mt-4 text-white/85">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink href={primaryHref} ctaLabel={primaryLabel} location="cta_section" className="btn bg-white text-ink-900 hover:bg-white/90">
                  {primaryLabel}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </TrackedCtaLink>
                <TrackedCtaLink
                  href={secondaryHref}
                  ctaLabel={secondaryLabel}
                  location="cta_section"
                  className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
                >
                  {secondaryLabel}
                </TrackedCtaLink>
              </div>
            </Reveal>

            <Reveal delay={120} className="relative h-[260px] sm:h-[320px] lg:h-[380px]">
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? "EMC Healthcare Services"}
                  fill
                  className="object-cover object-right"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              {/* Soft fade so the photo's left edge blends into the section background instead of reading as a hard-edged card. */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-brand-800/90 to-transparent"
              />
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden">
      <ThemedVisual
        family={family}
        icon={icon}
        label="EMC Healthcare Services — call to action image placeholder"
        className="h-[440px] w-full sm:h-[480px]"
        hideIcon
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 flex items-center">
        <div className="container-page">
          <Reveal className="max-w-xl">
            <h2 className="text-display-lg font-display text-white">{title}</h2>
            <p className="mt-4 text-white/85">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedCtaLink href={primaryHref} ctaLabel={primaryLabel} location="cta_section" className="btn bg-white text-ink-900 hover:bg-white/90">
                {primaryLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </TrackedCtaLink>
              <TrackedCtaLink
                href={secondaryHref}
                ctaLabel={secondaryLabel}
                location="cta_section"
                className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
              >
                {secondaryLabel}
              </TrackedCtaLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
