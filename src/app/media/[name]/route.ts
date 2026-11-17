import { readUpload } from '@/lib/server/uploads';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const data = await readUpload(name);
  if (!data) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
    },
  });
}
