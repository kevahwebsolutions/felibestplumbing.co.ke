# Lighthouse V2 (mobile, production build)

Measured 2026-11-18 with the Lighthouse CLI (`scripts/lighthouse-v2.mjs`) against `next build` + `next start`, using the Playwright Chromium, default mobile emulation (Moto G Power profile, simulated Slow 4G, 4x CPU slowdown). Raw JSON is in `docs/lighthouse-v2/`.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 50 | 100 | 96 | 100 | 5.1 s | 1,780 ms | 0 |
| `/services/emergency-plumbing` | 45 | 100 | 96 | 100 | 6.6 s | 3,930 ms | 0 |
| `/shop` | 47 | 100 | 100 | 100 | 5.0 s | 6,370 ms | 0 |
| `/shop/intatherm-safe-touch-basin-mixer-tap` | 51 | 100 | 100 | 100 | 5.0 s | 3,980 ms | 0 |
| `/contact` | 53 | 100 | 96 | 100 | 4.7 s | 2,740 ms | 0 |
| `/gallery` | 54 | 100 | 100 | 100 | 5.3 s | 1,390 ms | 0 |

## Result against the targets

- Accessibility 100 on all six routes. SEO 100 on all six. Best Practices 100 on shop, product and gallery, 96 on home, service and contact (the only failing audit is Chrome's "Issues panel" entry, which I could not attribute to a specific resource).
- **Performance 90+ was NOT reached.** Measured mobile Performance is 45 to 54 (default run). The drivers are Total Blocking Time (1.4 to 6.4 s on this machine) and a 4.5 to 6.6 s LCP.

## Why, and what was tried

- The Lighthouse benchmark index on this machine was 530 to 820 (the reference mobile profile assumes a faster CPU), and TBT varies by several seconds between identical runs. The unmodified v1 build measured on the same machine scored 43 on `/` (TBT 2.0 s) and 49 on `/terms` (TBT 5.8 s). V2 is on par or slightly better, so the gap is test hardware plus Next.js 16 and React hydration cost, not the new design. A text-only page (`/terms`) also scores about 54, which shows a floor independent of page content.
- Changes made for performance: hero image with `priority`, `quality=70` and 100vw `sizes`; page-hero images also `priority`; WebP only (AVIF decode was slower on this CPU); server HTML is visible before hydration (the page transition no longer starts at opacity 0); scroll reveals moved to pure CSS; Framer Motion removed from buttons, product cards and the cart badge; Lenis removed; Google Maps made click-to-load (it added about 360 KB of script and about 3 s of TBT on contact); `next/font` with `display: swap`; the analytics beacon is a tiny first-party script.
- Not done: reducing the remaining client islands (header dialog, cart drawer, booking form, carousel) to server components. That is the next step if 90+ is required on real devices. Re-measure on a faster machine or on the deployed site before drawing conclusions.

## Diagnostic: same pages with CPU slowdown 2x

`--throttling.cpuSlowdownMultiplier=2`, a rough calibration for this slower machine. Not the official figure.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 54 | 100 | 96 | 100 | 4.8 s | 1,700 ms | 0 |
| `/services/emergency-plumbing` | 51 | 100 | 96 | 100 | 4.9 s | 2,460 ms | 0 |
| `/shop` | 51 | 100 | 100 | 100 | 4.5 s | 4,330 ms | 0 |
| `/shop/intatherm-safe-touch-basin-mixer-tap` | 54 | 100 | 100 | 100 | 4.5 s | 2,450 ms | 0 |
| `/contact` | 60 | 100 | 96 | 100 | 4.4 s | 1,240 ms | 0 |
| `/gallery` | 55 | 100 | 100 | 100 | 5.5 s | 1,180 ms | 0 |
