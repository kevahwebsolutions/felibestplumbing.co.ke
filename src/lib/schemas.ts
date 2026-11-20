import { z } from 'zod';

/** Kenyan phone numbers: 07xx, 01xx, +2547xx, +2541xx, 2547xx with optional spaces or dashes. */
const phoneRegex = /^(?:\+?254|0)(?:7|1)\d{8}$/;
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ''))
  .refine((v) => phoneRegex.test(v), { message: 'Enter a valid Kenyan phone number, for example 0798 174 201' });

export const normalizePhone = (v: string): string => {
  const p = v.replace(/[\s-]/g, '');
  if (p.startsWith('+254')) return p;
  if (p.startsWith('254')) return `+${p}`;
  return `+254${p.slice(1)}`;
};

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === '' || z.email().safeParse(v).success, { message: 'Enter a valid email address' });

const text = (max: number) => z.string().trim().max(max);

/** Honeypot field: real users never fill it. */
const honeypot = z.string().max(0).optional().default('');

export const SERVICE_OPTIONS = [
  'Emergency plumbing',
  'Burst pipe repair',
  'Blocked toilet, sink or drain',
  'Leaking taps or mixers',
  'Low water pressure',
  'Water tank installation or repair',
  'Solar or electric water heater',
  'Shower installation or glass enclosure',
  'Bathroom renovation',
  'Piping and repiping',
  'Gutters or sump pump',
  'Fire and safety',
  'Interior design',
  'Consultation',
  'Something else',
] as const;

export const bookingSchema = z.object({
  kind: z.enum(['booking', 'enquiry', 'question']).default('booking'),
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: phoneSchema,
  email: optionalEmail.default(''),
  service: z.string().trim().min(1, 'Choose a service').max(120),
  preferredDate: text(40).default(''),
  message: text(2000).default(''),
  website: honeypot,
});
export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;

export const questionSchema = z.object({
  kind: z.literal('question').default('question'),
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: phoneSchema,
  email: optionalEmail.default(''),
  service: text(120).default('Question'),
  preferredDate: text(40).default(''),
  message: z.string().trim().min(5, 'Please type your question').max(2000),
  website: honeypot,
});

export const DELIVERY_AREAS = [
  'Nairobi CBD', 'Westlands', 'Kilimani', 'Lavington', 'Karen', 'Langata', 'South B and C', 'Embakasi',
  'Kasarani', 'Ruaka', 'Rongai', 'Thika Road', 'Kiambu Road', 'Athi River', 'Other (we will confirm)',
] as const;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: phoneSchema,
  email: optionalEmail.default(''),
  area: z.string().trim().min(1, 'Choose a delivery area').max(80),
  address: z.string().trim().min(5, 'Enter a delivery address or landmark').max(300),
  notes: text(500).default(''),
  paymentMethod: z.enum(['pay_on_delivery', 'whatsapp']),
  website: honeypot,
});
export type CheckoutInput = z.input<typeof checkoutSchema>;

export const orderLineSchema = z.object({
  productId: z.number().int().positive(),
  qty: z.number().int().min(1).max(99),
});
export const placeOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(orderLineSchema).min(1, 'Your cart is empty').max(50),
});

export const ORDER_STATUSES = ['new', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'] as const;
export const ENQUIRY_STATUSES = ['new', 'contacted', 'done'] as const;

export const productSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(2, 'Name is required').max(160),
    slug: z.string().trim().max(120).default(''),
    categoryId: z.number().int().positive().nullable(),
    description: z.string().trim().max(8000).default(''),
    price: z.number().int().min(0, 'Price cannot be negative').max(100_000_000),
    salePrice: z.number().int().min(0).max(100_000_000).nullable(),
    sku: z.string().trim().max(60).default(''),
    stock: z.number().int().min(0).max(100000),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
    specs: z.array(z.object({ key: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(200) })).max(30).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    isNew: z.boolean().default(false),
    isPlaceholderPrice: z.boolean().default(false),
    images: z
      .array(z.object({ src: z.string().min(1).max(300), alt: z.string().max(200).default('') }))
      .max(12)
      .default([]),
    primaryIndex: z.number().int().min(0).default(0),
  })
  .refine((v) => v.salePrice === null || v.salePrice < v.price, { message: 'Sale price must be lower than the price', path: ['salePrice'] });
export type ProductInput = z.input<typeof productSchema>;

export const categorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2, 'Name is required').max(80),
  slug: z.string().trim().max(80).default(''),
  description: z.string().trim().max(300).default(''),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email')),
  password: z.string().min(1, 'Enter your password').max(200),
});

export const passwordChangeSchema = z
  .object({
    current: z.string().min(1, 'Enter your current password').max(200),
    next: z
      .string()
      .min(10, 'Use at least 10 characters')
      .max(200)
      .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v), { message: 'Use upper case, lower case and a number' }),
    confirm: z.string().max(200),
  })
  .refine((v) => v.next === v.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export const offerSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(300).default(''),
  label: z.string().trim().max(40).default(''),
  active: z.boolean().default(true),
});

export const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(5).max(30),
  whatsappNumber: z.string().trim().regex(/^\d{10,15}$/, 'Digits only, with country code, for example 254798174201'),
  email: z.email(),
  address: z.string().trim().min(2).max(200),
  hours: z.string().trim().min(2).max(80),
  deliveryFee: z.number().int().min(0).max(100000),
  freeDeliveryThreshold: z.number().int().min(0).max(10_000_000),
  homeBanner: z.string().trim().max(200).default(''),
  offers: z.array(offerSchema).max(8).default([]),
});
export type SettingsInput = z.input<typeof settingsSchema>;
export type Settings = z.output<typeof settingsSchema>;

export const ANALYTICS_EVENTS = [
  'pageview', 'product_view', 'add_to_cart', 'checkout_start', 'order_placed', 'call_click', 'whatsapp_click', 'whatsapp_order_redirect', 'form_submit',
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export const trackSchema = z.object({
  type: z.enum(ANALYTICS_EVENTS),
  path: z.string().max(300).startsWith('/'),
  referrer: z.string().max(300).default(''),
  productId: z.number().int().positive().optional(),
  value: z.number().int().min(0).max(100_000_000).optional(),
  sid: z.string().regex(/^[a-z0-9]{8,32}$/).optional(),
});
export type TrackPayload = z.input<typeof trackSchema>;
