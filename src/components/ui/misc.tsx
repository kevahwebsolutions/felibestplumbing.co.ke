'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton', className)} />;
}

export const RangeSlider = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { labels?: [string, string] }>(function RangeSlider({ className, labels = ['Minimum price', 'Maximum price'], ...p }, ref) {
  return (
    <SliderPrimitive.Root ref={ref} className={cn('relative flex h-10 w-full touch-none select-none items-center', className)} {...p}>
      <SliderPrimitive.Track className="relative h-2 grow rounded-sm bg-line">
        <SliderPrimitive.Range className="absolute h-full rounded-sm bg-brand" />
      </SliderPrimitive.Track>
      {[0, 1].map((i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={labels[i]}
          className="block size-7 rounded-md border-2 border-brand bg-surface shadow-sm transition-transform hover:scale-110 active:scale-95"
        />
      ))}
    </SliderPrimitive.Root>
  );
});

export const Switch = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(function Switch({ className, ...p }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn('relative h-8 w-14 shrink-0 rounded-md border border-line-strong bg-line transition-colors data-[state=checked]:border-brand data-[state=checked]:bg-brand', className)}
      {...p}
    >
      <SwitchPrimitive.Thumb className="block size-6 translate-x-0.5 rounded bg-surface shadow transition-transform data-[state=checked]:translate-x-[26px]" />
    </SwitchPrimitive.Root>
  );
});

export const Checkbox = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(function Checkbox({ className, ...p }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn('grid size-6 shrink-0 place-items-center rounded border border-line-strong bg-surface text-on-brand data-[state=checked]:border-brand data-[state=checked]:bg-brand', className)}
      {...p}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-5" aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

export function Pill({ children, tone = 'blue', className }: { children: React.ReactNode; tone?: 'blue' | 'orange' | 'green'; className?: string }) {
  return <span className={cn('fp-pill', tone === 'orange' && 'fp-pill-orange', tone === 'green' && 'fp-pill-green', className)}>{children}</span>;
}
