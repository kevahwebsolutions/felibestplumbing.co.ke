import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Felibest Plumbing',
    short_name: 'Felibest',
    description: 'Licensed plumbers in Nairobi, available 24 hours a day.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0c4c93',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
