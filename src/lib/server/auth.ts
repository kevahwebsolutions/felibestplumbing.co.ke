import 'server-only';
import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { clientIp, rateLimit, resetLimit } from './rate-limit';

export type AdminSession = { userId?: number; email?: string; mustChangePassword?: boolean };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET must be set to at least 32 characters');
  return 'development-only-session-secret-change-me-0123456789';
}

function options(): SessionOptions {
  return {
    password: secret(),
    cookieName: 'fp_admin',
    ttl: 60 * 60 * 8,
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1',
      path: '/',
    },
  };
}

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), options());
}

export async function currentAdmin(): Promise<{ id: number; email: string; mustChangePassword: boolean } | null> {
  const s = await getSession();
  if (!s.userId) return null;
  const user = getDb().select().from(schema.users).where(eq(schema.users.id, s.userId)).get();
  if (!user) return null;
  return { id: user.id, email: user.email, mustChangePassword: user.mustChangePassword };
}

/** Use at the top of every admin page, server action and admin route handler. */
export async function requireAdmin(opts: { allowPasswordChange?: boolean } = {}) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.mustChangePassword && !opts.allowPasswordChange) redirect('/admin/change-password');
  return admin;
}

/** For route handlers that must answer with a status code instead of redirecting. */
export async function adminOrNull() {
  const admin = await currentAdmin();
  if (!admin || admin.mustChangePassword) return null;
  return admin;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

let dummy: string | undefined;
function dummyHash(): string {
  return (dummy ??= bcrypt.hashSync('timing-equaliser', 12));
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function attemptLogin(email: string, password: string): Promise<LoginResult> {
  const h = await headers();
  const ip = clientIp(h);
  const key = `login:${ip}`;
  const emailKey = `login-email:${email}`;
  const ipLimit = rateLimit(key, 8, 15 * 60_000);
  const mailLimit = rateLimit(emailKey, 6, 15 * 60_000);
  if (!ipLimit.ok || !mailLimit.ok) {
    return { ok: false, error: `Too many attempts. Try again in ${Math.ceil(Math.max(ipLimit.retryAfter, mailLimit.retryAfter) / 60)} minutes.` };
  }
  const user = getDb().select().from(schema.users).where(eq(schema.users.email, email)).get();
  // Always run a hash comparison so timing does not reveal whether the account exists.
  const hash = user?.passwordHash ?? dummyHash();
  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) return { ok: false, error: 'Incorrect email or password.' };
  resetLimit(key);
  resetLimit(emailKey);
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.mustChangePassword = user.mustChangePassword;
  await session.save();
  return { ok: true };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
