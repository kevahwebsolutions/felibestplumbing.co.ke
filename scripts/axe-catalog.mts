// Runs axe-core (WCAG 2.1 A/AA) on the shop, every category page and every product page.
// Usage: BASE_URL=http://localhost:3200 npx tsx scripts/axe-catalog.mts
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '../src/data/catalog-products.ts';

const base = (process.env.BASE_URL ?? 'http://localhost:3200').replace(/\/$/, '');
const routes = ['/shop', ...CATALOG_CATEGORIES.map((c) => `/shop/category/${c.slug}`), ...CATALOG_PRODUCTS.map((p) => `/shop/${p.slug}`)];
const browser = await chromium.launch();
let bad = 0;
for (const width of [1280, 375]) {
  const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' });
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const hits = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    for (const v of hits) { bad++; console.log(`${r} @${width} ${v.impact} ${v.id}: ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.target.join(' ')}`); }
  }
  await page.close();
}
await browser.close();
console.log(`${routes.length * 2} page scans, ${bad} serious or critical violations.`);
process.exit(bad ? 1 : 0);
