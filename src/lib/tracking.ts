/**
 * Central tracking utilities — the only place components should reach for to
 * report an interaction. Every call here does one thing first and always:
 * push a plain event onto `window.dataLayer`, which is what a configured
 * Google Tag Manager container listens to (Website → dataLayer → GTM →
 * GA4 / Meta Pixel — see components/shared/Analytics.tsx for the loader).
 *
 * When GTM isn't configured, Analytics.tsx falls back to loading gtag.js
 * and/or the Meta Pixel directly instead. Those fallback scripts don't read
 * generic dataLayer pushes, so each helper below also calls `window.gtag`/
 * `window.fbq` directly when present. Only one of (GTM) or (direct
 * gtag/fbq) is ever loaded at a time (see Analytics.tsx), so this never
 * double-fires.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

function pushToDataLayer(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

function gtagFallback(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

function fbqFallback(pixelEvent: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", pixelEvent, params);
}

/** Generic GA4 event — prefer one of the named helpers below where one fits. */
export function trackEvent(eventName: string, params: EventParams = {}) {
  pushToDataLayer(eventName, params);
  gtagFallback(eventName, params);
}

/** Virtual pageview for client-side route changes (see RouteTracker.tsx). */
export function trackPageView(pagePath: string) {
  pushToDataLayer("page_view", { page_path: pagePath });
  gtagFallback("page_view", { page_path: pagePath });
}

/** location = a short slug identifying where on the page the click happened, e.g. "header", "footer", "contact_page". */
export function trackPhoneClick(location: string) {
  pushToDataLayer("phone_click", { location });
  gtagFallback("phone_click", { location });
  fbqFallback("Contact", { content_name: "phone_click" });
}

export function trackEmailClick(location: string) {
  pushToDataLayer("email_click", { location });
  gtagFallback("email_click", { location });
  fbqFallback("Contact", { content_name: "email_click" });
}

/** Not wired to any UI yet — no WhatsApp CTA exists on the site (site-config.ts whatsapp.number is a placeholder). Use this once one is added. */
export function trackWhatsAppClick(location: string) {
  pushToDataLayer("whatsapp_click", { location });
  gtagFallback("whatsapp_click", { location });
  fbqFallback("Contact", { content_name: "whatsapp_click" });
}

export function trackCtaClick(ctaLabel: string, location: string) {
  pushToDataLayer("cta_click", { cta_label: ctaLabel, location });
  gtagFallback("cta_click", { cta_label: ctaLabel, location });
}

export function trackFormStart(formName: string) {
  pushToDataLayer("form_start", { form_name: formName });
  gtagFallback("form_start", { form_name: formName });
}

export function trackFormSubmit(formName: string) {
  pushToDataLayer("form_submit", { form_name: formName });
  gtagFallback("form_submit", { form_name: formName });
}

/**
 * Fire ONLY after a genuine conversion (a successful form submission, e.g.),
 * never on page view. Maps to GA4's recommended `generate_lead` event name
 * and the Meta Pixel's standard `Lead` event.
 */
export function trackLead(formName: string, params: EventParams = {}) {
  const payload = { form_name: formName, ...params };
  pushToDataLayer("lead", payload);
  gtagFallback("generate_lead", payload);
  fbqFallback("Lead", payload);
}
