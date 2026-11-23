import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/page-hero';
import { SectionHeading } from '@/components/plumb/decor';
import { ProductBuyBox, ProductGallery, ProductTabs } from '@/components/shop/product-detail';
import { ProductCard } from '@/components/shop/product-parts';
import { buildMetadata, JsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';
import { isInstallableCategory } from '@/lib/catalog-meta';
import { productMetaDescription, productTitle } from '@/lib/product-seo';
import { getProductBySlug, relatedProducts } from '@/lib/server/products';
import { getSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  // WhatsApp and most link-preview crawlers need a JPEG, so og:image is the generated /og route and not the WebP photo.
  return buildMetadata({
    title: { absolute: productTitle(p) },
    description: productMetaDescription(p),
    path: `/shop/${p.slug}`,
    image: `/og/product/${encodeURIComponent(p.slug)}`,
    imageSize: { width: 1200, height: 630, type: 'image/jpeg', alt: p.images[0]?.alt || p.name },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  const s = getSettings();
  const related = relatedProducts(p);
  const brand = p.specs.find((x) => x.key.toLowerCase() === 'brand')?.value;
  const crumbs = [{ name: 'Shop', path: '/shop' }, ...(p.categoryId != null ? [{ name: p.categoryName, path: `/shop/category/${p.categorySlug}` }] : []), { name: p.name, path: `/shop/${p.slug}` }];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${absoluteUrl(`/shop/${p.slug}`)}#product`,
          name: p.name,
          description: p.description || p.name,
          sku: p.sku || undefined,
          image: p.images.map((i) => absoluteUrl(i.url)),
          brand: brand ? { '@type': 'Brand', name: brand } : undefined,
          offers: {
            '@type': 'Offer',
            url: absoluteUrl(`/shop/${p.slug}`),
            priceCurrency: 'KES',
            price: p.finalPrice,
            availability: p.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <PageHero crumbs={crumbs} title={p.name} eyebrow={p.categoryName} />
      <section className="section-pad !pb-10 px-3 sm:px-5">
        <div className="container-fp grid gap-10 !px-0 lg:grid-cols-2 lg:gap-16">
          <ProductGallery p={p} />
          <ProductBuyBox p={p} freeThreshold={s.freeDeliveryThreshold} fee={s.deliveryFee} phone={s.phone} installable={isInstallableCategory(p.categorySlug)} />
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
