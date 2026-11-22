# Catalogue plan

Goal: the shop contains only the 16 real products from the approved Beta Supplies WhatsApp catalogue, with real photos and prices, deployable to production.

## Discovery findings

- Products live in SQLite (Drizzle): `products`, `product_images`, `categories`, `orders`, `order_items`. Pages under `src/app/(site)/shop`, components in `src/components/shop`, admin in `src/app/admin` and `src/components/admin`.
- `scripts/seed.ts` inserted 24 sample products (12 legacy, 13 drafts, USD prices converted to placeholder KES) and set `is_placeholder_price`. The admin dashboard banner counted those flags.
- Stock was always a count (`stock`), checked and decremented at order time. The real catalogue has no stock data.
- No category pages existed (only a client-side filter on `/shop`). The sitemap listed all published products.
- The local database also holds 227 demo orders, 9 real test orders and two owner-edited rows (`laundry-pods`, and a row renamed to `milano-modern-shower` with a sale price).
- Tests and scripts referenced `intatherm-safe-touch-basin-mixer-tap`, sample faucet and valve fixtures, and the placeholder-price banner.

## Build

1. Data: `src/data/catalog-products.ts` (typed, 6 categories, 16 products, SEO fields, alt text, admin-only list price note, `needsReview`).
2. Images: `scripts/process-catalog-images.mts` writes `public/images/catalog/*.webp` and `src/data/catalog-image-meta.json`.
3. Schema: migration 0002 adds `track_stock`, `list_price_note`, `description_status`, `needs_review`, `seo_title`, `seo_description`, `archived`, `updated_by_admin`, `import_snapshot`; migration 0003 drops `is_placeholder_price`.
4. Import: `src/lib/catalog-import.ts` and `scripts/import-catalog.ts` (`npm run db:import-catalog`, `--dry-run`, `--prune-unknown`).
5. Public site: product, category and shop pages, JSON-LD, sitemap, related products, install cross-sell, homepage teaser, cart text.
6. Admin: needs-review banner and filter, list price note, stock counting switch, SEO fields.
7. Tests, QA, screenshots, reports and owner checklist.

## Local dry-run result (before applying)

Created 16 products and 4 categories; removed 10 empty old categories; deleted 13 unreferenced samples; archived 11 order-referenced rows (history kept). The apply run and a second run (16 unchanged, nothing else) matched the plan.
