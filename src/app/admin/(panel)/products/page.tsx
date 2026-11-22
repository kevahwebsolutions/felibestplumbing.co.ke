import { ProductsTable } from '@/components/admin/products-table';
import { listAllProducts } from '@/lib/server/products';
import { getDb, schema } from '@/db';

export const metadata = { title: 'Products' };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const rows = listAllProducts().map((p) => ({ id: p.id, name: p.name, image: p.images[0]?.url ?? null, category: p.categoryName, price: p.price, salePrice: p.onSale ? p.finalPrice : null, stock: p.trackStock ? p.stock : null, published: p.published, archived: p.archived, featured: p.featured, needsReview: p.needsReview, sku: p.sku }));
  const categories = getDb().select({ name: schema.categories.name }).from(schema.categories).all().map((c) => c.name);
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black sm:text-4xl">Products</h1>
      <ProductsTable rows={rows} categories={categories} initialFilter={filter} />
    </div>
  );
}
