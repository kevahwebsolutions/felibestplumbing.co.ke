import { describe, expect, it } from 'vitest';
import { addLine, cartCount, cartSubtotal, clampQty, deliveryFor, effectivePrice, freeDeliveryProgress, setQty } from '@/lib/cart-math';

describe('cart maths', () => {
  const lines = [{ productId: 1, price: 1500, qty: 2 }, { productId: 2, price: 250, qty: 3 }];
  it('computes subtotal and count', () => {
    expect(cartSubtotal(lines)).toBe(3750);
    expect(cartCount(lines)).toBe(5);
    expect(cartSubtotal([])).toBe(0);
  });
  it('clamps quantities to 1..stock and 99', () => {
    expect(clampQty(0)).toBe(1);
    expect(clampQty(150)).toBe(99);
    expect(clampQty(10, 4)).toBe(4);
    expect(clampQty(Number.NaN)).toBe(1);
    expect(clampQty(2.9)).toBe(2);
  });
  it('merges lines when adding an existing product and respects stock', () => {
    const next = addLine(lines, { productId: 1, price: 1600, qty: 1 }, 5);
    expect(next.find((l) => l.productId === 1)).toEqual({ productId: 1, price: 1600, qty: 3 });
    expect(addLine(lines, { productId: 1, price: 1500, qty: 10 }, 4).find((l) => l.productId === 1)?.qty).toBe(4);
    expect(addLine([], { productId: 9, price: 10, qty: 1 })).toHaveLength(1);
  });
  it('removes a line when quantity drops to zero', () => {
    expect(setQty(lines, 1, 0)).toHaveLength(1);
    expect(setQty(lines, 2, 7).find((l) => l.productId === 2)?.qty).toBe(7);
  });
  it('applies the free delivery threshold', () => {
    expect(deliveryFor(0, 500, 15000)).toBe(0);
    expect(deliveryFor(14999, 500, 15000)).toBe(500);
    expect(deliveryFor(15000, 500, 15000)).toBe(0);
    expect(deliveryFor(100, 500, 0)).toBe(500);
  });
  it('reports free delivery progress', () => {
    expect(freeDeliveryProgress(7500, 15000)).toEqual({ pct: 50, remaining: 7500, unlocked: false });
    expect(freeDeliveryProgress(20000, 15000).unlocked).toBe(true);
    expect(freeDeliveryProgress(100, 0).pct).toBe(0);
  });
  it('prefers a valid sale price', () => {
    expect(effectivePrice(1000, 800)).toBe(800);
    expect(effectivePrice(1000, null)).toBe(1000);
    expect(effectivePrice(1000, 1200)).toBe(1000);
  });
});
