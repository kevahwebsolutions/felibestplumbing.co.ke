import { PageHero } from '@/components/sections/page-hero';
import { CheckoutForm } from '@/components/shop/checkout-form';
import { buildMetadata } from '@/lib/seo';
import { getSettings, publicSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Checkout', description: 'Complete your Felibest Plumbing order. Pay on delivery or order via WhatsApp.', path: '/checkout', noindex: true });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Cart', path: '/cart' }, { name: 'Checkout', path: '/checkout' }]} title="Checkout" />
      <section className="section-pad px-3 sm:px-5"><div className="container-fp !px-0"><CheckoutForm settings={publicSettings(getSettings())} /></div></section>
    </>
  );
}
