import { describe, expect, it } from 'vitest';
import { formatKES, readingTime, slugify, usdToKesPlaceholder } from '@/lib/utils';

describe('price formatting', () => {
  it('formats Kenya shillings without decimals', () => {
    expect(formatKES(1500)).toMatch(/^KES\s?1,500$/);
    expect(formatKES(1234567)).toMatch(/1,234,567$/);
    expect(formatKES(0)).toMatch(/0$/);
  });
  it('rounds fractional amounts', () => {
    expect(formatKES(99.6)).toMatch(/100$/);
  });
  it('converts legacy USD at 130 rounded to the nearest 50', () => {
    expect(usdToKesPlaceholder(4.5)).toBe(600);
    expect(usdToKesPlaceholder(5.26)).toBe(700);
    expect(usdToKesPlaceholder(156.95)).toBe(20400);
    expect(usdToKesPlaceholder(229.82)).toBe(29900);
  });
  it('slugifies names', () => {
    expect(slugify('Flexible Tap Connector - 1/2" x 15mm')).toBe('flexible-tap-connector-1-2-x-15mm');
    expect(slugify('Sinks & Taps')).toBe('sinks-and-taps');
  });
  it('estimates reading time', () => {
    expect(readingTime('word '.repeat(400))).toBe(2);
    expect(readingTime('short')).toBe(1);
  });
});
