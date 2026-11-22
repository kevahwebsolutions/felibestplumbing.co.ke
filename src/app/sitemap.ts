import type { MetadataRoute } from 'next';
import { SERVICES } from '@/data/services';
import { POSTS } from '@/data/blog';
import { absoluteUrl } from '@/lib/utils';
import { categoriesWithCounts, listPublishedProducts } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ['/', '/about', '/services', '/shop', '/pricing', '/gallery', '/testimonials', '/faq', '/blog', '/contact', '/coverage', '/privacy', '/terms'];
  let products: { slug: string; categorySlug: string; updatedAt: number }[] = [];
  let categories: { slug: string }[] = [];
  try { products = listPublishedProducts(); categories = categoriesWithCounts(); } catch { products = []; categories = []; }
  const modified = (secs: number) => new Date(secs * 1000);
  return [
    ...statics.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.7 })),
    ...SERVICES.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...POSTS.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.date), changeFrequency: 'yearly' as const, priority: 0.6 })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/shop/category/${c.slug}`),
      lastModified: modified(Math.max(...products.filter((p) => p.categorySlug === c.slug).map((p) => p.updatedAt))),
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
    ...products.map((p) => ({ url: absoluteUrl(`/shop/${p.slug}`), lastModified: modified(p.updatedAt), changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
