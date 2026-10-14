// Used by the scheduled GitHub Action: has the podcast feed changed since the last deploy?
// Writes src/data/feed-state.json and prints `changed=true|false` to $GITHUB_OUTPUT.
//
// Committing the state file on each change also keeps the repo "active", which stops
// GitHub from switching off the schedule after 60 quiet days.
import { readFile, writeFile, appendFile } from 'node:fs/promises';

const FEED = 'https://feeds.transistor.fm/talking-about-birds-a-st-louis-cardinals-podcast';
const STATE = new URL('../src/data/feed-state.json', import.meta.url);

const xml = await (await fetch(FEED)).text();
const pick = (re) => xml.match(re)?.[1]?.trim();
const next = {
  lastBuildDate: pick(/<lastBuildDate>([^<]+)<\/lastBuildDate>/),
  latestEpisode: Number(pick(/<itunes:episode>(\d+)<\/itunes:episode>/)),
  latestTitle: pick(/<item>\s*<title>([^<]+)<\/title>/),
  episodeCount: (xml.match(/<item>/g) ?? []).length,
};

const prev = JSON.parse(await readFile(STATE, 'utf8').catch(() => '{}'));
const changed = next.lastBuildDate !== prev.lastBuildDate || next.episodeCount !== prev.episodeCount;
if (changed) await writeFile(STATE, JSON.stringify(next, null, 2) + '\n');

console.log(changed ? `Feed changed: ${JSON.stringify(next)}` : 'Feed unchanged.');
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
