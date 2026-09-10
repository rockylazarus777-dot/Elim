import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: `Terms & Conditions for use of the ${siteConfig.brandName} website.`,
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms & Conditions", path: "/terms-and-conditions" }]} />
      <article className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-display-lg font-display text-ink-900">Terms & Conditions</h1>
          <p className="mt-3 text-sm text-ink-500">Last updated: [PLACEHOLDER — set the date this policy goes live]</p>

          <div className="prose-content mt-8 rounded-2xl border border-dashed border-signal-amber/50 bg-signal-amber/5 p-6 text-sm">
            <strong className="text-ink-900">This page is a structural placeholder, not legal advice.</strong> Replace
            the bracketed placeholders and have the final text reviewed by a qualified legal professional before
            publishing.
          </div>

          <div className="prose-content mt-8">
            <h2>1. Use of this website</h2>
            <p>
              [PLACEHOLDER — describe acceptable use of the website, e.g. informational use only, no scraping/misuse.]
            </p>

            <h2>2. No medical advice</h2>
            <p>
              This website provides information about {siteConfig.brandName}&apos;s healthcare compliance, operations and
              support services. It does not provide medical advice, diagnosis or treatment, and nothing on it should
              be treated as a substitute for professional medical or legal advice.
            </p>

            <h2>3. Service engagements</h2>
            <p>
              [PLACEHOLDER — state that specific service terms, pricing and timelines are confirmed separately in a
              formal agreement, and are not established by anything published on this website.]
            </p>

            <h2>4. Intellectual property</h2>
            <p>
              [PLACEHOLDER — confirm ownership of the site&apos;s content, logo and materials, and any restrictions on
              reuse.]
            </p>

            <h2>5. Limitation of liability</h2>
            <p>[PLACEHOLDER — insert the company&apos;s actual limitation-of-liability position, reviewed by counsel.]</p>

            <h2>6. Governing law</h2>
            <p>[PLACEHOLDER — specify the applicable jurisdiction.]</p>
          </div>
        </div>
      </article>
    </>
  );
}
