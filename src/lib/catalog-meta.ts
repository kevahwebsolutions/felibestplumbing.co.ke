import { CATALOG_CATEGORIES } from '@/data/catalog-products';

/** The "Need it installed? Book a plumber" cross-sell only makes sense for products a plumber fits. */
export function isInstallableCategory(slug: string): boolean {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug)?.installable ?? false;
}

/**
 * Splits a description written as a " - " list into a lead line and bullet points without changing a word.
 * Plain prose returns null and stays one paragraph.
 */
export function structureDescription(text: string): { lead: string; bullets: string[]; tail: string } | null {
  const parts = text.split(' - ').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 4) return null;
  const [lead, ...bullets] = parts;
  return { lead: lead!, bullets, tail: '' };
}
