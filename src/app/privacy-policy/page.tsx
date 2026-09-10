import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.brandName} — how we collect, use and protect information submitted through this website.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy Policy", path: "/privacy-policy" }]} />
      <article className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-display-lg font-display text-ink-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-ink-500">Last updated: [PLACEHOLDER — set the date this policy goes live]</p>

          <div className="prose-content mt-8 rounded-2xl border border-dashed border-signal-amber/50 bg-signal-amber/5 p-6 text-sm">
            <strong className="text-ink-900">This page is a structural placeholder, not legal advice.</strong> The
            section headings below reflect what a healthcare-services privacy policy typically covers. Replace the
            bracketed placeholders with EMC&apos;s actual data practices, and have the final text reviewed by a qualified
            legal professional before publishing.
          </div>

          <div className="prose-content mt-8">
            <h2>1. Information we collect</h2>
            <p>
              [PLACEHOLDER — describe exactly what personal data is collected: e.g. name, hospital/clinic name, phone
              number, email address and message content submitted through the contact form; analytics data collected
              via Google Analytics if enabled.]
            </p>

            <h2>2. How we use information</h2>
            <p>
              [PLACEHOLDER — describe how submitted enquiries are used, e.g. to respond to service requests, and
              confirm no information is sold to third parties unless that is inaccurate.]
            </p>

            <h2>3. Cookies and analytics</h2>
            <p>
              [PLACEHOLDER — list the specific cookies/analytics tools in use, e.g. Google Analytics, and link to the
              Cookie Policy.]
            </p>

            <h2>4. Data retention</h2>
            <p>[PLACEHOLDER — state how long enquiry data and any records are retained.]</p>

            <h2>5. Your rights</h2>
            <p>[PLACEHOLDER — describe how a visitor can request access to, correction of, or deletion of their data.]</p>

            <h2>6. Contact us</h2>
            <p>
              [PLACEHOLDER — provide the correct contact channel for privacy requests once confirmed; see the Contact
              page for current details.]
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
