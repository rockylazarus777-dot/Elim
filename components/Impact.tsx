'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  HardDrive,
  FolderArchive,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const items = [
  {
    icon: TrendingUp,
    title: 'Boost patient admissions',
    description: 'Activate referral channels and outreach programs.',
  },
  {
    icon: Activity,
    title: 'Improve OT utilization',
    description: 'Smart scheduling unlocks 30–40% more capacity.',
  },
  {
    icon: ShieldCheck,
    title: 'Faster insurance approvals',
    description: 'Cut pre-auth turnaround time and claim denials.',
  },
  {
    icon: HardDrive,
    title: 'Improve biomedical uptime',
    description: 'AMC and SLA-driven equipment reliability.',
  },
  {
    icon: FolderArchive,
    title: 'Streamline MRD workflows',
    description: 'Digitize records and reduce retrieval time.',
  },
  {
    icon: Eye,
    title: 'Increase hospital visibility',
    description: 'Local SEO, branding, and digital presence.',
  },
];

export default function Impact() {
  return (
    <section id="impact" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-brand-50/40 to-white" />
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            30-Day Impact
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Visible results in the first month
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            We commit to a structured 30-day playbook with clear KPIs reviewed
            weekly. Here&rsquo;s what hospitals typically achieve.
          </p>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-100 via-brand-200 to-brand-100 lg:block"
          />
          <ul className="grid gap-5 lg:grid-cols-2">
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={
                  'relative flex gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-soft hover:shadow-card transition lg:p-6 ' +
                  (i % 2 === 0 ? 'lg:mr-10' : 'lg:ml-10')
                }
              >
                <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink">
                      {item.title}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 flex-none text-emerald-500" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
