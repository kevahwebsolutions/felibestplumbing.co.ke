import Link from 'next/link';
import { Phone } from 'lucide-react';
import { SiteChrome } from '@/components/layout/site-chrome';
import { ButtonLink } from '@/components/ui/button';
import { PlumbGlyph } from '@/components/plumb/icons';
import { getSettings } from '@/lib/server/settings';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  const s = getSettings();
  return (
    <SiteChrome>
      <section className="bp-grid relative overflow-hidden bg-surface-alt py-20 sm:py-28">
        <div className="container-fp grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <div className="mx-auto grid size-40 place-items-center rounded-xl border-b-4 border-copper bg-brand text-on-brand sm:size-52" aria-hidden>
            <PlumbGlyph name="burst" size={120} />
          </div>
          <div>
            <p className="font-heading text-8xl font-bold leading-none text-accent sm:text-9xl">404</p>
            <h1 className="mt-2 text-5xl font-bold sm:text-6xl">Burst pipe. Page not found.</h1>
            <p className="mt-4 max-w-xl text-lg text-body">The page you are looking for has moved or does not exist. We have shut off the main, so nothing else is leaking. Pick a link below to get back to work.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/" size="lg">Go home</ButtonLink>
              <ButtonLink href="/services" variant="outline" size="lg">View services</ButtonLink>
              <ButtonLink href="/shop" variant="outline" size="lg">Plumbing shop</ButtonLink>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 text-body">
              <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 font-heading text-2xl font-bold tracking-wide text-ink hover:underline"><Phone className="size-5" aria-hidden /> {s.phone}</a>
              <Link href="/contact" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand">Contact us</Link>
              <Link href="/faq" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand">FAQ</Link>
            </p>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
