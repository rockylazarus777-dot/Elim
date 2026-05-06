import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${SITE.name}`,
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-28 lg:pt-36">
        <article className="container mx-auto max-w-3xl px-4 pb-20 lg:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: May 2026</p>

          <Section title="Use of website">
            By using this website you agree to use it lawfully and not to
            interfere with its operation. Content is provided for informational
            purposes; engagements are governed by separate written agreements.
          </Section>
          <Section title="Consultations">
            Free consultations are limited to scope discussion. Any deliverable
            work is subject to a signed Statement of Work.
          </Section>
          <Section title="Intellectual property">
            All content, branding, and assets on this site are property of
            {` ${SITE.name}`}. Reproduction without permission is prohibited.
          </Section>
          <Section title="Liability">
            {SITE.name} is not liable for indirect, incidental, or
            consequential damages arising from use of this website. Engagement
            liabilities are governed by signed contracts.
          </Section>
          <Section title="Contact">
            For questions about these terms, write to {SITE.email}.
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-brand-700">{title}</h2>
      <p className="mt-2 text-base leading-relaxed text-ink/85">{children}</p>
    </section>
  );
}
