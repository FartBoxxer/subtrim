// "Alternatives to X" data for SEO pages
// Each entry: the target service + array of alternatives with reason

export const ALTERNATIVES = {
  'Netflix': {
    tagline: 'Looking to cut the cord on Netflix? Here are the best alternatives.',
    alts: [
      { name: 'Hulu', why: 'Better for current TV shows. Cheaper entry price. Disney+ bundle available.', price: 7.99 },
      { name: 'Disney+', why: 'Best for families. All Marvel, Star Wars, and Pixar. 4K included.', price: 7.99 },
      { name: 'HBO Max', why: 'Higher-quality originals. Warner Bros films added quickly.', price: 9.99 },
      { name: 'Amazon Prime Video', why: 'Included with Prime shipping. Growing original catalog.', price: 8.99 },
      { name: 'Paramount+', why: 'Cheapest option. Star Trek, Yellowstone, CBS shows.', price: 5.99 },
      { name: 'Peacock', why: 'NBC content, sports, and Universal movies. Affordable.', price: 5.99 },
    ]
  },
  'Spotify': {
    tagline: 'Want better audio or a different vibe? These Spotify alternatives deliver.',
    alts: [
      { name: 'Apple Music', why: 'Lossless audio included. Better for Apple users. Spatial Audio.', price: 10.99 },
      { name: 'YouTube Music', why: 'Includes music videos and user uploads. Bundle with ad-free YouTube.', price: 10.99 },
      { name: 'Tidal', why: 'Best audio quality. Higher artist payouts. DJ tools.', price: 10.99 },
      { name: 'Amazon Music Unlimited', why: 'HD audio. Discounted for Prime members. Alexa integration.', price: 9.99 },
    ]
  },
  'ChatGPT Plus': {
    tagline: 'Exploring AI beyond ChatGPT? These alternatives have unique strengths.',
    alts: [
      { name: 'Claude Pro', why: 'Better at reasoning and long documents. More thoughtful responses. 200K context.', price: 20 },
      { name: 'Google Gemini Advanced', why: 'Deep Google integration. Strong at research. 1M token context.', price: 19.99 },
      { name: 'Perplexity Pro', why: 'Best for research with citations. Real-time web search built in.', price: 20 },
      { name: 'GitHub Copilot', why: 'Best for pure coding. IDE integration. Code-focused.', price: 10 },
    ]
  },
  'Adobe Creative Cloud': {
    tagline: 'Adobe too expensive? These alternatives cover most creative needs for less.',
    alts: [
      { name: 'Figma', why: 'Best for UI/UX design. Free tier. Real-time collaboration.', price: 0 },
      { name: 'Canva Pro', why: 'Easy graphic design. Templates for everything. Much cheaper.', price: 12.99 },
      { name: 'Affinity Suite', why: 'One-time purchase. Photo, design, and publishing. No subscription.', price: 0 },
      { name: 'DaVinci Resolve', why: 'Professional video editing. Free version is feature-rich.', price: 0 },
      { name: 'GIMP', why: 'Free Photoshop alternative. Open source. Powerful for photos.', price: 0 },
    ]
  },
  'Microsoft 365': {
    tagline: 'Don\'t need the full Office suite? These alternatives might be enough.',
    alts: [
      { name: 'Google Workspace', why: 'Free for personal use. Real-time collaboration. 15GB storage.', price: 0 },
      { name: 'Notion', why: 'All-in-one workspace. Notes, docs, wikis, project management.', price: 8 },
      { name: 'LibreOffice', why: 'Free and open source. Full office suite. Works offline.', price: 0 },
      { name: 'Apple iWork', why: 'Free for Mac/iPad users. Pages, Numbers, Keynote.', price: 0 },
    ]
  },
  'Disney+': {
    tagline: 'Beyond the Disney vault. Here are streaming alternatives worth considering.',
    alts: [
      { name: 'Netflix', why: 'Largest content library. Best original series. Global availability.', price: 6.99 },
      { name: 'HBO Max', why: 'Premium originals. Warner Bros movies. DC content.', price: 9.99 },
      { name: 'Paramount+', why: 'Cheapest streaming option. Nickelodeon for kids. Live sports.', price: 5.99 },
      { name: 'Crunchyroll', why: 'Best for anime. Huge library. Simulcast from Japan.', price: 7.99 },
    ]
  },
  'Dropbox': {
    tagline: 'Dropbox too pricey for what you need? Cloud storage alternatives abound.',
    alts: [
      { name: 'Google One', why: 'Cheapest per GB. Integrates with Google Drive and Photos.', price: 2.99 },
      { name: 'iCloud+', why: 'Best for Apple users. Starts at $0.99/mo. Private Relay included.', price: 0.99 },
      { name: 'OneDrive', why: 'Included with Microsoft 365. 1TB storage. Office integration.', price: 1.99 },
      { name: 'pCloud', why: 'Lifetime plan available. Swiss privacy. Good sync.', price: 0 },
    ]
  },
  'NordVPN': {
    tagline: 'Exploring VPN options? These alternatives offer strong privacy at competitive prices.',
    alts: [
      { name: 'ExpressVPN', why: 'Fastest speeds. Best for streaming. 94 countries.', price: 12.95 },
      { name: 'Surfshark', why: 'Unlimited devices. Cheapest long-term plans. Good features.', price: 2.49 },
      { name: 'Mullvad VPN', why: 'Best privacy. No email required. Flat €5/mo.', price: 5 },
      { name: 'ProtonVPN', why: 'Swiss-based. Free tier available. Strong privacy track record.', price: 0 },
    ]
  },
  'Xbox Game Pass': {
    tagline: 'Not on Xbox? Or want different games? These gaming alternatives deliver.',
    alts: [
      { name: 'PlayStation Plus', why: 'Essential for PS owners. Classic game catalog. Cloud streaming.', price: 9.99 },
      { name: 'EA Play', why: 'EA games focus. Cheaper. Included in Game Pass Ultimate.', price: 4.99 },
      { name: 'Nintendo Switch Online', why: 'Required for Switch online play. Retro game library. Very cheap.', price: 3.99 },
      { name: 'GeForce Now', why: 'Cloud gaming. Play your existing Steam library. No console needed.', price: 9.99 },
    ]
  },
  'Hulu': {
    tagline: 'Thinking of switching from Hulu? These alternatives cover similar ground.',
    alts: [
      { name: 'Netflix', why: 'Biggest original content library. Works everywhere. No ads on standard plan.', price: 6.99 },
      { name: 'Disney+', why: 'Great bundle partner. Family-friendly. All Marvel and Star Wars.', price: 7.99 },
      { name: 'Peacock', why: 'NBC shows and live sports. Has a free tier. Cheaper paid plans.', price: 5.99 },
      { name: 'Paramount+', why: 'CBS content, Showtime included, live sports. Affordable.', price: 5.99 },
      { name: 'Amazon Prime Video', why: 'Bundled with Prime shipping. Growing originals catalog.', price: 8.99 },
    ]
  },
  'HBO Max': {
    tagline: 'HBO too pricey? These streamers offer quality content for less.',
    alts: [
      { name: 'Netflix', why: 'More content overall. Better recommendation algorithm. Cheaper entry price.', price: 6.99 },
      { name: 'Apple TV+', why: 'Award-winning originals at the lowest price. Severance, Ted Lasso.', price: 9.99 },
      { name: 'Hulu', why: 'Current TV shows next day. Disney+ bundle available.', price: 7.99 },
      { name: 'Paramount+', why: 'Showtime content included. Live sports. Half the price.', price: 5.99 },
    ]
  },
  'Paramount+': {
    tagline: 'Looking beyond Paramount+? These services offer similar value.',
    alts: [
      { name: 'Peacock', why: 'Similar price point. NBC content and sports. Free tier available.', price: 5.99 },
      { name: 'Hulu', why: 'Bigger content library. Next-day TV shows. Disney+ bundle.', price: 7.99 },
      { name: 'Disney+', why: 'Better for families. Marvel, Star Wars, Pixar. Same price range.', price: 7.99 },
      { name: 'Amazon Prime Video', why: 'Included with Prime. Thursday Night Football. Huge library.', price: 8.99 },
    ]
  },
  'Peacock': {
    tagline: 'Moving on from Peacock? These streamers pick up where it leaves off.',
    alts: [
      { name: 'Hulu', why: 'Better original content. Current TV shows. Disney+ bundle option.', price: 7.99 },
      { name: 'Paramount+', why: 'Similar price. Live sports. Showtime content included.', price: 5.99 },
      { name: 'Netflix', why: 'Largest library overall. Better originals. No ads on standard.', price: 6.99 },
      { name: 'Apple TV+', why: 'Cheapest premium option. High-quality originals only.', price: 9.99 },
    ]
  },
  'Apple TV+': {
    tagline: 'Apple TV+ library too small? These services give you more to watch.',
    alts: [
      { name: 'Netflix', why: 'Massive content library. Thousands of shows and movies vs hundreds.', price: 6.99 },
      { name: 'HBO Max', why: 'Prestige originals plus Warner Bros catalog. More variety.', price: 9.99 },
      { name: 'Disney+', why: 'Similar quality originals. Way more content. Great for families.', price: 7.99 },
      { name: 'Hulu', why: 'Current-season TV shows. Huge back catalog. Bundle options.', price: 7.99 },
    ]
  },
  'YouTube Premium': {
    tagline: 'Paying just to skip ads? These alternatives give you more for your money.',
    alts: [
      { name: 'Spotify', why: 'Better music discovery. Bigger podcast library. Cheaper student plan.', price: 10.99 },
      { name: 'Apple Music', why: 'Lossless audio included. Spatial Audio. Better for Apple users.', price: 10.99 },
      { name: 'uBlock Origin', why: 'Free browser extension that blocks YouTube ads. No subscription needed.', price: 0 },
      { name: 'NewPipe', why: 'Free, open-source YouTube client for Android. Background play, no ads.', price: 0 },
    ]
  },
  'Apple Music': {
    tagline: 'Exploring beyond Apple Music? These services hit different notes.',
    alts: [
      { name: 'Spotify', why: 'Best discovery algorithm. Bigger podcast library. Free tier available.', price: 10.99 },
      { name: 'YouTube Music', why: 'Includes music videos and remixes. Bundle with ad-free YouTube.', price: 10.99 },
      { name: 'Tidal', why: 'Best audio quality. Higher artist payouts. DJ integration.', price: 10.99 },
      { name: 'Amazon Music Unlimited', why: 'HD audio. Discounted for Prime members. Alexa integration.', price: 9.99 },
    ]
  },
  'Tidal': {
    tagline: 'Tidal too niche? These music streamers offer similar or better value.',
    alts: [
      { name: 'Apple Music', why: 'Lossless audio included at no extra cost. Larger user base.', price: 10.99 },
      { name: 'Spotify', why: 'Best discovery and playlists. Biggest social features. Free tier.', price: 10.99 },
      { name: 'YouTube Music', why: 'Includes user uploads and music videos. YouTube Premium bundle.', price: 10.99 },
      { name: 'Amazon Music Unlimited', why: 'HD quality. Cheaper for Prime members. Good Alexa integration.', price: 9.99 },
    ]
  },
  'Crunchyroll': {
    tagline: 'Want anime but not Crunchyroll? These alternatives have solid libraries.',
    alts: [
      { name: 'Netflix', why: 'Growing anime selection. Originals like Cyberpunk and Castlevania.', price: 6.99 },
      { name: 'Hulu', why: 'Solid anime catalog. Funimation content merged in.', price: 7.99 },
      { name: 'HIDIVE', why: 'Affordable anime-focused service. Sentai Filmworks exclusives.', price: 4.99 },
      { name: 'Disney+', why: 'Star Wars Visions and growing anime library. More variety overall.', price: 7.99 },
    ]
  },
  'Claude Pro': {
    tagline: 'Considering other AI assistants? Here is how they compare to Claude.',
    alts: [
      { name: 'ChatGPT Plus', why: 'Largest ecosystem. Custom GPTs. Image generation with DALL-E.', price: 20 },
      { name: 'Google Gemini Advanced', why: 'Deep Google integration. 1M token context. Good for research.', price: 19.99 },
      { name: 'Perplexity Pro', why: 'Best for research. Citations built in. Real-time web search.', price: 20 },
      { name: 'GitHub Copilot', why: 'Better for pure coding. IDE integration. Code-focused workflows.', price: 10 },
    ]
  },
  'PlayStation Plus': {
    tagline: 'Not sold on PlayStation Plus? These gaming subscriptions offer different value.',
    alts: [
      { name: 'Xbox Game Pass', why: 'Bigger library. Day-one first-party games. Cloud gaming included.', price: 9.99 },
      { name: 'EA Play', why: 'EA games focus. Very cheap. Play new releases on a trial.', price: 4.99 },
      { name: 'Nintendo Switch Online', why: 'Cheapest gaming sub. Classic NES/SNES/N64 games. Family plan.', price: 3.99 },
      { name: 'GeForce Now', why: 'Cloud gaming without a console. Play Steam games anywhere.', price: 9.99 },
    ]
  },
  '1Password': {
    tagline: 'Looking for a different password manager? These alternatives are solid.',
    alts: [
      { name: 'Bitwarden', why: 'Open source. Generous free tier. Self-hosting option. Half the price.', price: 0 },
      { name: 'Dashlane', why: 'Built-in VPN. Dark web monitoring. Polished interface.', price: 4.99 },
      { name: 'LastPass', why: 'Familiar interface. Emergency access. Good family features.', price: 3 },
      { name: 'Apple Passwords', why: 'Built into Apple devices. Free. Passkey support. Good enough for most.', price: 0 },
    ]
  },
  'Google One': {
    tagline: 'Need cloud storage but not tied to Google? These alternatives work great.',
    alts: [
      { name: 'iCloud+', why: 'Best for Apple users. Private Relay included. Starts at $0.99/mo.', price: 0.99 },
      { name: 'Dropbox', why: 'Best cross-platform sync. Strong file sharing. Smart Sync.', price: 11.99 },
      { name: 'OneDrive', why: 'Included with Microsoft 365. 1TB storage. Office integration.', price: 1.99 },
      { name: 'pCloud', why: 'Lifetime plans available. Swiss privacy. No subscription needed.', price: 0 },
    ]
  },
  'iCloud+': {
    tagline: 'Not all-in on Apple? These cloud storage options work across all your devices.',
    alts: [
      { name: 'Google One', why: 'Cheapest per-GB. Works on everything. Family sharing built in.', price: 2.99 },
      { name: 'Dropbox', why: 'Best cross-platform sync. Reliable. Strong third-party integrations.', price: 11.99 },
      { name: 'OneDrive', why: 'Bundled with Microsoft 365. 1TB storage. Great for Office users.', price: 1.99 },
      { name: 'Proton Drive', why: 'End-to-end encrypted. Swiss privacy. Growing fast.', price: 3.99 },
    ]
  },
  'Notion': {
    tagline: 'Notion not clicking? These productivity tools take a different approach.',
    alts: [
      { name: 'Obsidian', why: 'Local-first. Markdown files you own. Plugin ecosystem. Free.', price: 0 },
      { name: 'Microsoft 365', why: 'Full Office suite. 1TB OneDrive. Industry standard.', price: 9.99 },
      { name: 'Google Docs', why: 'Free. Real-time collaboration. Works in any browser.', price: 0 },
      { name: 'Coda', why: 'Similar all-in-one approach. Better tables and automations.', price: 0 },
    ]
  },
  'YouTube Music': {
    tagline: 'YouTube Music not cutting it? These music apps offer a better experience.',
    alts: [
      { name: 'Spotify', why: 'Better playlists and discovery. Bigger social features. Free tier.', price: 10.99 },
      { name: 'Apple Music', why: 'Lossless audio. Spatial Audio. Cleaner interface.', price: 10.99 },
      { name: 'Tidal', why: 'Best audio quality. Higher artist payouts. DJ tools.', price: 10.99 },
      { name: 'Amazon Music Unlimited', why: 'HD audio. Discounted for Prime members. Good Alexa integration.', price: 9.99 },
    ]
  },
  'Amazon Prime Video': {
    tagline: 'Prime Video not worth it on its own? These streamers deliver more.',
    alts: [
      { name: 'Netflix', why: 'Cleaner interface. Better originals. No ads on standard plan.', price: 6.99 },
      { name: 'Hulu', why: 'Next-day TV shows. Disney+ bundle. Better for current TV.', price: 7.99 },
      { name: 'HBO Max', why: 'Higher-quality originals. Warner Bros catalog. Less clutter.', price: 9.99 },
      { name: 'Disney+', why: 'Better for families. Marvel, Star Wars, Pixar. 4K included.', price: 7.99 },
    ]
  },
};

// Build slug map
export const ALT_SLUGS = {};
Object.keys(ALTERNATIVES).forEach(name => {
  ALT_SLUGS[name.replace(/\+/g, ' plus').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')] = name;
});
