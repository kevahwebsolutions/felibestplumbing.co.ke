import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, Phone } from 'lucide-react';
import { PlumbIcon } from '@/components/plumb/icons';
import { HOW_IT_WORKS } from '@/data/content';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand, RelatedServices } from '@/components/sections/common';
import { FaqList } from '@/components/sections/faq-list';
import { SectionHeading } from '@/components/plumb/decor';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { BookingForm } from '@/components/forms/booking-form';
import { ButtonAnchor } from '@/components/ui/button';
import { ServiceGallery } from '@/components/sections/service-gallery';
import { SERVICES, getService, serviceGallery, serviceHero } from '@/data/services';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({ title: s.seoTitle, description: s.seoDescription, path: `/services/${s.slug}`, image: s.heroSrc });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const settings = getSettings();
  const hero = serviceHero(s);
  const gallery = serviceGallery(s);
  const tel = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.title,
          description: s.seoDescription,
          serviceType: s.title,
          url: absoluteUrl(`/services/${s.slug}`),
          image: absoluteUrl(s.heroSrc),
          areaServed: { '@type': 'City', name: 'Nairobi' },
          provider: { '@type': 'Plumber', name: SITE.name, url: SITE.url, telephone: SITE.phone },
        }}
      />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <PageHero crumbs={[{ name: 'Services', path: '/services' }, { name: s.title, path: `/services/${s.slug}` }]} title={s.title} intro={s.short} eyebrow={s.emergency ? 'Available 24/7' : s.group} image={s.heroSrc} imagePosition="center 40%">
        <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> Call {settings.phone}</ButtonAnchor>
      </PageHero>

      <div className="px-3 pt-14 sm:px-5">
        <div className="container-fp grid gap-10 !px-0 lg:grid-cols-[1.4fr_0.9fr] lg:gap-14">
          <article>
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-tint">
                <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width:1024px) 760px, 100vw" className="object-cover" style={{ objectPosition: 'center 40%' }} />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-brand" />
                <PlumbIcon name={s.icon} size={56} tone={s.emergency ? 'orange' : 'blue'} className="absolute bottom-4 left-4" />
              </div>
            </Reveal>
            <div className="prose-fp mt-10">
              {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {s.list ? (
              <section className="mt-10" aria-labelledby="list-h">
                <h2 id="list-h" className="text-4xl font-bold">{s.listHeading}</h2>
                <Stagger as="ol" className="mt-6 space-y-4">
                  {s.list.map((it, i) => (
                    <StaggerItem as="li" key={i} className="fp-card flex gap-4 p-5">
                      {s.listKind === 'steps' ? <span className="fp-icon !size-12 shrink-0 font-heading text-2xl font-bold" aria-hidden>{i + 1}</span> : <CheckCircle2 className="mt-1 size-7 shrink-0 text-brand-soft" aria-hidden />}
                      <p className="text-body">{it.title ? <strong className="text-ink">{it.title}. </strong> : null}{it.text}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="fp-card border-t-4 !border-t-accent-bright p-6 sm:p-7" id="book">
              <p className="eyebrow mb-1">Free quote</p>
              <h2 className="text-4xl font-bold">Book this service</h2>
              <p className="mb-5 mt-1 text-ink-muted">You approve the price before any work starts.</p>
              <BookingForm compact defaultService={s.title} idPrefix="svc" />
            </div>
          </aside>
        </div>
      </div>

      <section className="bp-grid mt-14 border-y border-line bg-surface-alt py-14" aria-labelledby="proc-h">
        <div className="container-fp">
          <SectionHeading align="left" eyebrow="Our process" title={<span id="proc-h">How we handle {s.title.toLowerCase()}</span>} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((st, i) => (
              <li key={st.title} className="fp-card p-5">
                <span className="font-heading text-5xl font-bold text-brand" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-2xl font-bold uppercase">{st.title}</h3>
                <p className="mt-2 text-sm text-body">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {gallery.length ? (
        <section className="section-pad px-3 sm:px-5" aria-labelledby="works-h">
          <div className="container-fp !px-0">
            <SectionHeading eyebrow="Our works" title={<span id="works-h">{s.title} projects</span>} />
            <ServiceGallery images={gallery} />
          </div>
        </section>
      ) : null}

      <section className="px-3 pb-20 sm:px-5" aria-labelledby="faq-h">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="FAQ" title={<span id="faq-h">Common questions</span>} />
          <div className="mx-auto max-w-3xl"><FaqList items={s.faqs} defaultOpen="q0" /></div>
        </div>
      </section>

      <section className="px-3 pb-20 sm:px-5" aria-labelledby="rel-h">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="Related services" title={<span id="rel-h">You may also need</span>} />
          <RelatedServices slugs={s.related} />
        </div>
      </section>
      <CtaBand phone={settings.phone} whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
