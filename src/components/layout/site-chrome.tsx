import * as React from 'react';
import { getSettings, publicSettings } from '@/lib/server/settings';
import { Header } from './header';
import { Footer } from './footer';
import { FloatingActions, MobileBar, WaterProgress } from './floating';
import { CartDrawer } from './cart-drawer';
import { SmoothScroll, Tracker } from './providers';

/** Shared public-site shell: header, footer, floating actions, cart drawer and analytics. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-white px-5 py-3 font-bold text-navy-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <WaterProgress />
      <SmoothScroll />
      <Tracker />
      <Header phone={s.phone} whatsappNumber={s.whatsappNumber} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer phone={s.phone} address={s.address} hours={s.hours} email={s.email} />
      <FloatingActions phone={s.phone} whatsappNumber={s.whatsappNumber} />
      <MobileBar phone={s.phone} whatsappNumber={s.whatsappNumber} />
      <CartDrawer settings={publicSettings(s)} />
    </>
  );
}
