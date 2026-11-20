import Link from 'next/link';
import { Download, MessageCircle } from 'lucide-react';
import { listOrders } from '@/lib/server/orders';
import { formatKES } from '@/lib/utils';
import { STATUS_LABEL } from '@/lib/labels';
import { buildCustomerConfirmation, customerChatUrl } from '@/lib/whatsapp-message';
import { WhatsAppBadge } from '@/components/admin/whatsapp-badge';

export const metadata = { title: 'Orders' };


export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const all = listOrders();
  const filtered = status && STATUS_LABEL[status] ? all.filter((o) => o.status === status) : all;
  // New orders first, then newest first.
  const orders = [...filtered].sort((a, b) => Number(b.status === 'new') - Number(a.status === 'new') || b.createdAt - a.createdAt);
  const newCount = all.filter((o) => o.status === 'new').length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-3 font-heading text-4xl font-bold sm:text-5xl">Orders {newCount ? <span className="fp-pill fp-pill-orange !text-base">{newCount} new</span> : null}</h1>
        <a href="/admin/export/orders" className="fp-button fp-button-ghost fp-button-sm"><Download className="size-4" aria-hidden /> Export CSV</a>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <Link href="/admin/orders" className="fp-chip" data-active={!status}>All ({all.length})</Link>
        {Object.entries(STATUS_LABEL).map(([k, v]) => <Link key={k} href={`/admin/orders?status=${k}`} className="fp-chip" data-active={status === k}>{v} ({all.filter((o) => o.status === k).length})</Link>)}
      </div>
      <div className="fp-card overflow-x-auto p-2">
        <table className="w-full min-w-[820px] text-left">
          <caption className="sr-only">Orders</caption>
          <thead><tr className="text-xs uppercase tracking-wider text-ink-muted">{['Reference', 'Customer', 'Date', 'Payment', 'Total', 'Status', 'WhatsApp'].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className={`border-t border-line hover:bg-surface-alt ${o.status === 'new' ? 'bg-accent-tint/60 shadow-[inset_4px_0_0_var(--color-accent)]' : ''}`}>
                <th scope="row" className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="font-bold text-brand underline-offset-4 hover:underline">{o.ref}</Link></th>
                <td className="px-4 py-3">{o.customerName}<span className="block text-xs text-ink-muted">{o.phone}</span></td>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(o.createdAt * 1000).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3">{o.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'On delivery'}</td>
                <td className="px-4 py-3 font-bold">{formatKES(o.total)}</td>
                <td className="px-4 py-3">{o.status === 'new' ? <span className="fp-pill fp-pill-orange">New</span> : <span className="fp-pill">{STATUS_LABEL[o.status]}</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-2">
                    <WhatsAppBadge notifiedAt={o.whatsappNotifiedAt} error={o.whatsappNotifyError} />
                    <a href={customerChatUrl(o.phone, buildCustomerConfirmation(o))} target="_blank" rel="noopener noreferrer" className="fp-button fp-button-whatsapp fp-button-sm !min-h-10 !px-3 !text-base"><MessageCircle className="size-4" aria-hidden /> Open in WhatsApp<span className="sr-only"> for {o.customerName}, opens in a new tab</span></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className="p-10 text-center text-ink-muted">No orders to show.</p> : null}
      </div>
    </div>
  );
}
