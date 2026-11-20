// Recolours the white ring and lettering of the logo to brand navy so it reads on white.
// Source: public/images/logo-white.webp. Output: public/images/logo-light.(webp|png) and the PWA icons.
import sharp from 'sharp';

const NAVY = [12, 76, 147];
const src = 'public/images/logo-white.webp';
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.from(data);
for (let i = 0; i < out.length; i += 4) {
  const lo = Math.min(out[i], out[i + 1], out[i + 2]);
  const t = Math.max(0, Math.min(1, (lo - 150) / (240 - 150)));
  if (t > 0) for (let c = 0; c < 3; c++) out[i + c] = Math.round(out[i + c] * (1 - t) + NAVY[c] * t);
}
const base = () => sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
await base().webp({ quality: 90, alphaQuality: 100 }).toFile('public/images/logo-light.webp');
await base().png().toFile('public/images/logo-light.png');

// PWA / favicon icons: logo on a white plate with padding so it also works as a maskable icon.
const plate = async (size, file, pad) => {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await base().resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, gravity: 'centre' }]).png().toFile(file);
};
await plate(512, 'public/icons/icon-512.png', 0.1);
await plate(192, 'public/icons/icon-192.png', 0.1);
await plate(180, 'public/icons/apple-touch-icon.png', 0.1);
console.log('logo variants written');
