'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';
import { updateEnquiryAction, updateOrderAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Select, Textarea } from '@/components/ui/field';
import { ENQUIRY_STATUSES, ORDER_STATUSES } from '@/lib/schemas';

const LABELS: Record<string, string> = { new: 'New', confirmed: 'Confirmed', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled', contacted: 'Contacted', done: 'Done' };

export function OrderControls({ id, status, notes }: { id: number; status: string; notes: string }) {
  const router = useRouter();
  const [s, setS] = React.useState(status);
  const [n, setN] = React.useState(notes);
  const [busy, setBusy] = React.useState(false);
  async function save() {
    setBusy(true);
    const res = await updateOrderAction({ id, status: s, internalNotes: n });
    setBusy(false);
    if (res.ok) { toast.success('Order updated'); router.refresh(); } else toast.error(res.error ?? 'Failed');
  }
  return (
    <div className="no-print fp-card space-y-4 p-6">
      <h2 className="font-heading text-2xl font-bold">Manage order</h2>
      <div><label htmlFor="o-status" className="mb-2 block pl-2 text-sm font-bold">Status</label>
        <Select id="o-status" value={s} onChange={(e) => setS(e.target.value)}>{ORDER_STATUSES.map((v) => <option key={v} value={v}>{LABELS[v]}</option>)}</Select></div>
      <div><label htmlFor="o-notes" className="mb-2 block pl-2 text-sm font-bold">Internal notes</label><Textarea id="o-notes" rows={4} value={n} onChange={(e) => setN(e.target.value)} /></div>
      <div className="flex flex-wrap gap-3"><Button onClick={save} disabled={busy}>Save changes</Button><Button variant="ghost" onClick={() => window.print()}><Printer className="size-5" aria-hidden /> Print invoice</Button></div>
    </div>
  );
}

export function EnquiryRow({ e }: { e: { id: number; kind: string; name: string; phone: string; email: string; service: string; preferredDate: string; message: string; status: string; notes: string; createdAt: number; forwarded: boolean } }) {
  const router = useRouter();
  const [status, setStatus] = React.useState(e.status);
  const [notes, setNotes] = React.useState(e.notes);
  const [busy, setBusy] = React.useState(false);
  async function save(next?: string) {
    setBusy(true);
    const res = await updateEnquiryAction({ id: e.id, status: next ?? status, notes });
    setBusy(false);
    if (res.ok) { toast.success('Saved'); router.refresh(); } else toast.error(res.error ?? 'Failed');
  }
  return (
    <article className="fp-card grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr]" aria-label={`Enquiry from ${e.name}`}>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2"><h3 className="font-heading text-xl font-bold">{e.name}</h3><span className="fp-pill">{e.kind}</span><span className="text-xs text-ink-muted">{new Date(e.createdAt * 1000).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
        <p><a className="font-bold text-brand-soft underline" href={`tel:${e.phone}`}>{e.phone}</a>{e.email ? <> &middot; <a className="underline" href={`mailto:${e.email}`}>{e.email}</a></> : null}</p>
        {e.service ? <p className="text-sm"><strong>Service:</strong> {e.service}{e.preferredDate ? ` (preferred ${e.preferredDate})` : ''}</p> : null}
        {e.message ? <p className="rounded-lg bg-surface-alt p-3 text-body">{e.message}</p> : null}
        <p className="text-xs text-ink-muted">{e.forwarded ? 'Forwarded by email' : 'Not forwarded by email'}</p>
      </div>
      <div className="space-y-3">
        <label htmlFor={`st-${e.id}`} className="sr-only">Status</label>
        <Select id={`st-${e.id}`} value={status} onChange={(ev) => { setStatus(ev.target.value); void save(ev.target.value); }}>{ENQUIRY_STATUSES.map((v) => <option key={v} value={v}>{LABELS[v]}</option>)}</Select>
        <label htmlFor={`nt-${e.id}`} className="sr-only">Notes</label>
        <Textarea id={`nt-${e.id}`} rows={2} placeholder="Internal notes" value={notes} onChange={(ev) => setNotes(ev.target.value)} className="!min-h-20" />
        <Button size="sm" variant="blue" onClick={() => save()} disabled={busy}>Save notes</Button>
      </div>
    </article>
  );
}
