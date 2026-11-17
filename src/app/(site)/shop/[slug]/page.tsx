import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/page-hero';
import { SectionHeading } from '@/components/plumb/decor';
import { ProductBuyBox, ProductGallery, ProductTabs } from '@/components/shop/product-detail';
import { ProductCard } from '@/components/shop/product-parts';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { getProductBySlug, relatedProducts } from '@/lib/server/products';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  const desc = (p.description || `${p.name} from the Felibest Plumbing shop in Nairobi.`).slice(0, 155);
  return buildMetadata({ title: `${p.name} in Nairobi`, description: desc, path: `/shop/${p.slug}`, image: p.images[0]?.url });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  const s = getSettings();
  const related = relatedProducts(p);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: p.description || p.name,
          sku: p.sku || undefined,
          category: p.categoryName,
          image: p.images.map((i) => absoluteUrl(i.url)),
          brand: { '@type': 'Brand', name: p.specs.find((x) => x.key === 'Brand')?.value ?? SITE.name },
          offers: {
            '@type': 'Offer',
            url: absoluteUrl(`/shop/${p.slug}`),
            priceCurrency: 'KES',
            price: p.finalPrice,
            availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: SITE.name },
          },
        }}
      />
      <PageHero crumbs={[{ name: 'Shop', path: '/shop' }, { name: p.name, path: `/shop/${p.slug}` }]} title={p.name} eyebrow={p.categoryName} />
      <section className="section-pad !pb-10 px-3 sm:px-5">
        <div className="container-fp grid gap-10 !px-0 lg:grid-cols-2 lg:gap-16">
          <ProductGallery p={p} />
          <ProductBuyBox p={p} freeThreshold={s.freeDeliveryThreshold} fee={s.deliveryFee} phone={s.phone} />
        </div>
        <div className="container-fp mt-14 !px-0"><ProductTabs p={p} /></div>
      </section>
      {related.length ? (
        <section className="px-3 pb-20 sm:px-5" aria-labelledby="rel-h">
          <div className="container-fp !px-0">
            <SectionHeading eyebrow="Our recommendation" title={<span id="rel-h">Related products</span>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
