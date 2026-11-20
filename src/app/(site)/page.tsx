import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock, MapPin, Phone, ShieldCheck, Wallet } from 'lucide-react';
import { PipeConnector, SectionHeading } from '@/components/plumb/decor';
import { PlumbGlyph } from '@/components/plumb/icons';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';
import { BookingForm } from '@/components/forms/booking-form';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { CtaBand } from '@/components/sections/common';
import { FaqList } from '@/components/sections/faq-list';
import { MapEmbed } from '@/components/sections/map-embed';
import { HowItWorks } from '@/components/sections/how-it-works';
import { ServiceTabs } from '@/components/sections/service-tabs';
import { TestimonialCarousel } from '@/components/sections/testimonial-carousel';
import { ProductCard } from '@/components/shop/product-parts';
import { COVERAGE_AREAS, FAQS, HOW_IT_WORKS } from '@/data/content';
import { SERVICES } from '@/data/services';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { featuredProducts } from '@/lib/server/products';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Felibest Plumbing Nairobi | 24/7 Emergency Plumber, Repairs and Installations',
  description: 'Licensed plumbers in Nairobi, Kenya, available 24 hours a day. Emergency repairs, blocked drains, burst pipes, tanks, solar heaters, bathroom renovations and a plumbing shop. Call +254 798 174 201.',
  path: '/',
});

const PROJECTS = [
  { src: '/images/gallery/gallery03.webp', alt: 'Glass shower and herringbone tile bathroom installed by Felibest', label: 'Bathroom and shower', pos: 'center 30%' },
  { src: '/images/services2/commercial-1.webp', alt: 'Felibest technicians installing a fire hose reel', label: 'Commercial fire and safety', pos: 'center 35%' },
  { src: '/images/gallery/gallery09.webp', alt: 'Felibest plumber fitting a wall-hung vanity', label: 'Vanity installation', pos: 'center 40%' },
  { src: '/images/gallery/gallery07.webp', alt: 'Water tank pipework installation in Nairobi', label: 'Tank pipework', pos: 'center 55%' },
  { src: '/images/gallery/gallery05.webp', alt: 'Freestanding bath installed in a marble-tiled bathroom', label: 'Freestanding bath', pos: 'center 45%' },
];

const WHY = [
  { glyph: 'shield' as const, title: 'Licensed technicians', text: 'Operating for more than 4 years, all of our technicians are fully licensed.' },
  { glyph: 'gauge' as const, title: 'Transparent pricing', text: 'No hidden fees. You approve the price before we start the job.' },
  { glyph: 'valve' as const, title: 'On-time guarantee', text: 'We arrive on time and finish on time, with emergency service 24/7.' },
  { glyph: 'wrench' as const, title: '100% satisfaction', text: 'We take no shortcuts, leave the work area clean and walk away only when you are satisfied.' },
];

export default function HomePage() {
  const s = getSettings();
  const products = featuredProducts(4);
  const tel = `tel:${s.phone.replace(/[^\d+]/g, '')}`;
  const faqs = FAQS.slice(0, 5);

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />

      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div aria-hidden className="bp-grid absolute inset-y-0 left-0 -z-10 w-full lg:w-[62%] [mask-image:linear-gradient(to_right,black_55%,transparent)]" />
        <div className="container-fp grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:py-16">
          <div>
            {s.homeBanner ? <p className="fp-pill fp-pill-orange mb-4">{s.homeBanner}</p> : null}
            <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-line bg-surface-alt px-3 py-1.5 font-heading text-base font-bold uppercase tracking-[0.12em] text-brand"><Clock className="size-4" aria-hidden /> Open 24 hours, 7 days a week</p>
            <h1 className="text-[3.2rem] font-bold leading-[0.95] sm:text-7xl lg:text-[4.7rem]">
              Nairobi&rsquo;s 24/7 plumbers. <span className="text-accent">Fixed right,</span> first time.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-body">
              Licensed plumbers who arrive on time, explain the problem and let you approve the price before any work starts. Burst pipes at midnight to full bathroom installs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonAnchor href={tel} size="lg" aria-label={`Call now ${s.phone}`}><Phone className="size-5" aria-hidden /> Call now</ButtonAnchor>
              <ButtonLink href="/contact#book" variant="outline" size="lg">Book online <ArrowRight className="size-5" aria-hidden /></ButtonLink>
            </div>
            <ul className="mt-8 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {[[Clock, 'On-time guarantee'], [BadgeCheck, '100% satisfaction guarantee'], [Wallet, 'You approve the price first'], [ShieldCheck, 'Fully licensed technicians']].map(([Icon, label]) => {
                const I = Icon as typeof Clock;
                return <li key={label as string} className="flex items-center gap-2 font-semibold text-ink"><I className="size-5 text-brand" aria-hidden /> {label as string}</li>;
              })}
            </ul>
          </div>

          <div className="relative pb-6 lg:min-h-[760px] lg:pb-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-tint lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[74%]">
              <Image src="/images/services2/commercial-11.webp" alt="Copper and brass plumbing pipework with isolation valves on a tiled wall" fill priority quality={70} sizes="(min-width:1024px) 46vw, 100vw" className="object-cover object-[60%_center]" />
              <div aria-hidden className="absolute inset-0 bg-surface-alt/20" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-brand" />
            </div>
            <div className="relative z-10 -mt-24 ml-3 mr-3 rounded-xl border border-line bg-surface p-6 shadow-float sm:ml-8 sm:mr-8 sm:p-7 lg:absolute lg:right-0 lg:top-6 lg:mx-0 lg:mt-0 lg:w-[22.5rem]" id="quick-book">
              <p className="eyebrow mb-1">Free quote</p>
              <h2 className="text-4xl font-bold">Book a plumber</h2>
              <p className="mb-5 mt-1 text-ink-muted">Tell us what you need and we will call you back shortly.</p>
              <BookingForm compact idPrefix="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section aria-label="Our track record" className="border-b border-line bg-surface-alt lg:pt-14">
        <ul className="container-fp grid grid-cols-2 divide-line py-2 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {[
            { n: SITE.stats.experienceYears, suf: '+', label: 'Years combined experience' },
            { n: SITE.stats.installs, suf: '+', label: 'Plumbing installs' },
            { n: SITE.stats.repairs, suf: '+', label: 'Repairs fixed' },
          ].map((st) => (
            <li key={st.label} className="flex flex-col-reverse items-center px-3 py-5 text-center">
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-ink-muted">{st.label}</p>
              <p className="font-heading text-5xl font-bold text-ink sm:text-6xl"><CountUp to={st.n} suffix={st.suf} /></p>
            </li>
          ))}
          {[
            { glyph: 'shield' as const, label: 'Licensed technicians' },
            { glyph: 'valve' as const, label: 'On-time guarantee' },
          ].map((b) => (
            <li key={b.label} className="flex flex-col items-center justify-center gap-1 px-3 py-5 text-center">
              <span className="grid size-12 place-items-center rounded-lg bg-brand text-on-brand" aria-hidden><PlumbGlyph name={b.glyph} size={30} /></span>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{b.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. EMERGENCY BAND */}
      <section aria-label="Emergency plumbing" className="bg-accent text-on-accent">
        <div className="container-fp flex flex-col items-start justify-between gap-5 py-6 md:flex-row md:items-center">
          <p className="font-heading text-3xl font-bold uppercase leading-tight sm:text-4xl">
            Burst pipe? Blocked toilet? No water? <span className="underline decoration-white/60 decoration-4 underline-offset-8">We answer 24/7.</span>
          </p>
          <a href={tel} className="inline-flex min-h-14 items-center gap-3 rounded-lg bg-surface px-6 py-2 font-heading text-3xl font-bold tracking-wide text-accent shadow-[0_3px_0_var(--color-accent-edge)] transition-colors hover:bg-surface-alt active:translate-y-0.5">
            <Phone className="size-6" aria-hidden /> {s.phone}
          </a>
        </div>
      </section>

      {/* 4. SERVICES */}
      <section className="section-pad">
        <div className="container-fp">
          <SectionHeading eyebrow="What we fix" title="Plumbing services for every job" intro="Residential, commercial and emergency plumbing across Nairobi, with the same tidy, honest service on every job." />
          <ServiceTabs />
          <div className="mt-10 text-center">
            <ButtonLink href="/services" variant="blue" size="lg">See all {SERVICES.length} services <ArrowRight className="size-5" aria-hidden /></ButtonLink>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bp-grid border-y border-line bg-surface-alt py-16 sm:py-20" aria-labelledby="how-title">
        <div className="container-fp">
          <SectionHeading eyebrow="How it works" title={<span id="how-title">Four steps from call to fixed</span>} intro="You stay informed and in control from the first call to the final clean-up." />
          <HowItWorks steps={HOW_IT_WORKS} />
        </div>
      </section>

      {/* 6. RECENT WORK */}
      <section className="section-pad">
        <div className="container-fp">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow="Recent work" title="Real jobs from around Nairobi" intro="Installations and repairs by the Felibest team." className="!mb-0" />
            <ButtonLink href="/gallery" variant="blue">View the gallery <ArrowRight className="size-5" aria-hidden /></ButtonLink>
          </div>
          <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
            {PROJECTS.map((p, i) => (
              <StaggerItem key={p.src} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <figure className="group relative h-full min-h-[190px] overflow-hidden rounded-lg border border-line bg-tint sm:min-h-[240px]">
                  <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1024px) 25vw, 50vw'} className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" style={{ objectPosition: p.pos }} />
                  <figcaption className="absolute inset-x-0 bottom-0 border-t-4 border-brand bg-surface/95 px-3 py-2 font-heading text-lg font-semibold uppercase tracking-wider text-ink sm:px-4">{p.label}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <PipeConnector />

      {/* 7. SHOP TEASER */}
      {products.length ? (
        <section className="bg-surface-alt py-16 sm:py-20">
          <div className="container-fp">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="left" eyebrow="Plumbing supplies" title="Fittings, taps and valves" intro="Order from our shop. Pay on delivery or order via WhatsApp." className="!mb-0" />
              <ButtonLink href="/shop" variant="blue">Visit the shop <ArrowRight className="size-5" aria-hidden /></ButtonLink>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* 8. WHY CHOOSE FELIBEST */}
      <section className="section-pad">
        <div className="container-fp grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading align="left" eyebrow="Why choose Felibest" title="Expect the best from our service" intro="Our goal is to provide highly professional plumbing services. We pride ourselves on reliable, friendly service that customers can trust." className="!mb-8" />
            <figure className="fp-card-sky border-l-4 !border-l-copper p-6">
              <blockquote className="text-lg text-ink">You approve the price before we start the job. We treat your property like our own.</blockquote>
              <figcaption className="mt-4">
                <span className="font-heading text-lg font-semibold uppercase tracking-wider text-ink">{SITE.founder.short}, <span className="text-ink-muted">{SITE.founder.role}</span></span>
              </figcaption>
            </figure>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w) => (
              <StaggerItem key={w.title} className="fp-card h-full p-6">
                <span className="grid size-14 place-items-center rounded-lg border-b-[3px] border-copper bg-brand text-on-brand" aria-hidden><PlumbGlyph name={w.glyph} size={34} /></span>
                <h3 className="mt-4 text-2xl font-bold uppercase">{w.title}</h3>
                <p className="mt-2 text-ink-muted">{w.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="bg-surface-alt py-16 sm:py-20">
        <div className="container-fp">
          <SectionHeading eyebrow="Testimonials" title="What our customers say" intro="Our plumbers are experienced, reliable and professional." />
          <TestimonialCarousel />
        </div>
      </section>

      {/* 10. COVERAGE */}
      <section className="section-pad">
        <div className="container-fp grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading align="left" eyebrow="Coverage" title="Serving Nairobi and nearby" intro="Same-day service across these areas. Not listed? Call us and we will confirm." className="!mb-6" />
            <div className="space-y-4">
              {COVERAGE_AREAS.map((z) => (
                <div key={z.zone}>
                  <h3 className="text-xl font-bold uppercase">{z.zone}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">{z.areas.map((a) => <li key={a} className="fp-pill !normal-case !tracking-normal !font-sans !text-[0.8rem] !font-semibold"><MapPin className="size-3" aria-hidden />{a}</li>)}</ul>
                </div>
              ))}
            </div>
            <Link href="/coverage" className="mt-6 inline-flex min-h-11 items-center font-heading text-lg font-bold uppercase tracking-wider text-brand underline underline-offset-4">View all areas</Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-line">
            <MapEmbed className="h-[360px] lg:h-full lg:min-h-[420px]" />
          </div>
        </div>
      </section>

      {/* 11. FAQ + FINAL CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="container-fp grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading align="left" eyebrow="FAQ" title="Questions we hear most" intro="Quick answers about pricing, emergencies and how we work." className="lg:mb-0" />
          <div>
            <FaqList items={faqs} defaultOpen="q0" />
            <ButtonLink href="/faq" variant="ghost" className="mt-2">All FAQs</ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
