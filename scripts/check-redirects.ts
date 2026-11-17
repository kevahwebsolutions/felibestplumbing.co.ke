// Verifies every legacy URL answers with a 301 to the mapped new route.
// Usage: BASE_URL=http://localhost:3000 npm run check:redirects
import fs from 'node:fs';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const map: { source: string; destination: string }[] = JSON.parse(fs.readFileSync('config/legacy-redirects.json', 'utf8'));

let bad = 0;
for (const r of map) {
  const res = await fetch(base + r.source, { redirect: 'manual' });
  const loc = res.headers.get('location') ?? '';
  const target = loc.startsWith('http') ? new URL(loc).pathname : loc;
  if (res.status !== 301 || target !== r.destination) {
    bad++;
    console.error(`FAIL ${r.source} -> ${res.status} ${loc} (expected 301 ${r.destination})`);
  }
  const final = await fetch(base + r.destination, { redirect: 'manual' });
  if (final.status !== 200) {
    bad++;
    console.error(`FAIL destination ${r.destination} answered ${final.status}`);
  }
}
console.log(`${map.length} legacy URLs checked, ${bad} problems.`);
process.exit(bad ? 1 : 0);
