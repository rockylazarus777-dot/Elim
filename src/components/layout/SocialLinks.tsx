import { siteConfig } from "@/lib/site-config";

/**
 * Small circular icon-button row for the footer's brand column. Only
 * renders a platform once its real profile URL is set in
 * `siteConfig.social` — never links to a generic platform homepage or an
 * invented profile.
 */
const PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: (
      <path
        d="M14.5 21v-7.2h2.4l.36-2.8h-2.76V9.2c0-.81.23-1.36 1.38-1.36h1.48V5.34c-.26-.03-1.13-.11-2.15-.11-2.13 0-3.58 1.3-3.58 3.68v2.05H9.2v2.8h2.43V21h2.87Z"
        fill="currentColor"
      />
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: (
      <path
        d="M7.1 9.6h2.35V18H7.1V9.6Zm1.18-3.77a1.36 1.36 0 1 1 0 2.72 1.36 1.36 0 0 1 0-2.72ZM11.2 9.6h2.25v1.15h.03c.31-.6 1.08-1.23 2.23-1.23 2.38 0 2.82 1.57 2.82 3.6V18h-2.35v-3.99c0-.95-.02-2.18-1.33-2.18-1.33 0-1.53 1.04-1.53 2.11V18H11.2V9.6Z"
        fill="currentColor"
      />
    ),
  },
] as const;

export default function SocialLinks() {
  const links = PLATFORMS.filter((platform) => siteConfig.social[platform.key]);
  if (!links.length) return null;

  return (
    <div className="mt-5 flex items-center gap-2.5" aria-label="EMC Healthcare Services on social media">
      {links.map((platform) => (
        <a
          key={platform.key}
          href={siteConfig.social[platform.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${siteConfig.shortName} on ${platform.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-ink-100 transition-colors duration-200 hover:bg-white/15 hover:text-[#20E0D0]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {platform.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
