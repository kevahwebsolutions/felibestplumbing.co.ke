import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { SERVICES } from '@/data/services';
import { COVERAGE_AREAS } from '@/data/content';
import { WaterLine } from '@/components/plumb/decor';
import { SOCIAL_ICONS } from '@/components/plumb/brand-icons';
import { Logo } from './header';

const link = 'inline-flex min-h-9 items-center text-sky-200 underline-offset-4 hover:text-white hover:underline';
const heading = 'mb-4 font-heading text-xl font-bold uppercase tracking-wider !text-white';

export function Footer({ phone, address, hours, email }: { phone: string; address: string; hours: string; email: string }) {
  const year = new Date().getFullYear();
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const emails = Array.from(new Set([email, ...SITE.emails]));
  const areas = COVERAGE_AREAS.flatMap((z) => z.areas).slice(0, 12);
  return (
    <footer className="no-print bp-grid relative bg-navy-950 text-white">
      <WaterLine />
      <div className="container-fp grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
        <div>
          <Logo size={60} />
          <p className="mt-5 max-w-xs text-sky-200">
            Family-owned plumbing for homes and businesses in Nairobi. On-time guarantee, 100% satisfaction guarantee and you approve the price before work starts.
          </p>
          <div className="mt-6 flex flex-wrap gap-1">
            {SITE.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.id]!;
              return (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="grid size-11 place-items-center rounded-lg border border-white/20 text-white hover:border-sky-400 hover:text-sky-400">
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label="Services">
          <h2 className={heading}>Services</h2>
          <ul className="space-y-0.5">
            {SERVICES.slice(0, 9).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>{s.title}</Link>
              </li>
            ))}
            <li><Link href="/services" className={`${link} font-semibold !text-white`}>All services &rsaquo;</Link></li>
          </ul>
        </nav>

        <div>
          <nav aria-label="Company">
            <h2 className={heading}>Company</h2>
            <ul className="space-y-0.5">
              {[
                ['/about', 'About us'], ['/shop', 'Plumbing shop'], ['/pricing', 'Pricing and offers'], ['/gallery', 'Our work'],
                ['/testimonials', 'Testimonials'], ['/blog', 'Plumbing tips'], ['/faq', 'FAQ'], ['/contact', 'Contact and booking'],
              ].map(([href, label]) => (
                <li key={href}><Link href={href!} className={link}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h2 className={heading}>Contact</h2>
          <ul className="space-y-3 text-sky-200">
            <li className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-copper-300" aria-hidden /> <a className="font-heading text-2xl font-bold tracking-wide text-white hover:underline" href={tel}>{phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-copper-300" aria-hidden />
              <span className="flex flex-col">{emails.map((e) => <a key={e} className="break-all hover:text-white hover:underline" href={`mailto:${e}`}>{e}</a>)}</span>
            </li>
            <li className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-copper-300" aria-hidden /> {address}</li>
            <li className="flex gap-3"><Clock className="mt-1 size-5 shrink-0 text-copper-300" aria-hidden /> {hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-fp py-6">
          <h2 className="mb-3 font-heading text-lg font-bold uppercase tracking-wider !text-white">Areas we cover</h2>
          <ul className="flex flex-wrap gap-x-1 gap-y-1 text-sm text-sky-200">
            {areas.map((a) => <li key={a} className="rounded border border-white/15 px-2.5 py-1">{a}</li>)}
            <li><Link href="/coverage" className="inline-flex min-h-7 items-center px-2.5 py-1 font-semibold text-white underline-offset-4 hover:underline">All areas &rsaquo;</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy-950">
        <div className="container-fp flex flex-col items-center justify-between gap-3 py-5 text-sm text-sky-200 sm:flex-row">
          <p>&copy; {year} {SITE.name}. All rights reserved. Website by {SITE.creditName}.</p>
          <p className="flex gap-5">
            <Link className="inline-flex min-h-9 items-center underline-offset-4 hover:text-white hover:underline" href="/privacy">Privacy</Link>
            <Link className="inline-flex min-h-9 items-center underline-offset-4 hover:text-white hover:underline" href="/terms">Terms</Link>
          </p>
        </div>
      </div>
      <div className="h-20 bg-navy-950 md:hidden" aria-hidden />
    </footer>
  );
}
