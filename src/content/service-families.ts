import { ServiceFamilyInfo } from "@/types/content";

export const serviceFamilies: ServiceFamilyInfo[] = [
  {
    id: "compliance-licensing",
    name: "Healthcare Compliance & Licensing",
    shortLabel: "Registrations – Licences – Approvals",
    description:
      "Regulatory registrations, licences, authorizations, approvals and renewals — with documentation, inspection preparation and authority coordination across six clearly separated sub-services.",
    icon: "shield-check",
  },
  {
    id: "quality-accreditation",
    name: "NABH, NABL & Quality Accreditation",
    shortLabel: "NABH – NABL – Quality Systems",
    description:
      "Strengthen quality and build sustainable healthcare systems — gap analysis, documentation, staff training and assessment preparation for hospital and laboratory accreditation.",
    icon: "flask",
  },
  {
    id: "marketing",
    name: "Hospital & Clinic PRO Marketing / Digital Marketing",
    shortLabel: "PRO Marketing – Digital – Website",
    description:
      "Strengthen your presence and build stronger connections — PRO-led outreach and relationship development, alongside websites, SEO and social media that make your services easier to find.",
    icon: "megaphone",
  },
  {
    id: "medical-camps",
    name: "Medical Camps",
    shortLabel: "General – Speciality – Corporate",
    description:
      "Bring healthcare awareness and services closer to your community — camp planning, coordination, promotion and follow-up for general, speciality, corporate and community programmes.",
    icon: "tent",
  },
  {
    id: "records-management",
    name: "Medical Records Management (MRD)",
    shortLabel: "Setup – Audits – Digitization",
    description:
      "Organized records, clearer workflows and easier retrieval — MRD setup, deficiency audits, standardisation and digitization coordination.",
    icon: "folder",
  },
  {
    id: "manpower",
    name: "Manpower & Recruitment",
    shortLabel: "Doctors – Nursing – Allied Staff",
    description:
      "Find the people your healthcare team needs — sourcing, screening and coordination across clinical, nursing, administrative and support roles.",
    icon: "users",
  },
  {
    id: "facility-setup",
    name: "Hospital, Clinic & Pharmacy Setup",
    shortLabel: "Planning – Setup – Launch",
    description:
      "From planning to operational readiness — land and infrastructure coordination, pharmacy setup, compliance, equipment and manpower for a new or renovated facility.",
    icon: "building",
  },
  {
    id: "insurance-tpa",
    name: "Insurance & TPA Coordination",
    shortLabel: "Empanelment – Follow-up",
    description:
      "Organized applications, clear follow-up and better visibility — coordination support for hospital empanelment with insurers and Third Party Administrators.",
    icon: "shield-heart",
  },
  {
    id: "equipment-infrastructure",
    name: "Medical Equipment & Infrastructure",
    shortLabel: "Calibration – Records – Coordination",
    description:
      "Coordinated calibration and organized equipment records — identification, inventory, qualified-provider coordination and documentation for medical devices.",
    icon: "gauge",
  },
];

export function getFamily(id: string) {
  return serviceFamilies.find((f) => f.id === id);
}
