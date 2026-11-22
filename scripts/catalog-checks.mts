// Catalogue QA: screenshots of /shop, every category page and every product page at 375 and 1440 px into
// docs/screens-catalog/, plus a horizontal-overflow check at 375, 768 and 1440 on the shop, a category page and
// three product pages. Writes docs/screens-catalog/REPORT.txt.
// Usage: BASE_URL=http://localhost:3200 npx tsx scripts/catalog-checks.mts
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '../src/data/catalog-products.ts';

const base = (process.env.BASE_URL ?? 'http://localhost:3200').replace(/\/$/, '');
const out = 'docs/screens-catalog';
fs.mkdirSync(out, { recursive: true });

const routes: { name: string; path: string }[] = [
  { name: 'shop', path: '/shop' },
  ...CATALOG_CATEGORIES.map((c) => ({ name: `category-${c.slug}`, path: `/shop/category/${c.slug}` })),
  ...CATALOG_PRODUCTS.map((p) => ({ name: `product-${p.slug}`, path: `/shop/${p.slug}` })),
];

const browser = await chromium.launch();
const issues: string[] = [];
let checks = 0;

for (const width of [375, 1440]) {
  const page = await (await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 } })).newPage();
  for (const r of routes) {
    await page.goto(base + r.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${r.name}-${width}.png`, fullPage: true });
  }
  await page.close();
}

const overflowRoutes = ['/shop', `/shop/category/${CATALOG_CATEGORIES[3]!.slug}`, `/shop/${CATALOG_PRODUCTS[0]!.slug}`, `/shop/${CATALOG_PRODUCTS[3]!.slug}`, `/shop/${CATALOG_PRODUCTS[11]!.slug}`];
for (const width of [375, 768, 1440]) {
  const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
  for (const path of overflowRoutes) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    checks++;
    if (o > 1) issues.push(`${path} @${width}: horizontal overflow of ${o}px`);
  }
  await page.close();
}
await browser.close();

const msg = `${routes.length * 2} screenshots. ${checks} overflow checks (375, 768, 1440). ${issues.length ? issues.join('\n') : 'No horizontal overflow detected.'}\n`;
fs.writeFileSync(`${out}/REPORT.txt`, msg);
console.log(msg);
