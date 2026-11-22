import type { ProductView } from '@/lib/server/products';

const SUFFIX = ' | Felibest Plumbing';

/** Full page title (the root template is bypassed). Uses the SEO title from the catalogue or the admin when set. */
export function productTitle(p: Pick<ProductView, 'name' | 'seoTitle'>): string {
  if (p.seoTitle) return p.seoTitle;
  const room = 60 - SUFFIX.length;
  const name = p.name.length > room ? `${p.name.slice(0, room - 1).trimEnd()}…` : p.name;
  return `${name}${SUFFIX}`;
}

export function productMetaDescription(p: Pick<ProductView, 'name' | 'description' | 'seoDescription' | 'finalPrice'>): string {
  if (p.seoDescription) return p.seoDescription;
  const text = (p.description || `${p.name} from the Felibest Plumbing shop in Nairobi.`).replace(/\s+/g, ' ').trim();
  return text.length > 155 ? `${text.slice(0, 154).trimEnd()}…` : text;
}
