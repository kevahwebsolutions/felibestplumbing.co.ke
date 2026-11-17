import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { DEFAULT_OFFERS } from '@/data/content';
import { SITE } from '@/lib/site';
import { settingsSchema, type Settings } from '@/lib/schemas';

export const DEFAULT_SETTINGS: Settings = {
  businessName: SITE.name,
  phone: SITE.phone,
  whatsappNumber: SITE.whatsappNumber,
  email: SITE.emails[0],
  address: SITE.address.text,
  hours: SITE.hours,
  deliveryFee: 500,
  freeDeliveryThreshold: 15000,
  homeBanner: '',
  offers: DEFAULT_OFFERS.map((o) => ({ ...o })),
};

const KEY = 'site';

export function getSettings(): Settings {
  try {
    const row = getDb().select().from(schema.settings).where(eq(schema.settings.key, KEY)).get();
    if (!row) return DEFAULT_SETTINGS;
    const parsed = settingsSchema.safeParse({ ...DEFAULT_SETTINGS, ...JSON.parse(row.value) });
    return parsed.success ? parsed.data : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(next: Settings): void {
  const value = JSON.stringify(next);
  getDb()
    .insert(schema.settings)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value } })
    .run();
}

/** Subset that is safe to ship to the browser. */
export function publicSettings(s: Settings = getSettings()) {
  return {
    whatsappNumber: s.whatsappNumber,
    phone: s.phone,
    deliveryFee: s.deliveryFee,
    freeDeliveryThreshold: s.freeDeliveryThreshold,
  };
}
export type PublicSettings = ReturnType<typeof publicSettings>;
