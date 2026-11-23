import type { MetadataRoute } from 'next';
import { SERVICES } from '@/data/services';
import { POSTS } from '@/data/blog';
import { allGalleryItems } from '@/data/gallery';
import lastmod from '@/data/lastmod.json';
import { absoluteUrl } from '@/lib/utils';
import { categoriesWithCounts, imageUrl, listPublishedProducts } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

const LM = lastmod as Record<string, string>;
const fallback = LM['/'] ?? new Date().toISOString().slice(0, 10);
const dateFor = (key: string) => new Date(LM[key] ?? fallback);

/** Indexable URLs only: no noindex pages (cart, checkout, orders, admin) and no redirected legacy URLs. Far below the 500 URL split threshold. */
export default function sitemap(): MetadataRoute.Sitemap {
  let products: ReturnType<typeof listPublishedProducts> = [];
  let categories: { slug: string }[] = [];
  try { products = listPublishedProducts(); categories = categoriesWithCounts(); } catch { products = []; categories = []; }
  const modified = (secs: number) => new Date(secs * 1000);
  const statics: { path: string; freq: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number; images?: string[] }[] = [
    { path: '/', freq: 'weekly', priority: 1 },
    { path: '/services', freq: 'monthly', priority: 0.9 },
    { path: '/shop', freq: 'weekly', priority: 0.9 },
    { path: '/pricing', freq: 'monthly', priority: 0.7 },
    { path: '/gallery', freq: 'monthly', priority: 0.6, images: allGalleryItems().map((g) => absoluteUrl(g.src)) },
    { path: '/about', freq: 'yearly', priority: 0.6 },
    { path: '/contact', freq: 'yearly', priority: 0.7 },
    { path: '/coverage', freq: 'yearly', priority: 0.6 },
    { path: '/blog', freq: 'weekly', priority: 0.7 },
    { path: '/faq', freq: 'monthly', priority: 0.6 },
    { path: '/testimonials', freq: 'monthly', priority: 0.4 },
    { path: '/privacy', freq: 'yearly', priority: 0.2 },
    { path: '/terms', freq: 'yearly', priority: 0.2 },
  ];
  return [
    ...statics.map((s) => ({ url: absoluteUrl(s.path), lastModified: dateFor(s.path), changeFrequency: s.freq, priority: s.priority, ...(s.images ? { images: s.images } : {}) })),
    ...SERVICES.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: dateFor('services'), changeFrequency: 'monthly' as const, priority: s.emergency ? 0.9 : 0.8, images: [absoluteUrl(s.heroSrc)] })),
    ...POSTS.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.updated ?? p.date), changeFrequency: 'yearly' as const, priority: 0.6, images: [absoluteUrl(p.cover)] })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/shop/category/${c.slug}`),
      lastModified: modified(Math.max(...products.filter((p) => p.categorySlug === c.slug).map((p) => p.updatedAt))),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.slug}`),
      lastModified: modified(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      images: p.images.slice(0, 5).map((i) => absoluteUrl(imageUrl(i.src))),
    })),
  ];
}
