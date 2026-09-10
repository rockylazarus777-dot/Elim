import { BlogPost } from "@/types/content";

/**
 * Educational articles built from EMC's own internal training material.
 * These are written to answer real questions hospital and clinic staff ask —
 * not to promote unverified claims. No statistics, certifications or client
 * outcomes are stated beyond what the source material provides.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-cea-registration",
    title: "What Is CEA Registration, and Does Your Clinic Need It?",
    excerpt:
      "CEA registration is one of the first compliance questions a new hospital or clinic runs into. Here's what it actually covers, and how to tell if it applies to you.",
    publishedAt: "2026-08-24",
    readingTime: "4 min read",
    category: "Compliance",
    icon: "document",
    relatedServiceSlugs: ["cea-registration", "nabh-accreditation", "drug-licence"],
    content: [
      {
        heading: "What CEA registration actually is",
        body: [
          "CEA stands for Clinical Establishments (Registration and Regulation) — a regulatory framework that provides for the registration and regulation of clinical establishments, and prescribes minimum standards for the healthcare services they offer.",
          "In plain terms: it is the formal registration process that identifies a hospital, clinic, nursing home, diagnostic centre or laboratory as a recognised clinical establishment, and sets out baseline standards it must meet.",
        ],
      },
      {
        heading: "Who typically needs it",
        body: [
          "Hospitals, nursing homes, clinics, diagnostic centres and laboratories may require CEA registration, depending on the establishment type and the state it operates in. A useful way to think about it: CEA registration is to a clinical establishment roughly what vehicle registration is to a vehicle — it formally identifies and regulates the establishment, but it doesn't by itself confirm the quality of care delivered inside it (that's closer to what NABH accreditation addresses).",
        ],
      },
      {
        heading: "New registration vs. renewal vs. an existing gap",
        body: [
          "Before anything else, it's worth identifying which situation applies: is this a new registration, a renewal of an existing one, or an existing compliance issue that needs to be resolved? Each path involves a different set of steps, and an existing certificate should never be assumed valid without checking its current status.",
        ],
      },
      {
        heading: "Why it matters beyond 'ticking a box'",
        body: [
          "Registration supports regulatory compliance, gives the facility a clearly defined scope of services, creates a documentation trail for the services offered, helps maintain the records regulators expect, and improves readiness for inspection or audit. It also builds credibility with patients, insurers and partners.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is CEA registration mandatory for every clinic?",
        answer:
          "It depends on the establishment type and the applicable state regulations — the right first step is assessing the specific facility's current status rather than assuming a blanket answer.",
      },
      {
        question: "How is CEA different from NABH accreditation?",
        answer:
          "CEA is regulatory registration of the establishment itself. NABH is a quality and patient-safety accreditation that looks at how systematically the establishment operates. A hospital can hold one, both, or neither — they solve different problems.",
      },
    ],
    seoTitle: "What Is CEA Registration? A Clear Guide for Hospitals & Clinics | EMC Healthcare Services",
    seoDescription:
      "A plain-language explanation of CEA (Clinical Establishments) registration — what it covers, who needs it, and how it differs from NABH accreditation.",
  },
  {
    slug: "nabh-accreditation-explained",
    title: "NABH Accreditation Explained: What It Actually Involves",
    excerpt:
      "NABH accreditation is often misunderstood as 'preparing files for an inspection.' Here's the fuller picture, stage by stage.",
    publishedAt: "2026-08-24",
    readingTime: "5 min read",
    category: "Quality & Accreditation",
    icon: "shield-check",
    relatedServiceSlugs: ["nabh-accreditation", "mrd-services", "fire-safety"],
    content: [
      {
        heading: "More than paperwork",
        body: [
          "NABH — the National Accreditation Board for Hospitals & Healthcare Providers — focuses on establishing and demonstrating structured systems for quality, patient safety, documentation, processes and continual improvement. It is not just about preparing files; it's about developing a systematic hospital environment where processes are standardised, documented, implemented and continuously improved.",
        ],
      },
      {
        heading: "The seven-stage journey",
        body: [
          "1. Initial assessment — understanding bed strength, departments, services, staffing, infrastructure, existing documents and current quality practices.",
          "2. Gap assessment — comparing existing practices against applicable NABH requirements.",
          "3. Documentation development — standardising policies, SOPs, manuals, checklists and quality indicators.",
          "4. Implementation — making sure processes are actually followed, not just written down.",
          "5. Staff training — covering documentation, patient identification, medication safety, infection prevention, fire safety, emergency preparedness, biomedical waste, MRD documentation, patient rights and incident reporting.",
          "6. Mock assessment — checking documents, implementation and staff awareness before the real assessment.",
          "7. Corrective action — identify, correct, implement, monitor, improve.",
        ],
      },
      {
        heading: "The principle that ties it together",
        body: [
          "Documentation plus implementation plus evidence equals strong compliance. A hospital might have a well-written Emergency Code Blue SOP, but if staff don't know the code, no training was conducted, and no mock-drill evidence exists, that's documentation without implementation — and it isn't yet compliant in practice.",
        ],
      },
    ],
    faqs: [
      {
        question: "We already provide good treatment — why pursue NABH?",
        answer:
          "Good treatment and standardised, documented, externally recognised quality systems are different things. NABH adds structured processes for patient safety, documentation and continuous improvement on top of clinical care.",
      },
      {
        question: "What levels of NABH accreditation exist?",
        answer:
          "Facilities can work toward Entry Level accreditation or full accreditation, with MRD (medical records) documentation support as part of the journey.",
      },
    ],
    seoTitle: "NABH Accreditation Explained Stage by Stage | EMC Healthcare Services",
    seoDescription:
      "How NABH accreditation actually works — the seven-stage journey from initial assessment to corrective action, explained in plain language.",
  },
  {
    slug: "biomedical-waste-segregation-guide",
    title: "Biomedical Waste Segregation: A Practical Guide for Small Clinics",
    excerpt:
      "\"We're only a small clinic — do we really need this?\" Yes. Here's what proper segregation looks like and why it's everyone's job, not just housekeeping's.",
    publishedAt: "2026-08-24",
    readingTime: "3 min read",
    category: "Documentation & Safety",
    icon: "biohazard",
    relatedServiceSlugs: ["biomedical-waste", "tnpcb-registration", "mrd-services"],
    content: [
      {
        heading: "It's a shared responsibility",
        body: [
          "Biomedical waste management is not only a housekeeping responsibility. It involves doctors, nurses, the laboratory, housekeeping, pharmacy, administration and waste handlers together — because waste is generated at every one of those points.",
        ],
      },
      {
        heading: "Segregate at the point of generation",
        body: [
          "Waste should be segregated into the correct category the moment it's produced — not sorted later. Always follow the latest applicable regulation and the instructions of your authorised biomedical waste treatment facility, rather than relying on an outdated colour chart, since categories and rules can be updated.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Mixing general waste with biomedical waste, or sharps with plastic waste. Throwing needles into general waste. Improperly labelled or overfilled containers. Lack of staff training or missing records.",
        ],
      },
      {
        heading: "What good practice looks like",
        body: [
          "A valid BMW authorisation and agreement with an authorised waste-management agency. Correct containers, bags and labelling. Segregation at the point of generation. PPE for waste handlers, plus clear spill and needle-stick injury procedures. Regular staff training, periodic monitoring, and complete records.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do small clinics really need biomedical waste authorisation?",
        answer:
          "Yes. Even small clinics generate biomedical waste and need documented authorisation — the arrangement can be scoped with or without regular waste collection, depending on how much waste the clinic generates.",
      },
      {
        question: "Who is responsible for waste segregation in a hospital?",
        answer:
          "Everyone who generates it — doctors, nurses, lab staff, housekeeping, pharmacy and administration all play a role, not housekeeping alone.",
      },
    ],
    seoTitle: "Biomedical Waste Segregation Guide for Clinics & Hospitals | EMC Healthcare Services",
    seoDescription:
      "A practical guide to biomedical waste segregation for hospitals and clinics — common mistakes, good practice, and why even small clinics need authorisation.",
  },
  {
    slug: "mrd-digitization-more-than-scanning",
    title: "MRD Digitization Is More Than Scanning Old Files",
    excerpt:
      "Converting a hospital's paper records into a digital system takes more than a scanner. Here's the actual process — and why deficiencies matter first.",
    publishedAt: "2026-08-24",
    readingTime: "4 min read",
    category: "Documentation & Safety",
    icon: "folder",
    relatedServiceSlugs: ["mrd-services", "nabh-accreditation"],
    content: [
      {
        heading: "If it isn't documented, it's hard to prove it was done",
        body: [
          "That's the core training message behind MRD (Medical Records Department) work: good documentation protects the patient, the doctor, the hospital and the organisation, in that order.",
        ],
      },
      {
        heading: "What counts as a deficiency",
        body: [
          "A deficiency means required information is missing, incomplete, illegible, incorrectly filled, unsigned, undated, untimed, unauthenticated, or incorrectly filed. Common examples: a doctor's note without a signature, a medication order without authentication, a consent form missing a required signature, or an investigation report that was never attached.",
        ],
      },
      {
        heading: "Digitization is a process, not a step",
        body: [
          "Converting eligible physical records into a structured digital system requires planning, classification, scanning, indexing, a quality check, secure storage, and a defined retrieval process — scanning alone doesn't create a usable digital archive.",
        ],
      },
      {
        heading: "Physical vs. digital, side by side",
        body: [
          "Physical records involve file numbering, indexing, shelving, filing, retrieval and archiving, and commonly run into misfiling, missing files, duplicates, storage limits and slow retrieval. A well-built digital system offers faster retrieval, better accessibility, reduced storage needs, easier audits and better tracking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should we fix deficiencies before or after digitizing records?",
        answer:
          "Deficiency identification and closure are part of a sound MRD process alongside digitization — digitizing an incomplete or unsigned record doesn't make it complete, so both matter together.",
      },
      {
        question: "What does 'quality check' mean in a digitization project?",
        answer:
          "It's the step that confirms scanned and indexed records are accurate, complete and correctly filed in the digital system before they're relied on for retrieval — part of the planning → classification → scanning → indexing → quality check → secure storage → retrieval sequence.",
      },
    ],
    seoTitle: "MRD Digitization Explained: The Real Process Behind Scanning Records | EMC Healthcare Services",
    seoDescription:
      "MRD digitization takes more than a scanner. Here's the real planning-to-retrieval process, and why fixing documentation deficiencies matters first.",
  },
  {
    slug: "fire-safety-pass-method-hospitals",
    title: "The PASS Method and 4 Fire Safety Principles Every Hospital Should Know",
    excerpt:
      "Hospitals are higher fire risk than most buildings. A quick, practical refresher on the PASS method and the four principles behind hospital fire safety.",
    publishedAt: "2026-08-24",
    readingTime: "3 min read",
    category: "Documentation & Safety",
    icon: "flame",
    relatedServiceSlugs: ["fire-safety", "stability-certificate"],
    content: [
      {
        heading: "Why hospitals are higher risk",
        body: [
          "Patients may not be able to walk unaided. Facilities often contain oxygen systems, electrical equipment and medical gases, alongside generators, kitchens, laboratories and electrical rooms — plus large numbers of visitors and, in some areas, flammable materials.",
        ],
      },
      {
        heading: "Four basic principles",
        body: [
          "Prevention — identify and remove fire hazards before they become incidents. Detection — keep alarm and detection systems functional. Response — make sure staff know exactly what to do when a fire occurs. Evacuation — move patients and staff safely, according to the facility's emergency plan.",
        ],
      },
      {
        heading: "The PASS method for extinguishers",
        body: [
          "Pull the pin. Aim at the base of the fire. Squeeze the handle. Sweep from side to side. Staff should only attempt firefighting when trained, the situation is appropriate, and a safe escape route is available.",
        ],
      },
      {
        heading: "Fire drills test more than the alarm",
        body: [
          "A fire drill isn't just an activity to satisfy a requirement — it tests whether staff actually know what to do. Good drills check alarm activation, staff response, communication, patient movement, evacuation routes, equipment, the assembly point, department coordination and time taken. After every drill: identify gaps, correct them, document the corrective action, and follow up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a Fire NOC the same as basic fire safety arrangements?",
        answer:
          "No — they're related but not the same thing. Fire safety arrangements (like extinguishers and staff preparedness) are day-to-day practice, while a Fire NOC / certification is a separate regulatory requirement that depends on the specific site.",
      },
      {
        question: "What does PASS stand for?",
        answer: "Pull the pin, Aim at the base, Squeeze the handle, Sweep from side to side.",
      },
    ],
    seoTitle: "Hospital Fire Safety: The PASS Method & 4 Core Principles | EMC Healthcare Services",
    seoDescription:
      "A practical hospital fire safety refresher — the four core principles (prevention, detection, response, evacuation) and the PASS method for extinguishers.",
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getBlogPostBySlug(slug);
  if (!current) return [];
  return blogPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.relatedServiceSlugs.some((s) => current.relatedServiceSlugs.includes(s)))
    .slice(0, limit);
}
