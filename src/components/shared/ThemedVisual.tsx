import Image from "next/image";
import { IconKey, ServiceFamily } from "@/types/content";
import { getFamilyTheme } from "@/lib/theme";
import ServiceIcon from "./ServiceIcon";

interface ThemedVisualProps {
  family: ServiceFamily;
  icon: IconKey;
  /** Used as the placeholder's accessible label, and as a base for real alt text once a photo is supplied. */
  label: string;
  className?: string;
  /** Once supplied, renders the real photograph instead of the generated placeholder — same container/zoom behaviour either way. */
  photoSrc?: string;
  photoAlt?: string;
  priority?: boolean;
  sizes?: string;
  /** Hide the icon badge (useful for large full-width story sections where it would compete with overlaid text). */
  hideIcon?: boolean;
  /** Extra classes merged onto the photo's own <Image> — e.g. a non-default `object-[...]` position, so the same source photo can be framed differently in two places (container `className` still controls sizing/aspect ratio). */
  imageClassName?: string;
  /** `"cover"` (default, matches every existing caller) crops to fill the container; `"contain"` shows the complete image with no cropping, letterboxing inside the container instead — use when preserving full composition matters more than filling every pixel. */
  objectFit?: "cover" | "contain";
  /** Bypasses Next's `/_next/image` optimizer, serving the source file directly. A handful of source PNGs (confirmed via direct testing — the file itself is valid, `curl` fetches it fine) never finish loading through the optimizer in-browser for reasons that don't reproduce outside it; this is the same targeted workaround already used elsewhere in the project for that exact failure mode. */
  unoptimized?: boolean;
}

/**
 * The site's single "image slot" component. Every photo-shaped space on the
 * site — hero-adjacent sections, service cards, gallery tiles, client and
 * blog imagery — renders through this component.
 *
 * Today, with no company photography supplied yet, it draws a tasteful,
 * on-brand generated visual (family-accent gradient + service icon) so nothing
 * looks broken or empty. The moment a real photo exists, pass `photoSrc` +
 * `photoAlt` and this same component — and every layout, hover/zoom
 * interaction, and aspect ratio built around it — renders the real photograph
 * with no other code changes required.
 */
export default function ThemedVisual({
  family,
  icon,
  label,
  className = "",
  photoSrc,
  photoAlt,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  hideIcon = false,
  imageClassName = "",
  objectFit = "cover",
  unoptimized = false,
}: ThemedVisualProps) {
  const theme = getFamilyTheme(family);

  if (photoSrc) {
    const objectFitClass = objectFit === "contain" ? "object-contain" : "object-cover";
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={photoSrc}
          alt={photoAlt ?? label}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className={`img-zoom ${objectFitClass} ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder — ${label}`}
      className={`relative overflow-hidden bg-ink-900 ${className}`}
    >
      <div className={`img-zoom absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />

      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`tv-grid-${family}-${icon}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0H0V34" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#tv-grid-${family}-${icon})`} />
      </svg>

      {!hideIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconText} shadow-lg ring-4 ring-white/10`}>
            <ServiceIcon name={icon} className="h-6 w-6" />
          </span>
        </div>
      ) : null}

      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
        <ServiceIcon name="camera" className="h-3 w-3" />
        Photo placeholder
      </span>
    </div>
  );
}
