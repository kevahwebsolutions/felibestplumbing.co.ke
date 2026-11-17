// Runs Lighthouse (mobile) against a running production build and writes JSON plus docs/LIGHTHOUSE-V2.md.
// Usage: BASE_URL=http://localhost:3001 node scripts/lighthouse-v2.mjs
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3001';
const routes = [
  ['home', '/'], ['service', '/services/emergency-plumbing'], ['shop', '/shop'],
  ['product', '/shop/intatherm-safe-touch-basin-mixer-tap'], ['contact', '/contact'], ['gallery', '/gallery'],
];
fs.mkdirSync('docs/lighthouse-v2', { recursive: true });
const rows = [];
for (const [name, path] of routes) {
  const out = `docs/lighthouse-v2/${name}${process.env.CPU_SLOWDOWN ? '-cpu' + process.env.CPU_SLOWDOWN : ''}.json`;
  const r = spawnSync('npx', ['lighthouse', base + path, '--quiet', '--output=json', `--output-path=${out}`, '--form-factor=mobile', '--only-categories=performance,accessibility,best-practices,seo', ...(process.env.CPU_SLOWDOWN ? ['--throttling.cpuSlowdownMultiplier=' + process.env.CPU_SLOWDOWN] : []),
    `--chrome-flags=--headless=new --no-sandbox`], { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, shell: true, encoding: 'utf8' });
  if (!fs.existsSync(out)) { console.log(name, 'failed', r.stderr?.slice(0, 300)); continue; }
  const j = JSON.parse(fs.readFileSync(out, 'utf8'));
  const s = (k) => Math.round(j.categories[k].score * 100);
  const a = j.audits;
  rows.push({ name, path, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'), lcp: a['largest-contentful-paint'].displayValue, tbt: a['total-blocking-time'].displayValue, cls: a['cumulative-layout-shift'].displayValue });
  console.log(rows.at(-1));
}
const md = ['# Lighthouse V2 (mobile, production build)', '', `Measured ${new Date().toISOString().slice(0, 10)} with the Lighthouse CLI against \`next build\` + \`next start\`, Playwright Chromium, default mobile emulation and simulated Slow 4G throttling. Raw JSON in \`docs/lighthouse-v2/\`.`, '',
  '| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |', '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| \`${r.path}\` | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.tbt} | ${r.cls} |`), ''];
fs.writeFileSync('docs/LIGHTHOUSE-V2.md', md.join('\n'));
