import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SITE } from '@/lib/utils';

const cols = [
  {
    title: 'Services',
    links: [
      { href: '/#services', label: 'Patient Growth' },
      { href: '/#services', label: 'Operations' },
      { href: '/#services', label: 'Compliance' },
      { href: '/#services', label: 'Insurance & Claims' },
      { href: '/#services', label: 'Training' },
      { href: '/#services', label: 'Clinic Setup' },
      { href: '/#services', label: 'Drug License' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/#about', label: 'About' },
      { href: '/#why', label: 'Why EMC' },
      { href: '/blog', label: 'Blog' },
      { href: '/#contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col items-start">
            <p className="max-w-sm text-sm leading-relaxed text-muted mt-2">
              Elim Medical Consultancy partners with 20–50 bed hospitals to
              accelerate growth, optimize operations, and deliver measurable
              ROI in 30 days.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={SITE.socials.facebook} label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={SITE.socials.instagram} label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={SITE.socials.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={SITE.socials.twitter} label="Twitter">
                <Twitter className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition hover:text-brand-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                <a href={`tel:${SITE.phones[0].replace(/\s+/g, '')}`}>
                  {SITE.phones[0]}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted">
                <Mail className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li className="text-xs text-muted">{SITE.address}</li>
              <li className="text-xs text-muted">GST: {SITE.gst}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-brand-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {year} Elim Medical Consultancy. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-brand-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-700 transition hover:bg-brand-50 hover:text-brand-800"
    >
      {children}
    </a>
  );
}
