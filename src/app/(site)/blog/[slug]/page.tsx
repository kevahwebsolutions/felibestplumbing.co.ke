import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Phone } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { PostBody } from '@/components/sections/post-body';
import { CtaBand } from '@/components/sections/common';
import { SectionHeading } from '@/components/clay/decor';
import { ButtonLink } from '@/components/ui/button';
import { POSTS, getPost, postReadingMinutes, relatedPosts } from '@/data/blog';
import { getService } from '@/data/services';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { getSettings } from '@/lib/server/settings';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, image: p.cover, type: 'article' });
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
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: absoluteUrl(p.cover), datePublished: p.date, dateModified: p.date, mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`), author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absoluteUrl('/icons/icon-512.png') } } }} />
      <PageHero crumbs={[{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]} title={p.title} eyebrow={p.category}>
        <p className="flex items-center gap-4 text-sky-100"><time dateTime={p.date}>{fmt(p.date)}</time><span className="flex items-center gap-1"><Clock className="size-4" aria-hidden /> {postReadingMinutes(p)} min read</span></p>
      </PageHero>
      <article className="px-3 pt-14 sm:px-5">
        <div className="container-clay mx-auto max-w-3xl !px-0">
          <div className="clay-card overflow-hidden !rounded-[36px] p-2"><div className="relative aspect-[16/9] overflow-hidden rounded-[30px]"><Image src={p.cover} alt={p.coverAlt} fill priority sizes="768px" className="object-cover" /></div></div>
          <div className="mt-10"><PostBody body={p.body} /></div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">{p.tags.map((t) => <li key={t} className="clay-pill">{t}</li>)}</ul>
          {service ? (
            <div className="clay-card-peach mt-10 flex flex-col items-start gap-4 p-8">
              <h2 className="font-heading text-2xl font-extrabold">Need help with this?</h2>
              <p className="text-body">Our team handles {service.title.toLowerCase()} across Nairobi, 24 hours a day.</p>
              <div className="flex flex-wrap gap-3"><ButtonLink href={`/services/${service.slug}`}>{service.title}</ButtonLink><ButtonLink href="/contact#book" variant="ghost"><Phone className="size-5" aria-hidden /> Book now</ButtonLink></div>
            </div>
          ) : null}
        </div>
      </article>
      <section className="section-pad px-3 sm:px-5" aria-labelledby="rel-h">
        <div className="container-clay !px-0">
          <SectionHeading eyebrow="Keep reading" title={<span id="rel-h">Related guides</span>} />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="clay-card clay-card-hover flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10]"><Image src={r.cover} alt={r.coverAlt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
                <div className="p-6"><p className="clay-pill mb-3">{r.category}</p><h3 className="font-heading text-lg font-extrabold leading-snug">{r.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
