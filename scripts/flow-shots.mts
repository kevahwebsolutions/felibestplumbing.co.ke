// Screenshots states that need interaction: cart drawer, filled checkout, mobile menu, quick WhatsApp order dialog.
// Usage: BASE_URL=http://localhost:3300 npx tsx scripts/flow-shots.mts
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base = (process.env.BASE_URL ?? 'http://localhost:3300').replace(/\/$/, '');
const dir = 'docs/screens-light';
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();

for (const w of [1440, 375]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 600 ? 900 : 812 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/shop`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Add to cart: / }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Open cart/ }).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${dir}/cart-drawer-${w}.png` });
  await page.keyboard.press('Escape');
  await page.goto(`${base}/checkout`, { waitUntil: 'networkidle' });
  await page.getByLabel('Full name').fill('Jane Wanjiru');
  await page.getByLabel('Phone number').fill('0712345678');
  await page.getByLabel('Delivery area').selectOption('Kilimani');
  await page.getByLabel('Address or landmark').fill('Argwings Kodhek Road, Apt 4');
  await page.screenshot({ path: `${dir}/checkout-filled-${w}.png`, fullPage: true });
  await ctx.close();
}

const m = await browser.newContext({ viewport: { width: 375, height: 812 } });
const mp = await m.newPage();
await mp.goto(`${base}/`, { waitUntil: 'networkidle' });
await mp.getByRole('button', { name: 'Open menu' }).click();
await mp.waitForTimeout(600);
await mp.screenshot({ path: `${dir}/mobile-menu-375.png` });
await m.close();

const q = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const qp = await q.newPage();
await qp.goto(`${base}/shop/intatherm-safe-touch-basin-mixer-tap`, { waitUntil: 'networkidle' });
await qp.getByTestId('order-on-whatsapp').click();
await qp.waitForTimeout(500);
await qp.screenshot({ path: `${dir}/product-whatsapp-dialog-1440.png` });
await browser.close();
console.log('flow shots written');
