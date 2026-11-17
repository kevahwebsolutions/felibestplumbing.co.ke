// Converts ONLY images referenced by the legacy pages into public/images as webp.
// Usage: node scripts/optimize-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const LEGACY = 'legacy';
const OUT = 'public/images';
const MAX_W = 1600;
const QUALITY = 78;
// Folders whose referenced images are real project photos (not template stock).
const PHOTO_DIRS = ['images/services2/', 'images/gallery/', 'images/services/', 'images/product/'];
// Individual brand and page assets that are still used by the new site.
const EXTRA = [
  'images/logo.webp',
  'images/Logo No Background.png',
  'images/sig.webp',
  'images/signature-img01.webp',
  'images/our-approach.webp',
];

const slug = (p) =>
  p
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/-+\//g, '/')
    .replace(/^-|-$/g, '');

const htmlFiles = fs.readdirSync(LEGACY).filter((f) => f.endsWith('.html'));
const refs = new Set(EXTRA);
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(LEGACY, f), 'utf8');
  for (const m of html.matchAll(/images\/[A-Za-z0-9_ ()./%-]+?\.(?:webp|jpe?g|png)/g)) {
    const ref = decodeURIComponent(m[0]);
    if (PHOTO_DIRS.some((d) => ref.startsWith(d))) refs.add(ref);
  }
}
// Keep one file per stem (prefer .webp, otherwise .jpg/.png), skip thumbnails and size variants.
const byStem = new Map();
for (const r of refs) {
  if (/-(480w|800w|1280w|sm|md|lg)\.[a-z]+$/i.test(r) || /_thumbnail\./.test(r)) continue;
  const stem = r.replace(/\.[a-z0-9]+$/i, '');
  const cur = byStem.get(stem);
  if (!cur || /\.webp$/i.test(r)) byStem.set(stem, r);
}

const manifest = {};
let inBytes = 0;
let outBytes = 0;
let n = 0;
for (const [stem, ref] of [...byStem].sort()) {
  let src = path.join(LEGACY, ref);
  if (!fs.existsSync(src)) {
    const alt = ['.webp', '.jpg', '.jpeg', '.png'].map((e) => path.join(LEGACY, stem + e)).find((p) => fs.existsSync(p));
    if (!alt) continue;
    src = alt;
  }
  const newRel = slug(ref.replace(/^images\//, '')) + '.webp';
  const dest = path.join(OUT, newRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const img = sharp(src, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const w = Math.min(meta.width ?? MAX_W, MAX_W);
  const info = await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 5 }).toFile(dest);
  inBytes += fs.statSync(src).size;
  outBytes += info.size;
  manifest['/images/' + newRel] = { w: info.width, h: info.height };
  n++;
}
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/image-manifest.json', JSON.stringify(manifest, null, 1));
console.log(`${n} images, ${(inBytes / 1e6).toFixed(1)} MB -> ${(outBytes / 1e6).toFixed(1)} MB`);
