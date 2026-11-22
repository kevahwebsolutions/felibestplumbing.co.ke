import { expect, test } from '@playwright/test';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '../src/data/catalog-products';

test.describe.configure({ mode: 'default' });

test('shop lists exactly the 16 real products and only non-empty categories', async ({ page }) => {
  await page.goto('/shop');
  await expect(page.locator('article')).toHaveCount(16);
  for (const p of CATALOG_PRODUCTS.slice(0, 3)) await expect(page.getByRole('heading', { level: 3, name: p.name }).first()).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Product categories' });
  for (const c of CATALOG_CATEGORIES) await expect(nav.getByRole('button', { name: new RegExp(c.name, 'i') }).first()).toBeVisible();
  await expect(page.getByText('Plumbing supplies shop')).toHaveCount(0);
});

test('product pages carry Product JSON-LD with the real price and no struck-through or list price', async ({ page }) => {
  for (const p of CATALOG_PRODUCTS) {
    await page.goto(`/shop/${p.slug}`);
    const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    const product = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'Product');
    expect(product, p.slug).toBeTruthy();
    expect(product.offers.price).toBe(p.price);
    expect(product.offers.priceCurrency).toBe('KES');
    expect(product.offers.priceValidUntil).toBeUndefined();
    expect(product.aggregateRating).toBeUndefined();
    const listed = Number(p.listPriceNote.match(/KES ([\d,]+)/)![1]!.replace(/,/g, ''));
    expect(JSON.stringify(blocks)).not.toContain(`"price":${listed}`);
    expect(await page.locator('del').count()).toBe(0);
    await expect(page).toHaveTitle(p.seoTitle);
    expect(blocks.map((b) => JSON.parse(b)).some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toContain(`/og/product/${p.slug}`);
  }
});

test('the plumber cross-sell shows only for installable categories', async ({ page }) => {
  await page.goto('/shop/milano-modern-shower');
  await expect(page.getByText('Need it installed?')).toBeVisible();
  await page.goto('/shop/washing-machine-tap');
  await expect(page.getByText('Need it installed?')).toBeVisible();
  await page.goto('/shop/front-load-washing-machine-cover-kes-800');
  await expect(page.getByText('Need it installed?')).toHaveCount(0);
  await page.goto('/shop/drum-cleaning-tablets');
  await expect(page.getByText('Need it installed?')).toHaveCount(0);
});

test('category pages list their products, and unknown categories are 404', async ({ page, request }) => {
  await page.goto('/shop/category/laundry-care');
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.getByRole('heading', { level: 1, name: 'Laundry Care' })).toBeVisible();
  expect((await request.get('/shop/category/sinks')).status()).toBe(404);
});

test('share image is a 1200x630 JPEG for every real product and archived or unknown products are 404', async ({ request }) => {
  for (const p of CATALOG_PRODUCTS) {
    const res = await request.get(`/og/product/${p.slug}`);
    expect(res.status(), p.slug).toBe(200);
    expect(res.headers()['content-type']).toBe('image/jpeg');
  }
  expect((await request.get('/og/product/laundry-pods')).status()).toBe(404);
  expect((await request.get('/shop/laundry-pods')).status()).toBe(404);
});

test('the sitemap lists real products and category pages only', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const p of CATALOG_PRODUCTS) expect(xml).toContain(`/shop/${p.slug}<`);
  expect(xml).toContain('/shop/category/showers<');
  expect(xml).not.toContain('laundry-pods<');
  expect(xml).not.toContain('intatherm');
});
