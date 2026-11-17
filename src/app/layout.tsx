import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { SiteToaster } from '@/components/layout/providers';
import { JsonLd, localBusinessLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import './globals.css';

const barlow = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-barlow', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Felibest Plumbing Nairobi | 24/7 Emergency Plumber, Repairs and Installations', template: '%s | Felibest Plumbing' },
  description:
    'Felibest Plumbing: licensed plumbers in Nairobi, Kenya, available 24 hours a day. Emergency repairs, blocked drains, burst pipes, tanks, solar heaters, bathrooms and a plumbing shop.',
  applicationName: SITE.name,
  manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/icons/apple-touch-icon.png' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#06264a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" data-scroll-behavior="smooth" className={`${barlow.variable} ${inter.variable}`}>
      <body>
        {children}
        <SiteToaster />
        <JsonLd data={localBusinessLd()} />
      </body>
    </html>
  );
}
