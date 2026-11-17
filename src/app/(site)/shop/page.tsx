import { PageHero } from '@/components/sections/page-hero';
import { ShopClient } from '@/components/shop/shop-client';
import { buildMetadata } from '@/lib/seo';
import { categoriesWithCounts, listPublishedProducts } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Plumbing Supplies Shop Nairobi: Taps, Valves, Heaters',
  description: 'Buy plumbing supplies in Nairobi: mixers, taps, valves, water heaters and accessories in KES. Pay on delivery or order via WhatsApp.',
  path: '/shop',
});

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = listPublishedProducts();
  const categories = categoriesWithCounts().map((c) => ({ id: c.id, slug: c.slug, name: c.name, count: c.count }));
  return (
    <>
      <PageHero crumbs={[{ name: 'Shop', path: '/shop' }]} title="Plumbing supplies shop" intro="Quality fittings, heaters and accessories priced in Kenya shillings. Pay on delivery or send your cart to us on WhatsApp." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay !px-0">
          <ShopClient products={products} categories={categories} initialCategory={categories.some((c) => c.slug === category) ? category : ''} />
        </div>
      </section>
    </>
  );
}
