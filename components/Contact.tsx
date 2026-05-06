'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, FileText } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';
import { SITE } from '@/lib/utils';

export default function Contact() {
  return (
    <section id="contact" className="relative bg-brand-50/40 py-20 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              Contact
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Let&rsquo;s build your growth playbook
            </h2>
            <p className="mt-3 text-base text-muted">
              Share your details and a senior consultant will reach out
              within one business day.
            </p>

            <ul className="mt-8 space-y-4">
              <ContactItem
                icon={<MapPin className="h-5 w-5" />}
                label="Office"
                value={SITE.address}
              />
              <ContactItem
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={
                  <div className="flex flex-col">
                    {SITE.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p.replace(/\s+/g, '')}`}
                        className="hover:text-brand-700 transition-colors"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                }
              />
              <ContactItem
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-brand-700 transition-colors"
                  >
                    {SITE.email}
                  </a>
                }
              />
              <ContactItem
                icon={<Globe className="h-5 w-5" />}
                label="Website"
                value={
                  <a
                    href={SITE.url}
                    className="hover:text-brand-700 transition-colors"
                    rel="noopener noreferrer"
                  >
                    www.emcforyou.com
                  </a>
                }
              />
              <ContactItem
                icon={<FileText className="h-5 w-5" />}
                label="GST"
                value={SITE.gst}
              />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <EnquiryForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-soft">
      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-ink break-words">
          {value}
        </div>
      </div>
    </li>
  );
}
