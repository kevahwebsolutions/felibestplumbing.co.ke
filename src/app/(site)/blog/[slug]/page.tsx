import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Phone } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { PostBody } from '@/components/sections/post-body';
import { CtaBand } from '@/components/sections/common';
import { SectionHeading } from '@/components/plumb/decor';
import { ButtonLink } from '@/components/ui/button';
import { POSTS, getPost, postReadingMinutes, relatedPosts } from '@/data/blog';
import { getService } from '@/data/services';
import { buildMetadata, IDS, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  return buildMetadata({ title: p.metaTitle, description: p.metaDescription, path: `/blog/${p.slug}`, image: `/og/blog/${p.slug}`, imageSize: { width: 1200, height: 630, type: 'image/jpeg', alt: p.coverAlt }, type: 'article', article: { publishedTime: p.date, modifiedTime: p.updated ?? p.date } });
}

const fmt = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const s = getSettings();
  const service = getService(p.serviceSlug);
  const related = relatedPosts(p.slug);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${absoluteUrl(`/blog/${p.slug}`)}#article`,
          headline: p.title,
          description: p.metaDescription,
          image: [absoluteUrl(`/og/blog/${p.slug}`)],
          datePublished: p.date,
          dateModified: p.updated ?? p.date,
          inLanguage: 'en-KE',
          author: { '@id': IDS.organization },
          publisher: { '@id': IDS.organization },
          mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${p.slug}`) },
        }}
      />
      <PageHero crumbs={[{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]} title={p.title} eyebrow={p.category}>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body"><span>By {SITE.name}</span><time dateTime={p.date}>Published {fmt(p.date)}</time>{p.updated && p.updated !== p.date ? <time dateTime={p.updated}>Updated {fmt(p.updated)}</time> : null}<span className="flex items-center gap-1"><Clock className="size-4" aria-hidden /> {postReadingMinutes(p)} min read</span></p>
      </PageHero>
      <article className="px-3 pt-14 sm:px-5">
        <div className="container-fp mx-auto max-w-3xl !px-0">
          <div className="fp-card overflow-hidden rounded-lg p-2"><div className="relative aspect-[16/9] overflow-hidden rounded-lg"><Image src={p.cover} alt={p.coverAlt} fill priority sizes="768px" className="object-cover" /></div></div>
          <div className="mt-10"><PostBody body={p.body} /></div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">{p.tags.map((t) => <li key={t} className="fp-pill">{t}</li>)}</ul>
          {service ? (
            <div className="fp-card-peach mt-10 flex flex-col items-start gap-4 p-8">
              <h2 className="font-heading text-3xl font-bold">Need help with this?</h2>
              <p className="text-body">Our team handles {service.title.toLowerCase()} across Nairobi, 24 hours a day.</p>
              <div className="flex flex-wrap gap-3"><ButtonLink href={`/services/${service.slug}`}>{service.title}</ButtonLink><ButtonLink href="/contact#book" variant="ghost"><Phone className="size-5" aria-hidden /> Book now</ButtonLink></div>
            </div>
          ) : null}
        </div>
      </article>
      <section className="section-pad px-3 sm:px-5" aria-labelledby="rel-h">
        <div className="container-fp !px-0">
          <SectionHeading eyebrow="Keep reading" title={<span id="rel-h">Related guides</span>} />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="fp-card fp-card-hover flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10]"><Image src={r.cover} alt={r.coverAlt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
                <div className="p-6"><p className="fp-pill mb-3">{r.category}</p><h3 className="font-heading text-xl font-bold leading-snug">{r.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
