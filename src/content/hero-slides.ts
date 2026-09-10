export interface HeroSlide {
  id: string;
  /** Path under /public — replace every placeholder with a real, optimized company photograph. */
  src: string;
  /** Meaningful, descriptive alt text — required for every slide (accessibility + image SEO). */
  alt: string;
  isPlaceholder: boolean;
  /**
   * `contain` letterboxes `src` with no cropping and disables the Ken Burns
   * zoom — use for text/graphic banners where cropping would cut off copy.
   * Defaults to `cover` (full-bleed, zoomed) for plain photography.
   */
  fit?: "cover" | "contain";
  /**
   * Optional portrait-composed image shown instead of `src` below the `sm`
   * breakpoint — use when `src` is a wide banner whose text/logo placement
   * doesn't survive being cropped or shrunk to a phone-sized frame.
   */
  mobileSrc?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    src: "/images/hero/emc-healthcare-services-overview.png",
    mobileSrc: "/images/hero/mobile/emc-healthcare-services-overview.png",
    alt: "EMC Healthcare Services Pvt. Ltd. — bridging care, building trust. Overview of hospital consulting, compliance documentation, clinical support and quality growth services.",
    isPlaceholder: false,
    fit: "contain",
  },
  {
    id: "slide-2",
    src: "/images/hero/nabh-accreditation-consulting-emc.png",
    mobileSrc: "/images/hero/mobile/nabh-mobile-accreditation-consulting-emc.png",
    alt: "NABH Accreditation consulting by EMC Healthcare Services — end-to-end support for assessment, gap analysis, implementation, training, audit and NABH certification.",
    isPlaceholder: false,
    fit: "contain",
  },
  {
    id: "slide-3",
    src: "/images/hero/cea-accreditation-registration-emc.png",
    mobileSrc: "/images/hero/mobile/cea-mobile-accreditation-registration-emc.png",
    alt: "CEA Accreditation registration and compliance support by EMC Healthcare Services — establishment registration, documentation, inspection readiness and renewal support.",
    isPlaceholder: false,
    fit: "contain",
  },
  {
    id: "slide-4",
    src: "/images/hero/healthcare-marketing-solutions-emc.png",
    mobileSrc: "/images/hero/mobile/healthcare-mobile-marketing-solutions-emc.png",
    alt: "Healthcare marketing solutions by EMC Healthcare Services — OPD and IPD marketing, digital marketing and website development for hospitals and clinics.",
    isPlaceholder: false,
    fit: "contain",
  },
];
