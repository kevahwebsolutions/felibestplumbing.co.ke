import { and, between, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { getDb, getRaw, schema } from '@/db';
import {
  addDays, browserSplit, computeKpis, dailySeries, daysBetween, dayStartTs, delta, deviceSplit, eatParts, funnel,
  hourWeekdayHeatmap, productStats, summarizeDay, topPages, trafficSources, type EventRow,
} from '@/lib/analytics/aggregate';

export type NewEvent = {
  ts?: number;
  visitorId: string;
  sessionId: string;
  type: string;
  path: string;
  source: string;
  device: string;
  browser: string;
  os: string;
  country: string;
  productId?: number | null;
  value?: number | null;
};

export function recordEvent(e: NewEvent): void {
  const ts = e.ts ?? Math.floor(Date.now() / 1000);
  const p = eatParts(ts);
  getDb()
    .insert(schema.events)
    .values({
      ts, day: p.day, hour: p.hour, weekday: p.weekday, visitorId: e.visitorId, sessionId: e.sessionId, type: e.type,
      path: e.path, source: e.source, device: e.device, browser: e.browser, os: e.os, country: e.country,
      productId: e.productId ?? null, value: e.value ?? null,
    })
    .run();
}

export function todayEat(): string {
  return eatParts(Math.floor(Date.now() / 1000)).day;
}

function loadEvents(fromDay: string, toDay: string): EventRow[] {
  const from = dayStartTs(fromDay);
  const to = dayStartTs(addDays(toDay, 1));
  return getDb()
    .select({
      ts: schema.events.ts, visitorId: schema.events.visitorId, sessionId: schema.events.sessionId, type: schema.events.type,
      path: schema.events.path, source: schema.events.source, device: schema.events.device, browser: schema.events.browser,
      os: schema.events.os, productId: schema.events.productId, value: schema.events.value,
    })
    .from(schema.events)
    .where(and(gte(schema.events.ts, from), lt(schema.events.ts, to)))
    .all();
}

/** Nightly roll-up: write or refresh daily_stats for a day. */
export function rollupDay(day: string): void {
  const s = summarizeDay(loadEvents(day, day));
  getDb()
    .insert(schema.dailyStats)
    .values({ day, ...s })
    .onConflictDoUpdate({ target: schema.dailyStats.day, set: s })
    .run();
}

export function rollupRange(fromDay: string, toDay: string): number {
  const days = daysBetween(fromDay, toDay);
  for (const d of days) rollupDay(d);
  return days.length;
}

/** Roll up every day that has events but no daily_stats row, plus yesterday and today. */
export function rollupPending(): number {
  const raw = getRaw();
  const missing = raw
    .prepare(`SELECT DISTINCT e.day AS day FROM events e LEFT JOIN daily_stats d ON d.day = e.day WHERE d.day IS NULL`)
    .all() as { day: string }[];
  const today = todayEat();
  const days = new Set([...missing.map((m) => m.day), today, addDays(today, -1)]);
  for (const d of days) rollupDay(d);
  return days.size;
}

export function onlineNow(minutes = 5): number {
  const since = Math.floor(Date.now() / 1000) - minutes * 60;
  const r = getRaw().prepare('SELECT COUNT(DISTINCT visitor_id) AS n FROM events WHERE ts >= ?').get(since) as { n: number };
  return r.n;
}

export type DashRange = { from: string; to: string };

export function resolveRange(preset: string | undefined, from?: string, to?: string): DashRange {
  const today = todayEat();
  const ymd = /^\d{4}-\d{2}-\d{2}$/;
  if (from && to && ymd.test(from) && ymd.test(to) && from <= to) {
    const clampedFrom = daysBetween(from, to).length > 366 ? addDays(to, -365) : from;
    return { from: clampedFrom, to: to > today ? today : to };
  }
  const n = preset === '7' ? 7 : preset === '90' ? 90 : 30;
  return { from: addDays(today, -(n - 1)), to: today };
}

export type Dashboard = ReturnType<typeof getDashboard>;

export function getDashboard(range: DashRange) {
  const db = getDb();
  const days = daysBetween(range.from, range.to);
  const prevTo = addDays(range.from, -1);
  const prevFrom = addDays(prevTo, -(days.length - 1));

  const events = loadEvents(range.from, range.to);
  const prevEvents = loadEvents(prevFrom, prevTo);
  const kpis = computeKpis(events);
  const prev = computeKpis(prevEvents);

  const newEnquiries = db
    .select({ n: sql<number>`count(*)` })
    .from(schema.enquiries)
    .where(and(between(schema.enquiries.createdAt, dayStartTs(range.from), dayStartTs(addDays(range.to, 1)) - 1)))
    .get()?.n ?? 0;
  const prevEnquiries = db
    .select({ n: sql<number>`count(*)` })
    .from(schema.enquiries)
    .where(and(between(schema.enquiries.createdAt, dayStartTs(prevFrom), dayStartTs(addDays(prevTo, 1)) - 1)))
    .get()?.n ?? 0;

  // Time series come from the nightly roll-up for complete days, and live events for any day without a row.
  const stats = new Map(db.select().from(schema.dailyStats).where(between(schema.dailyStats.day, range.from, range.to)).all().map((r) => [r.day, r]));
  const today = todayEat();
  const live = dailySeries(events, days);
  const series = live.map((p) => {
    const r = stats.get(p.day);
    return r && p.day !== today ? { day: p.day, visitors: r.visitors, pageviews: r.pageviews } : p;
  });

  const stats2 = productStats(events);
  const productRows = db.select({ id: schema.products.id, name: schema.products.name, categoryId: schema.products.categoryId, archived: schema.products.archived }).from(schema.products).all();
  // Top-products widgets only list live products. Archived ones stay in order history and category sales.
  const nameById = new Map(productRows.filter((p) => !p.archived).map((p) => [p.id, p.name]));
  const categoryRows = db.select().from(schema.categories).all();
  const catName = new Map(categoryRows.map((c) => [c.id, c.name]));
  const catByProduct = new Map(productRows.map((p) => [p.id, p.categoryId != null ? catName.get(p.categoryId) ?? 'Uncategorised' : 'Uncategorised']));

  const catSales = new Map<string, number>();
  const itemsSold = db
    .select({ productId: schema.orderItems.productId, qty: schema.orderItems.qty, price: schema.orderItems.price, createdAt: schema.orders.createdAt, status: schema.orders.status })
    .from(schema.orderItems)
    .innerJoin(schema.orders, eq(schema.orders.id, schema.orderItems.orderId))
    .where(between(schema.orders.createdAt, dayStartTs(range.from), dayStartTs(addDays(range.to, 1)) - 1))
    .all();
  for (const it of itemsSold) {
    if (it.status === 'cancelled' || it.productId == null) continue;
    const c = catByProduct.get(it.productId) ?? 'Uncategorised';
    catSales.set(c, (catSales.get(c) ?? 0) + it.qty * it.price);
  }

  const recentOrders = db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(6).all();
  const recentEnquiries = db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).limit(6).all();
  const lowStock = db
    .select({ id: schema.products.id, name: schema.products.name, stock: schema.products.stock })
    .from(schema.products)
    .where(and(eq(schema.products.published, true), eq(schema.products.archived, false), eq(schema.products.trackStock, true), lt(schema.products.stock, 6)))
    .orderBy(schema.products.stock)
    .limit(8)
    .all();

  return {
    range,
    days: days.length,
    kpis: { ...kpis, enquiries: newEnquiries },
    deltas: {
      visitors: delta(kpis.visitors, prev.visitors),
      pageviews: delta(kpis.pageviews, prev.pageviews),
      pagesPerSession: delta(kpis.pagesPerSession, prev.pagesPerSession),
      bounceRate: delta(kpis.bounceRate, prev.bounceRate),
      orders: delta(kpis.orders, prev.orders),
      revenue: delta(kpis.revenue, prev.revenue),
      conversionRate: delta(kpis.conversionRate, prev.conversionRate),
      calls: delta(kpis.calls, prev.calls),
      whatsapp: delta(kpis.whatsapp, prev.whatsapp),
      enquiries: delta(newEnquiries, prevEnquiries),
    },
    series,
    topPages: topPages(events),
    sources: trafficSources(events),
    devices: deviceSplit(events),
    browsers: browserSplit(events),
    heatmap: hourWeekdayHeatmap(events),
    products: stats2.filter((s) => nameById.has(s.productId)).slice(0, 8).map((s) => ({ name: nameById.get(s.productId) ?? `Product ${s.productId}`, views: s.views, addToCart: s.addToCart })),
    funnel: funnel(events),
    categorySales: [...catSales].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8),
    recentOrders,
    recentEnquiries,
    lowStock,
    online: onlineNow(),
  };
}
