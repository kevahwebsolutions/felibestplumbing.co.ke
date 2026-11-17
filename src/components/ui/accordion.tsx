'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(function AccordionItem({ className, ...p }, ref) {
  return <AccordionPrimitive.Item ref={ref} className={cn('clay-card mb-4 overflow-hidden !rounded-[28px]', className)} {...p} />;
});

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(function AccordionTrigger({ className, children, ...p }, ref) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn('group flex min-h-[64px] w-full items-center justify-between gap-4 px-6 py-4 text-left font-heading text-lg font-extrabold text-ink', className)}
        {...p}
      >
        <span>{children}</span>
        <span className="clay-icon !size-9 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180">
          <ChevronDown className="size-5" aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(function AccordionContent({ className, children, ...p }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className="overflow-hidden data-[state=closed]:animate-[acc-up_0.25s_ease-out] data-[state=open]:animate-[acc-down_0.3s_ease-out]" {...p}>
      <div className={cn('px-6 pb-6 pt-0 leading-relaxed text-body', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
