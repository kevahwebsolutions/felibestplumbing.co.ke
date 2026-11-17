'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const Overlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(function Overlay({ className, ...p }, ref) {
  return <DialogPrimitive.Overlay ref={ref} className={cn('fp-overlay fixed inset-0 z-[80] bg-navy-950/55 backdrop-blur-sm', className)} {...p} />;
});

type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string; description?: string; hideTitle?: boolean };

/** Centered clay modal. */
export const DialogContent = React.forwardRef<HTMLDivElement, ContentProps>(function DialogContent({ className, children, title, description, hideTitle, ...p }, ref) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        aria-describedby={description ? undefined : undefined}
        className={cn('fp-modal clay-card fixed left-1/2 top-1/2 z-[90] max-h-[92dvh] w-[calc(100vw-24px)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-5 sm:p-8', className)}
        {...p}
      >
        <DialogPrimitive.Title className={hideTitle ? 'sr-only' : 'pr-12 font-heading text-2xl font-extrabold text-ink'}>{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className={description ? 'mt-1 text-muted' : 'sr-only'}>{description ?? title}</DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close aria-label="Close" className="clay-chip absolute right-4 top-4 !min-h-11 w-11 justify-center !px-0">
          <X className="size-5" aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

/** Slide-over clay sheet used for the mobile nav, cart and filters. */
export const SheetContent = React.forwardRef<HTMLDivElement, ContentProps & { side?: 'left' | 'right' }>(function SheetContent(
  { className, children, title, description, side = 'right', ...p },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed top-0 z-[90] flex h-dvh w-[min(92vw,440px)] flex-col bg-surface p-5 shadow-[0_0_60px_rgb(6_31_61/0.45)]',
          'rounded-l-[36px] bg-gradient-to-b from-white to-sky-50',
          side === 'right' ? 'right-0 data-[state=open]:animate-[sheet-in-right_0.35s_cubic-bezier(0.22,1,0.36,1)]' : 'left-0 rounded-l-none rounded-r-[36px] data-[state=open]:animate-[sheet-in-left_0.35s_cubic-bezier(0.22,1,0.36,1)]',
          className,
        )}
        {...p}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <DialogPrimitive.Title className="font-heading text-2xl font-extrabold text-ink">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close aria-label="Close" className="clay-chip !min-h-11 w-11 justify-center !px-0">
            <X className="size-5" aria-hidden />
          </DialogPrimitive.Close>
        </div>
        <DialogPrimitive.Description className="sr-only">{description ?? title}</DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
