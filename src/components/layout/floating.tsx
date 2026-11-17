'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone, ShoppingBag, Wrench } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { whatsappLink } from '@/lib/site';
import { selectCount, useCart } from '@/store/cart';

export function FloatingActions({ phone, whatsappNumber }: { phone: string; whatsappNumber: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  return (
    <div className="no-print fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
      <motion.a
        href={whatsappLink(undefined, whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (opens in a new tab)"
        whileHover={{ y: -4, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="clay-icon !size-16 [background:radial-gradient(circle_at_30%_25%,#5be08f,#0f7a4b_75%)]"
      >
        <MessageCircle className="size-7" aria-hidden />
      </motion.a>
      <motion.a href={tel} aria-label={`Call ${phone}`} whileHover={{ y: -4, scale: 1.06 }} whileTap={{ scale: 0.94 }} className="clay-icon clay-icon-orange !size-16 animate-pulse-ring">
        <Phone className="size-7" aria-hidden />
      </motion.a>
    </div>
  );
}

export function MobileBar({ phone, whatsappNumber }: { phone: string; whatsappNumber: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const count = useCart(selectCount);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl px-1 text-[0.72rem] font-extrabold text-navy-800 active:[box-shadow:var(--clay-pressed)]';
  return (
    <nav aria-label="Quick actions" className="no-print fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="clay-card flex items-stretch gap-1 !rounded-[32px] p-1.5">
        <a href={tel} className={item}>
          <Phone className="size-5 text-cta-500" aria-hidden /> Call
        </a>
        <a href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" className={item}>
          <MessageCircle className="size-5 text-success" aria-hidden /> WhatsApp
        </a>
        <Link href="/contact#book" className={item}>
          <CalendarCheck className="size-5 text-navy-600" aria-hidden /> Book
        </Link>
        <button type="button" onClick={() => setOpen(true)} className={`${item} relative`} aria-label={mounted && count > 0 ? `Open cart, ${count} items` : 'Open cart'}>
          <span data-cart-icon className="relative grid place-items-center">
            <ShoppingBag className="size-5 text-navy-600" aria-hidden />
            {mounted && count > 0 ? <span className="clay-pill clay-pill-orange absolute -right-3 -top-2 !px-1.5 !py-0 text-[0.65rem]">{count}</span> : null}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}

/** Clay water-level scroll progress: a tube along the top of the page that fills as you scroll. */
export function WaterProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  if (reduce) return null;
  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-2.5 bg-sky-100/80 shadow-[inset_0_2px_3px_rgb(12_76_147/0.25)]">
      <motion.div style={{ scaleX }} className="relative h-full origin-left rounded-r-full bg-gradient-to-b from-sky-300 via-sky-500 to-navy-600 shadow-[0_0_10px_rgb(81_172_251/0.8),inset_0_2px_2px_rgb(255_255_255/0.7)]">
        <span className="absolute -right-1 -top-0.5 block h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_8px_rgb(81_172_251)]" />
      </motion.div>
    </div>
  );
}

export function EmergencyBadge({ phone, className }: { phone: string; className?: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const reduce = useReducedMotion();
  return (
    <a href={tel} aria-label={`24/7 emergency plumber, call ${phone}`} className={`group relative inline-grid size-36 place-items-center ${className ?? ''}`}>
      <motion.svg viewBox="0 0 160 160" className="absolute inset-0 size-full" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, ease: 'linear', repeat: Infinity }} aria-hidden>
        <defs>
          <path id="badge-circle" d="M80 80m-60 0a60 60 0 1 1 120 0a60 60 0 1 1-120 0" />
        </defs>
        <circle cx="80" cy="80" r="76" fill="#fff" />
        <circle cx="80" cy="80" r="76" fill="url(#badge-glow)" />
        <text fontFamily="var(--font-nunito), sans-serif" fontWeight="800" fontSize="13.5" letterSpacing="3.4" fill="#bf3208">
          <textPath href="#badge-circle">24/7 EMERGENCY PLUMBER - CALL NOW -</textPath>
        </text>
      </motion.svg>
      <span className="clay-icon clay-icon-orange !size-[76px] transition-transform group-hover:scale-110">
        <Wrench className="size-9" aria-hidden />
      </span>
    </a>
  );
}
