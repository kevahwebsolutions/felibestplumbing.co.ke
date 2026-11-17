'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(function AccordionItem({ className, ...p }, ref) {
  return <AccordionPrimitive.Item ref={ref} className={cn('fp-card mb-3 overflow-hidden', className)} {...p} />;
});

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(function AccordionTrigger({ className, children, ...p }, ref) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn('group flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-2xl font-semibold text-ink', className)}
        {...p}
      >
        <span>{children}</span>
        <span className="fp-icon !size-9 shrink-0 !rounded-md transition-transform duration-300 group-data-[state=open]:rotate-180">
          <ChevronDown className="size-5" aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(function AccordionContent({ className, children, ...p }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className="overflow-hidden data-[state=closed]:animate-[acc-up_0.25s_ease-out] data-[state=open]:animate-[acc-down_0.3s_ease-out]" {...p}>
      <div className={cn('px-5 pb-5 pt-0 leading-relaxed text-body', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
