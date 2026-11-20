import { MapPin } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { COVERAGE_AREAS } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Areas We Cover: Plumbers Across Nairobi',
  description: 'Felibest Plumbing serves Nairobi and nearby areas including Westlands, Kilimani, Karen, Embakasi, Kasarani, Ruaka, Rongai and Thika Road, with same-day service.',
  path: '/coverage',
});

export default function CoveragePage() {
  const s = getSettings();
  return (
    <>
      <PageHero crumbs={[{ name: 'Coverage', path: '/coverage' }]} title="Locations we cover" intro="Our service locations make it easy to deliver prompt, same-day service across Nairobi and the surrounding area." />
      <section className="section-pad px-3 sm:px-5">
        <Stagger className="container-fp grid gap-6 !px-0 md:grid-cols-2">
          {COVERAGE_AREAS.map((z) => (
            <StaggerItem key={z.zone} className="fp-card p-8">
              <h2 className="font-heading text-3xl font-bold">{z.zone}</h2>
              <ul className="mt-5 grid grid-cols-2 gap-3">
                {z.areas.map((a) => <li key={a} className="flex items-center gap-2 font-semibold text-body"><MapPin className="size-5 shrink-0 text-accent" aria-hidden /> {a}</li>)}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="container-fp mt-8 !px-0 text-center text-ink-muted">Your area is not listed? Call {s.phone} and we will tell you straight away whether we can reach you.</p>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
