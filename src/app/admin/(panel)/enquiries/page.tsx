import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { Download } from 'lucide-react';
import { EnquiryRow } from '@/components/admin/order-controls';
import { getDb, schema } from '@/db';

export const metadata = { title: 'Enquiries' };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const all = getDb().select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).all();
  const rows = status && ['new', 'contacted', 'done'].includes(status) ? all.filter((e) => e.status === status) : all;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-4xl font-bold sm:text-5xl">Enquiries and bookings</h1>
        <a href="/admin/export/enquiries" className="fp-button fp-button-ghost fp-button-sm"><Download className="size-4" aria-hidden /> Export CSV</a>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <Link href="/admin/enquiries" className="fp-chip" data-active={!status}>All ({all.length})</Link>
        {(['new', 'contacted', 'done'] as const).map((s) => <Link key={s} href={`/admin/enquiries?status=${s}`} className="fp-chip capitalize" data-active={status === s}>{s} ({all.filter((e) => e.status === s).length})</Link>)}
      </div>
      <div className="space-y-4">{rows.map((e) => <EnquiryRow key={e.id} e={e} />)}</div>
      {rows.length === 0 ? <p className="fp-card p-10 text-center text-ink-muted">Nothing here yet.</p> : null}
    </div>
  );
}
