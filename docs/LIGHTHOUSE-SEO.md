# Lighthouse SEO run (mobile, production build)

Measured 2026-11-23 with the Lighthouse CLI against `next build` + `next start` (NEXT_PUBLIC_SITE_URL=https://felibestplumbing.co.ke), Playwright Chromium, default mobile emulation with simulated Slow 4G and 4x CPU slowdown. Raw JSON in `docs/lighthouse-seo/`. Targets: SEO 100, Best Practices 95+, Accessibility 95+. Performance is reported, not targeted.

| Route | SEO | Best Practices | Accessibility | Performance | LCP | TBT | CLS | Audits below 100 |
|---|---|---|---|---|---|---|---|---|
| `/` | 100 | 96 | 100 | 68 | 1.0 s | 4,340 ms | 0 | inspector-issues |
| `/services/emergency-plumbing` | 100 | 96 | 100 | 55 | 4.7 s | 1,950 ms | 0 | inspector-issues |
| `/services/drain-lines` | 100 | 96 | 100 | 50 | 5.1 s | 3,520 ms | 0 | inspector-issues |
| `/services/solar-water-heater` | 100 | 96 | 100 | 67 | 1.1 s | 5,850 ms | 0 | inspector-issues |
| `/blog/low-water-pressure-causes-and-fixes` | 100 | 100 | 100 | 69 | 0.9 s | 4,730 ms | 0 | - |
| `/shop` | 100 | 100 | 100 | 67 | 0.9 s | 4,550 ms | 0 | - |
| `/shop/category/showers` | 100 | 100 | 100 | 70 | 0.9 s | 3,190 ms | 0 | - |
| `/shop/milano-modern-shower` | 100 | 96 | 100 | 50 | 5.1 s | 4,840 ms | 0 | inspector-issues |
| `/pricing` | 100 | 100 | 100 | 71 | 0.9 s | 2,590 ms | 0 | - |
| `/gallery` | 100 | 100 | 100 | 99 | 1.1 s | 110 ms | 0 | - |
| `/about` | 100 | 100 | 100 | 70 | 1.2 s | 3,580 ms | 0.001 | - |
| `/contact` | 100 | 96 | 100 | 69 | 0.9 s | 4,380 ms | 0 | inspector-issues |
| `/coverage` | 100 | 100 | 100 | 70 | 1.0 s | 4,390 ms | 0 | - |
| `/faq` | 100 | 96 | 100 | 79 | 0.9 s | 870 ms | 0 | inspector-issues |
## Notes

- SEO is 100 and Accessibility is 100 on every route. Best Practices is 96 on seven routes and 100 on the rest, above the 95 target; the only audit below 100 is Chrome's `inspector-issues` entry for a Content Security Policy issue that lists no sub-items.
- Performance is reported, not targeted, and it varies by 10-20 points between runs on this shared Windows PC (for example `/` scored 83 and then 68 on identical code). The LCP breakdown shows the time is element render delay caused by main-thread JavaScript under 4x CPU throttling (TBT 2-6 s), not slow images or server response (time to first byte about 0.13-0.19 s). Layout shift is 0 everywhere. This work changed no client JavaScript, and the numbers are in line with `docs/LIGHTHOUSE-V2.md`, so there is no regression, but the heavy client islands (animation and gallery libraries) remain the main performance task.
