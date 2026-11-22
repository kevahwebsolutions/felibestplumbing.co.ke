import { describe, expect, it, vi } from 'vitest';
import { cloudConfigFromEnv, getNotifiers, WhatsAppCloudNotifier, WhatsAppLinkNotifier, type NotifyOrder } from '@/lib/server/notifiers';

const ctx = { siteUrl: 'https://felibestplumbing.co.ke', whatsappNumber: '254798174201' };
const order: NotifyOrder = {
  ref: 'FP-ABC234', customerName: 'Jane Wanjiru', phone: '+254712345678', area: 'Kilimani', address: 'Argwings Kodhek Road', paymentMethod: 'whatsapp',
  items: [{ name: 'Milano modern shower', qty: 1, price: 25000, slug: 'milano-modern-shower' }], deliveryFee: 500, total: 25500,
  firstProductSlug: 'milano-modern-shower',
};
const cfg = { token: 'SECRET-TOKEN-123', phoneNumberId: '1234567890', ownerNumber: '+254 798 174 201', templateName: 'new_order_alert' };

const res = (status: number, body: unknown = {}) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

describe('WhatsAppLinkNotifier', () => {
  const n = new WhatsAppLinkNotifier();
  it('builds a wa.me link with the order ref and product URL', () => {
    const link = n.customerLink(order, ctx);
    expect(link.startsWith('https://wa.me/254798174201?text=')).toBe(true);
    const text = decodeURIComponent(link.split('text=')[1]!);
    expect(text).toContain('FP-ABC234');
    expect(text).toContain('https://felibestplumbing.co.ke/shop/milano-modern-shower');
  });
  it('does nothing server-side', async () => {
    expect(await n.notify()).toEqual({ status: 'skipped' });
  });
});

describe('WhatsAppCloudNotifier', () => {
  it('sends an image message with the product JPEG and a summary caption', async () => {
    const fetchMock = vi.fn().mockResolvedValue(res(200));
    const r = await new WhatsAppCloudNotifier(cfg, fetchMock).notify(order, ctx);
    expect(r).toEqual({ status: 'sent' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://graph.facebook.com/v21.0/1234567890/messages');
    expect(init.headers.Authorization).toBe('Bearer SECRET-TOKEN-123');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ messaging_product: 'whatsapp', to: '254798174201', type: 'image' });
    expect(body.image.link).toBe('https://felibestplumbing.co.ke/og/product/milano-modern-shower');
    expect(body.image.caption).toContain('FP-ABC234');
  });

  it('sends a text message when the order has no product image', async () => {
    const fetchMock = vi.fn().mockResolvedValue(res(200));
    await new WhatsAppCloudNotifier(cfg, fetchMock).notify({ ...order, firstProductSlug: null }, ctx);
    expect(JSON.parse(fetchMock.mock.calls[0]![1].body).type).toBe('text');
  });

  it('falls back to the template outside the 24 hour window', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(res(400, { error: { code: 131047 } }))
      .mockResolvedValueOnce(res(200));
    const r = await new WhatsAppCloudNotifier(cfg, fetchMock).notify(order, ctx);
    expect(r.status).toBe('sent');
    const second = JSON.parse(fetchMock.mock.calls[1]![1].body);
    expect(second.type).toBe('template');
    expect(second.template.name).toBe('new_order_alert');
    expect(second.template.components[0].parameters[0].text).not.toMatch(/\n/);
  });

  it('retries once on a server error and then succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(res(503)).mockResolvedValueOnce(res(200));
    expect((await new WhatsAppCloudNotifier(cfg, fetchMock).notify(order, ctx)).status).toBe('sent');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries once on a network error and reports failure without throwing', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('socket hang up Bearer SECRET-TOKEN-123'));
    const r = await new WhatsAppCloudNotifier(cfg, fetchMock).notify(order, ctx);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(r.status).toBe('failed');
    expect(JSON.stringify(r)).not.toContain('SECRET-TOKEN-123');
  });

  it('does not retry client errors and never leaks the token in the result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(res(401, { error: { code: 190 } }));
    const r = await new WhatsAppCloudNotifier(cfg, fetchMock).notify(order, ctx);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(r).toEqual({ status: 'failed', error: 'HTTP 401 code 190' });
    expect(JSON.stringify(r)).not.toContain('SECRET-TOKEN-123');
  });

  it('reports a closed window when no template is configured', async () => {
    const fetchMock = vi.fn().mockResolvedValue(res(400, { error: { code: 131047 } }));
    const r = await new WhatsAppCloudNotifier({ ...cfg, templateName: undefined }, fetchMock).notify(order, ctx);
    expect(r.status).toBe('failed');
    expect(r.error).toContain('24h window');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('configuration', () => {
  it('is disabled unless all three variables are set', () => {
    expect(cloudConfigFromEnv({})).toBeNull();
    expect(cloudConfigFromEnv({ WHATSAPP_CLOUD_TOKEN: 't', WHATSAPP_PHONE_NUMBER_ID: 'p' })).toBeNull();
    expect(getNotifiers({}).map((n) => n.id)).toEqual(['whatsapp-link']);
  });
  it('enables the cloud notifier when configured', () => {
    const env = { WHATSAPP_CLOUD_TOKEN: 't', WHATSAPP_PHONE_NUMBER_ID: 'p', WHATSAPP_OWNER_NUMBER: '254798174201', WHATSAPP_TEMPLATE_NAME: 'x' };
    expect(getNotifiers(env).map((n) => n.id)).toEqual(['whatsapp-link', 'whatsapp-cloud']);
    expect(cloudConfigFromEnv(env)?.templateName).toBe('x');
  });
});
