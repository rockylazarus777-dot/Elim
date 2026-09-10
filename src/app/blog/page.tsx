import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import SectionHeading from "@/components/shared/SectionHeading";
import ThemedVisual from "@/components/shared/ThemedVisual";
import Reveal from "@/components/shared/Reveal";
import { blogPosts } from "@/content/blog-posts";
import { getServiceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { ServiceFamily } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Healthcare Compliance & Hospital Operations Knowledge Hub",
  description:
    "Practical, factual guides on hospital compliance, accreditation, documentation and safety — written from EMC Healthcare Services' own training material.",
  path: "/blog",
});

function familyFor(post: (typeof blogPosts)[number]): ServiceFamily {
  return getServiceBySlug(post.relatedServiceSlugs[0] ?? "")?.family ?? "compliance-licensing";
}

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />

      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Knowledge hub"
          title="Practical guides for hospital & clinic teams"
          description="Straightforward explanations of the compliance, documentation and safety topics hospital and clinic teams ask about most — written to be useful on their own, whether or not you ever work with EMC."
          as="h1"
        />
      </section>

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-14">
          {featured ? (
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid gap-6 overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover md:grid-cols-2"
              >
                <ThemedVisual
                  family={familyFor(featured)}
                  icon={featured.icon}
                  label={`${featured.title} — featured image placeholder`}
                  className="aspect-[16/10] w-full md:aspect-auto md:h-full"
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{featured.category}</p>
                  <h2 className="mt-3 text-display-md font-display text-ink-900 group-hover:text-brand-700">
                    {featured.title}
                  </h2>
                  <p className="prose-content mt-3">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-xs text-ink-500">
                    <span>{featured.readingTime}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                      Read article
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
                        <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ) : null}

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover"
              >
                <ThemedVisual
                  family={familyFor(post)}
                  icon={post.icon}
                  label={`${post.title} — image placeholder`}
                  className="aspect-[16/9] w-full"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{post.category}</p>
                  <h2 className="mt-2 text-lg font-semibold text-ink-900 group-hover:text-brand-700">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-500">{post.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
