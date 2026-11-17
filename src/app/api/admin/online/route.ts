import { adminOrNull } from '@/lib/server/auth';
import { onlineNow } from '@/lib/server/analytics';
import { getDb, schema } from '@/db';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await adminOrNull())) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const url = new URL(req.url);
  const body: { online: number; products?: { id: number; name: string }[] } = { online: onlineNow() };
  if (url.searchParams.get('products')) {
    body.products = getDb().select({ id: schema.products.id, name: schema.products.name }).from(schema.products).orderBy(asc(schema.products.name)).limit(300).all();
  }
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
