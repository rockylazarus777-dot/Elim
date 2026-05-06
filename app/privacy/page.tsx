import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${SITE.name}`,
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-28 lg:pt-36">
        <article className="container mx-auto max-w-3xl px-4 pb-20 lg:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: May 2026</p>

          <Section title="Information we collect">
            We collect information you submit through our enquiry forms — name,
            hospital name, phone, email, and message — as well as basic
            analytics data (page views, anonymized IP, device class) through
            Google Analytics.
          </Section>
          <Section title="How we use information">
            We use submitted information solely to respond to your enquiry,
            schedule consultations, and improve our services. We do not sell
            personal information.
          </Section>
          <Section title="Data retention">
            Enquiry submissions are retained in a Supabase database used for
            internal CRM and outreach. You can request deletion of your data
            at any time by emailing {SITE.email}.
          </Section>
          <Section title="Cookies">
            We use minimal cookies for analytics and reCAPTCHA. You can disable
            non-essential cookies in your browser at any time.
          </Section>
          <Section title="Contact">
            For privacy concerns, write to {SITE.email}.
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
