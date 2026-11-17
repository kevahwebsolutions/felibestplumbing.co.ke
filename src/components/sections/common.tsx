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

/** Photo-led service card with duotone navy treatment, a fitting icon and a one-line summary. */
export function ServiceCard({ s, className, sizes = '(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw' }: { s: Service; className?: string; sizes?: string }) {
  const im = serviceHero(s);
  return (
    <Link href={`/services/${s.slug}`} className={cn('fp-card fp-card-hover group flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
        <Image src={im.src} alt={im.alt} fill sizes={sizes} className="object-cover grayscale-[35%] contrast-105 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-800/25 to-navy-800/20 mix-blend-multiply" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900/55 to-transparent" />
        <PlumbIcon name={s.icon} tone={toneForGroup(s.group)} size={52} className="absolute bottom-3 left-3" />
        {s.emergency ? <span className="fp-pill fp-pill-orange absolute right-3 top-3">24/7</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-2xl font-bold uppercase leading-tight text-ink">{s.title}</h3>
        <p className="flex-1 text-[0.95rem] text-muted">{s.short}</p>
        <span className="mt-2 inline-flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wider text-navy-700">
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
    <section aria-labelledby="cta-title" className="bp-grid relative overflow-hidden bg-navy-900 text-white">
      <WaterLine />
      <div className="container-fp grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow on-dark mb-3">24/7 emergency plumbers</p>
          <h2 id="cta-title" className="text-4xl font-bold !text-white sm:text-5xl md:text-6xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-sky-200">{text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> Call {phone}</ButtonAnchor>
            <ButtonAnchor href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" variant="outline" size="lg"><MessageCircle className="size-5" aria-hidden /> WhatsApp us</ButtonAnchor>
            <ButtonLink href="/contact#book" variant="outline" size="lg">Book online</ButtonLink>
          </div>
        </div>
        <a href={tel} aria-label={`24/7 emergency line ${phone}`} className="hidden rounded-lg border-2 border-white/80 px-6 py-4 text-white transition-colors hover:bg-white/10 lg:block">
          <span className="block font-heading text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Emergency line</span>
          <span className="block font-heading text-5xl font-bold tracking-wide">{phone}</span>
        </a>
      </div>
    </section>
  );
}
