'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import { track } from '@/lib/track';

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

/** Page transition: a CSS-only settle animation (no opacity), so server-rendered content is visible before hydration. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="fp-page-in">{children}</div>;
}

export function SiteToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        unstyled: false,
        classNames: { toast: '!rounded-lg !border !border-line-strong !shadow-[var(--shadow-lift)] !font-sans !bg-surface !text-ink' },
      }}
    />
  );
}
