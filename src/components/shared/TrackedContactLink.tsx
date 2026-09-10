"use client";

import { ReactNode } from "react";
import { trackPhoneClick, trackEmailClick } from "@/lib/tracking";

/**
 * Drop-in replacement for a plain `<a href="tel:..."|"mailto:...">` that
 * also reports the click. A tiny client boundary so callers like Footer.tsx
 * and the Contact page can stay server components — only this leaf needs
 * the "use client" directive. Renders exactly the markup a plain `<a>`
 * would (same className/children), so it doesn't change how the link looks.
 */
export default function TrackedContactLink({
  kind,
  href,
  location,
  className,
  children,
}: {
  kind: "phone" | "email";
  href: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => (kind === "phone" ? trackPhoneClick(location) : trackEmailClick(location))}>
      {children}
    </a>
  );
}
