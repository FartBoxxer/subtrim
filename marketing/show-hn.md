# Show HN Draft

## Title (80 char limit — pick one)

1. `Show HN: SubTrim – Audit your subscriptions in 3 minutes, no bank connection` (76 chars) ✅
2. `Show HN: A subscription tracker that tells you what to cancel` (61 chars) ✅
3. `Show HN: SubTrim – find which subscriptions to cancel without linking your bank` (79 chars) ✅

**Recommended:** #1 — names the product, names the pain (bank connection), quantifies the time.

## URL

`https://subtrim.dev/demo` — link the demo, not the landing. HN users click and evaluate in 10 seconds. The demo works without signup and shows the audit flow immediately.

## When to post

- **Day:** Tuesday, Wednesday, or Thursday
- **Time:** 9-11am ET (peak HN front page reachability)
- **Avoid:** Monday (front page still holds weekend posts), Friday afternoon, weekends (lower traffic, harder to catch momentum)

## Body

```
I got tired of subscription trackers that either (a) charge you a cut to cancel things for you, or (b) require bank credentials and monetize the data on the back end.

SubTrim is a free auditor that doesn't touch your bank. You add subscriptions manually (about 60 seconds for 10 services) and answer 3 questions per service: how often do you use it, how much do you enjoy it, would you miss it if it disappeared. It then gives you a concrete recommendation per sub: keep, cancel, or downgrade.

How it's different from Rocket Money / Truebill / Bobby:
- No bank connection. You type or import a CSV.
- Recommends what to cut, not just tracks what exists.
- Overlap detection — flags Spotify + Apple Music as a duplicate, same for cloud storage, VPNs, etc.
- Outputs a shareable receipt PNG with your annual savings.

Demo (no signup needed): https://subtrim.dev/demo
Full app (email signup, free): https://subtrim.dev/app

Stack: Vite + React SPA, Supabase (Postgres + RLS + Auth), prerendered with a custom SSR script for SEO (193 static pages covering "is X worth it" / "cancel X" / "X vs Y" long-tail). Deployed on Vercel. html2canvas for the shareable receipt.

Audit algorithm is a weighted score per sub (usage × 0.4 + satisfaction × 0.3 + would-miss × 0.3) with modifiers for overlaps and audit freshness. Anything below a threshold gets flagged "cancel", mid-range gets "downgrade" if the service has a cheaper tier.

I'm a solo dev building this part-time. Happy to answer anything about the stack, audit algorithm, the privacy model (no bank OAuth, no data brokers), or why I think overlap detection is the most underrated feature in personal finance tools.

Feedback welcome, especially on edge cases for the audit logic and services you'd want supported that aren't in there yet.
```

## Comment playbook

HN upvotes posts where the maker replies. For the first 4-8 hours, watch the thread like a hawk.

**Expected questions & pre-drafted answers:**

> "How is this different from Rocket Money?"

Rocket Money links your bank and charges a cut to cancel things for you. SubTrim doesn't touch your bank and tells you what to cancel so you can do it yourself in 2 minutes. Different target user: people who'd rather spend 2 minutes cancelling than give a company bank credentials + 30% of first-year savings.

> "Why manual entry? Plaid integration would be easier."

Plaid costs money per connected account and gives me a liability surface I don't want. For the audit use case, manual entry is actually faster than reconciling noisy bank transactions — 10 services at 6 seconds each = 60 seconds. The bank-connection tools spend more time on transaction cleanup than users realize.

> "What's the business model?"

Free today. Future: optional paid tier for household sharing with unlimited members, email digest of new promos, and a "cancel this for me" concierge option for users who'd rather pay $5 than navigate a phone tree. Never ads, never selling data.

> "Is it open source?"

Not yet. Considering it for the audit algorithm specifically since that's the part users would benefit from being able to audit/modify. DM me if interested.

> "The audit algorithm seems crude."

Yep, it's a v1. Three factors weighted by cost. I'm planning to add: variance penalty for services with huge pricing spread (Adobe vs a $2/mo newsletter), cancellation friction bonus (if it's hard to cancel, the bar to "keep it" is higher because of switching cost to re-subscribe), and household-adjusted scoring (shared subs count different than solo).

## Post-launch checklist

- [ ] Reply to every comment in first 4 hours
- [ ] If it hits front page: cross-post the HN discussion URL to /r/SideProject with "My Show HN just went live, would love feedback"
- [ ] Save the HN post URL — it's a permanent backlink worth gold
- [ ] Screenshot the thread for your launch retrospective / Twitter
