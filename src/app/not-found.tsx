import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-display-lg font-display text-ink-900">We couldn&apos;t find that page</h1>
      <p className="prose-content mx-auto mt-4">
        The page you&apos;re looking for may have moved or no longer exists. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go to Homepage
        </Link>
        <Link href="/services" className="btn-secondary">
          Browse Services
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact Us
        </Link>
      </div>
    </section>
  );
}
