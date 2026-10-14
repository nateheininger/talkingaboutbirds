import type { APIRoute } from 'astro';
import { absoluteUrl, isProductionSite } from '../lib/urls';

export const GET: APIRoute = () => {
  const body = isProductionSite
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml')}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
