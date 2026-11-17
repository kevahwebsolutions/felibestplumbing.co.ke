export const SITE = {
  name: 'Felibest Plumbing',
  legalName: 'Felibest Plumbing',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://felibestplumbing.co.ke').replace(/\/$/, ''),
  tagline: 'Fast, honest plumbing in Nairobi, 24 hours a day',
  phone: '+254 798 174 201',
  phoneHref: 'tel:+254798174201',
  whatsappNumber: '254798174201',
  emails: ['felibestplumbing@gmail.com', 'info@felibestplumbing.co.ke'],
  address: { locality: 'Nairobi', country: 'KE', text: 'Nairobi, Kenya' },
  hours: '24 hours, 7 days a week',
  founder: { name: 'Felix Odongo', short: 'Mr. Felix', role: 'CEO and Founder' },
  established: 2020,
  socials: [
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/FelibestPlumbing/' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/felibest_plumbing' },
    { id: 'x', label: 'X', href: 'https://x.com/Felibest_' },
    { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@felibestplumbing' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@felibestplumbing' },
  ],
  stats: { experienceYears: 4, installs: 1300, repairs: 600, satisfaction: 100 },
  creditName: 'Kevah Web Solutions',
} as const;

export const whatsappLink = (message = 'Hello Felibest Plumbing, I need help with a plumbing job.', number: string = SITE.whatsappNumber) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
] as const;
