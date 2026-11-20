import { notFound } from 'next/navigation';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { formatKES } from '@/lib/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp-message';
import { getOrderByRef, orderMessageText } from '@/lib/server/orders';
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
  const wa = buildWhatsAppUrl(s.whatsappNumber, orderMessageText(order, items));
  return (
    <>
      <PageHero crumbs={[{ name: 'Order', path: `/order/${ref}` }]} title="Thank you, your order is in" />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp mx-auto max-w-3xl !px-0">
          <div className="fp-card space-y-6 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="fp-icon fp-icon-green !size-16"><CheckCircle2 className="size-8" aria-hidden /></span>
              <div><p className="text-sm font-bold uppercase tracking-wider text-ink-muted">Order reference</p><p className="font-heading text-4xl font-bold text-brand">{order.ref}</p></div>
              <p className="fp-pill ml-auto">{STATUS[order.status]}</p>
            </div>

            <div className="rounded-lg border border-success-line bg-success-bg p-5">
              <p className="flex items-start gap-2 font-semibold text-ink"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden /> Your order is already saved.</p>
              <p className="mt-1 text-body">You do not have to send the WhatsApp message for us to see it, but sending it lets us confirm {order.paymentMethod === 'whatsapp' ? 'payment and ' : ''}delivery faster. We will also call {order.customerName} on {order.phone}.</p>
              <ButtonAnchor href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" className="mt-4 w-full sm:w-auto" data-testid="send-whatsapp">
                <MessageCircle className="size-6" aria-hidden /> Send order on WhatsApp
              </ButtonAnchor>
            </div>

            <ul className="divide-y divide-line rounded-lg bg-surface-alt p-2">
              {items.map((i) => <li key={i.id} className="flex justify-between gap-4 px-4 py-3"><span>{i.qty} x {i.name}</span><span className="font-bold text-ink">{formatKES(i.qty * i.price)}</span></li>)}
            </ul>
            <dl className="space-y-1 px-2">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKES(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{order.deliveryFee === 0 ? 'Free' : formatKES(order.deliveryFee)}</dd></div>
              <div className="flex justify-between text-2xl"><dt className="font-heading font-bold">Total</dt><dd className="font-heading font-bold text-brand">{formatKES(order.total)}</dd></div>
            </dl>
            <p className="text-sm text-ink-muted">Delivering to {order.address}, {order.area}. {order.paymentMethod === 'pay_on_delivery' ? 'Pay in cash or by M-Pesa on delivery.' : 'We will confirm payment details with you on WhatsApp.'}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/shop" variant="ghost">Keep shopping</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
