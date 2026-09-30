import Logo from "@/components/layout/Logo";

/** Centered card used by the staff sign-in and access-denied screens. */
export default function AdminAuthCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-2xl text-ink-900 sm:text-[1.75rem]">{title}</h1>
          <div className="mt-4 text-ink-600">{children}</div>
        </section>
        <p className="mt-6 text-center text-xs text-ink-500">EMC Healthcare Services Pvt. Ltd. · Staff access only</p>
      </div>
    </div>
  );
}
