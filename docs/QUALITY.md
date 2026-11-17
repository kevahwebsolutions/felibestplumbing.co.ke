# Quality gates: what was run

Run on 2026-11-17 against the production build (`next build`, `next start`).

| Gate | Result |
|---|---|
| `tsc --noEmit` | clean |
| ESLint | 0 errors, 0 warnings |
| `next build` | clean, no warnings |
| Vitest (40 tests: cart maths, KES formatting, zod schemas, analytics aggregation, UA and privacy helpers) | all pass |
| Playwright smoke (5 tests: tracking beacon incl. bot and /admin exclusion, booking form, add to cart and checkout, admin login with forced password change and product create, anonymous admin protection) | all pass |
| `npm run check:redirects` | 108 legacy URLs all answer 301 to a 200 page |
| `npm run check:site` | 58 pages, 56 unique internal links: 0 problems (one h1, title, description, canonical, alt text on all images, no broken internal links, manifest and PWA icons present) |
| `npm run screens` | every public and admin route at 375, 768 and 1440 px saved in `docs/screens/`; no horizontal overflow detected (`REPORT.txt`) |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Security headers | CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, nosniff present |

A visual review of the home page (1440 and 375) and the admin dashboard found one defect, the featured service card rendering white on white, which was fixed.

## Not measured

- **Lighthouse scores were not run**, so no Performance, Accessibility, Best Practices or SEO numbers are claimed. Run Lighthouse on the deployed site and check mobile Performance in particular: the pages use `next/image` with webp sources, lazy loading and no render-blocking third-party scripts, but the Google Maps embed on /contact and the large gallery pages are the likeliest cost.
- Colour pairings were chosen for WCAG AA (see DECISIONS.md) but not machine-audited with a contrast tool.
- Keyboard order and reduced-motion paths were built in (skip link, focus rings, `useReducedMotion` guards, CSS media query) but only exercised by automated tests, not a manual screen-reader pass.
- The seeded demo analytics are fabricated by design; the dashboard's "online now" shows 0 until real traffic arrives.
