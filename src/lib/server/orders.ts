import { desc, eq, inArray, sql } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { getDb, schema } from '@/db';
import { deliveryFor, effectivePrice } from '@/lib/cart-math';
import { normalizePhone, placeOrderSchema } from '@/lib/schemas';
import { getSettings } from './settings';
import { getPaymentProvider, type PaymentInitiation } from './payments';

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

  const lines: { productId: number; name: string; sku: string; price: number; qty: number }[] = [];
  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p || !p.published) throw new OrderError('One of the items in your cart is no longer available.');
    if (p.stock < it.qty) throw new OrderError(`${p.name} has only ${p.stock} left in stock.`);
    lines.push({ productId: p.id, name: p.name, sku: p.sku, price: effectivePrice(p.price, p.salePrice), qty: it.qty });
  }
  const settings = getSettings();
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const deliveryFee = deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold);
  const total = subtotal + deliveryFee;

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
      tx.update(schema.products).set({ stock: sql`${schema.products.stock} - ${l.qty}` }).where(eq(schema.products.id, l.productId)).run();
    }
  });

  const provider = getPaymentProvider(customer.paymentMethod);
  const payment = await provider.initiate(
    { ref, total, customerName: customer.name, phone: normalizePhone(customer.phone), lines },
    { whatsappNumber: settings.whatsappNumber },
  );
  return { ref, total, payment };
}

export function getOrderByRef(ref: string) {
  const db = getDb();
  const order = db.select().from(schema.orders).where(eq(schema.orders.ref, ref)).get();
  if (!order) return null;
  const items = db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id)).all();
  return { order, items };
}

export function listOrders() {
  return getDb().select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).all();
}

export function getOrderById(id: number) {
  const db = getDb();
  const order = db.select().from(schema.orders).where(eq(schema.orders.id, id)).get();
  if (!order) return null;
  const items = db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id)).all();
  return { order, items };
}
