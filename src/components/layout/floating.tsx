'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone, ShoppingCart } from 'lucide-react';
import { whatsappLink } from '@/lib/site';
import { selectCount, useCart } from '@/store/cart';

/** Desktop floating WhatsApp button (the phone is always in the header and utility bar). */
export function FloatingActions({ whatsappNumber }: { phone?: string; whatsappNumber: string }) {
  return (
    <div className="no-print fixed bottom-6 right-6 z-40 hidden md:block">
      <a
        href={whatsappLink(undefined, whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (opens in a new tab)"
        className="grid size-14 place-items-center rounded-full bg-success text-white shadow-[0_6px_18px_-4px_rgb(5_29_56/0.55)] transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-7" aria-hidden />
      </a>
    </div>
  );
}

/** Mobile sticky bottom action bar: Call, WhatsApp, Book, Cart. */
export function MobileBar({ phone, whatsappNumber }: { phone: string; whatsappNumber: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const count = useCart(selectCount);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 font-heading text-[0.95rem] font-semibold uppercase tracking-wider text-white active:bg-white/10';
  return (
    <nav aria-label="Quick actions" className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-orange-brand bg-navy-900 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-stretch divide-x divide-white/10">
        <a href={tel} className={`${item} !bg-cta-500 active:!bg-cta-600`}>
          <Phone className="size-5" aria-hidden /> Call
        </a>
        <a href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" className={item}>
          <MessageCircle className="size-5 text-[#4ade80]" aria-hidden /> WhatsApp
        </a>
        <Link href="/contact#book" className={item}>
          <CalendarCheck className="size-5 text-sky-400" aria-hidden /> Book
        </Link>
        <button type="button" onClick={() => setOpen(true)} className={`${item} relative`} aria-label={mounted && count > 0 ? `Open cart, ${count} items` : 'Open cart'}>
          <span data-cart-icon className="relative grid place-items-center">
            <ShoppingCart className="size-5 text-sky-400" aria-hidden />
            {mounted && count > 0 ? <span className="fp-pill fp-pill-orange absolute -right-3 -top-2 !px-1.5 !py-0 !text-[0.7rem]">{count}</span> : null}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}

export function EmergencyBadge({ phone, className }: { phone: string; className?: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  return (
    <a href={tel} aria-label={`24/7 emergency plumber, call ${phone}`} className={`group inline-flex flex-col rounded-lg border-2 border-white/80 px-5 py-3 text-white transition-colors hover:bg-white/10 ${className ?? ''}`}>
      <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">24/7 Emergency</span>
      <span className="font-heading text-4xl font-bold tracking-wide">{phone}</span>
    </a>
  );
}
