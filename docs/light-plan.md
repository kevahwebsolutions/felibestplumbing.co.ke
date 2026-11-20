# Light theme and WhatsApp orders: plan

Branch `revamp/plumbing-v2-light`, from `revamp/plumbing-v2`. Nothing on the dark branch, `revamp/clay-2026` or tag `v1-clay` is touched.

## Discovery summary
- Next.js 16 app router, Tailwind v4 with tokens in `src/app/globals.css`, Radix, Framer Motion, SQLite via Drizzle.
- v2 used raw palette names (`navy-*`, `sky-*`, `cta-*`). Dark blocks were built with `bg-navy-900 text-white`.
- Orders: `POST /api/orders` saves the order (prices re-read from the database), `/order/[ref]` shows it, and the old WhatsApp option opened `wa.me` in a new tab.
- Settings (including `whatsappNumber`) live in the `settings` table; `getSettings()` is the single reader.

## Task A: light theme
1. `:root` holds `--t-*` theme values; `@theme inline` maps them to semantic Tailwind tokens (`surface`, `surface-alt`, `ink`, `ink-muted`, `body`, `line`, `brand`, `brand-strong`, `accent`, `accent-strong`, `focus`, `overlay`, ...). Switching theme means swapping that one block.
2. All class names were migrated from palette names to semantic tokens (scripted rename, then hand-fixed every dark block).
3. Light variants: header, utility bar, footer, mobile menu, admin sidebar, page heroes, CTA band, how-it-works, service cards, product art, map placeholder, charts.
4. Logo: `scripts/make-light-logo.mjs` recolours the white ring to brand navy (`logo-light.webp/png`) and regenerates the PWA and Apple icons.
5. Home hero is a bright split hero with a framed photo and an overlapping booking card.
6. Contrast verified with `scripts/contrast.mjs`.

## Task B: WhatsApp orders
- `src/lib/whatsapp-message.ts`: pure message builder (sanitising, 1900 character budget) with unit tests.
- Checkout saves the order, then redirects to `wa.me` (same tab on mobile, new tab with fallback on desktop). The order page has a large green WhatsApp button; product pages get an "Order this on WhatsApp" button that places a single-item order.
- `/og/product/[slug]` returns a 1200x630 JPEG (sharp); product metadata points `og:image` at it. Order page is `noindex`.
- `OrderNotifier` interface with `WhatsAppLinkNotifier` (default) and `WhatsAppCloudNotifier` (Meta Cloud API, opt-in by env vars). Migration adds `whatsapp_notified_at` and `whatsapp_notify_error`.
- Admin: new orders first with a New state, "Open in WhatsApp" for the customer, sent/not sent badge.
- Analytics: new `whatsapp_order_redirect` event.

## Quality gates
tsc, ESLint, build, Vitest, Playwright, axe on every route, overflow and screenshots at 375/768/1440, Lighthouse mobile on five routes, redirect and link checks.
