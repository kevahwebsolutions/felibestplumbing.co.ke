import Database from 'better-sqlite3';
import { expect, test } from '@playwright/test';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'E2eAdminPass#1';
const NEW_PASSWORD = 'E2eNewPass#2026';

test.describe.configure({ mode: 'default' });

test('tracking beacon fires on page load and the endpoint stores real visits but not bots', async ({ page, request }) => {
  const tracked = page.waitForRequest((r) => r.url().endsWith('/api/track') && r.method() === 'POST');
  await page.goto('/services');
  await tracked;
  const db = new Database('./data/e2e.db', { readonly: true });
  const count = (path: string) => (db.prepare('SELECT COUNT(*) AS n FROM events WHERE path = ?').get(path) as { n: number }).n;
  const human = 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
  const body = (path: string) => JSON.stringify({ type: 'pageview', path, sid: 'e2esession01' });
  expect((await request.post('/api/track', { data: body('/e2e-human'), headers: { 'user-agent': human, 'content-type': 'text/plain' } })).status()).toBe(204);
  expect((await request.post('/api/track', { data: body('/e2e-bot'), headers: { 'user-agent': 'Googlebot/2.1', 'content-type': 'text/plain' } })).status()).toBe(204);
  expect((await request.post('/api/track', { data: body('/admin/secret'), headers: { 'user-agent': human, 'content-type': 'text/plain' } })).status()).toBe(204);
  expect(count('/e2e-human')).toBe(1);
  expect(count('/e2e-bot')).toBe(0);
  expect(count('/admin/secret')).toBe(0);
  const row = db.prepare('SELECT visitor_id AS v FROM events WHERE path = ?').get('/e2e-human') as { v: string };
  expect(row.v).toMatch(/^[a-f0-9]{20}$/);
  db.close();
});

test('booking form validates and submits', async ({ page }) => {
  await page.goto('/contact');
  const form = page.getByRole('form', { name: 'Book a plumber' });
  await form.getByRole('button', { name: 'Request a plumber' }).click();
  await expect(form.getByText('Please enter your name')).toBeVisible();
  await form.getByLabel('Your name').fill('Test Customer');
  await form.getByLabel('Phone number').fill('0798174201');
  await form.getByLabel('Service needed').selectOption('Burst pipe repair');
  await form.getByLabel('Tell us what is wrong (optional)').fill('Pipe burst under the kitchen sink');
  await form.getByRole('button', { name: 'Request a plumber' }).click();
  await expect(page.getByRole('heading', { name: /Thank you, we have your request/ })).toBeVisible();
});

test('add to cart and checkout creates an order', async ({ page }) => {
  await page.goto('/shop');
  await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
  await page.getByRole('button', { name: /^Add to cart: / }).first().click();
  await expect(page.getByText(/added to your cart/).first()).toBeVisible();
  await page.getByRole('button', { name: /Open cart/ }).first().click();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel('Full name').fill('Order Tester');
  await page.getByLabel('Phone number').fill('0712345678');
  await page.getByLabel('Delivery area').selectOption('Karen');
  await page.getByLabel('Address or landmark').fill('Karen Road, near the shopping centre');
  await page.getByRole('radio', { name: /Pay on delivery/ }).click();
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page).toHaveURL(/\/order\/FP-[A-Z0-9]{6}$/, { timeout: 45_000 });
  await expect(page.getByRole('heading', { name: 'Thank you, your order is in' })).toBeVisible();
});

test('admin login, forced password change and product creation', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Incorrect email or password.')).toBeVisible();

  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/change-password/, { timeout: 45_000 });
  await page.getByLabel('Current password').fill(ADMIN_PASSWORD);
  await page.getByLabel('New password', { exact: true }).fill(NEW_PASSWORD);
  await page.getByLabel('Confirm new password').fill(NEW_PASSWORD);
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText(/products still use placeholder prices/)).toBeVisible();

  await page.goto('/admin/products/new');
  await page.getByLabel('Product name').fill('E2E Test Mixer Tap');
  await page.getByLabel('Price (KES)').fill('2500');
  await page.getByLabel('Stock', { exact: true }).fill('9');
  await page.getByLabel('Description').fill('A product created by the end to end test.');
  await page.getByLabel('Published in the shop').click();
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.getByText('E2E Test Mixer Tap')).toBeVisible();

  await page.goto('/shop/e2e-test-mixer-tap');
  await expect(page.getByRole('heading', { level: 1, name: 'E2E Test Mixer Tap' })).toBeVisible();
});

test('admin routes are protected for anonymous users', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const res = await page.request.get('/admin/export/orders');
  expect(res.status()).toBe(401);
  await page.goto('/admin/products');
  await expect(page).toHaveURL(/\/admin\/login/);
  const headers = (await page.request.get('/admin/login')).headers();
  expect(headers['x-robots-tag']).toContain('noindex');
  await ctx.close();
});
