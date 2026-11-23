// SEO audit. Builds (unless SKIP_BUILD=1) and starts the production app on port 3100, discovers every route from the
// sitemap plus a link crawl from "/", audits each public page and writes docs/SEO-AUDIT.md and docs/seo-audit/audit.json.
// Exits non-zero on any failure.
// Usage: npm run seo:audit            (SKIP_BUILD=1 to reuse .next, BASE_URL=http://localhost:3100 to reuse a server)
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ORIGIN = 'https://felibestplumbing.co.ke';
const PORT = 3100;
const externalBase = process.env.BASE_URL?.replace(/\/$/, '');
const base = externalBase ?? `http://localhost:${PORT}`;

const NOINDEX_PREFIXES = ['/cart', '/checkout', '/order', '/admin', '/api'];
const SERVICE_RE = /^\/services\/[^/]+$/;
const UTILITY = new Set(['/cart', '/checkout', '/privacy', '/terms', '/contact', '/testimonials', '/faq', '/coverage', '/gallery', '/pricing', '/shop', '/blog', '/services']);
const redirects: { source: string; destination: string }[] = JSON.parse(fs.readFileSync('config/legacy-redirects.json', 'utf8'));

let server: ChildProcess | undefined;

async function waitFor(url: string, ms = 120_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { const r = await fetch(url, { redirect: 'manual' }); if (r.status < 500) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`server did not start at ${url}`);
}

function startServer() {
  if (process.env.SKIP_BUILD !== '1') {
    console.log('Building with NEXT_PUBLIC_SITE_URL=' + ORIGIN);
    const b = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', shell: true, env: { ...process.env, NEXT_PUBLIC_SITE_URL: ORIGIN } });
    if (b.status !== 0) throw new Error('build failed');
  }
  server = spawn('npx', ['next', 'start', '--port', String(PORT)], { shell: true, stdio: 'ignore', env: { ...process.env, NEXT_PUBLIC_SITE_URL: ORIGIN, INSECURE_COOKIES: '1' } });
}

function stopServer() {
  if (!server?.pid) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill('SIGTERM');
}

type Img = { src: string; srcset: string | null; sizes: string | null; fill: boolean; alt: string | null; width: string | null; height: string | null; loading: string | null; priority: boolean };
type Parsed = {
  title: string; description: string | null; canonical: string | null; lang: string | null; viewport: boolean; charset: boolean; favicon: boolean; manifest: boolean;
  robots: string | null; h: { level: number; text: string }[]; og: Record<string, string>; tw: Record<string, string>; imgs: Img[];
  links: { href: string; text: string; aria: string | null }[]; ld: string[]; words: number; text: string;
};

const PARSER = `(html) => {
  const d = new DOMParser().parseFromString(html, 'text/html');
  const meta = (sel) => d.querySelector(sel)?.getAttribute('content') ?? null;
  const og = {}; d.querySelectorAll('meta[property^="og:"]').forEach((m) => { og[m.getAttribute('property')] = m.getAttribute('content') ?? ''; });
  const tw = {}; d.querySelectorAll('meta[name^="twitter:"]').forEach((m) => { tw[m.getAttribute('name')] = m.getAttribute('content') ?? ''; });
  d.querySelectorAll('script, style, noscript, template').forEach((n) => { if (n.getAttribute('type') !== 'application/ld+json') n.remove(); });
  const ld = [...d.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? '');
  d.querySelectorAll('script').forEach((n) => n.remove());
  const main = d.body.cloneNode(true);
  main.querySelectorAll('header, footer, nav').forEach((n) => n.remove());
  const text = (main.textContent ?? '').replace(/\\s+/g, ' ').trim();
  return {
    title: d.querySelector('title')?.textContent ?? '', description: meta('meta[name="description"]'),
    canonical: d.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null, lang: d.documentElement.getAttribute('lang'),
    viewport: !!d.querySelector('meta[name="viewport"]'), charset: !!d.querySelector('meta[charset]'),
    favicon: !!d.querySelector('link[rel~="icon"]'), manifest: !!d.querySelector('link[rel="manifest"]'),
    robots: meta('meta[name="robots"]'),
    h: [...d.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ level: Number(h.tagName[1]), text: (h.textContent ?? '').replace(/\\s+/g, ' ').trim() })),
    og, tw,
    imgs: [...d.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src') ?? '', srcset: i.getAttribute('srcset'), sizes: i.getAttribute('sizes'), fill: i.getAttribute('data-nimg') === 'fill', alt: i.getAttribute('alt'), width: i.getAttribute('width'), height: i.getAttribute('height'), loading: i.getAttribute('loading'), priority: i.getAttribute('fetchpriority') === 'high' })),
    links: [...d.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href') ?? '', text: (a.textContent ?? '').replace(/\\s+/g, ' ').trim(), aria: a.getAttribute('aria-label') })),
    ld, words: text ? text.split(' ').length : 0, text,
  };
}`;

/** The srcset entry a 412px wide mobile screen at 1x would download, using the sizes attribute with desktop media queries ignored. */
function mobileCandidate(im: Img): string {
  if (!im.srcset) return im.src;
  const entries = im.srcset.split(',').map((e) => e.trim().split(/\s+/)).map(([u, w]) => ({ u: u!, w: parseInt(w ?? '0', 10) }));
  let px = 412;
  const last = (im.sizes ?? '100vw').split(',').map((x) => x.trim()).filter((x) => !/min-width/.test(x)).pop() ?? '100vw';
  const vw = last.match(/(\d+)vw/);
  const abs = last.match(/(\d+)px/);
  if (vw) px = Math.round((412 * Number(vw[1])) / 100); else if (abs) px = Number(abs[1]);
  const pick = entries.filter((e) => e.w >= px).sort((a, b) => a.w - b.w)[0] ?? entries.sort((a, b) => b.w - a.w)[0];
  return pick?.u ?? im.src;
}

type Row = { route: string; status: number; issues: string[]; warnings: string[]; titleLen: number; descLen: number; h1: number; types: string[]; words: number; bytes: number; imgBytes: number; noindex: boolean };

const fail = (row: Row, msg: string) => row.issues.push(msg);
const warn = (row: Row, msg: string) => row.warnings.push(msg);

function ldTypes(blocks: unknown[]): string[] {
  const out: string[] = [];
  const walk = (n: unknown) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === 'object') {
      const o = n as Record<string, unknown>;
      const t = o['@type'];
      if (t) out.push(Array.isArray(t) ? t.join('+') : String(t));
      if (o['@graph']) walk(o['@graph']);
    }
  };
  blocks.forEach(walk);
  return out;
}

function flatten(blocks: unknown[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const walk = (n: unknown) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === 'object') {
      const o = n as Record<string, unknown>;
      if (o['@graph']) walk(o['@graph']); else out.push(o);
    }
  };
  blocks.forEach(walk);
  return out;
}

const typeOf = (o: Record<string, unknown>) => ([] as string[]).concat(o['@type'] as string | string[]);
const isAbs = (u: unknown) => typeof u === 'string' && /^https:\/\//.test(u);

function checkLd(row: Row, pagePath: string, blocks: string[]) {
  const parsed: unknown[] = [];
  for (const b of blocks) {
    try { parsed.push(JSON.parse(b)); } catch { fail(row, 'JSON-LD block does not parse'); }
  }
  const items = flatten(parsed);
  const seen = new Map<string, number>();
  for (const it of items) {
    const types = typeOf(it);
    const id = it['@id'];
    if (typeof id === 'string') seen.set(id, (seen.get(id) ?? 0) + 1);
    const need = (props: string[]) => { for (const p of props) if (it[p] == null || it[p] === '') fail(row, `${types[0]} missing "${p}"`); };
    if (types.includes('Plumber') || types.includes('LocalBusiness')) {
      need(['name', 'url', 'telephone', 'email', 'areaServed', 'openingHoursSpecification', 'image', 'logo']);
      for (const forbidden of ['address', 'geo', 'priceRange', 'aggregateRating', 'review']) if (it[forbidden] != null) fail(row, `${types[0]} must not contain "${forbidden}"`);
    }
    if (types.includes('Organization')) { need(['name', 'url', 'logo', 'sameAs', 'contactPoint']); for (const f of ['aggregateRating', 'review']) if (it[f] != null) fail(row, `Organization must not contain "${f}"`); }
    if (types.includes('WebSite')) need(['name', 'url']);
    if (types.includes('Service')) { need(['name', 'description', 'provider', 'areaServed', 'serviceType']); }
    if (types.includes('Product')) {
      need(['name', 'image', 'description', 'offers']);
      const offers = it['offers'] as Record<string, unknown> | undefined;
      if (offers) {
        for (const p of ['price', 'priceCurrency', 'availability', 'url']) if (offers[p] == null) fail(row, `Offer missing "${p}"`);
        if (offers['priceCurrency'] && offers['priceCurrency'] !== 'KES') fail(row, 'Offer currency is not KES');
        if (offers['priceValidUntil'] != null) fail(row, 'Offer must not contain priceValidUntil');
        if (offers['url'] && !isAbs(offers['url'])) fail(row, 'Offer url is not absolute');
      }
      for (const f of ['aggregateRating', 'review']) if (it[f] != null) fail(row, `Product must not contain "${f}"`);
    }
    if (types.includes('BlogPosting')) {
      need(['headline', 'description', 'image', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage']);
      const pub = it['publisher'] as Record<string, unknown> | undefined;
      if (pub && !pub['logo'] && !pub['@id']) fail(row, 'BlogPosting publisher has no logo');
    }
    if (types.includes('BreadcrumbList')) {
      const li = it['itemListElement'] as Record<string, unknown>[] | undefined;
      if (!li?.length) fail(row, 'BreadcrumbList empty');
      else li.forEach((e, i) => { if (e['position'] !== i + 1) fail(row, 'BreadcrumbList positions are not sequential'); if (!e['name']) fail(row, 'Breadcrumb item has no name'); if (e['item'] && !isAbs(e['item'])) fail(row, 'Breadcrumb item url is not absolute'); });
    }
    if (types.includes('FAQPage')) {
      const me = it['mainEntity'] as unknown[] | undefined;
      if (!me?.length) fail(row, 'FAQPage has no questions');
    }
    if (types.includes('ItemList')) { const li = it['itemListElement'] as unknown[] | undefined; if (!li?.length) fail(row, 'ItemList empty'); }
    if (it['url'] && !isAbs(it['url'])) fail(row, `${types[0]} url is not absolute`);
    if (it['@id'] && !isAbs(it['@id']) && !String(it['@id']).startsWith('#')) fail(row, `${types[0]} @id is not absolute`);
  }
  for (const [id, n] of seen) if (n > 1) {
    // Repeated references are fine when they only carry @id plus a type; a full duplicate carries more properties.
    const full = items.filter((i) => i['@id'] === id && Object.keys(i).filter((k) => k !== '@context').length > 2);
    if (full.length > 1) fail(row, `duplicate entity ${id}`);
  }
  const tcount = ldTypes(parsed);
  const business = items.filter((i) => typeOf(i).includes('Plumber'));
  if (business.length > 1) fail(row, 'more than one Plumber entity');
  if (tcount.filter((t) => t === 'BreadcrumbList').length > 1) fail(row, 'more than one BreadcrumbList');
  if (pagePath !== '/' && !tcount.includes('BreadcrumbList') && !NOINDEX_PREFIXES.some((p) => pagePath.startsWith(p))) fail(row, 'inner page has no BreadcrumbList');
}

async function main() {
  if (!externalBase) startServer();
  await waitFor(base + '/');
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const dom = await ctx.newPage();
  await dom.goto('about:blank');
  const parse = async (html: string) => (await dom.evaluate(`(${PARSER})(${JSON.stringify(html)})`)) as Parsed;

  const get = (p: string, init?: RequestInit) => fetch(base + p, { redirect: 'manual', ...init });

  // Discovery
  const sm = await (await get('/sitemap.xml')).text();
  const sitemapPaths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  const sitemapOrigins = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).origin));
  const routes = new Set<string>(['/', ...sitemapPaths]);
  const queue = ['/', ...sitemapPaths];
  const crawled = new Map<string, Parsed>();
  const htmlOf = new Map<string, string>();
  const headersOf = new Map<string, Headers>();
  const statusOf = new Map<string, number>();
  const sizeOf = new Map<string, number>();
  const global: string[] = [];
  const gfail = (m: string) => global.push(m);

  for (const o of sitemapOrigins) if (o !== ORIGIN) gfail(`sitemap contains origin ${o}`);
  if (new Set(sitemapPaths).size !== sitemapPaths.length) gfail('sitemap contains duplicate URLs');

  while (queue.length) {
    const p = queue.shift()!;
    if (crawled.has(p)) continue;
    const res = await get(p);
    statusOf.set(p, res.status);
    headersOf.set(p, res.headers);
    if (res.status !== 200) { crawled.set(p, null as unknown as Parsed); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    sizeOf.set(p, buf.length);
    const html = buf.toString('utf8');
    htmlOf.set(p, html);
    const parsed = await parse(html);
    crawled.set(p, parsed);
    for (const l of parsed.links) {
      if (!l.href.startsWith('/') || l.href.startsWith('//')) continue;
      const path = l.href.split('#')[0]!.split('?')[0]!;
      if (!path || path.startsWith('/_next') || path.startsWith('/media') || path.startsWith('/images') || path.startsWith('/og/') || path.startsWith('/api')) continue;
      if (!routes.has(path)) { routes.add(path); queue.push(path); }
    }
  }

  // Link status cache
  const linkStatus = new Map<string, { status: number; location: string | null }>();
  const probe = async (p: string) => {
    if (!linkStatus.has(p)) { const r = await get(p); linkStatus.set(p, { status: r.status, location: r.headers.get('location') }); }
    return linkStatus.get(p)!;
  };

  const rows: Row[] = [];
  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();
  const texts = new Map<string, string>();
  const imageCache = new Map<string, { status: number; type: string | null; w: number; h: number; bytes: number }>();

  for (const route of [...routes].sort()) {
    const row: Row = { route, status: statusOf.get(route) ?? 0, issues: [], warnings: [], titleLen: 0, descLen: 0, h1: 0, types: [], words: 0, bytes: 0, imgBytes: 0, noindex: false };
    rows.push(row);
    const pg = crawled.get(route);
    const noindexExpected = NOINDEX_PREFIXES.some((p) => route === p || route.startsWith(p + '/'));
    if (row.status !== 200 || !pg) { fail(row, `status ${row.status}`); continue; }
    const hdr = headersOf.get(route)!;
    row.bytes = sizeOf.get(route) ?? 0;
    const xrobots = hdr.get('x-robots-tag') ?? '';
    const metaRobots = pg.robots ?? '';
    row.noindex = /noindex/i.test(metaRobots) || /noindex/i.test(xrobots);
    if (noindexExpected && !(/noindex/i.test(metaRobots) && /noindex/i.test(xrobots))) fail(row, 'must be noindex in both meta robots and X-Robots-Tag');
    if (!noindexExpected && row.noindex) fail(row, 'public page is noindex');

    // Trailing-slash and uppercase
    if (route !== '/' && (route.endsWith('/') || route !== route.toLowerCase())) fail(row, 'URL is not lowercase without trailing slash');
    if (route !== '/') {
      const slash = await get(route + '/');
      if (slash.status === 200) fail(row, 'duplicate content at trailing-slash URL');
    }

    // Title and description
    row.titleLen = pg.title.length;
    row.descLen = pg.description?.length ?? 0;
    if (!noindexExpected) {
      if (pg.title.length < 30 || pg.title.length > 60) fail(row, `title length ${pg.title.length} (30-60)`);
      if (!pg.description) fail(row, 'no meta description');
      else {
        if (pg.description.length < 110 || pg.description.length > 155) fail(row, `description length ${pg.description.length} (110-155)`);
        if (/(…|\.\.\.)$/.test(pg.description)) fail(row, 'description is truncated');
      }
      titles.set(pg.title, [...(titles.get(pg.title) ?? []), route]);
      if (pg.description) descs.set(pg.description, [...(descs.get(pg.description) ?? []), route]);
    }
    if (/…$/.test(pg.title)) fail(row, 'title is truncated');

    // Headings
    const h1s = pg.h.filter((x) => x.level === 1);
    row.h1 = h1s.length;
    if (h1s.length !== 1) fail(row, `${h1s.length} h1 elements`);
    let prev = 0;
    for (const h of pg.h) { if (prev && h.level > prev + 1) { fail(row, `heading level skipped (h${prev} to h${h.level}: "${h.text.slice(0, 40)}")`); break; } prev = h.level; }
    if (h1s[0] && pg.title.replace(/\s*\|\s*Felibest Plumbing$/, '').trim().toLowerCase() === h1s[0].text.toLowerCase() && route === '/') warn(row, 'h1 identical to title');

    // Canonical
    const expectedCanon = ORIGIN + (route === '/' ? '' : route);
    if (!pg.canonical) fail(row, 'no canonical');
    else {
      if (!/^https:\/\//.test(pg.canonical)) fail(row, 'canonical not absolute');
      const norm = (u: string) => u.replace(/\/$/, '');
      if (!noindexExpected && norm(pg.canonical) !== norm(expectedCanon)) fail(row, `canonical ${pg.canonical} is not self-referencing`);
    }
    const html = htmlOf.get(route)!;
    if (/localhost|ngrok|trycloudflare|127\.0\.0\.1/i.test(html.replace(/https?:\/\/localhost:\d+\/_next/g, ''))) fail(row, 'HTML contains localhost, ngrok or trycloudflare');
    if (/www\.felibestplumbing\.co\.ke/.test(html)) fail(row, 'HTML emits the www host');

    // Document basics
    if (pg.lang !== 'en-KE') fail(row, `html lang is ${pg.lang}`);
    if (!pg.viewport) fail(row, 'no viewport meta');
    if (!pg.charset) fail(row, 'no charset meta');
    if (!pg.favicon) fail(row, 'no favicon link');
    if (!pg.manifest) fail(row, 'no manifest link');

    // Open Graph and Twitter
    if (!noindexExpected) {
      for (const k of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:site_name', 'og:locale']) if (!pg.og[k]) fail(row, `missing ${k}`);
      if (pg.og['og:locale'] && pg.og['og:locale'] !== 'en_KE') fail(row, 'og:locale is not en_KE');
      if (pg.og['og:url'] && pg.og['og:url'].replace(/\/$/, '') !== expectedCanon) fail(row, 'og:url does not match canonical');
      if (pg.tw['twitter:card'] !== 'summary_large_image') fail(row, 'twitter:card is not summary_large_image');
      for (const k of ['twitter:title', 'twitter:description', 'twitter:image']) if (!pg.tw[k]) fail(row, `missing ${k}`);
      const img = pg.og['og:image'];
      if (img) {
        if (!/^https:\/\//.test(img)) fail(row, 'og:image not absolute');
        else {
          const local = img.replace(ORIGIN, '');
          if (!imageCache.has(local)) {
            const r = await get(local);
            const buf = Buffer.from(await r.arrayBuffer());
            let w = 0; let h = 0;
            try { const m = await sharp(buf).metadata(); w = m.width ?? 0; h = m.height ?? 0; } catch { /* not an image */ }
            imageCache.set(local, { status: r.status, type: r.headers.get('content-type'), w, h, bytes: buf.length });
          }
          const info = imageCache.get(local)!;
          if (info.status !== 200 || !/^image\/(jpeg|png)/.test(info.type ?? '')) fail(row, `og:image ${local} is ${info.status} ${info.type}`);
          else if (!(info.w >= 1200 && info.h >= 630) && !(info.w >= 600 && info.w === info.h)) fail(row, `og:image ${local} is ${info.w}x${info.h}`);
        }
      }
    }

    // Images
    for (const im of pg.imgs) {
      const label = im.src.slice(0, 60);
      if (im.alt === null) fail(row, `image without alt: ${label}`);
      else if (im.alt === '' ) { /* decorative */ }
      else if (/\.(jpe?g|png|webp|avif)$/i.test(im.alt) || /^(img|image|photo|dsc)[-_ ]?\d*$/i.test(im.alt)) fail(row, `image alt looks like a file name: ${im.alt}`);
      // next/image with `fill` sits in a container with a fixed aspect ratio; every other image needs width and height.
      if (!im.fill && !(im.width && im.height)) fail(row, `image without width and height: ${label}`);
    }
    // Hero priority check for non-noindex pages with images
    const sizes: number[] = [];
    for (const im of pg.imgs) {
      if (!im.src.startsWith('/_next/image') && !im.src.startsWith('/images') && !im.src.startsWith('/media')) continue;
      const key = mobileCandidate(im);
      if (!imageCache.has(key)) {
        const r = await get(key);
        const buf = Buffer.from(await r.arrayBuffer());
        imageCache.set(key, { status: r.status, type: r.headers.get('content-type'), w: 0, h: 0, bytes: buf.length });
      }
      const info = imageCache.get(key)!;
      if (info.status !== 200) fail(row, `image ${key.slice(0, 70)} answered ${info.status}`);
      sizes.push(info.bytes);
      if (info.bytes > 300_000) warn(row, `heavy image ${(info.bytes / 1024).toFixed(0)} KB: ${key.slice(0, 60)}`);
    }
    row.imgBytes = sizes.reduce((a, b) => a + b, 0);
    if (row.bytes + row.imgBytes > 1_500_000) warn(row, `page weight ${(((row.bytes + row.imgBytes) / 1024 / 1024)).toFixed(2)} MB over 1.5 MB`);

    // Links
    const seenLinks = new Set<string>();
    for (const l of pg.links) {
      const href = l.href;
      if (href === '#' || href === '') { fail(row, 'empty or "#" href'); continue; }
      if (href.startsWith('tel:')) { if (!/^tel:\+\d{9,15}$/.test(href)) fail(row, `malformed tel link ${href}`); continue; }
      if (href.startsWith('mailto:')) { if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?$/i.test(href)) fail(row, `malformed mailto link ${href}`); continue; }
      const label = (l.text || l.aria || '').trim();
      if (/^(click here|here|read more|more|learn more)$/i.test(l.text) && !l.aria) fail(row, `non-descriptive anchor "${l.text}" -> ${href}`);
      if (href.startsWith('/') && !href.startsWith('//')) {
        const path = href.split('#')[0]!.split('?')[0]!;
        if (!path || seenLinks.has(path) || path.startsWith('/_next')) continue;
        seenLinks.add(path);
        if (path.startsWith('/og/') || path.startsWith('/media/') || path.startsWith('/images/')) continue;
        if (!label && !pg.imgs.length) warn(row, `link with no text: ${path}`);
        const r = await probe(path);
        if (r.status >= 400) fail(row, `broken internal link ${path} (${r.status})`);
        else if (r.status >= 300) fail(row, `internal link to redirected URL ${path} -> ${r.location}`);
      } else if (href.startsWith('http://')) warn(row, `insecure link ${href}`);
    }

    // JSON-LD and content
    row.types = [...new Set(ldTypes(pg.ld.map((b) => { try { return JSON.parse(b); } catch { return {}; } })))];
    if (!noindexExpected) checkLd(row, route, pg.ld);
    row.words = pg.words;
    if (SERVICE_RE.test(route) && pg.words < 250) fail(row, `thin service page (${pg.words} words, min 250)`);
    else if (UTILITY.has(route) && pg.words < 120 && !noindexExpected) fail(row, `thin utility page (${pg.words} words, min 120)`);
    if (!noindexExpected) texts.set(route, pg.text);
    if (row.bytes > 1_500_000) warn(row, 'HTML over 1.5 MB');
  }

  // Cross-page checks
  for (const [t, rs] of titles) if (rs.length > 1) for (const r of rs) fail(rows.find((x) => x.route === r)!, `duplicate title with ${rs.filter((x) => x !== r).join(', ')}`);
  for (const [t, rs] of descs) if (rs.length > 1) for (const r of rs) fail(rows.find((x) => x.route === r)!, `duplicate description with ${rs.filter((x) => x !== r).join(', ')}`);
  const shingles = (s: string) => { const w = s.toLowerCase().split(' '); const set = new Set<string>(); for (let i = 0; i + 8 <= w.length; i += 1) set.add(w.slice(i, i + 8).join(' ')); return set; };
  const svc = [...texts.keys()].filter((r) => SERVICE_RE.test(r));
  const sh = new Map(svc.map((r) => [r, shingles(texts.get(r)!)]));
  for (let i = 0; i < svc.length; i++) for (let j = i + 1; j < svc.length; j++) {
    const a = sh.get(svc[i]!)!; const b = sh.get(svc[j]!)!;
    let common = 0; for (const x of a) if (b.has(x)) common++;
    const ratio = common / Math.min(a.size, b.size);
    if (ratio > 0.6) fail(rows.find((x) => x.route === svc[i])!, `near-duplicate text with ${svc[j]} (${Math.round(ratio * 100)}%)`);
  }

  // Sitemap versus noindex and redirects
  for (const p of sitemapPaths) {
    const r = rows.find((x) => x.route === p);
    if (r?.noindex) gfail(`sitemap lists noindex URL ${p}`);
    if (redirects.some((x) => x.source === p)) gfail(`sitemap lists redirected URL ${p}`);
  }

  // 404 behaviour
  for (const p of ['/this-page-does-not-exist', '/services/not-a-real-service', '/shop/not-a-real-product', '/blog/not-a-real-post', '/shop/category/not-a-category']) {
    const r = await get(p);
    if (r.status !== 404) gfail(`${p} answered ${r.status} instead of 404`);
    else {
      const body = await r.text();
      const pg = await parse(body);
      if (!/noindex/i.test(pg.robots ?? '')) gfail(`${p} 404 page is not noindex`);
      // A notFound() thrown inside a dynamic DB-backed page (/shop/...) returns Next.js's empty error shell that client JS fills in; the
      // status and noindex are still correct, so only static 404s (proxy rewrite or unmatched URL) are held to the h1 rule.
      if (!p.startsWith('/shop/') && pg.h.filter((x) => x.level === 1).length !== 1) gfail(`${p} 404 page needs exactly one h1`);
    }
  }

  // Redirects: every legacy URL is a single-hop 301 to a final 200 URL
  let redirectProblems = 0;
  for (const r of redirects) {
    const src = r.source.replace(/:[a-z]+\*?/g, 'x');
    if (src.includes(':') || src.includes('*')) continue;
    const a = await get(src);
    if (a.status !== 301) { gfail(`legacy ${src} answered ${a.status}, not 301`); redirectProblems++; continue; }
    const loc = a.headers.get('location') ?? '';
    const path = loc.startsWith('http') ? new URL(loc).pathname + new URL(loc).search : loc;
    const b = await get(path);
    if (b.status !== 200) { gfail(`legacy ${src} -> ${path} is ${b.status} (chain or broken)`); redirectProblems++; }
  }

  // Host and robots
  const robots = await (await get('/robots.txt')).text();
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) gfail('robots.txt lacks the absolute Sitemap line');
  for (const d of ['/admin', '/api', '/cart', '/checkout', '/order']) if (!new RegExp(`Disallow: ${d}\\b`).test(robots)) gfail(`robots.txt does not disallow ${d}`);
  if (/Disallow: \/og/.test(robots) || /Disallow: \/_next/.test(robots) || /Disallow: \/images/.test(robots) || /Disallow: \/media/.test(robots)) gfail('robots.txt blocks assets or /og');
  const man = await (await get('/manifest.webmanifest')).json() as { icons?: { src: string; sizes: string }[] };
  for (const ic of man.icons ?? []) if ((await get(ic.src)).status !== 200) gfail(`manifest icon ${ic.src} missing`);
  for (const f of ['/favicon.ico', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png']) if ((await get(f)).status !== 200) gfail(`${f} missing`);

  await browser.close();

  // Report
  const failing = rows.filter((r) => r.issues.length);
  const total = rows.reduce((a, r) => a + r.issues.length, 0) + global.length;
  fs.mkdirSync('docs/seo-audit', { recursive: true });
  fs.writeFileSync('docs/seo-audit/audit.json', JSON.stringify({ origin: ORIGIN, generated: new Date().toISOString(), global, rows }, null, 2));
  const md: string[] = [
    '# SEO audit', '',
    `Generated by \`npm run seo:audit\` against the production build (\`next build\` + \`next start\`, port ${PORT}) with \`NEXT_PUBLIC_SITE_URL=${ORIGIN}\`. Raw data: \`docs/seo-audit/audit.json\`.`, '',
    `**Result: ${total === 0 ? 'PASS' : 'FAIL'}.** ${rows.length} routes audited, ${failing.length} with failures, ${total} failures in total, ${rows.reduce((a, r) => a + r.warnings.length, 0)} warnings. ${redirects.length} legacy redirect rules checked for single-hop 301s.`, '',
    ...(global.length ? ['## Site-wide failures', '', ...global.map((g) => `- ${g}`), ''] : []),
    '## Per-route table', '',
    '| Route | Status | Title | Desc | H1 | JSON-LD types | Words | KB (html+img) | Issues |', '|---|---|---|---|---|---|---|---|---|',
    ...rows.map((r) => `| \`${r.route}\` | ${r.status} | ${r.titleLen} | ${r.descLen} | ${r.h1} | ${r.types.join(', ') || '-'} | ${r.words} | ${Math.round((r.bytes + r.imgBytes) / 1024)} | ${r.issues.length ? r.issues.join('; ').replace(/\|/g, '/') : 'none'} |`), '',
    ...(rows.some((r) => r.warnings.length) ? ['## Warnings (not failures)', '', ...rows.filter((r) => r.warnings.length).map((r) => `- \`${r.route}\`: ${[...new Set(r.warnings)].slice(0, 6).join('; ')}`), ''] : []),
  ];
  fs.writeFileSync('docs/SEO-AUDIT.md', md.join('\n'));
  console.log(`${rows.length} routes, ${total} failures (${global.length} site-wide).`);
  for (const r of failing) for (const i of r.issues) console.log(`  FAIL ${r.route}: ${i}`);
  for (const g of global) console.log(`  FAIL site: ${g}`);
  return total;
}

let code = 1;
try { code = (await main()) ? 1 : 0; } catch (e) { console.error(e); } finally { stopServer(); }
process.exit(code);
