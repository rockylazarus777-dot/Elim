'use client';

import { motion } from 'framer-motion';
import { Hospital, BarChart3, Stethoscope } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative bg-white py-20 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              Who We Are
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              A growth partner built specifically for{' '}
              <span className="text-brand-700">small &amp; mid-size hospitals</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              EMC is a hospital growth partner focused on 20–50 bed
              hospitals. We help leadership teams improve occupancy,
              streamline operations, and unlock new revenue streams — without
              adding internal overhead. Our consultants combine clinical,
              operational, and commercial expertise to deliver measurable
              outcomes.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'End-to-end growth strategy tailored to your facility',
                'Hands-on operational improvements, not just reports',
                'Transparent KPIs reviewed every 30 days',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-ink"
                >
                  <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <Stat
                icon={<Hospital className="h-5 w-5" />}
                value="20–50"
                label="Bed hospitals"
              />
              <Stat
                icon={<BarChart3 className="h-5 w-5" />}
                value="30 days"
                label="To first impact"
              />
              <Stat
                icon={<Stethoscope className="h-5 w-5" />}
                value="7"
                label="Service verticals"
                full
              />
            </div>
            <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-brand-50 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
  full,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  full?: boolean;
}) {
  return (
    <div
      className={
        'rounded-3xl border border-brand-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card ' +
        (full ? 'col-span-2' : '')
      }
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
