# Felibest Plumbing

Website, plumbing shop, admin back end and first-party analytics for Felibest Plumbing, Nairobi, Kenya.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Radix primitives, Framer Motion, SQLite (Drizzle ORM), and a claymorphism design system.

> **This app cannot run on GitHub Pages.** The old site was static HTML on GitHub Pages (the `CNAME` file). The new site has a database, an admin area and API routes, so it needs a Node.js server (a small Linux VPS is enough). See "Deploy to a Linux server" below. The old site is kept untouched in `legacy/`.

## Items that need the owner before going live

1. **Confirm product prices.** All 24 seeded products carry placeholder KES prices (old USD prices converted at 130 and rounded to the nearest 50). The admin dashboard shows "N products still use placeholder prices" until you confirm them in Products. Twelve products are real items from the old shop. Twelve more are unpublished starter drafts: edit or delete them.
2. **Rotate the Web3Forms access key.** The old key was hard-coded in the legacy HTML (`legacy/*.html`) and is in git history, so treat it as public. Create a new key at web3forms.com and put it in `WEB3FORMS_ACCESS_KEY`. It is never sent to the browser.
3. **Confirm the business address.** The old pages showed a wrong US address. The site now says "Nairobi, Kenya". Add the real street address in Admin, Settings.
4. **Confirm offers and the rate guide.** Offers are editable in Settings. The KES rate guide and the coverage area list on the public pages are indicative and live in `src/data/content.ts`. Edit them to match your real pricing and service areas.
5. **Testimonials.** The four testimonials are reused verbatim from the old site as requested. The names look like template content. Replace them in `src/data/content.ts` with real customer reviews when you have them.
6. **Change the seeded admin password** on first login (the app forces this).

## Requirements

- Node.js 20 or newer (developed on Node 24)
- npm
- Windows, macOS or Linux. No bash-only scripts are used in `package.json`.

## Run locally

```bash
npm i
cp .env.example .env        # then edit .env (see below)
npm run db:migrate
npm run db:seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`; you must choose a new password on first login)

Optional demo data so the analytics dashboard has something to show (refuses to run when `NODE_ENV=production`):

```bash
npm run seed:demo-analytics            # 90 days of realistic demo traffic, orders and enquiries
npm run seed:demo-analytics -- --clear # remove it again
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap, Open Graph and structured data |
| `DATABASE_PATH` | SQLite file (default `./data/felibest.db`) |
| `UPLOAD_DIR` | Where product images are stored (default `./data/uploads`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin account created by `npm run db:seed` |
| `SESSION_SECRET` | 32+ random characters, encrypts the admin session cookie (required in production) |
| `ANALYTICS_SALT` | Secret mixed into the daily-rotating visitor hash |
| `WEB3FORMS_ACCESS_KEY` | Forwards enquiries by email. Optional: enquiries are always saved to the database |
| `INSECURE_COOKIES` | Set to `1` only to test the production build over plain http on localhost |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js development server, production build, production server |
| `npm run typecheck` / `lint` | `tsc --noEmit` and ESLint |
| `npm test` | Vitest unit tests (cart maths, price formatting, zod schemas, analytics aggregation) |
| `npm run test:e2e` | Playwright smoke tests (cart and checkout, admin login and product create, form submission, tracking beacon). It starts its own server on port 3100 with a throw-away database |
| `npm run db:generate` | Create a new Drizzle migration after editing `src/db/schema.ts` |
| `npm run db:migrate` / `db:seed` | Apply migrations / seed categories, products, settings and the admin user |
| `npm run images` | Re-run the sharp image pipeline from `legacy/images` into `public/images` (referenced images only, webp, max 1600 px) |
| `npm run rollup` | Nightly analytics roll-up into `daily_stats` |
| `npm run check:redirects` | Checks every legacy URL answers 301 to its new route (needs the server running) |
| `npm run check:site` | Crawls a running site: one h1, titles, descriptions, canonicals, image alt text, broken internal links |
| `npm run screens` | Playwright screenshots of every route at 375, 768 and 1440 px into `docs/screens/` |

## Deploy to a Linux server

Tested layout: Ubuntu, Node 20+, nginx, PM2, a non-root user, app in `/var/www/felibest`.

```bash
# 1. Get the code and install
git clone <repo> /var/www/felibest && cd /var/www/felibest
git checkout revamp/clay-2026
npm ci

# 2. Configure
cp .env.example .env && nano .env      # set SITE URL, ADMIN_*, SESSION_SECRET, ANALYTICS_SALT, WEB3FORMS_ACCESS_KEY
#    Use absolute DATABASE_PATH and UPLOAD_DIR outside the code folder, for example /var/lib/felibest/felibest.db

# 3. Database
npm run db:migrate && npm run db:seed

# 4. Build the standalone server and copy its static files next to it
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 5. Run under PM2 (see ecosystem.config.cjs)
npm i -g pm2
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup

# 6. nginx + HTTPS
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/felibestplumbing.co.ke
sudo ln -s /etc/nginx/sites-available/felibestplumbing.co.ke /etc/nginx/sites-enabled/
sudo certbot --nginx -d felibestplumbing.co.ke -d www.felibestplumbing.co.ke
sudo nginx -t && sudo systemctl reload nginx

# 7. Cron: nightly analytics roll-up and database backup (14-day retention)
#    10 0 * * *  cd /var/www/felibest && npm run rollup
#    30 2 * * *  /var/www/felibest/deploy/backup-db.sh
```

Run a single instance: SQLite and the in-memory rate limiters assume one process. Install `sqlite3` for the backup script (`sudo apt install sqlite3`). After deploying, point DNS at the server, then run `BASE_URL=https://felibestplumbing.co.ke npm run check:redirects` to confirm every old URL redirects.

When you update: `git pull && npm ci && npm run db:migrate && npm run build`, copy static files again (step 4) and `pm2 restart felibest`.

## What is in the repo

```
src/app/(site)/      public pages (home, about, services, shop, pricing, gallery, blog, contact...)
src/app/admin/       protected admin (dashboard, products, categories, orders, enquiries, settings)
src/app/api/         forms, orders, analytics beacon, admin helpers
src/components/      clay design system, layout, sections, shop and admin components
src/data/            typed content: services, blog posts, FAQ, gallery, testimonials
src/db/              Drizzle schema (migrations in drizzle/)
src/lib/             schemas (zod), cart maths, analytics aggregation, server helpers
scripts/             migrate, seed, demo analytics, image pipeline, checks, screenshots
legacy/              the original static site (kept for reference, not deleted)
docs/                legacy-inventory.md (old URL to new route map), screens/
config/              legacy-redirects.json (loaded by next.config.mjs)
deploy/              nginx example and database backup script
```

## Admin

`/admin` is protected by an iron-session cookie (HttpOnly, SameSite=Lax, Secure in production), bcrypt passwords, login rate limiting and a forced password change on first login. Every admin page, server action and route handler checks authorization and validates input with zod. Admin responses carry `noindex` headers. Press Ctrl+K for the command palette.

## Orders and WhatsApp

Checkout saves the order in the database first (public reference such as `FP-ABC234`), then sends the customer to WhatsApp automatically with a prefilled message to the business number from Admin, Settings (default +254 798 174 201):

- Phones: same-tab redirect to `https://wa.me/<number>?text=...`. The history entry is the saved order, so Back returns to `/order/[ref]`.
- Desktop: a tab is opened inside the submit click (so popup blockers allow it) and pointed at WhatsApp once the order is saved. If the browser blocks it, `/order/[ref]` shows a large green "Send order on WhatsApp" button. The order is saved either way.
- Product pages have an "Order this on WhatsApp" button that saves a single-item order the same way.

The message is built by one pure, unit-tested module, `src/lib/whatsapp-message.ts`: reference, customer, phone, area, address, notes, payment, then each item with quantity, unit price, line total and absolute product URL, then delivery, total and the order link. Input is sanitised (control characters stripped, lengths capped) and the encoded link is kept under about 1900 characters: long carts list the first items and summarise the rest, always keeping the order link.

Analytics events: `order_placed`, `whatsapp_click` and `whatsapp_order_redirect`.

### Product image in the WhatsApp message

A `wa.me` link cannot attach images. The picture arrives as the link preview of the product URL in the message. Each product page therefore sets `og:title`, `og:description`, `og:url`, `og:type` and an `og:image` that points to `/og/product/[slug]`, a generated 1200x630 JPEG (product photo on white, Felibest logo, KES price). WhatsApp does not reliably render WebP previews, which is why the preview is a JPEG. The order page is `noindex`.

**Previews only render on the deployed public domain, not on localhost.** WhatsApp fetches the link from its own servers, so a `localhost` or private-network URL cannot be previewed. Set `NEXT_PUBLIC_SITE_URL` to the real https domain in production. After changing a product image, WhatsApp may cache the old preview for a while; the `/og` route itself is cached for one hour at the browser and one day at the CDN.

### Enable automatic WhatsApp (Cloud API)

This is optional. It makes the server message the owner's WhatsApp the moment an order is saved, with the first product's picture and an order summary, without the customer doing anything. If it is not configured, or it fails, checkout is unaffected and the customer-side WhatsApp message still works.

1. Create a Meta Business account at business.facebook.com and verify the business.
2. At developers.facebook.com create an app (type Business) and add the WhatsApp product.
3. In WhatsApp, API setup, add and verify the sender phone number. Copy its **Phone number ID** (not the number) into `WHATSAPP_PHONE_NUMBER_ID`.
4. In Business settings, Users, System users, create a system user, give it the app and the WhatsApp account, and generate a **permanent token** with the `whatsapp_business_messaging` and `whatsapp_business_management` permissions. Put it in `WHATSAPP_CLOUD_TOKEN`. Never commit it and never put it in client code.
5. Set `WHATSAPP_OWNER_NUMBER` to the owner's number that should receive alerts (digits with country code, for example `254798174201`).
6. Meta only allows free-form messages to a number that messaged the business in the last 24 hours. For every other case create a message template (category Utility, language English) in WhatsApp Manager, Message templates, with a single variable, for example: `New website order: {{1}}`. Wait for approval, then set `WHATSAPP_TEMPLATE_NAME` (and `WHATSAPP_TEMPLATE_LANGUAGE` if not `en`).
7. Restart the app. Place a test order. Admin, Orders shows a "WhatsApp: sent" or "WhatsApp: not sent" badge for each order; a failed attempt stores a short, non-sensitive reason.

All three of `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_OWNER_NUMBER` must be set for the notifier to switch on. It runs after the order is saved, never blocks checkout, retries once, and logs only status text. The token is only sent in the `Authorization` header to graph.facebook.com. The product image is fetched by Meta from `/og/product/[slug]` on your public domain, so the site must be publicly reachable.

Code: `src/lib/server/notifiers.ts` (`OrderNotifier`, `WhatsAppLinkNotifier`, `WhatsAppCloudNotifier`).

## Payments

Checkout offers pay on delivery (cash or M-Pesa) and pay via WhatsApp. Both go through the `PaymentProvider` interface in `src/lib/server/payments.ts`. To add M-Pesa Daraja STK push later, implement a provider whose `initiate` calls the STK push endpoint, add a callback route that marks the order paid, and register it. Nothing else in checkout changes. Daraja is intentionally not implemented.

## Themes

The site theme is a block of `--t-*` variables at the top of `src/app/globals.css`; Tailwind tokens (`surface`, `ink`, `brand`, `accent`...) read them. Branch `revamp/plumbing-v2-light` is the light theme and `revamp/plumbing-v2` is the dark navy theme. See `docs/LIGHT-vs-DARK.md`.

## Analytics and privacy

First-party, no cookies, no raw IPs. A visitor id is `sha256(salt + date + IP + user agent)` truncated, so it rotates daily. Bots, `/admin` and `/api` are ignored. Country comes from the `CF-IPCountry` header when behind Cloudflare. See `docs/` and `DECISIONS.md` for details.
