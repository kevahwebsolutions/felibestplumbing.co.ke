import { NotFoundContent } from '@/components/sections/not-found-content';

export const metadata = { title: { absolute: 'Page not found | Felibest Plumbing' }, robots: { index: false, follow: true } };

export default function SiteNotFound() {
  return <NotFoundContent />;
}
