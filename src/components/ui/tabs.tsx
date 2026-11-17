'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(function TabsList({ className, ...p }, ref) {
  return <TabsPrimitive.List ref={ref} className={cn('mb-6 flex flex-wrap gap-3', className)} {...p} />;
});

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(function TabsTrigger({ className, ...p }, ref) {
  return <TabsPrimitive.Trigger ref={ref} className={cn('clay-chip data-[state=active]:!text-white data-[state=active]:[background:linear-gradient(180deg,var(--color-navy-600),var(--color-navy-700))] data-[state=active]:[box-shadow:inset_4px_5px_10px_rgb(6_31_61/0.5),inset_-3px_-3px_6px_rgb(255_255_255/0.2)]', className)} {...p} />;
});

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(function TabsContent({ className, ...p }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn('clay-card p-6 sm:p-8', className)} {...p} />;
});
