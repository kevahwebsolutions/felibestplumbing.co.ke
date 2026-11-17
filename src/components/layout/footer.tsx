import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { SERVICES } from '@/data/services';
import { WaveDivider } from '@/components/clay/decor';
import { SOCIAL_ICONS } from '@/components/clay/brand-icons';
import { Logo } from './header';

export function Footer({ phone, address, hours, email }: { phone: string; address: string; hours: string; email: string }) {
  const year = new Date().getFullYear();
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const emails = Array.from(new Set([email, ...SITE.emails]));
  return (
    <footer className="no-print relative mt-24 text-white">
      <WaveDivider color="#0a3d78" className="-mb-px" />
      <div className="bg-gradient-to-b from-navy-800 to-navy-950">
        <div className="container-clay grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="[&_span.font-heading]:!text-white">
              <Logo />
            </div>
            <p className="mt-5 max-w-xs text-sky-100">
              Family-owned plumbing for homes and businesses in Nairobi. On-time guarantee, 100% satisfaction guarantee and you approve the price before work starts.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SITE.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.id]!;
                return (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="clay-chip !min-h-11 w-11 justify-center !px-0">
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Company">
            <h2 className="font-heading text-lg font-extrabold !text-white">Explore</h2>
            <ul className="mt-4 space-y-1">
              {[
                ['/about', 'About us'],
                ['/services', 'All services'],
                ['/shop', 'Plumbing shop'],
                ['/pricing', 'Pricing and offers'],
                ['/gallery', 'Our work'],
                ['/testimonials', 'Testimonials'],
                ['/blog', 'Plumbing tips'],
                ['/faq', 'FAQ'],
                ['/coverage', 'Areas we cover'],
                ['/contact', 'Contact and booking'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href!} className="inline-flex min-h-9 items-center text-sky-100 underline-offset-4 hover:text-white hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="font-heading text-lg font-extrabold !text-white">Services</h2>
            <ul className="mt-4 space-y-1">
              {SERVICES.slice(0, 9).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="inline-flex min-h-9 items-center text-sky-100 underline-offset-4 hover:text-white hover:underline">
                    {s.title.length > 34 ? s.title.slice(0, 32) + '...' : s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-lg font-extrabold !text-white">Contact</h2>
            <ul className="mt-4 space-y-4 text-sky-100">
              <li className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-sky-300" aria-hidden /> {address}</li>
              <li className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-sky-300" aria-hidden /> <a className="hover:text-white hover:underline" href={tel}>{phone}</a></li>
              <li className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-sky-300" aria-hidden />
                <span className="flex flex-col">{emails.map((e) => <a key={e} className="break-all hover:text-white hover:underline" href={`mailto:${e}`}>{e}</a>)}</span>
              </li>
              <li className="flex gap-3"><Clock className="mt-1 size-5 shrink-0 text-sky-300" aria-hidden /> {hours}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-clay flex flex-col items-center justify-between gap-3 py-6 text-sm text-sky-100 sm:flex-row">
            <p>&copy; {year} {SITE.name}. All rights reserved. Website by {SITE.creditName}.</p>
            <p className="flex gap-5">
              <Link className="underline-offset-4 hover:text-white hover:underline" href="/privacy">Privacy</Link>
              <Link className="underline-offset-4 hover:text-white hover:underline" href="/terms">Terms</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="h-20 bg-navy-950 md:hidden" aria-hidden />
    </footer>
  );
}
