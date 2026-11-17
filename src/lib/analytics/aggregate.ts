/**
 * Pure analytics aggregation. No database access, so it is easy to unit test.
 * Days, hours and weekdays are in East Africa Time (UTC+3, no daylight saving).
 */
export type EventRow = {
  ts: number; // unix seconds
  visitorId: string;
  sessionId: string;
  type: string;
  path: string;
  source: string;
  device: string;
  browser: string;
  os: string;
  productId: number | null;
  value: number | null;
};

const EAT_OFFSET = 3 * 3600;

export function eatParts(ts: number): { day: string; hour: number; weekday: number } {
  const d = new Date((ts + EAT_OFFSET) * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  // Monday = 0 ... Sunday = 6
  const weekday = (d.getUTCDay() + 6) % 7;
  return { day: `${y}-${m}-${dd}`, hour: d.getUTCHours(), weekday };
}

export function dayStartTs(day: string): number {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d) / 1000 - EAT_OFFSET;
}

export function addDays(day: string, n: number): string {
  return eatParts(dayStartTs(day) + n * 86400 + 3600).day;
}

export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let cur = from;
  for (let i = 0; i < 800 && cur <= to; i++) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

export type Kpis = {
  visitors: number;
  pageviews: number;
  sessions: number;
  pagesPerSession: number;
  bounceRate: number; // 0..1
  orders: number;
  revenue: number;
  conversionRate: number; // orders / sessions, 0..1
  calls: number;
  whatsapp: number;
  forms: number;
};

export function computeKpis(events: EventRow[]): Kpis {
  const visitors = new Set<string>();
  const sessions = new Map<string, { pageviews: number; events: number }>();
  let pageviews = 0, orders = 0, revenue = 0, calls = 0, whatsapp = 0, forms = 0;
  for (const e of events) {
    visitors.add(e.visitorId);
    const s = sessions.get(e.sessionId) ?? { pageviews: 0, events: 0 };
    s.events++;
    if (e.type === 'pageview') {
      pageviews++;
      s.pageviews++;
    }
    sessions.set(e.sessionId, s);
    if (e.type === 'order_placed') {
      orders++;
      revenue += e.value ?? 0;
    } else if (e.type === 'call_click') calls++;
    else if (e.type === 'whatsapp_click') whatsapp++;
    else if (e.type === 'form_submit') forms++;
  }
  let bounces = 0;
  for (const s of sessions.values()) if (s.pageviews <= 1 && s.events <= 1) bounces++;
  const n = sessions.size;
  return {
    visitors: visitors.size,
    pageviews,
    sessions: n,
    pagesPerSession: n ? round(pageviews / n, 2) : 0,
    bounceRate: n ? round(bounces / n, 4) : 0,
    orders,
    revenue,
    conversionRate: n ? round(orders / n, 4) : 0,
    calls,
    whatsapp,
    forms,
  };
}

export function round(v: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

/** Percentage change from previous to current. Returns null when there is no baseline. */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return round(((current - previous) / previous) * 100, 1);
}

export type SeriesPoint = { day: string; visitors: number; pageviews: number };

export function dailySeries(events: EventRow[], days: string[]): SeriesPoint[] {
  const byDay = new Map<string, { v: Set<string>; p: number }>();
  for (const d of days) byDay.set(d, { v: new Set(), p: 0 });
  for (const e of events) {
    const { day } = eatParts(e.ts);
    const b = byDay.get(day);
    if (!b) continue;
    b.v.add(e.visitorId);
    if (e.type === 'pageview') b.p++;
  }
  return days.map((day) => ({ day, visitors: byDay.get(day)!.v.size, pageviews: byDay.get(day)!.p }));
}

export type Counted = { name: string; value: number };

function tally(items: string[], limit = 10): Counted[] {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name)).slice(0, limit);
}

export function topPages(events: EventRow[], limit = 8): Counted[] {
  return tally(events.filter((e) => e.type === 'pageview').map((e) => e.path), limit);
}

/** Traffic sources by session, using the first event of each session. Empty source means direct. */
export function trafficSources(events: EventRow[]): Counted[] {
  const first = new Map<string, EventRow>();
  for (const e of events) {
    const cur = first.get(e.sessionId);
    if (!cur || e.ts < cur.ts) first.set(e.sessionId, e);
  }
  return tally([...first.values()].map((e) => e.source || 'Direct'), 8);
}

function bySession(events: EventRow[], pick: (e: EventRow) => string, limit = 8): Counted[] {
  const first = new Map<string, EventRow>();
  for (const e of events) {
    const cur = first.get(e.sessionId);
    if (!cur || e.ts < cur.ts) first.set(e.sessionId, e);
  }
  return tally([...first.values()].map(pick), limit);
}

export const deviceSplit = (events: EventRow[]) => bySession(events, (e) => e.device || 'desktop');
export const browserSplit = (events: EventRow[]) => bySession(events, (e) => e.browser || 'Other', 6);

/** Rows = weekday (Mon..Sun), columns = hour 0..23. */
export function hourWeekdayHeatmap(events: EventRow[]): number[][] {
  const grid = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const e of events) {
    if (e.type !== 'pageview') continue;
    const { hour, weekday } = eatParts(e.ts);
    grid[weekday]![hour]!++;
  }
  return grid;
}

export type ProductStat = { productId: number; views: number; addToCart: number };

export function productStats(events: EventRow[]): ProductStat[] {
  const m = new Map<number, ProductStat>();
  for (const e of events) {
    if (e.productId == null) continue;
    if (e.type !== 'product_view' && e.type !== 'add_to_cart') continue;
    const s = m.get(e.productId) ?? { productId: e.productId, views: 0, addToCart: 0 };
    if (e.type === 'product_view') s.views++;
    else s.addToCart++;
    m.set(e.productId, s);
  }
  return [...m.values()].sort((a, b) => b.views + b.addToCart - (a.views + a.addToCart));
}

export type FunnelStep = { step: string; sessions: number };

export function funnel(events: EventRow[]): FunnelStep[] {
  const steps: [string, (e: EventRow) => boolean][] = [
    ['Visit', (e) => e.type === 'pageview'],
    ['Product view', (e) => e.type === 'product_view'],
    ['Add to cart', (e) => e.type === 'add_to_cart'],
    ['Checkout', (e) => e.type === 'checkout_start'],
    ['Order', (e) => e.type === 'order_placed'],
  ];
  const sets = steps.map(() => new Set<string>());
  for (const e of events) steps.forEach(([, test], i) => test(e) && sets[i]!.add(e.sessionId));
  // A funnel is monotonic: a session only counts at step n if it also reached step n-1.
  const out: FunnelStep[] = [];
  let prev: Set<string> | null = null;
  steps.forEach(([name], i) => {
    const cur: Set<string> = prev ? new Set([...sets[i]!].filter((s) => prev!.has(s))) : sets[i]!;
    out.push({ step: name, sessions: cur.size });
    prev = cur;
  });
  return out;
}

export function summarizeDay(events: EventRow[]) {
  const k = computeKpis(events);
  const bounces = Math.round(k.bounceRate * k.sessions);
  return {
    visitors: k.visitors,
    sessions: k.sessions,
    pageviews: k.pageviews,
    bounces,
    orders: k.orders,
    revenue: k.revenue,
    calls: k.calls,
    whatsapp: k.whatsapp,
    forms: k.forms,
  };
}
