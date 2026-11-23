import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SERVICES } from '@/data/services';
import { POSTS } from '@/data/blog';

const SERVICE_SLUGS = new Set(SERVICES.map((s) => s.slug));
const POST_SLUGS = new Set(POSTS.map((p) => p.slug));

/**
 * Unknown service and blog slugs are rewritten to an unmatched path. Next.js then serves the full not-found page as
 * server-rendered HTML with a 404 status. A notFound() thrown inside a dynamic page only returns an empty HTML shell
 * (the not-found UI is then drawn by client JavaScript), which is a poor response for crawlers.
 */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split('/');
  const known = section === 'services' ? SERVICE_SLUGS : section === 'blog' ? POST_SLUGS : null;
  if (known && slug && !known.has(slug)) {
    const url = request.nextUrl.clone();
    url.pathname = '/page-not-found';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/services/:slug', '/blog/:slug'] };
