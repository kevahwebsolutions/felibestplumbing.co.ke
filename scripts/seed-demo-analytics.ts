import './load-env';
import { eq, like } from 'drizzle-orm';
import { getDb, getRaw, schema } from '../src/db';
import { addDays, dayStartTs, eatParts } from '../src/lib/analytics/aggregate';
import { SERVICES } from '../src/data/services';
import { POSTS } from '../src/data/blog';
import { rollupRange, todayEat } from '../src/lib/server/analytics';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run: seed:demo-analytics must never run when NODE_ENV=production.');
  process.exit(1);
}

const db = getDb();
const raw = getRaw();

if (process.argv.includes('--clear')) {
  raw.prepare("DELETE FROM events WHERE session_id LIKE 'demo%'").run();
  db.delete(schema.orders).where(like(schema.orders.ref, 'DEMO-%')).run();
  db.delete(schema.enquiries).where(like(schema.enquiries.notes, 'Demo data%')).run();
  raw.prepare('DELETE FROM daily_stats').run();
  console.log('Removed demo analytics, orders and enquiries.');
  process.exit(0);
}

// Deterministic PRNG so the demo looks the same on every machine.
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20261117);
const pick = <T,>(items: [T, number][]): T => {
  const total = items.reduce((n, [, w]) => n + w, 0);
  let r = rnd() * total;
  for (const [v, w] of items) if ((r -= w) <= 0) return v;
  return items[items.length - 1]![0];
};

const products = db.select({ id: schema.products.id, price: schema.products.price, salePrice: schema.products.salePrice, name: schema.products.name }).from(schema.products).where(eq(schema.products.published, true)).all();
if (products.length === 0) {
  console.error('No published products found. Run npm run db:seed first.');
  process.exit(1);
}

const servicePaths = SERVICES.map((s) => `/services/${s.slug}`);
const blogPaths = POSTS.map((p) => `/blog/${p.slug}`);
const BROWSERS: [string, number][] = [['Chrome', 62], ['Safari', 18], ['Samsung Internet', 7], ['Firefox', 4], ['Edge', 5], ['Opera', 4]];
const SOURCES: [string, number][] = [['', 34], ['Search', 41], ['Social', 17], ['Referral', 8]];
const HOURS: [number, number][] = Array.from({ length: 24 }, (_, h) => [h, h < 5 ? 1 : h < 7 ? 3 : h < 9 ? 8 : h < 12 ? 12 : h < 14 ? 11 : h < 18 ? 12 : h < 22 ? 14 : 4]);

const insert = raw.prepare(
  `INSERT INTO events (ts, day, hour, weekday, visitor_id, session_id, type, path, source, device, browser, os, country, product_id, value)
   VALUES (@ts, @day, @hour, @weekday, @visitorId, @sessionId, @type, @path, @source, @device, @browser, @os, @country, @productId, @value)`,
);
const insertOrder = raw.prepare(
  `INSERT INTO orders (ref, customer_name, phone, email, area, address, notes, payment_method, status, subtotal, delivery_fee, total, internal_notes, created_at)
   VALUES (?, ?, ?, '', ?, ?, 'Demo data', ?, ?, ?, ?, ?, 'Demo data', ?)`,
);
const insertItem = raw.prepare('INSERT INTO order_items (order_id, product_id, name, sku, price, qty) VALUES (?, ?, ?, ?, ?, ?)');
const insertEnquiry = raw.prepare(
  `INSERT INTO enquiries (kind, name, phone, email, service, preferred_date, message, status, notes, forwarded, created_at) VALUES (?, ?, ?, '', ?, '', ?, ?, 'Demo data', 1, ?)`,
);

const NAMES = ['Amina W.', 'Brian O.', 'Cynthia M.', 'David K.', 'Esther N.', 'Felix A.', 'Grace T.', 'Hassan J.', 'Irene C.', 'James R.'];
const AREAS = ['Westlands', 'Kilimani', 'Karen', 'Embakasi', 'Kasarani', 'Ruaka', 'South B and C', 'Rongai'];
const STATUSES = ['delivered', 'delivered', 'delivered', 'confirmed', 'out_for_delivery', 'new', 'cancelled'] as const;

const today = todayEat();
const first = addDays(today, -89);
let events = 0, orders = 0, enquiries = 0, sid = 0;

raw.transaction(() => {
  raw.prepare("DELETE FROM events WHERE session_id LIKE 'demo%'").run();
  raw.prepare("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE ref LIKE 'DEMO-%')").run();
  raw.prepare("DELETE FROM orders WHERE ref LIKE 'DEMO-%'").run();
  raw.prepare("DELETE FROM enquiries WHERE notes LIKE 'Demo data%'").run();

  for (let d = 0; d < 90; d++) {
    const day = addDays(first, d);
    const weekday = eatParts(dayStartTs(day) + 7200).weekday;
    const growth = 1 + d / 140;
    const weekdayFactor = [1.05, 1.1, 1.05, 1.0, 0.95, 0.75, 0.7][weekday]!;
    const visitors = Math.round((55 + rnd() * 35) * growth * weekdayFactor);
    const isToday = day === today;
    for (let v = 0; v < visitors; v++) {
      const hour = pick(HOURS);
      const nowSec = Math.floor(Date.now() / 1000);
      let ts = dayStartTs(day) + hour * 3600 + Math.floor(rnd() * 3600);
      if (isToday && ts > nowSec) ts = nowSec - Math.floor(rnd() * 4 * 3600);
      const device = pick<'mobile' | 'desktop' | 'tablet'>([['mobile', 70], ['desktop', 25], ['tablet', 5]]);
      const browser = pick(BROWSERS);
      const os = device === 'desktop' ? pick([['Windows', 70], ['macOS', 22], ['Linux', 8]]) : pick([['Android', 80], ['iOS', 20]]);
      const visitorId = `demo${d}x${v}`;
      const sessionId = `demo${++sid}`;
      const source = pick(SOURCES);
      const base = { day, hour: 0, weekday, visitorId, sessionId, source: '', device, browser, os, country: rnd() < 0.93 ? 'KE' : pick([['UG', 3], ['TZ', 2], ['US', 2], ['GB', 1]]), productId: null as number | null, value: null as number | null };
      const emit = (type: string, path: string, extra: Partial<typeof base> = {}, offset = 0) => {
        const t = ts + offset;
        const p = eatParts(t);
        insert.run({ ...base, ...extra, ts: t, day: p.day, hour: p.hour, weekday: p.weekday, type, path });
        events++;
      };
      const landing = pick<string>([['/', 30], ['/services', 12], [pickService(), 20], ['/shop', 14], [pickBlog(), 10], ['/pricing', 6], ['/contact', 8]]);
      emit('pageview', landing, { source });
      let t = 20;
      const extraPages = rnd() < 0.42 ? 1 + Math.floor(rnd() * 4) : 0;
      let wentShop = landing === '/shop';
      for (let i = 0; i < extraPages; i++) {
        const next = pick<string>([['/services', 10], [pickService(), 18], ['/shop', 14], ['/contact', 8], ['/pricing', 6], ['/gallery', 6], ['/about', 4], [pickBlog(), 6]]);
        if (next === '/shop') wentShop = true;
        emit('pageview', next, {}, t);
        t += 25 + Math.floor(rnd() * 60);
      }
      if (rnd() < (device === 'mobile' ? 0.085 : 0.03)) emit('call_click', landing, {}, t++);
      if (rnd() < 0.07) emit('whatsapp_click', landing, {}, t++);
      if (rnd() < 0.035) {
        emit('form_submit', '/contact', {}, t++);
        enquiries++;
        insertEnquiry.run(pick<'booking' | 'enquiry'>([['booking', 6], ['enquiry', 4]]), pick(NAMES.map((n) => [n, 1] as [string, number])), '+2547' + String(10000000 + Math.floor(rnd() * 89999999)), pick(SERVICES.map((s) => [s.title, 1] as [string, number])), 'Demo enquiry', pick<'new' | 'contacted' | 'done'>([['new', 3], ['contacted', 3], ['done', 5]]), ts);
      }
      if (wentShop || rnd() < 0.05) {
        const viewed = products[Math.floor(rnd() * products.length)]!;
        emit('product_view', `/shop/${viewed.id}`, { productId: viewed.id }, t);
        t += 30;
        if (rnd() < 0.3) {
          emit('add_to_cart', `/shop/${viewed.id}`, { productId: viewed.id }, t);
          t += 20;
          if (rnd() < 0.5) {
            emit('checkout_start', '/checkout', {}, t);
            t += 60;
            if (rnd() < 0.55) {
              const qty = 1 + Math.floor(rnd() * 2);
              const unit = viewed.salePrice && viewed.salePrice < viewed.price ? viewed.salePrice : viewed.price;
              const subtotal = unit * qty;
              const delivery = subtotal >= 15000 ? 0 : 500;
              emit('order_placed', '/checkout', { productId: viewed.id, value: subtotal + delivery }, t);
              const status = pick(STATUSES.map((s) => [s, 1] as [typeof STATUSES[number], number]));
              const info = insertOrder.run(
                `DEMO-${String(orders + 1).padStart(5, '0')}`, pick(NAMES.map((n) => [n, 1] as [string, number])),
                '+2547' + String(10000000 + Math.floor(rnd() * 89999999)), pick(AREAS.map((a) => [a, 1] as [string, number])), 'Demo address',
                pick<'pay_on_delivery' | 'whatsapp'>([['pay_on_delivery', 3], ['whatsapp', 2]]), status, subtotal, delivery, subtotal + delivery, ts + t,
              );
              insertItem.run(info.lastInsertRowid, viewed.id, viewed.name, '', unit, qty);
              orders++;
            }
          }
        }
      }
    }
  }
})();

function pickService() { return servicePaths[Math.floor(rnd() * servicePaths.length)]!; }
function pickBlog() { return blogPaths[Math.floor(rnd() * blogPaths.length)]!; }

const rolled = rollupRange(first, today);
console.log(`Demo data created: ${events} events, ${orders} orders, ${enquiries} enquiries over 90 days (${rolled} days rolled up).`);
console.log('Remove it with: npm run seed:demo-analytics -- --clear');
