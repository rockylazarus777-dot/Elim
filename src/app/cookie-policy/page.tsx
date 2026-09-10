import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: `Cookie Policy for the ${siteConfig.brandName} website.`,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Cookie Policy", path: "/cookie-policy" }]} />
      <article className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-display-lg font-display text-ink-900">Cookie Policy</h1>
          <p className="mt-3 text-sm text-ink-500">Last updated: [PLACEHOLDER — set the date this policy goes live]</p>

          <div className="prose-content mt-8 rounded-2xl border border-dashed border-signal-amber/50 bg-signal-amber/5 p-6 text-sm">
            <strong className="text-ink-900">This page is a structural placeholder, not legal advice.</strong> Update
            the table below to match the cookies actually set once analytics/marketing tools are enabled (see
            .env.example), and have the final text reviewed by a qualified legal professional.
          </div>

          <div className="prose-content mt-8">
            <h2>What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device that help websites function and, in some cases,
              measure how they&apos;re used.
            </p>

            <h2>Cookies this site may use</h2>
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left">
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-100">
                  <td className="py-2 pr-4">Analytics (page views, traffic sources)</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2">[PLACEHOLDER — enabled once NEXT_PUBLIC_GA_MEASUREMENT_ID is set]</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Tag management</td>
                  <td className="py-2 pr-4">Google Tag Manager</td>
                  <td className="py-2">[PLACEHOLDER — enabled once NEXT_PUBLIC_GTM_ID is set]</td>
                </tr>
              </tbody>
            </table>

            <h2>Managing cookies</h2>
            <p>
              Most browsers let you control or delete cookies through their settings. Disabling cookies may affect
              some site functionality.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
