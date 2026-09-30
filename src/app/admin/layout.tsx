import type { Metadata } from "next";

// Staff-only area: never indexed (src/middleware.ts also sends X-Robots-Tag).
// The public site's header, footer, chat widget and analytics are hidden
// here by <PublicOnly> in the root layout.
// Every staff page is per-user: never prerender or cache it at build time,
// even when Supabase isn't configured yet.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "EMC Staff", template: "%s | EMC Staff" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-sand-50">{children}</div>;
}
