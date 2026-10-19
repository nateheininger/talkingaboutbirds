// Loads the stats dashboard data produced by the private tab-metrics repo (data/dashboard.json).
// Locally it's read from the sibling ../metrics folder; in GitHub Actions the workflow checks
// the private repo out and points METRICS_DIR at it. The /stats/ page is encrypted after
// the build (see integrations/encrypt-stats.mjs), so these numbers are never published in the clear.
import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface Ranked {
  name: string;
  downloads: number;
}

export interface EpisodeStat {
  number: number;
  title: string;
  release: string; // YYYY-MM-DD
  d1: number | null; // first 24 hours after release; null = window not finished yet
  d3: number | null;
  d7: number | null;
  d30: number | null;
  total: number;
}

export interface Dashboard {
  generated: string;
  asOf: string;
  trackingStart: string;
  headline: {
    last30: number;
    prior30: number;
    year: number;
    ytd: number;
    lastYtd: number;
    recentLaunch: number;
    priorLaunch: number;
    bots30: number;
    botsAll: number;
    appleRating: number | null;
    appleRatings: number | null;
    blueskyFollowers: number | null;
    patreonPaid: number | null;
    patreonMembers: number | null;
    youtubeSubscribers: number | null;
  };
  monthly: { month: string; downloads: number; partial: boolean }[];
  episodes: EpisodeStat[]; // newest first
  period: { from: string; to: string };
  apps: { total: number; rows: Ranked[] };
  devices: { total: number; rows: Ranked[] };
  youtube: {
    source: 'page' | 'api' | null; // 'page' = public channel page (rounded counts), 'api' = YouTube Data API
    videos: { id: string; title: string; published: string; views: number | ''; likes?: number; comments?: number }[];
  };
  referrers: { from: string; rows: Ranked[] };
  geo: { total: number; usTotal: number; stl: number; metros: Ranked[]; states: Ranked[]; countries: Ranked[] };
  social: { label: string; format: 'rating' | 'rank' | 'number'; now: number; ago30: number | null; ago90: number | null }[];
  notes: string[];
}

export function loadDashboard(): Dashboard | undefined {
  const dir = process.env.METRICS_DIR || path.join(process.cwd(), '..', 'metrics');
  try {
    return JSON.parse(readFileSync(path.join(dir, 'data', 'dashboard.json'), 'utf8'));
  } catch {
    console.warn(`[stats] no dashboard.json found in ${dir}; /stats/ will show a placeholder`);
    return undefined;
  }
}

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export function change(now: number, before: number): string {
  if (!before) return '';
  const pct = Math.round(((now - before) / before) * 100);
  return pct === 0 ? 'Flat' : `${pct > 0 ? '▲' : '▼'} ${Math.abs(pct)}%`;
}

export const monthName = (month: string, style: 'long' | 'short' = 'long') =>
  new Date(`${month}-15T12:00:00Z`).toLocaleDateString('en-US', { month: style, year: 'numeric', timeZone: 'UTC' });

export const shortDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
