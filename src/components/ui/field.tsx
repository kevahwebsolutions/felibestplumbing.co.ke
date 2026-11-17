import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('clay-input', className)} {...props} />;
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<'textarea'>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('clay-input min-h-32 resize-y py-4', className)} {...props} />;
});

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<'select'>>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn('clay-input appearance-none bg-[length:18px] bg-[right_1.1rem_center] bg-no-repeat pr-12', className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230c4c93' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
      {...props}>
      {children}
    </select>
  );
});

export function Label({ className, children, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return (
    <label className={cn('mb-2 block pl-2 text-sm font-bold text-ink', className)} {...props}>
      {children}
    </label>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 pl-2 text-sm font-semibold text-cta-600">
      {message}
    </p>
  );
}

export function Field({ label, htmlFor, error, hint, children, className }: { label: string; htmlFor: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? <p className="mt-2 pl-2 text-sm text-muted">{hint}</p> : null}
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  );
}
