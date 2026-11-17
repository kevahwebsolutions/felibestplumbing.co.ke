import { OrderError, placeOrder } from '@/lib/server/orders';
import { guard, json } from '@/lib/server/request';
import { checkoutSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const blocked = guard(req, 'orders', 8, 10 * 60_000);
  if (blocked) return blocked;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }
  const customer = (body as { customer?: unknown })?.customer;
  const check = checkoutSchema.safeParse(customer);
  if (check.success && check.data.website) return json({ ok: false, error: 'Request rejected' }, 400);
  try {
    const placed = await placeOrder(body);
    return json({ ok: true, ref: placed.ref, total: placed.total, instructions: placed.payment.instructions, redirectUrl: placed.payment.redirectUrl ?? null });
  } catch (e) {
    if (e instanceof OrderError) return json({ ok: false, error: e.message }, 422);
    console.error('order failed', e);
    return json({ ok: false, error: 'We could not place your order. Please try again or call us.' }, 500);
  }
}
