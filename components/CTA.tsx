'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/utils';

export default function CTA() {
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi EMC, I'd like to discuss growing my hospital."
  )}`;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-6 py-14 text-center text-white sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-brand-500 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-brand-600 blur-3xl" />
          </div>
          <h2 className="relative text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Transform Your Hospital Growth Today
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Book a free 30-minute consultation. We&rsquo;ll audit your hospital&rsquo;s
            growth levers and share a 30-day playbook tailored to your facility.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="#contact">
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Now
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
