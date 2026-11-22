import { CATALOG_CATEGORIES } from '@/data/catalog-products';

/** The "Need it installed? Book a plumber" cross-sell only makes sense for products a plumber fits. */
export function isInstallableCategory(slug: string): boolean {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug)?.installable ?? false;
}

/**
 * Splits a supplier description into a lead line, bullet points and a closing line without changing a word.
 * Used for descriptions written as " - " lists or with check-mark bullets. Plain prose stays one paragraph.
 */
export function structureDescription(text: string): { lead: string; bullets: string[]; tail: string } | null {
  const check = '✅';
  if (text.includes(check)) {
    const parts = text.split(check).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 3) return null;
    const [lead, ...rest] = parts;
    const last = rest[rest.length - 1]!;
    const priceAt = last.search(/\u{1F4B0}/u);
    if (priceAt > 0) return { lead: lead!, bullets: [...rest.slice(0, -1), last.slice(0, priceAt).trim()], tail: last.slice(priceAt).trim() };
    return { lead: lead!, bullets: rest, tail: '' };
  }
  const dash = text.split(' - ').map((s) => s.trim()).filter(Boolean);
  if (dash.length >= 4) {
    const [lead, ...rest] = dash;
    const last = rest[rest.length - 1]!;
    const m = last.match(/^(.*?)(\s+Price:.*)$/s);
    if (m) return { lead: lead!, bullets: [...rest.slice(0, -1), m[1]!.trim()], tail: m[2]!.trim() };
    return { lead: lead!, bullets: rest, tail: '' };
  }
  return null;
}
