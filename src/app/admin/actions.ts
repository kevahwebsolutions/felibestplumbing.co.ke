'use server';

import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb, schema } from '@/db';
import {
  categorySchema, ENQUIRY_STATUSES, loginSchema, ORDER_STATUSES, passwordChangeSchema, productSchema, settingsSchema,
} from '@/lib/schemas';
import { slugify } from '@/lib/utils';
import { attemptLogin, currentAdmin, hashPassword, logout, requireAdmin } from '@/lib/server/auth';
import { saveSettings } from '@/lib/server/settings';
import { deleteUpload, storeImage, UploadError } from '@/lib/server/uploads';

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[i.path.join('.') || 'form'] ??= i.message;
  return out;
}

// ---------- Authentication ----------
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details', fieldErrors: fieldErrors(parsed.error) };
  const result = await attemptLogin(parsed.data.email, parsed.data.password);
  if (!result.ok) return { error: result.error };
  redirect('/admin');
}

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin({ allowPasswordChange: true });
  const parsed = passwordChangeSchema.safeParse({ current: formData.get('current'), next: formData.get('next'), confirm: formData.get('confirm') });
  if (!parsed.success) return { error: 'Please fix the highlighted fields', fieldErrors: fieldErrors(parsed.error) };
  const db = getDb();
  const user = db.select().from(schema.users).where(eq(schema.users.id, admin.id)).get();
  if (!user || !(await bcrypt.compare(parsed.data.current, user.passwordHash))) return { error: 'Your current password is incorrect', fieldErrors: { current: 'Incorrect password' } };
  if (parsed.data.current === parsed.data.next) return { error: 'Choose a new password that differs from the current one', fieldErrors: { next: 'Must differ from the current password' } };
  db.update(schema.users).set({ passwordHash: await hashPassword(parsed.data.next), mustChangePassword: false }).where(eq(schema.users.id, admin.id)).run();
  redirect('/admin');
}

// ---------- Products ----------
export async function uploadImageAction(formData: FormData): Promise<{ ok: boolean; name?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file received' };
  try {
    return { ok: true, name: await storeImage(file) };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, error: e.message };
    return { ok: false, error: 'Upload failed' };
  }
}

function uniqueSlug(base: string, ignoreId?: number): string {
  const db = getDb();
  let slug = slugify(base) || 'product';
  let n = 1;
  for (;;) {
    const hit = db.select({ id: schema.products.id }).from(schema.products).where(ignoreId ? and(eq(schema.products.slug, slug), ne(schema.products.id, ignoreId)) : eq(schema.products.slug, slug)).get();
    if (!hit) return slug;
    slug = `${slugify(base)}-${++n}`;
  }
}

export async function saveProductAction(input: unknown): Promise<ActionState & { id?: number }> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid product', fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const db = getDb();
  const slug = uniqueSlug(d.slug || d.name, d.id);
  const values = {
    slug, name: d.name, categoryId: d.categoryId, description: d.description, price: d.price, salePrice: d.salePrice, sku: d.sku,
    stock: d.stock, tags: d.tags, specs: d.specs, featured: d.featured, published: d.published, isNew: d.isNew,
    isPlaceholderPrice: d.isPlaceholderPrice, updatedAt: Math.floor(Date.now() / 1000),
  };
  let id = d.id;
  const previous: string[] = [];
  if (id) {
    previous.push(...db.select({ src: schema.productImages.src }).from(schema.productImages).where(eq(schema.productImages.productId, id)).all().map((r) => r.src));
    db.update(schema.products).set(values).where(eq(schema.products.id, id)).run();
    db.delete(schema.productImages).where(eq(schema.productImages.productId, id)).run();
  } else {
    id = db.insert(schema.products).values(values).returning({ id: schema.products.id }).get().id;
  }
  d.images.forEach((im, i) => {
    db.insert(schema.productImages).values({ productId: id!, src: im.src, alt: im.alt || d.name, position: i, isPrimary: i === Math.min(d.primaryIndex, d.images.length - 1) }).run();
  });
  const keep = new Set(d.images.map((i) => i.src));
  await Promise.all(previous.filter((s) => !s.startsWith('/') && !keep.has(s)).map(deleteUpload));
  revalidatePath('/shop');
  revalidatePath('/admin/products');
  return { ok: true, id };
}

const idsSchema = z.array(z.number().int().positive()).min(1).max(500);

export async function bulkProductsAction(action: 'publish' | 'unpublish' | 'delete', ids: number[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return { error: 'Select at least one product' };
  const db = getDb();
  if (action === 'delete') {
    const files = db.select({ src: schema.productImages.src }).from(schema.productImages).where(inArray(schema.productImages.productId, parsed.data)).all();
    db.delete(schema.products).where(inArray(schema.products.id, parsed.data)).run();
    await Promise.all(files.filter((f) => !f.src.startsWith('/')).map((f) => deleteUpload(f.src)));
  } else {
    db.update(schema.products).set({ published: action === 'publish', updatedAt: Math.floor(Date.now() / 1000) }).where(inArray(schema.products.id, parsed.data)).run();
  }
  revalidatePath('/shop');
  revalidatePath('/admin/products');
  return { ok: true };
}

export async function confirmPricesAction(ids: number[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return { error: 'Select at least one product' };
  getDb().update(schema.products).set({ isPlaceholderPrice: false }).where(inArray(schema.products.id, parsed.data)).run();
  revalidatePath('/admin');
  revalidatePath('/admin/products');
  return { ok: true };
}

// ---------- Categories ----------
export async function saveCategoryAction(input: unknown): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const db = getDb();
  const slug = slugify(d.slug || d.name);
  const clash = db.select({ id: schema.categories.id }).from(schema.categories).where(d.id ? and(eq(schema.categories.slug, slug), ne(schema.categories.id, d.id)) : eq(schema.categories.slug, slug)).get();
  if (clash) return { error: 'A category with that name already exists', fieldErrors: { name: 'Already exists' } };
  if (d.id) db.update(schema.categories).set({ name: d.name, slug, description: d.description, sortOrder: d.sortOrder }).where(eq(schema.categories.id, d.id)).run();
  else db.insert(schema.categories).values({ name: d.name, slug, description: d.description, sortOrder: d.sortOrder }).run();
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { ok: true };
}

export async function deleteCategoryAction(id: number): Promise<ActionState> {
  await requireAdmin();
  if (!z.number().int().positive().safeParse(id).success) return { error: 'Invalid category' };
  getDb().delete(schema.categories).where(eq(schema.categories.id, id)).run();
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { ok: true };
}

// ---------- Orders and enquiries ----------
export async function updateOrderAction(input: { id: number; status?: string; internalNotes?: string }): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.number().int().positive(), status: z.enum(ORDER_STATUSES).optional(), internalNotes: z.string().max(2000).optional() }).safeParse(input);
  if (!parsed.success) return { error: 'Invalid update' };
  const { id, status, internalNotes } = parsed.data;
  const db = getDb();
  const current = db.select().from(schema.orders).where(eq(schema.orders.id, id)).get();
  if (!current) return { error: 'Order not found' };
  const set: Partial<typeof schema.orders.$inferInsert> = {};
  if (status) set.status = status;
  if (internalNotes !== undefined) set.internalNotes = internalNotes;
  db.transaction((tx) => {
    tx.update(schema.orders).set(set).where(eq(schema.orders.id, id)).run();
    // Return stock when an order is cancelled, and take it again if a cancellation is undone.
    if (status && status !== current.status && (status === 'cancelled' || current.status === 'cancelled')) {
      const sign = status === 'cancelled' ? 1 : -1;
      for (const it of tx.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id)).all()) {
        if (it.productId) tx.update(schema.products).set({ stock: sql`MAX(0, ${schema.products.stock} + ${sign * it.qty})` }).where(eq(schema.products.id, it.productId)).run();
      }
    }
  });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true };
}

export async function updateEnquiryAction(input: { id: number; status?: string; notes?: string }): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.number().int().positive(), status: z.enum(ENQUIRY_STATUSES).optional(), notes: z.string().max(2000).optional() }).safeParse(input);
  if (!parsed.success) return { error: 'Invalid update' };
  const { id, ...rest } = parsed.data;
  const set: Partial<typeof schema.enquiries.$inferInsert> = {};
  if (rest.status) set.status = rest.status;
  if (rest.notes !== undefined) set.notes = rest.notes;
  getDb().update(schema.enquiries).set(set).where(eq(schema.enquiries.id, id)).run();
  revalidatePath('/admin/enquiries');
  return { ok: true };
}

// ---------- Settings ----------
export async function saveSettingsAction(input: unknown): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid settings', fieldErrors: fieldErrors(parsed.error) };
  saveSettings(parsed.data);
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function whoAmI() {
  return currentAdmin();
}
