'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Toaster } from 'sonner';
import Lenis from 'lenis';
import { track } from '@/lib/track';

/** Lenis smooth scroll. Disabled for reduced-motion users and on touch devices where native momentum is better. */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (reduce) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), prevent: (node) => node.hasAttribute('data-lenis-prevent') });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);
  return null;
}

/** First-party, cookie-free analytics beacon. */
export function Tracker() {
  const pathname = usePathname();
  React.useEffect(() => {
    track('pageview', { path: pathname });
  }, [pathname]);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) track('call_click');
      else if (href.includes('wa.me') || href.includes('api.whatsapp.com')) track('whatsapp_click');
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function ClayToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        unstyled: false,
        classNames: { toast: '!rounded-3xl !border-0 !shadow-[var(--clay-shadow)] !font-sans !bg-white !text-ink' },
      }}
    />
  );
}
