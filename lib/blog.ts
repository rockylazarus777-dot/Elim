/**
 * Lightweight blog source. Two adapters are supported:
 *
 * 1. LOCAL (default): static posts defined below — ideal for fast SEO ranking
 *    without an external CMS. Add new posts to the BLOG_POSTS array.
 *
 * 2. SANITY (optional): if NEXT_PUBLIC_SANITY_PROJECT_ID is set, the project
 *    can swap in a fetcher that queries Sanity. Implement that adapter in
 *    `getAllBlogPosts` / `getBlogPost` when you wire it up.
 */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author: string;
  readingMinutes: number;
  tags: string[];
  cover: string; // public path or remote URL
  content: string; // markdown-lite / HTML allowed
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'increase-hospital-occupancy-30-days',
    title: 'How to Increase Hospital Occupancy in 30 Days',
    description:
      'A practical playbook for 20–50 bed hospitals to drive occupancy without expanding capex.',
    publishedAt: '2026-04-12',
    author: 'EMC Editorial',
    readingMinutes: 7,
    tags: ['Patient Growth', 'Operations'],
    cover:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80',
    content: `
Hospitals with 20–50 beds often have untapped occupancy potential hidden in
referral leakage, slow admission flows, and weak digital presence. In this
playbook we walk through six levers we activate inside the first 30 days of
every engagement, including referral mapping, OPD-to-IPD conversion, and
local SEO.

We start with a referral audit. Most hospitals discover that 30–40% of nearby
GP and specialist referrals are flowing to competitors purely because of
process friction — not clinical reputation. Once that pipe is cleaned up,
admissions begin moving in week two.

Operational wins follow. Smart OT scheduling alone can free up 30% capacity
without adding manpower, while a tighter pre-auth process accelerates
insurance-led admissions. By day 30, leadership has a dashboard that ties
every KPI back to revenue.
`.trim(),
  },
  {
    slug: 'nabh-readiness-checklist',
    title: 'NABH Readiness: A Realistic 90-Day Checklist',
    description:
      'What 20–50 bed hospitals actually need to assemble for NABH entry-level accreditation.',
    publishedAt: '2026-03-22',
    author: 'EMC Editorial',
    readingMinutes: 9,
    tags: ['Compliance', 'NABH'],
    cover:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
    content: `
NABH accreditation feels intimidating, but the entry-level standards are
designed for small and mid-size facilities. The work breaks into three
streams: documentation, infrastructure, and clinical governance.

In this guide we share the document inventory, infection control baseline,
and quality indicator setup we use with our hospital partners. Most
facilities reach entry-level readiness in 90 days when the roadmap is
sequenced correctly.
`.trim(),
  },
  {
    slug: 'reduce-insurance-claim-denials',
    title: 'Five Practical Ways to Reduce Insurance Claim Denials',
    description:
      'Cut denial rates and shorten claim cycles without hiring a bigger billing team.',
    publishedAt: '2026-02-09',
    author: 'EMC Editorial',
    readingMinutes: 6,
    tags: ['Insurance', 'Revenue'],
    cover:
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1600&q=80',
    content: `
Claim denials are a silent revenue leak. Tightening five workflows — pre-auth
documentation, ICD coding QA, discharge summary timing, TPA follow-up, and
denial root-cause logging — can recover 4–8% of insurance revenue within a
quarter.

This piece walks through each lever with concrete examples from our
hospital engagements.
`.trim(),
  },
];

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const found = BLOG_POSTS.find((p) => p.slug === slug);
  return found ?? null;
}
