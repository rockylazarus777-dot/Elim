import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Logo({
  variant = "light",
  companyName = "EMC Healthcare Services Pvt Ltd",
}: {
  variant?: "light" | "dark";
  /** Overrides the displayed company-name text next to the logo mark. */
  companyName?: string;
}) {
  const isDark = variant === "dark";

  return (
    <Link
      href="/"
      className="group flex min-w-0 items-center gap-3 focus-visible:outline-offset-4"
      aria-label={`${siteConfig.brandName} — Home`}
    >
      {isDark ? (
        <Image
          src="/images/branding/footer-logo.png"
          alt="EMC Healthcare Services Pvt. Ltd. logo"
          width={52}
          height={52}
          priority
          className="h-10 w-10 object-contain sm:h-11 sm:w-11"
        />
      ) : (
        <Image
          src="/images/Emc Pvt ltd logo/logo.png"
          alt="EMC PVT LTD logo"
          width={180}
          height={52}
          priority
          className="h-10 w-auto max-w-[180px] object-contain sm:h-11"
        />
      )}

      <span className={`hidden h-8 w-px sm:block ${isDark ? "bg-white/20" : "bg-ink-200"}`} aria-hidden="true" />

      <span
        className={`min-w-0 text-[0.7rem] font-semibold tracking-[0.02em] sm:text-sm lg:text-[0.8rem] xl:text-base ${
          isDark ? "text-ink-100" : "truncate text-ink-900"
        }`}
      >
        {companyName}
      </span>
    </Link>
  );
}
