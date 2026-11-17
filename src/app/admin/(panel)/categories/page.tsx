import { asc } from 'drizzle-orm';
import { CategoriesManager } from '@/components/admin/categories-manager';
import { getDb, schema } from '@/db';
import { sql } from 'drizzle-orm';

export const metadata = { title: 'Categories' };

export default function CategoriesPage() {
  const db = getDb();
  const counts = new Map(db.select({ id: schema.products.categoryId, n: sql<number>`count(*)` }).from(schema.products).groupBy(schema.products.categoryId).all().map((r) => [r.id, r.n]));
  const cats = db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name)).all().map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black sm:text-4xl">Categories</h1>
      <CategoriesManager cats={cats} />
    </div>
  );
}
