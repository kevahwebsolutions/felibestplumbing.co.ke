import { UAParser } from 'ua-parser-js';
import { createHash } from 'node:crypto';

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|facebookexternalhit|preview|monitor|uptime|curl|wget|python-requests|httpclient|axios|go-http|java\/|scrapy|postman|playwright|puppeteer|phantom/i;

export function isBot(ua: string): boolean {
  return !ua || BOT_RE.test(ua);
}

export type Device = 'mobile' | 'tablet' | 'desktop';

export function parseUa(ua: string): { device: Device; browser: string; os: string } {
  const r = new UAParser(ua).getResult();
  const t = r.device.type;
  const device: Device = t === 'mobile' ? 'mobile' : t === 'tablet' ? 'tablet' : 'desktop';
  const browser = (r.browser.name ?? 'Other').replace('Mobile ', '').replace(/ Browser$/, '') || 'Other';
  const os = r.os.name ?? 'Other';
  return { device, browser, os };
}

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu)\./i;
const SOCIAL = /(^|\.)(facebook|instagram|x|twitter|t|tiktok|youtube|youtu|linkedin|pinterest|whatsapp|wa)\.(com|co|be|me|net)$/i;

/** Classify a referrer URL. Returns '' for internal or missing referrers (treated as direct). */
export function classifyReferrer(referrer: string, ownHost: string): string {
  if (!referrer) return '';
  let host = '';
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
  if (!host || host === ownHost.replace(/^www\./, '').split(':')[0]) return '';
  if (SEARCH.test(host)) return 'Search';
  if (SOCIAL.test(host)) return 'Social';
  return 'Referral';
}

/** Daily-rotating salted hash of IP and user agent. No raw IP is ever stored. */
export function visitorHash(ip: string, ua: string, day: string, salt: string): string {
  return createHash('sha256').update(`${salt}|${day}|${ip}|${ua}`).digest('hex').slice(0, 20);
}

export function shouldIgnorePath(path: string): boolean {
  return path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/media');
}
