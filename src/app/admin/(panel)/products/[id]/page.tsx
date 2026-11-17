import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { getDb, schema } from '@/db';
import { getProductById } from '@/lib/server/products';

export const metadata = { title: 'Edit product' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = /^\d+$/.test(id) ? getProductById(Number(id)) : null;
  if (!p) notFound();
  const categories = getDb().select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).all();
  const primaryIndex = Math.max(0, p.images.findIndex((i) => i.isPrimary));
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black sm:text-4xl">Edit product</h1>
      <ProductForm
        categories={categories}
        initial={{ id: p.id, name: p.name, slug: p.slug, categoryId: p.categoryId, description: p.description, price: p.price, salePrice: p.salePrice, sku: p.sku, stock: p.stock, tags: p.tags, specs: p.specs, featured: p.featured, published: p.published, isNew: p.isNew, isPlaceholderPrice: p.isPlaceholderPrice, images: p.images.map((i) => ({ src: i.src, url: i.url, alt: i.alt })), primaryIndex }}
      />
    </div>
  );
}
