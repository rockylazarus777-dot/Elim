'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE } from '@/lib/utils';

export default function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi EMC, I'd like to learn how you can help my hospital grow."
  )}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="sr-only">Chat on WhatsApp</span>
    </motion.a>
  );
}
