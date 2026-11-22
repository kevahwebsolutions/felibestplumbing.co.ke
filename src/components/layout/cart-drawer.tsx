'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ShoppingBag, Trash2, Truck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SheetContent } from '@/components/ui/dialog';
import { ButtonLink } from '@/components/ui/button';
import { FreeDeliveryBar, QtyStepper } from '@/components/shop/cart-parts';
import { cartSubtotal, deliveryFor } from '@/lib/cart-math';
import { formatKES } from '@/lib/utils';
import { useCart } from '@/store/cart';
import type { PublicSettings } from '@/lib/server/settings';

export function CartDrawer({ settings }: { settings: PublicSettings }) {
  const { items, open, setOpen, setQty, remove } = useCart();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const subtotal = cartSubtotal(items);
  const list = mounted ? items : [];
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <SheetContent title="Your cart" description="Review the items in your cart" side="right" data-lenis-prevent>
        {list.length === 0 ? (
          <div className="grid flex-1 place-items-center text-center">
            <div>
              <span className="fp-icon mx-auto !size-24"><ShoppingBag className="size-10" aria-hidden /></span>
              <p className="mt-6 font-heading text-2xl font-bold text-ink">Your cart is empty</p>
              <p className="mt-2 text-ink-muted">Browse showers, pumps and laundry supplies.</p>
              <ButtonLink href="/shop" className="mt-6" onClick={() => setOpen(false)}>Go to the shop</ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <FreeDeliveryBar subtotal={subtotal} threshold={settings.freeDeliveryThreshold} />
            <ul className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {list.map((it) => (
                  <motion.li key={it.productId} layout exit={{ opacity: 0, x: 60, height: 0 }} className="fp-card flex gap-3 !rounded-lg p-3">
                    <Link href={`/shop/${it.slug}`} onClick={() => setOpen(false)} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-tint">
                      {it.image ? <Image src={it.image} alt="" fill sizes="80px" className="object-cover" /> : <span className="grid size-full place-items-center text-brand-soft"><ShoppingBag className="size-7" aria-hidden /></span>}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/shop/${it.slug}`} onClick={() => setOpen(false)} className="line-clamp-2 font-heading font-bold leading-snug text-ink">{it.name}</Link>
                      <p className="mt-1 text-sm font-bold text-brand">{formatKES(it.price)}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QtyStepper value={it.qty} max={it.stock} onChange={(q) => setQty(it.productId, q)} label={it.name} compact />
                        <button type="button" onClick={() => remove(it.productId)} aria-label={`Remove ${it.name}`} className="fp-chip !min-h-11 w-11 justify-center !px-0 text-accent-strong">
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <div className="flex justify-between text-body"><span>Subtotal</span><span className="font-bold text-ink">{formatKES(subtotal)}</span></div>
              <div className="flex justify-between text-body">
                <span className="inline-flex items-center gap-2"><Truck className="size-4" aria-hidden /> Delivery</span>
                <span className="font-bold text-ink">{deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold) === 0 ? 'Free' : formatKES(deliveryFor(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold))}</span>
              </div>
              <div className="grid gap-3 pt-2">
                <ButtonLink href="/checkout" size="lg" onClick={() => setOpen(false)}>Checkout</ButtonLink>
                <ButtonLink href="/cart" variant="ghost" onClick={() => setOpen(false)}>View full cart</ButtonLink>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </DialogPrimitive.Root>
  );
}

