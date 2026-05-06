import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/utils';
import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const posts = await getAllBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
