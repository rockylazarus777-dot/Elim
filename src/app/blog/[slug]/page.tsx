import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import FAQ from "@/components/shared/FAQ";
import CTASection from "@/components/shared/CTASection";
import ThemedVisual from "@/components/shared/ThemedVisual";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/content/blog-posts";
import { getServiceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/components/seo/JsonLd";
import { ServiceFamily } from "@/types/content";

function familyFor(post: (typeof blogPosts)[number]): ServiceFamily {
  return getServiceBySlug(post.relatedServiceSlugs[0] ?? "")?.family ?? "compliance-licensing";
}

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const relatedServices = post.relatedServiceSlugs.map((slug) => getServiceBySlug(slug)).filter(Boolean);
  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />

      <article className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-4">{post.category}</p>
          <h1 className="text-display-lg font-display text-ink-900">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span aria-hidden="true">·</span>
            <span>By EMC Healthcare Services</span>
          </div>

          <ThemedVisual
            family={familyFor(post)}
            icon={post.icon}
            label={post.title}
            photoSrc={post.photoSrc}
            photoAlt={post.photoAlt}
            className="mt-8 aspect-[16/9] w-full rounded-2xl"
            priority
            sizes="(min-width: 768px) 768px, 100vw"
          />

          <div className="prose-content mt-10">
            {post.content.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>

          {post.faqs?.length ? (
            <div className="mt-14">
              <FAQ items={post.faqs} />
            </div>
          ) : null}

          {relatedServices.length ? (
            <div className="mt-14 rounded-2xl bg-ink-50/60 p-6">
              <h2 className="text-base font-semibold text-ink-900">Related services</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {relatedServices.map((service) => (
                  <li key={service!.slug}>
                    <Link
                      href={`/services/${service!.slug}`}
                      className="inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-ink-200 transition-colors hover:bg-brand-50"
                    >
                      {service!.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>

      {relatedPosts.length ? (
        <section className="border-t border-ink-100 bg-ink-50/60">
          <div className="container-page py-14">
            <h2 className="text-display-md font-display text-ink-900">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover"
                >
                  <ThemedVisual
                    family={familyFor(related)}
                    icon={related.icon}
                    label={related.title}
                    photoSrc={related.photoSrc}
                    photoAlt={related.photoAlt}
                    className="aspect-[16/9] w-full"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{related.category}</p>
                    <h3 className="mt-2 text-base font-semibold text-ink-900 group-hover:text-brand-700">
                      {related.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-ink-600">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection />
    </>
  );
}
