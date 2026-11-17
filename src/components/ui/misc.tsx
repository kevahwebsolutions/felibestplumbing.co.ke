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
      <SliderPrimitive.Track className="relative h-4 grow rounded-full bg-sky-100 shadow-[inset_3px_4px_7px_rgb(12_76_147/0.25),inset_-2px_-2px_4px_#fff]">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-b from-sky-400 to-navy-600 shadow-[inset_2px_2px_4px_rgb(255_255_255/0.6)]" />
      </SliderPrimitive.Track>
      {[0, 1].map((i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={labels[i]}
          className="block size-8 rounded-full bg-[radial-gradient(circle_at_30%_28%,#fff,var(--color-sky-200))] shadow-[0_8px_14px_-4px_rgb(12_76_147/0.5),inset_3px_3px_6px_#fff,inset_-3px_-4px_8px_rgb(81_172_251/0.5)] transition-transform hover:scale-110 active:scale-95"
        />
      ))}
    </SliderPrimitive.Root>
  );
});

export const Switch = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(function Switch({ className, ...p }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn('relative h-9 w-16 shrink-0 rounded-full bg-sky-200 shadow-[inset_3px_4px_8px_rgb(12_76_147/0.3),inset_-2px_-2px_4px_#fff] transition-colors data-[state=checked]:bg-navy-600', className)}
      {...p}
    >
      <SwitchPrimitive.Thumb className="block size-7 translate-x-1 rounded-full bg-[radial-gradient(circle_at_30%_28%,#fff,var(--color-sky-200))] shadow-[0_5px_8px_-2px_rgb(12_76_147/0.5)] transition-transform data-[state=checked]:translate-x-8" />
    </SwitchPrimitive.Root>
  );
});

export const Checkbox = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(function Checkbox({ className, ...p }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn('grid size-7 shrink-0 place-items-center rounded-xl bg-sky-100 text-white shadow-[inset_3px_4px_7px_rgb(12_76_147/0.25),inset_-2px_-2px_4px_#fff] data-[state=checked]:bg-navy-600', className)}
      {...p}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-5" aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

export function Pill({ children, tone = 'blue', className }: { children: React.ReactNode; tone?: 'blue' | 'orange' | 'green'; className?: string }) {
  return <span className={cn('clay-pill', tone === 'orange' && 'clay-pill-orange', tone === 'green' && 'clay-pill-green', className)}>{children}</span>;
}
