# FELIBEST PLUMBING - VERSION 2: "LOOKS LIKE A PLUMBING COMPANY"

You are the lead engineer and art director. Work autonomously end to end. Do not ask questions: decide, record every decision in `DECISIONS-V2.md`, and keep going. Commit after each phase. Production quality only: no placeholders, no TODO comments, no lorem ipsum, no emojis in code (Lucide React icons or standard Unicode symbols only).

## 0. Situation

- This folder is a git worktree on branch `revamp/plumbing-v2`, created from `revamp/clay-2026`. Version 1 (claymorphism) is finished, approved by the owner, tagged `v1-clay`, and MUST stay untouched. Never modify branch `revamp/clay-2026`, the tag, or the other worktree folder. Do not push or deploy.
- Keep ALL functionality exactly as it is: routes and old-URL redirects, the data layer (Drizzle/SQLite, seeds, migrations), cart and checkout, admin back end, first-party analytics and its tracking events, forms, SEO metadata and JSON-LD, sitemap, tests. Only the presentation layer changes: design tokens, layout, components, imagery, copy tone, motion.
- Discovery first: read `README.md`, `DECISIONS.md`, `docs/QUALITY.md`, `package.json`, the app folder structure, the design tokens and shared components, and the data files. Then write `docs/v2-plan.md` listing which components and pages change, and proceed.

## 1. Why a second version

A reviewer said v1 "does not look like a plumbing website". Claymorphism reads as a playful app or toy brand. Version 2 must be recognisable as a serious, trustworthy trade business within two seconds, on a phone, with no logo visible. Design it as if for the best plumbing company in Nairobi, not as a tech product. Do not carry over claymorphism at all: no puffy inflated shadows, no pastel blobs, no giant radii, no floating bubbles.

## 2. Art direction

Mood: confident, practical, industrial, clean. Think professional trade contractor: real work, real tools, clear prices, fast contact.

- Photography-led. Review the real photos in `legacy/images/gallery`, `legacy/images/services`, `legacy/images/services2` and `legacy/images/product` by actually opening them. Pick the sharpest, best-lit real job photos for the hero, service cards, gallery and about page. Reject low-resolution or blurry ones. Optimise through the existing sharp pipeline (webp, max 1600px). Use duotone navy overlays so mixed-quality photos look consistent.
- Palette from the brand: deep navy (derive darker steps from `#0c4c93`, e.g. `#06264a` for dark sections), brand blue `#0c4c93`, sky `#51acfb` for highlights, orange `#ff4917` reserved for calls to action and emergency elements only, plus steel greys and white. Add a subtle copper/brass accent (`#b87333`) used sparingly for pipe-fitting details. Page background is white or very light steel grey, not tinted pastel.
- Typography: a strong condensed display face for headings (Barlow Condensed or Oswald, bold, often uppercase) paired with Inter for body, loaded with next/font. Tight, confident hierarchy. Numbers (prices, stats, phone) set large.
- Shape: small to medium radii (6-12px), crisp 1px borders, restrained flat shadows. Buttons are solid, rectangular-ish and heavy.
- Plumbing visual language: pipe-run connector lines (SVG) that link sections and "draw" as you scroll; pipe-fitting icons (elbow, tee, coupling, gate valve, tap, wrench, drain, geyser, tank, shower) drawn as a consistent custom SVG icon set in a duotone blue and white (copper highlight) style; a blueprint grid texture on dark sections; a thin animated flowing-water line used as a divider; water drop used only as the logo mark and tiny accents.
- The logo is a blue drop with orange FP and a white circular wordmark: always place it on navy or white-backed header areas where it is legible.

## 3. Page blueprint

Global:
- Top utility bar (desktop): "24/7 Emergency" with the phone number in large type, email, working hours, social links.
- Header: logo, nav (Services, Shop, Pricing, Gallery, About, Contact), prominent orange "Call Now" button, cart icon. Sticky and compact on scroll. Mobile: hamburger opens a full-height navy panel with big tap-to-call and WhatsApp buttons.
- Mobile sticky bottom action bar on every page: Call, WhatsApp, Book, Cart (44px+ targets).
- Footer: dark navy with blueprint grid, services list, coverage areas, contact, hours, socials, credits "Kevah Web Solutions", dynamic year.

Home page (in this order, adapt as needed):
1. Hero: full-bleed real work photo with navy gradient overlay, headline in the style of "Nairobi's 24/7 Plumbers. Fixed Right, First Time." (keep claims to what the old site already stated: 24/7, on-time guarantee, 100% satisfaction guarantee, you approve the price before work starts, licensed), two CTAs (Call now in orange, Book online), and a compact quote/booking form card on the right that posts to the existing enquiry endpoint.
2. Trust strip: 4+ years combined experience, 1300+ installs, 600+ repairs, licensed technicians, on-time guarantee, with count-up.
3. Emergency band: bold orange/navy strip "Burst pipe? Blocked toilet? No water?" with tap-to-call.
4. Services: photo cards grouped by Emergency, Repairs, Installations, Bathrooms and Heating, Commercial. Each card has a real photo, a pipe-fitting icon, a one-line summary and "View service".
5. How it works: Call, We diagnose, You approve the price, Fixed and guaranteed - presented as a horizontal pipe run with valve nodes on desktop, vertical on mobile.
6. Recent work: real photo grid or before/after slider (only if genuine before/after pairs exist in the images; otherwise a clean project grid) linking to the gallery.
7. Shop teaser: "Plumbing supplies" featured products.
8. Why choose Felibest: licensed team, transparent pricing, guarantee, founder note from Mr. Felix.
9. Testimonials (existing ones, verbatim).
10. Coverage areas + map embed.
11. FAQ teaser and final CTA band.

Other pages: restyle every page consistently (services index and all service detail pages with a photo header, "what we fix", process, FAQs, related services, sticky quote card; pricing with clear rate tables and plan cards, KES; gallery masonry with filters and lightbox; about; testimonials; FAQ accordion; blog index and posts with clean editorial layout; contact; coverage; privacy; terms; 404 with a "burst pipe" themed message and links).

Shop (restyle as a trade-supplies catalogue): category icon bar, spec-forward product cards (brand, size, material, key spec chips, SKU, stock badge, price in KES), clear Add to Cart, product page with spec table, "Need it installed? Book a plumber" cross-sell panel, cart drawer and checkout restyled to match.

Admin and dashboard: restyle to a clean, utilitarian look consistent with the new palette (no clay). The analytics dashboard keeps all charts, filters and behaviour, but with a sharper, data-dense look: navy sidebar, white cards, 1px borders, brand-coloured series, orange only for alerts and key actions.

## 4. Motion (Framer Motion, purposeful not bouncy)

Staggered entrance transitions, scroll-triggered `whileInView` fade-ups and subtle scale-ups, pipe-run lines that draw on scroll (SVG `pathLength`), count-up stats, valve-wheel rotate on hover, button press states, animated flowing-water divider, smooth page transitions. Every animation is guarded by `useReducedMotion` so reduced-motion users get static layouts. No layout shift, no animation that delays content or hurts mobile performance.

## 5. Responsiveness and accessibility

Mobile first, 320px to 1920px, no horizontal scroll, touch targets 44px+, readable type sizes, tap-to-call everywhere a phone number appears. WCAG AA contrast verified with a tool, not by eye. Visible focus styles, semantic landmarks, one h1 per page, alt text on all images, keyboard-operable menus, accordions, drawers and lightbox.

## 6. Quality gates (do them for real and report real numbers)

1. `tsc --noEmit`, ESLint, `next build`, Vitest and Playwright must pass. Update tests that depend on changed selectors rather than deleting them.
2. Run Lighthouse against the PRODUCTION build (`next build` then `next start`) using the Lighthouse CLI with a Chromium that Playwright installs, in mobile mode, for these routes: `/`, a service page, `/shop`, a product page, `/contact`, `/gallery`. Save the JSON and a summary table to `docs/LIGHTHOUSE-V2.md`. Fix problems until Performance is 90+ on mobile where achievable (optimise hero image with `priority` and correct `sizes`, lazy-load everything below the fold, avoid heavy client JS, preload fonts, defer analytics), and Accessibility, Best Practices and SEO are 95+. If a target cannot be reached, state the measured number and the reason.
3. Run an automated accessibility scan with `@axe-core/playwright` on every route and fix all serious and critical violations, including colour contrast.
4. Playwright screenshots of every route at 375, 768 and 1440 widths into `docs/screens-v2/`. Open and inspect the home page, a service page, the shop, a product page, checkout, admin dashboard and the mobile menu by eye, and also run an automated horizontal-overflow check on all routes. Fix every defect found.
5. Re-run the redirect check script (all old URLs still 301 to working pages) and the internal link checker.

## 7. Deliverables

Working app on branch `revamp/plumbing-v2`, one commit per phase, `DECISIONS-V2.md`, `docs/v2-plan.md`, `docs/LIGHTHOUSE-V2.md`, `docs/screens-v2/`, and `docs/V1-vs-V2.md` (short comparison of the two designs for the client demo, with the exact commands to run each side by side on ports 3000 and 3001). Do not push, do not deploy, do not touch v1. End with a short summary of what changed and the real measured scores.

Begin now with discovery, then proceed through every phase without stopping for confirmation.
