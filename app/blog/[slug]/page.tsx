import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CTA from '@/components/CTA';
import { Badge } from '@/components/ui/badge';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { formatDate, SITE } from '@/lib/utils';

type Params = { slug: string };

export const revalidate = 3600;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.cover, width: 1600, height: 900 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    image: post.cover,
  };

  return (
    <>
      <Navbar />
      <main className="bg-white pt-28 lg:pt-36">
        <article>
          <header className="container mx-auto max-w-3xl px-4 pb-10 lg:px-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge key={t} variant="soft">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base text-muted sm:text-lg">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          <div className="container mx-auto max-w-5xl px-4 lg:px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-brand-100 shadow-soft">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="container mx-auto max-w-3xl px-4 py-14 lg:px-6">
            <div className="prose-emc">
              {post.content.split(/\n\n+/).map((para, idx) => (
                <p
                  key={idx}
                  className="mb-5 text-base leading-relaxed text-ink/90"
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 rounded-3xl border border-brand-100 bg-brand-50/50 p-6">
              <p className="text-sm text-ink">
                Want a 30-minute review of your hospital&rsquo;s growth levers?
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
              >
                Book a consultation →
              </Link>
            </div>
          </div>
        </article>
        <CTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
