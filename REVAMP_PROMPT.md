# FELIBEST PLUMBING - FULL REVAMP (claymorphism, e-commerce, admin, analytics)

You are the lead engineer. Work autonomously from start to finish. Do not ask questions: decide, record every decision in `DECISIONS.md`, and keep going. Commit after each phase. Production quality only: no placeholders, no TODO comments, no lorem ipsum, no emojis in code (use Lucide React icons or standard Unicode symbols).

## 0. Context (already discovered, trust this)

- Repo: static site on GitHub Pages (`CNAME` = felibestplumbing.co.ke), ~45 hand-built HTML pages, `css/style.css` (231 KB), `js/bundle.js` (Swiper), images in `images/` (152 MB, many 1-2 MB), `videos/video1.mp4` (8 MB), `.git` is 139 MB, and `node_modules/` (sharp, win32 binaries) was committed by mistake.
- Business: Felibest Plumbing, Nairobi, Kenya. 24 hours, 7 days. Phone/WhatsApp +254 798 174 201. Emails: felibestplumbing@gmail.com and info@felibestplumbing.co.ke. Founder: Mr. Felix (CEO and Founder). Existing claims to keep: 4+ years combined experience, 1300+ plumbing installs, 600+ repairs fixed, on-time guarantee, 100% satisfaction guarantee, you approve the price before work starts, fully licensed technicians.
- Socials: Facebook https://www.facebook.com/FelibestPlumbing/ , Instagram https://www.instagram.com/felibest_plumbing , X https://x.com/Felibest_ , TikTok https://www.tiktok.com/@felibestplumbing , YouTube https://youtube.com/@felibestplumbing
- Brand colours from the CSS and logo: navy `#0c4c93`, sky blue `#51acfb`, deep blue `#1e60aa`, orange accent `#ff4917` (CTA), surface `#f8f8fa`, text grey `#6c7176`. The logo (`images/logo.webp`, `images/Logo No Background.png` 2160x1360) is a blue water drop with an orange "FP" and a white circular wordmark, so it needs a dark or blue backing to be legible. Keep the logo and these colours as the brand.
- Existing forms post to Web3Forms (access key is in the old HTML). Move the key to an env var and never hard-code it. Flag it in the README as a value to rotate.
- Existing shop (`shop.html`, `shop-item.html`) is a dead template: no cart logic, prices in USD, 24 products across categories Sinks, Faucets, Pumps, Drains, Showers, Pipe Fittings, Steam Showers, Valves, Water Filtration, Water Heaters, Toilet Parts, Accessories. Real product photos are only in `images/product/` (a handful). `product.html` is a 404 stub.
- Known content defects to FIX in the revamp:
  - Header/footer show a wrong US address ("8494 Signal Hill Road Manassas, VA") - remove, use "Nairobi, Kenya".
  - USD prices and US copy ("nationwide", HomeAdvisor statistics, expired 2021 coupons on the price page) - rewrite for Kenya in KES, with editable offers.
  - Blog posts are US HVAC/furnace/thermostat/AC topics - replace with 8 original, accurate, Kenya-relevant plumbing articles (low water pressure, burst pipes, blocked toilets, tank maintenance, solar water heaters, instant shower faults, sewer smell, choosing mixers/taps).
  - Footer credit and copyright year are stale: use dynamic year and "Kevah Web Solutions".
  - Default `<title>`/meta on the home page is weak. Several pages are duplicates (`tank-installation-and-repair.html` and `Tank Installation and Repair.html`, `services-item01-03`, `gallery2/3`, `header.html` is a template fragment, `product.html` is a stub).
- Do not invent business facts (certifications, awards, addresses, reviews). Reuse what exists on the old pages. Where the old site has testimonials, reuse them verbatim.

## 1. Setup and safety

1. Create branch `revamp/clay-2026`.
2. `git rm -r --cached node_modules` and add a proper `.gitignore` (node_modules, .next, .env*, *.db, uploads). Do not rewrite history.
3. `git mv` all legacy files into `legacy/` (keep for content reference; delete nothing yet). Before moving, produce `docs/legacy-inventory.md`: every old page, its title, its target new route, and the old-to-new 301 redirect (include capitalised names and names with spaces such as `Tank Installation and Repair.html`, and `.html` to clean URL).
4. Windows-friendly: this is developed on Windows with Git Bash. Use cross-env, no bash-only scripts in package.json, forward-slash paths.

## 2. Stack (install everything needed, pin versions)

- Next.js (current stable, App Router) + TypeScript strict + Tailwind CSS + shadcn/ui on Radix primitives + Lucide React.
- Framer Motion for all motion. Lenis for smooth scroll (disabled under `prefers-reduced-motion`).
- Embla Carousel (replaces Swiper), yet-another-react-lightbox (gallery), Recharts (charts), TanStack Table (admin tables), react-hook-form + zod (all forms, shared client/server schemas), Zustand with persist (cart), Sonner (toasts), cmdk (admin quick search), next/font (Nunito or Baloo 2 for headings, Inter for body), sharp (image pipeline).
- Data: SQLite via Drizzle ORM + better-sqlite3, migrations committed, seed script. DB path and upload dir come from env (`DATABASE_PATH`, `UPLOAD_DIR`).
- Auth: Auth.js credentials or iron-session with bcrypt, a single seeded admin from env (`ADMIN_EMAIL`, `ADMIN_PASSWORD`), force password change on first login, login rate limiting, HttpOnly SameSite cookies.
- Output `standalone` for self-hosting. Provide `ecosystem.config.cjs` (PM2), `deploy/nginx.conf.example`, `.env.example`, `deploy/backup-db.sh` (SQLite online backup + 14-day retention), and a `README.md` with local run, build, and Linux server deploy steps. GitHub Pages cannot run this app, so say so in the README.

## 3. Design system: CLAYMORPHISM (the signature of the whole site)

Build tokens once in `tailwind.config` + `globals.css`, then use them everywhere:
- Soft pastel surfaces derived from the brand (tints of `#51acfb`, `#0c4c93`, warm white `#f8f8fa`, orange accents), never flat grey.
- Very large radii (24-48px), puffy "inflated" cards and buttons. Every clay surface uses a layered shadow: outer soft drop shadow + inner top-left highlight (inset white) + inner bottom-right shade (inset coloured). Provide utility classes: `clay-card`, `clay-button` (primary orange, secondary blue, ghost), `clay-input`, `clay-chip`, `clay-pill`, `clay-icon` (3D icon bubble), `clay-pressed` (active/pressed inset state).
- Tactile interaction: hover lifts and squishes slightly, press goes inset, focus rings are visible and on-brand.
- Creative water theme: floating clay droplets and bubbles in hero backgrounds (CSS/SVG, animated), wave dividers between sections, a pipe-and-valve motif in section headers, a clay "water level" scroll progress bar, a rotating clay wrench/drop badge on the emergency CTA. Draw 3D-style clay icons for every service as inline SVG with gradients (no external image dependencies).
- Motion (Framer Motion): staggered entrance transitions, scroll-triggered fade-ins and scale-ups using `whileInView` with `once`, hover and tap micro-animations on all interactive elements, animated count-up for stats, page transitions. Everything wrapped in a `useReducedMotion` guard so reduced-motion users get static layouts.
- No static, boring layouts: vary section composition (bento grids, overlapping cards, staggered columns, sticky scroll storytelling for "How it works").
- Mobile first. Every page fully responsive from 320px to 1920px. Touch targets at least 44px, no horizontal scroll, bottom sticky action bar on mobile (Call, WhatsApp, Book, Cart), mobile nav as a clay slide-over sheet. Check contrast (WCAG AA) on every pastel pairing and fix any that fail.
- Floating action cluster on every page: Call and WhatsApp (replace the old third-party WhatsApp widget with a native clay button linking `https://wa.me/254798174201` with a prefilled message).

## 4. Public site (all pages redesigned, content reused and corrected)

Home (hero with emergency CTA and booking card, trust stats count-up, services bento, how it works, featured products, before/after or work gallery teaser, testimonials carousel, coverage areas, FAQ teaser, final CTA), About (founder, mission and vision, values), Services index + one detail page for EVERY existing service (22+: drain lines, emergencies, bathroom renovations, gutter, glass cubicles, piping and repiping, shower head install, sink and tap repair, low water pressure, residential, commercial, consultation, sump pump, blocked toilet, blocked sink/bath/shower, leaking taps and mixers, burst pipes, sewer smell, electric instant shower, glass shower enclosure, solar water heater, tank installation and repair, plus heater installations, fire and safety, interior design found in the repo). Services are data-driven from one typed data file (slug, title, summary, body, FAQs, related images from `images/services*` and `images/gallery`, SEO fields) and each page has a booking CTA, related services, and Service JSON-LD. Price (service plans and rate guide in KES, editable offers, no US data), Gallery (merge gallery, gallery2, gallery3: masonry, category filters, lightbox), Testimonials, FAQ (animated accordion + FAQPage JSON-LD), Blog (index, post pages, reading time, related posts, 8 new articles), Contact (booking and enquiry form, map embed, hours, WhatsApp), Coverage areas, 404, Privacy and Terms.

Forms: react-hook-form + zod, server route handlers, save every enquiry/booking to the DB (admin inbox), then forward via Web3Forms using the env key. Honeypot + rate limit. Friendly success states with Framer Motion.

SEO (must not regress): keep all existing titles' intent, unique title/description/canonical/OG per page via the Metadata API, `sitemap.ts`, `robots.ts`, PlumbingService/LocalBusiness + Service + FAQ + Product + BreadcrumbList JSON-LD, proper `h1` per page, `manifest.webmanifest` with working 192/512 PNG icons generated from the logo, all old URLs 301 to new routes (from `docs/legacy-inventory.md`, via `next.config` redirects).

Performance: build an image pipeline script (`scripts/optimize-images.mjs`, sharp) that converts ONLY referenced images from `legacy/images` into `public/images` as webp, max 1600px wide, quality about 78, plus responsive sizes where useful. Never copy the 152 MB wholesale. Use `next/image`. Compress `video1.mp4` reference to a lazy-loaded poster-first video. Target Lighthouse mobile: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100.

## 5. E-commerce (modern clay redesign of the old unused shop)

- Shop: category sidebar/sheet with counts, price range slider, search, sort, tag chips, pagination or load-more, grid/list toggle, quick-view modal, stock badges, "New" and sale badges, skeleton loaders.
- Product page: gallery with zoom, price in KES, SKU, stock, quantity stepper, add to cart, tabs (Description, Additional information, Reviews), related products, Product JSON-LD.
- Cart: slide-over clay cart drawer with animated add-to-cart (item flies to the cart icon), full `/cart` page, persisted in localStorage, quantity edit, remove, subtotal, free-delivery progress bar configurable in admin settings.
- Checkout (no payment gateway keys needed): name, phone, email optional, delivery area, address, notes; payment options "Pay on delivery (cash or M-Pesa)" and "Order via WhatsApp" (prefilled message with the cart). Orders saved to DB with a public order reference and a `/order/[ref]` confirmation page. Build a `PaymentProvider` interface so M-Pesa Daraja STK push can be added later without refactoring, but do NOT implement Daraja now.
- Currency KES everywhere (`Intl.NumberFormat('en-KE')`).
- Seed the existing 24 products (names, categories, tags, descriptions) with KES placeholder prices (convert the old USD at 130 and round to the nearest 50). Mark them `isPlaceholderPrice` and show a visible admin notice "N products still use placeholder prices - confirm before going live". Use the real photos in `images/product/` where they exist and clay-style SVG category illustrations for the rest.

## 6. Admin back end at `/admin` (protected, not indexed, noindex headers)

Clay-styled, responsive (works on a phone), sidebar + command palette (cmdk).
- Products: table (search, filter, sort, bulk publish/unpublish/delete), create/edit form (name, slug auto, category, tags, price, sale price, SKU, stock, description, specs key-value, multiple image upload with drag-reorder and primary image, featured, published). Images go through sharp (re-encode to webp, strip metadata, max size, MIME and extension validation, size cap) into `UPLOAD_DIR` and are served via a route handler.
- Categories: CRUD with product counts.
- Orders: list and detail, status workflow (new, confirmed, out for delivery, delivered, cancelled), internal notes, printable invoice/packing slip, CSV export.
- Enquiries/Bookings inbox: status (new, contacted, done), notes, CSV export.
- Settings: business info, delivery fee and free-delivery threshold, WhatsApp number, offers/banners shown on the price page and home, change admin password.
- Audit-safe: zod validation on every server action, authorization check on every admin route and action, CSRF-safe (SameSite + server actions), no secrets in client bundles.

## 7. Analytics dashboard (admin home, the "wow" page)

Self-hosted first-party analytics, privacy-friendly (no cookies required, no raw IPs stored): a tiny client beacon and `/api/track` endpoint recording pageviews and events (`product_view`, `add_to_cart`, `checkout_start`, `order_placed`, `call_click`, `whatsapp_click`, `form_submit`). Visitor id = daily-rotating salted hash of IP + user agent. Parse device, browser and OS from the user agent; ignore bots, `/admin`, and `/api`; use the `CF-IPCountry` header for country when present. Add indexes and a nightly roll-up so queries stay fast.

Dashboard (Recharts, clay-themed, animated, with 7/30/90-day and custom range filter):
- KPI cards with count-up and delta versus the previous period: visitors, pageviews, avg pages per session, bounce rate, orders, revenue (KES), conversion rate, call and WhatsApp clicks, new enquiries.
- "Online now" live badge (last 5 minutes, auto-refresh).
- Area chart visitors and pageviews over time; bar chart top pages; donut for traffic sources; device split; browsers; hour-by-weekday heatmap; top products by views vs add-to-cart; conversion funnel (visit, product view, add to cart, checkout, order); recent orders and recent enquiries lists; low-stock alerts; best-selling categories.
- Every chart has an accessible table fallback, an empty state, and a loading skeleton. Seed a script `npm run seed:demo-analytics` that generates 90 days of realistic demo traffic so the dashboard can be shown immediately; it must refuse to run when `NODE_ENV=production`.

## 8. Quality gates (do all of these, fix everything found)

- `tsc --noEmit`, ESLint, and `next build` all clean. Unit tests (Vitest) for cart maths, price formatting, zod schemas, and analytics aggregation. Playwright smoke tests for: add to cart and checkout, admin login and product create, form submission, tracking beacon.
- Run the site locally, then use Playwright to screenshot EVERY route at 375, 768 and 1440 widths, inspect them, and fix any overflow, clipped text, low contrast, or broken layout. Save screenshots to `docs/screens/`.
- Validate: no broken internal links, every old URL redirects (script that checks the redirect map), sitemap lists only real routes, images all have alt text, one h1 per page, keyboard navigation and focus order work, reduced-motion path works.
- Security review: headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy), no secrets committed, `.env.example` only, dependency audit, upload hardening, rate limits on login/forms/track.

## 9. Deliverables

Working app in the repo root, `README.md`, `DECISIONS.md`, `docs/legacy-inventory.md`, `.env.example`, deploy files, tests, one commit per phase on `revamp/clay-2026`. Do not push, do not deploy, and do not delete `legacy/`. Finish with a short summary: what was built, how to run it (`npm i`, copy `.env.example`, `npm run db:migrate`, `npm run db:seed`, `npm run dev`), admin URL, and any items needing the owner (confirm product prices, rotate the Web3Forms key, confirm business address and real offers).

Begin now with phase 1 (setup and safety), then proceed through every phase without stopping for confirmation.
