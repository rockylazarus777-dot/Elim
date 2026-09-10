import Link from "next/link";
import ThemedVisual from "@/components/shared/ThemedVisual";
import { blogPosts } from "@/content/blog-posts";
import { getServiceBySlug } from "@/content/services";

function familyFor(post: (typeof blogPosts)[number]) {
  return getServiceBySlug(post.relatedServiceSlugs[0] ?? "")?.family ?? "compliance-licensing";
}

export default function BlogPreview() {
  const [featured, ...rest] = blogPosts;
  const secondary = rest.slice(0, 3);
  if (!featured) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <Link href={`/blog/${featured.slug}`} className="group flex flex-col overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover">
        <ThemedVisual
          family={familyFor(featured)}
          icon={featured.icon}
          label={featured.title}
          photoSrc={featured.photoSrc}
          photoAlt={featured.photoAlt}
          className="aspect-[16/10] w-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="flex flex-1 flex-col p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{featured.category}</p>
          <h3 className="mt-2 text-2xl font-display text-ink-900 group-hover:text-brand-700">{featured.title}</h3>
          <p className="prose-content mt-3 flex-1">{featured.excerpt}</p>
          <div className="mt-6 flex items-center justify-between text-xs text-ink-500">
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

      <div className="flex flex-col gap-6">
        {secondary.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 overflow-hidden rounded-2xl ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover sm:gap-5"
          >
            <ThemedVisual
              family={familyFor(post)}
              icon={post.icon}
              label={post.title}
              photoSrc={post.photoSrc}
              photoAlt={post.photoAlt}
              className="aspect-square w-28 shrink-0 sm:w-36"
              hideIcon
              sizes="144px"
            />
            <div className="flex flex-1 flex-col justify-center py-3 pr-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{post.category}</p>
              <h4 className="mt-1 text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand-700 sm:text-base">
                {post.title}
              </h4>
              <span className="mt-1.5 text-xs text-ink-500">{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
