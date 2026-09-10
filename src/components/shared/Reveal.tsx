"use client";

import { useEffect, useRef, useState, ElementType } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms — useful for revealing a list item-by-item. */
  delay?: number;
  as?: ElementType;
}

/**
 * Lightweight scroll-triggered reveal — no animation library, just an
 * IntersectionObserver toggling a class (see `.reveal` / `.is-visible` in
 * globals.css). Reveals once and stays visible (no re-hiding on scroll back,
 * which keeps it calm rather than distracting). Fully inert under
 * prefers-reduced-motion via the CSS rule alone.
 */
export default function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as as ElementType;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => setVisible(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
