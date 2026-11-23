import Image from 'next/image';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { SectionHeading } from '@/components/plumb/decor';
import { PlumbIcon } from '@/components/plumb/icons';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';
import { VALUES } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Family-Owned Plumbers in Nairobi',
  description: 'Meet Felibest Plumbing: a family-owned, fully licensed Nairobi plumbing team with 4+ years of combined experience, an on-time guarantee and honest pricing.',
  path: '/about',
});

export default function AboutPage() {
  const s = getSettings();
  const icons = ['shield', 'gauge', 'tap', 'house', 'wrench', 'droplet'] as const;
  return (
    <>
      <PageHero image="/images/gallery/gallery09.webp" imagePosition="center 35%" crumbs={[{ name: 'About us', path: '/about' }]} title="Solving plumbing problems the friendly, professional way" intro="Felibest Plumbing is family-owned and operated, so you get a higher standard of service at a competitive price." />

      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp grid items-center gap-12 !px-0 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">About the company</p>
            <h2 className="font-heading text-4xl font-bold sm:text-5xl">With more than <span className="text-accent"><CountUp to={4} suffix="+ years" /></span> of combined experience</h2>
            <p className="mt-5 text-lg text-body">We take pride in solving any problem you may have in a quick, professional and friendly manner. Our quality plumbing service and our personal customer service touch set us apart from other plumbing companies.</p>
            <p className="mt-4 text-lg text-body">Because we are family-owned and operated, we can provide a higher standard of plumbing service at a competitive price. Our licensed plumbers are thoroughly trained and fully equipped to handle all your plumbing needs.</p>
            <p className="mt-8 border-l-4 border-copper pl-4 font-heading text-2xl font-semibold uppercase tracking-wide text-ink">{SITE.founder.short}<br /><span className="text-base font-medium normal-case tracking-normal text-ink-muted">{SITE.founder.role}</span></p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="relative aspect-[4/3]">
                <Image src="/images/gallery/gallery09.webp" alt="Felibest plumber fitting a wall-hung vanity in a Nairobi bathroom" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-3 sm:px-5">
        <div className="container-fp grid gap-6 !px-0 md:grid-cols-2">
          <Reveal><div className="fp-card-sky h-full p-8"><PlumbIcon name="consult" size={64} /><h2 className="mt-5 font-heading text-3xl font-bold">Our mission</h2><p className="mt-3 text-body">To solve every plumbing problem quickly, honestly and tidily, so homes and businesses in Nairobi can rely on their water and drainage. We walk away only when you are 100% satisfied.</p></div></Reveal>
          <Reveal delay={0.1}><div className="fp-card-peach h-full p-8"><PlumbIcon name="sun" tone="orange" size={64} /><h2 className="mt-5 font-heading text-3xl font-bold">Our vision</h2><p className="mt-3 text-body">To be the plumbing company Nairobi trusts first: the one that arrives on time, keeps its promises and stays ahead by adopting new advances in the trade.</p></div></Reveal>
        </div>
      </section>

      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="Why choose us" title="We guarantee quality with every service" intro="Our number one priority is outstanding customer service on each and every job." />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <StaggerItem key={v.title} className="fp-card h-full p-7">
                <PlumbIcon name={icons[i]!} tone={i % 2 ? 'orange' : 'blue'} size={60} />
                <h3 className="mt-5 font-heading text-2xl font-bold">{v.title}</h3>
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
