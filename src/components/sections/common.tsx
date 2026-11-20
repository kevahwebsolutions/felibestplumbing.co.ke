import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { SERVICES, serviceHero, type Service } from '@/data/services';
import { PlumbIcon, toneForGroup } from '@/components/plumb/icons';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { WaterLine } from '@/components/plumb/decor';
import { whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Photo-led service card with a light treatment: real photo, brand-blue bottom bar, fitting icon and a one-line summary. */
export function ServiceCard({ s, className, sizes = '(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw' }: { s: Service; className?: string; sizes?: string }) {
  const im = serviceHero(s);
  return (
    <Link href={`/services/${s.slug}`} className={cn('fp-card fp-card-hover group flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-tint">
        <Image src={im.src} alt={im.alt} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-brand transition-[height] duration-200 group-hover:h-1.5" />
        <div aria-hidden className="absolute inset-0 bg-brand/0 transition-colors duration-200 group-hover:bg-brand/10" />
        <PlumbIcon name={s.icon} tone={toneForGroup(s.group)} size={52} className="absolute bottom-4 left-3" />
        {s.emergency ? <span className="fp-pill fp-pill-orange absolute right-3 top-3">24/7</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-2xl font-bold uppercase leading-tight text-ink">{s.title}</h3>
        <p className="flex-1 text-[0.95rem] text-ink-muted">{s.short}</p>
        <span className="mt-2 inline-flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wider text-brand">
          View service <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" aria-hidden />
        </span>
      </div>
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
    <section aria-labelledby="cta-title" className="bp-grid relative overflow-hidden border-y border-line bg-surface-alt">
      <WaterLine />
      <div className="container-fp grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow mb-3">24/7 emergency plumbers</p>
          <h2 id="cta-title" className="text-4xl font-bold sm:text-5xl md:text-6xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-body">{text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> Call {phone}</ButtonAnchor>
            <ButtonAnchor href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg"><MessageCircle className="size-5" aria-hidden /> WhatsApp us</ButtonAnchor>
            <ButtonLink href="/contact#book" variant="outline" size="lg">Book online</ButtonLink>
          </div>
        </div>
        <a href={tel} className="hidden rounded-lg border-2 border-brand bg-surface px-6 py-4 text-ink transition-colors hover:bg-tint lg:block">
          <span className="block font-heading text-sm font-semibold uppercase tracking-[0.22em] text-brand">Emergency line</span>
          <span className="block font-heading text-5xl font-bold tracking-wide">{phone}</span>
        </a>
      </div>
    </section>
  );
}
