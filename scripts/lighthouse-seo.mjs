// Lighthouse (mobile) for the public routes that matter for SEO. Needs a running production build.
// Usage: BASE_URL=http://localhost:3100 node scripts/lighthouse-seo.mjs   (writes docs/LIGHTHOUSE-SEO.md and docs/lighthouse-seo/)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3100';
const routes = [
  ['home', '/'], ['service-emergency', '/services/emergency-plumbing'], ['service-drains', '/services/drain-lines'], ['service-solar', '/services/solar-water-heater'],
  ['blog-post', '/blog/low-water-pressure-causes-and-fixes'], ['shop', '/shop'], ['category', '/shop/category/showers'], ['product', '/shop/milano-modern-shower'],
  ['pricing', '/pricing'], ['gallery', '/gallery'], ['about', '/about'], ['contact', '/contact'], ['coverage', '/coverage'], ['faq', '/faq'],
];
fs.mkdirSync('docs/lighthouse-seo', { recursive: true });
const rows = [];
for (const [name, path] of routes) {
  const out = `docs/lighthouse-seo/${name}.json`;
  fs.rmSync(out, { force: true });
  const r = spawnSync('npx', ['lighthouse', base + path, '--quiet', '--output=json', `--output-path=${out}`, '--form-factor=mobile', '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags="--headless=new --no-sandbox"'],
    { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, shell: true, encoding: 'utf8' });
  if (!fs.existsSync(out)) { console.log(name, 'failed', r.stderr?.slice(0, 300)); continue; }
  const j = JSON.parse(fs.readFileSync(out, 'utf8'));
  const s = (k) => Math.round(j.categories[k].score * 100);
  const a = j.audits;
  const failed = Object.values(a).filter((x) => ['seo', 'best-practices', 'accessibility'].some((c) => j.categories[c].auditRefs.some((ref) => ref.id === x.id && ref.weight > 0)) && x.score !== null && x.score < 1).map((x) => x.id);
  rows.push({ name, path, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'), lcp: a['largest-contentful-paint'].displayValue, tbt: a['total-blocking-time'].displayValue, cls: a['cumulative-layout-shift'].displayValue, failed });
  console.log(rows.at(-1));
}
const md = ['# Lighthouse SEO run (mobile, production build)', '',
  `Measured ${new Date().toISOString().slice(0, 10)} with the Lighthouse CLI against \`next build\` + \`next start\` (NEXT_PUBLIC_SITE_URL=https://felibestplumbing.co.ke), Playwright Chromium, default mobile emulation with simulated Slow 4G and 4x CPU slowdown. Raw JSON in \`docs/lighthouse-seo/\`. Targets: SEO 100, Best Practices 95+, Accessibility 95+. Performance is reported, not targeted.`, '',
  '| Route | SEO | Best Practices | Accessibility | Performance | LCP | TBT | CLS | Audits below 100 |', '|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| \`${r.path}\` | ${r.seo} | ${r.bp} | ${r.a11y} | ${r.perf} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.failed.join(', ') || '-'} |`), ''];
fs.writeFileSync('docs/LIGHTHOUSE-SEO.md', md.join('\n'));
