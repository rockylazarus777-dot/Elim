import Image from "next/image";
import Reveal from "@/components/shared/Reveal";

/**
 * Optional "related work" strip — only renders when a service is actually
 * given real, approved, publicly-appropriate images beyond its single hero
 * photo. No service currently has any (confirmed against the project's
 * actual image assets), so this renders nothing today for all 17 services;
 * it's here so a future service with genuine extra photos (e.g. medical
 * camps, PRO/outreach activity) can opt in without a new component.
 */
export default function RelatedGallery({
  images,
  serviceName,
}: {
  images?: { src: string; alt: string }[];
  serviceName: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <section className="border-t border-ink-100 bg-ink-50/60" aria-labelledby="related-gallery-heading">
      <div className="container-page py-16 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">Related work</p>
          <h2 id="related-gallery-heading" className="text-display-md font-display text-ink-900">
            Gallery
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-100">
              <Image src={image.src} alt={image.alt || serviceName} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
