# Version 1 (clay) vs Version 2 (plumbing trade)

Both versions run the same data, routes, shop, admin and analytics. Only the presentation differs.

| | V1 "Clay" (`revamp/clay-2026`, tag `v1-clay`) | V2 "Plumbing trade" (`revamp/plumbing-v2`) |
|---|---|---|
| First impression | Playful app or toy brand | Trade contractor: photo hero, big phone number, heavy buttons |
| Palette | Pastel blue tints, orange gradients | Deep navy, brand blue, steel greys, orange for calls to action only, copper fitting accents |
| Type | Nunito (rounded) | Barlow Condensed headings (uppercase), Inter body |
| Shape | 28-56 px radii, puffy inner and outer shadows | 4-12 px radii, 1 px borders, flat shadows |
| Imagery | Floating bubbles, 3D clay icons | Real job photos with navy duotone, custom pipe-fitting icon set, blueprint grid |
| Motion | Bouncy springs, floating bubbles, smooth scroll | Scroll-drawn pipe runs, valve wheels, flowing-water line, CSS scroll reveals, all reduced-motion safe |
| Header | Floating clay pill | Utility bar with 24/7 number, sticky navy header, full-height mobile panel |
| Mobile | Floating clay bar | Sticky bottom bar: Call, WhatsApp, Book, Cart |
| Shop | Gradient art tiles | Category icon bar, spec chips, SKU, stock, install cross-sell |
| Admin | Clay cards | Navy sidebar, white bordered cards, data-dense charts |

## Run both side by side

Each version has its own working folder (git worktree) and database file.

```bash
# Terminal 1: V1 on port 3000
cd C:/wamp64/www/felibestplumbing.co.ke      # branch revamp/clay-2026
npm install
npm run db:migrate && npm run db:seed
npm run build
npx cross-env PORT=3000 INSECURE_COOKIES=1 npm start

# Terminal 2: V2 on port 3001
cd C:/wamp64/www/felibestplumbing-v2         # branch revamp/plumbing-v2
npm install
npm run db:migrate && npm run db:seed
npm run build
npx cross-env PORT=3001 INSECURE_COOKIES=1 npm start
```

Open http://localhost:3000 (V1) and http://localhost:3001 (V2). `INSECURE_COOKIES=1` is only for testing the production build over plain http. For the analytics dashboard demo data run `npm run seed:demo-analytics` in either folder.

To switch one folder between versions instead: `git checkout v1-clay` or `git checkout revamp/plumbing-v2`, then rebuild.
