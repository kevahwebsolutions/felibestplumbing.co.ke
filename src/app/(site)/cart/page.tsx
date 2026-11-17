import { PageHero } from '@/components/sections/page-hero';
import { CartPage } from '@/components/shop/cart-page';
import { buildMetadata } from '@/lib/seo';
import { getSettings, publicSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Your Cart', description: 'Review the items in your Felibest Plumbing cart.', path: '/cart', noindex: true });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Cart', path: '/cart' }]} title="Your cart" />
      <section className="section-pad px-3 sm:px-5"><div className="container-clay !px-0"><CartPage settings={publicSettings(getSettings())} /></div></section>
    </>
  );
}
