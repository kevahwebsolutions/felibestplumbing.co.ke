/**
 * Pure helpers that build the WhatsApp order message and the wa.me link.
 * No imports from server code so the same module runs in the browser, on the server and in tests.
 */

export type WhatsAppPayment = 'pay_on_delivery' | 'whatsapp';

export type MessageItem = {
  name: string;
  qty: number;
  /** Unit price in KES. */
  price: number;
  /** Public product slug, used for the absolute product URL. */
  slug?: string | null;
};

export type MessageOrder = {
  ref: string;
  customerName: string;
  phone: string;
  area: string;
  address: string;
  notes?: string;
  paymentMethod: WhatsAppPayment;
  items: MessageItem[];
  deliveryFee: number;
  total: number;
};

/** wa.me links break above roughly 2000 characters, so stay well under. */
export const MAX_ENCODED_LENGTH = 1900;

const PAYMENT_LABEL: Record<WhatsAppPayment, string> = {
  pay_on_delivery: 'Pay on delivery',
  whatsapp: 'Pay via WhatsApp (we will confirm payment)',
};

/** Strip control characters, collapse whitespace and cap the length. Never throws. */
export function sanitize(value: unknown, max: number): string {
  const text = typeof value === 'string' ? value : value == null ? '' : String(value);
  const cleaned = text.replace(/[\p{Cc}\p{Cf}]+/gu, ' ').replace(/\s+/g, ' ').trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1).trimEnd()}...` : cleaned;
}

/** "KES 12,500" without relying on the runtime locale data. */
export function kes(n: number): string {
  const v = Math.max(0, Math.round(Number.isFinite(n) ? n : 0));
  return `KES ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function productUrl(siteUrl: string, slug: string): string {
  return `${siteUrl.replace(/\/$/, '')}/shop/${encodeURIComponent(slug)}`;
}

export function orderUrl(siteUrl: string, ref: string): string {
  return `${siteUrl.replace(/\/$/, '')}/order/${encodeURIComponent(ref)}`;
}

function itemBlock(i: MessageItem, n: number, siteUrl: string): string {
  const qty = Math.max(1, Math.round(i.qty));
  const lines = [`${n}. ${sanitize(i.name, 80)}`, `   Qty: ${qty} x ${kes(i.price)} = ${kes(i.price * qty)}`];
  if (i.slug) lines.push(`   ${productUrl(siteUrl, i.slug)}`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the plain-text order message. When the encoded wa.me link would be longer than `maxEncoded`,
 * the first items are listed in full, the rest are summarised, and the order link is always kept.
 */
export function buildOrderMessage(order: MessageOrder, opts: { siteUrl: string; maxEncoded?: number; whatsappNumber?: string }): string {
  const max = opts.maxEncoded ?? MAX_ENCODED_LENGTH;
  const base = `https://wa.me/${(opts.whatsappNumber ?? '254798174201').replace(/\D/g, '')}?text=`;
  const head = [
    `New order ${sanitize(order.ref, 20)}`,
    '',
    `Name: ${sanitize(order.customerName, 80)}`,
    `Phone: ${sanitize(order.phone, 20)}`,
    `Delivery area: ${sanitize(order.area, 80)}`,
    `Address: ${sanitize(order.address, 200)}`,
  ];
  const notes = sanitize(order.notes ?? '', 300);
  if (notes) head.push(`Notes: ${notes}`);
  head.push(`Payment: ${PAYMENT_LABEL[order.paymentMethod]}`, '', 'Items:');

  const items = order.items;
  const tail = (omitted: number) => [
    ...(omitted > 0 ? [`...and ${omitted} more item${omitted === 1 ? '' : 's'}, see order link`] : []),
    '',
    `Delivery: ${order.deliveryFee === 0 ? 'Free' : kes(order.deliveryFee)}`,
    `Total: ${kes(order.total)}`,
    '',
    `Order link: ${orderUrl(opts.siteUrl, order.ref)}`,
  ];
  const compose = (shown: number) => [...head, ...items.slice(0, shown).map((it, idx) => itemBlock(it, idx + 1, opts.siteUrl)), ...tail(items.length - shown)].join('\n');

  for (let shown = items.length; shown > 1; shown--) {
    const msg = compose(shown);
    if (base.length + encodeURIComponent(msg).length <= max) return msg;
  }
  return compose(Math.min(1, items.length));
}

/** Short owner-facing summary for the Cloud API caption or template parameter. */
export function buildOwnerSummary(order: MessageOrder, siteUrl: string): string {
  const lines = order.items.slice(0, 6).map((i) => `${Math.max(1, Math.round(i.qty))} x ${sanitize(i.name, 60)}`);
  const more = order.items.length > 6 ? `, and ${order.items.length - 6} more` : '';
  return `Order ${order.ref}: ${lines.join(', ')}${more}. Total ${kes(order.total)}. ${sanitize(order.customerName, 60)}, ${sanitize(order.phone, 20)}, ${sanitize(order.area, 60)}. ${orderUrl(siteUrl, order.ref)}`;
}

/** Prefilled confirmation the admin sends to the customer. */
export function buildCustomerConfirmation(order: { ref: string; customerName: string; total: number }): string {
  const first = sanitize(order.customerName, 80).split(' ')[0] || 'there';
  return `Hello ${first}, this is Felibest Plumbing. We have received your order ${order.ref} (total ${kes(order.total)}). We will confirm delivery details shortly. Thank you.`;
}

/** Digits-only international number for a wa.me link to a customer, from a stored +254 phone. */
export function customerChatUrl(phone: string, message: string): string {
  return buildWhatsAppUrl(phone, message);
}
