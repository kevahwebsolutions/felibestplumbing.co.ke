# Lighthouse V2 (mobile, production build)

Measured 2026-11-17 with the Lighthouse CLI against `next build` + `next start`, Playwright Chromium, default mobile emulation and simulated Slow 4G throttling. Raw JSON in `docs/lighthouse-v2/`.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 47 | 94 | 96 | 100 | 5.2 s | 3,050 ms | 0 |
| `/services/emergency-plumbing` | 47 | 100 | 96 | 100 | 4.9 s | 6,100 ms | 0 |
| `/shop` | 46 | 99 | 100 | 100 | 4.9 s | 8,510 ms | 0 |
| `/shop/intatherm-safe-touch-basin-mixer-tap` | 53 | 100 | 100 | 100 | 4.7 s | 4,580 ms | 0 |
| `/contact` | 52 | 100 | 96 | 100 | 4.9 s | 2,980 ms | 0 |
| `/gallery` | 48 | 100 | 100 | 100 | 5.6 s | 3,740 ms | 0 |
