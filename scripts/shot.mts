// Quick single-route screenshot (route without leading slash, e.g. shop): npx tsx scripts/shot.mts <route> <width> <outfile> [fullpage=1]
import { chromium } from '@playwright/test';
const [route = '/', w = '1440', out = 'shot.png', full = '1'] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:3201';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: Number(w), height: Number(w) < 600 ? 812 : 900 } })).newPage();
await page.goto(base + '/' + route.replace(/^.*Git\/?/, '').replace(/^\/+/, ''), { waitUntil: 'networkidle' });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: full === '1' });
await browser.close();
