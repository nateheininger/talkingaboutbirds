// Everything about the show that isn't in the RSS feed lives here.
// Edit this file to change links, host bios, or the tagline.

export const SITE = {
  name: 'Talking About Birds',
  fullName: 'Talking About Birds: A St. Louis Cardinals Podcast',
  tagline: 'The only Cardinals podcast dumber than running on Yadi.',
  description:
    'Talking About Birds is a weekly St. Louis Cardinals podcast hosted by Nate Heininger and Ben Simorka. Player-by-player breakdowns, prospects, trades, bad bets, and Who Charted?',
  keywords: ['St. Louis Cardinals podcast', 'Cardinals podcast', 'STL Cardinals', 'MLB podcast', 'baseball podcast'],
  feedUrl: 'https://feeds.transistor.fm/talking-about-birds-a-st-louis-cardinals-podcast',
  podcastGuid: '70772126-0d87-5a99-856d-c4f59817f2f2',
  email: 'talkaboutbirds@gmail.com',
  phone: { display: '(848) 48-BIRDS', digits: '+18484824737' },
  // Episodes publish weekly; used in copy and structured data.
  schedule: 'New episodes every week',
};

export const HOSTS = [{ name: 'Nate Heininger' }, { name: 'Ben Simorka' }];

// Listen links, in the order they should appear.
export const LISTEN = [
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/talking-about-birds-a-st-louis-cardinals-podcast/id1612863613' },
  { name: 'Spotify', url: 'https://open.spotify.com/show/2ywn66IoU1gmf9Sutgn9Yh' },
  { name: 'YouTube', url: 'https://www.youtube.com/@TalkingAboutBirds' },
  { name: 'Pocket Casts', url: 'https://pca.st/itunes/1612863613' },
  { name: 'RSS Feed', url: 'https://feeds.transistor.fm/talking-about-birds-a-st-louis-cardinals-podcast' },
];

export const SOCIAL = [
  { name: 'Patreon', url: 'https://www.patreon.com/talkingaboutbirds' },
  { name: 'YouTube', url: 'https://www.youtube.com/@TalkingAboutBirds' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/talkingaboutbirds.bsky.social' },
  { name: 'Instagram', url: 'https://instagram.com/talkingaboutbirds' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@talkingaboutbirds' },
  { name: 'Shirts', url: 'https://talking-about-birds.printify.me/products' },
];

export const PATREON_URL = 'https://www.patreon.com/talkingaboutbirds';

export const ANALYTICS = {
  // Free, cookie-free visitor counts. Sign up at goatcounter.com, then put your code here
  // (the "talkingaboutbirds" part of talkingaboutbirds.goatcounter.com). Leave empty to disable.
  goatcounterCode: '',
  // Only needed if you verify Google Search Console with the "HTML tag" method.
  googleSiteVerification: '',
};
export const APPLE_PODCASTS_ID = '1612863613';
