import { PageHero } from '@/components/sections/page-hero';
import { CtaBand, ServiceCard } from '@/components/sections/common';
import { SectionHeading } from '@/components/plumb/decor';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { SERVICES, SERVICE_GROUPS } from '@/data/services';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'All Plumbing Services in Nairobi',
  description: 'Every plumbing service from Felibest Plumbing in Nairobi: emergencies, drains, burst pipes, taps, tanks, solar heaters, showers, bathroom renovations and commercial work.',
  path: '/services',
});

export default function ServicesPage() {
  const s = getSettings();
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: SERVICES.map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/services/${x.slug}`), name: x.title })) }} />
      <PageHero crumbs={[{ name: 'Services', path: '/services' }]} title="Plumbing services across Nairobi" intro="Homes, offices and commercial sites. Pick a service to see how we work, or call us if you are not sure what you need." />
      <div className="px-3 sm:px-5">
        <div className="container-fp !px-0">
          {SERVICE_GROUPS.map((g) => (
            <section key={g} className="section-pad !pb-0" aria-labelledby={`g-${g}`}>
              <SectionHeading as="h2" align="left" title={<span id={`g-${g}`}>{g}</span>} className="!mb-8" />
              <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.filter((x) => x.group === g).map((x) => <StaggerItem key={x.slug}><ServiceCard s={x} /></StaggerItem>)}
              </Stagger>
            </section>
          ))}
        </div>
      </div>
      <div className="mt-24"><CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} /></div>
    </>
  );
}
