import { whatsappLink } from '@/lib/site';

export type PaymentMethodId = 'pay_on_delivery' | 'whatsapp';

export type PaymentOrder = {
  ref: string;
  total: number;
  customerName: string;
  phone: string;
  lines: { name: string; qty: number; price: number }[];
};

export type PaymentInitiation = {
  status: 'pending' | 'paid' | 'failed';
  /** Message shown on the confirmation page. */
  instructions: string;
  /** Optional URL to send the customer to (a WhatsApp chat or a gateway page). */
  redirectUrl?: string;
};

/**
 * Every payment method implements this interface. To add M-Pesa Daraja STK push later, implement
 * `initiate` to call the STK push endpoint, return status 'pending', and add a callback route that
 * marks the order as paid. Nothing else in checkout has to change.
 */
export interface PaymentProvider {
  id: string;
  label: string;
  description: string;
  initiate(order: PaymentOrder, ctx: { whatsappNumber: string }): Promise<PaymentInitiation>;
}

export class PayOnDeliveryProvider implements PaymentProvider {
  id = 'pay_on_delivery';
  label = 'Pay on delivery';
  description = 'Pay in cash or by M-Pesa when your order arrives.';
  async initiate(order: PaymentOrder): Promise<PaymentInitiation> {
    return {
      status: 'pending',
      instructions: `We will call ${order.customerName} on ${order.phone} to confirm your order. Pay in cash or by M-Pesa when it is delivered.`,
    };
  }
}

export function orderWhatsappMessage(order: PaymentOrder): string {
  const lines = order.lines.map((l) => `- ${l.qty} x ${l.name} (KES ${(l.price * l.qty).toLocaleString('en-KE')})`).join('\n');
  return `Hello Felibest Plumbing, I would like to confirm order ${order.ref}.\n${lines}\nTotal: KES ${order.total.toLocaleString('en-KE')}\nName: ${order.customerName}\nPhone: ${order.phone}`;
}

export class WhatsAppOrderProvider implements PaymentProvider {
  id = 'whatsapp';
  label = 'Order via WhatsApp';
  description = 'Send your cart to us on WhatsApp and we will confirm payment and delivery.';
  async initiate(order: PaymentOrder, ctx: { whatsappNumber: string }): Promise<PaymentInitiation> {
    return {
      status: 'pending',
      instructions: 'Send the prefilled message on WhatsApp and we will confirm your order, payment and delivery time.',
      redirectUrl: whatsappLink(orderWhatsappMessage(order), ctx.whatsappNumber),
    };
  }
}

const providers: Record<string, PaymentProvider> = {
  pay_on_delivery: new PayOnDeliveryProvider(),
  whatsapp: new WhatsAppOrderProvider(),
};

export function getPaymentProvider(id: string): PaymentProvider {
  const p = providers[id];
  if (!p) throw new Error(`Unknown payment method: ${id}`);
  return p;
}

export function listPaymentProviders(): PaymentProvider[] {
  return Object.values(providers);
}
