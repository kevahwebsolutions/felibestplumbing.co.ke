import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';

export function buildMetadata(opts: { title: string; description: string; path: string; image?: string; imageSize?: { width: number; height: number; type?: string; alt?: string }; noindex?: boolean; type?: 'website' | 'article' }): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? '/images/logo-light.png');
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: opts.type ?? 'website',
      siteName: SITE.name,
      locale: 'en_KE',
      title: opts.title,
      description: opts.description,
      url,
      images: [{ url: image, ...(opts.imageSize ?? {}) }],
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: [image] },
  };
}

/** Renders a JSON-LD script. Content is built from our own data, and `<` is escaped to prevent script breakout. */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Plumber', 'LocalBusiness'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    image: absoluteUrl('/images/logo-light.png'),
    logo: absoluteUrl('/icons/icon-512.png'),
    telephone: SITE.phone,
    email: SITE.emails[0],
    priceRange: 'KES',
    foundingDate: String(SITE.established),
    founder: { '@type': 'Person', name: SITE.founder.name, jobTitle: SITE.founder.role },
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    areaServed: { '@type': 'City', name: 'Nairobi' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: SITE.socials.map((s) => s.href),
  };
}
