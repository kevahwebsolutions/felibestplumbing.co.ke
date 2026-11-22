import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '@/data/catalog-products';
import { buildOrderMessage } from '@/lib/whatsapp-message';
import { isInstallableCategory, structureDescription } from '@/lib/catalog-meta';

// Expected values copied from the source CSV (catalog-import/products.csv is gitignored).
const EXPECTED: [string, number][] = [
  ['Milano modern shower', 25000], ['DDA 1000P', 18200], ['Shoes Mesh Bags for Washing Machine', 1500], ['Front Load Washing Machine Cover', 800],
  ['Heavy Duty Washing Machine Stand', 3500], ['Front Load Washing Machine Cover', 1000], ['Zipped Laundry Mesh bags', 1000],
  ['Drawstring Laundry Mesh bags', 1200], ['Front Load Washing Machine Cover', 1200], ['Washing Machine Tap', 650], ['Washing Machine Scent Beads', 1000],
  ['Barline 5 in 1 Laundry Pods 40pcs', 1000], ['Washing Machine Outlet Pipe 3M', 1000], ['Washing Machine Inlet Pipe 3M', 1000],
  ['Colour and Dirt Catcher', 1000], ['Drum Cleaning Tablets', 700],
];

describe('catalogue data', () => {
  it('has the 16 real products with the exact names and prices from the source', () => {
    expect(CATALOG_PRODUCTS.map((p) => [p.name, p.price])).toEqual(EXPECTED);
    expect(CATALOG_PRODUCTS.every((p) => p.currency === 'KES')).toBe(true);
  });
  it('keeps the three front load covers as separate products with distinct slugs and text', () => {
    const covers = CATALOG_PRODUCTS.filter((p) => p.name === 'Front Load Washing Machine Cover');
    expect(covers).toHaveLength(3);
    expect(new Set(covers.map((c) => c.slug)).size).toBe(3);
    expect(new Set(covers.map((c) => c.description)).size).toBe(3);
  });
  it('has unique slugs, titles of 30 to 60 characters and descriptions of 110 to 155 characters', () => {
    expect(new Set(CATALOG_PRODUCTS.map((p) => p.slug)).size).toBe(16);
    expect(new Set(CATALOG_PRODUCTS.map((p) => p.seoTitle)).size).toBe(16);
    expect(new Set(CATALOG_PRODUCTS.map((p) => p.seoDescription)).size).toBe(16);
    for (const p of CATALOG_PRODUCTS) {
      expect(p.seoTitle.length, p.slug).toBeGreaterThanOrEqual(30);
      expect(p.seoTitle.length, p.slug).toBeLessThanOrEqual(60);
      expect(p.seoDescription.length, p.slug).toBeGreaterThanOrEqual(110);
      expect(p.seoDescription.length, p.slug).toBeLessThanOrEqual(155);
    }
  });
  it('flags exactly the twelve generated descriptions for review and keeps four source descriptions', () => {
    const generated = CATALOG_PRODUCTS.filter((p) => p.descriptionStatus === 'generated-from-name');
    expect(generated).toHaveLength(12);
    expect(generated.every((p) => p.needsReview)).toBe(true);
    expect(CATALOG_PRODUCTS.filter((p) => p.descriptionStatus === 'source').map((p) => p.sourceRow)).toEqual([1, 2, 3, 5]);
    for (const p of generated) {
      const words = p.description.split(/\s+/).length;
      expect(words, p.slug).toBeGreaterThanOrEqual(40);
      expect(words, p.slug).toBeLessThanOrEqual(80);
    }
  });
  it('never shows the struck-through list price to customers', () => {
    for (const p of CATALOG_PRODUCTS) {
      const listed = p.listPriceNote.match(/KES ([\d,]+)/)![1]!;
      for (const text of [p.description, p.seoTitle, p.seoDescription]) expect(text, p.slug).not.toContain(`KES ${listed}`);
    }
  });
  it('ships optimised images that exist, are small WebP and have descriptive alt text', async () => {
    for (const p of CATALOG_PRODUCTS) {
      expect(p.images.length, p.slug).toBeGreaterThan(0);
      for (const im of p.images) {
        const file = path.resolve('public/images/catalog', im.file);
        expect(fs.existsSync(file), im.file).toBe(true);
        expect(fs.statSync(file).size, im.file).toBeLessThan(200 * 1024);
        expect((await sharp(file).metadata()).format).toBe('webp');
        expect(im.alt.length).toBeGreaterThan(15);
        expect(im.file.startsWith(p.slug)).toBe(true);
      }
    }
  });
  it('shows the plumber cross-sell only for categories a plumber fits', () => {
    expect(CATALOG_CATEGORIES.filter((c) => c.installable).map((c) => c.slug)).toEqual(['showers', 'pumps', 'washing-machine-plumbing']);
    expect(isInstallableCategory('washing-machine-covers-and-stands')).toBe(false);
    expect(isInstallableCategory('laundry-care')).toBe(false);
  });
  it('structures supplier descriptions without changing their words', () => {
    const shower = CATALOG_PRODUCTS[0]!;
    const s = structureDescription(shower.description)!;
    expect(s.lead).toBe('Modern Milano shower with inbuilt heater and pump');
    expect(s.bullets).toHaveLength(6);
    expect(s.tail).toBe('');
    const stand = structureDescription(CATALOG_PRODUCTS.find((p) => p.sourceRow === 5)!.description)!;
    expect(stand.bullets).toEqual(['Strong and durable', 'Adjustable to fit different appliance sizes', 'Wheels for easy movement', 'Stable, anti-slip corner supports']);
  });
  it('builds the WhatsApp order message from the real product name, price and URL', () => {
    const tap = CATALOG_PRODUCTS.find((p) => p.slug === 'washing-machine-tap')!;
    const msg = buildOrderMessage(
      { ref: 'FP-ABC234', customerName: 'Jane', phone: '+254712345678', area: 'Kilimani', address: 'Road 1', paymentMethod: 'pay_on_delivery', deliveryFee: 0, total: tap.price, items: [{ name: tap.name, qty: 1, price: tap.price, slug: tap.slug }] },
      { siteUrl: 'https://felibestplumbing.co.ke' },
    );
    expect(msg).toContain('1. Washing Machine Tap');
    expect(msg).toContain('Qty: 1 x KES 650 = KES 650');
    expect(msg).toContain('https://felibestplumbing.co.ke/shop/washing-machine-tap');
  });
});

describe('catalogue import and public queries', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'felibest-catalog-'));
  let db: import('@/db').DB;
  let schema: typeof import('@/db').schema;
  let runCatalogImport: typeof import('@/lib/catalog-import').runCatalogImport;
  let products: typeof import('@/lib/server/products');

  beforeAll(async () => {
    process.env.DATABASE_PATH = path.join(dir, 'test.db');
    const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');
    const dbModule = await import('@/db');
    db = dbModule.getDb();
    schema = dbModule.schema;
    migrate(db, { migrationsFolder: path.resolve('drizzle') });
    runCatalogImport = (await import('@/lib/catalog-import')).runCatalogImport;
    products = await import('@/lib/server/products');
  });
  afterAll(() => {
    (globalThis as unknown as { __felibestDb?: { raw: { close(): void } } }).__felibestDb?.raw.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const rows = () => db.select().from(schema.products).orderBy(schema.products.id).all();

  it('imports 16 products and categories into an empty database', () => {
    const s = runCatalogImport(db);
    expect(s.productsCreated).toHaveLength(16);
    expect(products.listPublishedProducts()).toHaveLength(16);
    expect(products.categoriesWithCounts().map((c) => c.slug).sort()).toEqual(CATALOG_CATEGORIES.map((c) => c.slug).sort());
    const first = products.getProductBySlug('milano-modern-shower')!;
    expect(first.finalPrice).toBe(25000);
    expect(first.onSale).toBe(false);
    expect(first.trackStock).toBe(false);
    expect(first.available).toBe(true);
  });

  it('is idempotent: a second run changes nothing', () => {
    const before = JSON.stringify(rows());
    const imagesBefore = JSON.stringify(db.select().from(schema.productImages).all());
    const s = runCatalogImport(db);
    expect(s.productsCreated).toHaveLength(0);
    expect(s.productsUpdated).toHaveLength(0);
    expect(s.productsUnchanged).toHaveLength(16);
    expect(s.legacyDeleted.length + s.legacyArchived.length).toBe(0);
    expect(JSON.stringify(rows())).toBe(before);
    expect(JSON.stringify(db.select().from(schema.productImages).all())).toBe(imagesBefore);
  });

  it('dry run reports the plan and writes nothing', () => {
    const before = JSON.stringify(rows());
    const changed = CATALOG_PRODUCTS.map((p) => (p.slug === 'dda-1000p' ? { ...p, price: 19000 } : p));
    const s = runCatalogImport(db, { dryRun: true, products: changed });
    expect(s.dryRun).toBe(true);
    expect(s.productsUpdated).toEqual([{ slug: 'dda-1000p', fields: ['price'] }]);
    expect(JSON.stringify(rows())).toBe(before);
  });

  it('does not overwrite fields the owner edited, but still updates untouched fields', () => {
    db.update(schema.products).set({ price: 18500, description: 'Owner wrote this.' }).where(eq(schema.products.slug, 'dda-1000p')).run();
    const changed = CATALOG_PRODUCTS.map((p) => (p.slug === 'dda-1000p' ? { ...p, price: 19000, description: 'New catalogue text.', seoTitle: 'DDA 1000P Dayliff Well Pump | Felibest Plumbing' } : p));
    const s = runCatalogImport(db, { products: changed });
    const row = db.select().from(schema.products).where(eq(schema.products.slug, 'dda-1000p')).get()!;
    expect(row.price).toBe(18500);
    expect(row.description).toBe('Owner wrote this.');
    expect(row.seoTitle).toBe('DDA 1000P Dayliff Well Pump | Felibest Plumbing');
    expect(s.ownerEditsKept).toEqual([{ slug: 'dda-1000p', fields: ['price', 'description'] }]);
    // Running with the original catalogue again restores nothing that the owner edited.
    runCatalogImport(db);
    expect(db.select().from(schema.products).where(eq(schema.products.slug, 'dda-1000p')).get()!.price).toBe(18500);
  });

  it('deletes unreferenced sample products and archives those that orders reference', () => {
    const sample = db.insert(schema.products).values({ slug: 'brass-gate-valve', name: 'Brass Gate Valve', price: 950 }).returning().get();
    const ordered = db.insert(schema.products).values({ slug: 'laundry-pods', name: 'Laundry Pods', price: 1000, published: true, featured: true }).returning().get();
    const order = db.insert(schema.orders).values({ ref: 'FP-TESTAA', customerName: 'T', phone: '+254700000000', area: 'A', address: 'B', paymentMethod: 'pay_on_delivery', subtotal: 1000, total: 1000 }).returning().get();
    db.insert(schema.orderItems).values({ orderId: order.id, productId: ordered.id, name: 'Laundry Pods', price: 1000, qty: 1 }).run();
    const custom = db.insert(schema.products).values({ slug: 'owner-added-item', name: 'Owner added item', price: 500, published: true }).returning().get();

    const s = runCatalogImport(db);
    expect(s.legacyDeleted).toEqual(['brass-gate-valve']);
    expect(s.legacyArchived).toEqual(['laundry-pods']);
    expect(s.unknownKept).toEqual(['owner-added-item']);
    expect(db.select().from(schema.products).where(eq(schema.products.id, sample.id)).get()).toBeUndefined();
    const kept = db.select().from(schema.products).where(eq(schema.products.id, ordered.id)).get()!;
    expect([kept.archived, kept.published, kept.featured]).toEqual([true, false, false]);
    expect(db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id)).all()).toHaveLength(1);

    // Archived products are hidden from the shop, related blocks and the featured list.
    expect(products.getProductBySlug('laundry-pods')).toBeNull();
    expect(products.listPublishedProducts().some((p) => p.slug === 'laundry-pods')).toBe(false);
    const milano = products.getProductBySlug('milano-modern-shower')!;
    expect(products.relatedProducts(milano, 20).some((p) => p.slug === 'laundry-pods')).toBe(false);
    expect(products.featuredProducts(20).some((p) => p.slug === 'laundry-pods')).toBe(false);

    db.delete(schema.products).where(eq(schema.products.id, custom.id)).run();
  });

  it('puts the other front load covers first in related products', () => {
    const cover = products.getProductBySlug('front-load-washing-machine-cover-kes-800')!;
    const related = products.relatedProducts(cover, 4).map((p) => p.slug);
    expect(related.slice(0, 2).sort()).toEqual(['front-load-washing-machine-cover-kes-1000', 'front-load-washing-machine-cover-kes-1200']);
  });

  it('hides categories with no published products and keeps archived products out of the sitemap', async () => {
    const cat = db.insert(schema.categories).values({ slug: 'empty-test', name: 'Empty test' }).returning().get();
    expect(products.categoriesWithCounts().some((c) => c.slug === 'empty-test')).toBe(false);
    expect(products.categoryBySlug('empty-test')).toBeNull();
    db.update(schema.products).set({ archived: true }).where(eq(schema.products.slug, 'drum-cleaning-tablets')).run();
    const sitemap = (await import('@/app/sitemap')).default();
    const urls = sitemap.map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/shop/milano-modern-shower'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/shop/drum-cleaning-tablets'))).toBe(false);
    expect(urls.some((u) => u.endsWith('/shop/category/empty-test'))).toBe(false);
    expect(urls.some((u) => u.endsWith('/shop/category/laundry-care'))).toBe(true);
    const entry = sitemap.find((e) => e.url.endsWith('/shop/milano-modern-shower'))!;
    expect(entry.lastModified instanceof Date).toBe(true);
    db.update(schema.products).set({ archived: false }).where(eq(schema.products.slug, 'drum-cleaning-tablets')).run();
    db.delete(schema.categories).where(eq(schema.categories.id, cat.id)).run();
  });

  it('serves a 1200x630 JPEG share image for every real product and 404 for archived ones', async () => {
    const { GET } = await import('@/app/og/product/[slug]/route');
    for (const p of CATALOG_PRODUCTS) {
      const res = await GET(new Request(`http://localhost/og/product/${p.slug}`), { params: Promise.resolve({ slug: p.slug }) });
      expect(res.status, p.slug).toBe(200);
      expect(res.headers.get('content-type')).toBe('image/jpeg');
      const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      expect([meta.format, meta.width, meta.height], p.slug).toEqual(['jpeg', 1200, 630]);
    }
    const archived = await GET(new Request('http://localhost/og/product/laundry-pods'), { params: Promise.resolve({ slug: 'laundry-pods' }) });
    expect(archived.status).toBe(404);
  });
});
