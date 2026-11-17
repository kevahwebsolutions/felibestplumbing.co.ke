// Crawls a running site: every sitemap URL must answer 200, have exactly one h1, a title,
// a meta description, a canonical link, alt text on every image and no broken internal links.
// Usage: BASE_URL=http://localhost:3000 npm run check:site
const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

async function get(path: string) {
  return fetch(base + path, { redirect: 'manual' });
}

const sm = await (await get('/sitemap.xml')).text();
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
const extra = ['/cart', '/checkout', '/privacy', '/terms'];
const all = [...new Set([...pages, ...extra])];

let problems = 0;
const fail = (msg: string) => { problems++; console.error('FAIL', msg); };
const linkCache = new Map<string, number>();

for (const p of all) {
  const res = await get(p);
  if (res.status !== 200) { fail(`${p} answered ${res.status}`); continue; }
  const html = await res.text();
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(`${p} has ${h1} h1 elements`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${p} has no useful title`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) fail(`${p} has no meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${p} has no canonical link`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) fail(`${p} has an image without alt: ${m[0].slice(0, 80)}`);
  const links = new Set([...html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)].map((m) => m[1]!));
  for (const l of links) {
    if (l.startsWith('/_next') || l.startsWith('//')) continue;
    if (!linkCache.has(l)) linkCache.set(l, (await get(l)).status);
    const s = linkCache.get(l)!;
    if (s >= 400) fail(`${p} links to ${l} (${s})`);
  }
}

const robots = await (await get('/robots.txt')).text();
if (!/Sitemap:/i.test(robots)) fail('robots.txt has no Sitemap line');
const man = await get('/manifest.webmanifest');
if (man.status !== 200) fail('manifest missing');
for (const icon of ['/icons/icon-192.png', '/icons/icon-512.png']) if ((await get(icon)).status !== 200) fail(`${icon} missing`);

console.log(`${all.length} pages and ${linkCache.size} unique internal links checked, ${problems} problems.`);
process.exit(problems ? 1 : 0);
