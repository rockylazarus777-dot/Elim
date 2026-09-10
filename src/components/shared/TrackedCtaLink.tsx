"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { trackCtaClick } from "@/lib/tracking";

/**
 * Drop-in replacement for next/link that also reports the click as a CTA
 * interaction. A tiny client boundary so callers like CTASection.tsx can
 * stay server components — only this leaf needs "use client". Renders
 * exactly the markup a plain <Link> would (same className/children), so it
 * doesn't change how the CTA looks.
 */
export default function TrackedCtaLink({
  href,
  ctaLabel,
  location,
  className,
  children,
}: {
  href: string;
  ctaLabel: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackCtaClick(ctaLabel, location)}>
      {children}
    </Link>
  );
}
