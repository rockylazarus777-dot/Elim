import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllBlogPosts } from '@/lib/blog';
import { formatDate, SITE } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Hospital Growth Insights — EMC Blog',
  description:
    'Strategy, operations, and compliance insights for 20–50 bed hospitals — from the Elim Medical Consultancy team.',
  alternates: { canonical: `${SITE.url}/blog` },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <Navbar />
      <main className="bg-white pt-28 lg:pt-36">
        <section className="container mx-auto max-w-7xl px-4 pb-12 lg:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              EMC Insights
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Hospital growth insights, written by operators
            </h1>
            <p className="mt-4 text-base text-muted sm:text-lg">
              Strategy, operations, and compliance playbooks for 20–50 bed
              hospitals — practical, opinionated, and field-tested.
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 pb-24 lg:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="soft">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="mt-3 text-lg font-bold leading-tight text-ink transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{post.readingMinutes} min read</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
