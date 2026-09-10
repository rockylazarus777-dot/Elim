import { ServiceFamily } from "@/types/content";
import { serviceFamilies } from "./service-families";
import { getServicesByFamily, getServiceHref } from "./services";

export interface ServiceNavItem {
  href: string;
  label: string;
}

export interface ServiceNavGroup {
  number: string;
  label: string;
  href: string;
  summary: string;
  hasSubmenu: boolean;
  subItems: ServiceNavItem[];
}

/**
 * Only Healthcare Compliance & Licensing carries a nested submenu in the nav
 * — it's the one group with enough sub-services (6) to warrant it. NABH/NABL
 * and PRO/Digital Marketing each bundle 2 sub-services, but the mega-menu
 * keeps those as a single tile linking to their section on /services, where
 * both sub-services are already listed — a deliberately compact menu rather
 * than a deep one.
 */
const GROUPS_WITH_SUBMENU: ServiceFamily[] = ["compliance-licensing"];

/**
 * The nine service groups as nav data, derived directly from
 * service-families.ts + services.ts rather than hand-typed hrefs — this is
 * what a previous hand-maintained version of this file got wrong (a dead
 * "#doctor-referral" link to a service that didn't exist). Compliance & Licensing
 * carries a submenu of its 6 sub-services (routing through getServiceHref,
 * which sends them to their bespoke long-form pages); every other group
 * links straight to its single service or its /services section anchor.
 */
export const serviceNavigation: ServiceNavGroup[] = serviceFamilies.map((family, index) => {
  const number = String(index + 1).padStart(2, "0");
  const familyServices = getServicesByFamily(family.id).filter((s) => s.isCore);
  const hasSubmenu = GROUPS_WITH_SUBMENU.includes(family.id);

  if (hasSubmenu) {
    return {
      number,
      label: family.name,
      href: `/services#${family.id}`,
      summary: family.shortLabel,
      hasSubmenu: true,
      subItems: familyServices.map((s) => ({ href: getServiceHref(s), label: s.name })),
    };
  }

  const single = familyServices[0];
  return {
    number,
    label: family.name,
    href: single ? getServiceHref(single) : `/services#${family.id}`,
    summary: family.shortLabel,
    hasSubmenu: false,
    subItems: [],
  };
});
