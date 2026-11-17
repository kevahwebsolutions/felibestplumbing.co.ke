import { getDb, schema } from '@/db';
import { bookingSchema, normalizePhone, questionSchema } from '@/lib/schemas';
import { guard, json } from '@/lib/server/request';
import { forwardToWeb3Forms } from '@/lib/server/web3forms';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const blocked = guard(req, 'forms', 6, 10 * 60_000);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }
  const isQuestion = (body as { kind?: string })?.kind === 'question';
  const parsed = (isQuestion ? questionSchema : bookingSchema).safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0] ?? 'form')] ??= i.message;
    // A filled honeypot is reported as success so bots learn nothing.
    if (fieldErrors.website) return json({ ok: true });
    return json({ ok: false, error: 'Please check the highlighted fields', fieldErrors }, 422);
  }
  const d = parsed.data;
  if (d.website) return json({ ok: true });

  const db = getDb();
  const row = db
    .insert(schema.enquiries)
    .values({
      kind: d.kind, name: d.name, phone: normalizePhone(d.phone), email: d.email, service: d.service,
      preferredDate: d.preferredDate, message: d.message,
    })
    .returning({ id: schema.enquiries.id })
    .get();

  const forwarded = await forwardToWeb3Forms(`New ${d.kind} from ${d.name}`, {
    name: d.name,
    phone: normalizePhone(d.phone),
    email: d.email || 'not provided',
    service: d.service,
    preferred_date: d.preferredDate || 'not specified',
    message: d.message || 'none',
  });
  if (forwarded) db.update(schema.enquiries).set({ forwarded: true }).where(eq(schema.enquiries.id, row.id)).run();
  return json({ ok: true, id: row.id });
}
