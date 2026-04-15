// "Is X worth it?" data for programmatic SEO pages
// Each entry covers a popular subscription with a clear yes/no/conditional verdict

export const WORTH_IT = {
  'Netflix': {
    price: 6.99,
    verdict: 'conditional',
    summary: 'Worth it if you watch more than 2 hours a week. Skip if you already have Hulu or Prime Video.',
    worthIt: [
      'Largest original content library of any streamer',
      'Ad-supported tier at $6.99 is a bargain vs cable',
      'Works on every device and travels anywhere',
      'Password sharing crackdown means you are paying for your own account anyway',
    ],
    notWorthIt: [
      'You have not opened the app in 30 days',
      'You already pay for Hulu, Disney+, or HBO Max',
      'You only watched one show and finished it',
      'Ad tier annoys you and standard tier feels overpriced',
    ],
    whoShouldKeep: 'Heavy streamers who use it 2+ times a week and do not have 3 other streaming services.',
    whoShouldCancel: 'Anyone who only opened it once this month or can name what they watched last.',
    breakEven: 'At $6.99/mo, you break even if you watch 4+ hours of content a month. Under that, a movie rental would be cheaper.',
    topAlternative: 'Hulu',
  },

  'Spotify': {
    price: 10.99,
    verdict: 'yes',
    summary: 'Worth it for most users. Best music discovery algorithm and podcast library of any service.',
    worthIt: [
      'Best music recommendation engine (Discover Weekly, Daily Mixes)',
      'Biggest podcast library with exclusives',
      'Works offline, across all devices, and in cars',
      'Family plan at $17.99 for 6 people is unbeatable value',
      'Student plan at $5.99 includes Hulu with ads',
    ],
    notWorthIt: [
      'You barely listen to music or podcasts',
      'You are locked into Apple and would prefer Lossless audio',
      'You can tolerate ads on the free tier',
    ],
    whoShouldKeep: 'Daily music listeners, podcast fans, students, and families sharing a plan.',
    whoShouldCancel: 'Light listeners who mostly use YouTube for music anyway.',
    breakEven: 'If you listen 30+ minutes a day, you pay about $0.03 per session. Hard to beat.',
    topAlternative: 'Apple Music',
  },

  'Amazon Prime': {
    price: 14.99,
    verdict: 'conditional',
    summary: 'Worth it if you order from Amazon 2+ times a month. The shipping alone usually pays for itself.',
    worthIt: [
      'Free 2-day (often same-day) shipping on most orders',
      'Includes Prime Video, Prime Music, and Prime Gaming',
      'Free grocery delivery on $35+ Whole Foods or Amazon Fresh orders',
      'Photos, Reading, and Try Before You Buy included',
      '$14.99/mo or $139/yr — the annual plan saves $40',
    ],
    notWorthIt: [
      'You order from Amazon less than once a month',
      'You live in a rural area where 2-day shipping is not available',
      'You have other delivery memberships (Walmart+, Target Circle 360) you already use',
    ],
    whoShouldKeep: 'Anyone who orders from Amazon 2+ times a month. Also families with kids who watch Prime Video.',
    whoShouldCancel: 'Occasional shoppers who can consolidate orders to hit $35 free shipping minimum.',
    breakEven: 'Prime pays for itself after about 2 shipping-eligible orders per month (average $8 shipping saved per order).',
    topAlternative: 'Walmart+',
  },

  'Xbox Game Pass': {
    price: 19.99,
    verdict: 'yes',
    summary: 'Worth it for any gamer. Day-one first-party releases alone justify the price.',
    worthIt: [
      'New AAA games added on day one (Starfield, Halo, Forza)',
      '400+ games in the library across PC, Xbox, and cloud',
      'Cloud gaming lets you play on phone, tablet, or TV',
      'EA Play included in the Ultimate tier',
      'Monthly cost is cheaper than buying one game per year',
    ],
    notWorthIt: [
      'You only play one or two specific games long-term (Fortnite, COD, etc.)',
      'You rarely finish games and the rotating library stresses you out',
      'You do not have an Xbox, PC, or decent internet for cloud play',
    ],
    whoShouldKeep: 'Players who try new games and want variety. Families sharing a console.',
    whoShouldCancel: 'Players fully invested in a single live-service game.',
    breakEven: 'One new AAA game costs $70. Game Pass Ultimate at $19.99/mo pays for itself in under 4 months.',
    topAlternative: 'PlayStation Plus',
  },

  'Disney+': {
    price: 9.99,
    verdict: 'conditional',
    summary: 'Worth it if you have kids or love Marvel and Star Wars. Library is narrow otherwise.',
    worthIt: [
      'Every Marvel, Star Wars, and Pixar release lands here',
      'Best streamer for families with young kids',
      '4K and Dolby Atmos included at no extra cost on most titles',
      'Disney Bundle with Hulu and ESPN+ is strong value',
    ],
    notWorthIt: [
      'You are not into superhero, Star Wars, or animated content',
      'You already watch Marvel and Star Wars content theatrically',
      'Library is smaller than Netflix and HBO Max',
    ],
    whoShouldKeep: 'Parents with kids under 12. Marvel or Star Wars completionists.',
    whoShouldCancel: 'Adults without kids who have watched all the big franchises already.',
    breakEven: 'One kids movie rental costs $5.99. Disney+ pays for itself if kids watch 2+ new movies a month.',
    topAlternative: 'Netflix',
  },

  'ChatGPT Plus': {
    price: 20,
    verdict: 'yes',
    summary: 'Worth it for anyone who uses AI more than twice a week for work, writing, or coding.',
    worthIt: [
      'Access to GPT-4 class models (faster, smarter than free tier)',
      'Image generation with DALL-E built in',
      'Custom GPTs and the Canvas feature',
      'Priority access during high-traffic times',
      'Voice mode and advanced data analysis',
    ],
    notWorthIt: [
      'You rarely use AI or the free tier covers your needs',
      'You already pay for Claude Pro or Gemini Advanced',
      'You only use AI for basic writing tasks',
    ],
    whoShouldKeep: 'Writers, developers, analysts, students, and anyone using AI daily.',
    whoShouldCancel: 'Occasional users who rarely hit free tier limits.',
    breakEven: 'If ChatGPT saves you 30 minutes a week, it pays for itself at minimum wage.',
    topAlternative: 'Claude Pro',
  },

  'Apple Music': {
    price: 10.99,
    verdict: 'conditional',
    summary: 'Worth it if you are deep in the Apple ecosystem. Otherwise Spotify is usually better.',
    worthIt: [
      'Lossless and Spatial Audio included at no extra cost',
      'Best integration with iPhone, AirPods, HomePod, and Apple Watch',
      'Apple One bundle includes iCloud, TV+, News+, and Fitness+',
      'No ads ever, even on the free trial',
    ],
    notWorthIt: [
      'You use Android or Windows as your primary device',
      'You rely on Spotify Wrapped and Discover Weekly playlists',
      'You already pay for YouTube Premium (which includes YouTube Music)',
    ],
    whoShouldKeep: 'iPhone users who want lossless audio and seamless AirPods integration.',
    whoShouldCancel: 'Anyone missing Spotify discovery features or Android primary users.',
    breakEven: 'Identical to Spotify at $10.99/mo. Value comes from ecosystem integration, not pure audio.',
    topAlternative: 'Spotify',
  },

  'Peloton': {
    price: 44,
    verdict: 'conditional',
    summary: 'All-Access at $44/mo is worth it if you use it 3+ times a week. App-only at $12.99 is a much easier sell.',
    worthIt: [
      'Best trainer-led cycling classes anywhere',
      'Strength, yoga, running, and outdoor workouts included',
      'Live classes add motivation and community',
      'Tread and Bike+ users get metric-tracking and leaderboards',
    ],
    notWorthIt: [
      'You use the bike less than 2x a week',
      'You mostly follow YouTube workouts anyway',
      'You switched to outdoor running or lifting and rarely open the app',
    ],
    whoShouldKeep: 'Bike or Tread owners who ride 3+ times a week. App users who follow strength programs.',
    whoShouldCancel: 'Owners whose bike has become a clothes rack.',
    breakEven: 'A single boutique cycling class costs $30-40. Peloton All-Access pays off with 2 rides per month.',
    topAlternative: 'Apple Fitness+',
  },

  'Audible': {
    price: 14.95,
    verdict: 'conditional',
    summary: 'Worth it if you listen to 1+ audiobooks a month. The included Plus Catalog expands what you get.',
    worthIt: [
      'One premium credit per month for any book',
      'Plus Catalog of thousands of included titles',
      'Audiobooks are yours forever, even after cancelling',
      'Exclusive Audible Originals and podcasts',
    ],
    notWorthIt: [
      'You read paper or ebooks and rarely listen',
      'Your library has a robust Libby catalog',
      'You have unused credits piling up',
    ],
    whoShouldKeep: 'Commuters, runners, and anyone who listens 30+ minutes a day.',
    whoShouldCancel: 'Anyone with 3+ unused credits or who forgets the app exists.',
    breakEven: 'A typical hardcover costs $20-30. One credit per month saves more than the $14.95 fee.',
    topAlternative: 'Libby (free)',
  },

  'HBO Max': {
    price: 9.99,
    verdict: 'yes',
    summary: 'Worth it. Highest-quality originals of any streamer and Warner Bros films hit fast.',
    worthIt: [
      'Prestige originals (Succession, The Last of Us, House of the Dragon)',
      'Warner Bros theatrical films within ~45 days',
      'HBO back catalog (Sopranos, Wire, Game of Thrones)',
      'DC Comics and Studio Ghibli libraries',
    ],
    notWorthIt: [
      'You only watched one show and finished it',
      'You prefer unscripted content and reality TV',
      'Ad tier is cheaper but content quality stays the same',
    ],
    whoShouldKeep: 'Prestige TV fans. Fans of HBO originals or big Warner Bros releases.',
    whoShouldCancel: 'Users who signed up for one show and forgot to cancel.',
    breakEven: 'One HBO movie ticket is $15. HBO Max pays for itself with 1 new-release watch per month.',
    topAlternative: 'Netflix',
  },

  'YouTube Premium': {
    price: 13.99,
    verdict: 'conditional',
    summary: 'Worth it if you watch 1+ hour of YouTube daily. Otherwise ad blockers solve the same problem for free.',
    worthIt: [
      'No ads on any YouTube video or Shorts',
      'Background play on mobile (huge for podcasts)',
      'Offline downloads for travel',
      'YouTube Music included (vs $10.99 standalone)',
      'Family plan at $22.99 covers 6 people',
    ],
    notWorthIt: [
      'You use uBlock Origin or Brave browser on desktop',
      'You mostly watch on TV where ads are shorter',
      'You already have Spotify or Apple Music',
    ],
    whoShouldKeep: 'Heavy mobile YouTube users, especially podcast listeners. Families sharing a plan.',
    whoShouldCancel: 'Desktop-only users who can run an ad blocker.',
    breakEven: 'Only valuable if you watch YouTube 1+ hour a day on mobile. Desktop users can get 90% of this for free.',
    topAlternative: 'Spotify + uBlock Origin',
  },

  'NordVPN': {
    price: 3.09,
    verdict: 'conditional',
    summary: 'Worth it on the 2-year plan ($3.09/mo). Monthly pricing ($12.99) is hard to justify.',
    worthIt: [
      'Private browsing on public Wi-Fi',
      'Access geo-restricted streaming libraries',
      '6 simultaneous connections, works on all devices',
      'Meshnet for private networks between devices',
      '30-day money-back guarantee',
    ],
    notWorthIt: [
      'You mostly browse at home on a trusted network',
      'You do not stream from other regions',
      'Your ISP or employer already provides a VPN',
    ],
    whoShouldKeep: 'Frequent travelers, work-from-home users, streamers accessing other regions.',
    whoShouldCancel: 'Home-only users who never connect to public Wi-Fi.',
    breakEven: 'On the 2-year plan ($3.09/mo), you break even if you use public Wi-Fi once a month.',
    topAlternative: 'Mullvad VPN',
  },

  'Calm': {
    price: 14.99,
    verdict: 'conditional',
    summary: 'Worth it if you meditate 3+ times a week. Otherwise Insight Timer\'s free tier is plenty.',
    worthIt: [
      'Best sleep stories (Matthew McConaughey, Harry Styles)',
      'Ambient music and nature sounds for focus',
      'Master classes with Jeff Warren and others',
      'Daily Calm keeps the habit consistent',
    ],
    notWorthIt: [
      'You meditated twice and stopped',
      'Free apps like Insight Timer cover your needs',
      'You bought the annual plan and forgot about it',
    ],
    whoShouldKeep: 'Daily meditators and people with sleep issues who actually use Sleep Stories.',
    whoShouldCancel: 'Anyone who has not opened the app in 2+ weeks.',
    breakEven: 'Only valuable if you use it 3+ times a week. Occasional meditators get the same value free from Insight Timer.',
    topAlternative: 'Insight Timer',
  },

  'Kindle Unlimited': {
    price: 11.99,
    verdict: 'conditional',
    summary: 'Worth it if you read 2+ books a month AND are okay with the catalog (mostly indie and older titles).',
    worthIt: [
      'Unlimited reads of 4M+ titles',
      'Works on Kindle, phone, tablet, or browser',
      'Audible Narration on many titles adds audiobook versions',
      'Pause or cancel anytime',
    ],
    notWorthIt: [
      'You want new bestsellers (most are not included)',
      'Your library has Libby (same books, free)',
      'You read less than 2 books per month',
    ],
    whoShouldKeep: 'Heavy readers of romance, sci-fi, and self-published fiction.',
    whoShouldCancel: 'Readers who mostly want current bestsellers, or Libby users.',
    breakEven: 'Two ebooks a month on Amazon costs $20+. Kindle Unlimited at $11.99 pays off at 2 books.',
    topAlternative: 'Libby (free)',
  },

  'LinkedIn Premium': {
    price: 39.99,
    verdict: 'conditional',
    summary: 'Worth it during an active job search. Cancel the second you accept an offer.',
    worthIt: [
      'InMail credits (messages to non-connections)',
      'See everyone who viewed your profile',
      'Applicant insights (salary, competition)',
      'LinkedIn Learning course library included',
    ],
    notWorthIt: [
      'You are employed and not searching',
      'You rarely open LinkedIn',
      'Your industry hires through referrals, not LinkedIn applications',
    ],
    whoShouldKeep: 'Active job seekers, recruiters, and sales professionals doing cold outreach.',
    whoShouldCancel: 'Employed users who forgot they had it. Anyone not job-searching in the next 3 months.',
    breakEven: 'If Premium helps you land one interview, it pays off. Otherwise the free tier covers basic networking.',
    topAlternative: 'Free LinkedIn + Wellfound',
  },

  'Adobe Creative Cloud': {
    price: 59.99,
    verdict: 'conditional',
    summary: 'Worth it for working creatives. Hobbyists should look at alternatives.',
    worthIt: [
      'Industry standard for design, video, and photo professionals',
      'All 20+ apps (Photoshop, Premiere, Illustrator, After Effects, etc.)',
      '100GB cloud storage and Adobe Fonts',
      'Frequent updates and new AI features',
    ],
    notWorthIt: [
      'You use Photoshop once a month for hobby edits',
      'You are a student who could get the $19.99/mo plan',
      'Free tools like Figma, DaVinci Resolve, and GIMP cover your needs',
    ],
    whoShouldKeep: 'Professional designers, video editors, photographers, and agencies.',
    whoShouldCancel: 'Hobbyists, occasional editors, and users stuck with expired skills.',
    breakEven: 'Professionals: pays for itself with one freelance project per month. Hobbyists: hard to justify at $720/yr.',
    topAlternative: 'Affinity Suite (one-time)',
  },
};

// Build slug map
export const WORTH_IT_SLUGS = {};
Object.keys(WORTH_IT).forEach(name => {
  WORTH_IT_SLUGS[name.replace(/\+/g, ' plus').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')] = name;
});
