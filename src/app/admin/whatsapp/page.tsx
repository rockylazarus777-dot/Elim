import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import SignOutButton from "@/components/admin/SignOutButton";
import Logo from "@/components/layout/Logo";
import { STAFF_ROLE_LABELS } from "@/lib/auth/access";
import { requireStaffPage } from "@/lib/auth/staff";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "WhatsApp Inbox" };

/**
 * Placeholder for the EMC WhatsApp Inbox — proves the sign-in and staff
 * check work end to end. The Inbox itself is built in a later step.
 */
export default async function WhatsAppInboxPage() {
  const access = await requireStaffPage();
  if (access.status !== "active") return <AccessDenied access={access} />;

  const { profile } = access;

  return (
    <>
      <header className="border-b border-ink-100 bg-white">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <SignOutButton />
        </div>
      </header>

      <div className="container-page py-10 sm:py-14">
        <section className="max-w-xl rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
          <p className="eyebrow">Messages</p>
          <h1 className="mt-3 font-display text-2xl text-ink-900 sm:text-3xl">EMC WhatsApp Inbox</h1>
          <p className="mt-3 text-ink-600">You&apos;re signed in. The Inbox is being set up — conversations will appear here.</p>

          <dl className="mt-8 divide-y divide-ink-100 rounded-xl ring-1 ring-ink-100">
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-ink-500">Name</dt>
              <dd className="text-ink-900 sm:col-span-2">{profile.full_name}</dd>
            </div>
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-ink-500">Email</dt>
              <dd className="break-all text-ink-900 sm:col-span-2">{profile.email}</dd>
            </div>
            <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-ink-500">Role</dt>
              <dd className="sm:col-span-2">
                <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {STAFF_ROLE_LABELS[profile.role]}
                </span>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
