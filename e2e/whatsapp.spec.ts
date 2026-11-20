import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import sharp from 'sharp';

test.describe.configure({ mode: 'default' });

/** wa.me is an external site: answer it locally so the test never leaves the machine. */
async function stubWhatsApp(ctx: BrowserContext) {
  await ctx.route(/https:\/\/(wa\.me|api\.whatsapp\.com)\/.*/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>WhatsApp stub</title>' }));
}

async function firstProduct(page: Page) {
  await page.goto('/shop');
  const card = page.locator('article').first();
  const name = (await card.getByRole('heading', { level: 3 }).innerText()).trim();
  const href = (await card.getByRole('link', { name }).first().getAttribute('href'))!;
  return { name, href, slug: href.replace('/shop/', '') };
}

async function fillCheckout(page: Page, method: RegExp) {
  await page.getByLabel('Full name').fill('Wa Tester');
  await page.getByLabel('Phone number').fill('0712345678');
  await page.getByLabel('Delivery area').selectOption('Kilimani');
  await page.getByLabel('Address or landmark').fill('Argwings Kodhek Road, Apt 4');
  await page.getByRole('radio', { name: method }).click();
}

test('desktop checkout saves the order, then opens a wa.me link with the ref, product name and absolute product URL', async ({ page, context }) => {
  await stubWhatsApp(context);
  const product = await firstProduct(page);
  await page.getByRole('button', { name: /^Add to cart: / }).first().click();
  await page.getByRole('button', { name: /Open cart/ }).first().click();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await fillCheckout(page, /Pay on delivery/);
  const popupPromise = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Place order' }).click();
  const popup = await popupPromise;
  await popup.waitForURL(/^https:\/\/wa\.me\/\d+\?text=/, { timeout: 45_000 });
  await expect(page).toHaveURL(/\/order\/FP-[A-Z0-9]{6}$/, { timeout: 45_000 });
  const ref = page.url().split('/').pop()!;
  const text = decodeURIComponent(new URL(popup.url()).searchParams.get('text') ?? '');
  expect(new URL(popup.url()).pathname).toMatch(/^\/\d{10,15}$/);
  expect(text).toContain(ref);
  expect(text).toContain(product.name);
  expect(text).toMatch(new RegExp(`https://[^\\s]+/shop/${product.slug}(\\s|$)`));
  expect(text).toContain(`/order/${ref}`);
  expect(text).toContain('Wa Tester');
  expect(text).toContain('Kilimani');
  expect(popup.url().length).toBeLessThan(1950);
});

test('on a phone the same tab is redirected to wa.me and the order is still saved', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36' });
  await stubWhatsApp(ctx);
  const page = await ctx.newPage();
  const product = await firstProduct(page);
  await page.getByRole('button', { name: /^Add to cart: / }).first().click();
  await page.goto('/checkout');
  await fillCheckout(page, /Pay via WhatsApp/);
  await page.getByRole('button', { name: 'Place order' }).click();
  await page.waitForURL(/^https:\/\/wa\.me\/\d+\?text=/, { timeout: 45_000 });
  const text = decodeURIComponent(new URL(page.url()).searchParams.get('text') ?? '');
  expect(text).toMatch(/FP-[A-Z0-9]{6}/);
  expect(text).toContain(product.name);
  expect(text).toContain('Pay via WhatsApp');
  // Back from WhatsApp lands on the saved order.
  const ref = text.match(/FP-[A-Z0-9]{6}/)![0];
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`/order/${ref}$`));
  await expect(page.getByTestId('send-whatsapp')).toBeVisible();
  await ctx.close();
});

test('order page shows the green WhatsApp button and the already-saved note, and is noindex', async ({ page, context }) => {
  await stubWhatsApp(context);
  const product = await firstProduct(page);
  await page.goto(product.href);
  await page.getByTestId('order-on-whatsapp').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Full name').fill('Quick Orderer');
  await dialog.getByLabel('Phone number').fill('0722000111');
  await dialog.getByLabel('Delivery area').selectOption('Westlands');
  await dialog.getByLabel('Address or landmark').fill('Mpaka Road, Westlands');
  const popupPromise = context.waitForEvent('page');
  await dialog.getByRole('button', { name: /Save order and open WhatsApp/ }).click();
  const popup = await popupPromise;
  await popup.waitForURL(/^https:\/\/wa\.me\//, { timeout: 45_000 });
  const text = decodeURIComponent(new URL(popup.url()).searchParams.get('text') ?? '');
  expect(text).toContain(product.name);
  expect(text).toContain('Quick Orderer');
  await expect(page).toHaveURL(/\/order\/FP-[A-Z0-9]{6}$/, { timeout: 45_000 });
  const button = page.getByTestId('send-whatsapp');
  await expect(button).toBeVisible();
  await expect(button).toHaveText(/Send order on WhatsApp/);
  expect(await button.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  await expect(page.getByText('Your order is already saved.')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('product page exposes a valid JPEG og:image and the og tags WhatsApp needs', async ({ page, request, baseURL }) => {
  const product = await firstProduct(page);
  await page.goto(product.href);
  const og = async (p: string) => (await page.locator(`meta[property="${p}"]`).first().getAttribute('content')) ?? '';
  expect(await og('og:title')).toContain(product.name);
  expect(await og('og:description')).not.toBe('');
  expect(await og('og:url')).toContain(`/shop/${product.slug}`);
  expect(await og('og:type')).toBe('website');
  const image = await og('og:image');
  expect(image).toMatch(/^https?:\/\/.+\/og\/product\/.+/);
  expect(await og('og:image:type')).toBe('image/jpeg');
  // The configured public origin is not the test server, so fetch the same path from the test server.
  const res = await request.get(new URL(image).pathname, { baseURL });
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toBe('image/jpeg');
  expect(res.headers()['cache-control']).toMatch(/max-age/);
  const buf = await res.body();
  expect([buf[0], buf[1], buf[2]]).toEqual([0xff, 0xd8, 0xff]);
  const meta = await sharp(buf).metadata();
  expect(meta.format).toBe('jpeg');
  expect([meta.width, meta.height]).toEqual([1200, 630]);
  expect((await request.get('/og/product/does-not-exist', { baseURL })).status()).toBe(404);
});
