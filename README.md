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

## Payments

Checkout has two options today: pay on delivery (cash or M-Pesa) and order via WhatsApp with a prefilled cart message. Both go through the `PaymentProvider` interface in `src/lib/server/payments.ts`. To add M-Pesa Daraja STK push later, implement a provider whose `initiate` calls the STK push endpoint, add a callback route that marks the order paid, and register it. Nothing else in checkout changes. Daraja is intentionally not implemented.

## Analytics and privacy

First-party, no cookies, no raw IPs. A visitor id is `sha256(salt + date + IP + user agent)` truncated, so it rotates daily. Bots, `/admin` and `/api` are ignored. Country comes from the `CF-IPCountry` header when behind Cloudflare. See `docs/` and `DECISIONS.md` for details.
