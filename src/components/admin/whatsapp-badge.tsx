import { BellRing, BellOff } from 'lucide-react';

/** Owner notification state from the optional Cloud API notifier. */
export function WhatsAppBadge({ notifiedAt, error }: { notifiedAt: number | null; error: string | null }) {
  if (notifiedAt) {
    return (
      <span className="fp-pill fp-pill-green" title={`Sent to the owner WhatsApp on ${new Date(notifiedAt * 1000).toLocaleString('en-KE')}`}>
        <BellRing className="size-3.5" aria-hidden /> WhatsApp: sent
      </span>
    );
  }
  return (
    <span className="fp-pill" title={error ? `Not sent: ${error}` : 'Automatic sending is off or has not run. The customer sees the message on their own phone.'}>
      <BellOff className="size-3.5" aria-hidden /> WhatsApp: not sent
    </span>
  );
}
