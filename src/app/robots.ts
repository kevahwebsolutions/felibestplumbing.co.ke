import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Public content, /og share images, /_next assets and /images stay crawlable (Google renders pages with them and
 * social crawlers fetch /og). Private and transactional areas and filter/sort variants are disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/og/', '/_next/static/', '/_next/image', '/images/', '/media/'],
        disallow: ['/admin', '/api', '/cart', '/checkout', '/order', '/*?category=', '/*?sort=', '/*?q='],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
