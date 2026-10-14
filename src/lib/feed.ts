// Loads the podcast RSS feed at build time and turns it into Episode objects.
// Every page on the site is generated from this, so a rebuild picks up new episodes.
import { XMLParser } from 'fast-xml-parser';
import { SITE } from '../site.config';
import { loadTranscript, type Transcript } from './transcripts';
import { slugify, stripHtml, excerpt } from './text';

export interface Episode {
  number: number;
  title: string;
  slug: string; // e.g. "241-spooky-2-more-2026-cardinal-autopsy-the-gourd-lords"
  guid: string;
  pubDate: Date;
  durationSeconds: number;
  audioUrl: string;
  audioBytes: number;
  shareUrl: string;
  descriptionHtml: string;
  summary: string; // plain-text, ~155 chars, used for meta descriptions
  youtubeUrl?: string;
  transcriptUrl?: string;
  transcript?: Transcript;
  bskyPostUri?: string;
}

export interface Show {
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  episodes: Episode[]; // newest first
}

let cached: Promise<Show> | undefined;

export function getShow(): Promise<Show> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Show> {
  const res = await fetch(SITE.feedUrl, { headers: { 'user-agent': 'talkingaboutbirds.com site builder' } });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@',
    isArray: (name) => ['item', 'podcast:transcript', 'podcast:contentLink', 'itunes:category'].includes(name),
  });
  const channel = parser.parse(xml).rss.channel;

  const episodes: Episode[] = [];
  for (const item of channel.item as any[]) {
    const number = Number(item['itunes:episode'] ?? item['podcast:episode']);
    if (!Number.isFinite(number)) continue; // skip trailers/bonus items without a number
    const title = String(item['itunes:title'] ?? item.title).trim();
    const descriptionHtml = cleanHtml(String(item['content:encoded'] ?? item.description ?? ''));
    const transcriptUrl = (item['podcast:transcript'] ?? []).find((t: any) => t['@type'] === 'text/plain')?.['@url'];
    const youtubeUrl = (item['podcast:contentLink'] ?? []).find((l: any) => /youtu/.test(l['@href'] ?? ''))?.['@href'];

    episodes.push({
      number,
      title,
      slug: `${number}-${slugify(title)}`,
      guid: String(item.guid?.['#text'] ?? item.guid),
      pubDate: new Date(item.pubDate),
      durationSeconds: parseDuration(item['itunes:duration']),
      audioUrl: item.enclosure['@url'],
      audioBytes: Number(item.enclosure['@length'] ?? 0),
      shareUrl: item.link,
      descriptionHtml,
      summary: excerpt(stripHtml(descriptionHtml), 155),
      youtubeUrl,
      transcriptUrl,
      bskyPostUri: item['podcast:socialInteract']?.['@uri'],
    });
  }

  episodes.sort((a, b) => b.number - a.number);
  await Promise.all(episodes.map(async (ep) => (ep.transcript = await loadTranscript(ep.number, ep.transcriptUrl))));

  return {
    title: String(channel.title),
    description: String(channel.description).trim(),
    imageUrl: channel['itunes:image']?.['@href'] ?? channel.image?.url,
    author: String(channel['itunes:author']),
    episodes,
  };
}

function parseDuration(value: unknown): number {
  if (value == null) return 0;
  const parts = String(value).split(':').map(Number);
  return parts.reduce((total, part) => total * 60 + part, 0);
}

// The voicemail/Patreon plugs repeat on every episode. The site shows them once per
// page in its own box, so strip them from the notes to avoid duplicate text.
const BOILERPLATE = [
  /listener supported on Patreon/i,
  /supported via Patreon/i,
  /Text or leave us a voicemail/i,
  /^\s*(<a [^>]*>)?\s*https?:\/\/(www\.)?patreon\.com\/talkingaboutbirds\/?\s*(<\/a>)?\s*$/i,
];

// Show notes come from Transistor as HTML. Drop boilerplate and empty paragraphs, and make links open safely.
function cleanHtml(html: string): string {
  return html
    .trim()
    .replace(/<p>([\s\S]*?)<\/p>/g, (p, inner: string) =>
      !inner.replace(/&nbsp;|<br\s*\/?>/g, '').trim() || BOILERPLATE.some((re) => re.test(inner)) ? '' : p,
    )
    .replace(/<a /g, '<a rel="noopener" ');
}
