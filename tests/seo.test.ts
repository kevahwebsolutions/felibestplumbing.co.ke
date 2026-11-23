import { describe, expect, it } from 'vitest';
import { POSTS } from '@/data/blog';
import { SERVICES } from '@/data/services';
import { CATALOG_CATEGORIES } from '@/data/catalog-products';
import { DESC_MAX, DESC_MIN, fitDescription, fitTitle, siteLd, TITLE_MAX } from '@/lib/seo';

const inRange = (s: string) => s.length >= DESC_MIN && s.length <= DESC_MAX;

describe('title and description helpers', () => {
  it('adds the brand suffix only when it fits in 60 characters', () => {
    expect(fitTitle('Burst Pipes Repair in Nairobi')).toBe('Burst Pipes Repair in Nairobi | Felibest Plumbing');
    const long = 'Washing Machine Covers and Stands in Nairobi';
    expect(fitTitle(long)).toBe(long);
    expect(fitTitle('Felibest Plumbing Nairobi | 24/7 Emergency Plumber')).toBe('Felibest Plumbing Nairobi | 24/7 Emergency Plumber');
  });

  it('never cuts a description mid-word', () => {
    const base = 'Mesh bags for the wash: a set of 2 shoe washing bags, zipped laundry mesh bags and drawstring laundry mesh bags.';
    const out = fitDescription(base, ['Order online from Felibest Plumbing in Nairobi, prices in KES, pay on delivery.', 'Shop at Felibest Plumbing, Nairobi.']);
    expect(out.length).toBeLessThanOrEqual(DESC_MAX);
    expect(out.startsWith(base)).toBe(true);
  });
});

describe('service page metadata', () => {
  it.each(SERVICES.map((s) => [s.slug, s] as const))('%s has a title of 30-60 characters and a 110-155 character description', (_slug, s) => {
    const title = fitTitle(s.seoTitle);
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(inRange(s.seoDescription)).toBe(true);
  });

  it('titles and descriptions are unique across services', () => {
    expect(new Set(SERVICES.map((s) => s.seoTitle)).size).toBe(SERVICES.length);
    expect(new Set(SERVICES.map((s) => s.seoDescription)).size).toBe(SERVICES.length);
  });
});

describe('blog post metadata', () => {
  it.each(POSTS.map((p) => [p.slug, p] as const))('%s has short meta fields within limits', (_slug, p) => {
    const title = fitTitle(p.metaTitle);
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(inRange(p.metaDescription)).toBe(true);
    expect(p.coverAlt.length).toBeGreaterThan(10);
  });

  it('is unique and every post links to a real service', () => {
    expect(new Set(POSTS.map((p) => p.metaTitle)).size).toBe(POSTS.length);
    expect(new Set(POSTS.map((p) => p.metaDescription)).size).toBe(POSTS.length);
    for (const p of POSTS) expect(SERVICES.some((s) => s.slug === p.serviceSlug)).toBe(true);
  });
});

describe('category metadata inputs', () => {
  it('category intros are long enough to build a 110-155 character description', () => {
    for (const c of CATALOG_CATEGORIES) {
      const out = fitDescription(c.description, ['Order online from Felibest Plumbing in Nairobi, prices in KES, pay on delivery.', 'Shop at Felibest Plumbing in Nairobi, prices in KES, pay on delivery.', 'Shop at Felibest Plumbing, Nairobi.']);
      expect(inRange(out), `${c.slug}: ${out.length}`).toBe(true);
    }
  });
});

describe('site-wide structured data', () => {
  const graph = (siteLd()['@graph'] as Record<string, unknown>[]);
  const byType = (t: string) => graph.find((n) => ([] as string[]).concat(n['@type'] as string | string[]).includes(t))!;

  it('defines Organization, WebSite and Plumber with stable absolute ids', () => {
    for (const t of ['Organization', 'WebSite', 'Plumber']) expect(String(byType(t)['@id'])).toMatch(/^https?:\/\/[^/]+\/#/);
  });

  it('does not invent an address, geo, price range or ratings', () => {
    for (const n of graph) for (const k of ['address', 'geo', 'priceRange', 'aggregateRating', 'review']) expect(n[k]).toBeUndefined();
  });

  it('is open every day 00:00-23:59 and lists the five real social profiles', () => {
    const spec = byType('Plumber')['openingHoursSpecification'] as { dayOfWeek: string[]; opens: string; closes: string };
    expect(spec.dayOfWeek).toHaveLength(7);
    expect([spec.opens, spec.closes]).toEqual(['00:00', '23:59']);
    expect(byType('Organization')['sameAs']).toHaveLength(5);
  });
});
