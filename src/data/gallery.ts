import { imagesByPrefix, type Img } from '@/lib/images';

export type GalleryItem = Img & { category: string };

const GROUPS: { category: string; prefix: string; alt: string }[] = [
  { category: 'Featured projects', prefix: '/images/gallery/gallery', alt: 'Plumbing project by Felibest Plumbing' },
  { category: 'Bathrooms', prefix: '/images/gallery/bth', alt: 'Bathroom renovation in Nairobi' },
  { category: 'Bathrooms', prefix: '/images/services2/bth', alt: 'Bathroom renovation in Nairobi' },
  { category: 'Glass showers', prefix: '/images/services2/gcb', alt: 'Glass shower cubicle installation' },
  { category: 'Toilets', prefix: '/images/gallery/blocked-toilet', alt: 'Blocked toilet repair' },
  { category: 'Drains', prefix: '/images/gallery/clog', alt: 'Drain unclogging' },
  { category: 'Drains', prefix: '/images/services2/drain-clog', alt: 'Blocked drain repair' },
  { category: 'Pipes and leaks', prefix: '/images/gallery/burst-pipes', alt: 'Burst pipe repair' },
  { category: 'Pipes and leaks', prefix: '/images/services2/pip', alt: 'Pipe installation and repiping' },
  { category: 'Tanks and water heating', prefix: '/images/services2/tank-repair', alt: 'Water tank installation and repair' },
  { category: 'Tanks and water heating', prefix: '/images/services2/solar-water-heater', alt: 'Solar water heater installation' },
  { category: 'Kitchens and taps', prefix: '/images/services2/kitchensink', alt: 'Kitchen sink and tap repair' },
  { category: 'Commercial and residential', prefix: '/images/services2/commercial', alt: 'Commercial plumbing project' },
  { category: 'Commercial and residential', prefix: '/images/services2/residential', alt: 'Residential plumbing project' },
  { category: 'Fire and interiors', prefix: '/images/services2/fr', alt: 'Fire and safety installation' },
  { category: 'Fire and interiors', prefix: '/images/services2/in', alt: 'Interior design project' },
];

export function allGalleryItems(): GalleryItem[] {
  const seen = new Set<string>();
  const out: GalleryItem[] = [];
  for (const g of GROUPS) {
    for (const im of imagesByPrefix(g.prefix, g.alt)) {
      if (seen.has(im.src)) continue;
      seen.add(im.src);
      out.push({ ...im, category: g.category });
    }
  }
  return out;
}

export const GALLERY_CATEGORIES = ['All', ...Array.from(new Set(GROUPS.map((g) => g.category)))];
