import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Bubbles } from '@/components/clay/decor';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export type Crumb = { name: string; path: string };

export function PageHero({ title, intro, crumbs, children, eyebrow }: { title: React.ReactNode; intro?: React.ReactNode; crumbs: Crumb[]; children?: React.ReactNode; eyebrow?: string }) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="relative px-3 pt-6 sm:px-5">
      <JsonLd data={breadcrumbLd(all)} />
      <div className="clay-card-blue relative mx-auto max-w-7xl overflow-hidden !rounded-[44px] px-6 py-12 sm:px-12 sm:py-16">
        <Bubbles items={[{ size: 110, right: '5%', top: '-20px', slow: true }, { size: 54, right: '24%', bottom: '14%', delay: 1 }, { size: 36, left: '46%', top: '16%', delay: 2 }]} />
        <nav aria-label="Breadcrumb" className="relative">
          <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold text-sky-100">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-4 opacity-70" aria-hidden /> : null}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-white">{c.name}</span>
                ) : (
                  <Link href={c.path} className="underline-offset-4 hover:text-white hover:underline">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="clay-pill relative mt-6">{eyebrow}</p> : null}
        <h1 className="relative mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-tight !text-white sm:text-5xl md:text-6xl">{title}</h1>
        {intro ? <p className="relative mt-5 max-w-2xl text-lg text-sky-100">{intro}</p> : null}
        {children ? <div className="relative mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
