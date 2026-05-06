'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/#impact', label: '30-Day Impact' },
  { href: '/#why', label: 'Why Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-brand-100/60 bg-white/85 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 lg:px-6">
        <Link
          href="/"
          aria-label="Elim Medical Consultancy"
          className="flex items-center group"
        >
          <Logo
            height={78}
            mobileHeight={40}
            alt="Elim Medical Consultancy Logo"
            className="transition-transform duration-200 group-hover:scale-105 group-hover:opacity-90"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href="tel:+916374741590" aria-label="Call Elim Medical">
              <Phone className="h-4 w-4" />
              Call us
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/#contact">Book Consultation</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-brand-100/60 bg-white shadow-soft lg:hidden"
          >
            <div className="container mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-brand-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <a href="tel:+916374741590">Call us</a>
                </Button>
                <Button asChild>
                  <Link href="/#contact" onClick={() => setOpen(false)}>
                    Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
