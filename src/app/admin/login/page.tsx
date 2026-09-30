import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminAuthCard from "@/components/admin/AdminAuthCard";
import GoogleSignInButton from "@/components/admin/GoogleSignInButton";
import { ADMIN_HOME_PATH } from "@/lib/auth/admin-paths";
import { getStaffAccess } from "@/lib/auth/staff";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff sign in" };

// Only these codes are shown — the URL can't inject arbitrary text.
const ERROR_MESSAGES: Record<string, string> = {
  sign_in_failed: "Google sign-in didn't complete. Please try again.",
  not_configured: "Staff sign-in isn't set up on this server yet.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const configured = Boolean(getSupabasePublicConfig());

  // Already signed in → the Inbox page decides between the Inbox and "access denied".
  if (configured && (await getStaffAccess()).status !== "unauthenticated") {
    redirect(ADMIN_HOME_PATH);
  }

  const error = configured
    ? searchParams.error
      ? ERROR_MESSAGES[searchParams.error]
      : undefined
    : ERROR_MESSAGES.not_configured;

  return (
    <AdminAuthCard eyebrow="EMC Staff" title="Sign in to the EMC Inbox">
      <p>Access is restricted to authorized EMC Healthcare Services staff.</p>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-clay-50 px-4 py-3 text-sm text-clay-700 ring-1 ring-inset ring-clay-200">
          {error}
        </p>
      )}

      <div className="mt-6">
        <GoogleSignInButton disabled={!configured} />
      </div>

      <p className="mt-6 text-sm text-ink-500">
        Use the Google account your EMC administrator has approved. There is no public registration — if you need
        access, please contact your administrator.
      </p>
    </AdminAuthCard>
  );
}
