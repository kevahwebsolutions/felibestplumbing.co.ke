'use client';

import * as React from 'react';
import { Minus, Plus, Truck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { freeDeliveryProgress } from '@/lib/cart-math';
import { formatKES } from '@/lib/utils';

export function QtyStepper({ value, max, onChange, label, compact = false }: { value: number; max?: number; onChange: (n: number) => void; label: string; compact?: boolean }) {
  const limit = max && max > 0 ? Math.min(max, 99) : 99;
  const btn = 'clay-chip !min-h-11 w-11 justify-center !px-0 disabled:opacity-50';
  return (
    <div className={`inline-flex items-center ${compact ? 'gap-1.5' : 'gap-3'}`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center font-heading text-lg font-extrabold text-ink" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(value + 1, limit))} disabled={value >= limit} aria-label="Increase quantity">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function FreeDeliveryBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const reduce = useReducedMotion();
  const { pct, remaining, unlocked } = freeDeliveryProgress(subtotal, threshold);
  if (threshold <= 0) return null;
  return (
    <div className="clay-card-sky !rounded-3xl p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
        <Truck className="size-5 shrink-0" aria-hidden />
        {unlocked ? 'You have unlocked free delivery.' : `Add ${formatKES(remaining)} more for free delivery.`}
      </p>
      <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/80 shadow-[inset_2px_3px_6px_rgb(12_76_147/0.3)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free delivery">
        <motion.div initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="h-full rounded-full bg-gradient-to-b from-sky-300 to-navy-600 shadow-[inset_0_2px_2px_rgb(255_255_255/0.6)]" />
      </div>
    </div>
  );
}
