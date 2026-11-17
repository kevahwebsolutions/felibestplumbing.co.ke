# Decisions (Version 2)

Decisions taken while executing `REVAMP_V2_PROMPT.md` without questions.

## Repository
- `.gitignore` had `data/`, which also ignored `src/data/` (services, content, gallery, image manifest). The folder was therefore missing from the v1 commits and from this worktree. The rule is now `/data/` and `src/data/` is committed on this branch. The files were copied read-only from the v1 working folder; v1 itself was not changed.
- `package.json` gains dev dependencies `lighthouse`, `@axe-core/playwright` and `chrome-launcher` for the quality gates.

## Design
- Orange `#ff4917` is only 3.4:1 with white text, so solid buttons and badges use `#d63a0c` (4.7:1, measured with `scripts/contrast.mjs`). `#ff4917` is kept for large decorative accents (tick marks, active-nav underline, big numerals on navy where it is 4.5:1).
- Copper `#b87333` is decorative only (fitting edges, valve rings, icon plates). On text it would be 4.0:1, so no copper text on navy is used except large display numerals.
- Page background is white, with `#f4f7fa` steel grey bands.
- Headings: Barlow Condensed (600-800), uppercase for h1 and h2, Inter for body. In admin h1 and h2 are sentence case for readability.
- Shape: 4-12px radii, 1px borders, a single flat lift shadow. Buttons have a hard 3px bottom edge, so they read as heavy and pressable.
- Photography: the real job photos were reviewed on contact sheets. Hero is the copper-pipe and valve photo (`services2/commercial-11`, 1600 px, sharp, landscape). Rejected for hero use: the portrait phone shots (wrong crop), `blocked-toilet-6` (320 px), `consultation-2`, `wth1`, `sump-pump-4` (tiny), and the stock images with watermarks or phone numbers burned in. Mixed quality is unified with navy gradient and multiply overlays, partial greyscale on cards, and dark gradients under captions.
- The existing sharp pipeline already produced webp at max 1600 px for every referenced photo, so no new conversion was needed. `next/image` serves WebP only (AVIF decoding was measurably slower on low-end CPUs) with a priority-loaded hero.
- Recent work is a clean project grid, not a before/after slider: no genuine before/after pairs exist in the image set.
- The logo has a white wordmark, so it only ever appears on navy (utility bar, header, footer, admin sidebar, login plate).
- The founder note reuses the old home page words ("You approve the price before we start the job. We treat your property like our own.") attributed to Mr. Felix. The signature image is dropped: `sig.webp` is a small photo with white lettering and is illegible on light backgrounds.
- Hero headline follows the brief ("Nairobi's 24/7 plumbers. Fixed right, first time."). Every supporting claim is one the old site already made. "Licensed", "on-time", "100% satisfaction", "you approve the price" and the stats are unchanged.

## Motion
- Lenis smooth scroll removed: it fought anchor links, cost JavaScript on every page and is disabled on touch anyway.
- Scroll reveals are now pure CSS (`animation-timeline: view()` in `globals.css`), so they cost no JavaScript and are disabled for `prefers-reduced-motion`. They animate transform only, not opacity. Opacity fades made off-screen text register as low contrast in axe and delayed LCP (server HTML was invisible until hydration).
- Framer Motion is kept where it earns its weight: scroll-drawn pipe runs (`pathLength`), the count-up, the process steps, the booking form success state and the gallery filter. It was removed from buttons, product cards and the cart badge. Page transition is a CSS settle animation.
- Valve wheels rotate on hover (CSS, guarded by `motion-reduce`). The flowing-water divider is a CSS animation and is frozen by the global reduced-motion rule.

## Behaviour kept exactly
- Routes, 301 redirects, Drizzle schema, seeds, migrations, cart maths, order endpoint, forms, analytics events and consent-free tracking, JSON-LD, sitemap, security headers. The only config change is `next.config.mjs` images: WebP only, allowed qualities 60/70/75.
- The Google Maps embed is now click-to-load ("Load map") on the home and contact pages. This keeps about 360 KB of third-party script off the critical path. The embed URL and CSP are unchanged.
- The old floating phone button was removed. The phone number is in the utility bar, header, hero, emergency band, footer and the mobile bottom bar. A WhatsApp button remains on desktop.

## Shop
- Spec chips are derived from the existing `specs` JSON (size/length/bore first, then material/finish, then others; brand shown separately). Nothing new is stored, so products without specs show only SKU, stock and price.
- Category icon bar replaces the sidebar category list (filters for price and tags stay).
- The product page "Need it installed?" panel links to `/contact#book`.

## Performance (see docs/LIGHTHOUSE-V2.md)
- The Lighthouse benchmark index on this machine is 530 to 820, below the reference device, so absolute mobile scores here are depressed. The unmodified v1 build measured on the same machine scored 43 and 49 on `/` and `/terms`, against v2's 47 to 53, so v2 is not slower.
