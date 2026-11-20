'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { bookingSchema, questionSchema, SERVICE_OPTIONS, type BookingInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';

type Mode = 'booking' | 'question';

export function BookingForm({ defaultService = '', mode = 'booking', compact = false, idPrefix = 'bk', className }: { defaultService?: string; mode?: Mode; compact?: boolean; idPrefix?: string; className?: string }) {
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const {
    register, handleSubmit, reset, setError, formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(mode === 'question' ? (questionSchema as unknown as typeof bookingSchema) : bookingSchema),
    defaultValues: { kind: mode, name: '', phone: '', email: '', service: mode === 'question' ? 'Question' : defaultService, preferredDate: '', message: '', website: '' },
  });
  const id = (n: string) => `${idPrefix}-${n}`;
  const err = (n: keyof BookingInput) => (errors[n]?.message as string | undefined);
  const describe = (n: keyof BookingInput) => (errors[n] ? `${id(n)}-error` : undefined);

  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    try {
      const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) for (const [k, m] of Object.entries(data.fieldErrors)) setError(k as keyof BookingInput, { message: m });
        setServerError(data.error ?? 'Something went wrong. Please call us instead.');
        return;
      }
      track('form_submit', { path: window.location.pathname });
      toast.success('Request received. We will call you shortly.');
      setSent(true);
      reset();
    } catch {
      setServerError('We could not reach the server. Please check your connection or call us.');
    }
  });

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="grid place-items-center gap-4 py-10 text-center" role="status">
            <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }} className="fp-icon !size-24 [background:radial-gradient(circle_at_30%_25%,#6ee7a0,#0f7a4b_75%)]">
              <CheckCircle2 className="size-12" aria-hidden />
            </motion.span>
            <h3 className="font-heading text-3xl font-bold">Thank you, we have your request</h3>
            <p className="max-w-sm text-ink-muted">A Felibest plumber will call you shortly. For anything urgent, call us on the number at the top of the page.</p>
            <Button variant="ghost" onClick={() => setSent(false)}>Send another request</Button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={false} exit={{ opacity: 0 }} className="grid gap-5" aria-label={mode === 'question' ? 'Ask a question' : 'Book a plumber'}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor={id('name')} error={err('name')}>
                <Input id={id('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describe('name')} {...register('name')} />
              </Field>
              <Field label="Phone number" htmlFor={id('phone')} error={err('phone')}>
                <Input id={id('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="0798 174 201" aria-invalid={!!errors.phone} aria-describedby={describe('phone')} {...register('phone')} />
              </Field>
            </div>
            {mode === 'booking' ? (
              <div className={cn('grid gap-5', !compact && 'sm:grid-cols-2')}>
                <Field label="Service needed" htmlFor={id('service')} error={err('service')}>
                  <Select id={id('service')} aria-invalid={!!errors.service} aria-describedby={describe('service')} {...register('service')}>
                    <option value="">Choose a service</option>
                    {defaultService && !(SERVICE_OPTIONS as readonly string[]).includes(defaultService) ? <option value={defaultService}>{defaultService}</option> : null}
                    {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Preferred date (optional)" htmlFor={id('date')} error={err('preferredDate')}>
                  <Input id={id('date')} type="date" {...register('preferredDate')} />
                </Field>
              </div>
            ) : null}
            {!compact || mode === 'question' ? (
              <Field label="Email (optional)" htmlFor={id('email')} error={err('email')}>
                <Input id={id('email')} type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describe('email')} {...register('email')} />
              </Field>
            ) : null}
            <Field label={mode === 'question' ? 'Your question' : 'Tell us what is wrong (optional)'} htmlFor={id('message')} error={err('message')}>
              <Textarea id={id('message')} rows={compact ? 3 : 4} aria-invalid={!!errors.message} aria-describedby={describe('message')} {...register('message')} />
            </Field>
            {/* Honeypot: hidden from people, tempting for bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={id('website')}>Leave this field empty</label>
              <input id={id('website')} tabIndex={-1} autoComplete="off" {...register('website')} />
            </div>
            {serverError ? <p role="alert" className="rounded-lg bg-accent-tint px-4 py-3 font-semibold text-accent-strong">{serverError}</p> : null}
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto sm:justify-self-start">
              {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
              {isSubmitting ? 'Sending...' : mode === 'question' ? 'Send question' : 'Request a plumber'}
            </Button>
            <p className="text-sm text-ink-muted">We only use your details to answer this request.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
