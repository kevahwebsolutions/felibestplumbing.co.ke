import { expect, test } from '@playwright/test';

// Fast regression subset of `npm run seo:audit`: titles, descriptions, canonical, h1 and JSON-LD parsing on key routes.
const ROUTES = ['/', '/services', '/services/emergency-plumbing', '/services/drain-lines', '/blog', '/blog/burst-pipe-what-to-do-first', '/shop', '/shop/category/showers', '/pricing', '/gallery', '/about', '/contact', '/coverage', '/faq', '/testimonials'];

test.describe('on-page SEO', () => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const route of ROUTES) {
    test(`${route} has valid metadata and structured data`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBe(200);
      const html = await res.text();

      const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
      expect(title.length, `title "${title}"`).toBeGreaterThanOrEqual(30);
      expect(title.length, `title "${title}"`).toBeLessThanOrEqual(60);
      expect(titles.get(title), `duplicate title with ${titles.get(title)}`).toBeUndefined();
      titles.set(title, route);

      const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
      expect(desc.length, `description length for ${route}`).toBeGreaterThanOrEqual(110);
      expect(desc.length, `description length for ${route}`).toBeLessThanOrEqual(155);
      expect(descriptions.get(desc), `duplicate description with ${descriptions.get(desc)}`).toBeUndefined();
      descriptions.set(desc, route);

      const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] ?? '';
      const expectedPath = route === '/' ? '' : route;
      expect(canonical.replace(/\/$/, '')).toMatch(new RegExp(`^https?://[^/]+${expectedPath.replace(/\//g, '\/')}$`));

      expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
      expect(html).toMatch(/<html lang="en-KE"/);

      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]!);
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
      expect(html).not.toMatch(/"(aggregateRating|priceRange|geo)"/);
    });
  }

  test('private pages are noindex in the header and the markup', async ({ request }) => {
    for (const route of ['/cart', '/checkout', '/admin/login']) {
      const res = await request.get(route);
      expect(res.headers()['x-robots-tag'], route).toMatch(/noindex/);
      expect(await res.text(), route).toMatch(/<meta name="robots" content="[^"]*noindex/);
    }
  });

  test('unknown service and blog slugs return a real 404 with a server-rendered page', async ({ request }) => {
    for (const route of ['/services/not-a-service', '/blog/not-a-post', '/no-such-page']) {
      const res = await request.get(route);
      expect(res.status(), route).toBe(404);
      const html = await res.text();
      expect(html, route).toMatch(/<h1[\s>]/);
      expect(html, route).toMatch(/noindex/);
    }
  });

  test('robots.txt and sitemap.xml are consistent', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
    expect(robots).toMatch(/Disallow: \/admin/);
    expect(robots).not.toMatch(/Disallow: \/og/);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/services/emergency-plumbing');
    expect(sitemap).not.toMatch(/<loc>[^<]*\/(cart|checkout|admin|order)/);
  });

  test('home share image is a 1200x630 JPEG', async ({ request }) => {
    const res = await request.get('/og/page/home');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toBe('image/jpeg');
    const buf = await res.body();
    expect(buf.subarray(0, 2).toString('hex')).toBe('ffd8');
  });
});
