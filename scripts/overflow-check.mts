// Automated horizontal-overflow check for every route at 375, 768 and 1440 px. Writes docs/screens-light/REPORT.txt.
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { SERVICES } from '../src/data/services.ts';
import { POSTS } from '../src/data/blog.ts';

const base = (process.env.BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '');
const routes = ['/', '/about', '/services', ...SERVICES.map((s) => `/services/${s.slug}`), '/shop', '/shop/intatherm-safe-touch-basin-mixer-tap', '/cart', '/checkout', '/pricing', '/gallery', '/testimonials', '/faq', '/blog', ...POSTS.map((p) => `/blog/${p.slug}`), '/contact', '/coverage', '/privacy', '/terms', '/does-not-exist', '/admin/login', `/order/${process.env.ORDER_REF ?? 'FP-44477C'}`];
const b = await chromium.launch();
const issues: string[] = [];
let n = 0;
for (const w of [375, 768, 1440]) {
  const page = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    n++;
    if (o > 1) issues.push(`${r} @${w}: horizontal overflow of ${o}px`);
  }
}
await b.close();
const msg = `${n} route/width checks. ` + (issues.length ? issues.join('\n') : 'No horizontal overflow detected.');
fs.writeFileSync('docs/screens-light/REPORT.txt', msg);
console.log(msg);
