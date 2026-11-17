import { asc, desc, eq, inArray } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { effectivePrice } from '@/lib/cart-math';

export type ProductImage = { id: number; src: string; url: string; alt: string; isPrimary: boolean };
export type ProductView = {
  id: number;
  slug: string;
  name: string;
  categoryId: number | null;
  categoryName: string;
  categorySlug: string;
  description: string;
  price: number;
  salePrice: number | null;
  finalPrice: number;
  onSale: boolean;
  sku: string;
  stock: number;
  tags: string[];
  specs: { key: string; value: string }[];
  featured: boolean;
  published: boolean;
  isNew: boolean;
  isPlaceholderPrice: boolean;
  images: ProductImage[];
  createdAt: number;
};

export function imageUrl(src: string): string {
  if (src.startsWith('/') || src.startsWith('http')) return src;
  return `/media/${src}`;
}

function build(rows: (typeof schema.products.$inferSelect)[]): ProductView[] {
  if (rows.length === 0) return [];
  const db = getDb();
  const cats = new Map(db.select().from(schema.categories).all().map((c) => [c.id, c]));
  const imgs = db
    .select()
    .from(schema.productImages)
    .where(inArray(schema.productImages.productId, rows.map((r) => r.id)))
    .orderBy(asc(schema.productImages.position))
    .all();
  const byProduct = new Map<number, ProductImage[]>();
  for (const i of imgs) {
    const list = byProduct.get(i.productId) ?? [];
    list.push({ id: i.id, src: i.src, url: imageUrl(i.src), alt: i.alt, isPrimary: i.isPrimary });
    byProduct.set(i.productId, list);
  }
  return rows.map((r) => {
    const cat = r.categoryId != null ? cats.get(r.categoryId) : undefined;
    const finalPrice = effectivePrice(r.price, r.salePrice);
    const images = (byProduct.get(r.id) ?? []).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
    return {
      id: r.id, slug: r.slug, name: r.name, categoryId: r.categoryId, categoryName: cat?.name ?? 'Uncategorised',
      categorySlug: cat?.slug ?? 'uncategorised', description: r.description, price: r.price, salePrice: r.salePrice,
      finalPrice, onSale: finalPrice < r.price, sku: r.sku, stock: r.stock, tags: r.tags, specs: r.specs, featured: r.featured,
      published: r.published, isNew: r.isNew, isPlaceholderPrice: r.isPlaceholderPrice, images, createdAt: r.createdAt,
    };
  });
}

export function listPublishedProducts(): ProductView[] {
  return build(getDb().select().from(schema.products).where(eq(schema.products.published, true)).orderBy(desc(schema.products.createdAt), asc(schema.products.id)).all());
}

export function listAllProducts(): ProductView[] {
  return build(getDb().select().from(schema.products).orderBy(desc(schema.products.updatedAt)).all());
}

export function getProductBySlug(slug: string, includeDraft = false): ProductView | null {
  const row = getDb().select().from(schema.products).where(eq(schema.products.slug, slug)).get();
  if (!row || (!row.published && !includeDraft)) return null;
  return build([row])[0] ?? null;
}

export function getProductById(id: number): ProductView | null {
  const row = getDb().select().from(schema.products).where(eq(schema.products.id, id)).get();
  return row ? (build([row])[0] ?? null) : null;
}

export function getProductsByIds(ids: number[]): ProductView[] {
  if (ids.length === 0) return [];
  return build(getDb().select().from(schema.products).where(inArray(schema.products.id, ids)).all());
}

export function featuredProducts(n = 4): ProductView[] {
  const all = listPublishedProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= n ? featured : [...featured, ...all.filter((p) => !p.featured)]).slice(0, n);
}

export function relatedProducts(p: ProductView, n = 4): ProductView[] {
  const all = listPublishedProducts().filter((x) => x.id !== p.id);
  return [...all.filter((x) => x.categoryId === p.categoryId), ...all.filter((x) => x.categoryId !== p.categoryId)].slice(0, n);
}

export function categoriesWithCounts(onlyNonEmpty = true) {
  const cats = getDb().select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name)).all();
  const counts = new Map<number, number>();
  for (const p of getDb().select({ c: schema.products.categoryId }).from(schema.products).where(eq(schema.products.published, true)).all()) {
    if (p.c != null) counts.set(p.c, (counts.get(p.c) ?? 0) + 1);
  }
  const rows = cats.map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
  return onlyNonEmpty ? rows.filter((r) => r.count > 0) : rows;
}

export function placeholderPriceCount(): number {
  return getDb().select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.isPlaceholderPrice, true)).all().length;
}
