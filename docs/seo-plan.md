# SEO hardening plan

Branch `seo/hardening`, built on the 16-product catalogue (commit 92caa66). Production domain `https://felibestplumbing.co.ke`, driven by `NEXT_PUBLIC_SITE_URL`.

## Discovery (what existed)

- `buildMetadata()` in `src/lib/seo.tsx` already set canonical, Open Graph and Twitter tags. `robots.ts`, `sitemap.ts`, `manifest.ts`, `/og/product/[slug]`, breadcrumbs in `PageHero`, Service, FAQPage, BlogPosting, Product and ItemList JSON-LD and the 108-rule legacy redirect map were in place.
- Gaps found by the first run of the new audit (244 failures on 67 routes): the Plumber entity carried an invented address and `priceRange`; 28 titles and 25 descriptions were outside 60 and 110-155 characters; 49 pages used a WebP or 600 px logo as `og:image`; category descriptions were cut mid-word; no `favicon.ico`; `/gallery` was thin; unknown service, blog and shop slugs returned an empty HTML shell; the sitemap used one `lastModified` value for most pages; no Organization or WebSite entity; blog posts had no updated date, author line or dedicated meta fields.

## Changes

1. **Audit first.** `scripts/seo-audit.mts` (`npm run seo:audit`) builds with the production URL, serves on port 3100, discovers routes from the sitemap and a link crawl, and writes `docs/SEO-AUDIT.md` and `docs/seo-audit/audit.json`. A Vitest file (`tests/seo.test.ts`) and a Playwright file (`e2e/seo.spec.ts`) keep a fast subset in CI.
2. **Metadata.** `buildMetadata` now takes a short topic and applies the `| Felibest Plumbing` suffix only when the total fits 60 characters (`fitTitle`); `fitDescription` appends a tail only when it fits 155. Service, blog and static page titles and descriptions were rewritten by hand; blog posts gained `metaTitle`, `metaDescription` and `updated`.
3. **Open Graph images.** `/og/[kind]/[slug]` returns a branded 1200x630 JPEG (photo cropped to fill, blue band with the white logo) for the home page, services, blog posts and generic pages. Product pages keep `/og/product/[slug]`.
4. **Structured data.** One `@graph` in the root layout: Organization, WebSite and Plumber with stable `@id`s, five `sameAs` profiles, `contactPoint`, `areaServed` from the coverage page and 24/7 opening hours. No address, geo, priceRange, ratings or reviews. Service pages reference the business by `@id`; BlogPosting references the Organization; Product gains an `@id`.
5. **Robots and sitemap.** Explicit allows for `/og/`, `/_next/static/`, `/_next/image`, `/images/` and `/media/`; disallows for admin, api, cart, checkout, order and filter variants. `X-Robots-Tag: noindex, nofollow` headers on cart, checkout, order, admin and api (the pages also carry the meta tag). Sitemap `lastModified` comes from git history (`src/data/lastmod.json`), blog dates and product `updatedAt`; image extensions for products, services, posts and the gallery.
6. **404.** A helpful 404 (`NotFoundContent`) with a real status, noindex and links to the main sections. `src/proxy.ts` rewrites unknown `/services/x` and `/blog/x` to an unmatched path so the full page is server-rendered (see DECISIONS-SEO.md).
7. **Content and linking.** Gallery page text and links; service pages list the guides that cover the same topic; blog posts show author, published and updated dates; gallery images get distinct alt text.
8. **Icons.** `src/app/favicon.ico` (32 and 48 px), `icon-32.png`, existing 192, 512 and apple-touch icons.
9. **Docs and owner tasks.** `DECISIONS-SEO.md`, `docs/LIGHTHOUSE-SEO.md`, `docs/seo-samples.md`, `docs/SEO-OWNER-TASKS.md`, README notes on the www/apex host, `/.well-known/security.txt`.
