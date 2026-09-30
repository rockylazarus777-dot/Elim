"use client";

import { usePathname } from "next/navigation";
import { isAdminAreaPath } from "@/lib/auth/admin-paths";

/**
 * Renders the public website's chrome (header, footer, chat widget,
 * WhatsApp button, analytics) everywhere except the staff-only /admin area,
 * so staff pages never load GTM / GA4 / Meta Pixel or report admin URLs.
 * On every public page it renders its children unchanged.
 */
export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAdminAreaPath(pathname)) return null;
  return <>{children}</>;
}
