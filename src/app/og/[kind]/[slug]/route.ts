import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getService } from '@/data/services';
import { getPost } from '@/data/blog';

const W = 1200;
const H = 630;
const BAND = 130;
const BRAND = '#0c4c93';

/** Photos used for the generic pages. All are real project photos already on the site. */
const PAGE_PHOTOS: Record<string, string> = {
  home: '/images/gallery/gallery03.webp',
  services: '/images/services2/commercial-1.webp',
  shop: '/images/gallery/gallery09.webp',
  pricing: '/images/gallery/gallery07.webp',
  gallery: '/images/gallery/gallery05.webp',
  about: '/images/gallery/gallery03.webp',
  contact: '/images/services/plumbing-emergency.webp',
  coverage: '/images/gallery/gallery07.webp',
  blog: '/images/services/water-pressure.webp',
  faq: '/images/services/consultation-services.webp',
  testimonials: '/images/gallery/gallery09.webp',
  privacy: '/images/gallery/gallery03.webp',
  terms: '/images/gallery/gallery03.webp',
};

const read = (rel: string) => fs.readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', rel.replace(/^\/+/, '')));

/**
 * Branded 1200x630 JPEG for link previews: the page photo cropped to fill, with a blue band carrying the logo.
 * JPEG because WhatsApp and several other crawlers do not render WebP previews reliably.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await ctx.params;
  let photo: string | undefined;
  if (kind === 'service') photo = getService(slug)?.heroSrc;
  else if (kind === 'blog') photo = getPost(slug)?.cover;
  else if (kind === 'page') photo = PAGE_PHOTOS[slug];
  if (!photo) return new Response('Not found', { status: 404 });

  const [source, logoSrc] = await Promise.all([read(photo), read('/images/logo-white.webp')]);
  const base = await sharp(source).rotate().resize(W, H - BAND, { fit: 'cover', position: 'attention' }).flatten({ background: '#ffffff' }).toBuffer();
  const logo = await sharp(logoSrc).resize({ height: BAND - 30 }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const label = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BAND}"><text x="${40 + (logoMeta.width ?? 100) + 30}" y="${BAND / 2 + 16}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff">Felibest Plumbing, Nairobi</text></svg>`,
  );
  const jpeg = await sharp({ create: { width: W, height: H, channels: 3, background: BRAND } })
    .composite([
      { input: base, left: 0, top: 0 },
      { input: logo, left: 40, top: H - BAND + 15 },
      { input: label, left: 0, top: H - BAND },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
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
