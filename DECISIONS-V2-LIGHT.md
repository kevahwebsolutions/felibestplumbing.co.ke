# Decisions (Version 2, light theme and WhatsApp orders)

Decisions taken while executing `REVAMP_V2_LIGHT_PROMPT.md` without questions. Branch `revamp/plumbing-v2-light` (from `revamp/plumbing-v2`). The dark branch, `revamp/clay-2026`, tag `v1-clay` and the other worktree were not modified. Nothing was pushed or deployed. The local `.env` was not edited.

## Theme
- A theme is now a swap of the `--t-*` block in `src/app/globals.css`. `@theme inline` maps those to semantic Tailwind tokens: `surface`, `surface-alt`, `tint`, `ink`, `body`, `ink-muted`, `line`, `line-strong`, `brand`, `brand-strong`, `brand-soft`, `accent`, `accent-strong`, `accent-bright`, `accent-tint`, `focus`, `overlay`, `copper`, `success`, `whatsapp` and the `on-brand` / `on-accent` text colours. Chart colours are `--t-chart-1..8`. No component uses a raw palette name or hex any more, except the dark-on-light SVG glyph strokes in the pipe-fitting icon set (white details on brand-coloured plates) and the cart fly-to-cart placeholder gradient.
- Values: white page, `#f3f7fb` alternating bands, ink `#0b2a4a`, body slate `#475569`, brand `#0c4c93`, sky `#51acfb` as tints only. Orange CTA stays `#d63a0c` with white text (4.7:1); `#ff4917` is decoration only (tick marks, active nav underline).
- `scripts/contrast-tokens.mjs` reads the live token values and checks 38 pairs. It found two real problems: input borders (`#9fb3c8`, 2.15:1) were too pale and were darkened to `#7a8ea5`; orange `#d63a0c` on the steel and tint bands is 4.3:1, so orange is limited to white backgrounds for body-size text and to large text and icons on tinted bands (404 numerals, stars, map pin).
- Emergency band: solid orange with white text and a white phone button with orange text. This passes contrast and is the strongest focal point on the page, which a tint would not be.
- Header: light steel utility bar and white main header with a soft shadow once scrolled. Mobile menu is a white panel with tap-to-call (orange) and WhatsApp (green) buttons. Footer is light steel with a 4px brand-blue top border.
- A `whatsapp` button variant (green `#0f7a4b`, white text, 5.4:1) was added. WhatsApp's own green `#25d366` fails contrast with white.
- Service cards keep the real photos with no duotone: a 4px brand-blue bottom bar (6px and a faint tint on hover). Recent-work tiles use a white caption bar with a brand top border instead of a navy gradient.
- Page headers: light steel with the blueprint grid and a framed photo strip fading in on the right (desktop only).
- Hero: split layout. The photo (copper pipes and valves, `services2/commercial-11`) sits in an 12px framed container with a thin tint and a brand-blue bar; the white booking card overlaps its right edge. Still the priority LCP image.
- Admin sidebar and dashboard are light; Recharts series, gridlines, tooltips and heat map read the `--t-chart-*` and `--t-border` variables.

## Logo
- `scripts/make-light-logo.mjs` recolours the white ring and lettering to brand navy (pixels whose lowest channel is above 150 are blended toward `#0c4c93`, which keeps anti-aliased edges). The blue drop, orange FP and the wrench are untouched. Output: `logo-light.webp` and `logo-light.png`. I opened the result on white and at icon size: ring and lettering are crisp and legible, so the fallback (original logo on a navy badge) was not needed.
- Wired into the header, footer (via the shared `Logo`), admin sidebar and login, invoice print header, JSON-LD `image`, Open Graph fallback image, the 192/512 PWA icons, the Apple touch icon and the favicon (the PWA icons are the logo on a white plate with padding so they also work as maskable icons). `logo-white.webp` is kept in `public/` for the dark branch.

## WhatsApp orders
- Every order, including pay on delivery, saves first and then goes to WhatsApp. The order page repeats the button, because the redirect can be blocked or abandoned.
- Desktop popup blockers only allow `window.open` during a click, and the order is saved asynchronously. The submit handler therefore opens the tab immediately and points it at `wa.me` once the order is saved; if the browser still blocks it, the customer lands on the order page with the green button. On phones the same tab is redirected, and `history.replaceState` makes Back from WhatsApp land on `/order/[ref]` rather than an emptied cart.
- Product-page "Order this on WhatsApp" is a short dialog (name, phone, area, address) that places a normal single-item order with payment option `whatsapp`, so it appears in Admin, Orders like any other.
- The message builder is pure and shared by the checkout redirect, the order page, the admin order detail and the notifiers, so all of them show the identical text. It strips control and Unicode format characters (so bidi overrides cannot spoof text), collapses whitespace and caps every field. Over the 1900 character budget it shows the first items in full, then "...and N more items, see order link". The order link is always last.
- Stored phone numbers are normalised to `+254...`; the admin "Open in WhatsApp" link strips the plus.
- Product images: `og:image` points to `/og/product/[slug]`, a 1200x630 JPEG built with sharp. Text is an SVG overlay in Arial/Helvetica so no font files are needed on the server. Cache-Control is one hour in browsers, a day on a CDN, with a week of stale-while-revalidate. Unpublished or unknown products return 404.
- `OrderNotifier` has two implementations. The Cloud notifier is only constructed when all three variables are set. It sends an image message (the product JPEG from the `/og` route, so Meta fetches a public HTTPS JPEG) with a summary caption, falls back to the template when Meta answers with a closed-window error code (131047, 131051, 470) and a template name is configured, retries once for network errors, 5xx and 429, and records only `HTTP <status> code <n>` in `whatsapp_notify_error`. It is started with `void` after the order commit, so checkout never waits for Meta and a Meta outage cannot fail an order. The token appears only in the Authorization header.
- Migration `0001_whatsapp_notify.sql` adds two nullable columns; existing data is untouched.
- The admin orders list sorts New orders first with an orange left rule and a "New" pill, plus the sent / not sent badge and an Open in WhatsApp button. Order detail shows the exact message rebuilt from the saved order.
- Analytics: `whatsapp_order_redirect` added to the event whitelist. `order_placed` and `whatsapp_click` are unchanged.

## Bugs fixed on the way
- `product-detail.tsx` built the call link with `/[^d+]/g` (missing backslash), which stripped the letter "d" and kept other characters. It is now `/[^\d+]/g`.
- `@import 'tailwindcss'` was briefly lost during the stylesheet rewrite; caught immediately by the first screenshot.

## Not done, on purpose
- No dark-mode toggle. Switching theme means switching branch, as agreed.
- Real WhatsApp preview rendering cannot be tested from localhost (documented in the README). The JPEG route, tags, size and headers are tested instead.
- The Cloud API path was tested with a mocked `fetch` only. No live call to Meta was made, because it needs the owner's credentials.
