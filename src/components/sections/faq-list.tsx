'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function FaqList({ items, defaultOpen }: { items: { q: string; a: string }[]; defaultOpen?: string }) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen}>
      {items.map((it, i) => (
        <AccordionItem key={it.q} value={`q${i}`}>
          <AccordionTrigger>{it.q}</AccordionTrigger>
          <AccordionContent>{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
