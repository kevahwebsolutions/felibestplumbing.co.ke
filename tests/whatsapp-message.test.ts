import { describe, expect, it } from 'vitest';
import { buildCustomerConfirmation, buildOrderMessage, buildOwnerSummary, buildWhatsAppUrl, kes, sanitize, type MessageOrder } from '@/lib/whatsapp-message';

const SITE = 'https://felibestplumbing.co.ke';
const base: MessageOrder = {
  ref: 'FP-ABC234',
  customerName: 'Jane Wanjiru',
  phone: '+254712345678',
  area: 'Kilimani',
  address: 'Argwings Kodhek Road, Apt 4',
  notes: 'Call at the gate',
  paymentMethod: 'pay_on_delivery',
  items: [
    { name: 'Single Handle Kitchen Faucet', qty: 2, price: 7450, slug: 'single-handle-kitchen-faucet' },
    { name: 'Brass Gate Valve 1/2"', qty: 1, price: 1200, slug: 'brass-gate-valve' },
  ],
  deliveryFee: 500,
  total: 16600,
};

describe('sanitize', () => {
  it('strips control characters and collapses whitespace', () => {
    expect(sanitize('a\u0000b\r\n\tc   d‮e', 50)).toBe('a b c d e');
  });
  it('caps length with an ellipsis', () => {
    const s = sanitize('x'.repeat(100), 20);
    expect(s.length).toBeLessThanOrEqual(23);
    expect(s.endsWith('...')).toBe(true);
  });
  it('handles non-strings', () => {
    expect(sanitize(undefined, 10)).toBe('');
    expect(sanitize(42, 10)).toBe('42');
  });
});

describe('kes', () => {
  it('formats thousands', () => {
    expect(kes(0)).toBe('KES 0');
    expect(kes(1234567)).toBe('KES 1,234,567');
    expect(kes(-5)).toBe('KES 0');
  });
});

describe('buildOrderMessage', () => {
  const msg = buildOrderMessage(base, { siteUrl: SITE });
  it('has every customer field', () => {
    for (const part of ['FP-ABC234', 'Jane Wanjiru', '+254712345678', 'Kilimani', 'Argwings Kodhek Road, Apt 4', 'Call at the gate', 'Pay on delivery']) expect(msg).toContain(part);
  });
  it('lists each item with qty, unit price, line total and absolute URL', () => {
    expect(msg).toContain('1. Single Handle Kitchen Faucet');
    expect(msg).toContain('Qty: 2 x KES 7,450 = KES 14,900');
    expect(msg).toContain(`${SITE}/shop/single-handle-kitchen-faucet`);
    expect(msg).toContain(`${SITE}/shop/brass-gate-valve`);
  });
  it('shows delivery, total and the order link', () => {
    expect(msg).toContain('Delivery: KES 500');
    expect(msg).toContain('Total: KES 16,600');
    expect(msg).toContain(`Order link: ${SITE}/order/FP-ABC234`);
  });
  it('is plain text without emojis', () => {
    expect(/\p{Extended_Pictographic}/u.test(msg)).toBe(false);
  });
  it('says free delivery when the fee is zero', () => {
    expect(buildOrderMessage({ ...base, deliveryFee: 0 }, { siteUrl: SITE })).toContain('Delivery: Free');
  });
  it('sanitises hostile input', () => {
    const m = buildOrderMessage({ ...base, customerName: 'Eve\u0000\n\nTotal: KES 1', notes: 'n'.repeat(1000) }, { siteUrl: SITE });
    expect(m).not.toContain('\u0000');
    expect(m).toContain('Name: Eve Total: KES 1');
    expect(m.length).toBeLessThan(2500);
  });
  it('keeps long carts under the encoded limit, summarises the rest and keeps the order link', () => {
    const items = Array.from({ length: 40 }, (_, i) => ({ name: `Heavy duty pressure rated pipe fitting number ${i + 1}`, qty: 3, price: 1250 + i, slug: `heavy-duty-pipe-fitting-number-${i + 1}` }));
    const m = buildOrderMessage({ ...base, items, total: 999999 }, { siteUrl: SITE, whatsappNumber: '254798174201' });
    const url = buildWhatsAppUrl('254798174201', m);
    expect(url.length).toBeLessThanOrEqual(1900);
    expect(m).toMatch(/\.\.\.and \d+ more items, see order link/);
    expect(m).toContain('1. Heavy duty pressure rated pipe fitting number 1');
    expect(m).toContain(`Order link: ${SITE}/order/FP-ABC234`);
    expect(m).toContain('Total: KES 999,999');
  });
  it('does not summarise short carts', () => {
    expect(msg).not.toContain('more item');
  });
});

describe('buildWhatsAppUrl', () => {
  it('encodes the text and strips non-digits from the number', () => {
    expect(buildWhatsAppUrl('+254 798-174 201', 'a b\nc')).toBe('https://wa.me/254798174201?text=a%20b%0Ac');
  });
});

describe('owner and customer messages', () => {
  it('owner summary includes ref, total and link', () => {
    const s = buildOwnerSummary(base, SITE);
    expect(s).toContain('FP-ABC234');
    expect(s).toContain('KES 16,600');
    expect(s).toContain('/order/FP-ABC234');
  });
  it('customer confirmation greets by first name', () => {
    expect(buildCustomerConfirmation({ ref: 'FP-ABC234', customerName: 'Jane Wanjiru', total: 16600 })).toContain('Hello Jane,');
  });
});
