# Product Hunt Launch Kit

## Pre-launch (1-2 weeks before)

- [ ] Create PH account, claim maker profile, set avatar + bio
- [ ] Follow 30-50 active makers (comment on 3-5 launches per day to build presence)
- [ ] Find a "hunter" with 500+ followers to submit on your behalf (optional but helps)
- [ ] Queue SubTrim for a Tuesday or Wednesday launch
- [ ] Build an email list of ~50 people who'll upvote/comment in the first hour
- [ ] Run `npm run screenshots` and pick your best 5 for the gallery

## Listing fields

**Name:** SubTrim

**Tagline (60 char limit):**
> Audit your subscriptions. Cancel what you don't use.

Backup tagline options:
- `Subscription auditor that tells you what to cancel` (50 chars)
- `The subscription tracker that saves you money` (46 chars)

**Description (260 char limit):**
> Most subscription trackers just aggregate your bills. SubTrim asks 3 questions per service (how often, how much you enjoy it, would you miss it) and tells you what to cancel, keep, or downgrade. No bank connection. Free. Takes 3 minutes.

**Topics (pick 3):**
- Personal Finance
- Productivity
- SaaS

**Gallery (5-8 images, 1270×760+ ideal):**
1. Landing hero with tagline
2. Demo audit flow question
3. Savings receipt (the PNG export)
4. Overlap detection callout
5. Worth-It / alternative page (shows SEO value)

**First image (featured):** make it the savings receipt. It's your most visual, most shareable asset.

## Maker's first comment

Post this yourself immediately after launch (PH weights maker engagement):

```
Hey Product Hunt 👋

I built SubTrim because I realized I was paying for 14 subscriptions and actually using 6. Every other tracker (Rocket Money, Bobby, Truebill) either wants my bank credentials or charges a cut to cancel things for me.

SubTrim is different: no bank connection, no middlemen. You type your subs in (takes a minute), answer 3 questions per service, and get a straight answer: keep, cancel, or downgrade.

What's in here that nothing else does:
🔍 Overlap detection — flags when you're paying for Spotify AND Apple Music, or two cloud storage plans
📸 Shareable savings receipt — export a PNG showing exactly how much you cut
🏠 Household sharing — split tracking with roommates/family
💰 Free forever for the core audit

Tech stack: Vite + React + Supabase, prerendered for SEO (193 static pages), deployed on Vercel.

Try the demo (no signup): https://subtrim.dev/demo

Biggest question I'd love input on: what services are missing from our catalog? Drop them in the comments and I'll add them today.
```

## Ready replies for common comments

> "How is this different from Rocket Money?"

Rocket Money needs bank credentials and takes a cut of your savings. SubTrim never touches your bank and is free. Different target: people who'd rather spend 2 minutes than give a company their bank login + 30% cut.

> "Can it auto-cancel for me?"

Not yet. I'm intentionally avoiding that feature right now — the companies that do auto-cancel (Rocket Money, Truebill) use it as their paid moat. I'd rather give you the recommendation for free and let you cancel yourself in 2 minutes per service (cancel guides are built in).

> "Open source?"

Considering for the audit algorithm specifically. The rest of the app is a standard React+Supabase SPA so the code isn't the interesting part — the heuristic is.

> "Love the UI, what's it built with?"

Pure inline styles in React, no component library. Inspired by Revolut's dark fintech look. Deliberately no Tailwind because I wanted tight control over the receipt export rendering (html2canvas).

## Day-of playbook (in PT)

| Time | Action |
|------|--------|
| 12:01 AM | Launch goes live. Do nothing — don't upvote your own post, don't DM friends yet. |
| 6:00 AM | Your supporters wake up. Post the PH link in your launch email. |
| 7-9 AM | First comments arrive. Reply to every one within 5 min. |
| 9 AM | Post the PH link on Twitter/X and LinkedIn with a screenshot. |
| 10 AM | Cross-post to r/SideProject: "My Product Hunt launch is live, would love feedback" |
| All day | Reply to every comment. Engagement is the ranking signal. |
| 5 PM | Post second update comment — share a metric or improvement you shipped that day. |
| 11:55 PM | Thank-you comment. Screenshot final ranking. |

## Post-launch compounding

- The PH listing is a permanent backlink and gets traffic for weeks.
- If you hit top 10 of the day, claim "#X Product of the Day" badge on your site.
- If top 5, submit to Product Hunt's weekly newsletter.
- Winners often get picked up by BetaList, Uneed, SaaSHub editorial.
