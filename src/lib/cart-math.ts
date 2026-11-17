export type CartLine = { productId: number; price: number; qty: number };

export const MAX_QTY = 99;

export function clampQty(qty: number, stock?: number): number {
  const q = Number.isFinite(qty) ? Math.floor(qty) : 1;
  const max = typeof stock === 'number' && stock > 0 ? Math.min(stock, MAX_QTY) : MAX_QTY;
  return Math.min(Math.max(q, 1), max);
}

export function lineTotal(line: CartLine): number {
  return line.price * line.qty;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

/** Delivery is free once the subtotal reaches the threshold. A threshold of 0 disables free delivery. */
export function deliveryFor(subtotal: number, fee: number, freeThreshold: number): number {
  if (subtotal <= 0) return 0;
  if (freeThreshold > 0 && subtotal >= freeThreshold) return 0;
  return fee;
}

export function freeDeliveryProgress(subtotal: number, freeThreshold: number): { pct: number; remaining: number; unlocked: boolean } {
  if (freeThreshold <= 0) return { pct: 0, remaining: 0, unlocked: false };
  const remaining = Math.max(freeThreshold - subtotal, 0);
  return { pct: Math.min(100, Math.round((subtotal / freeThreshold) * 100)), remaining, unlocked: remaining === 0 && subtotal > 0 };
}

export function effectivePrice(price: number, salePrice: number | null | undefined): number {
  return salePrice != null && salePrice > 0 && salePrice < price ? salePrice : price;
}

export function addLine(lines: CartLine[], line: CartLine, stock?: number): CartLine[] {
  const existing = lines.find((l) => l.productId === line.productId);
  if (!existing) return [...lines, { ...line, qty: clampQty(line.qty, stock) }];
  return lines.map((l) => (l.productId === line.productId ? { ...l, price: line.price, qty: clampQty(l.qty + line.qty, stock) } : l));
}

export function setQty(lines: CartLine[], productId: number, qty: number, stock?: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => l.productId !== productId);
  return lines.map((l) => (l.productId === productId ? { ...l, qty: clampQty(qty, stock) } : l));
}
