import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/page-hero';
import { ShopClient } from '@/components/shop/shop-client';
import { buildMetadata, fitDescription, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { categoriesWithCounts, categoryBySlug, listProductsInCategory } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  return buildMetadata({
    title: `${c.name} in Nairobi`,
    description: fitDescription(c.description, [
      'Order online from Felibest Plumbing in Nairobi, prices in KES, pay on delivery.',
      'Shop at Felibest Plumbing in Nairobi, prices in KES, pay on delivery.',
      'Shop at Felibest Plumbing, Nairobi.',
    ]),
    path: `/shop/category/${c.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const products = listProductsInCategory(slug);
  const others = categoriesWithCounts().filter((x) => x.slug !== slug);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: c.name,
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/shop/${p.slug}`), name: p.name })),
        }}
      />
      <PageHero crumbs={[{ name: 'Shop', path: '/shop' }, { name: c.name, path: `/shop/category/${c.slug}` }]} title={c.name} intro={c.description} />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp !px-0">
          <nav aria-label="Other categories" className="mb-8 flex flex-wrap gap-2">
            <Link href="/shop" className="fp-chip">All products</Link>
            {others.map((o) => <Link key={o.id} href={`/shop/category/${o.slug}`} className="fp-chip">{o.name} ({o.count})</Link>)}
          </nav>
          <ShopClient products={products} categories={[]} showCategoryBar={false} />
        </div>
      </section>
    </>
  );
}
