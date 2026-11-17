// Captures the mobile menu panel into docs/screens-v2/.
import { chromium } from '@playwright/test';
const base = process.env.BASE_URL ?? 'http://localhost:3001';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 375, height: 812 } })).newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.getByRole('button', { name: 'Open menu' }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: 'docs/screens-v2/mobile-menu-375.png' });
await b.close();
