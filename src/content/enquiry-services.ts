/**
 * Shared "which service are you enquiring about" dropdown options — used by
 * both the main Contact page form (ContactForm.tsx) and the chatbot's
 * enquiry form, so the two never drift apart.
 */
export const enquiryServiceOptions = [
  "CEA Registration & Renewal",
  "Drug Licence & Renewal",
  "NABH & Quality Accreditation",
  "MRD Services",
  "Biomedical Waste Management",
  "Fire & Safety Compliance",
  "Medical Equipment Calibration",
  "Insurance & TPA Empanelment",
  "Healthcare Recruitment & Staffing",
  "Hospital & Clinic Marketing",
  "Digital Marketing & Social Media",
  "Website Development",
  "Medical Camps",
  "Health at Home",
  "Something else",
] as const;
