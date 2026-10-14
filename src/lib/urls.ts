import type { Episode } from './feed';

// Build a site-relative URL that respects the configured base path.
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

// Absolute URL for canonical tags, Open Graph, and structured data.
export function absoluteUrl(path = '/'): string {
  return new URL(url(path), import.meta.env.SITE).href;
}

export const episodePath = (ep: Pick<Episode, 'slug'>) => `/episodes/${ep.slug}/`;

// Only the real domain should be indexed. Preview builds (github.io) get noindex.
export const isProductionSite = new URL(import.meta.env.SITE).hostname === 'talkingaboutbirds.com';
