// Submit all URLs from public/sitemap.xml to Bing/Yandex via IndexNow for fast indexing.
// Usage: `npm run indexnow` (after deploy)
//
// Setup (one time):
// 1. Generate a key: any 8-128 char hex string. Example: openssl rand -hex 16
// 2. Save to `public/<key>.txt` containing just the key (IndexNow verification)
// 3. Set INDEXNOW_KEY env var to the same string
// 4. Deploy so the key file is reachable at https://subtrim.dev/<key>.txt
//
// Docs: https://www.indexnow.org/documentation

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP = join(__dirname, '..', 'public', 'sitemap.xml');

const KEY = process.env.INDEXNOW_KEY;
const HOST = 'subtrim.dev';

if (!KEY) {
  console.error('Set INDEXNOW_KEY env var. Generate with: openssl rand -hex 16');
  console.error('Then save the same value to public/<key>.txt and deploy.');
  process.exit(1);
}

const xml = await readFile(SITEMAP, 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

if (!urlList.length) {
  console.error('No <loc> entries found in sitemap.xml');
  process.exit(1);
}

console.log(`[indexnow] submitting ${urlList.length} URLs to Bing IndexNow`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (res.ok) {
  console.log(`[indexnow] ✓ submitted (HTTP ${res.status})`);
  console.log('URLs will appear in Bing within hours, Yandex within days.');
} else {
  const text = await res.text();
  console.error(`[indexnow] ✗ failed (HTTP ${res.status}): ${text}`);
  process.exit(1);
}
