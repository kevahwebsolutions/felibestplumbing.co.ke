// Runs axe-core (WCAG 2.1 A/AA) on every route and reports serious and critical violations.
// Usage: BASE_URL=http://localhost:3001 npx tsx scripts/axe-v2.mts   (admin routes need ADMIN_EMAIL and QA_ADMIN_PASSWORD)
import './load-env.ts';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { SERVICES } from '../src/data/services.ts';
import { POSTS } from '../src/data/blog.ts';

const base = (process.env.BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '');
const pub = ['/', '/about', '/services', ...SERVICES.map((s) => `/services/${s.slug}`).slice(0, 4), '/shop', '/shop/intatherm-safe-touch-basin-mixer-tap', '/cart', '/checkout', '/pricing', '/gallery', '/testimonials', '/faq', '/blog', `/blog/${POSTS[0]!.slug}`, '/contact', '/coverage', '/privacy', '/terms', '/does-not-exist', '/admin/login'];
const admin = ['/admin', '/admin/products', '/admin/products/new', '/admin/categories', '/admin/orders', '/admin/enquiries', '/admin/settings'];
const browser = await chromium.launch();
let bad = 0;
async function scan(ctx: import('@playwright/test').BrowserContext, route: string) {
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const hits = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  for (const v of hits) { bad++; console.log(`${route} ${v.impact} ${v.id}: ${v.nodes.length} nodes; e.g. ${v.nodes[0]?.target.join(' ')} | ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`); }
  if (!hits.length) console.log(`${route} ok (${res.violations.length} minor/moderate)`);
  await page.close();
}
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
for (const r of pub) await scan(ctx, r);
const mctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
for (const r of ['/', '/shop', '/contact']) await scan(mctx, r);
const email = process.env.ADMIN_EMAIL, pw = process.env.QA_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
if (email && pw) {
  const actx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await actx.newPage();
  await p.goto(base + '/admin/login');
  await p.getByLabel('Email').fill(email); await p.getByLabel('Password').fill(pw);
  await p.getByRole('button', { name: 'Sign in' }).click();
  await p.waitForURL(/\/admin$/);
  await p.waitForTimeout(2500);
  await p.close();
  for (const r of admin) await scan(actx, r);
}
await browser.close();
console.log(bad ? `\n${bad} serious/critical violations` : '\nNo serious or critical violations');
process.exit(bad ? 1 : 0);
