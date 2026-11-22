import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getProductBySlug } from '@/lib/server/products';
import { readUpload } from '@/lib/server/uploads';

export const dynamic = 'force-dynamic';

const W = 1200;
const H = 630;
const BOX = 570;

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
 * 1200x630 JPEG for link previews (WhatsApp does not reliably render WebP previews).
 * It is the plain primary product photo, centered on white with no text, so the centered
 * square crop that WhatsApp applies to small thumbnails shows the product itself.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = getProductBySlug(slug);
  if (!p || !p.published) return new Response('Not found', { status: 404 });

  const photo = p.images[0] ? await loadImage(p.images[0].src) : null;
  const source = photo ?? (await fs.readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), 'public/images/logo-light.png')));
  const fitted = await sharp(source)
    .rotate()
    .resize(BOX, BOX, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer();

  const jpeg = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([{ input: fitted, left: Math.round((W - BOX) / 2), top: Math.round((H - BOX) / 2) }])
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