import Link from 'next/link';
import { PageHero } from '@/components/sections/page-hero';
import { ShopClient } from '@/components/shop/shop-client';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { categoriesWithCounts, listPublishedProducts } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: { absolute: 'Shop: Showers, Pumps, Laundry Supplies | Felibest Plumbing' },
  description: 'Buy a modern shower, a Dayliff well pump, washing machine pipes, taps, covers and laundry supplies in Nairobi. Prices in KES, pay on delivery.',
  path: '/shop',
});

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = listPublishedProducts();
  const categories = categoriesWithCounts().map((c) => ({ id: c.id, slug: c.slug, name: c.name, count: c.count }));
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Felibest Plumbing shop',
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/shop/${p.slug}`), name: p.name })),
        }}
      />
      <PageHero crumbs={[{ name: 'Shop', path: '/shop' }]} title="Shop" intro="Showers, a well pump, washing machine plumbing, covers and stands, laundry bags and laundry care, priced in Kenya shillings. Pay on delivery or send your cart to us on WhatsApp." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp !px-0">
          <ShopClient products={products} categories={categories} initialCategory={categories.some((c) => c.slug === category) ? category : ''} />
        </div>
      </section>
      <section aria-labelledby="by-cat" className="px-3 pb-20 sm:px-5">
        <div className="container-fp !px-0">
          <h2 id="by-cat" className="mb-6 text-4xl font-bold">Shop by category</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesWithCounts().map((c) => (
              <li key={c.id} className="fp-card p-5">
                <h3 className="font-heading text-2xl font-semibold"><Link href={`/shop/category/${c.slug}`} className="text-ink hover:text-brand">{c.name}</Link></h3>
                <p className="mt-2 text-body">{c.description}</p>
                <Link href={`/shop/category/${c.slug}`} className="mt-3 inline-flex min-h-11 items-center font-bold text-brand underline-offset-4 hover:underline">{c.count} {c.count === 1 ? 'product' : 'products'}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
