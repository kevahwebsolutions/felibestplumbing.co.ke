import manifest from '@/data/image-manifest.json';

export type Img = { src: string; w: number; h: number; alt: string };
const entries = Object.entries(manifest as Record<string, { w: number; h: number }>);

function natural(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true });
}

export function img(src: string, alt: string): Img {
  const m = (manifest as Record<string, { w: number; h: number }>)[src];
  return { src, w: m?.w ?? 1200, h: m?.h ?? 900, alt };
}

export function imagesByPrefix(prefix: string, alt: string): Img[] {
  return entries
    .filter(([k]) => k.startsWith(prefix))
    .sort((a, b) => natural(a[0], b[0]))
    .map(([k, v]) => ({ src: k, w: v.w, h: v.h, alt }));
}
