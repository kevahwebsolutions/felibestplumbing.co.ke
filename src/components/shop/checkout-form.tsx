'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Banknote, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, ButtonLink } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { cartSubtotal, deliveryFor } from '@/lib/cart-math';
import { checkoutSchema, DELIVERY_AREAS, type CheckoutInput } from '@/lib/schemas';
import { track } from '@/lib/track';
import { cn, formatKES } from '@/lib/utils';
import { useCart } from '@/store/cart';
import type { PublicSettings } from '@/lib/server/settings';

const METHODS = [
  { id: 'pay_on_delivery' as const, label: 'Pay on delivery', desc: 'Cash or M-Pesa when your order arrives', Icon: Banknote },
  { id: 'whatsapp' as const, label: 'Order via WhatsApp', desc: 'We open WhatsApp with your cart ready to send', Icon: MessageCircle },
];

export function CheckoutForm({ settings }: { settings: PublicSettings }) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  React.useEffect(() => setMounted(true), []);
  const tracked = React.useRef(false);
  React.useEffect(() => {
    if (mounted && items.length > 0 && !tracked.current) {
      tracked.current = true;
      track('checkout_start', { path: '/checkout' });
    }
  }, [mounted, items.length]);

  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as never,
    defaultValues: { name: '', phone: '', email: '', area: '', address: '', notes: '', paymentMethod: 'pay_on_delivery', website: '' },
  });

  if (!mounted) return <div className="skeleton h-96" aria-label="Loading checkout" />;
  if (items.length === 0) {
    return (
      <div className="fp-card grid place-items-center gap-4 p-12 text-center">
        <h2 className="font-heading text-3xl font-bold">Your cart is empty</h2>
        <ButtonLink href="/shop">Back to the shop</ButtonLink>
      </div>
    );
  }
  const subtotal = cartSubtotal(items);
  const delivery = deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold);
  const err = (n: keyof CheckoutInput) => errors[n]?.message as string | undefined;

  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: values, items: items.map((i) => ({ productId: i.productId, qty: i.qty })) }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; ref?: string; total?: number; redirectUrl?: string | null };
      if (!res.ok || !data.ok || !data.ref) {
        setServerError(data.error ?? 'We could not place your order. Please try again or call us.');
        if (res.status === 422) setError('root', { message: data.error });
        return;
      }
      track('order_placed', { path: '/checkout', value: data.total });
      clear();
      toast.success(`Order ${data.ref} placed`);
      if (data.redirectUrl) window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
      router.push(`/order/${data.ref}`);
    } catch {
      setServerError('We could not reach the server. Please check your connection or call us.');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="fp-card space-y-5 p-6 sm:p-9">
        <h2 className="font-heading text-3xl font-bold">Delivery details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="co-name" error={err('name')}><Input id="co-name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} /></Field>
          <Field label="Phone number" htmlFor="co-phone" error={err('phone')}><Input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0798 174 201" aria-invalid={!!errors.phone} {...register('phone')} /></Field>
        </div>
        <Field label="Email (optional)" htmlFor="co-email" error={err('email')}><Input id="co-email" type="email" autoComplete="email" {...register('email')} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Delivery area" htmlFor="co-area" error={err('area')}>
            <Select id="co-area" aria-invalid={!!errors.area} {...register('area')}><option value="">Choose an area</option>{DELIVERY_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}</Select>
          </Field>
          <Field label="Address or landmark" htmlFor="co-address" error={err('address')}><Input id="co-address" autoComplete="street-address" aria-invalid={!!errors.address} {...register('address')} /></Field>
        </div>
        <Field label="Order notes (optional)" htmlFor="co-notes" error={err('notes')}><Textarea id="co-notes" rows={3} {...register('notes')} /></Field>
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label htmlFor="co-website">Leave empty</label><input id="co-website" tabIndex={-1} autoComplete="off" {...register('website')} /></div>

        <fieldset>
          <legend className="mb-3 pl-2 text-sm font-bold text-ink">Payment option</legend>
          <Controller control={control} name="paymentMethod" render={({ field }) => (
            <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Payment option">
              {METHODS.map((m) => {
                const on = field.value === m.id;
                return (
                  <button key={m.id} type="button" role="radio" aria-checked={on} onClick={() => field.onChange(m.id)}
                    className={cn('fp-card flex items-start gap-3 !rounded-lg p-4 text-left', on && 'ring-4 ring-navy-600/70')}>
                    <span className={cn('fp-icon !size-12 shrink-0', m.id === 'whatsapp' && '[background:radial-gradient(circle_at_30%_25%,#5be08f,#0f7a4b_75%)]')}><m.Icon className="size-6" aria-hidden /></span>
                    <span><span className="block font-heading font-bold text-ink">{m.label}</span><span className="text-sm text-muted">{m.desc}</span></span>
                  </button>
                );
              })}
            </div>
          )} />
        </fieldset>
      </div>

      <aside className="fp-card h-fit space-y-4 p-7 lg:sticky lg:top-28">
        <h2 className="font-heading text-3xl font-bold">Your order</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => <li key={i.productId} className="flex justify-between gap-3"><span>{i.qty} x {i.name}</span><span className="shrink-0 font-bold text-ink">{formatKES(i.price * i.qty)}</span></li>)}
        </ul>
        <dl className="space-y-2 border-t border-sky-200 pt-4">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold text-ink">{formatKES(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd className="font-bold text-ink">{delivery === 0 ? 'Free' : formatKES(delivery)}</dd></div>
          <div className="flex justify-between pt-2 text-2xl"><dt className="font-heading font-bold">Total</dt><dd className="font-heading font-bold text-navy-700">{formatKES(subtotal + delivery)}</dd></div>
        </dl>
        {serverError ? <p role="alert" className="rounded-lg bg-peach-100 px-4 py-3 font-semibold text-cta-600">{serverError}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}{isSubmitting ? 'Placing order...' : 'Place order'}</Button>
        <p className="text-xs text-muted">No payment is taken online. We confirm your order and delivery time by phone or WhatsApp.</p>
      </aside>
    </form>
  );
}
