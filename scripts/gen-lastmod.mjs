// Writes src/data/lastmod.json: the date each public page's source last changed (git commit date).
// Runs before `next build`; when git is unavailable (for example on the server) the committed file is kept.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const P = 'src/app/(site)';
const map = {
  '/': [`${P}/page.tsx`, 'src/data/content.ts'],
  '/about': [`${P}/about/page.tsx`],
  '/services': [`${P}/services/page.tsx`, 'src/data/services.ts'],
  services: ['src/data/services.ts', `${P}/services/[slug]/page.tsx`],
  '/shop': [`${P}/shop/page.tsx`],
  '/pricing': [`${P}/pricing/page.tsx`, 'src/data/content.ts'],
  '/gallery': [`${P}/gallery/page.tsx`, 'src/data/gallery.ts'],
  '/testimonials': [`${P}/testimonials/page.tsx`],
  '/faq': [`${P}/faq/page.tsx`, 'src/data/content.ts'],
  '/blog': [`${P}/blog/page.tsx`, 'src/data/blog.ts'],
  '/contact': [`${P}/contact/page.tsx`],
  '/coverage': [`${P}/coverage/page.tsx`, 'src/data/content.ts'],
  '/privacy': [`${P}/privacy/page.tsx`],
  '/terms': [`${P}/terms/page.tsx`],
};

const probe = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
if (probe.status !== 0) { console.log('git not available: keeping src/data/lastmod.json'); process.exit(0); }

const out = {};
for (const [key, files] of Object.entries(map)) {
  const r = spawnSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' });
  const d = r.stdout.trim();
  if (d) out[key] = d.slice(0, 10);
}
const prev = fs.existsSync('src/data/lastmod.json') ? JSON.parse(fs.readFileSync('src/data/lastmod.json', 'utf8')) : {};
fs.writeFileSync('src/data/lastmod.json', JSON.stringify({ ...prev, ...out }, null, 2) + '\n');
console.log('lastmod.json updated');
