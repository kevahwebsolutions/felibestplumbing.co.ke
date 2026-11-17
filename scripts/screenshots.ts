// Screenshots every route at 375, 768 and 1440 px into docs/screens/ and reports horizontal overflow.
// Usage: BASE_URL=http://localhost:3000 npm run screens
import './load-env';
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { SERVICES } from '../src/data/services';
import { POSTS } from '../src/data/blog';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const only = process.argv[2];
const publicRoutes = ['/', '/about', '/services', ...SERVICES.slice(0, 3).map((s) => `/services/${s.slug}`), '/shop', '/shop/intatherm-safe-touch-basin-mixer-tap', '/cart', '/checkout', '/pricing', '/gallery', '/testimonials', '/faq', '/blog', `/blog/${POSTS[0]!.slug}`, '/contact', '/coverage', '/privacy', '/terms', '/does-not-exist'];
const adminRoutes = ['/admin', '/admin/products', '/admin/products/new', '/admin/categories', '/admin/orders', '/admin/enquiries', '/admin/settings'];
const sizes = [{ w: 375, h: 812 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }];

fs.mkdirSync('docs/screens', { recursive: true });
const browser = await chromium.launch();
const issues: string[] = [];

async function shoot(route: string, authed: boolean, storage?: string) {
  for (const s of sizes) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, storageState: storage as never });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'networkidle' }).catch(() => undefined);
    // Scroll through the page so whileInView animations fire and lazy images load.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(90); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) issues.push(`${route} @${s.w}: horizontal overflow of ${overflow}px`);
    const name = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_')) + `-${s.w}.png`;
    await page.screenshot({ path: `docs/screens/${authed ? 'admin-' : ''}${name}`, fullPage: true });
    await ctx.close();
  }
}

for (const r of publicRoutes) if (!only || r.includes(only)) await shoot(r, false);

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (!only || only.startsWith('/admin'))) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/admin/login');
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL);
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/admin(\/change-password)?$/);
  if (page.url().includes('change-password')) issues.push('Admin account still requires a password change; admin screenshots skipped.');
  else {
    await ctx.storageState({ path: 'data/admin-state.json' });
    for (const r of adminRoutes) await shoot(r, true, 'data/admin-state.json');
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync('docs/screens/REPORT.txt', issues.length ? issues.join('\n') : 'No horizontal overflow detected.');
console.log(issues.length ? issues.join('\n') : 'Done. No horizontal overflow detected.');
