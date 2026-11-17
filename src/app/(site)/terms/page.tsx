import { PageHero } from '@/components/sections/page-hero';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Terms of Service', description: 'Terms for using the Felibest Plumbing website, booking services and buying from the plumbing shop.', path: '/terms' });

export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Terms', path: '/terms' }]} title="Terms of service" intro="The plain-language terms for our website, services and shop." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-clay mx-auto max-w-3xl !px-0">
          <div className="clay-card p-8 sm:p-12">
            <div className="prose-clay">
              <h2>Services and pricing</h2>
              <p>We give you a price before work begins and you approve it before we start. Prices shown on the website are guides. If the scope of a job changes, we will explain why and agree any change with you first.</p>
              <h2>Our guarantees</h2>
              <p>We offer an on-time guarantee and a 100% satisfaction guarantee on our workmanship. If you are not satisfied, contact us on {SITE.phone} and we will put it right.</p>
              <h2>Shop orders</h2>
              <p>Prices are in Kenya shillings. Orders are confirmed by phone or WhatsApp. You can pay on delivery in cash or by M-Pesa, or confirm your order through WhatsApp. Delivery fees and the free-delivery threshold are shown at checkout. Stock is limited and an order is not final until we confirm it.</p>
              <h2>Using the website</h2>
              <p>Content on this website is provided for general information. Plumbing advice in our guides is general in nature, and electrical or gas work should always be done by a qualified professional.</p>
              <h2>Contact</h2>
              <p>Questions about these terms: {SITE.emails[0]}.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
