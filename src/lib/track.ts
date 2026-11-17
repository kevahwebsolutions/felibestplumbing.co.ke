import type { AnalyticsEvent } from '@/lib/schemas';

function sessionId(): string {
  try {
    let sid = sessionStorage.getItem('fp_sid');
    if (!sid) {
      sid = Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 18);
      sessionStorage.setItem('fp_sid', sid);
    }
    return sid;
  } catch {
    return '';
  }
}

export function track(type: AnalyticsEvent, extra: { productId?: number; value?: number; path?: string } = {}): void {
  if (typeof window === 'undefined') return;
  const path = extra.path ?? window.location.pathname;
  if (path.startsWith('/admin')) return;
  let referrer = '';
  try {
    if (type === 'pageview' && !sessionStorage.getItem('fp_ref_sent')) {
      referrer = document.referrer;
      sessionStorage.setItem('fp_ref_sent', '1');
    }
  } catch {
    /* storage unavailable: skip referrer */
  }
  const sid = sessionId();
  const payload = JSON.stringify({ type, path, referrer, productId: extra.productId, value: extra.value, sid: sid || undefined });
  try {
    if (navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'text/plain' }))) return;
  } catch {
    /* fall through to fetch */
  }
  void fetch('/api/track', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => undefined);
}
