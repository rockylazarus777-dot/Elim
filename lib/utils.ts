import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const SITE = {
  name: 'Elim Medical Consultancy',
  short: 'EMC',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emcforyou.com',
  description:
    'Hospital growth partner for 20–50 bed hospitals. Patient flow, operations, NABH, insurance, training and clinic setup.',
  email: 'info@emcforyou.com',
  phones: ['+91 6374741590', '+91 8122309659'],
  address:
    'No. 24, Thiruvallurpuram 2nd Street, Choolaimedu, Chennai – 600094',
  gst: '33FVOPP3191K1ZY',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919600822491',
  socials: {
    facebook: 'https://facebook.com/elimmedicalconsultants',
    instagram: 'https://instagram.com/elimmedicalconsultants',
    linkedin: 'https://linkedin.com/company/elim-medical-consultancy',
    twitter: 'https://twitter.com/elimmedical',
  },
};
