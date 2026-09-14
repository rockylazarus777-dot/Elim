import { ServiceContent } from "@/types/content";
import { complianceSubServices } from "./compliance-subservices";

/**
 * All copy below is drawn from EMC Healthcare Services' own internal
 * training material and the company's own service-content brief. Pricing
 * and exact timelines beyond the indicative ranges the company has approved
 * are intentionally omitted — nothing below is invented, and every
 * "EMC does not guarantee..." / "issued by the relevant authority..."
 * disclaimer is preserved deliberately, not softened.
 *
 * Organised into EMC's nine core service groups (see service-families.ts).
 * The six Healthcare Compliance & Licensing sub-services also each have a
 * bespoke long-form landing page — see src/content/compliance-subservices.ts
 * and src/app/services/healthcare-compliance/[subslug].
 */

export const services: ServiceContent[] = [
  // ---------------------------------------------------------------------
  // 01 — HEALTHCARE COMPLIANCE & LICENSING
  // ---------------------------------------------------------------------
  {
    slug: "cea-registration",
    family: "compliance-licensing",
    icon: "document",
    isCore: true,
    name: "CEA Registration & Renewal",
    positioning: "Focus on Patient Care. Let EMC Support Your Registration & Renewal.",
    shortDescription:
      "Registration and regulation support under the Clinical Establishments (Registration & Regulation) framework, from new applications through renewal.",
    whatIsIt:
      "CEA stands for Clinical Establishments (Registration and Regulation) — the regulatory framework that provides for the registration and regulation of clinical establishments and prescribes minimum standards for the healthcare services they offer. EMC provides structured support from facility assessment and documentation through application submission, inspection preparation, follow-up and certificate coordination.",
    whyItMatters: [
      "Regulatory compliance for the establishment",
      "Formal identification and defined scope of services for the facility",
      "Structured documentation of the services offered",
      "Maintenance of the records regulators expect to see",
      "Inspection and audit readiness",
      "Credibility with patients, insurers and partners",
    ],
    whoNeedsIt: [
      "Hospitals and nursing homes",
      "General and specialty clinics",
      "Polyclinics and multispeciality centres",
      "Dental clinics",
      "Physiotherapy centres",
      "Diagnostic centres and laboratories",
      "Other healthcare establishments",
    ],
    process: [
      { title: "Initial consultation & requirement assessment", description: "Confirm whether the establishment is unregistered, mid-renewal, or has an existing compliance gap." },
      { title: "Site visits & infrastructure guidance", description: "Review the establishment's current situation and the requirements that may apply to its facility." },
      { title: "Document verification & preparation", description: "Coordinate the paperwork the registration or renewal process requires." },
      { title: "Application preparation & submission", description: "Support the preparation and submission of the registration or renewal application." },
      { title: "Coordination of supporting approvals", description: "Coordinate supporting approvals and information required for the application, where applicable." },
      { title: "Inspection preparation & coordination", description: "Help the establishment organise its documentation and prepare for the relevant inspection process." },
      { title: "Application follow-up & clarification support", description: "Coordinate with the client through submission and follow-up until the matter is resolved." },
      { title: "Certificate coordination & renewal planning", description: "Support certificate coordination and help review whether an existing registration is still valid when renewal is due." },
    ],
    faqs: [
      {
        question: "What is CEA registration?",
        answer:
          "CEA registration is registration under the Clinical Establishments (Registration and Regulation) framework — the system that registers and regulates hospitals, clinics, nursing homes, diagnostic centres and laboratories, and sets minimum standards for the healthcare services they provide.",
      },
      {
        question: "Who needs CEA registration?",
        answer:
          "Hospitals, nursing homes, clinics, diagnostic centres, laboratories and other healthcare establishments may require CEA registration, depending on the applicable state and establishment type.",
      },
      {
        question: "How does EMC help with CEA registration?",
        answer:
          "EMC assesses the establishment's current registration status, identifies which requirements apply, helps organise the documentation, and supports the client through the registration or renewal process. EMC does not guarantee registration outcomes or timelines — every case depends on the establishment's specific circumstances.",
      },
      {
        question: "Does a CEA registration ever expire?",
        answer:
          "Yes — CEA registration is renewed periodically. EMC also supports renewal applications and can help review whether an existing registration is still valid.",
      },
    ],
    previousWork: [
      "Jayam Speciality Clinic",
      "Joy Family Multispeciality Clinic",
      "Apex Wellness Co",
      "Annai Hospital",
      "Dr. Vishal Venugopal",
      "Royal Pearl ENT & Dental Clinic",
      "Rasi Clinic",
    ],
    photoSrc: "/images/services/cea-registration-renewal-emc.png",
    photoAlt: "CEA Registration & Renewal — EMC Healthcare Services consultant holding a CEA registration certificate, end-to-end support, timely renewal and compliance assistance for healthcare establishments.",
    relatedServiceSlugs: ["drug-licence", "nabh-accreditation", "tnpcb-registration"],
    seoTitle: "CEA Registration & Renewal Support for Hospitals & Clinics | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services helps hospitals, nursing homes, clinics and diagnostic centres assess, organise and complete CEA (Clinical Establishments) registration and renewal.",
    keywords: ["CEA registration", "clinical establishment registration", "hospital registration compliance"],
    timeline: {
      indicative: "30–45 days",
      note: "Indicative only, when required documents and facility readiness are in place. Actual completion depends on the applicable process, supporting approvals, inspections and authority processing.",
    },
    scopeNote: "EMC does not issue or guarantee registration. Registrations and approvals are issued by the relevant authorities.",
    audienceGroups: [
      { title: "Hospitals & Nursing Homes", detail: "Hospitals and nursing homes" },
      { title: "Clinics & Polyclinics", detail: "General and specialty clinics; polyclinics and multispeciality centres" },
      { title: "Diagnostic Centres & Laboratories", detail: "Diagnostic centres and laboratories" },
      { title: "Dental, Physiotherapy & Specialty Centres", detail: "Dental clinics; physiotherapy centres" },
      { title: "Other Healthcare Establishments", detail: "Other healthcare establishments" },
    ],
    benefitCards: [
      { title: "Regulatory Compliance", detail: "Regulatory compliance for the establishment" },
      { title: "Defined Facility Scope", detail: "Formal identification and defined scope of services for the facility" },
      { title: "Structured Documentation", detail: "Structured documentation of the services offered, and maintenance of the records regulators expect to see" },
      { title: "Inspection Readiness", detail: "Inspection and audit readiness" },
      { title: "Organisational Credibility", detail: "Credibility with patients, insurers and partners" },
    ],
  },
  {
    slug: "drug-licence",
    family: "compliance-licensing",
    icon: "pill",
    isCore: true,
    name: "Drug Licence Registration & Renewal",
    positioning: "Focus on Your Operations. Let EMC Support Your Drug Licensing.",
    shortDescription:
      "Support obtaining and renewing the drug licence required for applicable drug-related activities at a hospital, clinic or pharmacy.",
    whatIsIt:
      "A drug licence is a regulatory authorisation required for applicable activities involving drugs and medicines. The exact licence needed depends on the establishment type, the type of drugs involved, the nature of the activity, storage requirements, and sale or dispensing arrangements, under applicable state and central regulations. Manufacturing applications are distinct from retail and wholesale pharmacy applications, and EMC confirms which category applies before proceeding.",
    whyItMatters: [
      "Proper storage of drugs and medicines",
      "Correct handling and documentation",
      "Accurate purchase and stock records",
      "Expiry monitoring",
      "Authorised personnel for regulated activities",
      "Inspection readiness",
    ],
    whoNeedsIt: [
      "Retail pharmacies",
      "Wholesale medicine distributors",
      "Hospital and clinic pharmacies",
      "Pharmaceutical manufacturing units",
    ],
    process: [
      { title: "Requirement assessment", description: "Understand the establishment and the specific drug-related activity involved." },
      { title: "Site visits", description: "Review the premises against the applicable licence requirements." },
      { title: "Layout & storage guidance", description: "Advise on storage arrangements the application and ongoing compliance require." },
      { title: "Document coordination", description: "Identify and coordinate the documents the application requires." },
      { title: "Application preparation", description: "Prepare the application for the applicable licence category." },
      { title: "Application submission", description: "Support submission through the appropriate process." },
      { title: "Registered pharmacist recruitment support", description: "Support sourcing a registered pharmacist where the licence requires one." },
      { title: "Storage & record-maintenance guidance", description: "Review storage, purchase/stock records and expiry monitoring." },
      { title: "Inspection preparation", description: "Help the establishment prepare for the Drugs Control Department's inspection." },
      { title: "Drugs Control Department follow-up", description: "Coordinate with the department through to resolution." },
      { title: "Renewal & retention support", description: "Support renewal when the existing licence is due to expire." },
      { title: "Changes to premises, ownership or personnel", description: "Support the applicable process when premises, ownership, the pharmacist or approved personnel change." },
    ],
    faqs: [
      {
        question: "What is a drug licence and who needs one?",
        answer:
          "A drug licence is a regulatory authorisation required for applicable activities involving drugs or medicines. Retail pharmacies, wholesale distributors, hospital/clinic pharmacies and pharmaceutical manufacturing units typically need one — the exact licence depends on the establishment and activity type, and manufacturing applications are distinct from retail/wholesale applications.",
      },
      {
        question: "How does EMC support a drug licence application?",
        answer:
          "EMC assesses the establishment's requirement, advises on layout and storage, helps identify and collect the necessary documents, supports the application process and registered-pharmacist recruitment where required, flags compliance gaps such as storage or expiry-monitoring issues, and supports renewal when it falls due.",
      },
    ],
    previousWork: ["Joy Family Hospital/Clinic", "Annai Hospital", "Dr. Kannan Ortho Clinic"],
    photoSrc: "/images/services/drug-licence-renewal-emc.png",
    photoAlt: "Drug Licence & Renewal — approved drug licence certificate on a clipboard, expert support for hassle-free drug licence registration and renewal for hospitals, clinics and pharmacies.",
    relatedServiceSlugs: ["cea-registration", "nabh-accreditation"],
    seoTitle: "Drug Licence Application & Renewal Support | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services supports retail pharmacies, wholesale distributors, hospital/clinic pharmacies and manufacturing units with drug licence applications, renewals and compliance gap identification.",
    keywords: ["drug licence hospital", "pharmacy drug licence renewal", "healthcare drug licence support"],
    timeline: {
      indicative: "30–45 days",
      note: "Indicative for a new licence, subject to facility readiness and Drugs Control Department processing.",
    },
    scopeNote: "EMC does not guarantee licence issuance. Drug licences are issued by the Drugs Control Department.",
  },
  {
    slug: "biomedical-waste",
    family: "compliance-licensing",
    icon: "biohazard",
    isCore: true,
    name: "Biomedical Waste Authorization & Renewal",
    positioning: "Clear Applications. Coordinated Waste-Service Arrangements.",
    shortDescription:
      "Authorisation, segregation compliance and coordinated waste-service arrangements for hospitals and clinics of every size.",
    whatIsIt:
      "Biomedical waste is waste generated during healthcare activities that requires appropriate segregation, handling, storage, treatment and disposal — including used dressings, blood-contaminated materials, gloves, needles and syringes, sharps, and laboratory waste. It is not only a housekeeping responsibility: it involves doctors, nurses, laboratory staff, housekeeping, pharmacy, administration and waste handlers together.",
    whyItMatters: [
      "Reduces infection risk and needle-stick injuries",
      "Prevents environmental contamination and exposure of staff",
      "Avoids regulatory non-compliance and penalties",
      "Protects the hospital's reputation",
    ],
    whoNeedsIt: [
      "Hospitals",
      "Clinics",
      "Nursing homes",
      "Diagnostic centres",
      "Laboratories",
      "Other applicable healthcare establishments",
    ],
    process: [
      { title: "Requirement assessment", description: "Review current waste volumes, categories and existing arrangements." },
      { title: "Documentation", description: "Prepare the documentation the authorization or renewal process requires." },
      { title: "Application preparation", description: "Prepare the application for submission." },
      { title: "Online submission", description: "Support submission through the applicable online process." },
      { title: "Departmental follow-up", description: "Coordinate with the department through to resolution." },
      { title: "Inspection coordination", description: "Help the establishment prepare for and coordinate any inspection." },
      { title: "Review of existing authorization", description: "Confirm whether an existing authorization is still valid." },
      { title: "Waste-treatment facility agreement coordination", description: "Coordinate authorized waste-treatment facility agreements, where required." },
    ],
    faqs: [
      {
        question: "Where should biomedical waste segregation happen?",
        answer:
          "At the point of generation — waste must be segregated into the correct category as soon as it is produced, following the latest applicable regulation and the instructions of the authorised biomedical waste treatment facility.",
      },
      {
        question: "Does a small clinic really need biomedical waste authorization?",
        answer:
          "Yes — even small clinics need documented biomedical waste authorization. EMC can support this with or without regular waste collection, depending on the clinic's waste volume.",
      },
      {
        question: "Is regulatory authorization the same as arranging waste collection?",
        answer:
          "No — they are distinct. Regulatory authorization and waste collection/vendor arrangements are different matters; collection, transportation, treatment and disposal are carried out by the authorized service provider, coordinated separately from the authorization itself.",
      },
    ],
    photoSrc: "/images/services/biomedical-waste-management-emc.png",
    photoAlt: "Biomedical Waste Management — EMC staff safely segregating colour-coded biomedical waste bins (infectious, sharps, biohazard) for safe collection, treatment and regulatory compliance.",
    relatedServiceSlugs: ["tnpcb-registration", "fire-safety", "mrd-services"],
    seoTitle: "Biomedical Waste Authorization & Renewal for Healthcare Facilities | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services supports biomedical waste authorization, renewal and coordinated waste-service arrangements for hospitals and clinics.",
    keywords: ["biomedical waste management hospital", "BMW authorization clinic", "hospital waste segregation compliance"],
    scopeNote:
      "Regulatory authorization and waste collection/vendor arrangements are distinct — collection, transportation, treatment and disposal are carried out by the authorized service provider. EMC does not automatically include bins, bags or staff training unless specifically agreed.",
    audienceGroups: [
      { title: "Hospitals & Nursing Homes", detail: "Hospitals; nursing homes" },
      { title: "Clinics", detail: "Clinics" },
      { title: "Diagnostic Centres & Laboratories", detail: "Diagnostic centres; laboratories" },
      { title: "Other Applicable Establishments", detail: "Other applicable healthcare establishments" },
    ],
  },
  {
    slug: "fire-safety",
    family: "compliance-licensing",
    icon: "flame",
    isCore: true,
    name: "Fire Safety & NOC / Certification",
    positioning: "Prepare Your Facility. Progress Your Fire Safety Requirements.",
    shortDescription:
      "Fire safety compliance guidance and coordination for Fire NOC / certification requirements, kept distinct from technical fire-safety services.",
    whatIsIt:
      "Hospitals are high-risk environments for fire safety: patients may not be able to walk unaided, and facilities often contain oxygen systems, electrical equipment, medical gases, generators, kitchens and laboratories. EMC reviews existing approvals, assesses the site, guides compliance, prepares and coordinates the Fire NOC / certification application, and supports inspections and renewals. Fire NOC / certification is not the same thing as day-to-day fire-safety arrangements, and EMC keeps the two distinct.",
    whyItMatters: [
      "Prevention — identifying and removing fire hazards before they become incidents",
      "Detection — keeping alarm and detection systems functional",
      "Response — ensuring staff know what to do when a fire occurs",
      "Evacuation — safely moving patients and staff per the emergency plan",
    ],
    whoNeedsIt: [
      "Hospitals and clinics of any size — fire risk applies regardless of facility size",
      "Facilities preparing for a Fire NOC / certification application",
      "Hospitals with an existing approval that is due for renewal",
    ],
    process: [
      { title: "Existing approval review", description: "Confirm the establishment's current NOC / certification status." },
      { title: "Site assessment", description: "Review the establishment's size, setup and existing fire safety arrangements." },
      { title: "Compliance guidance", description: "Advise on the gaps between current arrangements and applicable requirements." },
      { title: "Application preparation", description: "Prepare the Fire NOC / certification application." },
      { title: "Submission", description: "Support submission to the relevant authority." },
      { title: "Inspection coordination", description: "Coordinate the applicable inspection process." },
      { title: "Observation & query support", description: "Support the establishment in responding to inspection observations or queries." },
      { title: "Renewal support", description: "Support renewal when the existing NOC / certification is due to expire." },
    ],
    faqs: [
      {
        question: "Is a Fire NOC the same as having fire extinguishers on site?",
        answer:
          "No. Fire safety arrangements (extinguishers, alarm/hydrant/sprinkler systems, staff training) are technical services arranged separately where agreed. A Fire NOC / certification is a distinct regulatory approval that EMC coordinates on the establishment's behalf.",
      },
      {
        question: "Does EMC install or service fire-safety equipment?",
        answer:
          "Fire extinguishers, alarm systems, hydrant systems, sprinkler systems, and their installation, servicing, refilling, staff training and mock drills are technical services arranged separately where agreed — EMC's core role here is the NOC / certification process and compliance guidance.",
      },
      {
        question: "What are the four basic fire safety principles in a hospital?",
        answer:
          "Prevention (identify and remove hazards), Detection (functional alarm systems), Response (staff know what to do), and Evacuation (safely moving patients and staff per the emergency plan).",
      },
    ],
    photoSrc: "/images/services/fire-safety-compliance-emc.png",
    photoAlt: "Fire & Safety Compliance — safety officer inspecting a fire extinguisher and fire safety signage in a hospital corridor, covering fire risk assessment, staff training and NOC compliance.",
    relatedServiceSlugs: ["stability-certificate", "biomedical-waste", "nabh-accreditation"],
    seoTitle: "Fire Safety & NOC / Certification Coordination for Hospitals | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services reviews, prepares and coordinates Fire NOC / certification applications for hospitals and clinics, kept distinct from technical fire-safety services.",
    keywords: ["hospital fire safety compliance", "fire NOC hospital", "healthcare facility fire drill training"],
    scopeNote:
      "Fire extinguishers, alarm/hydrant/sprinkler systems, their installation, servicing, refilling, staff training and mock drills are technical services arranged separately where agreed. EMC coordinates the NOC/certification process — the NOC/certificate itself is issued by the relevant authority.",
  },
  {
    slug: "tnpcb-registration",
    family: "compliance-licensing",
    icon: "map-pin",
    isCore: true,
    name: "TNPCB Registration / Approval & Renewal",
    positioning: "A Clearer Path Through Your Pollution-Control Requirements.",
    shortDescription:
      "Support with applicable Tamil Nadu Pollution Control Board (TNPCB) and related environmental / waste-management registration requirements.",
    whatIsIt:
      "TNPCB is the Tamil Nadu Pollution Control Board — the authority responsible for applicable environmental and waste-related registration for establishments in Tamil Nadu. Depending on the establishment, applicable requirements may include Consent to Establish, Consent to Operate, Biomedical Waste Authorization, or other applicable pollution-control requirements. EMC assesses regulatory applicability, identifies which consents/authorizations apply, and coordinates the application, inspection and renewal process; the exact scope is always confirmed based on the specific establishment.",
    whyItMatters: [
      "Environmental and waste-management compliance",
      "Alignment with biomedical waste management requirements",
      "Reduced risk at inspection or audit",
    ],
    whoNeedsIt: [
      "Hospitals, clinics and diagnostic centres operating in Tamil Nadu that require TNPCB-related certification",
      "Establishments unsure whether TNPCB requirements apply to a small facility — EMC assesses this on a case-by-case basis",
    ],
    process: [
      { title: "Regulatory applicability assessment", description: "Confirm establishment type, bed count and current registration status." },
      { title: "Identification of applicable consents", description: "Identify which of Consent to Establish, Consent to Operate, BMW Authorization or other requirements apply." },
      { title: "Documentation", description: "Prepare the documentation the applicable consent/authorization requires." },
      { title: "Application preparation", description: "Prepare the application for submission." },
      { title: "Online submission", description: "Support submission through the applicable online process." },
      { title: "Inspection coordination", description: "Coordinate the applicable inspection process." },
      { title: "Query support", description: "Support the establishment in responding to departmental queries." },
      { title: "Renewals & amendments", description: "Support renewal and any amendments to an existing consent/authorization." },
    ],
    faqs: [
      {
        question: "Is TNPCB registration the same as biomedical waste authorisation?",
        answer:
          "No — they are related but distinct requirements. Depending on the establishment, applicable requirements may include Consent to Establish, Consent to Operate, Biomedical Waste Authorization, or other pollution-control requirements. EMC confirms the establishment type, bed count and current status before advising which registrations apply.",
      },
      {
        question: "Does every healthcare facility need the same TNPCB approvals?",
        answer:
          "No — applicability is assessed case-by-case based on the establishment type and its activities. EMC does not assume every facility requires the same set of approvals.",
      },
    ],
    photoSrc: "/images/services/tnpcb-registration-emc.png",
    photoAlt: "TNPCB Registration & Renewal — a TNPCB (Tamil Nadu Pollution Control Board) checklist covering registration, approval and renewal, alongside colour-coded biomedical waste bins for biohazard, infectious and general waste.",
    relatedServiceSlugs: ["biomedical-waste", "cea-registration"],
    seoTitle: "TNPCB Registration, Approval & Renewal for Healthcare Establishments | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services assesses applicability and coordinates TNPCB Consent to Establish, Consent to Operate and related registration and renewal requirements.",
    keywords: ["TNPCB registration hospital", "pollution control board healthcare", "consent to operate hospital"],
    scopeNote: "Not every healthcare facility requires the same TNPCB approvals — EMC confirms applicability on a case-by-case basis before advising on scope.",
  },
  {
    slug: "stability-certificate",
    family: "compliance-licensing",
    icon: "ruler",
    isCore: true,
    name: "Stability & Suitability Certificate",
    positioning: "Professional Assessment for Your Healthcare Premises.",
    shortDescription:
      "Coordinating building stability certification through a qualified structural professional, confirming a facility is structurally suitable for healthcare use.",
    whatIsIt:
      "A stability (or suitability) certificate is a documented, professional confirmation — issued by a qualified structural professional — that a building is structurally safe for healthcare use. EMC coordinates this process on behalf of hospitals and clinics; the qualified professional determines the assessment and certification itself.",
    whyItMatters: [
      "A documented, professional confirmation of structural safety — not an assumption",
      "Often required as part of a wider compliance or registration file",
    ],
    whoNeedsIt: [
      "New hospital or clinic buildings",
      "Existing buildings that need documented structural confirmation for compliance purposes",
    ],
    process: [
      { title: "Requirement assessment", description: "Confirm why the certificate is needed and which process applies." },
      { title: "Building-document review", description: "Review the building's existing documentation." },
      { title: "Plan review", description: "Review the facility's building plans against the certification requirement." },
      { title: "Coordination with structural professionals", description: "Arrange for a qualified structural professional to assess the building." },
      { title: "Site inspection facilitation", description: "Facilitate the professional's site inspection." },
      { title: "Suitability coordination", description: "Coordinate the suitability assessment for healthcare use." },
      { title: "Certificate & submission coordination", description: "Coordinate the documented certificate for the facility's records and any related submission." },
    ],
    faqs: [
      {
        question: "Our building is already old — why do we need a stability certificate?",
        answer:
          "Stability certification is a documented, professional confirmation issued by a qualified structural professional — not a one-time assumption. It provides current, verifiable evidence the building is structurally safe for healthcare use.",
      },
      {
        question: "Does EMC issue the stability certificate itself?",
        answer:
          "No. EMC coordinates the process — requirement assessment, document and plan review, and coordination with a qualified structural professional — but the professional determines the assessment and certification.",
      },
    ],
    photoSrc: "/images/services/stability-certificate-emc.png",
    photoAlt: "Building Stability & Suitability Certificate — a structural stability certificate checklist alongside building plans, a hard hat and a spirit level outside a hospital, covering safety, compliance and suitability sign-off.",
    relatedServiceSlugs: ["cea-registration", "fire-safety"],
    seoTitle: "Building Stability & Suitability Certificate for Hospitals | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services coordinates stability and suitability certification through a qualified structural professional for hospital and clinic buildings.",
    keywords: ["hospital building stability certificate", "healthcare facility suitability certificate"],
    scopeNote: "EMC coordinates the process. The qualified structural professional determines the assessment and certification — EMC does not directly issue structural certification.",
  },

  // ---------------------------------------------------------------------
  // 02 — NABH, NABL & QUALITY ACCREDITATION
  // ---------------------------------------------------------------------
  {
    slug: "nabh-accreditation",
    family: "quality-accreditation",
    icon: "shield-check",
    isCore: true,
    name: "NABH & Quality Accreditation",
    positioning: "Focus on Quality Care. Let EMC Support Your NABH Journey.",
    shortDescription:
      "End-to-end support for NABH accreditation — assessment, gap analysis, documentation, staff training and assessment readiness.",
    whatIsIt:
      "NABH stands for the National Accreditation Board for Hospitals & Healthcare Providers. NABH accreditation focuses on establishing and demonstrating structured systems for quality, patient safety, documentation, processes and continual improvement. It is not only about preparing files — it is about developing a systematic hospital environment where processes are standardised, documented, implemented and continuously improved. EMC supports establishments at Entry Level, toward full accreditation, and with complete MRD documentation support along the way.",
    whyItMatters: [
      "Structured quality systems across the facility",
      "Stronger patient safety and patient-rights practices",
      "Better, more consistent medication management and infection prevention",
      "Medical-records documentation aligned to accreditation requirements",
      "Staff awareness, training and emergency preparedness",
      "Incident reporting, audits and patient feedback built into daily practice",
      "Continual improvement, not a one-time inspection",
    ],
    whoNeedsIt: [
      "Hospitals and clinics starting their accreditation journey",
      "Establishments preparing for entry-level or full NABH assessment",
      "Facilities that already have documentation but want stronger implementation and evidence",
    ],
    process: [
      { title: "Initial assessment", description: "Understand bed strength, departments, services, staffing, infrastructure, existing documents, registers, policies, patient records, safety systems and current quality practices." },
      { title: "Gap assessment", description: "Compare existing practices against applicable NABH requirements and identify documentation, implementation, infrastructure and training gaps." },
      { title: "Documentation development", description: "Support preparation and standardisation of policies, SOPs, manuals, checklists, registers, quality indicators, patient-safety and infection-control documents." },
      { title: "Implementation", description: "Support the hospital in ensuring processes are actually followed, not just documented." },
      { title: "Staff training", description: "Train staff on documentation, patient identification, medication safety, infection prevention, fire safety, emergency preparedness, biomedical waste, MRD documentation, patient rights and incident reporting." },
      { title: "Internal audits & mock assessment", description: "Check documents, implementation, evidence and staff awareness before the external assessment." },
      { title: "Corrective action & application coordination", description: "Identify, correct, implement, monitor and improve on an ongoing basis, and coordinate the accreditation application." },
    ],
    faqs: [
      {
        question: "What is NABH accreditation?",
        answer:
          "NABH (National Accreditation Board for Hospitals & Healthcare Providers) accreditation is a structured quality and patient-safety accreditation for hospitals and healthcare providers. It focuses on standardised, documented, implemented and continually improved systems — not just paperwork.",
      },
      {
        question: "Is NABH mandatory, and why should an already well-run hospital pursue it?",
        answer:
          "Even hospitals that already provide good treatment benefit from NABH, because it establishes standardised processes for patient safety, documentation, staff responsibilities and quality improvement that go beyond day-to-day clinical care.",
      },
      {
        question: "How does EMC support a hospital through NABH?",
        answer:
          "EMC first assesses the hospital's existing systems, identifies gaps against NABH requirements, develops and standardises the required documents, trains staff, supports implementation, runs internal audits and mock assessments, and coordinates the application through to external assessment. EMC does not guarantee NABH accreditation — the final decision belongs to NABH.",
      },
      {
        question: "What is the key principle behind strong NABH compliance?",
        answer:
          "Documentation plus implementation plus evidence equals strong compliance. A policy that exists on paper but isn't followed or evidenced by staff training and drills is not yet compliant — EMC's process addresses all three together.",
      },
    ],
    previousWork: ["Mahalakshmi Hospital", "Ambal Healthcare"],
    photoSrc: "/images/services/nabh-quality-accreditation-emc.png",
    photoAlt: "NABH & Quality Accreditation — EMC Healthcare Services consultants reviewing a framed NABH accreditation certificate with hospital staff, gap analysis through assessment readiness support.",
    relatedServiceSlugs: ["nabl-accreditation", "mrd-services", "fire-safety"],
    seoTitle: "NABH Accreditation Consultancy for Hospitals & Clinics | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services supports hospitals through the full NABH accreditation journey — gap assessment, documentation, staff training and assessment readiness.",
    keywords: ["NABH accreditation consultant", "NABH consultancy hospital", "hospital quality accreditation"],
    timeline: {
      indicative: "3–6 months",
      note: "Preparation timeline depends on the facility's starting point, size and readiness.",
    },
    scopeNote: "EMC does not guarantee NABH accreditation. The final accreditation decision belongs to NABH.",
    benefitCards: [
      { title: "Structured Quality Systems", detail: "Structured quality systems across the facility, with incident reporting, audits and patient feedback built into daily practice" },
      { title: "Patient Safety & Rights", detail: "Stronger patient safety and patient-rights practices" },
      { title: "Medication & Infection Control", detail: "Better, more consistent medication management and infection prevention" },
      { title: "Documentation & Records", detail: "Medical-records documentation aligned to accreditation requirements" },
      { title: "Staff Readiness & Improvement", detail: "Staff awareness, training and emergency preparedness — continual improvement, not a one-time inspection" },
    ],
  },
  {
    slug: "nabl-accreditation",
    family: "quality-accreditation",
    icon: "flask",
    isCore: true,
    name: "NABL Accreditation",
    positioning: "Strengthen Laboratory Systems. Prepare for Assessment.",
    shortDescription:
      "Structured NABL accreditation support for laboratories — scope assessment, gap analysis, quality manuals and assessment coordination for a defined testing scope.",
    whatIsIt:
      "NABL is the National Accreditation Board for Testing and Calibration Laboratories. NABL accreditation relates to a defined scope of tests or calibrations a laboratory is assessed against — not the laboratory as a whole. EMC supports laboratories in preparing their quality systems, documentation and staff for that assessment, from initial scope assessment through mock assessment and coordination of the external assessment itself.",
    whyItMatters: [
      "Structured quality systems for a defined testing scope",
      "Stronger staff orientation and competence",
      "Consistent equipment and calibration record-keeping",
      "Assessment readiness through internal audit and mock assessment",
      "Continual improvement through corrective action",
    ],
    whoNeedsIt: [
      "Laboratories preparing to define or expand their NABL accreditation scope",
      "Laboratories with existing quality documentation that need stronger implementation and evidence",
      "Facilities preparing for an upcoming NABL assessment",
    ],
    process: [
      { title: "Scope assessment", description: "Define the specific tests or calibrations the accreditation will cover." },
      { title: "Gap analysis", description: "Compare existing practices against applicable NABL requirements for that scope." },
      { title: "Quality manuals, SOPs, formats & registers", description: "Support preparation and standardisation of the required quality documentation." },
      { title: "Staff orientation", description: "Orient laboratory staff on the quality system and their role within it." },
      { title: "Equipment & calibration record coordination", description: "Coordinate equipment inventory and calibration record-keeping relevant to the scope." },
      { title: "Internal audit", description: "Audit the quality system against applicable requirements ahead of assessment." },
      { title: "Corrective actions", description: "Identify, correct and monitor findings from internal audit." },
      { title: "Mock assessment", description: "Check documents, implementation and staff awareness before the external assessment." },
      { title: "Assessment coordination", description: "Coordinate the external NABL assessment process." },
    ],
    faqs: [
      {
        question: "What does NABL accreditation cover?",
        answer:
          "NABL accreditation relates to a defined scope of tests or calibrations a laboratory is assessed against, not the laboratory as a whole — the accredited scope is specific and published as part of the accreditation.",
      },
      {
        question: "Does EMC guarantee NABL accreditation?",
        answer:
          "No. EMC supports scope assessment, gap analysis, documentation, staff orientation and assessment preparation, but EMC does not guarantee NABL accreditation — the final decision belongs to NABL.",
      },
    ],
    photoSrc: "/images/services/nabl-accreditation-emc.png",
    photoAlt: "NABL Laboratory Accreditation — a framed NABL (National Accreditation Board for Testing and Calibration Laboratories) certificate beside a stethoscope, covering accuracy, reliable results, patient safety and quality compliance.",
    relatedServiceSlugs: ["nabh-accreditation", "equipment-calibration", "mrd-services"],
    seoTitle: "NABL Laboratory Accreditation Support | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services supports laboratories preparing for NABL accreditation — scope assessment, gap analysis, quality manuals and assessment coordination.",
    keywords: ["NABL accreditation support", "laboratory accreditation consultant", "NABL assessment preparation"],
    scopeNote: "Accreditation relates to a defined scope, not the laboratory as a whole. EMC does not guarantee NABL accreditation — the final decision belongs to NABL.",
  },

  // ---------------------------------------------------------------------
  // 03 — HOSPITAL & CLINIC PRO MARKETING / DIGITAL MARKETING
  // ---------------------------------------------------------------------
  {
    slug: "hospital-marketing",
    family: "marketing",
    icon: "megaphone",
    isCore: true,
    name: "Hospital & Clinic PRO Marketing",
    positioning: "Strengthen Your Presence. Build Stronger Connections.",
    shortDescription:
      "PRO-led outreach and professional relationship development that helps referring doctors, specialists and the local community find the right care at your facility.",
    whatIsIt:
      "PRO Marketing means a public relations officer (PRO) building professional relationships on a facility's behalf — with referring doctors, specialists and the local community — so patients find the right care at the right facility. EMC supports facility and growth assessment, outreach planning, PRO deployment, professional relationship development, specialty promotion, and community and corporate outreach where included.",
    whyItMatters: [
      "Referring-doctor and specialist relationships help patients reach the right facility",
      "Specialty promotion reaches the audience most likely to need that department",
      "Community and corporate outreach extends the facility's presence beyond its walls",
      "Consistent follow-up turns outreach into an ongoing relationship, not a one-time visit",
    ],
    whoNeedsIt: [
      "Hospitals and clinics wanting structured, PRO-led outreach",
      "Facilities looking to build referring-doctor and specialist relationships",
      "Departments wanting focused specialty promotion",
      "Facilities wanting community or corporate outreach as part of their scope",
    ],
    process: [
      { title: "Facility & growth assessment", description: "Understand the facility's specialities, strengths and growth objectives." },
      { title: "Outreach planning", description: "Plan which relationships, specialities and areas to prioritise." },
      { title: "PRO deployment", description: "Deploy a PRO to build and maintain professional relationships on the facility's behalf." },
      { title: "Professional relationship development", description: "Build relationships with referring doctors and specialists." },
      { title: "Specialty promotion", description: "Promote specific departments to the audience most likely to need them." },
      { title: "Community outreach", description: "Extend outreach into the local community the facility serves." },
      { title: "Corporate outreach", description: "Extend outreach to corporates, where included in the agreed scope." },
      { title: "Follow-up", description: "Maintain relationships built through outreach activity." },
      { title: "Activity review", description: "Review outreach activity and adjust the plan accordingly." },
    ],
    faqs: [
      {
        question: "What does a PRO (public relations officer) do for a hospital?",
        answer:
          "A PRO builds and maintains professional relationships on the facility's behalf — with referring doctors, specialists and the local community — so patients find the right care at the right facility.",
      },
      {
        question: "Does EMC guarantee referrals or patient volume from PRO marketing?",
        answer:
          "No. PRO deployment, schedule, coverage area, engagement period and reporting are defined by the client-specific scope. EMC does not guarantee referrals, admissions or patient volume.",
      },
    ],
    photoSrc: "/images/services/hospital-clinic-marketing-emc.png",
    photoAlt: "Hospital & Clinic PRO Marketing — a public relations officer meeting with referring doctors and hospital staff, building professional relationships and community outreach for a healthcare facility.",
    relatedServiceSlugs: ["digital-marketing", "medical-camps"],
    seoTitle: "Hospital & Clinic PRO Marketing Support | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services deploys PRO-led outreach — referring-doctor and specialist relationships, specialty promotion, and community/corporate outreach for hospitals and clinics.",
    keywords: ["hospital PRO marketing", "public relations officer healthcare", "hospital referral marketing"],
    scopeNote: "PRO deployment, schedule, coverage area, engagement period and reporting are defined by the client-specific scope. EMC does not guarantee referrals, admissions or patient volume.",
  },
  {
    slug: "digital-marketing",
    family: "marketing",
    icon: "trending-up",
    isCore: true,
    name: "Digital Marketing & Website Development",
    positioning: "Make Your Healthcare Services Easier to Find, Understand and Contact.",
    shortDescription:
      "Responsive websites, SEO, local search and social media built around education, information and genuine patient engagement.",
    whatIsIt:
      "Digital marketing is the use of online channels — social media, Google presence, search engines, the hospital's website, online advertising, WhatsApp, video and educational content, and online reviews — to promote a hospital, clinic, doctor or healthcare service. This includes the website itself: a hospital website typically needs Home, About Us, Doctors, Departments, Services, Facilities, Appointment, Contact, Health Blog and Gallery pages, built to be professional, mobile-friendly, fast, secure and conversion-focused. EMC's content approach follows a simple rule: educate the audience, inform them about available services, engage through questions and interaction, build trust by showing doctors and facilities honestly, and provide a clear way to convert interest into an appointment or enquiry.",
    whyItMatters: [
      "When people search 'hospital near me,' online presence becomes critical to being found",
      "A properly managed Google Business Profile shows accurate name, address, phone, hours, services, photos and reviews",
      "A professional, mobile-friendly website is often the first thing a prospective patient sees",
      "Genuine, ethical content builds trust rather than eroding it",
    ],
    whoNeedsIt: [
      "Hospitals with no website, or a basic/outdated one",
      "Hospitals with an inactive or outdated Google Business Profile",
      "Clinics wanting a structured content plan across Facebook, Instagram, YouTube, LinkedIn or WhatsApp",
      "Facilities that want to track and improve enquiry generation from digital channels",
    ],
    process: [
      { title: "Google presence & local search", description: "Ensure the hospital's Google Business Profile is accurate, updated, consistent and professional." },
      { title: "Responsive website development", description: "Build Home, About, Doctors, Departments, Services, Facilities, Appointment, Contact, Blog and Gallery pages, as relevant, for clarity and speed." },
      { title: "Search engine optimisation", description: "Structure the site to be search-friendly so patients can find the hospital online." },
      { title: "Social media management", description: "Plan doctor introductions, health education, service highlights, camp promotion and patient-awareness content with a clear purpose behind every post." },
      { title: "Creative production", description: "Produce posters, creatives and short promotional videos." },
      { title: "Campaign coordination", description: "Coordinate Google/Meta campaigns where approved, defining objective, audience, message, platform and enquiry method." },
      { title: "Medical camp & event promotion", description: "Promote medical camps and events across the relevant channels." },
      { title: "Reputation management", description: "Encourage genuine patient feedback — EMC does not create fake reviews, buy reviews, or misrepresent patient experiences." },
      { title: "Performance tracking & reporting", description: "Track and report on digital channel performance." },
    ],
    faqs: [
      {
        question: "What digital channels does EMC's digital marketing support cover?",
        answer:
          "Social media (Facebook, Instagram, YouTube, LinkedIn, WhatsApp depending on audience and strategy), Google presence and search visibility, the hospital website, online advertising, and video/educational content.",
      },
      {
        question: "What pages does a good hospital website need?",
        answer:
          "Typically Home, About Us, Doctors, Departments, Services, Facilities, Appointment, Contact, a Health Blog and a Gallery — tailored to what the specific hospital or clinic actually offers, and built to be professional, mobile-friendly, fast and conversion-focused.",
      },
      {
        question: "Does EMC use fake reviews or paid testimonials?",
        answer:
          "No. EMC's approach explicitly avoids creating fake reviews, buying reviews, forcing patients to leave positive reviews, or misrepresenting patient experiences. Genuine feedback may be politely requested instead.",
      },
    ],
    photoSrc: "/images/services/digital-marketing-social-media-emc.png",
    photoAlt: "Digital Marketing & Website Development — a hospital's website and social media profile open across laptop and smartphone, covering SEO, Google presence and responsive website design.",
    relatedServiceSlugs: ["hospital-marketing", "medical-camps"],
    seoTitle: "Digital Marketing & Website Development for Hospitals & Clinics | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services builds responsive hospital websites and manages Google presence, SEO, social media and digital campaigns, built on genuine, ethical content.",
    keywords: ["hospital digital marketing", "hospital website development", "clinic social media management", "Google Business Profile hospital"],
    scopeNote: "Deliverables, quantities, platforms, campaigns, advertising budgets, hosting, domain and third-party services depend on the approved engagement. EMC does not guarantee search rankings or enquiry volume.",
  },

  // ---------------------------------------------------------------------
  // 04 — MEDICAL CAMPS
  // ---------------------------------------------------------------------
  {
    slug: "medical-camps",
    family: "medical-camps",
    icon: "tent",
    isCore: true,
    name: "Medical Camps",
    positioning: "Bring Healthcare Awareness and Services Closer to Your Community.",
    shortDescription:
      "Planning and executing general, speciality, corporate and community medical camps — plus the follow-up that makes them count.",
    whatIsIt:
      "A medical camp is a planned healthcare activity conducted at a community, corporate, institutional or public location to provide accessible healthcare services. Camps can be general health camps (GP consultation, BP, blood sugar, BMI and basic screening), speciality camps (orthopaedic, ENT, eye, dental, women's health, paediatric, cardiology, diabetology), corporate health camps (employee screening and lifestyle counselling), or community and institutional camps at apartments, NGOs, schools or colleges. A camp is a complete process — planning, promotion, registration, screening, consultation, documentation, follow-up and, where appropriate, conversion to ongoing care.",
    whyItMatters: [
      "Brings healthcare access directly to the community",
      "Generates screenings, consultations, diagnostic referrals and follow-up care",
      "Post-camp follow-up is one of the most important parts of the process — the camp isn't complete when the patient leaves",
    ],
    whoNeedsIt: [
      "Hospitals or clinics wanting to run a general or speciality health camp",
      "Corporates, residential communities, schools, colleges or NGOs hosting a screening event",
    ],
    process: [
      { title: "Target location & healthcare need", description: "Identify the community, expected population, and the specialities or screenings most relevant to them." },
      { title: "Decide camp services", description: "Define exactly which services will be offered — only what is actually available." },
      { title: "Confirm doctors & staff", description: "Confirm doctor, nurse/paramedic and support staff availability before promoting a speciality camp." },
      { title: "Logistics", description: "Arrange registration, screening and consultation infrastructure, equipment, and documentation." },
      { title: "Marketing & mobilisation", description: "Promote through offline materials and digital channels, always including camp name, date, time, location, speciality and registration details." },
      { title: "Camp-day execution", description: "Run registration, screening, consultation and advice/referral on the day." },
      { title: "Post-camp follow-up", description: "Follow up on immediate needs, routine follow-up and general health awareness, and hand qualified cases over to the hospital or clinic." },
    ],
    faqs: [
      {
        question: "What is a medical camp?",
        answer:
          "A planned healthcare activity conducted at a community, corporate, institutional or public location to provide accessible healthcare services — ranging from general screening to speciality consultations.",
      },
      {
        question: "Why does EMC emphasise post-camp follow-up so strongly?",
        answer:
          "Because the camp's objective is not the event itself — it's converting the visit into appropriate ongoing care. A camp is not complete when the patient leaves; follow-up connects screening results to the right next step.",
      },
      {
        question: "Can EMC guarantee attendance numbers for a camp?",
        answer:
          "No — EMC never guarantees attendance. EMC supports planning, doctor/location coordination, promotion, registration systems, documentation and follow-up, but attendance depends on many factors specific to each camp.",
      },
    ],
    previousWork: ["Kalaa Dental Care", "Joy Family", "Adam's Clinic"],
    photoSrc: "/images/services/medical-camps-community-healthcare-emc.png",
    photoAlt: "Medical Camps & Community Healthcare — a doctor and nursing team conducting free health check-ups for elderly community members at an outdoor medical camp.",
    relatedServiceSlugs: ["hospital-marketing", "health-at-home"],
    seoTitle: "Medical Camp Planning & Execution for Hospitals & Communities | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services plans and runs general, speciality, corporate and community medical camps, with structured post-camp follow-up.",
    keywords: ["medical camp organizer", "corporate health camp", "community health screening camp"],
    scopeNote: "Doctors, equipment, tests, medicines, venue arrangements and permissions depend on the agreed camp scope. EMC does not guarantee attendance.",
  },

  // ---------------------------------------------------------------------
  // 05 — MEDICAL RECORDS MANAGEMENT (MRD)
  // ---------------------------------------------------------------------
  {
    slug: "mrd-services",
    family: "records-management",
    icon: "folder",
    isCore: true,
    name: "Medical Records Management (MRD)",
    positioning: "Organized Records. Clearer Workflows. Easier Retrieval.",
    shortDescription:
      "Setup, standardisation, deficiency audits and digitization support for a hospital's Medical Records Department.",
    whatIsIt:
      "MRD stands for Medical Records Department — responsible for the systematic management of patient medical records from creation through storage, retrieval, retention and disposal. A medical record includes patient registration details, consultation records, nursing records, investigation reports, medication records, consent forms, procedure and operation notes, discharge summaries and billing documentation. As the training material puts it: if it is not documented, it becomes difficult to prove that it was done — good documentation protects the patient, the doctor, the hospital and the organisation.",
    whyItMatters: [
      "Protects patients, doctors and the hospital through complete, retrievable records",
      "Supports NABH and other accreditation documentation requirements",
      "Reduces misfiling, missing files and slow retrieval",
      "Improves audit readiness",
    ],
    whoNeedsIt: [
      "Hospitals with fully manual (paper-based) medical records",
      "Facilities with partially digital records that want a structured system",
      "Hospitals preparing for NABH or another audit that requires MRD documentation",
    ],
    process: [
      { title: "Assessment", description: "Review the current state of the medical records department." },
      { title: "Gap identification", description: "Identify deficiencies — missing, incomplete, illegible, unsigned, undated or incorrectly filed information." },
      { title: "Standardisation", description: "Develop the MRD manual, SOPs, audit checklists and registers the department needs." },
      { title: "Staff training", description: "Train staff on documentation standards and correction procedures." },
      { title: "Deficiency audit & closure", description: "Audit records for deficiencies and support closing them out." },
      { title: "Monitoring", description: "Support ongoing monitoring of documentation quality." },
      { title: "Digitization support", description: "Support converting eligible physical records into a structured digital system — planning, classification, scanning, indexing, quality check, secure storage and retrieval." },
    ],
    faqs: [
      {
        question: "What is MRD in a hospital?",
        answer:
          "MRD (Medical Records Department) is the function responsible for managing patient medical records systematically, from creation and clinical documentation through storage, retrieval, retention and disposal.",
      },
      {
        question: "What counts as an MRD deficiency?",
        answer:
          "A deficiency is required information that is missing, incomplete, illegible, incorrectly filled, unsigned, undated, untimed, unauthenticated, or incorrectly filed — for example a doctor's note without a signature, or a consent form missing a required signature.",
      },
      {
        question: "Is MRD digitization just scanning old files?",
        answer:
          "No. Digitization is not merely scanning — it requires planning, classification, scanning, indexing, a quality check, secure storage and a defined retrieval process.",
      },
      {
        question: "Can EMC help digitize old, physical medical records?",
        answer:
          "Yes — EMC supports MRD digitization as part of its medical records services, alongside deficiency audits, staff training and ongoing documentation standardisation.",
      },
    ],
    previousWork: ["Ambal Hospital", "Arun's Eye Care", "RMD Hospital", "Girishwari Hospital"],
    photoSrc: "/images/services/mrd-medical-records-department-emc.png",
    photoAlt: "MRD — Medical Records Department Services — EMC staff organising patient records, secure, accurate and accessible record management, compliance support and quick retrieval.",
    relatedServiceSlugs: ["nabh-accreditation", "biomedical-waste"],
    seoTitle: "Medical Records Department (MRD) Services & Digitization | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services sets up, standardises, audits and digitizes hospital Medical Records Departments (MRD) for better retrieval and audit readiness.",
    keywords: ["MRD services hospital", "medical records digitization", "hospital records deficiency audit"],
    timeline: {
      indicative: "15–30 working days",
      note: "Record volume, document condition, staff participation and digitization scope affect the schedule.",
    },
    scopeNote: "Patient records remain under the healthcare establishment's control at all times.",
  },

  // ---------------------------------------------------------------------
  // 06 — MANPOWER & RECRUITMENT
  // ---------------------------------------------------------------------
  {
    slug: "recruitment-staffing",
    family: "manpower",
    icon: "users",
    isCore: true,
    name: "Manpower & Recruitment",
    positioning: "Find the People Your Healthcare Team Needs.",
    shortDescription:
      "Sourcing and recruitment support across doctors, nursing staff, administration, marketing and technical/support roles.",
    whatIsIt:
      "Healthcare facilities need the right person, with the right qualification, in the right position, at the right time. EMC's recruitment support covers requirement definition, sourcing, screening, interviews, verification, selection, joining and follow-up across doctors and clinical professionals (GPs, specialists, super-specialists, visiting consultants), nursing staff (GNM, ANM, staff, ICU, OT, emergency, ward nurses), allied healthcare staff (technicians, pharmacists, laboratory personnel), administration (receptionists, front-office staff, hospital administration), and healthcare marketing personnel.",
    whyItMatters: [
      "Fills genuine operational gaps with qualified candidates",
      "Structured process reduces mismatched hires",
      "Supports expansion, replacement, or urgent gap-filling",
    ],
    whoNeedsIt: [
      "Hospitals and clinics with current staffing vacancies",
      "Facilities expanding into new departments or services",
      "Establishments needing GNM/ANM or other nursing qualifications filled quickly",
    ],
    process: [
      { title: "Manpower requirement", description: "Define the exact staffing need." },
      { title: "Role definition", description: "Prepare a clear role description." },
      { title: "Candidate sourcing", description: "Source suitable candidates for the role." },
      { title: "Screening", description: "Screen candidates against the requirement." },
      { title: "Interview coordination", description: "Coordinate interviews with the hospital or clinic." },
      { title: "Document verification", description: "Verify qualifications and documentation." },
      { title: "Selection coordination", description: "Support selection and offer formalities." },
      { title: "Joining & deployment support", description: "Support onboarding and deployment after selection." },
      { title: "Replacement support", description: "Support replacement according to the agreed terms of engagement." },
    ],
    faqs: [
      {
        question: "What categories of healthcare staff can EMC help recruit?",
        answer:
          "Doctors and clinical professionals (GPs, specialists, super-specialists, visiting consultants), nursing staff (GNM, ANM, ICU, OT, emergency and ward nurses), allied healthcare staff (technicians, pharmacists, laboratory personnel), administration (receptionists, front-office, hospital administration) and healthcare marketing personnel.",
      },
      {
        question: "We already have staff — is recruitment support still useful?",
        answer:
          "Yes — recruitment support is useful whenever a hospital needs to expand, replace, or quickly fill a current staffing gap, even with an existing team in place.",
      },
      {
        question: "Does EMC handle payroll or employment for recruited staff?",
        answer:
          "Not automatically. EMC does not automatically include payroll, employment, background checks or a specific staffing model unless it is included in the agreed scope.",
      },
    ],
    previousWork: ["Joy Family Hospital", "RMD Hospital", "RBC", "Ambal Hospital (including GNM/ANM recruitment)"],
    photoSrc: "/images/services/healthcare-recruitment-staffing-emc.png",
    photoAlt: "Healthcare Recruitment & Staffing — a doctor shaking hands with a hospital administrator alongside nursing staff, connecting skilled healthcare professionals with the right opportunities.",
    relatedServiceSlugs: ["facility-setup", "insurance-tpa-empanelment"],
    seoTitle: "Healthcare Manpower & Recruitment Services | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services sources and recruits doctors, nurses, administrative and technical staff for hospitals and clinics.",
    keywords: ["healthcare recruitment agency", "hospital staffing service", "nurse recruitment hospital"],
    timeline: {
      indicative: "10–15 days",
      note: "Specialist roles, location, compensation, notice periods and candidate availability can affect timelines.",
    },
    scopeNote: "EMC does not automatically include payroll, employment, background checks or a specific staffing model unless included in the agreed scope.",
  },

  // ---------------------------------------------------------------------
  // 07 — HOSPITAL, CLINIC & PHARMACY SETUP
  // ---------------------------------------------------------------------
  {
    slug: "hospital-clinic-setup",
    family: "facility-setup",
    icon: "building",
    isCore: true,
    name: "Hospital, Clinic & Pharmacy Setup",
    positioning: "From Planning to Operational Readiness.",
    shortDescription:
      "Coordination support for setting up a new hospital, clinic or pharmacy, or renovating an existing facility — as a full setup or selected workstreams.",
    whatIsIt:
      "EMC provides setup coordination covering land and building assessment, renovation support for existing or older buildings, hospital planning and OP/IP setup, bed-based planning, infrastructure coordination, pharmacy setup, compliance and licensing coordination, equipment and manpower coordination, and launch readiness through handover. Specialist architectural, structural, civil, interior, equipment and technical work is carried out by appropriate professionals and vendors, coordinated by EMC. Clients can choose full setup coordination or selected workstreams within it.",
    whyItMatters: [
      "One coordinated setup partner instead of many separate vendors",
      "Reduced complexity across planning, compliance and operations",
      "Better planning from land assessment through operational readiness",
    ],
    whoNeedsIt: [
      "Organisations planning a new hospital, clinic or pharmacy",
      "Owners converting or renovating an existing building for healthcare use",
    ],
    process: [
      { title: "Land & building assessment", description: "Coordinate assessment of the land or building and overall project scope." },
      { title: "Hospital & bed-based planning", description: "Support hospital planning, OP/IP setup and bed-based planning." },
      { title: "Renovation & infrastructure coordination", description: "Coordinate renovation of existing or older buildings and general infrastructure." },
      { title: "Pharmacy setup", description: "Coordinate pharmacy setup as part of the facility." },
      { title: "Compliance & licensing coordination", description: "Coordinate the compliance and licensing requirements the setup needs." },
      { title: "Equipment & manpower coordination", description: "Coordinate medical equipment and manpower requirements." },
      { title: "Launch readiness", description: "Support the facility through to operational readiness." },
      { title: "Handover", description: "Complete handover of the coordinated setup." },
    ],
    faqs: [
      {
        question: "Does EMC support renovating an existing building into a hospital or clinic?",
        answer:
          "Yes — EMC's setup support covers both new builds and renovation of existing or older buildings for healthcare use.",
      },
      {
        question: "Can I choose only some parts of the setup process instead of the full engagement?",
        answer:
          "Yes — EMC's setup coordination can be engaged as a full setup or as selected workstreams, depending on what the project already has in place.",
      },
      {
        question: "Who does the actual architectural or construction work?",
        answer:
          "Specialist architectural, structural, civil, interior, equipment and technical work is carried out by appropriate professionals and vendors — EMC coordinates the overall process rather than performing this specialist work directly.",
      },
    ],
    previousWork: ["Sri Vignesh Hospital", "Thirumullaivoyal project"],
    photoSrc: "/images/services/hospital-clinic-setup-emc.png",
    photoAlt: "Hospital, Clinic & Pharmacy Setup — a hospital building exterior alongside hospital, clinic and pharmacy interior setups, covering planning, infrastructure, licensing, equipment and manpower coordination.",
    relatedServiceSlugs: ["recruitment-staffing", "stability-certificate", "cea-registration"],
    seoTitle: "Hospital, Clinic & Pharmacy Setup Support | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services coordinates new hospital, clinic and pharmacy setup, from planning through operational readiness — full setup or selected workstreams.",
    keywords: ["hospital setup consultancy", "clinic setup support", "pharmacy setup service"],
    timeline: {
      indicative: "4–6 months",
      note: "Project size, construction/renovation scope, approvals, procurement and staffing affect completion.",
    },
    scopeNote: "Specialist architectural, structural, civil, interior, equipment and technical work is carried out by appropriate professionals and vendors, coordinated by EMC.",
  },

  // ---------------------------------------------------------------------
  // 08 — INSURANCE & TPA COORDINATION
  // ---------------------------------------------------------------------
  {
    slug: "insurance-tpa-empanelment",
    family: "insurance-tpa",
    icon: "shield-heart",
    isCore: true,
    name: "Insurance & TPA Coordination",
    positioning: "Organized Applications. Clear Follow-up. Better Visibility.",
    shortDescription:
      "Coordination support for hospital empanelment with insurers and Third Party Administrators (TPAs).",
    whatIsIt:
      "Insurance empanelment is the process through which a hospital seeks to become part of an insurer or TPA network, so that eligible insured patients can access covered healthcare services at that hospital. A TPA (Third Party Administrator) supports health insurance administration and coordination between the patient, hospital and insurance company. EMC supports and coordinates the empanelment process — final approval and network terms are always determined by the relevant insurer or TPA. Claims processing, billing, cashless-desk operations and government schemes are treated as separate scope items unless specifically agreed.",
    whyItMatters: [
      "Wider patient access through insurer and TPA networks",
      "Additional business opportunity and hospital visibility",
      "Smoother cashless and claim coordination",
      "Revenue potential from a broader patient base",
    ],
    whoNeedsIt: [
      "Hospitals not yet empanelled with any insurer or TPA",
      "Hospitals looking to expand their existing insurer/TPA network",
    ],
    process: [
      { title: "Eligibility review", description: "Collect basic hospital, specialty, facility and doctor information and review eligibility." },
      { title: "Documentation preparation", description: "Gather registration, PAN, GST, bank, tariff and infrastructure documents." },
      { title: "Application coordination", description: "Submit the application through the applicable insurer/TPA process." },
      { title: "Query support", description: "Support the hospital through the insurer/TPA's review of documents, infrastructure and credentials." },
      { title: "Follow-up & status tracking", description: "Track application status and follow up on outstanding items." },
      { title: "Onboarding coordination", description: "Support onboarding formalities if the application is approved." },
      { title: "Renewal coordination", description: "Help keep licences, doctors, tariffs and compliance records up to date, where applicable." },
    ],
    faqs: [
      {
        question: "Can EMC guarantee insurance or TPA empanelment approval?",
        answer:
          "No. EMC can support and coordinate the empanelment process, but final approval and network terms are always determined by the relevant insurer or TPA.",
      },
      {
        question: "What documents does insurance/TPA empanelment usually require?",
        answer:
          "Typically registration documents, PAN, GST details, bank information, tariff lists and infrastructure documentation — the exact requirements vary by insurer/TPA and are confirmed during the process.",
      },
      {
        question: "Does EMC handle claims processing or billing after empanelment?",
        answer:
          "Claims processing, billing, cashless-desk operations and government schemes are treated as separate scope items unless specifically agreed as part of the engagement.",
      },
    ],
    photoSrc: "/images/services/insurance-tpa-empanelment-emc.png",
    photoAlt: "Insurance & TPA Coordination — EMC coordinator reviewing an insurance/TPA empanelment checklist with hospital representatives, backed by tie-ups with leading insurers and TPAs.",
    relatedServiceSlugs: ["recruitment-staffing", "equipment-calibration"],
    seoTitle: "Hospital Insurance & TPA Coordination | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services coordinates hospital empanelment with insurers and Third Party Administrators (TPAs), from documentation through onboarding.",
    keywords: ["hospital TPA empanelment", "insurance empanelment hospital", "cashless network hospital"],
    timeline: {
      indicative: "3–4 months",
      note: "Coordination period depends on the insurer/TPA's own review process.",
    },
    scopeNote: "Final approval and network terms are determined by the relevant insurer or TPA. EMC does not guarantee empanelment, patient volume or revenue.",
  },

  // ---------------------------------------------------------------------
  // 09 — MEDICAL EQUIPMENT & INFRASTRUCTURE
  // ---------------------------------------------------------------------
  {
    slug: "equipment-calibration",
    family: "equipment-infrastructure",
    icon: "gauge",
    isCore: true,
    name: "Medical Equipment & Infrastructure",
    positioning: "Coordinated Calibration. Organized Equipment Records.",
    shortDescription:
      "Coordinating calibration of medical devices — from patient monitors to laboratory equipment — through qualified service providers.",
    whatIsIt:
      "Calibration is the process of checking whether a medical device is measuring or functioning accurately by comparing it against an appropriate reference standard. For example, a BP monitor may display a reading that no longer reflects reality if the device is inaccurate — which can affect clinical decisions. EMC coordinates calibration through a competent service provider (EMC does not calibrate equipment directly unless qualified to do so) and manages the documentation and follow-up. Calibration, performance testing, validation, preventive maintenance, repair, equipment supply, installation and AMC/CMC are different activities and are not bundled together unless specifically agreed.",
    whyItMatters: [
      "Patient safety and accurate clinical decisions",
      "Preventive maintenance and longer equipment life",
      "Compliance and audit readiness, including for NABH",
      "Proper documentation and certificates on file",
    ],
    whoNeedsIt: [
      "Hospitals with patient monitors, ECG machines, pulse oximeters, BP apparatus, infusion/syringe pumps, defibrillators or ventilators",
      "Laboratories with autoclaves, suction or dialysis-related equipment",
      "Facilities preparing for NABH or another audit that requires current calibration certificates",
    ],
    process: [
      { title: "Equipment identification", description: "Identify which equipment requires calibration." },
      { title: "Equipment inventory", description: "Build or update the facility's equipment inventory." },
      { title: "Requirement identification", description: "Determine calibration requirements per equipment type." },
      { title: "Calibration coordination", description: "Coordinate calibration through a qualified service provider." },
      { title: "Certificate & documentation", description: "Ensure certificates and documentation are properly filed." },
      { title: "Follow-up tracker", description: "Maintain a tracker of last-calibration and due dates for ongoing compliance." },
    ],
    faqs: [
      {
        question: "Why calibrate equipment that seems to be working fine?",
        answer:
          "Working and being certified accurate are different things. Calibration provides a documented, verifiable accuracy record against a reference standard — important for both compliance and patient safety, since an inaccurate reading can affect clinical decisions.",
      },
      {
        question: "Does EMC calibrate the equipment itself?",
        answer:
          "EMC coordinates calibration through a qualified service provider and does not calibrate equipment directly unless qualified to do so. EMC manages the identification, inventory, coordination, documentation and follow-up tracking around the process.",
      },
      {
        question: "Is every calibration certificate NABL-accredited?",
        answer:
          "Not automatically — calibration, performance testing, validation and NABL-accredited certification are different things. EMC confirms certificate type per engagement rather than assuming every certificate is NABL-accredited.",
      },
    ],
    previousWork: ["Girishwari Hospital", "Muthu Hospital", "Caterpillar", "ZF Automation"],
    photoSrc: "/images/services/medical-equipment-calibration-emc.png",
    photoAlt: "Medical Equipment Calibration — biomedical engineer calibrating a patient monitor in a hospital, ensuring accurate, compliant and reliable medical equipment performance.",
    relatedServiceSlugs: ["nabh-accreditation", "nabl-accreditation", "insurance-tpa-empanelment"],
    seoTitle: "Medical Equipment Calibration & Infrastructure Coordination | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services coordinates medical equipment calibration, documentation and follow-up tracking for hospitals and laboratories.",
    keywords: ["medical equipment calibration hospital", "hospital equipment calibration service", "NABH equipment calibration"],
    timeline: {
      indicative: "3–7 days",
      note: "Calibration/service coordination timing depends on equipment type and provider scheduling.",
    },
    scopeNote: "Certificates and technical reports are issued by the provider performing the work. Not every certificate is NABL-accredited — EMC confirms this per engagement.",
  },

  // ---------------------------------------------------------------------
  // Kept out of the 9-group primary navigation (see plan) — still a real,
  // reachable page, just not featured in nav/homepage/footer.
  // ---------------------------------------------------------------------
  {
    slug: "health-at-home",
    family: "medical-camps",
    icon: "home-heart",
    isCore: false,
    name: "Health at Home",
    shortDescription:
      "Home healthcare support — nursing, physiotherapy, elder care and post-discharge continuity for patients outside the facility.",
    whatIsIt:
      "Health at Home means providing appropriate healthcare support to patients in their own homes rather than requiring every service to be delivered inside a hospital or clinic. Services can include doctor home visits, nursing services, physiotherapy, elder-care support, post-discharge support, sample collection, medication support, vital monitoring, palliative/supportive care, and home-based rehabilitation — always provided by appropriately qualified personnel and within their permitted scope. Clinical decisions always remain with qualified healthcare professionals; a coordinator's role is to capture requirements and route them correctly, never to independently diagnose or prescribe.",
    whyItMatters: [
      "Reaches patients who have difficulty travelling to a facility",
      "Improves continuity of care after hospital discharge",
      "Supports elderly and dependent patients where they live",
      "Extends the hospital's presence and relationship into the community",
    ],
    whoNeedsIt: [
      "Hospitals wanting to offer structured post-discharge home care",
      "Patients and families needing nursing, physiotherapy or elder-care support at home",
    ],
    process: [
      { title: "Define services", description: "Establish what's offered, locations covered, who provides it, hours and pricing model." },
      { title: "Build the team", description: "Assemble doctors, nurses, physiotherapists, lab technicians, care staff and a coordinator." },
      { title: "Develop SOPs", description: "Standard operating procedures for enquiry, booking, staff allocation, visits, documentation, escalation, emergencies and billing." },
      { title: "Create a booking system", description: "A clear flow from patient requirement through location, date/time, staff assignment, visit, report and follow-up." },
    ],
    faqs: [
      {
        question: "What services fall under Health at Home?",
        answer:
          "Doctor home visits, nursing services, physiotherapy, elder-care support, post-discharge support, sample collection, medication support, vital monitoring, palliative/supportive care, and home-based rehabilitation, always delivered by appropriately qualified personnel.",
      },
      {
        question: "Who makes clinical decisions during a home healthcare visit?",
        answer:
          "Qualified healthcare professionals — never a coordinator. A coordinator's role is to capture the patient's requirement and route it correctly, not to diagnose or prescribe independently.",
      },
      {
        question: "Why does home healthcare matter for hospitals?",
        answer:
          "It reaches patients who struggle to travel, improves continuity of care after discharge, supports elderly and dependent patients, and extends the hospital's relationship with the community beyond its walls.",
      },
    ],
    photoSrc: "/images/services/health-at-home-emc.png",
    photoAlt: "Health at Home — a nurse taking an elderly patient's blood pressure at home, covering doctor visits, nursing care, health monitoring and medicines at home.",
    relatedServiceSlugs: ["medical-camps", "recruitment-staffing"],
    seoTitle: "Health at Home — Home Healthcare Services | EMC Healthcare Services",
    seoDescription:
      "EMC Healthcare Services supports home healthcare — nursing, physiotherapy, elder care and post-discharge continuity — delivered by qualified personnel.",
    keywords: ["home healthcare service", "home nursing care", "post discharge home care"],
  },
];

/**
 * The six Healthcare Compliance & Licensing sub-services each have a
 * bespoke long-form landing page instead of the standard /services/[slug]
 * template — see src/content/compliance-subservices.ts (single source of
 * truth for the slug->subslug mapping) and
 * src/app/services/healthcare-compliance/[subslug].
 */
export const complianceLongFormSlugs: Record<string, string> = Object.fromEntries(
  complianceSubServices.map((c) => [c.slug, c.subslug]),
);

export function isComplianceLongForm(slug: string): boolean {
  return slug in complianceLongFormSlugs;
}

/** The single source of truth for "which URL does this service link to." */
export function getServiceHref(service: Pick<ServiceContent, "slug">): string {
  const subslug = complianceLongFormSlugs[service.slug];
  return subslug ? `/services/healthcare-compliance/${subslug}` : `/services/${service.slug}`;
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServicesByFamily(family: string) {
  return services.filter((s) => s.family === family);
}

export function getCoreServices() {
  return services.filter((s) => s.isCore);
}

export function getAdditionalServices() {
  return services.filter((s) => !s.isCore);
}
