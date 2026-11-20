import { notFound } from 'next/navigation';
import Link from 'next/link';
import { OrderControls } from '@/components/admin/order-controls';
import { getOrderById } from '@/lib/server/orders';
import { SITE } from '@/lib/site';
import { formatKES } from '@/lib/utils';
import { STATUS_LABEL } from '@/lib/labels';

export const metadata = { title: 'Order' };

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = /^\d+$/.test(id) ? getOrderById(Number(id)) : null;
  if (!found) notFound();
  const { order, items } = found;
  return (
    <div className="space-y-6">
      <p className="no-print"><Link href="/admin/orders" className="font-bold text-brand-soft underline">Back to orders</Link></p>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="fp-card space-y-6 p-6 sm:p-8" aria-label="Invoice and packing slip">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h1 className="font-heading text-4xl font-bold">Order {order.ref}</h1><p className="text-ink-muted">{new Date(order.createdAt * 1000).toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short' })}</p></div>
            <p className="fp-pill">{STATUS_LABEL[order.status]}</p>
          </div>
          <div className="print-only"><p className="font-heading text-2xl font-bold">{SITE.name}</p><p>{SITE.address.text} &middot; {SITE.phone}</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">Customer</h2><p className="font-bold">{order.customerName}</p><p><a className="underline" href={`tel:${order.phone}`}>{order.phone}</a></p>{order.email ? <p>{order.email}</p> : null}</div>
            <div><h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">Deliver to</h2><p>{order.address}</p><p>{order.area}</p><p className="text-sm text-ink-muted">Payment: {order.paymentMethod === 'whatsapp' ? 'Order via WhatsApp' : 'Pay on delivery'}</p></div>
          </div>
          {order.notes ? <p className="rounded-lg bg-surface-alt p-3"><strong>Customer notes:</strong> {order.notes}</p> : null}
          <table className="w-full text-left">
            <caption className="sr-only">Items in this order</caption>
            <thead><tr className="text-xs uppercase tracking-wider text-ink-muted"><th scope="col" className="py-2">Item</th><th scope="col" className="py-2 text-right">Qty</th><th scope="col" className="py-2 text-right">Price</th><th scope="col" className="py-2 text-right">Total</th></tr></thead>
            <tbody>{items.map((i) => <tr key={i.id} className="border-t border-line"><th scope="row" className="py-3 font-semibold">{i.name}{i.sku ? <span className="block text-xs font-normal text-ink-muted">SKU {i.sku}</span> : null}</th><td className="py-3 text-right">{i.qty}</td><td className="py-3 text-right">{formatKES(i.price)}</td><td className="py-3 text-right font-bold">{formatKES(i.price * i.qty)}</td></tr>)}</tbody>
          </table>
          <dl className="ml-auto max-w-xs space-y-1">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKES(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{order.deliveryFee ? formatKES(order.deliveryFee) : 'Free'}</dd></div>
            <div className="flex justify-between text-2xl"><dt className="font-heading font-bold">Total</dt><dd className="font-heading font-bold">{formatKES(order.total)}</dd></div>
          </dl>
        </section>
        <OrderControls id={order.id} status={order.status} notes={order.internalNotes} />
      </div>
    </div>
  );
}
