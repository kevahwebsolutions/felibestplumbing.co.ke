import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { BookingForm } from '@/components/forms/booking-form';
import { PlumbIcon } from '@/components/plumb/icons';
import { MapEmbed } from '@/components/sections/map-embed';
import { Reveal } from '@/components/motion/reveal';
import { ButtonAnchor } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { SITE, whatsappLink } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Contact and Book a Plumber in Nairobi',
  description: 'Contact Felibest Plumbing in Nairobi: call or WhatsApp +254 798 174 201, email us or book a plumber online. Open 24 hours, 7 days a week.',
  path: '/contact',
});

export default function ContactPage() {
  const s = getSettings();
  const tel = `tel:${s.phone.replace(/[^\d+]/g, '')}`;
  const emails = Array.from(new Set([s.email, ...SITE.emails]));
  const rows = [
    { icon: 'building' as const, label: 'Head office', value: s.address },
    { icon: 'sun' as const, label: 'Working hours', value: s.hours },
  ];
  return (
    <>
      <PageHero crumbs={[{ name: 'Contact', path: '/contact' }]} title="Contact us or book a plumber" intro="Our courteous plumbers work around your busy schedule. We never charge extra for same-day service, evenings, or weekend appointments." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp grid gap-10 !px-0 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="fp-card p-6 sm:p-10" id="book">
              <h2 className="font-heading text-4xl font-bold">Book or send an enquiry</h2>
              <p className="mb-6 mt-2 text-muted">Fill in the form and we will call you back. For emergencies, call us right away.</p>
              <BookingForm idPrefix="contact" />
            </div>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="fp-card-blue p-8">
                <h2 className="font-heading text-3xl font-bold !text-white">Need help right now?</h2>
                <div className="mt-5 grid gap-3">
                  <ButtonAnchor href={tel} size="lg"><Phone className="size-5" aria-hidden /> {s.phone}</ButtonAnchor>
                  <ButtonAnchor href={whatsappLink(undefined, s.whatsappNumber)} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg"><MessageCircle className="size-5" aria-hidden /> Chat on WhatsApp</ButtonAnchor>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="fp-card space-y-6 p-8">
                {rows.map((r) => (
                  <li key={r.label} className="flex items-center gap-4"><PlumbIcon name={r.icon} size={52} /><div><p className="text-sm font-bold uppercase tracking-wider text-muted">{r.label}</p><p className="font-heading text-xl font-bold text-ink">{r.value}</p></div></li>
                ))}
                <li className="flex items-center gap-4"><span className="fp-icon !size-[52px]"><Mail className="size-6" aria-hidden /></span><div><p className="text-sm font-bold uppercase tracking-wider text-muted">Email</p>{emails.map((e) => <a key={e} href={`mailto:${e}`} className="block break-all font-bold text-navy-600 underline-offset-4 hover:underline">{e}</a>)}</div></li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="px-3 pb-20 sm:px-5" aria-labelledby="map-h">
        <div className="container-fp !px-0">
          <h2 id="map-h" className="mb-6 flex items-center gap-3 font-heading text-4xl font-bold"><MapPin className="size-8 text-cta-500" aria-hidden /> Find us in Nairobi</h2>
          <div className="fp-card overflow-hidden rounded-lg p-2">
            <MapEmbed className="h-[380px] rounded-md" />
          </div>
          <p className="mt-4 flex items-center gap-2 pl-2 text-sm text-muted"><Clock className="size-4" aria-hidden /> We come to you. Call us to arrange a visit.</p>
        </div>
      </section>
    </>
  );
}
