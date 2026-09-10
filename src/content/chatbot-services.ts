import { services, getServiceHref } from "@/content/services";

/**
 * Chatbot service knowledge base — every fact here is derived directly from
 * services.ts (shortDescription / process / whoNeedsIt), never hand-typed,
 * so the bot can never drift from or contradict the real service pages.
 * Deliberately excludes `timeline` — the site itself always pairs indicative
 * timelines with a "this is not a guarantee" note, and that nuance is too
 * easy to lose in a chat bubble, so the bot just doesn't quote one.
 */

export interface ChatbotServiceCard {
  slug: string;
  name: string;
  whatIs: string;
  supports: string[];
  goodFor: string;
  href: string;
  keywords: string[];
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function buildCard(slug: string, extraKeywords: string[] = []): ChatbotServiceCard {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`chatbot-services: unknown slug "${slug}"`);
  // Deliberately NOT derived from service.keywords (services.ts's SEO meta-keywords
  // field) — those are free-form descriptive phrases that legitimately mention
  // OTHER services for SEO purposes (e.g. equipment-calibration's own SEO keywords
  // include "NABH equipment calibration"), and splitting them word-by-word leaked
  // words like "nabh" onto the wrong card. Only the service's own name/slug plus
  // the hand-curated intent keywords above are used for chat matching.
  const keywords = Array.from(
    new Set([...normalizeWords(`${service.name} ${slug}`), ...extraKeywords.map((k) => k.toLowerCase())]),
  );
  return {
    slug,
    name: service.name,
    whatIs: service.shortDescription,
    supports: service.process.slice(0, 3).map((p) => p.title),
    goodFor: service.whoNeedsIt.slice(0, 2).join("; "),
    href: getServiceHref(service),
    keywords,
  };
}

export const serviceCards: Record<string, ChatbotServiceCard> = Object.fromEntries(
  [
    ["cea-registration", ["registration", "cea", "clinical establishment"]],
    ["drug-licence", ["medicine licence", "pharmacy licence", "drug licence", "drug license"]],
    ["biomedical-waste", ["biomedical waste", "bmw", "waste"]],
    ["fire-safety", ["fire", "fire noc", "safety", "noc"]],
    ["tnpcb-registration", ["tnpcb", "pollution control", "consent to establish", "consent to operate"]],
    ["stability-certificate", ["stability certificate", "structural certificate", "suitability certificate"]],
    ["nabh-accreditation", ["nabh", "accreditation", "quality", "patient safety"]],
    ["nabl-accreditation", ["nabl", "laboratory accreditation", "lab accreditation"]],
    ["hospital-marketing", ["hospital promotion", "patients", "marketing", "pro marketing", "referral", "patient outreach", "outreach"]],
    ["digital-marketing", ["instagram", "facebook", "google", "social media", "website", "seo", "digital marketing"]],
    ["medical-camps", ["camp", "health camp", "medical camp"]],
    ["mrd-services", ["medical records", "files", "mrd", "digitization", "documentation"]],
    ["recruitment-staffing", ["staff", "nurse", "doctor recruitment", "manpower", "recruitment", "hiring", "hire"]],
    ["hospital-clinic-setup", ["hospital setup", "clinic setup", "new hospital", "opening a hospital", "pharmacy setup"]],
    ["insurance-tpa-empanelment", ["insurance", "tpa", "empanelment", "cashless"]],
    ["equipment-calibration", ["calibration", "equipment certificate", "medical equipment"]],
    ["health-at-home", ["home nursing", "home healthcare", "patient at home", "health at home", "elder care"]],
  ].map(([slug, kw]) => [slug as string, buildCard(slug as string, kw as string[])]),
);

export function getServiceCard(slug: string): ChatbotServiceCard | undefined {
  return serviceCards[slug];
}

/** Matches the exact 10 quick-action cards from the chatbot brief onto real service-family/service data. */
export interface ChatbotCategory {
  id: string;
  label: string;
  emoji: string;
  serviceSlugs: string[];
}

export const categories: ChatbotCategory[] = [
  { id: "compliance", label: "Healthcare Compliance", emoji: "🏥", serviceSlugs: ["cea-registration", "drug-licence", "biomedical-waste", "fire-safety", "tnpcb-registration", "stability-certificate"] },
  { id: "quality", label: "NABH / NABL", emoji: "✓", serviceSlugs: ["nabh-accreditation", "nabl-accreditation"] },
  { id: "setup", label: "Hospital & Clinic Setup", emoji: "🏗", serviceSlugs: ["hospital-clinic-setup"] },
  { id: "growth", label: "Hospital Growth & Marketing", emoji: "📈", serviceSlugs: ["hospital-marketing", "digital-marketing"] },
  { id: "mrd", label: "MRD & Documentation", emoji: "📋", serviceSlugs: ["mrd-services"] },
  { id: "manpower", label: "Recruitment & Manpower", emoji: "👥", serviceSlugs: ["recruitment-staffing"] },
  { id: "insurance", label: "Insurance & TPA", emoji: "🛡", serviceSlugs: ["insurance-tpa-empanelment"] },
  { id: "equipment", label: "Medical Equipment", emoji: "📟", serviceSlugs: ["equipment-calibration"] },
  { id: "camps", label: "Medical Camps", emoji: "⛺", serviceSlugs: ["medical-camps"] },
  { id: "home", label: "Health at Home", emoji: "🏠", serviceSlugs: ["health-at-home"] },
];

export function getCategory(id: string): ChatbotCategory | undefined {
  return categories.find((c) => c.id === id);
}

/** Which category a service belongs to (inverse of ChatbotCategory.serviceSlugs), for cross-referencing. */
export function getCategoryForService(slug: string): ChatbotCategory | undefined {
  return categories.find((c) => c.serviceSlugs.includes(slug));
}

/**
 * Contextual, limited related-service suggestions — deliberately sparse
 * (2-3 entries, only where genuinely relevant) rather than cross-selling
 * every category from every card.
 */
export const crossSell: Record<string, { intro: string; slugs: string[] }> = {
  "hospital-clinic-setup": {
    intro: "Since you're planning a new hospital, you may also need support with compliance, staffing and equipment coordination.",
    slugs: ["cea-registration", "recruitment-staffing", "equipment-calibration"],
  },
  "nabh-accreditation": {
    intro: "Many hospitals preparing for NABH also review their MRD documentation and staff training requirements.",
    slugs: ["mrd-services"],
  },
  "mrd-services": {
    intro: "MRD documentation is often part of a wider NABH readiness review — worth checking together.",
    slugs: ["nabh-accreditation"],
  },
  "hospital-marketing": {
    intro: "Hospitals working on PRO outreach often pair it with digital presence — website, SEO and social media.",
    slugs: ["digital-marketing"],
  },
  "digital-marketing": {
    intro: "Alongside digital presence, many hospitals also build referring-doctor relationships through PRO outreach.",
    slugs: ["hospital-marketing"],
  },
  "biomedical-waste": {
    intro: "Biomedical waste and TNPCB registration are closely related — worth reviewing together.",
    slugs: ["tnpcb-registration"],
  },
};

/** Free-text keyword matching against every known service. */
export function matchServicesFromText(text: string): ChatbotServiceCard[] {
  const normalized = text.toLowerCase();
  return Object.values(serviceCards).filter((card) => card.keywords.some((kw) => kw.length > 3 && normalized.includes(kw)));
}

/** "Life situation" phrases that map to a curated set of categories rather than one single service — see brief §3. */
export interface LifeSituationMatch {
  intro: string;
  options: { label: string; slug: string }[];
}

export function matchLifeSituation(text: string): LifeSituationMatch | null {
  const normalized = text.toLowerCase();

  if (/(open|opening|start|starting|set ?up|new)\s+(a\s+)?(hospital|clinic)/.test(normalized)) {
    return {
      intro:
        "That sounds like a hospital setup requirement. EMC can support planning, infrastructure coordination, compliance coordination, equipment/infrastructure coordination, manpower coordination and operational readiness.",
      options: [
        { label: "Complete Hospital Setup", slug: "hospital-clinic-setup" },
        { label: "Compliance & Licensing", slug: "cea-registration" },
        { label: "Equipment & Infrastructure", slug: "equipment-calibration" },
        { label: "Manpower", slug: "recruitment-staffing" },
      ],
    };
  }

  if (/(not enough|few|low|need more|increase|more)\s+patients|patients?\s+(are\s+)?(low|down|declining)/.test(normalized)) {
    return {
      intro:
        "EMC supports hospital growth through hospital marketing, digital marketing, website development, outreach and related patient-enquiry strategies.",
      options: [
        { label: "Hospital Marketing", slug: "hospital-marketing" },
        { label: "Digital Marketing", slug: "digital-marketing" },
        { label: "Website", slug: "digital-marketing" },
        { label: "Patient Outreach", slug: "hospital-marketing" },
      ],
    };
  }

  if (/(need|hire|hiring|short of|looking for)\s+(staff|doctors?|nurses?|manpower)/.test(normalized)) {
    return {
      intro: "EMC supports healthcare recruitment for doctors, nursing staff, administration, marketing and technical/support roles.",
      options: [
        { label: "Doctors", slug: "recruitment-staffing" },
        { label: "Nurses", slug: "recruitment-staffing" },
        { label: "Administration", slug: "recruitment-staffing" },
        { label: "Technicians / Support", slug: "recruitment-staffing" },
      ],
    };
  }

  return null;
}

export function isPricingIntent(text: string): boolean {
  return /\b(price|pricing|cost|costs|fee|fees|charge|charges|how much|quotation|quote)\b/i.test(text);
}

/**
 * Deliberately narrow, conservative heuristic — only fires on explicit
 * symptom/emergency phrasing, not on every mention of a body part or the
 * word "pain" in a business context. False negatives here are far safer
 * than false positives that make the bot look like it's ignoring genuine
 * business questions.
 */
export function isMedicalSafetyIntent(text: string): boolean {
  return /\b(chest pain|heart attack|stroke|bleeding|unconscious|can'?t breathe|difficulty breathing|emergency|overdose|severe pain|what should i do (for|about) my (pain|symptom)|i (have|am having) (a )?(pain|fever|symptom))\b/i.test(
    text,
  );
}

export function isContactIntent(text: string): boolean {
  return /\b(contact|call me|call back|speak to|talk to|reach you|phone number|get in touch|your team)\b/i.test(text);
}

export function isWhatsAppIntent(text: string): boolean {
  return /whatsapp/i.test(text);
}

/** A short, honest catalogue answer for "what services do you provide" style questions. */
export const CATALOGUE_SUMMARY =
  "EMC supports healthcare organizations across compliance & licensing, NABH/NABL accreditation, hospital & clinic setup, hospital growth & marketing, MRD & documentation, recruitment & manpower, insurance & TPA coordination, medical equipment, medical camps, and health at home.";
