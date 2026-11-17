import { ProductForm, EMPTY_PRODUCT } from '@/components/admin/product-form';
import { getDb, schema } from '@/db';

export const metadata = { title: 'New product' };

export default function NewProductPage() {
  const categories = getDb().select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).all();
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black sm:text-4xl">New product</h1>
      <ProductForm initial={EMPTY_PRODUCT} categories={categories} />
    </div>
  );
}
