import { Droplets } from 'lucide-react';
import { SiteChrome } from '@/components/layout/site-chrome';
import { ButtonLink } from '@/components/ui/button';
import { Bubbles, HERO_BUBBLES } from '@/components/clay/decor';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="relative grid min-h-[70dvh] place-items-center overflow-hidden px-5 py-20 text-center">
        <Bubbles items={HERO_BUBBLES} />
        <div className="relative">
          <span className="clay-icon mx-auto !size-28"><Droplets className="size-14" aria-hidden /></span>
          <p className="mt-6 font-heading text-7xl font-black text-navy-700">404</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold">This page has sprung a leak</h1>
          <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for has moved or does not exist. Let us get you back on track.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4"><ButtonLink href="/">Go home</ButtonLink><ButtonLink href="/services" variant="ghost">View services</ButtonLink></div>
        </div>
      </section>
    </SiteChrome>
  );
}
