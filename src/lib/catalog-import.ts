/**
 * Idempotent catalogue import: upserts the real products (src/data/catalog-products.ts) into the database and
 * retires the old sample products. Used by `npm run db:import-catalog` and by the tests.
 *
 * Rules:
 *  - Real products are matched by their catalogue key (kept in `import_snapshot`), then by slug for rows that
 *    pre-date the import. Running the import twice changes nothing.
 *  - `import_snapshot` holds the values the import last wrote. A field is only updated when the database still
 *    holds that snapshot value, so anything the owner edited in the admin is never overwritten.
 *  - Old sample products are deleted when no order references them and archived (unpublished, hidden everywhere,
 *    kept for order history) when an order does.
 *  - Everything runs inside one transaction. `dryRun` rolls it back after collecting the plan.
 */
import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS, type CatalogCategory, type CatalogProduct } from '../data/catalog-products';

type DB = BetterSQLite3Database<typeof schema>;

/** Slugs of the placeholder products that shipped with the first seed script, plus a known local duplicate. */
export const LEGACY_SAMPLE_SLUGS = [
  'shower-hose-s-steel-cone-x-cone-1-50m-x-11mm-bore', 'water-block-re-set-device', 'inaq4-water-heater-accessory-pack',
  'single-handle-pull-down-kitchen-faucet-with-touch2o-technology', '2-5-gallon-1500-watt-1-element-point-of-use-electric-water-heater',
  'flexible-tap-connector-1-2-x-15mm-x-600mm', 'anti-corrosive-immersion-heater-18-plus-thermostat', 'multikwik-non-return-valve-110mm',
  'intatherm-safe-touch-basin-mixer-tap', 'pump-gate-valve-1-1-2-x-22mm', 'lever-handle-ball-pump-valve-1-1-2-x-35mm-pair',
  'stainless-steel-single-bowl-kitchen-sink', 'kitchen-sink-waste-and-trap-kit', 'chrome-basin-pillar-tap', 'water-booster-pump',
  'stainless-steel-floor-drain-with-trap', 'rain-shower-head-with-arm', 'ppr-pipe-fitting-set', 'steam-shower-generator', 'brass-gate-valve',
  'under-sink-water-filter', 'electric-instant-shower-unit', 'toilet-cistern-fill-valve', 'ptfe-tape-and-pipe-sealant-kit',
  'laundry-pods',
] as const;

/** Categories created by the first seed script. They are removed once they hold no products at all. */
export const LEGACY_CATEGORY_SLUGS = [
  'sinks', 'faucets', 'pumps', 'drains', 'showers', 'pipe-fittings', 'steam-showers', 'valves', 'water-filtration', 'water-heaters', 'toilet-parts', 'accessories',
] as const;

/** Sort positions the old seed script gave to the two categories that the catalogue reuses. */
const LEGACY_SORT: Record<string, number> = { pumps: 2, showers: 4 };

export type ImportSummary = {
  dryRun: boolean;
  categoriesCreated: string[];
  categoriesRemoved: string[];
  productsCreated: string[];
  productsUpdated: { slug: string; fields: string[] }[];
  productsUnchanged: string[];
  /** Fields left alone because the owner changed them after the last import. */
  ownerEditsKept: { slug: string; fields: string[] }[];
  legacyDeleted: string[];
  legacyArchived: string[];
  /** Products that are neither real nor known samples. Left untouched unless `pruneUnknown` is set. */
  unknownKept: string[];
};

type Snapshot = {
  key: string;
  name: string;
  categorySlug: string;
  price: number;
  description: string;
  descriptionStatus: string;
  needsReview: boolean;
  listPriceNote: string;
  seoTitle: string;
  seoDescription: string;
  images: { src: string; alt: string }[];
};

class DryRunRollback extends Error {}

const imagePath = (file: string) => `/images/catalog/${file}`;

function snapshotOf(p: CatalogProduct): Snapshot {
  return {
    key: p.slug, name: p.name, categorySlug: p.categorySlug, price: p.price, description: p.description, descriptionStatus: p.descriptionStatus,
    needsReview: p.needsReview, listPriceNote: p.listPriceNote, seoTitle: p.seoTitle, seoDescription: p.seoDescription,
    images: p.images.map((i) => ({ src: imagePath(i.file), alt: i.alt })),
  };
}

function parseSnapshot(raw: string): Snapshot | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Snapshot;
    return s && typeof s.key === 'string' ? s : null;
  } catch {
    return null;
  }
}

const now = () => Math.floor(Date.now() / 1000);

export function runCatalogImport(
  db: DB,
  opts: { dryRun?: boolean; pruneUnknown?: boolean; products?: CatalogProduct[]; categories?: CatalogCategory[] } = {},
): ImportSummary {
  const products = opts.products ?? CATALOG_PRODUCTS;
  const categories = opts.categories ?? CATALOG_CATEGORIES;
  const summary: ImportSummary = {
    dryRun: !!opts.dryRun, categoriesCreated: [], categoriesRemoved: [], productsCreated: [], productsUpdated: [], productsUnchanged: [],
    ownerEditsKept: [], legacyDeleted: [], legacyArchived: [], unknownKept: [],
  };

  const apply = () =>
    db.transaction((tx) => {
      // ---------- Categories ----------
      const catId = new Map<string, number>();
      for (const c of categories) {
        let row = tx.select().from(schema.categories).where(eq(schema.categories.slug, c.slug)).get();
        if (!row) {
          row = tx.insert(schema.categories).values({ slug: c.slug, name: c.name, description: c.description, sortOrder: c.sortOrder }).returning().get();
          summary.categoriesCreated.push(c.slug);
        } else {
          const set: Partial<typeof schema.categories.$inferInsert> = {};
          if (row.description === '') set.description = c.description;
          // Rows left by the old seed script carry the old ordering, so give them the catalogue order once.
          if (LEGACY_SORT[c.slug] === row.sortOrder && row.sortOrder !== c.sortOrder) set.sortOrder = c.sortOrder;
          if (Object.keys(set).length) tx.update(schema.categories).set(set).where(eq(schema.categories.id, row.id)).run();
        }
        catId.set(c.slug, row.id);
      }

      // ---------- Index existing products ----------
      const all = tx.select().from(schema.products).all();
      const byKey = new Map<string, typeof all[number]>();
      const bySlug = new Map(all.map((p) => [p.slug, p]));
      for (const p of all) {
        const snap = parseSnapshot(p.importSnapshot);
        if (snap) byKey.set(snap.key, p);
      }
      const realKeys = new Set(products.map((p) => p.slug));
      const referenced = (id: number) => !!tx.select({ id: schema.orderItems.id }).from(schema.orderItems).where(eq(schema.orderItems.productId, id)).get();

      const retire = (p: typeof all[number]) => {
        if (referenced(p.id)) {
          tx.update(schema.products).set({ archived: true, published: false, featured: false, categoryId: null, updatedAt: now() }).where(eq(schema.products.id, p.id)).run();
          summary.legacyArchived.push(p.slug);
        } else {
          tx.delete(schema.products).where(eq(schema.products.id, p.id)).run();
          summary.legacyDeleted.push(p.slug);
        }
      };

      // ---------- Real products ----------
      for (const cp of products) {
        const snap = snapshotOf(cp);
        const categoryId = catId.get(cp.categorySlug) ?? null;
        let existing = byKey.get(cp.slug);

        if (!existing) {
          const legacy = bySlug.get(cp.slug);
          if (legacy && !parseSnapshot(legacy.importSnapshot)) {
            if (referenced(legacy.id)) {
              // A pre-import row with the same slug that orders point at: archive it and free the slug for the real product.
              tx.update(schema.products)
                .set({ slug: `${legacy.slug}-legacy-${legacy.id}`, archived: true, published: false, featured: false, categoryId: null, updatedAt: now() })
                .where(eq(schema.products.id, legacy.id)).run();
              summary.legacyArchived.push(legacy.slug);
            } else {
              tx.delete(schema.products).where(eq(schema.products.id, legacy.id)).run();
              summary.legacyDeleted.push(legacy.slug);
            }
          }
        }

        if (!existing) {
          const row = tx.insert(schema.products).values({
            slug: cp.slug, name: cp.name, categoryId, description: cp.description, price: cp.price, salePrice: null, sku: '', stock: 0, trackStock: false,
            tags: [], specs: [], featured: cp.featured, published: true, isNew: false, listPriceNote: cp.listPriceNote,
            descriptionStatus: cp.descriptionStatus, needsReview: cp.needsReview, seoTitle: cp.seoTitle, seoDescription: cp.seoDescription,
            archived: false, updatedByAdmin: false, importSnapshot: JSON.stringify(snap),
          }).returning({ id: schema.products.id }).get();
          snap.images.forEach((im, i) => tx.insert(schema.productImages).values({ productId: row.id, src: im.src, alt: im.alt, position: i, isPrimary: i === 0 }).run());
          summary.productsCreated.push(cp.slug);
          continue;
        }

        const old = parseSnapshot(existing.importSnapshot)!;
        const currentImages = tx.select().from(schema.productImages).where(eq(schema.productImages.productId, existing.id)).all()
          .sort((a, b) => a.position - b.position).map((i) => ({ src: i.src, alt: i.alt }));
        const oldCategoryId = catId.get(old.categorySlug) ?? null;
        const changed: string[] = [];
        const kept: string[] = [];
        const set: Partial<typeof schema.products.$inferInsert> = {};

        // `edited` = the database no longer holds what the import last wrote.
        const field = <T,>(name: string, current: T, previous: T, next: T, apply: () => void) => {
          if (JSON.stringify(next) === JSON.stringify(previous)) return; // the catalogue did not change this field
          if (JSON.stringify(current) !== JSON.stringify(previous)) { kept.push(name); return; }
          if (JSON.stringify(current) === JSON.stringify(next)) return;
          apply();
          changed.push(name);
        };
        field('name', existing.name, old.name, cp.name, () => { set.name = cp.name; });
        field('category', existing.categoryId, oldCategoryId, categoryId, () => { set.categoryId = categoryId; });
        field('price', existing.price, old.price, cp.price, () => { set.price = cp.price; });
        field('description', existing.description, old.description, cp.description, () => {
          set.description = cp.description; set.descriptionStatus = cp.descriptionStatus; set.needsReview = cp.needsReview;
        });
        field('listPriceNote', existing.listPriceNote, old.listPriceNote, cp.listPriceNote, () => { set.listPriceNote = cp.listPriceNote; });
        field('seoTitle', existing.seoTitle, old.seoTitle, cp.seoTitle, () => { set.seoTitle = cp.seoTitle; });
        field('seoDescription', existing.seoDescription, old.seoDescription, cp.seoDescription, () => { set.seoDescription = cp.seoDescription; });
        let replaceImages = false;
        field('images', currentImages, old.images, snap.images, () => { replaceImages = true; });

        const snapshotChanged = JSON.stringify(old) !== JSON.stringify(snap);
        if (changed.length) {
          set.updatedAt = now();
          if (replaceImages) {
            tx.delete(schema.productImages).where(eq(schema.productImages.productId, existing.id)).run();
            snap.images.forEach((im, i) => tx.insert(schema.productImages).values({ productId: existing!.id, src: im.src, alt: im.alt, position: i, isPrimary: i === 0 }).run());
          }
        }
        if (snapshotChanged) set.importSnapshot = JSON.stringify(snap);
        if (Object.keys(set).length) tx.update(schema.products).set(set).where(eq(schema.products.id, existing.id)).run();
        if (kept.length) summary.ownerEditsKept.push({ slug: existing.slug, fields: kept });
        if (changed.length) summary.productsUpdated.push({ slug: existing.slug, fields: changed });
        else summary.productsUnchanged.push(existing.slug);
      }

      // ---------- Old sample products ----------
      const refreshed = tx.select().from(schema.products).all();
      for (const p of refreshed) {
        if (parseSnapshot(p.importSnapshot) || realKeys.has(p.slug)) continue;
        const isLegacy = (LEGACY_SAMPLE_SLUGS as readonly string[]).includes(p.slug);
        if (isLegacy || opts.pruneUnknown) {
          if (p.archived && referenced(p.id)) continue; // already retired
          retire(p);
        } else if (!p.archived) {
          summary.unknownKept.push(p.slug);
        }
      }

      // ---------- Empty legacy categories ----------
      const keepSlugs = new Set(categories.map((c) => c.slug));
      for (const slug of LEGACY_CATEGORY_SLUGS) {
        if (keepSlugs.has(slug)) continue;
        const row = tx.select().from(schema.categories).where(eq(schema.categories.slug, slug)).get();
        if (!row) continue;
        const inUse = tx.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.categoryId, row.id)).get();
        if (inUse) continue;
        tx.delete(schema.categories).where(eq(schema.categories.id, row.id)).run();
        summary.categoriesRemoved.push(slug);
      }

      if (opts.dryRun) throw new DryRunRollback();
    });

  try {
    apply();
  } catch (e) {
    if (!(e instanceof DryRunRollback)) throw e;
  }
  return summary;
}

export function formatSummary(s: ImportSummary): string {
  const lines: string[] = [];
  lines.push(s.dryRun ? 'DRY RUN: nothing was written. Planned changes:' : 'Catalogue import finished.');
  lines.push(`  categories created:   ${s.categoriesCreated.length}${s.categoriesCreated.length ? ` (${s.categoriesCreated.join(', ')})` : ''}`);
  lines.push(`  categories removed:   ${s.categoriesRemoved.length}${s.categoriesRemoved.length ? ` (${s.categoriesRemoved.join(', ')})` : ''}`);
  lines.push(`  products created:     ${s.productsCreated.length}`);
  for (const slug of s.productsCreated) lines.push(`    + ${slug}`);
  lines.push(`  products updated:     ${s.productsUpdated.length}`);
  for (const u of s.productsUpdated) lines.push(`    ~ ${u.slug} (${u.fields.join(', ')})`);
  lines.push(`  products unchanged:   ${s.productsUnchanged.length}`);
  lines.push(`  owner edits kept:     ${s.ownerEditsKept.length}`);
  for (const u of s.ownerEditsKept) lines.push(`    = ${u.slug} (${u.fields.join(', ')})`);
  lines.push(`  old samples deleted:  ${s.legacyDeleted.length}`);
  for (const slug of s.legacyDeleted) lines.push(`    - ${slug}`);
  lines.push(`  old samples archived: ${s.legacyArchived.length} (referenced by orders, history kept)`);
  for (const slug of s.legacyArchived) lines.push(`    x ${slug}`);
  if (s.unknownKept.length) {
    lines.push(`  other products left untouched: ${s.unknownKept.length} (${s.unknownKept.join(', ')}). Use --prune-unknown to retire them.`);
  }
  return lines.join('\n');
}

