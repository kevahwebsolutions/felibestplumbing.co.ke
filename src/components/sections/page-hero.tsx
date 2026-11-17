import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { WaterLine } from '@/components/plumb/decor';

export type Crumb = { name: string; path: string };

const DEFAULT_PHOTO = '/images/services2/commercial-11.webp';

/** Navy page header with a duotone photo, blueprint grid and breadcrumbs. */
export function PageHero({ title, intro, crumbs, children, eyebrow, image = DEFAULT_PHOTO, imagePosition = 'center' }: { title: React.ReactNode; intro?: React.ReactNode; crumbs: Crumb[]; children?: React.ReactNode; eyebrow?: string; image?: string; imagePosition?: string }) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <JsonLd data={breadcrumbLd(all)} />
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40 grayscale" style={{ objectPosition: imagePosition }} />
      <div aria-hidden className="bp-grid absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/60" />
      <div className="container-fp py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold text-sky-200">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-4 opacity-70" aria-hidden /> : null}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-white">{c.name}</span>
                ) : (
                  <Link href={c.path} className="inline-flex min-h-8 items-center underline-offset-4 hover:text-white hover:underline">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="eyebrow on-dark mt-6">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-5xl font-bold leading-[0.98] !text-white sm:text-6xl md:text-7xl">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg text-sky-200">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      <WaterLine />
    </section>
  );
}
