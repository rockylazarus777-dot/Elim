"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed, edge-to-edge video hero. No headline, no overlay copy, no
 * CTAs — the video carries the section entirely on its own. object-cover
 * crops minimally to fill the viewport rather than letterboxing to the
 * source's native 16:9. SEO/AEO context for the page lives in the section
 * directly below this one (see app/page.tsx), so nothing important is
 * hidden inside the video.
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
        className="absolute inset-0 h-full w-full object-cover object-center"
        src="/images/hero/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
    </section>
  );
}
