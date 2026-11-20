import { buildOrderMessage, buildOwnerSummary, buildWhatsAppUrl, type MessageOrder } from '@/lib/whatsapp-message';

export type NotifyResult = { status: 'skipped' | 'sent' | 'failed'; error?: string };

/** Everything a notifier needs about a saved order. */
export type NotifyOrder = MessageOrder & {
  /** Slug and optional image of the first product, for the owner's image message. */
  firstProductSlug?: string | null;
  firstProductImageUrl?: string | null;
};

export type NotifyContext = { siteUrl: string; whatsappNumber: string };

/**
 * Two ways to tell the owner about an order.
 * `customerLink` is the wa.me link the customer's own browser opens (works for every shop, no API account).
 * `notify` runs on the server after the order is saved (Cloud API only).
 */
export interface OrderNotifier {
  id: string;
  customerLink(order: NotifyOrder, ctx: NotifyContext): string | null;
  notify(order: NotifyOrder, ctx: NotifyContext): Promise<NotifyResult>;
}

/** Default: the customer sends the prefilled message themselves. Nothing happens server-side. */
export class WhatsAppLinkNotifier implements OrderNotifier {
  id = 'whatsapp-link';
  customerLink(order: NotifyOrder, ctx: NotifyContext): string {
    return buildWhatsAppUrl(ctx.whatsappNumber, buildOrderMessage(order, { siteUrl: ctx.siteUrl, whatsappNumber: ctx.whatsappNumber }));
  }
  async notify(): Promise<NotifyResult> {
    return { status: 'skipped' };
  }
}

export type CloudConfig = {
  token: string;
  phoneNumberId: string;
  ownerNumber: string;
  templateName?: string;
  templateLanguage?: string;
  apiVersion?: string;
};

type FetchLike = (input: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

/** Error codes where Meta says the free-form message is not allowed (outside the 24 hour window). */
const WINDOW_CLOSED = new Set([131047, 131051, 470]);

/**
 * Meta WhatsApp Cloud API notifier: sends the owner an image message (first product) with the order
 * summary as the caption, and falls back to an approved template outside the 24 hour window.
 * The token is only ever placed in the Authorization header. It is never logged or returned.
 */
export class WhatsAppCloudNotifier implements OrderNotifier {
  id = 'whatsapp-cloud';
  private link = new WhatsAppLinkNotifier();
  constructor(private cfg: CloudConfig, private fetchImpl: FetchLike = fetch as unknown as FetchLike) {}

  customerLink(order: NotifyOrder, ctx: NotifyContext): string | null {
    return this.link.customerLink(order, ctx);
  }

  private async post(payload: Record<string, unknown>): Promise<{ ok: boolean; status: number; code?: number; retryable: boolean }> {
    const { token, phoneNumberId, apiVersion = 'v21.0' } = this.cfg;
    try {
      const res = await this.fetchImpl(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: this.cfg.ownerNumber.replace(/\D/g, ''), ...payload }),
      });
      if (res.ok) return { ok: true, status: res.status, retryable: false };
      const body = (await res.json().catch(() => ({}))) as { error?: { code?: number } };
      return { ok: false, status: res.status, code: body.error?.code, retryable: res.status >= 500 || res.status === 429 };
    } catch {
      return { ok: false, status: 0, retryable: true };
    }
  }

  /** One retry for network errors and 5xx or rate-limit responses. */
  private async postWithRetry(payload: Record<string, unknown>) {
    const first = await this.post(payload);
    if (first.ok || !first.retryable) return first;
    return this.post(payload);
  }

  async notify(order: NotifyOrder, ctx: NotifyContext): Promise<NotifyResult> {
    const summary = buildOwnerSummary(order, ctx.siteUrl);
    const imageUrl = order.firstProductSlug
      ? `${ctx.siteUrl}/og/product/${encodeURIComponent(order.firstProductSlug)}`
      : order.firstProductImageUrl ?? null;

    let result;
    if (imageUrl) {
      result = await this.postWithRetry({ type: 'image', image: { link: imageUrl, caption: summary.slice(0, 1000) } });
    } else {
      result = await this.postWithRetry({ type: 'text', text: { preview_url: true, body: summary.slice(0, 4000) } });
    }
    if (result.ok) return { status: 'sent' };

    const closed = result.code !== undefined && WINDOW_CLOSED.has(result.code);
    if (closed && this.cfg.templateName) {
      const tpl = await this.postWithRetry({
        type: 'template',
        template: {
          name: this.cfg.templateName,
          language: { code: this.cfg.templateLanguage ?? 'en' },
          // Template parameters may not contain line breaks or runs of spaces.
          components: [{ type: 'body', parameters: [{ type: 'text', text: summary.replace(/\s+/g, ' ').slice(0, 900) }] }],
        },
      });
      if (tpl.ok) return { status: 'sent' };
      return { status: 'failed', error: `template HTTP ${tpl.status}${tpl.code ? ` code ${tpl.code}` : ''}` };
    }
    return { status: 'failed', error: `HTTP ${result.status}${result.code ? ` code ${result.code}` : ''}${closed ? ' (24h window closed, no template set)' : ''}` };
  }
}

/** Cloud notifier is enabled only when all three variables are present. */
export function cloudConfigFromEnv(env: Record<string, string | undefined> = process.env): CloudConfig | null {
  const token = env.WHATSAPP_CLOUD_TOKEN?.trim();
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const ownerNumber = env.WHATSAPP_OWNER_NUMBER?.trim();
  if (!token || !phoneNumberId || !ownerNumber) return null;
  return { token, phoneNumberId, ownerNumber, templateName: env.WHATSAPP_TEMPLATE_NAME?.trim() || undefined, templateLanguage: env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || undefined };
}

export function getNotifiers(env: Record<string, string | undefined> = process.env): OrderNotifier[] {
  const cfg = cloudConfigFromEnv(env);
  return cfg ? [new WhatsAppLinkNotifier(), new WhatsAppCloudNotifier(cfg)] : [new WhatsAppLinkNotifier()];
}
