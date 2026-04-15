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
  'Peloton': {
    tagline: 'Peloton App getting pricey? These fitness apps deliver similar workouts for less.',
    alts: [
      { name: 'Apple Fitness+', why: 'Cheaper. Great trainer-led classes. Included free with some Apple One plans.', price: 9.99 },
      { name: 'Nike Training Club', why: 'Completely free. Strength, yoga, and HIIT from top trainers.', price: 0 },
      { name: 'iFit', why: 'Works with NordicTrack and ProForm equipment. Global workouts filmed outdoors.', price: 15 },
      { name: 'Les Mills+', why: 'BodyPump, BodyCombat, and more. Strong strength programming.', price: 11.99 },
      { name: 'YouTube', why: 'Free. Huge library of workouts from creators like Caroline Girvan and FitnessBlender.', price: 0 },
    ]
  },
  'Calm': {
    tagline: 'Calm not clicking? These meditation and sleep apps offer different approaches.',
    alts: [
      { name: 'Headspace', why: 'Structured programs for beginners. Great sleepcasts and focus music.', price: 12.99 },
      { name: 'Insight Timer', why: 'Largest free meditation library. 150K+ guided sessions.', price: 0 },
      { name: 'Balance', why: 'Personalized daily meditation plan. First year often free.', price: 11.99 },
      { name: 'Waking Up', why: 'Philosophical approach from Sam Harris. Pay-what-you-can policy.', price: 14.99 },
    ]
  },
  'Headspace': {
    tagline: 'Want to try a different meditation app? These alternatives all bring something unique.',
    alts: [
      { name: 'Calm', why: 'Better sleep stories (including Matthew McConaughey). Music and nature sounds.', price: 14.99 },
      { name: 'Insight Timer', why: 'Free tier is extensive. Community-driven with thousands of teachers.', price: 0 },
      { name: 'Waking Up', why: 'For people wanting depth beyond basic mindfulness. Sam Harris course.', price: 14.99 },
      { name: 'Ten Percent Happier', why: 'Great for skeptics. Dan Harris interviews famous teachers.', price: 11.67 },
    ]
  },
  'Strava': {
    tagline: 'Strava subscription not pulling its weight? These training apps work for runners and cyclists too.',
    alts: [
      { name: 'Garmin Connect', why: 'Free with any Garmin watch. Training plans, routes, and analysis.', price: 0 },
      { name: 'TrainingPeaks', why: 'Best for serious athletes with a coach. Structured workout tracking.', price: 19.95 },
      { name: 'Komoot', why: 'Better for route planning, especially cycling and hiking. One-time regional fee option.', price: 4.99 },
      { name: 'AllTrails+', why: 'Best for hikers and trail runners. Offline maps and 3D previews.', price: 2.99 },
      { name: 'Runna', why: 'AI-driven running plans. Adapts to your schedule and pace.', price: 17.99 },
    ]
  },
  'LinkedIn Premium': {
    tagline: 'LinkedIn Premium not converting to interviews? Put the money toward these instead.',
    alts: [
      { name: 'Blind', why: 'Anonymous workplace conversations. See real salaries and company reviews.', price: 0 },
      { name: 'Wellfound (AngelList)', why: 'Free. Direct access to startup founders and jobs.', price: 0 },
      { name: 'Hunter.io', why: 'Find email addresses for cold outreach. Free tier included.', price: 0 },
      { name: 'Teal', why: 'Free job tracker and resume builder. Premium features cheaper than LinkedIn.', price: 9 },
      { name: 'Resume-worthy coursework', why: 'Coursera or a niche certification often beats Premium for landing interviews.', price: 49 },
    ]
  },
  'GitHub Copilot': {
    tagline: 'Exploring other AI coding tools? These alternatives compete directly with Copilot.',
    alts: [
      { name: 'Cursor', why: 'AI-first editor fork of VS Code. Better agent and chat than Copilot.', price: 20 },
      { name: 'Claude Code', why: 'Terminal-native AI pair programmer. Long context and tool use.', price: 20 },
      { name: 'Codeium', why: 'Free tier for individuals. Works across IDEs. Solid completions.', price: 0 },
      { name: 'Tabnine', why: 'Privacy-focused. Can run locally. Good for enterprise.', price: 12 },
      { name: 'ChatGPT Plus', why: 'General-purpose AI works for coding. Cheaper if you already pay for it.', price: 20 },
    ]
  },
  'LastPass': {
    tagline: 'After LastPass\'s breaches, users have been migrating. Here is where they went.',
    alts: [
      { name: 'Bitwarden', why: 'Open source. Generous free tier. Never had a breach. Most common migration target.', price: 0 },
      { name: '1Password', why: 'Best UI and family sharing. Clean audit history. Used by most tech companies.', price: 2.99 },
      { name: 'Dashlane', why: 'Built-in VPN. Dark web monitoring. Good autofill.', price: 4.99 },
      { name: 'Proton Pass', why: 'End-to-end encrypted with hide-my-email aliases. Swiss privacy.', price: 1.99 },
      { name: 'Apple Passwords', why: 'Built in on Apple devices. Free. Good enough for most Apple-only users.', price: 0 },
    ]
  },
  'Dashlane': {
    tagline: 'Dashlane pricey for what you need? Other password managers might fit better.',
    alts: [
      { name: 'Bitwarden', why: 'Open source. Best free tier of any password manager. Self-hosting option.', price: 0 },
      { name: '1Password', why: 'Best UX and polish. Family sharing is excellent. No free tier though.', price: 2.99 },
      { name: 'Proton Pass', why: 'End-to-end encrypted. Email aliases built in. Cheaper than Dashlane.', price: 1.99 },
      { name: 'Apple Passwords', why: 'Built into Apple devices. Completely free. Passkey support.', price: 0 },
    ]
  },
  'Grammarly': {
    tagline: 'Grammarly worth the price? These alternatives may cover your needs.',
    alts: [
      { name: 'LanguageTool', why: 'Open source. Strong grammar and style. Privacy-focused. Free tier is generous.', price: 4.99 },
      { name: 'ProWritingAid', why: 'Deeper style analysis for writers. Lifetime option available.', price: 10 },
      { name: 'Microsoft Editor', why: 'Free with Microsoft 365. Built into Word and Edge.', price: 0 },
      { name: 'ChatGPT Plus', why: 'Just ask it to proofread. More flexible than dedicated grammar checkers.', price: 20 },
      { name: 'Hemingway Editor', why: 'One-time purchase. Focuses on readability over grammar.', price: 0 },
    ]
  },
  'Kindle Unlimited': {
    tagline: 'Kindle Unlimited catalog feeling thin? These reading subscriptions have real books.',
    alts: [
      { name: 'Audible', why: 'Audiobooks plus a growing library of reads. One credit per month plus included titles.', price: 14.95 },
      { name: 'Scribd (Everand)', why: 'Books, audiobooks, magazines, and documents in one subscription.', price: 11.99 },
      { name: 'Libby', why: 'Free with a library card. Borrow ebooks and audiobooks from your local library.', price: 0 },
      { name: 'Hoopla', why: 'Also free with a library card. Includes movies, music, and comics.', price: 0 },
      { name: 'Audible Plus', why: 'Cheaper Audible tier with unlimited included listens (no credits).', price: 7.95 },
    ]
  },
  'New York Times': {
    tagline: 'Paying for the NYT but barely reading it? These alternatives fit other news habits.',
    alts: [
      { name: 'The Washington Post', why: 'Political coverage rivals NYT. Often 50% off promos.', price: 4 },
      { name: 'The Wall Street Journal', why: 'Best for business and markets. Opinion section leans right.', price: 9.99 },
      { name: 'The Economist', why: 'Weekly global analysis. No daily churn to keep up with.', price: 20.83 },
      { name: 'Apple News+', why: 'Bundle of 300+ publications including some NYT content. One price.', price: 12.99 },
      { name: 'Ground News', why: 'Shows political bias for each story. Great for balanced media diets.', price: 9.99 },
    ]
  },
  'ExpressVPN': {
    tagline: 'ExpressVPN expensive? These VPNs offer similar speeds for less.',
    alts: [
      { name: 'NordVPN', why: 'Similar features at lower long-term prices. Meshnet and dedicated IPs.', price: 3.09 },
      { name: 'Surfshark', why: 'Unlimited devices on one plan. Cheapest 2-year deals.', price: 2.49 },
      { name: 'Mullvad VPN', why: 'Flat €5/mo. No email required. Best privacy stance.', price: 5 },
      { name: 'ProtonVPN', why: 'Free tier with unlimited data. Swiss jurisdiction. Strong audited privacy.', price: 4.99 },
    ]
  },
  'Duolingo Plus': {
    tagline: 'Duolingo not moving the needle? Actual fluency requires different tools.',
    alts: [
      { name: 'Busuu', why: 'Community corrections from native speakers. Grammar focus.', price: 13.95 },
      { name: 'Babbel', why: 'Conversational lessons. Strong for European languages. Lifetime option available.', price: 13.95 },
      { name: 'italki', why: 'Real 1-on-1 lessons with native speakers. Pay per lesson ($5-20).', price: 10 },
      { name: 'Pimsleur', why: 'Audio-first. Great for commutes. Builds real speaking ability.', price: 14.95 },
      { name: 'Anki', why: 'Free (desktop) spaced-repetition flashcards. Pair with any immersion source.', price: 0 },
    ]
  },
  'Walmart+': {
    tagline: 'Walmart+ not earning its keep? These memberships might be a better fit.',
    alts: [
      { name: 'Amazon Prime', why: 'Bigger shipping selection plus Prime Video and Music. The default benchmark.', price: 14.99 },
      { name: 'Target Circle 360', why: 'Similar benefits for Target shoppers. Same-day delivery via Shipt.', price: 8.25 },
      { name: 'Costco Gold Star', why: 'Annual fee pays for itself if you buy groceries in bulk.', price: 5 },
      { name: 'Sam\'s Club', why: 'Owned by Walmart. Bulk shopping with included gas discounts.', price: 4.17 },
    ]
  },
  'Instacart+': {
    tagline: 'Not using Instacart+ enough to justify it? These grocery delivery options work differently.',
    alts: [
      { name: 'Amazon Fresh', why: 'Included with Prime in many cities. No markups on most items.', price: 0 },
      { name: 'Walmart+', why: 'Free grocery delivery on $35+ orders. Adds gas discounts and Paramount+.', price: 12.95 },
      { name: 'Target Circle 360', why: 'Same-day grocery delivery via Shipt on $35+ orders.', price: 8.25 },
      { name: 'Shipt', why: 'Standalone alternative. Delivers from multiple stores.', price: 10.99 },
      { name: 'Store curbside pickup', why: 'Free at Walmart, Target, Kroger, and most chains. Skip delivery fees entirely.', price: 0 },
    ]
  },
  'DoorDash DashPass': {
    tagline: 'DashPass worth the $9.99? These food delivery subs may fit your habits better.',
    alts: [
      { name: 'Uber One', why: 'Free delivery on Uber Eats plus ride discounts. Bundles two services.', price: 9.99 },
      { name: 'Grubhub+', why: 'Free delivery on $12+ orders. Often cheaper fees than DoorDash.', price: 9.99 },
      { name: 'Chase Sapphire Reserve DashPass', why: 'Free DashPass for 1 year with Chase Sapphire Reserve or Preferred.', price: 0 },
      { name: 'Cook at home more', why: 'Food delivery memberships make ordering easier, not cheaper overall.', price: 0 },
    ]
  },
  'Planet Fitness': {
    tagline: 'Outgrown Planet Fitness? These gym memberships level up your training.',
    alts: [
      { name: 'Anytime Fitness', why: '24/7 access. 5000+ locations worldwide with one membership.', price: 40 },
      { name: 'LA Fitness', why: 'Pool, sauna, basketball courts, and classes. Mid-tier price.', price: 35 },
      { name: 'YMCA', why: 'Sliding scale fees. Pool, classes, and family memberships.', price: 55 },
      { name: 'Home gym (one-time)', why: 'Adjustable dumbbells and a rack pay for themselves in ~1 year vs gym fees.', price: 0 },
      { name: 'Local independent gym', why: 'Often $20-30/mo for serious lifters. No commercial gym gimmicks.', price: 25 },
    ]
  },
  'Anytime Fitness': {
    tagline: 'Anytime Fitness locked in a contract? When it ends, consider these options.',
    alts: [
      { name: 'Planet Fitness', why: 'Cheapest national chain. Basic equipment. No commitment on some plans.', price: 24.99 },
      { name: 'LA Fitness', why: 'Fuller amenities (pool, classes, basketball). Month-to-month options.', price: 35 },
      { name: 'YMCA', why: 'Sliding scale fees by income. Pool and family-friendly.', price: 55 },
      { name: 'CrossFit gym', why: 'If you like structure and community. More expensive but high engagement.', price: 150 },
      { name: 'Home gym (one-time)', why: 'Break-even in 12-18 months. Never drive to the gym again.', price: 0 },
    ]
  },
};

// Build slug map
export const ALT_SLUGS = {};
Object.keys(ALTERNATIVES).forEach(name => {
  ALT_SLUGS[name.replace(/\+/g, ' plus').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')] = name;
});
