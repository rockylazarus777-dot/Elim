"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  /** Target number — must be a real, derivable figure (see call sites for the source). */
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Animated count-up, triggered once when scrolled into view. Skips the
 * animation entirely under prefers-reduced-motion (jumps straight to the
 * final value) so it never fights the visitor's OS setting.
 */
export default function Counter({ value, prefix = "", suffix = "", durationMs = 1400, className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            if (prefersReducedMotion) {
              setDisplay(value);
              return;
            }
            const start = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - start) / durationMs, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(eased * value));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
