import Image from 'next/image';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { SectionHeading } from '@/components/clay/decor';
import { ClayIcon } from '@/components/clay/clay-icon';
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { VALUES } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'About Felibest Plumbing: Family-Owned Plumbers in Nairobi',
  description: 'Meet Felibest Plumbing: a family-owned, fully licensed Nairobi plumbing team with 4+ years of combined experience, an on-time guarantee and honest pricing.',
  path: '/about',
});

export default function AboutPage() {
  const s = getSettings();
  const icons = ['shield', 'bolt', 'tap', 'house', 'wrench', 'droplet'] as const;
  return (
    <>
      <PageHero crumbs={[{ name: 'About us', path: '/about' }]} title="Solving plumbing problems the friendly, professional way" intro="Felibest Plumbing is family-owned and operated, so you get a higher standard of service at a competitive price." />

      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay grid items-center gap-12 !px-0 lg:grid-cols-2">
          <Reveal>
            <p className="clay-pill mb-4">About the company</p>
            <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">With more than <span className="text-cta-500"><CountUp to={4} suffix="+ years" /></span> of combined experience</h2>
            <p className="mt-5 text-lg text-body">We take pride in solving any problem you may have in a quick, professional and friendly manner. Our quality plumbing service and our personal customer service touch set us apart from other plumbing companies.</p>
            <p className="mt-4 text-lg text-body">Because we are family-owned and operated, we can provide a higher standard of plumbing service at a competitive price. Our licensed plumbers are thoroughly trained and fully equipped to handle all your plumbing needs.</p>
            <div className="mt-8 flex items-center gap-4">
              <Image src="/images/sig.webp" alt="" width={120} height={60} className="h-14 w-auto" />
              <p className="font-heading font-extrabold text-ink">{SITE.founder.short}<br /><span className="text-sm font-semibold text-muted">{SITE.founder.role}</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="clay-card overflow-hidden !rounded-[44px] p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[34px]">
                <Image src="/images/gallery/gallery05.webp" alt="Felibest plumbers at work on a Nairobi installation" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-3 sm:px-5">
        <div className="container-clay grid gap-6 !px-0 md:grid-cols-2">
          <Reveal><div className="clay-card-sky h-full p-8"><ClayIcon name="consult" size={64} /><h2 className="mt-5 font-heading text-2xl font-extrabold">Our mission</h2><p className="mt-3 text-body">To solve every plumbing problem quickly, honestly and tidily, so homes and businesses in Nairobi can rely on their water and drainage. We walk away only when you are 100% satisfied.</p></div></Reveal>
          <Reveal delay={0.1}><div className="clay-card-peach h-full p-8"><ClayIcon name="sun" tone="orange" size={64} /><h2 className="mt-5 font-heading text-2xl font-extrabold">Our vision</h2><p className="mt-3 text-body">To be the plumbing company Nairobi trusts first: the one that arrives on time, keeps its promises and stays ahead by adopting new advances in the trade.</p></div></Reveal>
        </div>
      </section>

      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="Why choose us" title="We guarantee quality with every service" intro="Our number one priority is outstanding customer service on each and every job." />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <StaggerItem key={v.title} className="clay-card h-full p-7">
                <ClayIcon name={icons[i]!} tone={i % 2 ? 'orange' : 'blue'} size={60} />
                <h3 className="mt-5 font-heading text-xl font-extrabold">{v.title}</h3>
                <p className="mt-2 text-body">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
