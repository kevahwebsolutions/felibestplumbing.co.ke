// Runs Lighthouse (mobile, default throttling) N times per route against one running production build
// and writes the median of each metric to <out>/summary.json.
// Usage: BASE_URL=http://localhost:3300 OUT=docs/lighthouse-light RUNS=3 node scripts/lighthouse-compare.mjs
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3300';
const out = process.env.OUT ?? 'docs/lighthouse-light';
const runs = Number(process.env.RUNS ?? 3);
const routes = [
  ['home', '/'], ['service', '/services/emergency-plumbing'], ['shop', '/shop'],
  ['product', '/shop/intatherm-safe-touch-basin-mixer-tap'], ['contact', '/contact'],
];
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
fs.mkdirSync(out, { recursive: true });
const summary = [];
for (const [name, p] of routes) {
  const samples = [];
  for (let i = 0; i < runs; i++) {
    const file = `${out}/${name}-${i + 1}.json`;
    spawnSync('npx', ['lighthouse', base + p, '--quiet', '--output=json', `--output-path=${file}`, '--form-factor=mobile', '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags="--headless=new --no-sandbox"'],
      { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, shell: true, encoding: 'utf8' });
    if (!fs.existsSync(file)) { console.log(name, i + 1, 'failed'); continue; }
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    const a = j.audits;
    samples.push({
      perf: Math.round(j.categories.performance.score * 100), a11y: Math.round(j.categories.accessibility.score * 100),
      bp: Math.round(j.categories['best-practices'].score * 100), seo: Math.round(j.categories.seo.score * 100),
      lcp: a['largest-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue,
      fcp: a['first-contentful-paint'].numericValue, bench: j.environment.benchmarkIndex,
    });
    console.log(name, i + 1, samples.at(-1).perf);
    fs.unlinkSync(file); // keep the repo small: only the summary is stored
  }
  const m = (k) => median(samples.map((s) => s[k]));
  summary.push({ name, path: p, runs: samples.length, perf: m('perf'), perfAll: samples.map((s) => s.perf), a11y: m('a11y'), bp: m('bp'), seo: m('seo'), lcp: m('lcp'), tbt: m('tbt'), cls: m('cls'), fcp: m('fcp'), bench: m('bench') });
}
fs.writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
console.log('done');
