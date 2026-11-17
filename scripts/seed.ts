import './load-env';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'node:path';
import { getDb, schema } from '../src/db';
import { slugify, usdToKesPlaceholder } from '../src/lib/utils';
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

// ---------- Categories (from the legacy shop) ----------
const CATEGORIES = ['Sinks', 'Faucets', 'Pumps', 'Drains', 'Showers', 'Pipe Fittings', 'Steam Showers', 'Valves', 'Water Filtration', 'Water Heaters', 'Toilet Parts', 'Accessories'];
const catId = new Map<string, number>();
CATEGORIES.forEach((name, i) => {
  const slug = slugify(name);
  let row = db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).get();
  if (!row) row = db.insert(schema.categories).values({ slug, name, sortOrder: i }).returning().get();
  catId.set(name, row.id);
});

type Seed = {
  name: string; category: string; usd?: number; saleUsd?: number; kes?: number; tags: string[]; isNew?: boolean; featured?: boolean;
  description: string; specs?: [string, string][]; images?: string[]; published: boolean; stock?: number; sku?: string;
};

// The 12 distinct products of the old shop (one duplicate listing of the pull-down faucet was merged).
const LEGACY: Seed[] = [
  { name: 'Shower Hose S/Steel - Cone x Cone, 1.50m x 11mm Bore', category: 'Showers', usd: 4.5, tags: ['Installation', 'Repair'], isNew: true, published: true, stock: 40,
    description: 'Stainless steel shower hose with cone to cone fittings. 1.50 m long with an 11 mm bore, suitable for replacing a worn handheld shower hose.', specs: [['Length', '1.50 m'], ['Bore', '11 mm'], ['Material', 'Stainless steel'], ['Fittings', 'Cone x Cone']] },
  { name: 'Water Block Re-set Device', category: 'Accessories', usd: 5.26, saleUsd: 3.01, tags: ['Repair', 'Emergency Service'], published: true, stock: 25, images: ['/images/product/product-02.webp'],
    description: 'Re-set device for water block safety valves. A small accessory that restores flow after a water block has tripped.' },
  { name: 'INAQ4 Water Heater Accessory Pack', category: 'Water Heaters', usd: 59.93, tags: ['Installation'], featured: true, published: true, stock: 12, images: ['/images/product/product-03.webp'],
    description: 'Accessory pack for the installation of an electric water heater, containing the fittings needed to connect and make the unit safe.' },
  { name: 'Single Handle Pull Down Kitchen Faucet With Touch2O Technology', category: 'Faucets', usd: 57.35, tags: ['Installation'], featured: true, published: true, stock: 10,
    description: 'Single handle kitchen faucet with a pull down spray head and touch activated on and off control.', specs: [['Type', 'Single handle, pull down'], ['Control', 'Touch activated']] },
  { name: '2.5-Gallon 1500-watt 1 Element Point of Use Electric Water Heater', category: 'Water Heaters', usd: 229.82, tags: ['Installation'], featured: true, published: true, stock: 6,
    description: 'Compact point of use electric water heater for a single basin or kitchen sink, with a 1500 watt element.', specs: [['Capacity', '2.5 gallons (about 9.5 litres)'], ['Power', '1500 W'], ['Elements', '1']] },
  { name: 'Flexible Tap Connector - 1/2" x 15mm x 600mm', category: 'Pipe Fittings', usd: 1.97, tags: ['Installation', 'Repair'], isNew: true, published: true, stock: 80,
    description: 'Flexible tap connector for joining taps and mixers to the supply pipe. 600 mm long.', specs: [['Thread', '1/2"'], ['Pipe', '15 mm'], ['Length', '600 mm']] },
  { name: 'Anti-corrosive Immersion Heater 18" Plus Thermostat', category: 'Water Heaters', usd: 14.72, tags: ['Repair'], published: true, stock: 18,
    description: 'Anti-corrosive 18 inch immersion heater supplied with a thermostat for hot water cylinders.', specs: [['Length', '18 inch'], ['Includes', 'Thermostat']] },
  { name: 'Multikwik Non-Return Valve - 110mm', category: 'Valves', usd: 12.93, tags: ['Installation', 'Drains Cleaning'], published: true, stock: 15,
    description: 'Non-return valve that stops waste water flowing back up a 110 mm drain line.', specs: [['Pipe size', '110 mm']] },
  { name: 'Intatherm Safe Touch Basin Mixer Tap', category: 'Faucets', usd: 156.95, tags: ['Installation'], featured: true, published: true, stock: 8, sku: '000543',
    images: ['/images/product/product-13.webp', '/images/product/product-13-02.webp', '/images/product/product-13-03.webp', '/images/product/product-13-04.webp'],
    description: 'Safe touch, lever operated, thermostatic basin mixer tap with anti-scald protection, TMV3 approved. Supplied with copper tails. The valve opens the hot water supply until the temperature needs mixing with cold water to reduce the temperature at the outlet. If the hot water is cold or slightly warm that will be the temperature at the outlet. The outlet can only reach the required hot water temperature when the hot water supply is at least that temperature. The cold water closes until it is needed to reduce temperature. The water flow will not stop until the tap is closed.',
    specs: [['Brand', 'Intatherm'], ['Colour', 'Chrome'], ['Finish', 'Chrome finish'], ['Handle length', '140 mm'], ['Factory pre-set temperature', '43 C'], ['Inlet temperature', 'Max 85 C'], ['Max operating pressure', '10 bar (static)'], ['Min operating pressure', '0.2 bar (dynamic)'], ['Max pressure inlet differential', '5:1'], ['Style', 'Safe touch mixer']] },
  { name: 'Pump Gate Valve - 1.1/2" x 22mm', category: 'Valves', usd: 4.12, tags: ['Installation'], isNew: true, published: true, stock: 30,
    description: 'Gate valve for isolating a pump or a pipe run for maintenance.', specs: [['Size', '1.1/2" x 22 mm']] },
  { name: 'Lever Handle Ball Pump Valve - 1.1/2 x 35mm Pair', category: 'Valves', usd: 38.25, tags: ['Installation'], published: true, stock: 14,
    description: 'Pair of lever handle ball valves for isolating a pump. Quarter turn operation.', specs: [['Size', '1.1/2 x 35 mm'], ['Supplied', 'Pair']] },
];

// Catalogue starter lines to complete every category. They are created as unpublished drafts for the owner to review.
const DRAFTS: Seed[] = [
  { name: 'Stainless Steel Single Bowl Kitchen Sink', category: 'Sinks', kes: 8500, tags: ['Installation'], published: false, description: 'Single bowl stainless steel kitchen sink. Edit the specification before publishing.' },
  { name: 'Kitchen Sink Waste and Trap Kit', category: 'Sinks', kes: 1450, tags: ['Installation', 'Repair'], published: false, description: 'Waste and trap kit for a kitchen sink. Edit the specification before publishing.' },
  { name: 'Chrome Basin Pillar Tap', category: 'Faucets', kes: 1800, tags: ['Installation', 'Repair'], published: false, description: 'Chrome pillar tap for a bathroom basin. Edit the specification before publishing.' },
  { name: 'Water Booster Pump', category: 'Pumps', kes: 14500, tags: ['Installation', 'Repair'], published: false, description: 'Water booster pump to improve pressure from a storage tank. Edit the specification before publishing.' },
  { name: 'Stainless Steel Floor Drain with Trap', category: 'Drains', kes: 1200, tags: ['Drains Cleaning', 'Installation'], published: false, description: 'Stainless steel bathroom floor drain with a trap to block odours. Edit the specification before publishing.' },
  { name: 'Rain Shower Head with Arm', category: 'Showers', kes: 4200, tags: ['Installation'], published: false, description: 'Rain shower head with a wall arm. Edit the specification before publishing.' },
  { name: 'PPR Pipe Fitting Set', category: 'Pipe Fittings', kes: 2800, tags: ['Installation'], published: false, description: 'Assorted PPR elbows, tees and couplers. Edit the contents before publishing.' },
  { name: 'Steam Shower Generator', category: 'Steam Showers', kes: 65000, tags: ['Installation'], published: false, description: 'Steam generator for a steam shower enclosure. Edit the specification before publishing.' },
  { name: 'Brass Gate Valve', category: 'Valves', kes: 950, tags: ['Installation', 'Repair'], published: false, description: 'Brass gate valve for isolating a water line. Edit the size before publishing.' },
  { name: 'Under-Sink Water Filter', category: 'Water Filtration', kes: 6500, tags: ['Installation'], published: false, description: 'Under-sink drinking water filter. Edit the specification before publishing.' },
  { name: 'Electric Instant Shower Unit', category: 'Water Heaters', kes: 4800, tags: ['Installation', 'Emergency Service'], published: false, description: 'Electric instant shower for on-demand hot water. Professional installation is recommended. Edit the specification before publishing.' },
  { name: 'Toilet Cistern Fill Valve', category: 'Toilet Parts', kes: 750, tags: ['Repair'], published: false, description: 'Replacement fill valve for a toilet cistern. Edit the specification before publishing.' },
  { name: 'PTFE Tape and Pipe Sealant Kit', category: 'Accessories', kes: 450, tags: ['Installation', 'Repair'], published: false, description: 'PTFE thread seal tape and pipe sealant for leak-free joints. Edit the contents before publishing.' },
];

let created = 0;
[...LEGACY, ...DRAFTS].forEach((p, i) => {
  const slug = slugify(p.name);
  if (db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.slug, slug)).get()) return;
  const price = p.kes ?? usdToKesPlaceholder(p.usd ?? 0);
  const salePrice = p.saleUsd ? usdToKesPlaceholder(p.saleUsd) : null;
  const row = db
    .insert(schema.products)
    .values({
      slug, name: p.name, categoryId: catId.get(p.category) ?? null, description: p.description, price,
      salePrice: salePrice !== null && salePrice < price ? salePrice : null, sku: p.sku ?? `FP-${String(i + 1).padStart(4, '0')}`, stock: p.stock ?? 20,
      tags: p.tags, specs: (p.specs ?? []).map(([key, value]) => ({ key, value })), featured: p.featured ?? false, published: p.published,
      isNew: p.isNew ?? false, isPlaceholderPrice: true,
    })
    .returning({ id: schema.products.id })
    .get();
  (p.images ?? []).forEach((src, pos) => {
    db.insert(schema.productImages).values({ productId: row.id, src, alt: p.name, position: pos, isPrimary: pos === 0 }).run();
  });
  created++;
});
console.log(`Seeded ${CATEGORIES.length} categories and ${created} new products.`);
