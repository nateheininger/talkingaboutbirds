// A plain-text summary of the show for AI assistants and answer engines
// (ChatGPT, Perplexity, Claude, etc.). See https://llmstxt.org
import type { APIRoute } from 'astro';
import { getShow } from '../lib/feed';
import { SITE, HOSTS, LISTEN } from '../site.config';
import { absoluteUrl, episodePath } from '../lib/urls';

export const GET: APIRoute = async () => {
  const show = await getShow();
  const lines = [
    `# ${SITE.fullName}`,
    '',
    `> ${SITE.description}`,
    '',
    `Hosts: ${HOSTS.map((h) => h.name).join(', ')}. ${SITE.schedule}. ${show.episodes.length} episodes since ${show.episodes.at(-1)!.pubDate.getFullYear()}.`,
    '',
    '## Listen',
    ...LISTEN.map((l) => `- [${l.name}](${l.url})`),
    '',
    '## Episodes',
    ...show.episodes.map((ep) => `- [${ep.number}: ${ep.title}](${absoluteUrl(episodePath(ep))}): ${ep.summary}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
