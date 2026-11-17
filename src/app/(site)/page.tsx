import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock, Phone, ShieldCheck, Wallet } from 'lucide-react';
import { Bubbles, ClayDrop, ClayWrench, HERO_BUBBLES, SectionHeading, WaveDivider } from '@/components/clay/decor';
import { ClayIcon } from '@/components/clay/clay-icon';
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { BookingForm } from '@/components/forms/booking-form';
import { ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { CtaBand, ServiceCard } from '@/components/sections/common';
import { FaqList } from '@/components/sections/faq-list';
import { TestimonialCarousel } from '@/components/sections/testimonial-carousel';
import { ProductCard } from '@/components/shop/product-parts';
import { COVERAGE_AREAS, FAQS, HOW_IT_WORKS } from '@/data/content';
import { SERVICES, getService } from '@/data/services';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { img } from '@/lib/images';
import { SITE } from '@/lib/site';
import { featuredProducts } from '@/lib/server/products';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Felibest Plumbing Nairobi | 24/7 Emergency Plumber, Repairs and Installations',
  description: 'Licensed plumbers in Nairobi, Kenya, available 24 hours a day. Emergency repairs, blocked drains, burst pipes, tanks, solar heaters, bathroom renovations and a plumbing shop. Call +254 798 174 201.',
  path: '/',
});

const GALLERY = ['/images/gallery/gallery03.webp', '/images/gallery/bth2.webp', '/images/gallery/gallery07.webp', '/images/gallery/clog2.webp', '/images/gallery/gallery10.webp', '/images/gallery/burst-pipes-2.webp'];

export default function HomePage() {
  const s = getSettings();
  const products = featuredProducts(4);
  const tel = `tel:${s.phone.replace(/[^\d+]/g, '')}`;
  const bento = ['emergency-plumbing', 'blocked-toilet-repair', 'burst-pipes-repair', 'solar-water-heater', 'bathroom-renovations', 'tank-installation-and-repair'].map((x) => getService(x)!);
  const faqs = FAQS.slice(0, 5);

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />

      {/* HERO */}
      <section className="relative overflow-hidden px-3 pb-10 pt-6 sm:px-5 lg:pb-20">
        <Bubbles items={HERO_BUBBLES} />
        <div className="container-clay relative grid items-center gap-10 !px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            {s.homeBanner ? <p className="clay-pill clay-pill-orange mb-5">{s.homeBanner}</p> : null}
            <p className="clay-pill mb-5"><Clock className="size-4" aria-hidden /> Open 24 hours, 7 days a week</p>
            <h1 className="font-heading text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
              Nairobi plumbing, <span className="text-cta-500">fixed fast</span> and priced fairly.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-body">
              From burst pipes at midnight to full bathroom renovations, our licensed plumbers arrive on time, explain the problem and let you approve the price before any work starts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> Emergency call</ButtonAnchor>
              <ButtonLink href="/services" variant="ghost" size="lg">Explore services <ArrowRight className="size-5" aria-hidden /></ButtonLink>
            </div>
            <ul className="mt-9 flex flex-wrap gap-3">
              {[[Clock, 'On-time guarantee'], [BadgeCheck, '100% satisfaction guarantee'], [Wallet, 'You approve the price first'], [ShieldCheck, 'Fully licensed technicians']].map(([Icon, label]) => {
                const I = Icon as typeof Clock;
                return <li key={label as string} className="clay-chip !cursor-default"><I className="size-4 text-cta-500" aria-hidden /> {label as string}</li>;
              })}
            </ul>
          </div>

          <div className="relative">
            <ClayDrop className="absolute -right-4 -top-16 z-0 hidden animate-float opacity-95 md:block" size={130} />
            <div className="clay-card relative z-10 p-6 sm:p-8" id="quick-book">
              <h2 className="font-heading text-2xl font-extrabold">Book a plumber</h2>
              <p className="mb-5 mt-1 text-muted">Tell us what you need and we will call you back shortly.</p>
              <BookingForm compact idPrefix="hero" />
            </div>
            <ClayWrench className="absolute -bottom-12 -left-10 z-20 hidden rotate-[-25deg] animate-float-slow lg:block" size={120} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section aria-label="Our track record" className="px-3 sm:px-5">
        <Stagger className="container-clay grid grid-cols-2 gap-4 !px-0 sm:gap-6 lg:grid-cols-4">
          {[
            { n: SITE.stats.experienceYears, suf: '+', label: 'Years of combined experience', icon: 'wrench' as const },
            { n: SITE.stats.installs, suf: '+', label: 'Plumbing installs', icon: 'pipe' as const },
            { n: SITE.stats.repairs, suf: '+', label: 'Repairs fixed', icon: 'tap' as const },
            { n: SITE.stats.satisfaction, suf: '%', label: 'Satisfaction guarantee', icon: 'shield' as const },
          ].map((st, i) => (
            <StaggerItem key={st.label} className="clay-card flex flex-col items-center gap-3 p-6 text-center sm:p-8">
              <ClayIcon name={st.icon} tone={i % 2 ? 'orange' : 'blue'} size={60} />
              <p className="font-heading text-4xl font-black text-navy-700 sm:text-5xl"><CountUp to={st.n} suffix={st.suf} /></p>
              <p className="font-semibold text-muted">{st.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* SERVICES BENTO */}
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="What we do" title="From a leaking tap to a burst pipe" intro="Residential, commercial and emergency plumbing across Nairobi, with the same tidy, honest service on every job." />
          <Stagger className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bento.map((svc, i) => (
              <StaggerItem key={svc.slug} className={i === 0 ? 'lg:col-span-2 lg:row-span-1' : i === 3 ? 'lg:row-span-1' : ''}>
                <ServiceCard s={svc} feature={i === 0} />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 text-center">
            <ButtonLink href="/services" variant="blue" size="lg">See all {SERVICES.length} services <ArrowRight className="size-5" aria-hidden /></ButtonLink>
          </div>
        </div>
      </section>

      <WaveDivider color="#e3f1ff" />
      {/* HOW IT WORKS: sticky storytelling */}
      <section className="bg-sky-100 px-3 pb-20 sm:px-5" aria-labelledby="how-title">
        <div className="container-clay grid gap-10 !px-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading align="left" eyebrow="How it works" as="h2" title={<span id="how-title">Four simple steps, no surprises</span>} intro="We keep it simple: you stay informed and in control from the first call to the final clean-up." />
            <div className="hidden lg:block"><ClayDrop className="animate-float" size={150} /></div>
          </div>
          <ol className="space-y-6">
            {HOW_IT_WORKS.map((st, i) => (
              <Reveal as="li" key={st.title} delay={0.05}>
                <div className="clay-card flex gap-5 p-6 sm:p-8">
                  <span className="clay-icon clay-icon-orange !size-16 font-heading text-3xl font-black" aria-hidden>{i + 1}</span>
                  <div>
                    <h3 className="font-heading text-xl font-extrabold">{st.title}</h3>
                    <p className="mt-2 text-body">{st.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <WaveDivider color="#e3f1ff" flip animated={false} className="-mt-px" />

      {/* FEATURED PRODUCTS */}
      {products.length ? (
        <section className="section-pad px-3 sm:px-5">
          <div className="container-clay !px-0">
            <SectionHeading eyebrow="Plumbing shop" title="Quality fittings, delivered" intro="Taps, valves, heaters and accessories from our shop. Pay on delivery or order via WhatsApp." />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            <div className="mt-10 text-center"><ButtonLink href="/shop" variant="ghost" size="lg">Visit the shop <ArrowRight className="size-5" aria-hidden /></ButtonLink></div>
          </div>
        </section>
      ) : null}

      {/* GALLERY TEASER: staggered columns */}
      <section className="section-pad overflow-hidden px-3 sm:px-5">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="Our work" title="Real jobs from around Nairobi" intro="A small selection of installations and repairs by the Felibest team." />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {GALLERY.map((src, i) => {
              const im = img(src, 'Plumbing work completed by Felibest Plumbing');
              return (
                <Reveal key={src} delay={(i % 3) * 0.08} className={i % 2 === 1 ? 'md:translate-y-10' : ''}>
                  <div className="clay-card overflow-hidden !rounded-[32px] p-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
                      <Image src={im.src} alt={im.alt} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-16 text-center"><ButtonLink href="/gallery" size="lg">See the full gallery</ButtonLink></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad bg-sky-100 px-3 sm:px-5">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="Testimonials" title="What our customers say" intro="Our plumbers are experienced, reliable and professional." />
          <TestimonialCarousel />
        </div>
      </section>

      {/* COVERAGE */}
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="Coverage" title="Serving Nairobi and nearby" intro="Same-day service across these areas. Not listed? Call us and we will confirm." />
          <div className="grid gap-6 md:grid-cols-2">
            {COVERAGE_AREAS.slice(0, 2).map((z) => (
              <Reveal key={z.zone}>
                <div className="clay-card h-full p-7">
                  <h3 className="font-heading text-xl font-extrabold">{z.zone}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">{z.areas.map((a) => <li key={a} className="clay-pill">{a}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center"><Link href="/coverage" className="font-heading font-extrabold text-navy-600 underline underline-offset-4">View all areas</Link></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-3 pb-20 sm:px-5">
        <div className="container-clay grid gap-10 !px-0 lg:grid-cols-[0.8fr_1.2fr]">
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
