/**
 * Meta Ads / Google Ads campaign attribution. Internal links (header, footer,
 * CTAs) don't carry query strings, so without this, a visitor who lands on
 * `/?utm_source=meta&...` and then clicks "Services" loses the campaign
 * params entirely by the time they reach the contact form. This captures
 * utm_ params, gclid and fbclid from the URL into sessionStorage the first time they
 * appear, so the original campaign touch survives normal internal
 * navigation for the rest of the session — read it back with
 * getStoredUtmParams() wherever attribution needs to travel with an event
 * (e.g. the lead event in ContactForm.tsx).
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CLICK_ID_KEYS = ["gclid", "fbclid"] as const;
const STORAGE_KEY = "emc_campaign_attribution";

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>>;

export function captureUtmParams(search: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(search);
  const found: UtmParams = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = params.get(key);
    if (value) found[key] = value;
  }
  if (Object.keys(found).length === 0) return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // sessionStorage unavailable (private browsing, storage blocked, etc.) — attribution is best-effort.
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
