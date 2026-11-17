import fs from 'node:fs';

const redirects = JSON.parse(fs.readFileSync(new URL('./config/legacy-redirects.json', import.meta.url), 'utf8'));

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com",
  "frame-src https://www.google.com https://maps.google.com https://www.youtube.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.web3forms.com",
  "frame-ancestors 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['better-sqlite3', 'sharp'],
  images: { formats: ['image/avif', 'image/webp'], deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920], minimumCacheTTL: 31536000 },
  async redirects() {
    return redirects.map((r) => ({ source: r.source, destination: r.destination, permanent: true }));
  },
  async headers() {
    const security = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];
    return [
      { source: '/:path*', headers: security },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};
export default nextConfig;
