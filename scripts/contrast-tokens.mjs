// Checks every text/background pair of the theme tokens in src/app/globals.css (:root --t-* values).
// Usage: node scripts/contrast-tokens.mjs   (exits 1 when a text pair is below 4.5:1, or a UI pair below 3:1)
import fs from 'node:fs';
import { ratio } from './contrast.mjs';

const css = fs.readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
const t = Object.fromEntries([...root.matchAll(/--t-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)].map((m) => [m[1], m[2]]));

// [foreground token, background token, minimum ratio, note]
const TEXT = 4.5, UI = 3;
const pairs = [
  ['ink', 'surface', TEXT, 'headings on page'], ['ink', 'surface-alt', TEXT, 'headings on steel band'], ['ink', 'tint', TEXT, 'text on tint'],
  ['body', 'surface', TEXT, 'body copy'], ['body', 'surface-alt', TEXT, 'body copy on steel band'], ['body', 'tint', TEXT, 'body copy on tint'],
  ['ink-muted', 'surface', TEXT, 'muted text'], ['ink-muted', 'surface-alt', TEXT, 'muted on steel band'], ['ink-muted', 'tint', TEXT, 'muted on tint'],
  ['brand', 'surface', TEXT, 'links and icons'], ['brand', 'surface-alt', TEXT, 'links on steel band'], ['brand', 'tint', TEXT, 'brand text on tint'],
  ['brand-strong', 'tint', TEXT, 'pills and chips'], ['brand-strong', 'surface', TEXT, 'chips'], ['brand-soft', 'surface', TEXT, 'soft brand text'], ['brand-soft', 'surface-alt', TEXT, 'soft brand on steel band'],
  ['on-brand', 'brand', TEXT, 'white on brand buttons and plates'], ['on-brand', 'brand-strong', TEXT, 'hover'],
  ['on-accent', 'accent', TEXT, 'orange CTA buttons and emergency band'], ['on-accent', 'accent-strong', TEXT, 'orange hover'],
  ['accent', 'surface', TEXT, 'orange text on white (hero headline, links)'], ['accent-strong', 'surface', TEXT, 'error text'], ['accent-strong', 'accent-tint', TEXT, 'error text on tint'], ['accent', 'accent-tint', UI, 'orange on tint: large text and icons only'],
  ['accent', 'surface-alt', UI, 'orange on steel: large text, stars and map pin only (404 numerals, icons)'],
  ['success', 'success-bg', TEXT, 'in stock pill'], ['ink', 'success-bg', TEXT, 'saved-order note'], ['body', 'success-bg', TEXT, 'saved-order note body'],
  ['whatsapp', 'surface', TEXT, 'green text on white'], ['surface', 'whatsapp', TEXT, 'white on WhatsApp button'], ['surface', 'whatsapp-strong', TEXT, 'WhatsApp hover'],
  ['focus', 'surface', UI, 'focus ring on white'], ['focus', 'surface-alt', UI, 'focus ring on steel band'], ['border-strong', 'surface', UI, 'input border on white'],
  ['brand', 'surface', UI, 'outline button border'], ['accent-bright', 'surface', UI, 'decorative orange tick (large graphic)'],
];
let bad = 0;
for (const [fg, bg, min, note] of pairs) {
  const r = ratio(t[fg], t[bg]);
  const ok = r >= min;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)} (min ${min})  ${fg} ${t[fg]} on ${bg} ${t[bg]}  ${note}`);
}
console.log(bad ? `\n${bad} failing pair(s)` : '\nAll token pairs pass');
process.exit(bad ? 1 : 0);
