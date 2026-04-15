// Automated marketing screenshot capture.
// Usage: `npm run screenshots` (after `npm run preview` or against live subtrim.dev)
// Env: SCREENSHOT_BASE_URL (default: http://localhost:4173)
// Output: marketing/screenshots/*.png at 1600x1000 (directory-friendly)

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'marketing', 'screenshots');
const BASE = process.env.SCREENSHOT_BASE_URL || 'http://localhost:4173';

const shots = [
  { name: '01-landing-hero',    path: '/',            scrollTo: 0,    wait: 800 },
  { name: '02-landing-features', path: '/',           scrollTo: 900,  wait: 500 },
  { name: '03-demo-picker',    path: '/demo',         scrollTo: 0,    wait: 800 },
  { name: '04-calculator',     path: '/calculator',   scrollTo: 0,    wait: 500 },
  { name: '05-worth-it-netflix', path: '/worth-it/netflix', scrollTo: 0, wait: 500 },
  { name: '06-cancel-guide',   path: '/guides/cancel/netflix', scrollTo: 0, wait: 500 },
  { name: '07-alternatives',   path: '/alternatives/netflix', scrollTo: 0, wait: 500 },
  { name: '08-compare',        path: '/compare/netflix-vs-hulu', scrollTo: 0, wait: 500 },
  { name: '09-blog',           path: '/blog',         scrollTo: 0,    wait: 500 },
  { name: '10-guides-index',   path: '/guides',       scrollTo: 0,    wait: 500 },
];

async function capture() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2, // retina-quality
  });
  const page = await ctx.newPage();

  for (const s of shots) {
    const url = `${BASE}${s.path}`;
    console.log(`[shot] ${s.name}  →  ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      if (s.scrollTo) await page.evaluate(y => window.scrollTo(0, y), s.scrollTo);
      await page.waitForTimeout(s.wait);
      await page.screenshot({
        path: join(OUT, `${s.name}.png`),
        fullPage: false,
      });
    } catch (err) {
      console.warn(`[skip] ${s.name}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✓ Screenshots saved to ${OUT}`);
  console.log('Use these for Product Hunt, AlternativeTo, SaaSHub, etc.');
}

capture().catch(err => { console.error(err); process.exit(1); });
