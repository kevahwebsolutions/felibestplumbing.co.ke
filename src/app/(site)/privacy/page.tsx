import { PageHero } from '@/components/sections/page-hero';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Privacy Policy', description: 'How Felibest Plumbing collects, uses and protects your personal information, including our cookie-free analytics.', path: '/privacy' });

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Privacy', path: '/privacy' }]} title="Privacy policy" intro="We collect only what we need to help you, and we do not sell your data." />
      <section className="section-pad px-3 sm:px-5">
        <div className="container-fp mx-auto max-w-3xl !px-0">
          <div className="fp-card p-8 sm:p-12">
            <div className="prose-fp">
              <h2>What we collect</h2>
              <p>When you book a plumber, ask a question or place an order we collect the details you type in: your name, phone number, optional email, address or delivery area and the message you send. We use them only to respond to your request, deliver your order and keep a record of the work.</p>
              <h2>Analytics without cookies</h2>
              <p>We measure how the website is used with a first-party counter. It does not use cookies and does not store your IP address. A short-lived anonymous identifier is created from a salted hash that changes every day, so individual visitors cannot be followed from one day to the next. We record the pages you view, your device type, browser and the general source of your visit.</p>
              <h2>Your cart</h2>
              <p>Your shopping cart is stored in your own browser so that it is still there when you return. It is not sent to us until you place an order.</p>
              <h2>Who sees your information</h2>
              <p>Enquiry details may be forwarded to our team by email through the Web3Forms service. We do not share your details with anyone else except where needed to deliver an order or where the law requires it.</p>
              <h2>Your choices</h2>
              <p>You may ask us to correct or delete the information we hold about you by contacting {SITE.emails[0]} or calling {SITE.phone}.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
