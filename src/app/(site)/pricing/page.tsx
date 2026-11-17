import { Check, Tag } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { SectionHeading } from '@/components/plumb/decor';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import { PLANS, RATE_GUIDE } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Plumbing Prices and Rates in Nairobi (KES)',
  description: 'Indicative plumbing prices in Kenya shillings, service plans and current offers from Felibest Plumbing. You approve a fixed price before any work starts.',
  path: '/pricing',
});

export default function PricingPage() {
  const s = getSettings();
  const offers = s.offers.filter((o) => o.active);
  return (
    <>
      <PageHero crumbs={[{ name: 'Pricing', path: '/pricing' }]} title="Clear prices, no hidden fees" intro="Every job is different, so we quote before we start. You approve the price first, and we never add extra for same-day, evening or weekend visits." />

      {offers.length ? (
        <section className="section-pad px-3 sm:px-5" aria-labelledby="offers-h">
          <div className="container-fp !px-0">
            <SectionHeading eyebrow="Special offers" title={<span id="offers-h">Current offers</span>} intro="Mention an offer when you call or book. Offers cannot be combined." />
            <Stagger className="grid gap-6 md:grid-cols-2">
              {offers.map((o) => (
                <StaggerItem key={o.title} className="fp-card-peach flex gap-5 p-7">
                  <span className="fp-icon fp-icon-orange !size-16"><Tag className="size-7" aria-hidden /></span>
                  <div>
                    {o.label ? <p className="fp-pill fp-pill-orange mb-2">{o.label}</p> : null}
                    <h3 className="font-heading text-2xl font-bold">{o.title}</h3>
                    {o.description ? <p className="mt-2 text-body">{o.description}</p> : null}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <section className="section-pad px-3 sm:px-5" aria-labelledby="rates-h">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="Rate guide" title={<span id="rates-h">What common jobs cost</span>} intro="Indicative ranges in Kenya shillings. Materials, access and urgency affect the final figure, so we confirm a fixed price before we begin." />
          <Reveal>
            <div className="fp-card overflow-hidden p-2 sm:p-4">
              <table className="w-full text-left">
                <caption className="sr-only">Indicative plumbing prices in KES</caption>
                <thead><tr className="text-sm uppercase tracking-wider text-muted"><th scope="col" className="px-4 py-3">Job</th><th scope="col" className="px-4 py-3 text-right">Typical price</th></tr></thead>
                <tbody>
                  {RATE_GUIDE.map((r) => (
                    <tr key={r.item} className="border-t border-sky-200">
                      <th scope="row" className="px-4 py-4 font-semibold text-ink">{r.item}</th>
                      <td className="px-4 py-4 text-right font-heading text-3xl font-bold text-navy-700">{r.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 pl-2 text-sm text-muted">Prices are a guide only and exclude parts and materials unless stated. Final quotes are given after assessment.</p>
          </Reveal>
        </div>
      </section>

      <section className="px-3 pb-20 sm:px-5" aria-labelledby="plans-h">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="Service plans" title={<span id="plans-h">Maintenance plans</span>} intro="Planned care costs less than emergencies. Tell us about your property and we will price a plan to suit." />
          <Stagger className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((p, i) => (
              <StaggerItem key={p.name} className={i === 1 ? 'fp-card-blue p-8' : 'fp-card p-8'}>
                <h3 className={`font-heading text-3xl font-bold ${i === 1 ? '!text-white' : ''}`}>{p.name}</h3>
                <p className={i === 1 ? 'text-sky-100' : 'text-muted'}>{p.for}</p>
                <ul className="my-6 space-y-3">
                  {p.perks.map((perk) => <li key={perk} className="flex gap-3"><Check className={`mt-1 size-5 shrink-0 ${i === 1 ? 'text-sky-300' : 'text-navy-600'}`} aria-hidden />{perk}</li>)}
                </ul>
                <ButtonLink href="/contact#book" variant={i === 1 ? 'primary' : 'blue'} className="w-full">{p.from}</ButtonLink>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} title="Want an exact price?" text="Send us a few details or call for a quote. You approve it before work begins." />
    </>
  );
}
