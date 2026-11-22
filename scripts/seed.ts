import './load-env';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'node:path';
import { getDb, schema } from '../src/db';
import { CATALOG_CATEGORIES } from '../src/data/catalog-products';
import { DEFAULT_SETTINGS } from '../src/lib/server/settings';

const db = getDb();
migrate(db, { migrationsFolder: path.resolve('drizzle') });

// ---------- Admin user ----------
const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? '';
if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env (see .env.example) before seeding.');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && password.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters in production.');
  process.exit(1);
}
const existing = db.select().from(schema.users).where(eq(schema.users.email, email)).get();
if (!existing) {
  db.insert(schema.users).values({ email, passwordHash: bcrypt.hashSync(password, 12), mustChangePassword: true }).run();
  console.log(`Created admin ${email} (password change is required on first login).`);
} else if (process.argv.includes('--reset-admin')) {
  db.update(schema.users).set({ passwordHash: bcrypt.hashSync(password, 12), mustChangePassword: true }).where(eq(schema.users.id, existing.id)).run();
  console.log(`Reset password for ${email}.`);
} else {
  console.log(`Admin ${email} already exists, leaving it unchanged.`);
}

// ---------- Settings ----------
if (!db.select().from(schema.settings).where(eq(schema.settings.key, 'site')).get()) {
  db.insert(schema.settings).values({ key: 'site', value: JSON.stringify(DEFAULT_SETTINGS) }).run();
}

// ---------- Categories (the real catalogue categories) ----------
// Products are not seeded. `npm run db:import-catalog` imports the real 16-product catalogue.
let created = 0;
for (const c of CATALOG_CATEGORIES) {
  if (db.select().from(schema.categories).where(eq(schema.categories.slug, c.slug)).get()) continue;
  db.insert(schema.categories).values({ slug: c.slug, name: c.name, description: c.description, sortOrder: c.sortOrder }).run();
  created++;
}
console.log(`Seeded ${created} new categories. Run "npm run db:import-catalog" to load the products.`);
