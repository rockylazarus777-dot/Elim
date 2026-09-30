/** Small inline icons for the Inbox (stroke icons, 24×24 grid, currentColor). */
type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);
export const SendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12 20 4l-6 16-3-7-7-1Z" />
  </Svg>
);
export const PaperclipIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />
  </Svg>
);
export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
  </Svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5 8 12l7 7" />
  </Svg>
);
export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10v4.5M12 17.5h.01" />
  </Svg>
);
export const NoteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h10l4 4v12H5z" />
    <path d="M15 4v4h4M8.5 12.5h7M8.5 16h5" />
  </Svg>
);
export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </Svg>
);

/** WhatsApp-style ticks for outbound message status. */
export function Ticks({ state }: { state: "single" | "double" | "double-read" }) {
  const color = state === "double-read" ? "text-sky-600" : "text-ink-400";
  return (
    <svg viewBox="0 0 18 12" aria-hidden="true" className={`h-3 w-[18px] ${color}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m1 6.5 3.5 3.5L11 2.5" />
      {state !== "single" && <path d="m6.5 10 1 .5L16 2.5" />}
    </svg>
  );
}
