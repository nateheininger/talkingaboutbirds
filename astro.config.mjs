// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH are set by the GitHub Actions workflow. Until the custom
// domain is pointed at GitHub Pages, the site is served from
// https://nateheininger.github.io/talkingaboutbirds/ and builds with BASE_PATH=/talkingaboutbirds.
const site = process.env.SITE_URL || 'https://talkingaboutbirds.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Short links like /241/ just redirect to the full episode page; keep them out of the sitemap.
      filter: (page) => !/\/\d+\/$/.test(new URL(page).pathname),
    }),
  ],
});
