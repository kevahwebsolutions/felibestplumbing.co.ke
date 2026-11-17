import * as React from 'react';
import { getSettings, publicSettings } from '@/lib/server/settings';
import { Header, UtilityBar } from './header';
import { Footer } from './footer';
import { FloatingActions, MobileBar } from './floating';
import { CartDrawer } from './cart-drawer';
import { Tracker } from './providers';

/** Shared public-site shell: utility bar, header, footer, floating actions, cart drawer and analytics. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-white px-5 py-3 font-bold text-navy-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <Tracker />
      <UtilityBar phone={s.phone} email={s.email} hours={s.hours} />
      <Header phone={s.phone} whatsappNumber={s.whatsappNumber} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer phone={s.phone} address={s.address} hours={s.hours} email={s.email} />
      <FloatingActions whatsappNumber={s.whatsappNumber} />
      <MobileBar phone={s.phone} whatsappNumber={s.whatsappNumber} />
      <CartDrawer settings={publicSettings(s)} />
    </>
  );
}
