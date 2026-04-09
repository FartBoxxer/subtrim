// Shared service data for SEO pages
// Source of truth for tiers is App.jsx TIERS const — this mirrors it for SEO pages

export const TIERS={
  'Netflix':[{n:'Standard with Ads',p:6.99},{n:'Standard',p:15.49},{n:'Premium',p:22.99}],
  'Hulu':[{n:'With Ads',p:7.99},{n:'No Ads',p:17.99},{n:'Live TV',p:76.99}],
  'Disney+':[{n:'Basic',p:7.99},{n:'Premium',p:13.99},{n:'Bundle (w/ Hulu & ESPN+)',p:14.99}],
  'HBO Max':[{n:'With Ads',p:9.99},{n:'No Ads',p:15.99},{n:'Ultimate',p:19.99}],
  'Paramount+':[{n:'Essential',p:5.99},{n:'With Showtime',p:11.99}],
  'Peacock':[{n:'Premium',p:5.99},{n:'Premium Plus',p:11.99}],

  'YouTube Premium':[{n:'Individual',p:13.99},{n:'Family',p:22.99},{n:'Student',p:7.99}],
  'Spotify':[{n:'Individual',p:10.99},{n:'Duo',p:14.99},{n:'Family',p:16.99},{n:'Student',p:5.99}],
  'Apple Music':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'Student',p:5.99}],
  'Tidal':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'HiFi Plus',p:19.99}],
  'YouTube Music':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'Student',p:5.49}],
  'Xbox Game Pass':[{n:'Core',p:9.99},{n:'Standard',p:14.99},{n:'Ultimate',p:19.99}],
  'PlayStation Plus':[{n:'Essential',p:9.99},{n:'Extra',p:14.99},{n:'Premium',p:17.99}],
  'ChatGPT Plus':[{n:'Plus',p:20},{n:'Pro',p:200}],
  'Claude Pro':[{n:'Pro',p:20},{n:'Team',p:25}],
  'Adobe Creative Cloud':[{n:'Photography',p:9.99},{n:'Single App',p:22.99},{n:'All Apps',p:54.99}],
  'Microsoft 365':[{n:'Personal',p:9.99},{n:'Family',p:12.99}],
  'NordVPN':[{n:'Basic',p:12.99},{n:'Plus',p:13.99},{n:'Complete',p:14.99}],
  'Dropbox':[{n:'Plus',p:11.99},{n:'Professional',p:22},{n:'Family',p:19.99}],
  '1Password':[{n:'Individual',p:2.99},{n:'Family',p:4.99}],
  'Apple TV+':[{n:'Monthly',p:9.99},{n:'Apple One Individual',p:19.95},{n:'Apple One Family',p:25.95}],
  'Crunchyroll':[{n:'Fan',p:7.99},{n:'Mega Fan',p:9.99},{n:'Ultimate Fan',p:14.99}],
  'Amazon Prime Video':[{n:'Prime Video Only',p:8.99},{n:'Amazon Prime',p:14.99}],
  'Google One':[{n:'100 GB',p:2.99},{n:'2 TB',p:9.99}],
  'iCloud+':[{n:'50 GB',p:0.99},{n:'200 GB',p:2.99},{n:'2 TB',p:9.99}],
  'Notion':[{n:'Plus',p:8},{n:'Business',p:15}],
};

export const CATS = {
  streaming:{l:"Streaming",c:"#e74c3c",e:"🎬"},music:{l:"Music",c:"#a855f7",e:"🎵"},
  gaming:{l:"Gaming",c:"#2ecc71",e:"🎮"},productivity:{l:"Productivity",c:"#3498db",e:"💼"},
  fitness:{l:"Fitness",c:"#e67e22",e:"💪"},news:{l:"News",c:"#1abc9c",e:"📰"},
  creative:{l:"Creative",c:"#f39c12",e:"🎨"},security:{l:"Security",c:"#607d8b",e:"🔒"},
  ai:{l:"AI",c:"#8b5cf6",e:"🤖"},cloud:{l:"Cloud",c:"#06b6d4",e:"☁️"},
  vpn:{l:"VPN",c:"#607d8b",e:"🛡️"},passwords:{l:"Passwords",c:"#78909c",e:"🔑"},
  lifestyle:{l:"Lifestyle",c:"#ec4899",e:"✨"},education:{l:"Education",c:"#14b8a6",e:"📚"},
};

// Category mapping for each service (for compare pages)
export const SERVICE_CATS={
  'Netflix':'streaming','Hulu':'streaming','Disney+':'streaming','HBO Max':'streaming',
  'Paramount+':'streaming','Peacock':'streaming','Apple TV+':'streaming','YouTube Premium':'streaming',
  'Amazon Prime Video':'streaming','Crunchyroll':'streaming',
  'Spotify':'music','Apple Music':'music','Tidal':'music','YouTube Music':'music',
  'Xbox Game Pass':'gaming','PlayStation Plus':'gaming',
  'ChatGPT Plus':'ai','Claude Pro':'ai',
  'Adobe Creative Cloud':'creative',
  'Microsoft 365':'productivity','Notion':'productivity',
  'NordVPN':'vpn','1Password':'passwords',
  'Dropbox':'cloud','Google One':'cloud','iCloud+':'cloud',
};

// Common comparison pairs for generating routes
export const COMPARE_PAIRS=[
  // Streaming
  ['Netflix','Hulu'],['Netflix','Disney+'],['Netflix','HBO Max'],
  ['Netflix','Amazon Prime Video'],['Netflix','Apple TV+'],['Netflix','Paramount+'],
  ['Hulu','Disney+'],['Hulu','Paramount+'],['Hulu','Peacock'],
  ['Disney+','HBO Max'],['Disney+','Paramount+'],['Disney+','Apple TV+'],
  ['HBO Max','Paramount+'],['HBO Max','Peacock'],['HBO Max','Apple TV+'],
  ['Amazon Prime Video','Hulu'],['Amazon Prime Video','Disney+'],
  ['Peacock','Paramount+'],['Apple TV+','Peacock'],
  ['YouTube Premium','Netflix'],
  // Music
  ['Spotify','Apple Music'],['Spotify','YouTube Music'],['Spotify','Tidal'],
  ['Apple Music','YouTube Music'],['Apple Music','Tidal'],
  ['YouTube Music','Tidal'],
  // AI
  ['ChatGPT Plus','Claude Pro'],
  // Gaming
  ['Xbox Game Pass','PlayStation Plus'],
  // Cloud
  ['Dropbox','Google One'],['Dropbox','iCloud+'],['Google One','iCloud+'],
  // Productivity
  ['Microsoft 365','Notion'],
];
