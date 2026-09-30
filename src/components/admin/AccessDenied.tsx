import AdminAuthCard from "@/components/admin/AdminAuthCard";
import SignOutButton from "@/components/admin/SignOutButton";
import type { StaffAccess } from "@/lib/auth/access";

type DeniedAccess = Extract<StaffAccess, { status: "no_profile" | "inactive" | "error" }>;

const COPY: Record<DeniedAccess["status"], { title: string; body: string }> = {
  no_profile: {
    title: "Access not authorized",
    body: "Your account is not authorized for the EMC Inbox. If you're EMC staff, ask your administrator to add you.",
  },
  inactive: {
    title: "Access deactivated",
    body: "Your EMC Inbox access has been deactivated. Please contact your administrator if you need it restored.",
  },
  error: {
    title: "We couldn't verify your access",
    body: "Something went wrong while checking your access. Please try again in a moment, or contact your administrator.",
  },
};

/** Shown to someone signed in with Google who isn't active EMC staff. Reveals no Inbox data. */
export default function AccessDenied({ access }: { access: DeniedAccess }) {
  const { title, body } = COPY[access.status];

  return (
    <AdminAuthCard eyebrow="EMC Staff" title={title}>
      <p>{body}</p>
      {access.email && (
        <p className="mt-4 text-sm text-ink-500">
          Signed in as <span className="break-all font-medium text-ink-800">{access.email}</span>
        </p>
      )}
      <div className="mt-6">
        <SignOutButton className="btn-primary w-full" />
      </div>
    </AdminAuthCard>
  );
}
