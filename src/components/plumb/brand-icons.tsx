import * as React from 'react';

type P = { className?: string };
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const FacebookIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
  </svg>
);
export const InstagramIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
export const XIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 4l16 16M20 4 4 20" />
  </svg>
);
export const TikTokIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.6 2 4.2 5 4.5" />
  </svg>
);
export const YouTubeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
  </svg>
);

export const SOCIAL_ICONS: Record<string, (p: P) => React.ReactElement> = {
  facebook: FacebookIcon, instagram: InstagramIcon, x: XIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
};
