'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { FreeDeliveryBar, QtyStepper } from './cart-parts';
import { cartSubtotal, deliveryFor } from '@/lib/cart-math';
import { formatKES } from '@/lib/utils';
import { useCart } from '@/store/cart';
import type { PublicSettings } from '@/lib/server/settings';

export function CartPage({ settings }: { settings: PublicSettings }) {
  const { items, setQty, remove, clear } = useCart();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="skeleton h-72" aria-label="Loading cart" />;
  if (items.length === 0) {
    return (
      <div className="clay-card grid place-items-center gap-4 p-12 text-center">
        <span className="clay-icon !size-24"><ShoppingBag className="size-10" aria-hidden /></span>
        <h2 className="font-heading text-2xl font-extrabold">Your cart is empty</h2>
        <p className="text-muted">Add taps, valves or heaters from the shop.</p>
        <ButtonLink href="/shop">Browse the shop</ButtonLink>
      </div>
    );
  }
  const subtotal = cartSubtotal(items);
  const delivery = deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold);
  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <FreeDeliveryBar subtotal={subtotal} threshold={settings.freeDeliveryThreshold} />
        <ul className="mt-6 space-y-4">
          {items.map((it) => (
            <li key={it.productId} className="clay-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <Link href={`/shop/${it.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sky-100">
                {it.image ? <Image src={it.image} alt="" fill sizes="96px" className="object-cover" /> : <span className="grid size-full place-items-center text-navy-600"><ShoppingBag className="size-8" aria-hidden /></span>}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{it.category}</p>
                <Link href={`/shop/${it.slug}`} className="font-heading text-lg font-extrabold text-ink">{it.name}</Link>
                <p className="font-bold text-navy-700">{formatKES(it.price)}</p>
              </div>
              <QtyStepper value={it.qty} max={it.stock} onChange={(q) => setQty(it.productId, q)} label={it.name} />
              <p className="w-28 text-right font-heading text-lg font-extrabold">{formatKES(it.price * it.qty)}</p>
              <button type="button" onClick={() => remove(it.productId)} aria-label={`Remove ${it.name}`} className="clay-chip !min-h-11 w-11 justify-center !px-0 text-cta-600"><Trash2 className="size-5" aria-hidden /></button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={clear} className="mt-4 pl-2 font-bold text-navy-600 underline">Clear cart</button>
      </div>
      <aside className="clay-card h-fit space-y-4 p-7 lg:sticky lg:top-28">
        <h2 className="font-heading text-2xl font-extrabold">Order summary</h2>
        <dl className="space-y-3">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold text-ink">{formatKES(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd className="font-bold text-ink">{delivery === 0 ? 'Free' : formatKES(delivery)}</dd></div>
          <div className="flex justify-between border-t border-sky-200 pt-3 text-xl"><dt className="font-heading font-extrabold">Total</dt><dd className="font-heading font-extrabold text-navy-700">{formatKES(subtotal + delivery)}</dd></div>
        </dl>
        <ButtonLink href="/checkout" size="lg" className="w-full">Proceed to checkout</ButtonLink>
        <ButtonLink href="/shop" variant="ghost" className="w-full">Continue shopping</ButtonLink>
      </aside>
    </div>
  );
}
