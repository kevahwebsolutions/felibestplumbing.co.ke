'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(function TabsList({ className, ...p }, ref) {
  return <TabsPrimitive.List ref={ref} className={cn('mb-6 flex flex-wrap gap-3', className)} {...p} />;
});

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(function TabsTrigger({ className, ...p }, ref) {
  return <TabsPrimitive.Trigger ref={ref} className={cn('fp-chip data-[state=active]:!border-brand data-[state=active]:!bg-brand data-[state=active]:!text-on-brand', className)} {...p} />;
});

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(function TabsContent({ className, ...p }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn('fp-card p-6 sm:p-8', className)} {...p} />;
});
