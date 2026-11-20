import fs from 'node:fs/promises';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { getProductBySlug } from '@/lib/server/products';
import { readUpload } from '@/lib/server/uploads';
import { kes } from '@/lib/whatsapp-message';

export const dynamic = 'force-dynamic';

const W = 1200;
const H = 630;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap to at most `lines` lines of `width` characters. */
function wrap(text: string, width: number, lines: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    if ((cur + ' ' + word).trim().length > width && cur) {
      out.push(cur);
      cur = word;
    } else cur = (cur + ' ' + word).trim();
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    const kept = out.slice(0, lines);
    kept[lines - 1] = `${kept[lines - 1]!.slice(0, Math.max(0, width - 3)).trimEnd()}...`;
    return kept;
  }
  return out;
}

async function loadImage(src: string): Promise<Buffer | null> {
  try {
    if (src.startsWith('http')) return null;
    if (src.startsWith('/')) return await fs.readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', src.replace(/^\/+/, '')));
    return await readUpload(src);
  } catch {
    return null;
  }
}

/**
 * 1200x630 JPEG for link previews. WhatsApp does not reliably render WebP previews, so this is a JPEG:
 * the primary product photo on white, the Felibest logo, the name and the KES price.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = getProductBySlug(slug);
  if (!p || !p.published) return new Response('Not found', { status: 404 });

  const layers: OverlayOptions[] = [];
  const photo = p.images[0] ? await loadImage(p.images[0].src) : null;
  if (photo) {
    const fitted = await sharp(photo).rotate().resize(520, 520, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
    layers.push({ input: fitted, left: 56, top: 55 });
  }
  const logo = await sharp(path.join(/*turbopackIgnore: true*/ process.cwd(), 'public/images/logo-light.png')).resize(110, 110, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer();
  layers.push({ input: logo, left: W - 110 - 56, top: 48 });

  const name = wrap(p.name, 19, 3);
  const nameSvg = name.map((l, i) => `<text x="640" y="${268 + i * 62}" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#0b2a4a">${esc(l)}</text>`).join('');
  const priceY = 268 + name.length * 62 + 48;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="56" y="55" width="520" height="520" fill="none" stroke="#d3dfec" stroke-width="2" rx="10"/>
    <text x="640" y="212" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="3" fill="#0c4c93">${esc(p.categoryName.toUpperCase())}</text>
    ${nameSvg}
    <text x="640" y="${priceY}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#d63a0c">${esc(kes(p.finalPrice))}</text>
    <text x="640" y="${H - 62}" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#475569">Felibest Plumbing shop, Nairobi</text>
    <rect x="0" y="${H - 14}" width="${W}" height="14" fill="#0c4c93"/>
  </svg>`;
  layers.push({ input: Buffer.from(svg), left: 0, top: 0 });

  const jpeg = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite(layers)
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
    },
  });
}
