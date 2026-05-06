'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  ClipboardCheck,
  ShieldCheck,
  GraduationCap,
  Building,
  FileBadge,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

type Service = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
};

const services: Service[] = [
  {
    icon: Users,
    title: 'Patient Growth & Referral Support',
    description:
      'Build a sustained pipeline of admissions through structured referral networks and outreach.',
    benefits: [
      'Increase admissions',
      'Referral networks',
      'Surgical programs',
      'International reach',
    ],
  },
  {
    icon: Activity,
    title: 'Operational Optimization',
    description:
      'Run your hospital like a high-performing system with smart scheduling and resource utilization.',
    benefits: [
      'OT utilization',
      'Smart scheduling',
      'Manpower optimization',
      'Biomedical AMC',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Administrative & Compliance Support',
    description:
      'Move from paperwork to digital systems with NABH-ready processes and stronger branding.',
    benefits: [
      'MRD digitization',
      'NABH compliance',
      'Process standardization',
      'Branding',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Insurance & Claims Coordination',
    description:
      'Reduce revenue leakage with end-to-end empanelment, pre-auth, and claims tracking.',
    benefits: [
      'Empanelment',
      'Pre-authorizations',
      'Faster claims',
      'Tracking system',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Upskilling & Certification',
    description:
      'Build clinical excellence through internationally accredited training programs.',
    benefits: [
      'AHA & ATLS training',
      'Simulation programs',
      'Staff development',
    ],
  },
  {
    icon: Building,
    title: 'Clinic Establishment & Setup',
    description:
      'Greenfield clinic and hospital setup — from layout planning to opening day.',
    benefits: [
      'Planning & infrastructure',
      'Hiring & workflows',
      'Compliance setup',
      'Launch strategy',
    ],
  },
  {
    icon: FileBadge,
    title: 'Drug License & Regulatory Approvals',
    description:
      'Navigate licensing, government liaison, and compliance with confidence.',
    benefits: [
      'Documentation & filing',
      'Government liaison',
      'Compliance',
      'Renewal support',
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-brand-50/40 py-20 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Core Services
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Seven services. One growth engine.
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            A complete operating playbook for hospitals that want predictable
            growth, lower friction, and measurable ROI.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        
          {services.slice(4).map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i + 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group relative h-full overflow-hidden hover:-translate-y-1 hover:shadow-card hover:border-brand-200">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 transition-transform group-hover:scale-105">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {service.description}
          </p>
          <ul className="mt-4 space-y-2">
            {service.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-ink/80"
              >
                <Check
                  className="mt-0.5 h-4 w-4 flex-none text-brand-600"
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}
