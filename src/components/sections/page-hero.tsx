import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { WaterLine } from '@/components/plumb/decor';

export type Crumb = { name: string; path: string };

const DEFAULT_PHOTO = '/images/services2/commercial-11.webp';

/** Light page header: blueprint grid, a framed photo strip on large screens and breadcrumbs. */
export function PageHero({ title, intro, crumbs, children, eyebrow, image = DEFAULT_PHOTO, imagePosition = 'center' }: { title: React.ReactNode; intro?: React.ReactNode; crumbs: Crumb[]; children?: React.ReactNode; eyebrow?: string; image?: string; imagePosition?: string }) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface-alt">
      <JsonLd data={breadcrumbLd(all)} />
      <div aria-hidden className="bp-grid absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-[34%] lg:block">
        <Image src={image} alt="" fill priority quality={60} sizes="34vw" className="object-cover" style={{ objectPosition: imagePosition }} />
        <div className="absolute inset-0 bg-surface-alt/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-alt via-surface-alt/30 to-transparent" />
      </div>
      <div className="container-fp py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold text-body">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-4 opacity-70" aria-hidden /> : null}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-ink">{c.name}</span>
                ) : (
                  <Link href={c.path} className="inline-flex min-h-8 items-center underline-offset-4 hover:text-brand hover:underline">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="eyebrow mt-6">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-5xl font-bold leading-[0.98] sm:text-6xl md:text-7xl lg:max-w-[62%]">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg text-body">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      <WaterLine />
    </section>
  );
}
