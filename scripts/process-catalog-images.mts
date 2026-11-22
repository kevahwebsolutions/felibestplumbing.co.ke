/**
 * Converts the raw, gitignored catalog-import/images screen captures into the optimised WebP files that are
 * committed under public/images/catalog. Auto-orients, never upscales, caps the long edge at 1600 px.
 * Writes src/data/catalog-image-meta.json (pixel size and bytes per file) for the report and the checks.
 *
 * Usage: tsx scripts/process-catalog-images.mts
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { CATALOG_PRODUCTS } from '../src/data/catalog-products';

const SRC = path.resolve('catalog-import/images');
const OUT = path.resolve('public/images/catalog');
fs.mkdirSync(OUT, { recursive: true });

const meta: Record<string, { width: number; height: number; bytes: number; source: string }> = {};
for (const p of CATALOG_PRODUCTS) {
  for (const im of p.images) {
    const input = path.join(SRC, im.source);
    if (!fs.existsSync(input)) throw new Error(`Missing source image ${im.source}`);
    const buf = await sharp(input)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, im.file), buf.data);
    meta[im.file] = { width: buf.info.width, height: buf.info.height, bytes: buf.data.length, source: im.source };
    console.log(`${im.file}  ${buf.info.width}x${buf.info.height}  ${(buf.data.length / 1024).toFixed(1)} KB`);
  }
}
fs.writeFileSync(path.resolve('src/data/catalog-image-meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
console.log(`Wrote ${Object.keys(meta).length} images.`);
