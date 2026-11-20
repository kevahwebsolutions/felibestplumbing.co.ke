import { track } from '@/lib/track';

export type PlaceBody = {
  customer: Record<string, unknown>;
  items: { productId: number; qty: number }[];
};

export type PlaceResult =
  | { ok: true; ref: string; total: number; redirectUrl: string | null; how: 'same-tab' | 'new-tab' | 'none' }
  | { ok: false; error: string; status: number };

/** Phones and tablets: WhatsApp is an app, so a same-tab redirect is the reliable way to hand over. */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return coarse || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/**
 * Desktop popup blockers only allow window.open during a user gesture, and the order is saved asynchronously.
 * So the tab is opened up front (call this synchronously inside the submit handler) and pointed at WhatsApp once saved.
 */
export function openPlaceholderTab(): Window | null {
  if (isMobileDevice()) return null;
  try {
    const w = window.open('', '_blank');
    if (w) w.document.title = 'Opening WhatsApp...';
    return w;
  } catch {
    return null;
  }
}

/**
 * Saves the order through /api/orders, then sends the customer to WhatsApp automatically.
 * Always lands the main tab on /order/[ref], which also offers a manual "Send order on WhatsApp" button.
 */
export async function placeOrderAndSend(body: PlaceBody, opts: { path: string; goto: (href: string) => void; placeholder: Window | null }): Promise<PlaceResult> {
  const closePlaceholder = () => { try { opts.placeholder?.close(); } catch { /* already closed */ } };
  let res: Response;
  try {
    res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    closePlaceholder();
    return { ok: false, error: 'We could not reach the server. Please check your connection or call us.', status: 0 };
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; ref?: string; total?: number; redirectUrl?: string | null };
  if (!res.ok || !data.ok || !data.ref) {
    closePlaceholder();
    return { ok: false, error: data.error ?? 'We could not place your order. Please try again or call us.', status: res.status };
  }
  const ref = data.ref;
  const total = data.total ?? 0;
  const url = data.redirectUrl ?? null;
  track('order_placed', { path: opts.path, value: total });

  let how: 'same-tab' | 'new-tab' | 'none' = 'none';
  const orderPath = `/order/${ref}`;
  if (url && opts.placeholder && !opts.placeholder.closed) {
    try { opts.placeholder.opener = null; } catch { /* cross-origin guard */ }
    opts.placeholder.location.href = url;
    how = 'new-tab';
  } else if (url && isMobileDevice()) {
    how = 'same-tab';
  } else {
    closePlaceholder();
  }
  if (url) track('whatsapp_order_redirect', { path: opts.path, value: total });

  if (how === 'same-tab' && url) {
    // Make "back" from WhatsApp return to the saved order, then hand over in this tab.
    window.history.replaceState(null, '', orderPath);
    window.location.assign(url);
  } else {
    opts.goto(orderPath);
  }
  return { ok: true, ref, total, redirectUrl: url, how };
}
