import Link from 'next/link';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBand } from '@/components/sections/common';
import { GalleryClient } from '@/components/sections/gallery-client';
import { allGalleryItems, GALLERY_CATEGORIES } from '@/data/gallery';
import { buildMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/server/settings';

export const metadata = buildMetadata({
  title: 'Plumbing Work Gallery in Nairobi',
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
      <section className="px-3 pb-16 sm:px-5" aria-labelledby="gallery-about">
        <div className="container-fp !px-0 max-w-4xl">
          <h2 id="gallery-about" className="text-4xl font-bold">About these projects</h2>
          <p className="mt-4 text-body">The photos above come from Felibest Plumbing jobs in Nairobi and the surrounding areas: bathroom renovations and glass showers, blocked drains and toilets, burst pipe repairs, water tank and solar heater installations, kitchen sinks and taps, and larger commercial and residential projects. Use the category buttons to see one kind of work at a time.</p>
          <p className="mt-4 text-body">
            Each job started the same way: we assessed the problem, agreed the price with the owner before any work began, and cleaned up afterwards. If you have a similar project, see our <Link href="/services" className="font-semibold text-brand underline underline-offset-4">plumbing services</Link>, browse the <Link href="/shop" className="font-semibold text-brand underline underline-offset-4">plumbing shop</Link>, or <Link href="/contact#book" className="font-semibold text-brand underline underline-offset-4">book a plumber</Link> for a free quote.
          </p>
        </div>
      </section>
      <CtaBand phone={s.phone} whatsappNumber={s.whatsappNumber} />
    </>
  );
}
