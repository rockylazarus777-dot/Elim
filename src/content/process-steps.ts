import { IconKey, ServiceFamily } from "@/types/content";

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  family: ServiceFamily;
  icon: IconKey;
  photoSrc?: string;
  photoAlt?: string;
}

/**
 * EMC's general engagement pattern, synthesized from the process steps that
 * repeat across the company's own service documentation (assessment → gap
 * identification → documentation/implementation → training → ongoing
 * support/renewal → cross-selling into further services) — not a separate,
 * invented claim.
 */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "Understand the healthcare organisation, its requirements, challenges and priorities.",
    family: "compliance-licensing",
    icon: "handshake",
    photoSrc: "/images/services/O1 Understand.png",
    photoAlt: "Understand — diverse team collaborating with a laptop in a modern office, understanding requirements and status.",
  },
  {
    number: "02",
    title: "Assess & Plan",
    description:
      "Evaluate requirements and define the appropriate approach and action plan.",
    family: "records-management",
    icon: "folder",
    photoSrc: "/images/services/02 Assess & Plan.png",
    photoAlt: "Evaluate requirements and define the appropriate approach and action plan.",
  },
  {
    number: "03",
    title: "Implement",
    description:
      "Put documentation, coordination and on-ground requirements into action.",
    family: "equipment-infrastructure",
    icon: "gauge",
    photoSrc: "/images/services/03 Implement.png",
    photoAlt: "Implement — implementation phase with hands-on work and coordination.",
  },
  {
    number: "04",
    title: "Train & Support",
    description:
      "Guide teams and provide practical support for effective implementation.",
    family: "marketing",
    icon: "users",
    photoSrc: "/images/services/Train & Support.png",
    photoAlt: "Train & Support — healthcare professionals in training session with presentation materials.",
  },
  {
    number: "05",
    title: "Grow With You",
    description:
      "Guide teams and provide practical support for effective implementation.",
    family: "medical-camps",
    icon: "trending-up",
    photoSrc: "/images/services/Grow With You.png",
    photoAlt: "Grow With You — partnership and growth journey with EMC Healthcare Services.",
  },
];
