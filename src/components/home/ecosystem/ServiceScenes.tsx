import type { ServiceFamily } from "@/types/content";

/**
 * Bespoke "glass diorama" scene for each of the 9 service families — replaces
 * the old icon+label treatment. Each scene is a small, purpose-built SVG
 * illustration of the actual service (a document+seal for compliance, a
 * building assembling from a blueprint for facility setup, a care team for
 * manpower, etc.) rendered on a shared glass chip, rather than a generic
 * icon library glyph. `uid` namespaces gradient/filter ids so the same
 * family can render twice on the page (desktop ecosystem + mobile
 * accordion) without id collisions.
 */

const ACCENT = "#20E0D0";
const DEEP = "#0f2b28";
const NAVY = "#17403b";

interface SceneProps {
  uid: string;
}

function Chip({ uid, children }: { uid: string; children: React.ReactNode }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-chip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={NAVY} />
          <stop offset="100%" stopColor={DEEP} />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${uid}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ACCENT} />
          <stop offset="100%" stopColor="#0f8f86" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${uid}-chip)`} />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke={ACCENT} strokeOpacity="0.25" strokeWidth="1" />
      <path d="M6 18 Q6 6 18 6 H46" stroke={`url(#${uid}-glass)`} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
      {children}
    </>
  );
}

function ComplianceLicensing({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <path d="M20 44V16a10 10 0 0 1 10-6" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="2" fill="none" />
        <g transform="translate(16,13) rotate(-6)">
          <rect x="0" y="0" width="24" height="30" rx="2.5" fill="#f4faf9" />
          <rect x="0" y="0" width="24" height="30" rx="2.5" fill="none" stroke="#d7e9e6" strokeWidth="1" />
          <rect x="4.5" y="6" width="15" height="2" rx="1" fill="#9fb8b4" />
          <rect x="4.5" y="10.5" width="15" height="2" rx="1" fill="#c3d6d3" />
          <rect x="4.5" y="15" width="10" height="2" rx="1" fill="#c3d6d3" />
        </g>
        <circle cx="41" cy="40" r="10.5" fill={`url(#${uid}-accent)`} />
        <circle cx="41" cy="40" r="10.5" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M36.5 40 39.5 43 46 36" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Chip>
    </svg>
  );
}

function QualityAccreditation({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <path d="M24 38 18 52l6-2 4 5 4-11" fill={`url(#${uid}-accent)`} opacity="0.85" />
        <path d="M40 38 46 52l-6-2-4 5-4-11" fill={`url(#${uid}-accent)`} opacity="0.85" />
        <circle cx="32" cy="30" r="14" fill="#f4faf9" />
        <circle cx="32" cy="30" r="14" fill="none" stroke={ACCENT} strokeWidth="1.4" />
        <circle cx="32" cy="30" r="9.5" fill="none" stroke="#cfe4e1" strokeWidth="1" strokeDasharray="2 2.4" />
        <path d="M27 30.5 30.5 34 38 25.5" stroke="#178f86" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Chip>
    </svg>
  );
}

function RecordsManagement({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <g opacity="0.55">
          <rect x="14" y="16" width="16" height="3.2" rx="1.2" fill="#c3d6d3" transform="rotate(-8 14 16)" />
          <rect x="14" y="22" width="16" height="3.2" rx="1.2" fill="#9fb8b4" transform="rotate(-4 14 22)" />
        </g>
        <ellipse cx="38" cy="42" rx="12" ry="4.2" fill={`url(#${uid}-accent)`} />
        <path d="M26 42v-6c0-2.3 5.4-4.2 12-4.2s12 1.9 12 4.2v6" fill="none" stroke={ACCENT} strokeWidth="1.4" opacity="0.9" />
        <ellipse cx="38" cy="35.8" rx="12" ry="4.2" fill="#1c514a" stroke={ACCENT} strokeWidth="1.2" />
        <ellipse cx="38" cy="42" rx="12" ry="4.2" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M33 20v9M38 17v12M43 21v8" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="1.6" strokeLinecap="round" />
      </Chip>
    </svg>
  );
}

function FacilitySetup({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <g stroke={ACCENT} strokeOpacity="0.55" strokeWidth="0.9" strokeDasharray="1.6 2">
          <line x1="16" y1="18" x2="16" y2="46" />
          <line x1="21" y1="18" x2="21" y2="46" />
          <line x1="16" y1="24" x2="30" y2="24" />
          <line x1="16" y1="32" x2="30" y2="32" />
        </g>
        <g>
          <rect x="24" y="20" width="18" height="26" fill="#f4faf9" />
          <rect x="24" y="20" width="18" height="26" fill="none" stroke="#d7e9e6" strokeWidth="1" />
          <rect x="27.5" y="25" width="4" height="4" fill="#9fcfc9" />
          <rect x="34.5" y="25" width="4" height="4" fill="#9fcfc9" />
          <rect x="27.5" y="32" width="4" height="4" fill="#9fcfc9" />
          <rect x="34.5" y="32" width="4" height="4" fill="#9fcfc9" />
          <rect x="29.5" y="39" width="6" height="7" fill="#178f86" />
        </g>
        <rect x="41" y="14" width="7" height="7" rx="1" fill={`url(#${uid}-accent)`} />
        <path d="M44.5 15.4v4.2M42.4 17.5h4.2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      </Chip>
    </svg>
  );
}

function EquipmentInfrastructure({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <circle cx="27" cy="28" r="12" fill="none" stroke="#dfeeec" strokeWidth="5.5" />
        <circle cx="27" cy="28" r="12" fill="none" stroke={`url(#${uid}-accent)`} strokeWidth="5.5" strokeDasharray="26 100" strokeLinecap="round" />
        <rect x="18" y="35" width="18" height="5" rx="2.5" fill="#f4faf9" />
        <rect x="21" y="40" width="12" height="7" rx="1.5" fill="#cfe4e1" />
        <g transform="translate(38,32)">
          <rect x="0" y="0" width="14" height="11" rx="1.6" fill="#0f2b28" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M2 6h2.4l1.4-3 1.6 5 1.4-3H11" stroke={ACCENT} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Chip>
    </svg>
  );
}

function Manpower({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <g>
          <circle cx="21" cy="26" r="5" fill="#dfeeec" />
          <path d="M13 45c0-6.5 4.4-10.5 8-10.5s8 4 8 10.5" fill="#dfeeec" />
        </g>
        <g>
          <circle cx="34.5" cy="20.5" r="6" fill={`url(#${uid}-accent)`} />
          <path d="M25 45.5c0-7.6 4.9-12.3 9.5-12.3s9.5 4.7 9.5 12.3" fill={`url(#${uid}-accent)`} />
          <path d="M31.6 20.2a2.9 2.9 0 0 1 5.8 0" stroke="#ffffff" strokeWidth="1.1" fill="none" opacity="0.8" />
        </g>
        <g>
          <circle cx="47" cy="27" r="5" fill="#cfe4e1" />
          <path d="M39 45c0-6.5 4.4-10.5 8-10.5s8 4 8 10.5" fill="#cfe4e1" />
        </g>
        <rect x="29" y="46" width="11" height="7" rx="1.4" fill="#f4faf9" transform="rotate(-4 34 49)" />
      </Chip>
    </svg>
  );
}

function InsuranceTpa({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <path d="M18 44V33M46 44V33" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="1.5 2.4" />
        <circle cx="18" cy="27" r="2" fill={ACCENT} opacity="0.9" />
        <circle cx="32" cy="24" r="2" fill={ACCENT} opacity="0.9" />
        <circle cx="46" cy="27" r="2" fill={ACCENT} opacity="0.9" />
        <g transform="translate(11,34)">
          <rect width="14" height="12" rx="2" fill="#f4faf9" />
          <path d="M4 0V-4a3.5 3.5 0 0 1 7 0V0" stroke="#9fb8b4" strokeWidth="1.6" fill="none" />
          <path d="M2.5 6h9M2.5 8.5h6" stroke="#c3d6d3" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <g transform="translate(38,32)">
          <path d="M8 0 15.5 3v6c0 5-3.4 7.8-7.5 9-4.1-1.2-7.5-4-7.5-9V3z" fill={`url(#${uid}-accent)`} />
          <path d="M4.6 9.2 7 11.6 12 6.2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </Chip>
    </svg>
  );
}

function Marketing({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <g stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.2" fill="none">
          <path d="M42 20a12 12 0 0 1 0 17" />
          <path d="M46 16a18 18 0 0 1 0 25" />
        </g>
        <rect x="14" y="20" width="22" height="16" rx="2" fill="#0f2b28" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1" />
        <path d="M18 32.5 23 27l4 3.4 7-7.4" stroke={`url(#${uid}-accent)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="32" cy="23" r="1.6" fill={ACCENT} />
        <rect x="21" y="38" width="10" height="3" rx="1.5" fill="#9fcfc9" />
        <circle cx="18" cy="46" r="2.6" fill="#f4faf9" />
        <circle cx="25" cy="46" r="2.6" fill="#cfe4e1" />
        <circle cx="32" cy="46" r="2.6" fill="#9fcfc9" />
      </Chip>
    </svg>
  );
}

function MedicalCamps({ uid }: SceneProps) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Chip uid={uid}>
        <path d="M22 44 30 24l8 20z" fill="#f4faf9" />
        <path d="M22 44 30 24l0 20z" fill="#dfeeec" />
        <rect x="28.4" y="18" width="3.2" height="6" fill="#9fb8b4" />
        <rect x="27.5" y="16.5" width="7" height="4" rx="0.6" fill={`url(#${uid}-accent)`} />
        <g transform="translate(36,34)">
          <rect x="0" y="0" width="16" height="9" rx="1.6" fill="#178f86" />
          <circle cx="3.5" cy="10" r="2.1" fill="#0f2b28" stroke="#dfeeec" strokeWidth="1" />
          <circle cx="12.5" cy="10" r="2.1" fill="#0f2b28" stroke="#dfeeec" strokeWidth="1" />
          <rect x="2" y="2" width="5" height="4" rx="0.6" fill="#eafaf8" opacity="0.85" />
        </g>
        <circle cx="16" cy="46" r="2" fill="#cfe4e1" />
        <circle cx="20.5" cy="49" r="2" fill="#9fcfc9" />
      </Chip>
    </svg>
  );
}

const SCENES: Record<ServiceFamily, (props: SceneProps) => React.ReactElement> = {
  "compliance-licensing": ComplianceLicensing,
  "quality-accreditation": QualityAccreditation,
  "records-management": RecordsManagement,
  "facility-setup": FacilitySetup,
  "equipment-infrastructure": EquipmentInfrastructure,
  manpower: Manpower,
  "insurance-tpa": InsuranceTpa,
  marketing: Marketing,
  "medical-camps": MedicalCamps,
};

export default function ServiceScene({
  familyId,
  uid,
  className = "",
}: {
  familyId: ServiceFamily;
  uid: string;
  className?: string;
}) {
  const Scene = SCENES[familyId];
  return (
    <div className={className}>
      <Scene uid={uid} />
    </div>
  );
}
