# Version 2 plan: "Looks like a plumbing company"

Branch `revamp/plumbing-v2` (from `revamp/clay-2026`). Presentation layer only. Routes, redirects, data layer, cart, checkout, admin logic, analytics events, forms, SEO and JSON-LD are untouched.

## Discovery summary
- Next.js 16 app router, Tailwind v4 (`@theme` in `src/app/globals.css`), Radix primitives, Framer Motion, Drizzle/SQLite.
- v1 design lived in a handful of tokens and utilities (`clay-*`), so v2 renames them to `fp-*` and redefines every utility. That restyles shop, cart, checkout and admin in one move; each is then tuned by hand.
- `src/data/` (services, content, gallery, image manifest) was never committed because `.gitignore` had `data/` (which also matched `src/data`). Fixed to `/data/` and the folder is now tracked.

## Design system (changed)
| File | Change |
|---|---|
| `src/app/globals.css` | New tokens: navy 950-600, sky 500/400 highlights, steel greys, copper `#b87333`, CTA orange. Flat 1px cards, 6-12px radii, heavy rectangular buttons, blueprint grid, water-line divider, eyebrow label. Fonts Barlow Condensed + Inter. |
| `src/app/layout.tsx` | `next/font` Barlow Condensed + Inter, theme colour navy. |
| `src/components/plumb/icons.tsx` | Custom duotone icon set (elbow, tee, coupling, gate valve, tap, wrench, drain, geyser, tank, shower, burst pipe, gauge) plus Lucide fallbacks in the same tile. |
| `src/components/plumb/decor.tsx` | `PipeRun` and `PipeConnector` (scroll-drawn SVG `pathLength`), `ValveNode`, `WaterLine`, `SectionHeading`, `DropMark`. Bubbles and clay art removed. |
| `src/components/ui/*` | Button (adds outline variant), dialog/sheet, accordion, tabs, slider, switch, checkbox flattened. |

## Chrome (changed)
`header.tsx` (utility bar, navy sticky header, full-height navy mobile panel), `footer.tsx` (navy blueprint, services, areas, contact), `floating.tsx` (mobile sticky bar Call / WhatsApp / Book / Cart), `site-chrome.tsx`, `providers.tsx` (Lenis smooth scroll removed, lighter page transition).

## Sections (changed)
`common.tsx` (photo service cards, CTA band), `page-hero.tsx` (duotone photo header), new `service-tabs.tsx`, `how-it-works.tsx`, plus restyled testimonial carousel, gallery, FAQ list, post body.

## Pages
- Home rebuilt in the blueprint order: hero with quote form, trust strip, emergency band, service tabs, pipe-run process, recent work grid, shop teaser, why choose, testimonials, coverage with map, FAQ, CTA.
- Services index and detail (photo header, process, sticky quote card, FAQs, related), pricing, gallery, about, contact, coverage, FAQ, testimonials, blog, privacy, terms, 404 ("burst pipe") restyled.
- Shop catalogue: category icon bar, spec-forward cards, product page with spec table and "Need it installed" panel; cart drawer, cart and checkout restyled.
- Admin and analytics: navy sidebar, white bordered cards, brand-coloured series, orange for alerts and key actions only.

## Untouched
`src/db`, `src/lib/server`, API routes, `src/store`, `src/lib/schemas`, redirect config, seeds, migrations, scripts (except new QA scripts).
