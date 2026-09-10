import { HeroSlide } from "@/content/hero-slides";

/**
 * Services page hero — image-only slideshow, 16.jpg through 24.jpg in
 * public/images/hero/, used exactly as supplied (each already has its own
 * caption baked into the photo itself, by design — nothing here adds text
 * on top of the images). `alt` mirrors each photo's baked-in caption so a
 * screen reader announces the same information a sighted visitor sees.
 *
 * NOTE: 25.jpg–30.jpg were referenced here but were never actually supplied
 * in public/images/hero/ (confirmed missing during the pre-launch QA pass —
 * every request for them 400'd). Removed from this list so the slideshow
 * never shows a broken slide; re-add entries for them once those six photos
 * are uploaded.
 */
export const servicesHeroSlides: HeroSlide[] = [
  { id: "services-slide-16", src: "/images/hero/16.jpg", alt: "Doctor and Specialist Networking", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-17", src: "/images/hero/17.jpg", alt: "Doctor and Specialist Networking", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-18", src: "/images/hero/18.jpg", alt: "Doctor and Specialist Networking", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-19", src: "/images/hero/19.jpg", alt: "Bio Medical Department Support", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-20", src: "/images/hero/20.jpg", alt: "Bio Medical Department Support", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-21", src: "/images/hero/21.jpg", alt: "Bio Medical Department Support", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-22", src: "/images/hero/22.jpg", alt: "Medical Event & Health Camp", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-23", src: "/images/hero/23.jpg", alt: "Medical Event & Health Camp", isPlaceholder: false, fit: "cover" },
  { id: "services-slide-24", src: "/images/hero/24.jpg", alt: "Medical Event & Health Camp", isPlaceholder: false, fit: "cover" },
];
