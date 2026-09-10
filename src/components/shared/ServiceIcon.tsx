import { IconKey } from "@/types/content";

const paths: Record<IconKey, React.ReactNode> = {
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 12h5M9.5 15.5h5M9.5 8.5h2" />
    </>
  ),
  pill: (
    <>
      <rect x="4.5" y="9.5" width="15" height="7" rx="3.5" transform="rotate(-45 12 13)" />
      <path d="M9.5 9.5 14.5 14.5" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  folder: (
    <>
      <path d="M3.5 6.5h6l2 2.5h9v9.5h-17z" />
      <path d="M3.5 6.5v-1h5l1.5 1.5" />
    </>
  ),
  biohazard: (
    <>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="5.5" r="2.4" />
      <circle cx="6.7" cy="15.2" r="2.4" />
      <circle cx="17.3" cy="15.2" r="2.4" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s4 3.5 4 7.5a4 4 0 1 1-8 0c0-1.3.7-2.3 1.4-3.1.2 1.4 1.1 2 1.6 1.6-.4-2 .5-4.2 1-6z" />
    </>
  ),
  gauge: (
    <>
      <path d="M5 16a7 7 0 1 1 14 0" />
      <path d="M12 16l3.2-4.2" />
      <path d="M4 19h16" />
    </>
  ),
  "shield-heart": (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M12 15s-2.6-1.6-2.6-3.4a1.6 1.6 0 0 1 2.6-1.2 1.6 1.6 0 0 1 2.6 1.2c0 1.8-2.6 3.4-2.6 3.4z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M15.5 14.2c2.4.3 4.5 2 4.5 4.8" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4h3l6 3.5V6.5L6 10z" />
      <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M18 7.5a6.5 6.5 0 0 1 0 9" />
    </>
  ),
  "trending-up": (
    <>
      <path d="M3.5 16.5 9 11l4 3 7.5-7.5" />
      <path d="M15 6.5h5.5V12" />
    </>
  ),
  monitor: (
    <>
      <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  tent: (
    <>
      <path d="M3.5 18.5 12 5l8.5 13.5z" />
      <path d="M12 5v13.5M8 18.5l4-7 4 7" />
    </>
  ),
  "home-heart": (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M12 16.5s-2.4-1.5-2.4-3.1a1.5 1.5 0 0 1 2.4-1.1 1.5 1.5 0 0 1 2.4 1.1c0 1.6-2.4 3.1-2.4 3.1z" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.2" transform="rotate(0 12 12)" />
      <path d="M7 8v3M11 8v3M15 8v3" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="10" height="17" />
      <path d="M9 7.5h2M13 7.5h0M9 11h2M13 11h0M9 14.5h2M13 14.5h0" />
      <path d="M15 10.5h4v10h-4" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </>
  ),
  "book-open": (
    <>
      <path d="M12 6.5c-2-1.3-4.6-1.8-7-1.5v13c2.4-.3 5 .2 7 1.5 2-1.3 4.6-1.8 7-1.5v-13c-2.4-.3-5 .2-7 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  handshake: (
    <>
      <path d="M2.5 12.5 6 9l3.5 3-2 2a1.4 1.4 0 0 0 2 2l3.3-3.3" />
      <path d="M21.5 12.5 18 9l-3.5 3" />
      <path d="M9.5 12 12 14.5c.7.7 1.8.7 2.5 0" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3.5h4M9.5 3.5v5.2L4.8 17a1.6 1.6 0 0 0 1.4 2.4h11.6a1.6 1.6 0 0 0 1.4-2.4l-4.7-8.3V3.5" />
      <path d="M7 14.5h10" />
    </>
  ),
};

export default function ServiceIcon({ name, className = "h-5 w-5" }: { name: IconKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
