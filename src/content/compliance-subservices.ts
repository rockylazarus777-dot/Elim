import { ComplianceSubServiceContent } from "@/types/content";

/**
 * Long-form content for the six Healthcare Compliance & Licensing
 * sub-services, each rendered through the generalized ComplianceLongForm
 * component at /services/healthcare-compliance/[subslug]. "Who we support"
 * content is not duplicated here — the long-form page reads it directly
 * from the matching ServiceContent.whoNeedsIt in src/content/services.ts.
 */
export const complianceSubServices: ComplianceSubServiceContent[] = [
  {
    slug: "cea-registration",
    subslug: "cea-registration-renewal",
    supportStages: [
      { title: "Initial Consultation & Requirement Assessment", description: "Confirm whether the establishment is unregistered, mid-renewal, or has an existing compliance gap." },
      { title: "Site Visits & Infrastructure Guidance", description: "Review the establishment's current situation and the requirements that may apply to its facility." },
      { title: "Document Verification & Preparation", description: "Coordinate the paperwork the registration or renewal process requires." },
      { title: "Application Preparation & Submission", description: "Support the preparation and submission of the registration or renewal application." },
      { title: "Supporting Approval Coordination", description: "Coordinate the supporting approvals and information required for the application." },
      { title: "Inspection Preparation & Coordination", description: "Help the establishment organise its documentation and prepare for the relevant inspection process." },
      { title: "Government Fee & Acknowledgement Coordination", description: "Coordinate the application-related fee and acknowledgement steps with the client." },
      { title: "Application Follow-up & Clarification Support", description: "Coordinate with the client through submission and follow-up until the matter is resolved." },
      { title: "Certificate Coordination & Renewal Reminders", description: "Support certificate coordination and help review whether an existing registration is still valid when renewal is due." },
    ],
    pathChoice: {
      heading: "Registration & Renewal Support",
      pathA: { title: "New Registration", description: "EMC helps establishments understand which registration requirements apply, organise the required documentation, and coordinate the registration process." },
      pathB: { title: "Registration Renewal", description: "EMC supports renewal applications and can help review whether an existing registration is still valid." },
      note: "Already registered but need assistance? EMC can help review the current registration status, identify applicable requirements, organise documentation, and support the renewal or resolution process.",
    },
    documents: [
      { title: "CORE DOCUMENTATION", items: ["Prescribed application form", "Proof of ownership or rental agreement", "Clinic or hospital layout plan"] },
      { title: "PROFESSIONAL & STAFF DOCUMENTATION", items: ["Doctors' qualification certificates", "Doctors' registration certificates", "Staff qualification details", "Identity and address proof of the owner or doctor"] },
      { title: "FACILITY & INFRASTRUCTURE", items: ["List of equipment and facilities", "Photographs of the establishment", "Building stability and suitability certificates, where required"] },
      { title: "SUPPORTING APPROVALS", items: ["Required declarations or undertakings", "Biomedical waste agreement and applicable authorization", "Applicable fire safety certificate or NOC", "Applicable pollution control consents or approvals"] },
      { title: "RENEWAL DOCUMENTATION", items: ["Existing registration certificate for renewal applications", "Additional documents requested by the relevant authority"] },
    ],
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a free initial consultation to discuss your facility and registration needs." },
      { shortTitle: "Assess", title: "Assess Facility Readiness", description: "We review your facility, available documents, registration status, and supporting requirements to identify any gaps." },
      { shortTitle: "Prepare", title: "Prepare Documentation & Application", description: "We assist with documentation, coordinate supporting requirements, and prepare the application." },
      { shortTitle: "Submit", title: "Submit & Coordinate", description: "We coordinate submission and assist with applicable inspections, queries, and clarifications." },
      { shortTitle: "Complete", title: "Follow Up & Support Completion", description: "We track application progress and coordinate the registration or renewal certificate following approval." },
    ],
  },
  {
    slug: "drug-licence",
    subslug: "drug-licence-registration-renewal",
    supportStages: [
      { title: "Initial Consultation & Requirement Assessment", description: "Understand the establishment and the specific drug-related activity involved." },
      { title: "Site Visit & Layout/Storage Guidance", description: "Review the premises and advise on storage arrangements the application requires." },
      { title: "Document Coordination & Preparation", description: "Identify and coordinate the documents the application requires." },
      { title: "Application Preparation & Submission", description: "Prepare and support submission through the appropriate process." },
      { title: "Registered Pharmacist Recruitment Support", description: "Support sourcing a registered pharmacist where the licence requires one." },
      { title: "Storage & Record-Maintenance Guidance", description: "Review storage, purchase/stock records and expiry monitoring." },
      { title: "Inspection Preparation & Coordination", description: "Help the establishment prepare for the Drugs Control Department's inspection." },
      { title: "Drugs Control Department Follow-up", description: "Coordinate with the department through to resolution." },
      { title: "Renewal, Retention & Change Support", description: "Support renewal, retention, and changes to premises, ownership, pharmacist or approved personnel." },
    ],
    pathChoice: {
      heading: "Manufacturing vs. Retail & Wholesale Applications",
      pathA: { title: "Manufacturing Licence", description: "For pharmaceutical manufacturing units — its own documentation, storage and inspection requirements, distinct from retail or wholesale licensing." },
      pathB: { title: "Retail & Wholesale Licence", description: "For pharmacies and distributors selling or dispensing drugs — a separate application process from manufacturing." },
      note: "EMC confirms which category applies to your establishment before proceeding — the two are not interchangeable.",
    },
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a consultation to understand the establishment and the specific drug-related activity involved." },
      { shortTitle: "Assess", title: "Assess Facility Readiness", description: "We review the premises, layout, storage arrangements and existing documentation to identify gaps." },
      { shortTitle: "Prepare", title: "Prepare Documentation & Application", description: "We coordinate documents, pharmacist recruitment where required, and prepare the application." },
      { shortTitle: "Submit", title: "Submit & Coordinate", description: "We support submission and coordinate with the Drugs Control Department through inspection." },
      { shortTitle: "Complete", title: "Follow Up & Support Renewal", description: "We track progress through to licence issuance, and support renewal or retention when it falls due." },
    ],
  },
  {
    slug: "biomedical-waste",
    subslug: "biomedical-waste-authorization-renewal",
    supportStages: [
      { title: "Requirement Assessment", description: "Review current waste volumes, categories and existing arrangements." },
      { title: "Documentation Preparation", description: "Prepare the documentation the authorization or renewal process requires." },
      { title: "Application Preparation", description: "Prepare the application for submission." },
      { title: "Online Submission", description: "Support submission through the applicable online process." },
      { title: "Departmental Follow-up", description: "Coordinate with the department through to resolution." },
      { title: "Inspection Coordination", description: "Help the establishment prepare for and coordinate any inspection." },
      { title: "Review of Existing Authorization", description: "Confirm whether an existing authorization is still valid." },
      { title: "Waste-Treatment Facility Agreement Coordination", description: "Coordinate authorized waste-treatment facility agreements, where required." },
    ],
    pathChoice: {
      heading: "Two Distinct Matters",
      pathA: { title: "Regulatory Authorization", description: "The registration process itself — application, documentation and inspection coordination with the relevant authority." },
      pathB: { title: "Waste-Service Arrangements", description: "Collection, transportation, treatment and disposal, carried out by the authorized waste-treatment facility — coordinated separately." },
      note: "These are not automatically bundled — EMC clarifies which is being arranged in each engagement, and does not include bins, bags or staff training unless specifically agreed.",
    },
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a consultation to review current waste volumes, categories and arrangements." },
      { shortTitle: "Assess", title: "Assess Authorization Status", description: "We review existing authorization and identify what the establishment still needs." },
      { shortTitle: "Prepare", title: "Prepare Documentation & Application", description: "We coordinate documentation and prepare the application for submission." },
      { shortTitle: "Submit", title: "Submit & Coordinate", description: "We support online submission and coordinate any inspection." },
      { shortTitle: "Complete", title: "Follow Up & Support Renewal", description: "We track the application through to authorization, and support renewal when it falls due." },
    ],
  },
  {
    slug: "fire-safety",
    subslug: "fire-safety-noc-certification",
    supportStages: [
      { title: "Existing Approval Review", description: "Confirm the establishment's current NOC / certification status." },
      { title: "Site Assessment", description: "Review the establishment's size, setup and existing fire safety arrangements." },
      { title: "Compliance Guidance", description: "Advise on the gaps between current arrangements and applicable requirements." },
      { title: "Application Preparation", description: "Prepare the Fire NOC / certification application." },
      { title: "Submission", description: "Support submission to the relevant authority." },
      { title: "Inspection Coordination", description: "Coordinate the applicable inspection process." },
      { title: "Observation & Query Support", description: "Support the establishment in responding to inspection observations or queries." },
      { title: "Renewal Support", description: "Support renewal when the existing NOC / certification is due to expire." },
    ],
    pathChoice: {
      heading: "Two Distinct Matters",
      pathA: { title: "Fire NOC / Certification Coordination", description: "Reviewing existing approvals, site assessment, application preparation, submission and inspection coordination with the relevant authority." },
      pathB: { title: "Technical Fire-Safety Services", description: "Extinguishers, alarm, hydrant and sprinkler systems — installation, servicing, refilling, staff training and mock drills, arranged separately where agreed." },
      note: "These are not the same thing — EMC confirms which is in scope for your engagement before proceeding.",
    },
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a consultation to review existing approvals and the establishment's current status." },
      { shortTitle: "Assess", title: "Assess Site & Compliance Gaps", description: "We assess the site and compare current arrangements against applicable requirements." },
      { shortTitle: "Prepare", title: "Prepare the Application", description: "We prepare the Fire NOC / certification application." },
      { shortTitle: "Submit", title: "Submit & Coordinate", description: "We support submission and coordinate inspection and any observations or queries." },
      { shortTitle: "Complete", title: "Follow Up & Support Renewal", description: "We track the application through to certification, and support renewal when it falls due." },
    ],
  },
  {
    slug: "tnpcb-registration",
    subslug: "tnpcb-registration-approval-renewal",
    supportStages: [
      { title: "Regulatory Applicability Assessment", description: "Confirm establishment type, bed count and current registration status." },
      { title: "Identification of Applicable Consents", description: "Identify which of Consent to Establish, Consent to Operate, BMW Authorization or other requirements apply." },
      { title: "Documentation Preparation", description: "Prepare the documentation the applicable consent/authorization requires." },
      { title: "Application Preparation", description: "Prepare the application for submission." },
      { title: "Online Submission", description: "Support submission through the applicable online process." },
      { title: "Inspection Coordination", description: "Coordinate the applicable inspection process." },
      { title: "Query Support", description: "Support the establishment in responding to departmental queries." },
      { title: "Renewals & Amendments", description: "Support renewal and any amendments to an existing consent/authorization." },
    ],
    documents: [
      { title: "POSSIBLE REQUIREMENTS", items: ["Consent to Establish", "Consent to Operate", "Biomedical Waste Authorization", "Other applicable pollution-control requirements"] },
    ],
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a consultation to confirm establishment type and current registration status." },
      { shortTitle: "Assess", title: "Assess Applicability", description: "We identify which consents or authorizations apply to your establishment." },
      { shortTitle: "Prepare", title: "Prepare Documentation & Application", description: "We coordinate documentation and prepare the application for submission." },
      { shortTitle: "Submit", title: "Submit & Coordinate", description: "We support online submission and coordinate any inspection or query." },
      { shortTitle: "Complete", title: "Follow Up & Support Renewal", description: "We track the application through to approval, and support renewals or amendments when due." },
    ],
  },
  {
    slug: "stability-certificate",
    subslug: "stability-suitability-certificate",
    supportStages: [
      { title: "Requirement Assessment", description: "Confirm why the certificate is needed and which process applies." },
      { title: "Building-Document Review", description: "Review the building's existing documentation." },
      { title: "Plan Review", description: "Review the facility's building plans against the certification requirement." },
      { title: "Coordination with Structural Professionals", description: "Arrange for a qualified structural professional to assess the building." },
      { title: "Site Inspection Facilitation", description: "Facilitate the professional's site inspection." },
      { title: "Suitability Coordination", description: "Coordinate the suitability assessment for healthcare use." },
      { title: "Certificate & Submission Coordination", description: "Coordinate the documented certificate for the facility's records and any related submission." },
    ],
    processStages: [
      { shortTitle: "Discuss", title: "Discuss Your Requirements", description: "Start with a consultation to confirm why the certificate is needed." },
      { shortTitle: "Assess", title: "Review Building Documents & Plans", description: "We review existing building documentation and plans against the requirement." },
      { shortTitle: "Coordinate", title: "Coordinate the Structural Assessment", description: "We arrange a qualified structural professional and facilitate the site inspection." },
      { shortTitle: "Confirm", title: "Confirm Suitability", description: "The structural professional determines the assessment and suitability for healthcare use." },
      { shortTitle: "Complete", title: "Coordinate the Certificate", description: "We coordinate the documented certificate for the facility's records and any related submission." },
    ],
  },
];

export function getComplianceSubServiceBySlug(slug: string) {
  return complianceSubServices.find((c) => c.slug === slug);
}

export function getComplianceSubServiceBySubslug(subslug: string) {
  return complianceSubServices.find((c) => c.subslug === subslug);
}
