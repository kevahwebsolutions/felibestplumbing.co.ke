import { desc } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { adminOrNull } from '@/lib/server/auth';
import { toCsv } from '@/lib/server/request';

export const dynamic = 'force-dynamic';

const iso = (s: number) => new Date(s * 1000).toISOString();

export async function GET(_req: Request, ctx: { params: Promise<{ kind: string }> }) {
  if (!(await adminOrNull())) return new Response('Unauthorized', { status: 401 });
  const { kind } = await ctx.params;
  const db = getDb();
  let rows: (string | number | null)[][];
  if (kind === 'orders') {
    const orders = db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).all();
    rows = [['Reference', 'Date', 'Customer', 'Phone', 'Email', 'Area', 'Address', 'Payment', 'Status', 'Subtotal KES', 'Delivery KES', 'Total KES', 'Notes'],
      ...orders.map((o) => [o.ref, iso(o.createdAt), o.customerName, o.phone, o.email, o.area, o.address, o.paymentMethod, o.status, o.subtotal, o.deliveryFee, o.total, o.notes])];
  } else if (kind === 'enquiries') {
    const list = db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).all();
    rows = [['Date', 'Type', 'Name', 'Phone', 'Email', 'Service', 'Preferred date', 'Message', 'Status', 'Internal notes'],
      ...list.map((e) => [iso(e.createdAt), e.kind, e.name, e.phone, e.email, e.service, e.preferredDate, e.message, e.status, e.notes])];
  } else {
    return new Response('Not found', { status: 404 });
  }
  return new Response(toCsv(rows), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="felibest-${kind}-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' },
  });
}
