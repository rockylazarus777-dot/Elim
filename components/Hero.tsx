'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, Activity, TrendingUp, Heart, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/utils';

export default function Hero() {
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi EMC, I'd like to schedule a consultation for my hospital."
  )}`;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-gradient pt-28 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-brand-700/10 blur-3xl" />
      </div>

      <div className="container mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 lg:grid-cols-12 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-7"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-soft backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Trusted hospital growth partner since inception
          </div>
          <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[64px]">
            Bridging Care,
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              Accelerating Growth
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            We help 20–50 bed hospitals grow patient flow, optimize operations,
            and increase revenue — measurable impact in just 30 days.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#contact" aria-label="Book a consultation">
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Elim Medical"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Now
              </a>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
            <Stat icon={<TrendingUp className="h-4 w-4" />} value="+30%" label="Avg admissions" />
            <Stat icon={<Activity className="h-4 w-4" />} value="40%" label="OT utilization" />
            <Stat icon={<ShieldCheck className="h-4 w-4" />} value="NABH" label="Compliance" />
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-[32px] border border-brand-100 bg-white/60 p-4 shadow-glow backdrop-blur">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-brand-50 to-white" />
            <HeroVisual />
            <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-brand-100 bg-white/95 p-3 shadow-card backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted">Live impact</p>
                  <p className="text-sm font-bold text-brand-700">
                    20+ hospitals scaling with EMC
                  </p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Activity className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * HeroVisual — animated SVG composition. Built with Framer Motion so it
 * works without an external Lottie URL. Designed to look like a healthcare
 * dashboard with a subtle pulse animation.
 */
function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-white to-brand-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Outer pulse ring */}
          <motion.circle
            cx="160"
            cy="160"
            r="120"
            fill="none"
            stroke="#1D70B8"
            strokeOpacity="0.15"
            strokeWidth="1.5"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '160px 160px' }}
          />
          <motion.circle
            cx="160"
            cy="160"
            r="80"
            fill="none"
            stroke="#0B3C5D"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            style={{ transformOrigin: '160px 160px' }}
          />

          {/* Central gradient circle with cross */}
          <defs>
            <linearGradient id="heroG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D70B8" />
              <stop offset="100%" stopColor="#0B3C5D" />
            </linearGradient>
          </defs>
          <circle cx="160" cy="160" r="56" fill="url(#heroG)" />
          <rect x="150" y="132" width="20" height="56" rx="3" fill="white" />
          <rect x="132" y="150" width="56" height="20" rx="3" fill="white" />

          {/* Heartbeat line */}
          <motion.path
            d="M40 220 L100 220 L120 200 L140 240 L160 200 L180 220 L280 220"
            stroke="#1D70B8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: [400, 0, -400] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Floating dots */}
          {[
            { cx: 80, cy: 90, delay: 0 },
            { cx: 240, cy: 80, delay: 0.5 },
            { cx: 60, cy: 250, delay: 1 },
            { cx: 260, cy: 260, delay: 1.5 },
          ].map((d, i) => (
            <motion.circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r="4"
              fill="#1D70B8"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: d.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-brand-100 bg-white/90 px-3 py-1 text-[10px] font-semibold text-brand-700 shadow-soft backdrop-blur"
      >
        <Heart className="h-3 w-3" />
        Live KPIs
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-brand-100 bg-white/90 px-3 py-1 text-[10px] font-semibold text-brand-700 shadow-soft backdrop-blur"
      >
        <Stethoscope className="h-3 w-3" />
        NABH Ready
      </motion.div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white/70 p-4 shadow-soft backdrop-blur">
      <div className="flex items-center gap-2 text-brand-700">
        {icon}
        <span className="text-lg font-bold">{value}</span>
      </div>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
    </div>
  );
}
