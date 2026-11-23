import Link from 'next/link';
import { Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { PlumbGlyph } from '@/components/plumb/icons';
import { SERVICES } from '@/data/services';
import { getSettings } from '@/lib/server/settings';

const SECTIONS = [
  { href: '/services', label: 'All plumbing services' },
  { href: '/shop', label: 'Plumbing shop' },
  { href: '/pricing', label: 'Pricing and offers' },
  { href: '/blog', label: 'Plumbing tips and guides' },
  { href: '/gallery', label: 'Our work' },
  { href: '/coverage', label: 'Areas we cover' },
  { href: '/faq', label: 'Frequently asked questions' },
  { href: '/contact', label: 'Contact and booking' },
];

/** Helpful 404 body. The page that renders it answers with a real 404 status and a noindex robots tag. */
export function NotFoundContent() {
  const s = getSettings();
  const popular = SERVICES.filter((x) => x.emergency || ['blocked-toilet-repair', 'drain-lines', 'leaking-taps-and-mixers', 'tank-installation-and-repair'].includes(x.slug)).slice(0, 5);
  return (
    <section className="bp-grid relative overflow-hidden bg-surface-alt py-16 sm:py-24">
      <div className="container-fp grid items-start gap-10 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto grid size-40 place-items-center rounded-xl border-b-4 border-copper bg-brand text-on-brand sm:size-52" aria-hidden>
          <PlumbGlyph name="burst" size={120} />
        </div>
        <div>
          <p className="font-heading text-8xl font-bold leading-none text-accent sm:text-9xl" aria-hidden>404</p>
          <h1 className="mt-2 text-5xl font-bold sm:text-6xl">Page not found</h1>
          <p className="mt-4 max-w-xl text-lg text-body">The page you are looking for has moved or does not exist. Pick a section below, or call us and we will help directly.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/" size="lg">Go to the home page</ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">Contact us</ButtonLink>
          </div>
          <h2 className="mt-10 text-3xl font-bold">Main sections</h2>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {SECTIONS.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand">{l.label}</Link></li>)}
          </ul>
          <h2 className="mt-8 text-3xl font-bold">Popular services</h2>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {popular.map((x) => <li key={x.slug}><Link href={`/services/${x.slug}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand">{x.title}</Link></li>)}
          </ul>
          <p className="mt-8">
            <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 font-heading text-2xl font-bold tracking-wide text-ink hover:underline"><Phone className="size-5" aria-hidden /> {s.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
