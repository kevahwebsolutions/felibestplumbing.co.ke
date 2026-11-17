import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const kes = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', currencyDisplay: 'code', maximumFractionDigits: 0 });
export function formatKES(amount: number): string {
  return kes.format(Math.round(amount)).replace(/ /g, ' ');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Convert a legacy USD price to KES at a fixed rate, rounded to the nearest 50. */
export function usdToKesPlaceholder(usd: number, rate = 130): number {
  return Math.round((usd * rate) / 50) * 50;
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://felibestplumbing.co.ke').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
