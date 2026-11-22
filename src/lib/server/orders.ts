import { desc, eq, inArray, sql } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { getDb, schema } from '@/db';
import { deliveryFor, effectivePrice } from '@/lib/cart-math';
import { normalizePhone, placeOrderSchema } from '@/lib/schemas';
import { getSettings } from './settings';
import { getPaymentProvider, type PaymentInitiation } from './payments';
import { getNotifiers, WhatsAppLinkNotifier, type NotifyOrder } from './notifiers';
import { SITE } from '@/lib/site';
import { buildOrderMessage } from '@/lib/whatsapp-message';

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function newOrderRef(): string {
  const bytes = randomBytes(6);
  let s = '';
  for (const b of bytes) s += REF_ALPHABET[b % REF_ALPHABET.length];
  return `FP-${s}`;
}

export class OrderError extends Error {}

export type PlacedOrder = { ref: string; total: number; payment: PaymentInitiation };

/** Prices are always re-read from the database. The browser only sends product ids and quantities. */
export async function placeOrder(input: unknown): Promise<PlacedOrder> {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) throw new OrderError(parsed.error.issues[0]?.message ?? 'Invalid order');
  const { customer, items } = parsed.data;
  const db = getDb();
  const ids = [...new Set(items.map((i) => i.productId))];
  const products = db.select().from(schema.products).where(inArray(schema.products.id, ids)).all();
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines: { productId: number; name: string; sku: string; slug: string; price: number; qty: number }[] = [];
  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p || !p.published || p.archived) throw new OrderError('One of the items in your cart is no longer available.');
    if (p.trackStock && p.stock < it.qty) throw new OrderError(`${p.name} has only ${p.stock} left in stock.`);
    lines.push({ productId: p.id, name: p.name, sku: p.sku, slug: p.slug, price: effectivePrice(p.price, p.salePrice), qty: it.qty });
  }
  const settings = getSettings();
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const deliveryFee = deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold);
  const total = subtotal + deliveryFee;

  const tracked = new Set(products.filter((p) => p.trackStock).map((p) => p.id));
  let ref = newOrderRef();
  for (let i = 0; i < 5 && db.select({ id: schema.orders.id }).from(schema.orders).where(eq(schema.orders.ref, ref)).get(); i++) ref = newOrderRef();

  db.transaction((tx) => {
    const order = tx
      .insert(schema.orders)
      .values({
        ref, customerName: customer.name, phone: normalizePhone(customer.phone), email: customer.email, area: customer.area,
        address: customer.address, notes: customer.notes, paymentMethod: customer.paymentMethod, subtotal, deliveryFee, total,
      })
      .returning({ id: schema.orders.id })
      .get();
    for (const l of lines) {
      tx.insert(schema.orderItems).values({ orderId: order.id, productId: l.productId, name: l.name, sku: l.sku, price: l.price, qty: l.qty }).run();
      if (tracked.has(l.productId)) tx.update(schema.products).set({ stock: sql`${schema.products.stock} - ${l.qty}` }).where(eq(schema.products.id, l.productId)).run();
    }
  });

  const provider = getPaymentProvider(customer.paymentMethod);
  const payment = await provider.initiate(
    { ref, total, customerName: customer.name, phone: normalizePhone(customer.phone), lines },
    { whatsappNumber: settings.whatsappNumber },
  );

  // Every order is sent to the business WhatsApp: the customer's browser is redirected to this link.
  const first = lines[0];
  const notifyOrder: NotifyOrder = {
    ref, customerName: customer.name, phone: normalizePhone(customer.phone), area: customer.area, address: customer.address,
    notes: customer.notes, paymentMethod: customer.paymentMethod, deliveryFee, total,
    items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price, slug: l.slug })),
    firstProductSlug: first?.slug ?? null,
  };
  const ctx = { siteUrl: SITE.url, whatsappNumber: settings.whatsappNumber };
  payment.redirectUrl = new WhatsAppLinkNotifier().customerLink(notifyOrder, ctx);
  // Optional server-side send to the owner. Never awaited: checkout must not wait for, or fail because of, Meta.
  void notifyOwner(ref, notifyOrder, ctx);
  return { ref, total, payment };
}

/** Runs every server-side notifier (Cloud API only) and records the outcome on the order. Never throws. */
export async function notifyOwner(ref: string, order: NotifyOrder, ctx: { siteUrl: string; whatsappNumber: string }): Promise<void> {
  try {
    for (const n of getNotifiers()) {
      if (n.id === 'whatsapp-link') continue;
      const r = await n.notify(order, ctx);
      const db = getDb();
      if (r.status === 'sent') {
        db.update(schema.orders).set({ whatsappNotifiedAt: Math.floor(Date.now() / 1000), whatsappNotifyError: null }).where(eq(schema.orders.ref, ref)).run();
      } else if (r.status === 'failed') {
        db.update(schema.orders).set({ whatsappNotifyError: (r.error ?? 'failed').slice(0, 200) }).where(eq(schema.orders.ref, ref)).run();
      }
      console.info(`order ${ref}: ${n.id} ${r.status}`);
    }
  } catch {
    console.error(`order ${ref}: notifier error`);
  }
}

type OrderRow = typeof schema.orders.$inferSelect;
type ItemRow = typeof schema.orderItems.$inferSelect;

/** The exact message the customer's WhatsApp opens with, rebuilt from the saved order. */
export function orderMessageText(order: OrderRow, items: (ItemRow & { slug?: string | null })[]): string {
  return buildOrderMessage(
    {
      ref: order.ref, customerName: order.customerName, phone: order.phone, area: order.area, address: order.address, notes: order.notes,
      paymentMethod: order.paymentMethod, deliveryFee: order.deliveryFee, total: order.total,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, slug: i.slug ?? null })),
    },
    { siteUrl: SITE.url, whatsappNumber: getSettings().whatsappNumber },
  );
}

function withSlugs(items: ItemRow[]) {
  const ids = items.map((i) => i.productId).filter((x): x is number => x != null);
  const slugs = new Map(ids.length ? getDb().select({ id: schema.products.id, slug: schema.products.slug }).from(schema.products).where(inArray(schema.products.id, ids)).all().map((p) => [p.id, p.slug]) : []);
  return items.map((i) => ({ ...i, slug: i.productId != null ? slugs.get(i.productId) ?? null : null }));
}

export function getOrderByRef(ref: string) {
  const db = getDb();
  const order = db.select().from(schema.orders).where(eq(schema.orders.ref, ref)).get();
  if (!order) return null;
  const items = withSlugs(db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id)).all());
  return { order, items };
}

export function listOrders() {
  return getDb().select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).all();
}

export function getOrderById(id: number) {
  const db = getDb();
  const order = db.select().from(schema.orders).where(eq(schema.orders.id, id)).get();
  if (!order) return null;
  const items = withSlugs(db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id)).all());
  return { order, items };
}
