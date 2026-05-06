'use client';

import { motion } from 'framer-motion';
import { Compass, Users, FileSignature, LineChart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const reasons = [
  {
    icon: Compass,
    title: 'Strategic growth partner',
    description:
      'We act as an extension of your leadership team, not as a vendor delivering a deck.',
  },
  {
    icon: Users,
    title: 'Expert team',
    description:
      'Clinicians, operations specialists, and growth leaders working in lockstep.',
  },
  {
    icon: FileSignature,
    title: 'Structured agreements',
    description:
      'Clear scope, milestones, and accountability baked into every engagement.',
  },
  {
    icon: LineChart,
    title: 'Measurable ROI',
    description:
      'Every initiative is tied to a KPI — no vague "transformation" language.',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-brand-700 py-20 text-white sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-brand-600 blur-3xl" />
      </div>
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Why Choose EMC
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Built for outcomes. Engineered for trust.
          </h2>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            We pair strategic clarity with hands-on operational delivery so
            your hospital sees compounding results — quarter after quarter.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 hover:border-white/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {r.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
