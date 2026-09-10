import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import SectionHeading from "@/components/shared/SectionHeading";
import GalleryMasonry from "@/components/gallery/GalleryMasonry";
import CTASection from "@/components/shared/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Photographs of EMC Healthcare Services' work with hospitals and clinics — medical camps, compliance projects, facilities and team activity.",
  path: "/gallery",
  noIndex: true, // Unindex until real photographs replace the placeholders below.
});

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />

      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Gallery"
          title="EMC in the field"
          description="Filter by category and click any image to view it larger. This page is currently placeholder-only — see the note below for what to send."
          as="h1"
        />

        <div className="mt-12">
          <GalleryMasonry />
        </div>

        <div className="mt-12 max-w-2xl rounded-2xl border border-dashed border-signal-amber/50 bg-signal-amber/5 p-6">
          <h2 className="text-base font-semibold text-ink-900">What to send us</h2>
          <p className="prose-content mt-2 text-sm">
            High-resolution photographs from any of the categories above, with a short caption for each — e.g.
            facility name, service, and date. We&apos;ll add descriptive filenames and alt text, compress them for
            fast loading, and this page will go live and be included in search results.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
