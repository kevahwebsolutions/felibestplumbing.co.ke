'use client';

import * as React from 'react';
import Link from 'next/link';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveSettingsAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/field';
import { Switch } from '@/components/ui/misc';
import { settingsSchema, type SettingsInput } from '@/lib/schemas';

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema) as never, defaultValues: initial });
  const { fields, append, remove } = useFieldArray({ control, name: 'offers' });
  const err = (n: keyof SettingsInput) => errors[n]?.message as string | undefined;
  const onSubmit = handleSubmit(async (v) => {
    const res = await saveSettingsAction(v);
    if (res.ok) toast.success('Settings saved');
    else { for (const [k, m] of Object.entries(res.fieldErrors ?? {})) setError(k.split('.')[0] as keyof SettingsInput, { message: m }); toast.error(res.error ?? 'Could not save'); }
  });
  const money = (n: 'deliveryFee' | 'freeDeliveryThreshold') => register(n, { setValueAs: (v) => Number(v || 0) });
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-2">
      <section className="clay-card space-y-5 p-6" aria-label="Business information">
        <h2 className="font-heading text-xl font-extrabold">Business information</h2>
        <Field label="Business name" htmlFor="s-name" error={err('businessName')}><Input id="s-name" {...register('businessName')} /></Field>
        <Field label="Phone" htmlFor="s-phone" error={err('phone')}><Input id="s-phone" {...register('phone')} /></Field>
        <Field label="WhatsApp number" htmlFor="s-wa" error={err('whatsappNumber')} hint="Digits only with country code, for example 254798174201"><Input id="s-wa" inputMode="numeric" {...register('whatsappNumber')} /></Field>
        <Field label="Email" htmlFor="s-email" error={err('email')}><Input id="s-email" type="email" {...register('email')} /></Field>
        <Field label="Address" htmlFor="s-address" error={err('address')} hint="Confirm your real business address and update it here."><Input id="s-address" {...register('address')} /></Field>
        <Field label="Opening hours" htmlFor="s-hours" error={err('hours')}><Input id="s-hours" {...register('hours')} /></Field>
      </section>
      <div className="space-y-6">
        <section className="clay-card space-y-5 p-6" aria-label="Delivery">
          <h2 className="font-heading text-xl font-extrabold">Delivery</h2>
          <Field label="Delivery fee (KES)" htmlFor="s-fee" error={err('deliveryFee')}><Input id="s-fee" type="number" min={0} {...money('deliveryFee')} /></Field>
          <Field label="Free delivery threshold (KES)" htmlFor="s-free" error={err('freeDeliveryThreshold')} hint="Orders at or above this subtotal ship free. Set 0 to turn off free delivery."><Input id="s-free" type="number" min={0} {...money('freeDeliveryThreshold')} /></Field>
        </section>
        <section className="clay-card space-y-5 p-6" aria-label="Home banner">
          <h2 className="font-heading text-xl font-extrabold">Home page banner</h2>
          <Field label="Banner text (optional)" htmlFor="s-banner" error={err('homeBanner')} hint="Shown above the home page headline, for example a seasonal offer."><Input id="s-banner" {...register('homeBanner')} /></Field>
        </section>
      </div>
      <section className="clay-card space-y-5 p-6 xl:col-span-2" aria-label="Offers">
        <div className="flex items-center justify-between"><h2 className="font-heading text-xl font-extrabold">Offers (shown on the pricing page)</h2><Button type="button" size="sm" variant="ghost" onClick={() => append({ title: '', description: '', label: '', active: true })} disabled={fields.length >= 8}><Plus className="size-4" aria-hidden /> Add offer</Button></div>
        {fields.length === 0 ? <p className="text-muted">No offers. The offers section is hidden on the pricing page.</p> : null}
        {fields.map((f, i) => (
          <div key={f.id} className="grid gap-4 rounded-3xl bg-sky-50 p-4 md:grid-cols-[1fr_1.4fr_160px_auto_auto] md:items-end">
            <Field label="Title" htmlFor={`o-t-${i}`}><Input id={`o-t-${i}`} {...register(`offers.${i}.title` as const)} /></Field>
            <Field label="Description" htmlFor={`o-d-${i}`}><Textarea id={`o-d-${i}`} rows={2} className="!min-h-14" {...register(`offers.${i}.description` as const)} /></Field>
            <Field label="Badge" htmlFor={`o-l-${i}`}><Input id={`o-l-${i}`} {...register(`offers.${i}.label` as const)} /></Field>
            <Controller control={control} name={`offers.${i}.active` as const} render={({ field }) => (<div className="flex items-center gap-2 pb-3"><Switch id={`o-a-${i}`} checked={!!field.value} onCheckedChange={field.onChange} /><label htmlFor={`o-a-${i}`} className="text-sm font-bold">Active</label></div>)} />
            <button type="button" onClick={() => remove(i)} aria-label={`Remove offer ${i + 1}`} className="clay-chip mb-1 !min-h-11 w-11 justify-center !px-0 text-cta-600"><Trash2 className="size-4" aria-hidden /></button>
          </div>
        ))}
      </section>
      <div className="flex flex-wrap items-center gap-4 xl:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null} Save settings</Button>
        <Link href="/admin/change-password" className="clay-button clay-button-ghost">Change admin password</Link>
      </div>
    </form>
  );
}
