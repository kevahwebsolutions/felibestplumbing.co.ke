import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { FaqList } from '@/components/sections/faq-list';
import { SectionHeading } from '@/components/clay/decor';
import { BookingForm } from '@/components/forms/booking-form';
import { FAQS } from '@/data/content';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Plumbing FAQ: Prices, Emergencies, Pipes and Water Heaters',
  description: 'Answers to common plumbing questions in Nairobi: what we charge, water heater lifespan, signs you need new pipes, emergencies and preventing clogs.',
  path: '/faq',
});

export default function FaqPage() {
  const s = getSettings();
  const groups = Array.from(new Set(FAQS.map((f) => f.group)));
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <PageHero crumbs={[{ name: 'FAQ', path: '/faq' }]} title="Frequently asked questions" intro="From installations and emergency plumbing to leak repair, here is a run-down of the questions we hear most often." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay mx-auto max-w-4xl !px-0">
          {groups.map((g) => (
            <div key={g} className="mb-12">
              <SectionHeading as="h2" align="left" title={g} className="!mb-6 [&_h2]:!text-3xl" />
              <FaqList items={FAQS.filter((f) => f.group === g)} />
            </div>
          ))}
          <div className="clay-card mt-16 p-8" id="ask">
            <h2 className="font-heading text-2xl font-extrabold">Ask your own question</h2>
            <p className="mb-6 mt-2 text-muted">Many of us need an answer to a plumbing situation from time to time. Send us yours and we will reply.</p>
            <BookingForm mode="question" idPrefix="faq" />
          </div>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
