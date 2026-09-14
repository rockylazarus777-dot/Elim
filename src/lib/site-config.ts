/**
 * Central company/site configuration.
 *
 * IMPORTANT: Every field marked "PLACEHOLDER" below is NOT a real fact about
 * EMC Healthcare Services. It exists so the site builds and reads correctly
 * before real information is supplied. Replace every placeholder before
 * launch — see README.md "Adding your company information" for the full list.
 *
 * Facts that ARE filled in below come directly from EMC's internal
 * "Fresher / New Joiner Training Program" deck (source of truth, provided by
 * the company). Nothing here is invented.
 */

export const siteConfig = {
  legalName: "EMC Healthcare Services Pvt. Ltd.",
  formerlyKnownAs: "Elim Medical Consultancy",
  brandName: "EMC Healthcare Services Pvt. Ltd.",
  shortName: "EMC",

  tagline: "A-to-Z healthcare partner for hospitals and clinics",
  description:
    "EMC Healthcare Services Pvt. Ltd. is an A-to-Z healthcare partner that helps hospitals and clinics manage their healthcare, compliance, operations, staffing, patient care and growth requirements.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.emcforyou.com",

  phone: {
    display: "+91 96008 22491",
    href: "tel:+919600822491",
    isPlaceholder: false,
  },

  phoneSecondary: {
    display: "+91 81223 09659",
    href: "tel:+918122309659",
    isPlaceholder: false,
  },

  // PLACEHOLDER — no public contact email has been confirmed for the website yet.
  // (An internal address, admin@emcforyou.com, appears in the training deck for
  // staff EOD reports only — do not publish it as the public contact address
  // without the company's confirmation.)
  email: {
    display: "info@emcforyou.com",
    href: "mailto:info@emcforyou.com",
    isPlaceholder: false,
  },

  address: {
    streetAddress: "No. 72/3, Bajanai Koil Street, Choolaimedu",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600094",
    addressCountry: "IN",
    isPlaceholder: false,
  },

  serviceAreas: ["India"],

  // YouTube not yet supplied — remains a placeholder until provided.
  social: {
    linkedin: "https://www.linkedin.com/company/elim-medical-consultancy/",
    facebook: "https://www.facebook.com/share/1Ei1fhjhPU/",
    instagram: "https://www.instagram.com/emc_healthcareservice?stkn=MXRnNHNuZW5odzc3Nw==",
    youtube: "",
  },

    whatsapp: {
      // Digits only, with country code, no leading "+" — the format wa.me expects.
      number: "918122309659",
      href: "https://wa.me/918122309659",
      isPlaceholder: false,
    },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Our Clients", href: "/clients" },
    { label: "Contact", href: "/contact" },
  ],

  footerLegal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
