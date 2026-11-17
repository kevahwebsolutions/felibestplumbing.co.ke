import { trackSchema } from '@/lib/schemas';
import { classifyReferrer, isBot, parseUa, shouldIgnorePath, visitorHash } from '@/lib/analytics/ua';
import { eatParts } from '@/lib/analytics/aggregate';
import { recordEvent } from '@/lib/server/analytics';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { sameOrigin } from '@/lib/server/request';

export const dynamic = 'force-dynamic';

const empty = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return empty();
  const ua = req.headers.get('user-agent') ?? '';
  if (isBot(ua)) return empty();
  const ip = clientIp(req.headers);
  if (!rateLimit(`track:${ip}`, 120, 60_000).ok) return new Response(null, { status: 429 });

  let raw: unknown;
  try {
    // sendBeacon posts text/plain, so parse the body manually.
    raw = JSON.parse(await req.text());
  } catch {
    return empty();
  }
  const parsed = trackSchema.safeParse(raw);
  if (!parsed.success) return empty();
  const p = parsed.data;
  if (shouldIgnorePath(p.path)) return empty();

  const now = Math.floor(Date.now() / 1000);
  const { day } = eatParts(now);
  const salt = process.env.ANALYTICS_SALT ?? 'felibest-dev-salt';
  const visitorId = visitorHash(ip, ua, day, salt);
  const { device, browser, os } = parseUa(ua);
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  const country = (req.headers.get('cf-ipcountry') ?? '').toUpperCase().slice(0, 2);
  const country2 = country === 'XX' || country === 'T1' ? '' : country;

  recordEvent({
    visitorId,
    sessionId: p.sid ?? visitorId,
    type: p.type,
    path: p.path.split('?')[0]!,
    source: classifyReferrer(p.referrer, host),
    device,
    browser,
    os,
    country: country2,
    productId: p.productId ?? null,
    value: p.value ?? null,
  });
  return empty();
}
