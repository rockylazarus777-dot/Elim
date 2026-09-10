import { services } from "./services";
import { ClientEntry } from "@/types/content";

export type TrustedClientLogo = {
  name: string;
  logoSrc: string;
  alt: string;
  focus?: boolean;
};

export const trustedClientLogos: TrustedClientLogo[] = [
  {
    name: "N.O.R.M.S Home Healthcare – Nungambakkam,Chennai",
    logoSrc: "/images/Clientslogo/norms-logo-dark.png",
    alt: "N.O.R.M.S Home Healthcare – Chennai logo",
  },
  {
    name: "Sai Ram Fertility and Maternity Clinic T. Nagar, Chennai",
    logoSrc: "/images/Clientslogo/Sairamlogo.png",
    alt: "Sai Ram Fertility and Maternity Clinic logo",
  },
  {
    name: "Annai Multi Specialty Hospital Virugambakkam, Chennai",
    logoSrc: "/images/Clientslogo/Annailogo.png",
    alt: "Annai Multi Specialty Hospital logo",
  },
  {
    name: "KMR's Lung Clinic Porur,Chennai ",
    logoSrc: "/images/Clientslogo/KMRs-LUNG-CLINIX-logo.png",
    alt: "KMR's Lung Clinic logo",
    focus: true,
  },
  {
    name: "Royal Pearl ENT Clinic Thiruvanmiyur, Chennai",
    logoSrc: "/images/Clientslogo/logo-Royal Pearl.png",
    alt: "Royal Pearl ENT Clinic logo",
  },
  {
    name: "RMD Hospital Kilpauk, Chennai",
    logoSrc: "/images/Clientslogo/Rmdlogo.png",
    alt: "RMD Hospital logo",
  },
  {
    name: "Sri Ambal Health Care Ayappakkam, Chennai",
    logoSrc: "/images/Clientslogo/logo-sri-ambal.png",
    alt: "Sri Ambal Health Care logo",
  },
  {
    name: "LS Hospital Nerkundram, Chennai",
    logoSrc: "/images/Clientslogo/lslogo.png",
    alt: "LS Hospital logo ",
  },
  {
    name: "Arok Poly Clinic Porur, Chennai",
    logoSrc: "/images/Clientslogo/LOGO-Arok poly clinic.webp",
    alt: "Arok Poly Clinic logo",
  },
  {
    name: "Arun's Eye Care Abiramapuram, Chennai",
    logoSrc: "/images/Clientslogo/arun's eye care.png",
    alt: "Arun's Eye Care logo",
  },
  {
    name: "Caterpillar Taramani, Chennai",
    logoSrc: "/images/Clientslogo/Caterpillar logo.png",
    alt: "Caterpillar logo",
  },
  {
    name: "Dr. Kannan Ortho Clinic Kodambakkam,Chennai",
    logoSrc: "/images/Clientslogo/Dr.Kannansortho.png",
    alt: "Dr. Kannan Ortho Clinic logo",
  },
  {
    name: "Girishwari Hospital Alwarpet,Chennai",
    logoSrc: "/images/Clientslogo/Girishwari hospital logo.png",
    alt: "Girishwari Hospital logo",
  },
  {
    name: "Joy Family Multispeciality Clinic Villivakkam, Chennai",
    logoSrc: "/images/Clientslogo/joy-logo.webp",
    alt: "Joy Family Multispeciality Clinic logo",
  },
  {
    name: "Kalaa Dental Care Kodambakkam,Chennai",
    logoSrc: "/images/Clientslogo/kalaa-dental-care-clinic logo.webp",
    alt: "Kalaa Dental Care logo",
  },
  {
    name: "Sri Vignesh Hospital Thirumullaivoyal,Chennai",
    logoSrc: "/images/Clientslogo/Sri_Vignesh_Hospital_logo_only.png",
    alt: "Sri Vignesh Hospital logo",
  },
  {
    name: "Vinita Health Nungambakkam, Chennai",
    logoSrc: "/images/Clientslogo/Vinita-health-logo.webp",
    alt: "Vinita Health logo",
  },
] as const;

export function getTrustedClientLogos() {
  return [...trustedClientLogos];
}

/**
 * Derived from each service's `previousWork` list (company-provided) so
 * there is exactly one source of truth. A client/establishment appearing
 * under multiple services is merged into a single entry.
 */
export function getAllClients(): ClientEntry[] {
  const map = new Map<string, Set<string>>();

  for (const service of services) {
    for (const name of service.previousWork ?? []) {
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)!.add(service.slug);
    }
  }

  return Array.from(map.entries())
    .map(([name, slugs]) => ({ name, serviceSlugs: Array.from(slugs) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
