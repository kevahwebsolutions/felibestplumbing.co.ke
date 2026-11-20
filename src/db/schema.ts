import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

const now = () => Math.floor(Date.now() / 1000);

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  mustChangePassword: integer('must_change_password', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull().$defaultFn(now),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const products = sqliteTable(
  'products',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    description: text('description').notNull().default(''),
    price: integer('price').notNull(),
    salePrice: integer('sale_price'),
    sku: text('sku').notNull().default(''),
    stock: integer('stock').notNull().default(0),
    tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
    specs: text('specs', { mode: 'json' }).$type<{ key: string; value: string }[]>().notNull().default([]),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
    isPlaceholderPrice: integer('is_placeholder_price', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at').notNull().$defaultFn(now),
    updatedAt: integer('updated_at').notNull().$defaultFn(now),
  },
  (t) => [index('products_category_idx').on(t.categoryId), index('products_published_idx').on(t.published)],
);

export const productImages = sqliteTable(
  'product_images',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    /** Either a public path such as /images/product/x.webp or an upload file name served from /media/<name>. */
    src: text('src').notNull(),
    alt: text('alt').notNull().default(''),
    position: integer('position').notNull().default(0),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  },
  (t) => [index('product_images_product_idx').on(t.productId)],
);

export const orders = sqliteTable(
  'orders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ref: text('ref').notNull().unique(),
    customerName: text('customer_name').notNull(),
    phone: text('phone').notNull(),
    email: text('email').notNull().default(''),
    area: text('area').notNull(),
    address: text('address').notNull(),
    notes: text('notes').notNull().default(''),
    paymentMethod: text('payment_method', { enum: ['pay_on_delivery', 'whatsapp'] }).notNull(),
    status: text('status', { enum: ['new', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'] }).notNull().default('new'),
    subtotal: integer('subtotal').notNull(),
    deliveryFee: integer('delivery_fee').notNull().default(0),
    total: integer('total').notNull(),
    internalNotes: text('internal_notes').notNull().default(''),
    /** Set when the Cloud API notifier delivered the order to the owner's WhatsApp. */
    whatsappNotifiedAt: integer('whatsapp_notified_at'),
    /** Short non-sensitive reason when the Cloud API notifier failed. */
    whatsappNotifyError: text('whatsapp_notify_error'),
    createdAt: integer('created_at').notNull().$defaultFn(now),
  },
  (t) => [index('orders_status_idx').on(t.status), index('orders_created_idx').on(t.createdAt)],
);

export const orderItems = sqliteTable(
  'order_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id'),
    name: text('name').notNull(),
    sku: text('sku').notNull().default(''),
    price: integer('price').notNull(),
    qty: integer('qty').notNull(),
  },
  (t) => [index('order_items_order_idx').on(t.orderId)],
);

export const enquiries = sqliteTable(
  'enquiries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kind: text('kind', { enum: ['booking', 'enquiry', 'question', 'review'] }).notNull().default('enquiry'),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email').notNull().default(''),
    service: text('service').notNull().default(''),
    preferredDate: text('preferred_date').notNull().default(''),
    message: text('message').notNull().default(''),
    status: text('status', { enum: ['new', 'contacted', 'done'] }).notNull().default('new'),
    notes: text('notes').notNull().default(''),
    forwarded: integer('forwarded', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at').notNull().$defaultFn(now),
  },
  (t) => [index('enquiries_status_idx').on(t.status), index('enquiries_created_idx').on(t.createdAt)],
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const events = sqliteTable(
  'events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ts: integer('ts').notNull(),
    day: text('day').notNull(),
    hour: integer('hour').notNull(),
    weekday: integer('weekday').notNull(),
    visitorId: text('visitor_id').notNull(),
    sessionId: text('session_id').notNull(),
    type: text('type').notNull(),
    path: text('path').notNull().default(''),
    source: text('source').notNull().default('direct'),
    device: text('device').notNull().default('desktop'),
    browser: text('browser').notNull().default('Other'),
    os: text('os').notNull().default('Other'),
    country: text('country').notNull().default(''),
    productId: integer('product_id'),
    value: integer('value'),
  },
  (t) => [
    index('events_ts_idx').on(t.ts),
    index('events_day_type_idx').on(t.day, t.type),
    index('events_type_product_idx').on(t.type, t.productId),
    index('events_session_idx').on(t.sessionId),
  ],
);

export const dailyStats = sqliteTable(
  'daily_stats',
  {
    day: text('day').primaryKey(),
    visitors: integer('visitors').notNull().default(0),
    sessions: integer('sessions').notNull().default(0),
    pageviews: integer('pageviews').notNull().default(0),
    bounces: integer('bounces').notNull().default(0),
    orders: integer('orders').notNull().default(0),
    revenue: integer('revenue').notNull().default(0),
    calls: integer('calls').notNull().default(0),
    whatsapp: integer('whatsapp').notNull().default(0),
    forms: integer('forms').notNull().default(0),
  },
  (t) => [uniqueIndex('daily_stats_day_idx').on(t.day)],
);
