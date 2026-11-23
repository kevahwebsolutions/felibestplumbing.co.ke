import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { COVERAGE_AREAS } from '@/data/content';

export const TITLE_SUFFIX = ' | Felibest Plumbing';
export const TITLE_MAX = 60;
export const DESC_MIN = 110;
export const DESC_MAX = 155;

/** Default share image for pages without a specific photo: generated 1200x630 JPEG with the logo. */
export const DEFAULT_OG = '/og/page/home';

/**
 * Full page title within 60 characters. The topic gets the brand suffix when it fits; otherwise the topic is used
 * on its own (it already carries the keyword). Callers keep topics short enough that this never has to cut text.
 */
export function fitTitle(topic: string): string {
  if (/felibest/i.test(topic)) return topic;
  const withSuffix = `${topic}${TITLE_SUFFIX}`;
  return withSuffix.length <= TITLE_MAX ? withSuffix : topic;
}

/** Picks the longest tail that keeps the description within 155 characters; never cuts a sentence mid-word. */
export function fitDescription(base: string, tails: string[] = []): string {
  const clean = base.replace(/\s+/g, ' ').trim();
  for (const tail of tails) {
    const joined = `${clean} ${tail}`.trim();
    if (joined.length <= DESC_MAX) return joined;
  }
  return clean;
}

export function ogImage(kind: 'service' | 'blog' | 'page', slug: string) {
  return { path: `/og/${kind}/${slug}`, size: { width: 1200, height: 630, type: 'image/jpeg' } };
}

type MetaOpts = {
  /** Page topic. The brand suffix is added by `fitTitle`. Pass `{ absolute }` to use a finished title as is. */
  title: string | { absolute: string };
  description: string;
  path: string;
  image?: string;
  imageSize?: { width: number; height: number; type?: string; alt?: string };
  noindex?: boolean;
  type?: 'website' | 'article';
  article?: { publishedTime: string; modifiedTime: string };
};

export function buildMetadata(opts: MetaOpts): Metadata {
  const url = absoluteUrl(opts.path === '/' ? '/' : opts.path);
  const canonical = opts.path === '/' ? SITE.url : url;
  const imagePath = opts.image ?? DEFAULT_OG;
  const image = absoluteUrl(imagePath);
  const size = opts.imageSize ?? (imagePath.startsWith('/og/') ? { width: 1200, height: 630, type: 'image/jpeg' } : undefined);
  const full = typeof opts.title === 'string' ? fitTitle(opts.title) : opts.title.absolute;
  return {
    title: { absolute: full },
    description: opts.description,
    alternates: { canonical },
    robots: opts.noindex ? { index: false, follow: false, noarchive: true } : undefined,
    openGraph: {
      type: opts.type ?? 'website',
      siteName: SITE.name,
      locale: 'en_KE',
      title: full,
      description: opts.description,
      url: canonical,
      images: [{ url: image, ...(size ?? {}), alt: opts.imageSize?.alt ?? full }],
      ...(opts.article ? { publishedTime: opts.article.publishedTime, modifiedTime: opts.article.modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: full, description: opts.description, images: [image] },
  };
}

/** Renders a JSON-LD script. Content is built from our own data, and `<` is escaped to prevent script breakout. */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** Stable entity ids so pages reference the business and organisation instead of repeating them. */
export const IDS = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  business: `${SITE.url}/#business`,
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** E.164 form (no spaces) for structured data. */
const PHONE_E164 = SITE.phone.replace(/[^\d+]/g, '');

const AREAS = [...new Set(['Nairobi', ...COVERAGE_AREAS.flatMap((z) => z.areas)])].filter((a) => a !== 'Nairobi CBD');

/** Site-wide entities: Organization, WebSite and the Plumber business. No address, geo, priceRange or ratings (none are verified). */
export function siteLd() {
  const logo = { '@type': 'ImageObject', url: absoluteUrl('/icons/icon-512.png'), width: 512, height: 512 };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': IDS.organization,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo,
        image: absoluteUrl('/images/logo-light.png'),
        foundingDate: String(SITE.established),
        founder: { '@type': 'Person', name: SITE.founder.name, jobTitle: SITE.founder.role },
        sameAs: SITE.socials.map((s) => s.href),
        contactPoint: [
          { '@type': 'ContactPoint', contactType: 'customer service', telephone: PHONE_E164, email: SITE.emails[0], areaServed: 'KE', availableLanguage: ['English'], hoursAvailable: openingHours() },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': IDS.website,
        name: SITE.name,
        url: SITE.url,
        inLanguage: 'en-KE',
        publisher: { '@id': IDS.organization },
      },
      {
        '@type': ['Plumber', 'LocalBusiness'],
        '@id': IDS.business,
        name: SITE.name,
        url: SITE.url,
        image: absoluteUrl('/images/logo-light.png'),
        logo: absoluteUrl('/icons/icon-512.png'),
        telephone: PHONE_E164,
        email: SITE.emails[0],
        description: 'Licensed plumbers in Nairobi, Kenya, available 24 hours a day for repairs, installations and emergencies.',
        parentOrganization: { '@id': IDS.organization },
        areaServed: AREAS.map((name) => ({ '@type': name === 'Nairobi' ? 'City' : 'Place', name })),
        openingHoursSpecification: openingHours(),
        sameAs: SITE.socials.map((s) => s.href),
      },
    ],
  };
}

function openingHours() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  };
}
