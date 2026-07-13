// convert-images.js
// Scans images/ for .png files and creates .webp variants (original size + 1280/800/480 if applicable)
// Usage: node convert-images.js

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'images');
const SIZES = [1280, 800, 480]; // resized variants

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.png$/i.test(e.name)) files.push(full);
  }
  return files;
}

async function convert(file) {
  try {
    const { dir, name } = path.parse(file);
    const img = sharp(file, { failOnError: false });
    const metadata = await img.metadata();
    const outMain = path.join(dir, `${name}.webp`);
    // write main webp (keep original dimensions)
    await img.webp({ quality: 80 }).toFile(outMain);
    console.log('created', outMain);
    // resized variants
    for (const w of SIZES) {
      if (metadata.width && metadata.width <= w) continue; // skip if source smaller
      const out = path.join(dir, `${name}-${w}w.webp`);
      await sharp(file).resize({ width: w }).webp({ quality: 75 }).toFile(out);
      console.log('created', out);
    }
  } catch (err) {
    console.error('failed', file, err.message);
  }
}

(async ()=>{
  try{
    const files = await walk(IMAGES_DIR);
    console.log('png files found:', files.length);
    for (const f of files) {
      await convert(f);
    }
    console.log('done');
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();
