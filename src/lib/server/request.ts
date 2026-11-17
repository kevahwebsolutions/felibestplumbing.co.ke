import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from './rate-limit';

/** Reject cross-site POSTs. Browsers always send Origin on cross-origin POST requests. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients and same-origin GET-like requests
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function json(data: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}

export function guard(req: Request, bucket: string, limit: number, windowMs: number): NextResponse | null {
  if (!sameOrigin(req)) return json({ ok: false, error: 'Cross-site request blocked' }, 403);
  const r = rateLimit(`${bucket}:${clientIp(req.headers)}`, limit, windowMs);
  if (!r.ok) return json({ ok: false, error: 'Too many requests. Please try again shortly.' }, 429, { 'Retry-After': String(r.retryAfter) });
  return null;
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const esc = (v: string | number | null | undefined) => {
    let s = v == null ? '' : String(v);
    // Neutralise spreadsheet formula injection.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
}
