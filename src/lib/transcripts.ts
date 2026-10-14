// Transcripts are the single biggest SEO win for a podcast site: an hour of
// conversation is thousands of words of searchable text about Cardinals players.
//
// Sources, in order:
//   1. src/data/transcripts/<number>.txt (committed to the repo; see scripts/import-transcripts.mjs)
//   2. The transcript URL Transistor publishes in the RSS feed
export interface TranscriptLine {
  speaker?: string;
  text: string;
}

export interface Transcript {
  lines: TranscriptLine[];
  wordCount: number;
}

const local = import.meta.glob<string>('../data/transcripts/*.txt', { query: '?raw', import: 'default', eager: true });

export async function loadTranscript(number: number, url?: string): Promise<Transcript | undefined> {
  let raw = local[`../data/transcripts/${number}.txt`];
  if (!raw && url) {
    const res = await fetch(url).catch(() => undefined);
    if (res?.ok) raw = await res.text();
    else console.warn(`[transcripts] couldn't fetch transcript for episode ${number}: ${res?.status ?? 'network error'}`);
  }
  return raw ? parseTranscript(raw) : undefined;
}

const SPEAKER = /^([A-Za-z][A-Za-z .'-]{0,30}):\s+(.*)$/;
const TIMESTAMP = /\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/g;

export function parseTranscript(raw: string): Transcript {
  const lines: TranscriptLine[] = [];
  const body = raw.replace(/\r\n?/g, '\n').replace(/[​﻿]/g, '');

  for (const para of body.split(/\n+/)) {
    const text = para.replace(TIMESTAMP, '').trim();
    if (!text) continue;
    // Headers the recording tools add: "225", "===", "Room recording - Apr 8, 2026"
    if (!lines.length && /^(\d+|=+|Room recording\b.*)$/i.test(text)) continue;
    const match = text.match(SPEAKER);
    if (match) lines.push({ speaker: titleCase(match[1]), text: match[2] });
    else lines.push({ text });
  }
  const wordCount = lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
  return { lines, wordCount };
}

function titleCase(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}
