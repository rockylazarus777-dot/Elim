/**
 * EMC's nine core service groups. Each of the ~16 individual ServiceContent
 * entries belongs to exactly one group via its `family` field — the same
 * field also drives visual theming (see src/lib/theme.ts), so "family" and
 * "service group" are the same axis in this codebase.
 */
export type ServiceFamily =
  | "compliance-licensing"
  | "quality-accreditation"
  | "marketing"
  | "medical-camps"
  | "records-management"
  | "manpower"
  | "facility-setup"
  | "insurance-tpa"
  | "equipment-infrastructure";

export interface ServiceFamilyInfo {
  id: ServiceFamily;
  name: string;
  shortLabel: string;
  description: string;
  icon: IconKey;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type IconKey =
  | "document"
  | "pill"
  | "shield-check"
  | "folder"
  | "biohazard"
  | "flame"
  | "gauge"
  | "shield-heart"
  | "users"
  | "megaphone"
  | "trending-up"
  | "monitor"
  | "tent"
  | "home-heart"
  | "map-pin"
  | "ruler"
  | "building"
  | "camera"
  | "book-open"
  | "handshake"
  | "flask";

export interface ServiceContent {
  slug: string;
  family: ServiceFamily;
  name: string;
  icon: IconKey;
  /** Whether this is one of EMC's core portfolio services, or additional/legacy support kept out of primary navigation. */
  isCore: boolean;
  shortDescription: string;
  heroStat?: string;
  /** Short bold positioning line shown near the H1 on the service's detail page, e.g. "Focus on Patient Care. Let EMC Support Your Registration & Renewal." */
  positioning?: string;
  whatIsIt: string;
  whyItMatters: string[];
  whoNeedsIt: string[];
  process: { title: string; description: string }[];
  faqs: FAQItem[];
  /** Client / establishment names EMC has previously supported for this service (from company-provided records). */
  previousWork?: string[];
  relatedServiceSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** Optional real photograph — once supplied, ThemedVisual renders it instead of the generated placeholder. */
  photoSrc?: string;
  photoAlt?: string;
  /** Indicative-only timeline shown on the detail page — always paired with a note on what actually determines completion. */
  timeline?: { indicative: string; note: string };
  /** Scope/disclaimer callout — e.g. "EMC coordinates the process; the registration itself is issued by the relevant authority." */
  scopeNote?: string;
}

/**
 * Long-form content for the 6 Healthcare Compliance & Licensing sub-services,
 * each of which gets a bespoke landing page (src/app/services/healthcare-compliance/[subslug])
 * beyond the standard ServiceContent detail template. Keyed by the matching
 * ServiceContent slug. See src/content/compliance-subservices.ts.
 */
export interface ComplianceSubServiceContent {
  /** Matches the ServiceContent.slug this long-form page belongs to. */
  slug: string;
  /** URL segment under /services/healthcare-compliance/ — may differ from the ServiceContent slug. */
  subslug: string;
  /** Ordered "EMC support journey" stages, shown as an interactive tab/accordion list. */
  supportStages: { title: string; description: string }[];
  /** Optional two-path fork, e.g. New Registration vs Renewal, or NOC Coordination vs Technical Services. */
  pathChoice?: {
    heading: string;
    pathA: { title: string; description: string };
    pathB: { title: string; description: string };
    note?: string;
  };
  /** Optional grouped document/requirement checklist, only where the sub-service genuinely has one. */
  documents?: { title: string; items: string[] }[];
  /** Five-stage "requirement to completion" process, shown as a tabbed timeline. */
  processStages: { shortTitle: string; title: string; description: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  category: string;
  icon: IconKey;
  relatedServiceSlugs: string[];
  faqs?: FAQItem[];
  content: { heading: string; body: string[] }[];
  seoTitle: string;
  seoDescription: string;
  photoSrc?: string;
  photoAlt?: string;
}

export interface ClientEntry {
  name: string;
  serviceSlugs: string[];
  photoSrc?: string;
  photoAlt?: string;
}
