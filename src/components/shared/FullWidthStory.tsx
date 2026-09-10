import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import ThemedVisual from "@/components/shared/ThemedVisual";
import { IconKey, ServiceFamily } from "@/types/content";

interface FullWidthStoryProps {
  family: ServiceFamily;
  icon: IconKey;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageLabel: string;
  /** Text block position — alternate for visual rhythm across multiple sections. */
  align?: "left" | "right";
  /** Optional photograph to display instead of placeholder. */
  photoSrc?: string;
  photoAlt?: string;
}

export default function FullWidthStory({
  family,
  icon,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  imageLabel,
  align = "left",
  photoSrc,
  photoAlt,
}: FullWidthStoryProps) {
  return (
    <section className="relative isolate">
      <ThemedVisual
        family={family}
        icon={icon}
        label={imageLabel}
        photoSrc={photoSrc}
        photoAlt={photoAlt}
        className="h-[560px] w-full sm:h-[620px]"
        hideIcon
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className={`container-page pb-16 sm:pb-20 ${align === "right" ? "flex justify-end" : ""}`}>
          <Reveal className={`max-w-xl ${align === "right" ? "text-right" : ""}`}>
            <p className="eyebrow mb-4 text-white/80">{eyebrow}</p>
            <h2 className="text-display-lg font-display text-white">{title}</h2>
            <p className="mt-4 max-w-lg text-white/85">{description}</p>
            <Link
              href={ctaHref}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition-transform duration-300 hover:-translate-y-0.5"
            >
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
                <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
