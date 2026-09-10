"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking";
import { captureUtmParams } from "@/lib/utm";

/**
 * Mounted once in the root layout (wrapped in <Suspense>, since
 * useSearchParams requires it). Next.js's App Router doesn't fire a new
 * pageview on client-side navigation the way a traditional multi-page site
 * does, so GTM/GA4's "page_view on every load" behaviour would otherwise
 * only ever see the first page. This pushes a virtual page_view on every
 * route change, and captures utm_ params, gclid and fbclid on every load so campaign
 * attribution (see lib/utm.ts) survives internal navigation.
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const search = searchParams.toString();
    captureUtmParams(search);

    // The initial load's pageview is already covered by GTM's container
    // load / the server-rendered page — only push for subsequent client-side
    // navigations.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView(search ? `${pathname}?${search}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
