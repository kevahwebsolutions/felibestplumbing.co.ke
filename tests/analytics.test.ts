import { describe, expect, it } from 'vitest';
import { addDays, computeKpis, dailySeries, daysBetween, delta, eatParts, funnel, hourWeekdayHeatmap, productStats, topPages, trafficSources, type EventRow } from '@/lib/analytics/aggregate';
import { classifyReferrer, isBot, parseUa, shouldIgnorePath, visitorHash } from '@/lib/analytics/ua';

// 2026-03-02 is a Monday. 09:00 EAT = 06:00 UTC.
const T0 = Date.UTC(2026, 2, 2, 6, 0, 0) / 1000;
const ev = (o: Partial<EventRow>): EventRow => ({ ts: T0, visitorId: 'v1', sessionId: 's1', type: 'pageview', path: '/', source: '', device: 'mobile', browser: 'Chrome', os: 'Android', productId: null, value: null, ...o });

describe('time helpers', () => {
  it('uses East Africa Time for day, hour and weekday', () => {
    expect(eatParts(T0)).toEqual({ day: '2026-03-02', hour: 9, weekday: 0 });
    expect(eatParts(Date.UTC(2026, 2, 2, 22, 0, 0) / 1000).day).toBe('2026-03-03');
  });
  it('adds days and lists ranges across month ends', () => {
    expect(addDays('2026-02-28', 2)).toBe('2026-03-02');
    expect(daysBetween('2026-02-27', '2026-03-02')).toEqual(['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-02']);
  });
});

describe('kpis', () => {
  const events = [
    ev({}), ev({ ts: T0 + 60, path: '/shop' }),
    ev({ visitorId: 'v2', sessionId: 's2' }),
    ev({ visitorId: 'v3', sessionId: 's3', type: 'pageview' }), ev({ visitorId: 'v3', sessionId: 's3', type: 'order_placed', value: 5000 }),
    ev({ visitorId: 'v4', sessionId: 's4', type: 'call_click' }),
  ];
  const k = computeKpis(events);
  it('counts visitors, sessions and pageviews', () => {
    expect(k.visitors).toBe(4);
    expect(k.sessions).toBe(4);
    expect(k.pageviews).toBe(4);
    expect(k.pagesPerSession).toBe(1);
  });
  it('computes bounce rate from single-event sessions', () => {
    expect(k.bounceRate).toBe(0.5);
  });
  it('sums orders, revenue, calls and conversion', () => {
    expect(k.orders).toBe(1);
    expect(k.revenue).toBe(5000);
    expect(k.calls).toBe(1);
    expect(k.conversionRate).toBe(0.25);
  });
  it('handles an empty period', () => {
    const e = computeKpis([]);
    expect(e.sessions).toBe(0);
    expect(e.bounceRate).toBe(0);
    expect(e.pagesPerSession).toBe(0);
  });
  it('computes deltas with a zero baseline', () => {
    expect(delta(150, 100)).toBe(50);
    expect(delta(5, 0)).toBeNull();
    expect(delta(0, 0)).toBe(0);
  });
});

describe('breakdowns', () => {
  const events = [ev({ path: '/a' }), ev({ path: '/a', sessionId: 's2', visitorId: 'v2', source: 'Search' }), ev({ path: '/b', sessionId: 's3', visitorId: 'v3', source: 'Search' }), ev({ type: 'product_view', productId: 7, path: '/shop/x' }), ev({ type: 'add_to_cart', productId: 7 })];
  it('ranks top pages', () => {
    expect(topPages(events)[0]).toEqual({ name: '/a', value: 2 });
  });
  it('attributes sources from each session first event, empty meaning direct', () => {
    expect(trafficSources(events)).toEqual([{ name: 'Search', value: 2 }, { name: 'Direct', value: 1 }]);
  });
  it('builds product view versus add to cart stats', () => {
    expect(productStats(events)).toEqual([{ productId: 7, views: 1, addToCart: 1 }]);
  });
  it('fills a weekday by hour heatmap', () => {
    const g = hourWeekdayHeatmap(events);
    expect(g).toHaveLength(7);
    expect(g[0]![9]).toBe(3);
  });
  it('builds a daily series including empty days', () => {
    const s = dailySeries(events, ['2026-03-01', '2026-03-02']);
    expect(s[0]).toEqual({ day: '2026-03-01', visitors: 0, pageviews: 0 });
    expect(s[1]!.pageviews).toBe(3);
  });
});

describe('funnel', () => {
  it('is monotonic: sessions must have reached the previous step', () => {
    const events = [
      ev({ sessionId: 'a' }), ev({ sessionId: 'a', type: 'product_view' }), ev({ sessionId: 'a', type: 'add_to_cart' }), ev({ sessionId: 'a', type: 'checkout_start' }), ev({ sessionId: 'a', type: 'order_placed' }),
      ev({ sessionId: 'b' }), ev({ sessionId: 'b', type: 'product_view' }),
      ev({ sessionId: 'c', type: 'add_to_cart' }),
    ];
    expect(funnel(events).map((f) => f.sessions)).toEqual([2, 2, 1, 1, 1]);
  });
});

describe('user agent and privacy helpers', () => {
  it('detects bots', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
    expect(isBot('')).toBe(true);
    expect(isBot('Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36')).toBe(false);
  });
  it('parses device, browser and OS', () => {
    const r = parseUa('Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36');
    expect(r.device).toBe('mobile');
    expect(r.os).toBe('Android');
    expect(r.browser).toContain('Chrome');
  });
  it('classifies referrers', () => {
    expect(classifyReferrer('https://www.google.com/search?q=plumber', 'felibestplumbing.co.ke')).toBe('Search');
    expect(classifyReferrer('https://l.facebook.com/x', 'felibestplumbing.co.ke')).toBe('Social');
    expect(classifyReferrer('https://felibestplumbing.co.ke/shop', 'felibestplumbing.co.ke')).toBe('');
    expect(classifyReferrer('https://example.org', 'felibestplumbing.co.ke')).toBe('Referral');
    expect(classifyReferrer('', 'x')).toBe('');
  });
  it('rotates the visitor hash daily and never contains the IP', () => {
    const a = visitorHash('203.0.113.9', 'UA', '2026-03-02', 'salt');
    const b = visitorHash('203.0.113.9', 'UA', '2026-03-03', 'salt');
    expect(a).not.toBe(b);
    expect(a).toBe(visitorHash('203.0.113.9', 'UA', '2026-03-02', 'salt'));
    expect(a).not.toContain('203');
  });
  it('ignores admin and api paths', () => {
    expect(shouldIgnorePath('/admin/products')).toBe(true);
    expect(shouldIgnorePath('/api/forms')).toBe(true);
    expect(shouldIgnorePath('/shop')).toBe(false);
  });
});
