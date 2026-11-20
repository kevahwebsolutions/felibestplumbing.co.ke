import { Quote, Star } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { TESTIMONIALS } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Customer Testimonials and Reviews',
  description: 'Read what customers say about Felibest Plumbing: on-time, courteous, knowledgeable plumbers who fix problems quickly and leave the property clean.',
  path: '/testimonials',
});

export default function TestimonialsPage() {
  const s = getSettings();
  return (
    <>
      <PageHero crumbs={[{ name: 'Testimonials', path: '/testimonials' }]} title="Reviews from our customers" intro="Hear what our happy customers have to say. Our plumbers are experienced, reliable and professional." />
      <section className="section-pad px-3 sm:px-5">
        <Stagger className="container-fp grid gap-6 !px-0 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <figure className="fp-card flex h-full flex-col gap-4 p-8">
                <span className="fp-icon !size-14"><Quote className="size-7" aria-hidden /></span>
                <div className="flex gap-1 text-accent" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, k) => <Star key={k} className="size-5 fill-current" aria-hidden />)}</div>
                <figcaption className="font-heading text-3xl font-bold">{t.title}</figcaption>
                <blockquote className="flex-1 text-lg text-body">{t.text}</blockquote>
                <p className="font-bold text-brand">- {t.name}, {t.role}</p>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} title="Join our happy customers" />
    </>
  );
}
