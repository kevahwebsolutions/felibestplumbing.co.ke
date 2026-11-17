import { notFound } from 'next/navigation';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { formatKES } from '@/lib/utils';
import { whatsappLink } from '@/lib/site';
import { getOrderByRef } from '@/lib/server/orders';
import { orderWhatsappMessage } from '@/lib/server/payments';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Order Confirmation', description: 'Your Felibest Plumbing order.', path: '/order', noindex: true });

const STATUS: Record<string, string> = { new: 'Received', confirmed: 'Confirmed', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' };

export default async function OrderPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const found = /^FP-[A-Z0-9]{6}$/.test(ref) ? getOrderByRef(ref) : null;
  if (!found) notFound();
  const { order, items } = found;
  const s = getSettings();
  const wa = whatsappLink(orderWhatsappMessage({ ref, total: order.total, customerName: order.customerName, phone: order.phone, lines: items }), s.whatsappNumber);
  return (
    <>
      <PageHero crumbs={[{ name: 'Order', path: `/order/${ref}` }]} title="Thank you, your order is in" />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay mx-auto max-w-3xl !px-0">
          <div className="clay-card space-y-6 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="clay-icon !size-16 [background:radial-gradient(circle_at_30%_25%,#6ee7a0,#0f7a4b_75%)]"><CheckCircle2 className="size-8" aria-hidden /></span>
              <div><p className="text-sm font-bold uppercase tracking-wider text-muted">Order reference</p><p className="font-heading text-3xl font-black text-navy-700">{order.ref}</p></div>
              <p className="clay-pill ml-auto">{STATUS[order.status]}</p>
            </div>
            <p className="text-body">{order.paymentMethod === 'whatsapp' ? 'Send the prefilled WhatsApp message so we can confirm payment and delivery.' : `We will call ${order.customerName} on ${order.phone} to confirm. Pay in cash or by M-Pesa on delivery.`}</p>
            <ul className="divide-y divide-sky-200 rounded-3xl bg-sky-50 p-2">
              {items.map((i) => <li key={i.id} className="flex justify-between gap-4 px-4 py-3"><span>{i.qty} x {i.name}</span><span className="font-bold text-ink">{formatKES(i.qty * i.price)}</span></li>)}
            </ul>
            <dl className="space-y-1 px-2">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKES(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{order.deliveryFee === 0 ? 'Free' : formatKES(order.deliveryFee)}</dd></div>
              <div className="flex justify-between text-xl"><dt className="font-heading font-extrabold">Total</dt><dd className="font-heading font-extrabold text-navy-700">{formatKES(order.total)}</dd></div>
            </dl>
            <p className="text-sm text-muted">Delivering to {order.address}, {order.area}.</p>
            <div className="flex flex-wrap gap-3">
              <ButtonAnchor href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle className="size-5" aria-hidden /> Send on WhatsApp</ButtonAnchor>
              <ButtonLink href="/shop" variant="ghost">Keep shopping</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
