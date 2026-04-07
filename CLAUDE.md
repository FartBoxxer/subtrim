# CLAUDE.md — SubTrim Project Context

## What This Project Is

SubTrim is a subscription tracker and optimizer web app. It goes beyond basic tracking (which apps like Rocket Money already do for free) by offering features no existing tool provides: a usage audit survey with keep/cancel/downgrade recommendations, a promo aggregator for subscription deals, an overlap detector, a "What If" cost simulator, household sharing, and a gamified SubScore.

The name is **SubTrim**. Domain is **subtrim.dev** (registered).

## Tech Stack

- **Frontend:** React (Vite, JSX) — single-file app currently
- **Styling:** Inline styles, Revolut-inspired dark fintech UI (pure black #0d0d0d bg, #141414 surfaces, #00d48a green accent, Inter font, transaction-list layouts, category spending bars)
- **Backend:** Supabase (Postgres + Auth + Row Level Security + Edge Functions)
- **Future email:** Resend or SendGrid via Supabase Edge Functions + pg_cron

## Current State

### What's Built (Phase 1-2)
- Full interactive prototype in `src/App.jsx` with mock data
- Login/signup auth screen (mock — needs Supabase wiring)
- Dashboard: total spend, category spending breakdown bar, SubScore ring, trial countdown section, subscription transaction list, What If simulator, renewal calendar
- Audit: card-based survey flow (frequency/satisfaction/would-miss), recommendation engine (keep/cancel/downgrade), shareable audit report card, overlap detector
- Promos: filterable deal feed, price change alerts, relevance tagging
- Account: avatar picker (12 presets), email preferences (Coming Soon), category budgets with progress bars, household create/join, CSV import/export, SubTrim Wrapped teaser (Coming December 2026)
- Alerts with Ignore and Don't Show Again options
- Confetti celebrations, toast notifications, floating add button, bottom nav with badge counts

### What's NOT Built Yet
- Real Supabase integration (auth, CRUD, queries) — currently all mock data
- The SQL migration file exists (`supabase_migration.sql`) but hasn't been run against a live project
- No real subscription add/edit forms (the add modal is placeholder)
- No CSV import/export logic
- No household backend
- No email notifications (schema exists, wiring is future)

## Database Schema (9 tables)

All defined in `supabase_migration.sql`:

1. **profiles** — extends auth.users, has category_budgets (JSONB), email_preferences (JSONB), currency, theme, onboarding_complete
2. **households** — name, invite_code, created_by
3. **household_members** — household_id, user_id, role (owner/member)
4. **known_services** — 75 seeded services with name, category, typical prices, family plan info, tags (text array for overlap detection)
5. **subscriptions** — user_id, service_id (nullable FK), custom_name, custom_category, custom_tags, monthly_cost, billing_cycle, renewal_date, is_trial, trial_end_date, status, is_private, notes, last_audited_at, archived_at
6. **usage_surveys** — subscription_id, frequency, satisfaction (1-5), would_miss
7. **promos** — service_id, discount_percent, promo_type, valid dates, source
8. **price_changes** — service_id, old/new price, effective_date
9. **score_history** — user_id, score, total_monthly_spend, calculated_at

RLS policies enforce: users see only their own data, household members can see non-private subs of other members, known_services and promos are readable by all authenticated users. Auto-profile creation trigger on auth.users insert.

## Build Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Foundation | ✅ Done | Prototype UI, SQL migration, seed data, page shells |
| 2 — Auth | 🟡 Partial | Auth screens built, mock auth works, needs Supabase wiring |
| 3 — Dashboard + CRUD | ❌ Next | Wire real subscription add/edit/remove to Supabase, fetch from DB |
| 4 — Audit + Score | ❌ | Survey saves to DB, score calculation + history, overlap detection from tags |
| 5 — Promos + Household | ❌ | Promo feed from DB, household create/join, cross-member overlaps |
| 6 — Polish | ❌ | Budgets enforcement, CSV import/export, Wrapped placeholder, dark mode persistence |
| Future | ❌ | Email digests via Edge Functions + pg_cron, automated promo scraping |

## Design Decisions (Important Context)

- **Revolut UI style** — Dark fintech aesthetic. Transaction-list layout for subscriptions (not card grids). Category spending bar at top. Circular avatars. Negative-sign cost display (-$15.49). Minimal borders, left-accent bars on alerts.
- **No streak counter** — Removed because opening a subscription tracker daily isn't meaningful. Saved counter exists but is subtle (small text line, not a hero element).
- **"Remove" not "Archive"** — User-facing language says "Remove." Backend soft-deletes via archived_at timestamp.
- **Alert dismiss system** — Two levels: "Ignore" (session only) and "Don't Show Again" (permanent, stored in state, should persist to profiles JSONB in Supabase).
- **No badges/trophy case** — Removed from Account page to keep it clean.
- **SubTrim Wrapped** — Annual feature, "Coming December 2026" teaser only. Modeled after Spotify Wrapped. Will be a swipeable story format when built.
- **Overlap detection** — Uses tags array on known_services (e.g., ["music_streaming", "podcasts"]). Custom subscriptions can optionally have custom_tags for overlap matching.
- **SubScore algorithm** — Weighted average of per-subscription efficiency scores (usage×0.4 + satisfaction×0.3 + would_miss×0.3), with global modifiers for overlaps, budget compliance, audit freshness. Hidden until first audit is completed. Floor 0, ceiling 100.
- **Archive instead of delete** — Never hard delete subscriptions. archived_at timestamp hides from UI but preserves history for Year-in-Review and savings calculations.
- **Saved counter** — Calculated from: (monthly cost of removed subs × months since removal) + annual billing savings + promo redemption savings.

## Key Files

- `src/App.jsx` — The entire app (single file, ~550 lines)
- `src/main.jsx` — React mount point (StrictMode + createRoot)
- `index.html` — Vite HTML entry point
- `vite.config.js` — Vite config with React plugin
- `supabase_migration.sql` — Full schema, indexes, RLS policies, seed data (75 services, 20 promos, 3 price changes)
- `subtrim-app.jsx` — Original source reference copy (canonical version is `src/App.jsx`)
- `.env.local` — Supabase URL and publishable key (not committed)
- `SETUP.md` — Local dev setup instructions

## Pending Edits Needed Before Wiring Supabase

Supabase updated their API keys in 2025-2026. New projects use `sb_publishable_...` format instead of the old `eyJ...` JWT anon keys. The new key is a drop-in replacement — the Supabase JS client accepts it identically. The following files need updates when wiring real Supabase:

### `.env.local`
Use `VITE_SUPABASE_PUBLISHABLE_KEY` instead of `VITE_SUPABASE_ANON_KEY`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```
The publishable key is found in Supabase Dashboard → Project Settings → API Keys → Publishable key section. Do NOT use the Secret key (`sb_secret_...`) in frontend code.

### `src/App.jsx`
The Supabase client comment block near the top of the file still references the old format. When wiring real Supabase, initialize with:
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

### `SETUP.md`
Three references to the old key format need updating:
1. Step 3 says to copy the "anon public" key — change to "Publishable key (starts with sb_publishable_...)"
2. The `.env.local` example uses `VITE_SUPABASE_ANON_KEY` — change to `VITE_SUPABASE_PUBLISHABLE_KEY`
3. The "Wiring Real Auth" section's createClient call uses `VITE_SUPABASE_ANON_KEY` — change to `VITE_SUPABASE_PUBLISHABLE_KEY`
4. The troubleshooting "Invalid API key" section should mention the `sb_publishable_` format

## What To Do Next (Phase 3)

1. Wire Supabase auth (replace mock handleAuth with supabase.auth.signUp/signInWithPassword, add session persistence via onAuthStateChange)
2. Fetch subscriptions from Supabase on login
3. Build real add-subscription form with autocomplete against known_services table
4. Wire remove (archive) to Supabase update
5. Wire audit survey answers to usage_surveys table
6. Calculate and store SubScore in score_history

## Code Patterns

- All state is in the root App component (no context/redux)
- Inline styles everywhere (no CSS files, no Tailwind classes)
- Components are defined inside App as const arrow functions (Dash, Audit, Promos, Acct), called as functions not JSX to avoid remount issues
- Color constants: bg=#0d0d0d, surface=#141414, elevated=#1f1f1f, border=#1a1a1a or #222, accent=#00d48a, danger=#ef4444, warning=#f59e0b, text=#fff, muted=#666, dim=#444
- Font: Inter (loaded via Google Fonts import in style tag)
- Button base style stored in const B
- Shared components: Ring (score ring), Confetti, Pill (tag/badge), Card (surface container)

## User Preferences

- The user (Guagwi) prefers direct, experienced-level answers
- Catches and corrects inaccuracies
- Wants suggestions proactively offered
- Based in Columbia, South Carolina
- Graduate student in sports medicine
