# CLAUDE.md — SubTrim Project Context

## What This Project Is

SubTrim is a subscription tracker and optimizer web app. It goes beyond basic tracking (which apps like Rocket Money already do for free) by telling users exactly what to cut: a usage audit survey with keep/cancel/downgrade recommendations, an overlap detector, a shareable savings receipt, a promo aggregator, a "What If" cost simulator, and household sharing.

The name is **SubTrim**. Domain is **subtrim.dev** (registered and live).

Product positioning: **"People just want to save money."** All UI leads with savings dollars, not gamified scores.

## Tech Stack

- **Frontend:** React 19 + Vite, JSX, multi-page with prerendered SSR for SEO
- **Routing:** react-router-dom with code-splitting (lazy-loaded pages)
- **Styling:** Inline styles, Revolut-inspired dark fintech UI (pure black #0d0d0d bg, #141414 surfaces, #00d48a green accent, Inter font)
- **Backend:** Supabase (Postgres + Auth + Row Level Security + Edge Functions ready)
- **Hosting:** Vercel (prerendered static + SPA fallback)
- **Export:** html2canvas for shareable savings receipt PNG
- **Future email:** Resend or SendGrid via Supabase Edge Functions + pg_cron

## Current State — Launch Ready

The app is live and wired end-to-end. Demo works standalone (no signup). The authenticated dashboard at `/app` is fully functional against real Supabase.

### What's Built and Working
- **Real Supabase auth** — email/password signup, sign-in, Google OAuth, password reset, session persistence via `onAuthStateChange`
- **Subscription CRUD** — add (catalog + custom), edit (cost/cycle/renewal/tags/notes/trial), archive (soft delete via `archived_at`)
- **Audit flow** — card-based survey writes to `usage_surveys`, updates `last_audited_at`, generates keep/cancel/downgrade recommendations
- **Savings receipt** — torn-paper export card with crossed-out cuts, downgrade arrows, annual savings highlight. Exports as PNG via html2canvas
- **Overlap detector** — tag-based matching (music_streaming, cloud_storage, vpn, etc) across `known_services`
- **Promos + price changes** — fetched from DB, filterable, dismissible
- **Household** — create/join/leave with invite codes, cross-member subscription visibility (non-private only)
- **Account** — avatar picker, email preferences, category budgets with progress bars, CSV import/export, currency + theme persisted to `profiles`
- **Demo** (`/demo`) — fully standalone audit flow, no signup, runs entirely in-browser
- **Calculator** (`/calculator`) — public ROI calculator for savings
- **Alerts** — two-level dismiss (Ignore = session, Don't Show Again = permanent)
- **Local→cloud migration** — anonymous users can build a sub list, migrates to their account on signup

### SEO Layer (193 prerendered static pages)
- `/guides/cancel/:service` — one per service in CANCEL_GUIDES
- `/compare/:slug` — pairwise comparisons (same-category auto-generated)
- `/alternatives/:service` — 3-5 alternatives each
- `/worth-it/:service` — verdict (yes/no/conditional) + pros/cons + break-even math
- `/blog/:slug` — BlogPost entries
- Sitemap.xml auto-includes all routes; IndexNow script pushes to Bing

### What's NOT Built Yet
- Email digests / renewal reminders (schema ready, needs Edge Function + pg_cron)
- Automated promo scraping (promos are currently manually curated)
- SubTrim Wrapped (annual feature, "Coming December 2026" teaser only)
- Mobile native apps (web is mobile-responsive)

## Database Schema (9 tables)

All defined in `supabase_migration.sql`, live in production:

1. **profiles** — extends auth.users, has category_budgets (JSONB), email_preferences (JSONB), currency, theme, onboarding_complete
2. **households** — name, invite_code, created_by
3. **household_members** — household_id, user_id, role (owner/member)
4. **known_services** — 75 seeded services with name, category, typical prices, family plan info, tags (for overlap detection)
5. **subscriptions** — user_id, service_id (nullable FK), custom_name, custom_category, custom_tags, monthly_cost, billing_cycle, renewal_date, is_trial, trial_end_date, status, is_private, notes, last_audited_at, archived_at
6. **usage_surveys** — subscription_id, frequency, satisfaction (1-5), would_miss
7. **promos** — service_id, discount_percent, promo_type, valid dates, source
8. **price_changes** — service_id, old/new price, effective_date
9. **score_history** — **deprecated**. SubScore was scrapped in favor of dollar-value savings. Table still exists, no longer written to. Safe to drop in a future migration.

RLS policies enforce: users see only their own data, household members can see non-private subs of other members, known_services and promos are readable by all authenticated users. Auto-profile creation trigger on auth.users insert.

## Design Decisions (Important Context)

- **Savings over scores** — SubScore (gamified 0-100 number) was scrapped. All UI leads with dollars saved. The Ring component was deleted. Account header, audit flow, and dashboard all show `$X saved` as the hero metric.
- **Revolut UI style** — Dark fintech aesthetic. Transaction-list layout for subscriptions (not card grids). Category spending bar at top. Circular avatars. Negative-sign cost display (-$15.49). Minimal borders, left-accent bars on alerts.
- **No streak counter** — Removed because opening a subscription tracker daily isn't meaningful. Saved counter exists but is subtle (small text line, not a hero element).
- **"Remove" not "Archive"** — User-facing language says "Remove." Backend soft-deletes via `archived_at` timestamp.
- **Alert dismiss system** — Two levels: "Ignore" (session only) and "Don't Show Again" (permanent, stored in state).
- **No badges/trophy case** — Kept Account clean.
- **SubTrim Wrapped** — Annual feature, "Coming December 2026" teaser only. Modeled after Spotify Wrapped. Will be a swipeable story format when built.
- **Overlap detection** — Uses tags array on known_services (e.g., `["music_streaming", "podcasts"]`). Custom subscriptions can have custom_tags.
- **Receipt-style share card** — Audit results render as a torn-paper receipt with crossed-out cuts and downgrade arrows. Intentionally evocative of a shopping receipt. Exports as PNG with subtrim.dev watermark.
- **Archive instead of delete** — Never hard delete subscriptions. `archived_at` hides from UI but preserves history for savings calculations.
- **Saved counter** — Calculated from: (monthly cost of removed subs × months since removal) + annual billing savings + promo redemption savings.
- **Demo is its own page** — `/demo` is fully standalone so we can link it from HN/directories without forcing signup. It mirrors the audit flow from the authed app.

## Key Files

### App shell
- `src/main.jsx` — React mount point, router, lazy-loaded routes, ErrorBoundary, Suspense
- `src/App.jsx` — **Authenticated dashboard** (~1680 lines). Contains Dash/Audit/Promos/Acct sub-components, all Supabase wiring, audit logic, receipt export
- `index.html` — Vite HTML entry
- `vite.config.js` — Vite config

### Pages (each lazy-loaded, prerendered for SEO)
- `src/pages/Landing.jsx`, `Demo.jsx`, `Calculator.jsx`
- `src/pages/Guides.jsx`, `CancelGuide.jsx`
- `src/pages/Compare.jsx`, `CompareIndex.jsx`
- `src/pages/Alternatives.jsx`, `AlternativesIndex.jsx`
- `src/pages/WorthIt.jsx`
- `src/pages/Blog.jsx`, `BlogPost.jsx`
- `src/pages/Privacy.jsx`, `Terms.jsx`, `NotFound.jsx`

### Data
- `src/data/serviceData.js` — TIERS, SERVICE_CATS, COMPARE_PAIRS
- `src/data/cancelGuides.js` — per-service cancel instructions
- `src/data/alternatives.js` — competitor alternatives per service
- `src/data/compareData.js` — head-to-head comparison data
- `src/data/worthIt.js` — verdict + break-even data for /worth-it/* pages
- `src/data/blogPosts.js` — blog content
- `src/data/appConstants.js` — CATS, LABELS, AUTO_PROMOS, TH (themes), CURRENCIES, button base (B), etc

### Components
- `src/components/shared.jsx` — `Av` (avatar circle), `Confetti`
- `src/components/Helmet.jsx` — per-route SEO meta tags (works with SSR + client)
- `src/components/CursorGlow.jsx` — landing-only cursor effect (excluded from /app)

### Infra / Build
- `supabase_migration.sql` — Schema, indexes, RLS, seed data (75 services, 20 promos, 3 price changes)
- `src/entry-prerender.jsx` — SSR entry for static HTML generation
- `scripts/prerender.mjs` — runs entry-prerender across all routes
- `scripts/screenshots.mjs` — Playwright marketing screenshots (`npm run screenshots`)
- `scripts/indexnow.mjs` — submits sitemap URLs to Bing (`npm run indexnow`)
- `public/sitemap.xml` — auto-updated with all routes
- `.env.local` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (not committed)

### Marketing
- `marketing/directories.csv` — 30 ranked launch directories
- `marketing/submission-copy.md` — paste-ready taglines/descriptions
- `marketing/show-hn.md` — Show HN draft + comment playbook
- `marketing/product-hunt-kit.md` — PH launch kit
- `marketing/blogger-outreach.md` — cold email template + target list
- `marketing/twitter-launch-thread.md` — 10-tweet launch thread
- `marketing/README.md` — execution order

## Supabase Keys

Supabase moved to new key formats in 2025-2026. Use `sb_publishable_...` (drop-in replacement for the old `eyJ...` JWT anon key) in frontend code. Never put `sb_secret_...` in frontend.

`.env.local`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Publishable key location: Supabase Dashboard → Project Settings → API Keys → Publishable key.

## Next Work (post-launch)

1. **Email digests** — Edge Function + pg_cron for renewal reminders, monthly audit prompts, promo alerts
2. **Automated promo scraping** — currently manually curated in `promos` table
3. **Browser extension** — detect subscriptions during checkout, add to SubTrim
4. **Paid tier** — household >2 members, concierge cancellation, monthly promo digest
5. **SubTrim Wrapped** — December 2026 annual feature, swipeable story format
6. **Drop score_history** — write a migration once confirmed no analytics rely on it

## Code Patterns

- App.jsx is one big component holding state for the authed dashboard. Dash/Audit/Promos/Acct are defined as const arrow functions inside App and called as functions (not JSX children) to avoid remount.
- Marketing/SEO pages (`src/pages/*`) are each self-contained, lazy-loaded, and prerendered.
- Inline styles everywhere. No CSS files, no Tailwind.
- Color constants: bg=#0d0d0d, surface=#141414, elevated=#1f1f1f, border=#1a1a1a or #222, accent=#00d48a, danger=#ef4444, warning=#f59e0b, text=#fff, muted=#666, dim=#444
- Font: Inter, via Google Fonts in index.html
- Button base style: `B` from `src/data/appConstants.js`
- Shared components still exported: `Av`, `Confetti` (Ring was removed with SubScore)

## User Preferences

- The user (Guagwi) prefers direct, experienced-level answers
- Catches and corrects inaccuracies
- Wants suggestions proactively offered
- Based in Columbia, South Carolina
- Graduate student in sports medicine
