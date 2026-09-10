"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroSlide } from "@/content/hero-slides";

const DEFAULT_AUTOPLAY_INTERVAL_MS = 6000;

/**
 * Full-width, image-only hero carousel.
 *
 * Deliberately carries no text, headline or CTA over the images (per the
 * site's design brief) — the images alone communicate the company's work.
 * SEO/AEO context for the page instead lives directly below the hero in the
 * page body (see app/page.tsx), so nothing important is hidden inside pixels.
 *
 * Accessibility: buttons are labelled, current slide is announced via a
 * visually-hidden live region, keyboard arrow keys move between slides, and
 * autoplay is disabled entirely when the visitor prefers reduced motion.
 */
export default function HeroSlider({
  slides,
  intervalMs = DEFAULT_AUTOPLAY_INTERVAL_MS,
}: {
  slides: HeroSlide[];
  /** Autoplay dwell time per slide, in ms. Defaults to 6000. */
  intervalMs?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || slides.length <= 1) return;
    const timer = window.setInterval(goNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [goNext, intervalMs, isPaused, prefersReducedMotion, slides.length]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  }

  function handleTouchEnd(event: React.TouchEvent) {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="EMC Healthcare Services — photo highlights"
      className="group relative isolate h-[70vh] min-h-[420px] w-full overflow-hidden bg-ink-950 sm:h-[76vh] sm:min-h-[480px] lg:h-[88vh] lg:max-h-[920px]"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const fit = slide.fit ?? "cover";
        const zoom = fit === "cover" && !prefersReducedMotion && isActive;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {slide.mobileSrc ? (
              <Image
                src={slide.mobileSrc}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="block object-cover object-top sm:hidden"
              />
            ) : null}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className={`${slide.mobileSrc ? "hidden sm:block" : ""} ${
                fit === "contain" ? (slide.mobileSrc ? "object-contain" : "object-cover sm:object-contain") : "object-cover"
              } ${zoom ? "animate-ken-burns" : ""}`}
              style={zoom ? { animationDuration: `${intervalMs + 1200}ms` } : undefined}
            />
          </div>
        );
      })}

      {/* Subtle scrim so controls stay legible over any photo, without placing copy on the image */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

      <span className="sr-only" role="status" aria-live="polite">
        Showing slide {activeIndex + 1} of {slides.length}
      </span>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-card transition-opacity duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:left-5"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M9.5 3.5 5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-card transition-opacity duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:right-5"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                className="group/dot relative h-1.5 w-7 overflow-hidden rounded-full bg-white/35"
              >
                {index === activeIndex ? (
                  <span
                    key={`${activeIndex}-${isPaused}`}
                    className={`absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white ${
                      !prefersReducedMotion && !isPaused ? "animate-hero-progress" : ""
                    }`}
                    style={
                      prefersReducedMotion || isPaused
                        ? { transform: "scaleX(1)" }
                        : { animationDuration: `${intervalMs}ms` }
                    }
                  />
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
