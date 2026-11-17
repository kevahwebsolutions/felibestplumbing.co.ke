import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { SERVICES, type Service } from '@/data/services';
import { ClayIcon, toneForGroup } from '@/components/clay/clay-icon';
import { Bubbles, ClayWrench } from '@/components/clay/decor';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { EmergencyBadge } from '@/components/layout/floating';
import { whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

export function ServiceCard({ s, className, feature = false }: { s: Service; className?: string; feature?: boolean }) {
  return (
    <Link
      href={`/services/${s.slug}`}
      className={cn(
        'clay-card clay-card-hover group flex h-full flex-col gap-4 p-6',
        feature && 'clay-card-blue !bg-none text-white',
        className,
      )}
    >
      <ClayIcon name={s.icon} tone={feature ? 'orange' : toneForGroup(s.group)} size={feature ? 76 : 64} />
      <h3 className={cn('font-heading text-xl font-extrabold leading-snug', feature ? '!text-white' : 'text-ink')}>{s.title}</h3>
      <p className={cn('flex-1', feature ? 'text-sky-100' : 'text-muted')}>{s.short}</p>
      <span className={cn('inline-flex items-center gap-2 font-heading font-extrabold', feature ? 'text-white' : 'text-navy-600')}>
        Learn more <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" aria-hidden />
      </span>
    </Link>
  );
}

export function RelatedServices({ slugs }: { slugs: string[] }) {
  const items = slugs.map((s) => SERVICES.find((x) => x.slug === s)).filter(Boolean) as Service[];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((s) => <ServiceCard key={s.slug} s={s} />)}
    </div>
  );
}

export function CtaBand({ phone, whatsappNumber, title = 'Plumbing problem? We are on our way.', text = 'Call or message us any time of day or night. You approve the price before any work starts.' }: { phone: string; whatsappNumber: string; title?: string; text?: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  return (
    <section className="px-3 sm:px-5" aria-labelledby="cta-title">
      <div className="clay-card-blue relative mx-auto max-w-7xl overflow-hidden !rounded-[48px] px-6 py-14 sm:px-14 sm:py-16">
        <Bubbles items={[{ size: 120, right: '28%', top: '-30px', slow: true }, { size: 50, left: '6%', bottom: '14%', delay: 1.2 }, { size: 34, left: '44%', bottom: '10%', delay: 2 }]} />
        <ClayWrench className="pointer-events-none absolute -left-8 -top-10 hidden rotate-[-20deg] opacity-90 lg:block" size={190} />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:pl-40">
          <div>
            <h2 id="cta-title" className="font-heading text-3xl font-extrabold !text-white sm:text-4xl md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-sky-100">{text}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> Call {phone}</ButtonAnchor>
              <ButtonAnchor href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg"><MessageCircle className="size-5" aria-hidden /> WhatsApp us</ButtonAnchor>
              <ButtonLink href="/contact#book" variant="ghost" size="lg">Book online</ButtonLink>
            </div>
          </div>
          <div className="hidden justify-self-end lg:block"><EmergencyBadge phone={phone} /></div>
        </div>
      </div>
    </section>
  );
}
