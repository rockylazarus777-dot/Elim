import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from '@/components/ui/toaster';
import Analytics from '@/components/Analytics';
import StructuredData from '@/components/StructuredData';
import { SITE } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#0B3C5D',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: "Elim Medical Consultancy",
  description: "Elim Medical Consultancy Official Website",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans">
        <Analytics />
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
