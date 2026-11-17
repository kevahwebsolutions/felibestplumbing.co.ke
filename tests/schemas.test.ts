import { describe, expect, it } from 'vitest';
import { bookingSchema, checkoutSchema, normalizePhone, passwordChangeSchema, placeOrderSchema, productSchema, trackSchema } from '@/lib/schemas';

const booking = { name: 'Amina', phone: '0798 174 201', service: 'Emergency plumbing' };

describe('booking schema', () => {
  it('accepts valid Kenyan numbers in several formats', () => {
    for (const p of ['0798174201', '0798 174 201', '+254798174201', '254798174201', '0112345678']) {
      expect(bookingSchema.safeParse({ ...booking, phone: p }).success, p).toBe(true);
    }
  });
  it('rejects bad phones, short names and missing service', () => {
    expect(bookingSchema.safeParse({ ...booking, phone: '12345' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...booking, name: 'A' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...booking, service: '' }).success).toBe(false);
  });
  it('rejects a filled honeypot', () => {
    expect(bookingSchema.safeParse({ ...booking, website: 'http://spam' }).success).toBe(false);
  });
  it('normalises phone numbers', () => {
    expect(normalizePhone('0798 174 201')).toBe('+254798174201');
    expect(normalizePhone('254798174201')).toBe('+254798174201');
    expect(normalizePhone('+254798174201')).toBe('+254798174201');
  });
});

describe('checkout and orders', () => {
  const customer = { name: 'Brian', phone: '0712345678', area: 'Karen', address: 'Karen Road, near the market', paymentMethod: 'pay_on_delivery' as const };
  it('validates checkout', () => {
    expect(checkoutSchema.safeParse(customer).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...customer, paymentMethod: 'card' }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...customer, address: 'x' }).success).toBe(false);
  });
  it('rejects empty carts and absurd quantities', () => {
    expect(placeOrderSchema.safeParse({ customer, items: [] }).success).toBe(false);
    expect(placeOrderSchema.safeParse({ customer, items: [{ productId: 1, qty: 500 }] }).success).toBe(false);
    expect(placeOrderSchema.safeParse({ customer, items: [{ productId: 1, qty: 2 }] }).success).toBe(true);
  });
});

describe('product schema', () => {
  const base = { name: 'Tap', categoryId: null, price: 1000, salePrice: null, stock: 3 };
  it('requires the sale price to be lower than the price', () => {
    expect(productSchema.safeParse({ ...base, salePrice: 900 }).success).toBe(true);
    expect(productSchema.safeParse({ ...base, salePrice: 1000 }).success).toBe(false);
  });
  it('rejects negative prices', () => {
    expect(productSchema.safeParse({ ...base, price: -1 }).success).toBe(false);
  });
});

describe('password and tracking schemas', () => {
  it('enforces password strength and confirmation', () => {
    expect(passwordChangeSchema.safeParse({ current: 'a', next: 'Str0ngPassw0rd', confirm: 'Str0ngPassw0rd' }).success).toBe(true);
    expect(passwordChangeSchema.safeParse({ current: 'a', next: 'weak', confirm: 'weak' }).success).toBe(false);
    expect(passwordChangeSchema.safeParse({ current: 'a', next: 'Str0ngPassw0rd', confirm: 'different' }).success).toBe(false);
  });
  it('accepts only known tracking events with absolute paths', () => {
    expect(trackSchema.safeParse({ type: 'pageview', path: '/shop' }).success).toBe(true);
    expect(trackSchema.safeParse({ type: 'hack', path: '/shop' }).success).toBe(false);
    expect(trackSchema.safeParse({ type: 'pageview', path: 'shop' }).success).toBe(false);
  });
});
