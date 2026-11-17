import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { GalleryClient } from '@/components/sections/gallery-client';
import { allGalleryItems, GALLERY_CATEGORIES } from '@/data/gallery';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Plumbing Work Gallery: Projects Across Nairobi',
  description: 'Photos of Felibest Plumbing work in Nairobi: bathrooms, glass showers, drains, burst pipes, tanks, solar heaters, commercial and residential projects.',
  path: '/gallery',
});

export default function GalleryPage() {
  const s = getSettings();
  const items = allGalleryItems();
  return (
    <>
      <PageHero crumbs={[{ name: 'Gallery', path: '/gallery' }]} title="Our work, up close" intro="Examples of the range of work we have undertaken and the craftsmanship of our plumbers. Filter by category and tap a photo to enlarge it." />
      <section className="section-pad px-3 sm:px-5"><div className="container-fp !px-0"><GalleryClient items={items} categories={GALLERY_CATEGORIES} /></div></section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
