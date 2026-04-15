// Real-browser E2E: Demo UI → signup form → dashboard import verification.
// Uses localStorage write from Demo.jsx + App.jsx first-login hook (not the
// backend-only test_handoff.mjs which bypasses the UI).
import { chromium, devices } from 'playwright';
import { readFileSync } from 'fs';

const env = Object.fromEntries(readFileSync('.env.local','utf8').trim().split('\n').map(l=>l.split('=')));
const BASE = process.env.BASE_URL || 'http://localhost:5173';
const MODE = process.argv[2] || 'desktop'; // 'desktop' | 'mobile'

const rand = Math.random().toString(36).slice(2,10);
const email = `browser-test-${MODE}-${rand}@subtrim-test.dev`;
const password = `Test-${rand}-Pass!9`;

const log = (...a) => console.log(...a);
const ok = (m) => log(`  ✓ ${m}`);
const fail = (m) => { log(`  ✗ ${m}`); process.exit(1); };

// Subs to pick in the demo UI (mix known + custom)
const PICKS = ['Netflix', 'Spotify', 'ChatGPT Plus'];
const CUSTOM = { name: 'Strava Premium', price: '11.99' };

const browser = await chromium.launch();
const ctxOpts = MODE === 'mobile' ? devices['iPhone 12'] : {};
const ctx = await browser.newContext(ctxOpts);
const page = await ctx.newPage();
page.on('pageerror', e => log('  [page error]', e.message));
page.on('console', m => { if (m.type() === 'error') log('  [console.error]', m.text()); });

log(`\n=== Browser Handoff Test [${MODE}] ===`);
log(`Email: ${email}`);
log(`Viewport: ${ctxOpts.viewport ? `${ctxOpts.viewport.width}x${ctxOpts.viewport.height}` : 'default 1280x720'}`);

// 1. Load demo
log(`\n[1] Load /demo`);
await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Pick your subscriptions', { timeout: 10000 });
ok('picker loaded');

// 2. Pick services
log(`\n[2] Pick ${PICKS.length} services + 1 custom`);
for (const name of PICKS) {
  await page.locator(`button:has-text("${name}")`).first().click();
  ok(`picked ${name}`);
}
// Add custom
await page.locator('button:has-text("Add custom subscription")').click();
await page.locator('input[placeholder*="LinkedIn"]').fill(CUSTOM.name);
await page.locator('input[placeholder="9.99"]').fill(CUSTOM.price);
await page.locator('button:has-text("Add")').last().click();
ok(`added custom: ${CUSTOM.name} $${CUSTOM.price}`);

// 3. Start audit
log(`\n[3] Start audit`);
await page.locator('button:has-text("Start Audit →")').click();
await page.waitForSelector('text=Ready to audit', { timeout: 5000 });
ok('overview shown');
await page.locator('button:has-text("Start Audit")').last().click();

// 4. Walk through audit (each sub: freq + star + miss + next)
const total = PICKS.length + 1;
log(`\n[4] Audit ${total} subs`);
for (let i = 0; i < total; i++) {
  await page.waitForSelector(`text=${i+1}/${total}`, { timeout: 5000 });
  await page.locator('button:has-text("Daily")').click();
  // Click 4-star (4th star button)
  const stars = page.locator('button[aria-label$="stars"], button[aria-label="1 out of 5 stars"]');
  await stars.nth(3).click();
  await page.locator('button:has-text("Yes")').click();
  const nextBtn = i < total - 1
    ? page.locator('button:has-text("Next")')
    : page.locator('button:has-text("Finish Audit")');
  await nextBtn.click();
  ok(`audited sub ${i+1}/${total}`);
}

// 5. Results screen
log(`\n[5] Results screen`);
await page.waitForSelector('text=SubScore', { timeout: 5000 });
const stored = await page.evaluate(() => localStorage.getItem('subtrim_demo'));
if (!stored) fail('localStorage subtrim_demo missing');
const parsed = JSON.parse(stored);
ok(`localStorage has ${parsed.subs.length} subs, ts=${new Date(parsed.ts).toISOString()}`);
if (parsed.subs.length !== total) fail(`expected ${total}, got ${parsed.subs.length}`);

// 6. Click "Save & Create Account" → /app
log(`\n[6] Navigate to signup`);
await page.locator('a:has-text("Save & Create Account")').click();
await page.waitForURL(`${BASE}/app`, { timeout: 5000 });
await page.waitForSelector('text=or continue with email', { timeout: 10000 });
ok('on /app auth screen');

// 7. Switch to signup and submit
log(`\n[7] Create account`);
await page.locator('button:has-text("Sign Up")').first().click();
await page.locator('input[placeholder="Your name"]').fill('Browser Test');
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);
await page.locator('button:has-text("Create Account")').click();
ok('submitted signup');

// 8. Wait for dashboard
log(`\n[8] Wait for dashboard`);
// Dashboard shows subscription rows or total-spend text. Wait for any of the picked names.
try {
  await page.waitForSelector('text=Netflix', { timeout: 20000 });
} catch (e) {
  const snap = await page.content();
  log(snap.slice(0, 2000));
  fail('Netflix did not render on dashboard within 20s');
}
ok('Netflix visible on dashboard');

// Verify all picks + custom show up
const bodyText = await page.locator('body').textContent();
const missing = [...PICKS, CUSTOM.name].filter(n => !bodyText.includes(n));
if (missing.length) fail(`missing on dashboard: ${missing.join(', ')}`);
ok(`all ${PICKS.length + 1} subs visible on dashboard`);

log(`\n=== Summary ===`);
log(`  Picked in UI:      ${PICKS.length + 1}`);
log(`  localStorage:      ${parsed.subs.length}`);
log(`  Dashboard visible: ${PICKS.length + 1 - missing.length}`);
log(`  Test user:         ${email}`);
log(`  PASS ✓`);

await browser.close();
