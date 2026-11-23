import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { POSTS, postReadingMinutes } from '@/data/blog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Plumbing Tips and Guides for Nairobi',
  description: 'Practical plumbing advice from Felibest Plumbing: low water pressure, burst pipes, blocked toilets, water tanks, solar heaters, instant showers and taps.',
  path: '/blog',
});

const fmt = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogPage() {
  const [first, ...rest] = POSTS;
  return (
    <>
      <PageHero crumbs={[{ name: 'Blog', path: '/blog' }]} title="Plumbing tips and guides" intro="Straight answers from working plumbers on the problems Nairobi homes and businesses face most." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp !px-0">
          {first ? (
            <Link href={`/blog/${first.slug}`} className="fp-card fp-card-hover group mb-10 grid overflow-hidden md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto"><Image src={first.cover} alt={first.coverAlt} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></div>
              <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                <p className="fp-pill self-start">{first.category}</p>
                <h2 className="font-heading text-4xl font-bold leading-tight">{first.title}</h2>
                <p className="text-lg text-body">{first.excerpt}</p>
                <p className="flex items-center gap-4 text-sm text-ink-muted"><time dateTime={first.date}>{fmt(first.date)}</time><span className="flex items-center gap-1"><Clock className="size-4" aria-hidden /> {postReadingMinutes(first)} min read</span></p>
                <span className="inline-flex items-center gap-2 font-heading font-bold text-brand-soft">Read the guide <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" aria-hidden /></span>
              </div>
            </Link>
          ) : null}
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <StaggerItem key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="fp-card fp-card-hover group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10]"><Image src={p.cover} alt={p.coverAlt} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="fp-pill self-start">{p.category}</p>
                    <h2 className="font-heading text-2xl font-bold leading-snug">{p.title}</h2>
                    <p className="flex-1 text-body">{p.excerpt}</p>
                    <p className="flex items-center gap-4 text-sm text-ink-muted"><time dateTime={p.date}>{fmt(p.date)}</time><span>{postReadingMinutes(p)} min read</span></p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
