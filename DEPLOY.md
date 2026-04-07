# SubTrim Deployment Guide

## 1. Deploy Frontend to Vercel

### First-time setup

1. Push this repo to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click **Add New Project**, import your SubTrim repo
4. Vercel auto-detects Vite. Confirm:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your `sb_publishable_...` key
6. Click **Deploy**

### Custom domain

1. In Vercel project → **Settings → Domains**, add `subtrim.dev`
2. Vercel gives you DNS records (either A/AAAA or CNAME)
3. In your Namecheap DNS settings, add the records Vercel provides
4. Wait for DNS propagation (usually 5-30 min)
5. Vercel auto-provisions SSL

### Future deploys

Every push to `main` auto-deploys. Preview deploys for branches/PRs.

---

## 2. Deploy Supabase Edge Functions

### Prerequisites

Install the Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Deploy functions

```bash
supabase functions deploy delete-account
supabase functions deploy send-notifications
```

### Set secrets

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

The functions automatically have access to `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 3. Set Up Resend (Email)

1. Sign up at [resend.com](https://resend.com)
2. Go to **Domains** → Add `subtrim.dev`
3. Add the DNS records Resend provides (SPF, DKIM, DMARC) in Namecheap
4. Wait for verification (can take up to 48 hours, usually minutes)
5. Go to **API Keys** → Create a key
6. Set it in Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

### Test email sending

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-notifications \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily"}'
```

---

## 4. Set Up pg_cron (Scheduled Notifications)

In the Supabase SQL Editor, run:

```sql
-- Enable the extensions (if not already)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Daily notifications at 9 AM UTC
SELECT cron.schedule(
  'daily-notifications',
  '0 9 * * *',
  $$SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/send-notifications',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{"type": "daily"}'::jsonb
  )$$
);

-- Monthly digest on the 1st of each month at 10 AM UTC
SELECT cron.schedule(
  'monthly-digest',
  '0 10 1 * *',
  $$SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/send-notifications',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{"type": "monthly_digest"}'::jsonb
  )$$
);
```

Replace `YOUR_PROJECT` and `YOUR_SERVICE_ROLE_KEY` with your actual values.

### Verify cron jobs

```sql
SELECT * FROM cron.job;
```

### View job run history

```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## 5. DNS Summary (Namecheap)

You'll need these DNS records for `subtrim.dev`:

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| A or CNAME | @ | (from Vercel) | Frontend |
| TXT | @ | (from Resend - SPF) | Email auth |
| CNAME | (from Resend) | (from Resend - DKIM) | Email auth |
| TXT | _dmarc | (from Resend - DMARC) | Email auth |

---

## 6. Post-Deploy Checklist

- [ ] Visit `https://subtrim.dev` — landing page loads
- [ ] Sign up with a test email — confirm auth works
- [ ] Add a subscription — confirm Supabase CRUD works
- [ ] Test password reset — confirm email arrives
- [ ] Test "Add to Home Screen" on mobile — PWA installs
- [ ] Share link on Twitter/Slack — OG image preview shows
- [ ] Test account deletion — confirm Edge Function works
- [ ] Check [Google Search Console](https://search.google.com/search-console) — submit sitemap
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) — confirm performance

---

## Regenerating Icons

If you update `public/icon.svg` or `public/og.svg`, regenerate PNGs:

```bash
node scripts/generate-icons.mjs
```

This creates `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and `og.png`.
