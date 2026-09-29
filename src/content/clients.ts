import { services } from "./services";
import { ClientEntry } from "@/types/content";

export type TrustedClientLogo = {
  name: string;
  location: string;
  logoSrc: string;
  alt: string;
  focus?: boolean;
};

export const trustedClientLogos: TrustedClientLogo[] = [
  {
    name: "N.O.R.M.S Home Healthcare",
    location: "Nungambakkam, Chennai",
    logoSrc: "/images/Clientslogo/norms-logo-dark.png",
    alt: "N.O.R.M.S Home Healthcare logo",
  },
  {
    name: "Sai Ram Fertility and Maternity Clinic",
    location: "T. Nagar, Chennai",
    logoSrc: "/images/Clientslogo/Sairamlogo.png",
    alt: "Sai Ram Fertility and Maternity Clinic logo",
  },
  {
    name: "Annai Multi Speciality Hospital",
    location: "Virugambakkam, Chennai",
    logoSrc: "/images/Clientslogo/Annailogo.png",
    alt: "Annai Multi Speciality Hospital logo",
  },
  {
    name: "KMR's Lung Clinix",
    location: "Porur, Chennai",
    logoSrc: "/images/Clientslogo/KMRs-LUNG-CLINIX-logo.png",
    alt: "KMR's Lung Clinix logo",
    focus: true,
  },
  {
    name: "Royal Pearl ENT Clinic",
    location: "Nungambakkam & Thiruvanmiyur, Chennai",
    logoSrc: "/images/Clientslogo/logo-Royal Pearl.png",
    alt: "Royal Pearl ENT Clinic logo",
  },
  {
    name: "RMD Hospital",
    location: "Kilpauk, Chennai",
    logoSrc: "/images/Clientslogo/Rmdlogo.png",
    alt: "RMD Hospital logo",
  },
  {
    name: "Sri Ambal Health Care",
    location: "Ayappakkam, Chennai",
    logoSrc: "/images/Clientslogo/logo-sri-ambal.png",
    alt: "Sri Ambal Health Care logo",
  },
  {
    name: "LS Hospital",
    location: "Nerkundram, Chennai",
    logoSrc: "/images/Clientslogo/lslogo.png",
    alt: "LS Hospital logo",
  },
  {
    name: "Arok Poly Clinic",
    location: "Porur, Chennai",
    logoSrc: "/images/Clientslogo/LOGO-Arok poly clinic.webp",
    alt: "Arok Poly Clinic logo",
  },
  {
    name: "Arun's Eye Care",
    location: "Abiramapuram, Chennai",
    logoSrc: "/images/Clientslogo/arun's eye care.png",
    alt: "Arun's Eye Care logo",
  },
  {
    name: "Caterpillar",
    location: "Taramani, Chennai",
    logoSrc: "/images/Clientslogo/Caterpillar logo.png",
    alt: "Caterpillar logo",
  },
  {
    name: "Dr. Kannan's Ortho Clinic",
    location: "Neelankarai, Chennai",
    logoSrc: "/images/Clientslogo/Dr.Kannansortho.png",
    alt: "Dr. Kannan's Ortho Clinic logo",
  },
  {
    name: "Girishwari Hospital",
    location: "Alwarpet, Chennai",
    logoSrc: "/images/Clientslogo/Girishwari hospital logo.png",
    alt: "Girishwari Hospital logo",
  },
  {
    name: "Joy Family Multispeciality Clinic",
    location: "Villivakkam, Chennai",
    logoSrc: "/images/Clientslogo/joy-logo.webp",
    alt: "Joy Family Multispeciality Clinic logo",
  },
  {
    name: "Kalaa Dental Care",
    location: "Kodambakkam, Chennai",
    logoSrc: "/images/Clientslogo/kalaa-dental-care-clinic logo.webp",
    alt: "Kalaa Dental Care logo",
  },
  {
    name: "Sri Vignesh Hospital",
    location: "Thirumullaivoyal, Chennai",
    logoSrc: "/images/Clientslogo/Sri_Vignesh_Hospital_logo_only.png",
    alt: "Sri Vignesh Hospital logo",
  },
  {
    name: "Vinita Health",
    location: "Nungambakkam, Chennai",
    logoSrc: "/images/Clientslogo/Vinita-health-logo.webp",
    alt: "Vinita Health logo",
  },
  {
    name: "Apex Wellness Co",
    location: "Neelankarai, Chennai",
    logoSrc: "/images/Clientslogo/apex logo.webp",
    alt: "Apex Wellness Co logo",
  },
  {
    name: "ASG Comprehensive Neurosciences Centre",
    location: "Thiruvanmiyur, Chennai",
    logoSrc: "/images/Clientslogo/ASG logo.webp",
    alt: "ASG Comprehensive Neurosciences Centre logo",
  },
  {
    name: "Neo Care Hospital",
    location: "Tada, Sri City, Andhra Pradesh",
    logoSrc: "/images/Clientslogo/neocare logo.webp",
    alt: "Neo Care Hospital logo",
  },
  {
    name: "Hill Blooms Health Care",
    location: "Perambur, Chennai",
    logoSrc: "/images/Clientslogo/HILL BLOOMS HEALTH CARE logo.jpg",
    alt: "Hill Blooms Health Care logo",
  },
];

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
