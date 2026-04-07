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
    tagline: 'Beyond the Disney vault — here are streaming alternatives worth considering.',
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
};

// Build slug map
export const ALT_SLUGS = {};
Object.keys(ALTERNATIVES).forEach(name => {
  ALT_SLUGS[name.toLowerCase().replace(/[^a-z0-9]+/g, '-')] = name;
});
