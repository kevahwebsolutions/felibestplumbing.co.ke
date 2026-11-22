'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field, Input, Select } from '@/components/ui/field';
import { checkoutSchema, DELIVERY_AREAS, type CheckoutInput } from '@/lib/schemas';
import { openPlaceholderTab, placeOrderAndSend } from '@/lib/order-client';
import { formatKES } from '@/lib/utils';
import type { ProductView } from '@/lib/server/products';

/** "Order this on WhatsApp": a short form that saves a single-item order, then opens WhatsApp with it. */
export function QuickWhatsAppOrder({ p, qty, fee, freeThreshold }: { p: ProductView; qty: number; fee: number; freeThreshold: number }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as never,
    defaultValues: { name: '', phone: '', email: '', area: '', address: '', notes: '', paymentMethod: 'whatsapp', website: '' },
  });
  const subtotal = p.finalPrice * qty;
  const delivery = freeThreshold > 0 && subtotal >= freeThreshold ? 0 : fee;
  const err = (n: keyof CheckoutInput) => errors[n]?.message as string | undefined;
  const out = !p.available;

  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    const placeholder = openPlaceholderTab();
    const result = await placeOrderAndSend(
      { customer: values, items: [{ productId: p.id, qty }] },
      { path: `/shop/${p.slug}`, goto: (href) => router.push(href), placeholder },
    );
    if (!result.ok) setServerError(result.error);
    else setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="whatsapp" size="lg" disabled={out} className="w-full sm:w-auto" data-testid="order-on-whatsapp">
          <MessageCircle className="size-5" aria-hidden /> Order this on WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent title="Order on WhatsApp" description={`${qty} x ${p.name}. We save your order, then open WhatsApp with it ready to send.`} className="max-w-xl">
        <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="qo-name" error={err('name')}><Input id="qo-name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} /></Field>
            <Field label="Phone number" htmlFor="qo-phone" error={err('phone')}><Input id="qo-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0798 174 201" aria-invalid={!!errors.phone} {...register('phone')} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Delivery area" htmlFor="qo-area" error={err('area')}>
              <Select id="qo-area" aria-invalid={!!errors.area} {...register('area')}><option value="">Choose an area</option>{DELIVERY_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}</Select>
            </Field>
            <Field label="Address or landmark" htmlFor="qo-address" error={err('address')}><Input id="qo-address" autoComplete="street-address" aria-invalid={!!errors.address} {...register('address')} /></Field>
          </div>
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label htmlFor="qo-website">Leave empty</label><input id="qo-website" tabIndex={-1} autoComplete="off" {...register('website')} /></div>
          <p className="rounded-lg bg-surface-alt p-3 text-sm text-body">
            {qty} x {p.name}: <strong className="text-ink">{formatKES(subtotal)}</strong> plus delivery {delivery === 0 ? '(free)' : formatKES(delivery)}. Total <strong className="text-ink">{formatKES(subtotal + delivery)}</strong>.
          </p>
          {serverError ? <p role="alert" className="rounded-lg bg-accent-tint px-4 py-3 font-semibold text-accent-strong">{serverError}</p> : null}
          <Button type="submit" variant="whatsapp" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <MessageCircle className="size-5" aria-hidden />}
            {isSubmitting ? 'Saving your order...' : 'Save order and open WhatsApp'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
