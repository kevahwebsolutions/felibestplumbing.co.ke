# Lighthouse V2 (mobile, production build)

Measured 2026-11-17 with the Lighthouse CLI against `next build` + `next start`, Playwright Chromium, default mobile emulation and simulated Slow 4G throttling. Raw JSON in `docs/lighthouse-v2/`.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 54 | 100 | 96 | 100 | 4.8 s | 1,700 ms | 0 |
| `/services/emergency-plumbing` | 51 | 100 | 96 | 100 | 4.9 s | 2,460 ms | 0 |
| `/shop` | 51 | 100 | 100 | 100 | 4.5 s | 4,330 ms | 0 |
| `/shop/intatherm-safe-touch-basin-mixer-tap` | 54 | 100 | 100 | 100 | 4.5 s | 2,450 ms | 0 |
| `/contact` | 60 | 100 | 96 | 100 | 4.4 s | 1,240 ms | 0 |
| `/gallery` | 55 | 100 | 100 | 100 | 5.5 s | 1,180 ms | 0 |
