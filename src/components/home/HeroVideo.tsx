"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed, edge-to-edge video hero. No headline, no overlay copy, no
 * CTAs — the video carries the section entirely on its own. SEO/AEO context
 * for the page lives in the section directly below this one (see
 * app/page.tsx), so nothing important is hidden inside the video.
 *
 * Two source files, picked natively by the browser via <source media="...">
 * (so only the one actually needed is ever downloaded — both are large
 * files): below 768px (phones) gets the dedicated mobile-shot video, shown
 * full-width at its native 9:16 ratio (object-contain, height following
 * from width via .hero-viewport-fit's aspect-ratio) so the complete
 * portrait composition is preserved with no cropping; 768px and up
 * (tablets/desktop) keeps the original desktop video, viewport-filling via
 * absolute positioning + object-cover as before.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = (matches: boolean) => {
      const video = videoRef.current;
      if (!video) return;
      if (matches) video.pause();
      else video.play().catch(() => {});
    };
    applyMotionPreference(query.matches);
    const listener = (event: MediaQueryListEvent) => applyMotionPreference(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <section
      aria-label="EMC Healthcare Services"
      className="hero-viewport-fit relative isolate w-full overflow-hidden bg-ink-950"
    >
      <video
        ref={videoRef}
        className="block h-auto w-full object-contain object-center md:absolute md:inset-0 md:h-full md:w-full md:object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/images/hero/hero-video-mobile.mp4" media="(max-width: 767px)" />
        <source src="/images/hero/hero-video.mp4" />
      </video>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
    </section>
  );
}
