"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroSlide } from "@/content/hero-slides";

const AUTOPLAY_INTERVAL_MS = 4500;
const TRANSITION_MS = 1000;
/** Most of this set is a matched 1140×300 banner batch — used only until a slide's own natural ratio is measured (see naturalRatios below), so a not-yet-loaded slide degrades to the common case rather than something arbitrary. */
const DEFAULT_RATIO = 1140 / 300;

/**
 * Full-width, image-only slideshow for the Services page hero.
 *
 * Unlike HeroSlider (fixed-height, object-cover, subtle Ken Burns zoom —
 * built for photos that can afford to be cropped), every slide here is a
 * photo where cropping would cut off part of the image or its baked-in
 * text/graphics. So instead of one fixed height, the container's
 * aspect-ratio tracks whichever slide is currently active (measured from
 * each image's own naturalWidth/naturalHeight once it loads) — object-contain
 * then shows the complete photo with zero cropping AND zero letterboxing,
 * even when slides don't all share the same source ratio (most of this set
 * is a matched 1140×300 batch, but nothing here assumes every future
 * replacement will be). Interaction model (autoplay, pause-on-interact,
 * keyboard, swipe, reduced-motion) mirrors HeroSlider's, just without the
 * fixed-height layout assumptions that don't fit this image set.
 */
export default function ServicesHeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [naturalRatios, setNaturalRatios] = useState<Record<string, number>>({});
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(() => new Set([0]));
  const touchStartX = useRef<number | null>(null);

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
    const timer = window.setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused, prefersReducedMotion, slides.length]);

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

  // The carousel keeps every slide mounted at all times (crossfade via
  // opacity) so native `loading="lazy"` never defers them — they're always
  // "in viewport" as far as the browser's intersection check is concerned.
  // Instead we only mount the <Image> itself once a slide has been reached
  // (plus the next one, preloaded a step ahead for a seamless transition),
  // so the other ~13 full-width photos aren't all fetched on first paint.
  useEffect(() => {
    setLoadedIndexes((prev) => {
      const nextIndex = (activeIndex + 1) % slides.length;
      if (prev.has(activeIndex) && prev.has(nextIndex)) return prev;
      const next = new Set(prev);
      next.add(activeIndex);
      next.add(nextIndex);
      return next;
    });
  }, [activeIndex, slides.length]);

  function handleImageLoad(slideId: string, event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setNaturalRatios((prev) => (prev[slideId] === ratio ? prev : { ...prev, [slideId]: ratio }));
  }

  const activeRatio = naturalRatios[slides[activeIndex]?.id ?? ""] ?? DEFAULT_RATIO;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="EMC Healthcare Services — photo highlights"
      className={`group relative isolate w-full touch-pan-y overflow-hidden bg-ink-950 ${
        prefersReducedMotion ? "" : "transition-[aspect-ratio] duration-500 ease-out"
      }`}
      style={{ aspectRatio: activeRatio }}
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
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity ease-out ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
          >
            {loadedIndexes.has(index) ? (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-contain"
                onLoad={(event) => handleImageLoad(slide.id, event)}
              />
            ) : null}
          </div>
        );
      })}

      <span className="sr-only" role="status" aria-live="polite">
        Showing slide {activeIndex + 1} of {slides.length}
      </span>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink-900 opacity-0 shadow-card transition-opacity duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:h-11 sm:w-11 sm:left-5"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M9.5 3.5 5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink-900 opacity-0 shadow-card transition-opacity duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:h-11 sm:w-11 sm:right-5"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5 sm:bottom-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 sm:h-2 sm:w-2 ${
                  index === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
