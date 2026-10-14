import { PLAYERS, MIN_EPISODES, type Person } from '../data/players';
import { getShow, type Episode } from './feed';
import { slugify, stripHtml } from './text';

export interface Mention {
  episode: Episode;
  where: 'title' | 'notes' | 'transcript';
}

export interface PlayerPage extends Person {
  slug: string;
  mentions: Mention[]; // newest first
}

let cached: Promise<PlayerPage[]> | undefined;

// Players with enough episodes to deserve a page, most-discussed first.
export function getPlayers(): Promise<PlayerPage[]> {
  cached ??= build();
  return cached;
}

async function build(): Promise<PlayerPage[]> {
  const { episodes } = await getShow();
  const texts = episodes.map((ep) => ({
    ep,
    title: ep.title,
    notes: stripHtml(ep.descriptionHtml),
    transcript: ep.transcript?.lines.map((l) => l.text).join(' ') ?? '',
  }));

  const pages = PLAYERS.map((person) => {
    const pattern = new RegExp(
      `\\b(${[person.name, ...(person.aliases ?? [])].map(escape).join('|')})\\b`,
      // Aliases like "Yadi" are case-sensitive on purpose so they don't match inside other words.
      'u',
    );
    const mentions: Mention[] = [];
    for (const t of texts) {
      const where = pattern.test(t.title) ? 'title' : pattern.test(t.notes) ? 'notes' : pattern.test(t.transcript) ? 'transcript' : undefined;
      if (where) mentions.push({ episode: t.ep, where });
    }
    return { ...person, slug: slugify(person.name), mentions };
  });

  return pages.filter((p) => p.mentions.length >= MIN_EPISODES).sort((a, b) => b.mentions.length - a.mentions.length);
}

export async function playersForEpisode(ep: Episode): Promise<PlayerPage[]> {
  const players = await getPlayers();
  return players.filter((p) => p.mentions.some((m) => m.episode === ep && m.where !== 'transcript'));
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]");
}
