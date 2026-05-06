'use client';

import { motion } from 'framer-motion';
import { Building2, Calendar, ShieldCheck, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const items = [
  { icon: Building2, label: 'Trusted by Hospitals' },
  { icon: Calendar, label: '30-Day Impact' },
  { icon: ShieldCheck, label: 'NABH Support' },
  { icon: Workflow, label: 'End-to-End Solutions' },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Trust indicators"
      className="border-y border-brand-100/60 bg-white"
    >
      <div className="container mx-auto max-w-6xl px-4 py-6 lg:px-6">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {items.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Badge
                variant="soft"
                className="gap-2 px-4 py-2 text-sm font-semibold"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Badge>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
