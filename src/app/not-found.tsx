import { SiteChrome } from '@/components/layout/site-chrome';
import { NotFoundContent } from '@/components/sections/not-found-content';

export const metadata = { title: { absolute: 'Page not found | Felibest Plumbing' }, robots: { index: false, follow: true } };

/** Unknown URLs outside the site route group. Pages inside the group use (site)/not-found.tsx, which already has the site chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
