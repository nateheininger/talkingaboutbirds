# talkingaboutbirds.com

The website for **Talking About Birds**, a weekly St. Louis Cardinals podcast by Nate Heininger and Ben Simorka.

It's a static site built with [Astro](https://astro.build) and hosted free on GitHub Pages. Every page is generated from the podcast's RSS feed on Transistor, so **publishing an episode in Transistor is all it takes to update the site**: a GitHub Action checks the feed every 2 hours and redeploys when it changes.

## What's on the site

| Page | What it's for |
| --- | --- |
| `/` | Home: latest episode with a player, recent episodes, voicemail line, Patreon |
| `/episodes/` | Every episode, searchable, grouped by year |
| `/episodes/<number>-<title>/` | One page per episode: player, show notes, YouTube video, transcript, players discussed |
| `/<number>/` | Short link that redirects to the episode, e.g. `talkingaboutbirds.com/241`. Say it on the show! |
| `/players/` and `/players/<name>/` | Every episode that mentions a given Cardinal |
| `/about/`, `/listen/` | Show info, hosts, every place to subscribe |
| `/sitemap-index.xml`, `/robots.txt`, `/llms.txt` | For Google, Bing, and AI search engines |

Every page has a unique title and description, a canonical URL, Open Graph tags for link previews, and schema.org structured data (`PodcastSeries`, `PodcastEpisode`, `BreadcrumbList`).

## Common edits

- **Links, tagline, host bios, analytics:** `src/site.config.ts`
- **Add a player page:** add a line to `src/data/players.ts`. A page appears once they're in 3+ episodes.
- **Colors and fonts:** `src/styles/global.css`
- **Episode titles and show notes:** edit them in Transistor, not here. The site picks up changes on the next feed check.

Commit and push to `main` and the site redeploys in about a minute.

## Transcripts

Transcripts are the biggest SEO lever a podcast has: each one is 10,000+ words of searchable Cardinals talk. Episode pages show a transcript if either:

1. Transistor has one. Upload or auto-generate it on the episode in Transistor and it's picked up automatically, **or**
2. There's a file at `src/data/transcripts/<episode number>.txt`.

To import transcripts from the `Transcripts` folder on your Desktop (`.txt` or `.docx`, any file name starting with the episode number):

```bash
npm run import-transcripts
```

Then commit and push.

## Running it locally

Requires Node 22+.

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Going live on talkingaboutbirds.com

Right now the domain forwards to the omg.lol profile, so Google doesn't see any content on it. To switch:

1. **At Porkbun** (Domain Management → talkingaboutbirds.com):
   - Delete the URL forwarding for `talkingaboutbirds.com` and `www`.
   - Under DNS, delete any existing `A`, `AAAA`, `ALIAS`, or `CNAME` records for the root and `www`, then add:

     | Type | Host | Answer |
     | --- | --- | --- |
     | A | *(blank)* | 185.199.108.153 |
     | A | *(blank)* | 185.199.109.153 |
     | A | *(blank)* | 185.199.110.153 |
     | A | *(blank)* | 185.199.111.153 |
     | CNAME | www | nateheininger.github.io |

2. **In GitHub** (this repo → Settings):
   - Secrets and variables → Actions → **Variables** → New variable: `SITE_URL` = `https://talkingaboutbirds.com`
   - Pages → Custom domain: `talkingaboutbirds.com` → Save. Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).
   - Actions → Build and deploy → **Run workflow**.

DNS changes usually take effect within an hour. Until then the site is at https://nateheininger.github.io/talkingaboutbirds/ (marked `noindex` so Google doesn't index the preview copy).

## After launch: SEO checklist

- [ ] **Google Search Console**: add `talkingaboutbirds.com` as a Domain property (verify with a TXT record at Porkbun), then submit `https://talkingaboutbirds.com/sitemap-index.xml`.
- [ ] **Bing Webmaster Tools**: import from Search Console with one click. Bing also powers DuckDuckGo and ChatGPT search.
- [ ] **Transistor → Show settings → Website**: set it to `https://talkingaboutbirds.com`. Apple Podcasts and Spotify link to whatever is there.
- [ ] **Update link-in-bio** on Instagram, TikTok, Bluesky, YouTube, and Patreon to `talkingaboutbirds.com`.
- [ ] **Say the short links on the show**: "show notes at talkingaboutbirds.com/242".
- [ ] **Turn on transcripts in Transistor** for every new episode.
- [ ] **Visitor analytics (optional)**: create a free account at goatcounter.com and put the code in `src/site.config.ts`.
