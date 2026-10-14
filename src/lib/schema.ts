// schema.org structured data. Helps Google understand that this is a podcast,
// who hosts it, and how each episode page relates to the series.
import { SITE, HOSTS, LISTEN, SOCIAL } from '../site.config';
import type { Episode } from './feed';
import { absoluteUrl, episodePath } from './urls';
import { isoDuration } from './text';

const seriesId = () => absoluteUrl('/#podcast');

export function podcastSeries(episodeCount?: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    '@id': seriesId(),
    name: SITE.fullName,
    alternateName: SITE.name,
    description: SITE.description,
    url: absoluteUrl('/'),
    image: absoluteUrl('/artwork.jpg'),
    webFeed: SITE.feedUrl,
    inLanguage: 'en-US',
    genre: ['Sports', 'Baseball'],
    keywords: SITE.keywords.join(', '),
    about: { '@type': 'SportsTeam', name: 'St. Louis Cardinals', sport: 'Baseball' },
    author: HOSTS.map((h) => ({ '@type': 'Person', name: h.name })),
    ...(episodeCount ? { numberOfEpisodes: episodeCount } : {}),
    sameAs: [...LISTEN, ...SOCIAL].map((l) => l.url).filter((u) => !u.includes('feeds.')),
  };
}

export function podcastEpisode(ep: Episode) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    '@id': absoluteUrl(episodePath(ep)) + '#episode',
    url: absoluteUrl(episodePath(ep)),
    name: ep.title,
    episodeNumber: ep.number,
    datePublished: ep.pubDate.toISOString(),
    description: ep.summary,
    timeRequired: isoDuration(ep.durationSeconds),
    image: absoluteUrl('/artwork.jpg'),
    inLanguage: 'en-US',
    author: HOSTS.map((h) => ({ '@type': 'Person', name: h.name })),
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: ep.audioUrl,
      encodingFormat: 'audio/mpeg',
      duration: isoDuration(ep.durationSeconds),
    },
    partOfSeries: { '@type': 'PodcastSeries', '@id': seriesId(), name: SITE.fullName, url: absoluteUrl('/') },
    ...(ep.youtubeUrl ? { subjectOf: { '@type': 'VideoObject', url: ep.youtubeUrl, name: ep.title } } : {}),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: absoluteUrl('/'),
  };
}
