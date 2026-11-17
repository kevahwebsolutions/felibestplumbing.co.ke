import type { Metadata, Viewport } from 'next';
import { Inter, Nunito } from 'next/font/google';
import { ClayToaster } from '@/components/layout/providers';
import { JsonLd, localBusinessLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], weight: ['600', '700', '800', '900'], variable: '--font-nunito', display: 'swap' });
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

export const viewport: Viewport = { themeColor: '#0c4c93', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${nunito.variable} ${inter.variable}`}>
      <body>
        {children}
        <ClayToaster />
        <JsonLd data={localBusinessLd()} />
      </body>
    </html>
  );
}
