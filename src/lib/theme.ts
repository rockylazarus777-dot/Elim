import { ServiceFamily } from "@/types/content";

/**
 * Literal Tailwind class strings per service family — kept in one file, in
 * full (never string-interpolated), so Tailwind's content scanner can find
 * every class at build time. Used by ThemedVisual, ServicesExplorer, and any
 * component that needs a family's visual identity.
 */
export interface FamilyTheme {
  gradient: string;
  wash: string;
  iconBg: string;
  iconText: string;
  text: string;
  ring: string;
  chipBg: string;
  chipText: string;
  dot: string;
  progressBar: string;
}

/**
 * Nine groups, five hues — each hue is reused by two groups (see the
 * assignment below), chosen so no two adjacent groups (by 01–09 order) share
 * a color. compliance-licensing(01)=brand, quality-accreditation(02)=plum,
 * marketing(03)=sand, medical-camps(04)=moss, records-management(05)=clay,
 * manpower(06)=brand, facility-setup(07)=plum, insurance-tpa(08)=clay,
 * equipment-infrastructure(09)=moss.
 */
const brandTheme: FamilyTheme = {
  gradient: "from-brand-800 via-brand-700 to-ink-900",
  wash: "bg-brand-50",
  iconBg: "bg-brand-700",
  iconText: "text-white",
  text: "text-brand-700",
  ring: "ring-brand-200",
  chipBg: "bg-brand-50",
  chipText: "text-brand-700",
  dot: "bg-brand-600",
  progressBar: "bg-brand-600",
};

const clayTheme: FamilyTheme = {
  gradient: "from-clay-600 via-clay-500 to-ink-900",
  wash: "bg-clay-50",
  iconBg: "bg-clay-500",
  iconText: "text-white",
  text: "text-clay-600",
  ring: "ring-clay-200",
  chipBg: "bg-clay-50",
  chipText: "text-clay-600",
  dot: "bg-clay-500",
  progressBar: "bg-clay-500",
};

const plumTheme: FamilyTheme = {
  gradient: "from-plum-600 via-plum-500 to-ink-900",
  wash: "bg-plum-50",
  iconBg: "bg-plum-500",
  iconText: "text-white",
  text: "text-plum-500",
  ring: "ring-plum-200",
  chipBg: "bg-plum-50",
  chipText: "text-plum-500",
  dot: "bg-plum-500",
  progressBar: "bg-plum-500",
};

const sandTheme: FamilyTheme = {
  gradient: "from-sand-600 via-sand-300 to-ink-900",
  wash: "bg-sand-100",
  iconBg: "bg-sand-600",
  iconText: "text-white",
  text: "text-sand-700",
  ring: "ring-sand-200",
  chipBg: "bg-sand-100",
  chipText: "text-sand-700",
  dot: "bg-sand-600",
  progressBar: "bg-sand-600",
};

const mossTheme: FamilyTheme = {
  gradient: "from-moss-600 via-moss-500 to-ink-900",
  wash: "bg-moss-50",
  iconBg: "bg-moss-500",
  iconText: "text-white",
  text: "text-moss-600",
  ring: "ring-moss-200",
  chipBg: "bg-moss-50",
  chipText: "text-moss-600",
  dot: "bg-moss-500",
  progressBar: "bg-moss-500",
};

export const familyThemes: Record<ServiceFamily, FamilyTheme> = {
  "compliance-licensing": brandTheme,
  "quality-accreditation": plumTheme,
  marketing: sandTheme,
  "medical-camps": mossTheme,
  "records-management": clayTheme,
  manpower: brandTheme,
  "facility-setup": plumTheme,
  "insurance-tpa": clayTheme,
  "equipment-infrastructure": mossTheme,
};

export function getFamilyTheme(family: ServiceFamily): FamilyTheme {
  return familyThemes[family];
}
