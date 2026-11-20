# Lighthouse V2 light vs V2 dark (mobile, production build)

Measured 2026-11-20 on the same machine, back to back, with the Lighthouse CLI (default mobile emulation, simulated Slow 4G) against `next build` + `next start` of each branch, on the same database. Every route was run 3 times; the table shows the **median** performance score with the three individual runs in brackets (scripts: `scripts/lighthouse-compare.mjs`, summaries in `docs/lighthouse-light/summary.json` and `docs/lighthouse-dark/summary.json`).

The benchmark index of this machine was about 1966 to 2404 (a reference mid-range phone is about 1000 to 1500 on Lighthouse's scale, so absolute scores here are conservative and vary a lot from run to run: the same page moved by up to 20 points between runs).

| Route | Perf light (runs) | Perf dark (runs) | A11y / BP / SEO light | A11y / BP / SEO dark | LCP light vs dark | TBT light vs dark | CLS light |
|---|---|---|---|---|---|---|---|
| `/` | 84 (83, 89, 84) | 70 (60, 71, 70) | 100 / 96 / 100 | 100 / 96 / 100 | 0.9 s vs 4.7 s | 638 vs 542 ms | 0.000 |
| `/services/emergency-plumbing` | 70 (82, 70, 70) | 60 (56, 60, 78) | 100 / 96 / 100 | 100 / 96 / 100 | 4.7 s vs 5.8 s | 379 vs 753 ms | 0.000 |
| `/shop` | 86 (86, 97, 75) | 77 (77, 61, 83) | 100 / 100 / 100 | 100 / 100 / 100 | 0.9 s vs 4.6 s | 552 vs 297 ms | 0.000 |
| `/shop/intatherm-safe-touch-basin-mixer-tap` | 75 (75, 66, 77) | 78 (77, 78, 78) | 100 / 96 / 100 | 100 / 100 / 100 | 4.5 s vs 4.4 s | 413 vs 320 ms | 0.000 |
| `/contact` | 90 (89, 90, 90) | 80 (80, 70, 80) | 100 / 96 / 100 | 100 / 96 / 100 | 0.9 s vs 4.4 s | 398 vs 255 ms | 0.000 |

## Reading the numbers honestly
- Accessibility is 100 and SEO is 100 on every route on both branches. Best Practices is 96 or 100 on both; I did not keep the raw JSON, so I did not investigate the 96 and make no claim about its cause (it is the same score on both branches for home, service and contact).
- Median performance is higher on the light build on four routes (home 84 vs 70, service 70 vs 60, shop 86 vs 77, contact 90 vs 80) and **lower on the product page (75 vs 78)**. The product difference is inside the run-to-run noise (light 75, 66, 77; dark 77, 78, 78) but it is not an improvement. A plausible cause is the new "Order this on WhatsApp" dialog adding a little client JavaScript to the product page (TBT 413 ms vs 320 ms); I have not profiled it to confirm.
- LCP is about 0.9 s on the light home, shop and contact pages against 4.4 to 4.7 s on dark. The light hero is a framed photo at roughly 60 percent of the viewport width instead of a full-bleed 100vw photo, which is the most likely reason, but this was not isolated. Service and product pages measure LCP of 4.4 to 4.7 s on both branches on this machine and this task did not change their main photo.
- TBT is higher on the light build on four of five routes (for example home 638 vs 542 ms, shop 552 vs 297 ms) and lower on the service page (379 vs 753 ms). All are in the "moderate" range on this slower-than-reference machine. Scores are still higher because LCP dominates them here.
- CLS is 0 on every route.
- Conclusion: the light theme is not slower than the dark theme on this machine, except for a small, unconfirmed product-page cost. Run-to-run spread on a single page was up to 20 points, so treat differences under about 10 points as noise.
