# Twitter/X Launch Thread

## Primary thread (10 tweets, post as a chain)

Launch day or Product Hunt day. Post at 9am ET for max reach.

---

**1/10 (hook)**
I was paying for 14 subscriptions.

I actually used 6.

Over the past month I audited every one and cut $1,840/year.

I built the tool I used. It's free. No bank connection.

🧵👇

---

**2/10**
The problem with existing subscription trackers:

• Rocket Money / Truebill want your bank login + 30-40% of your first year's savings
• Bobby just tracks — doesn't tell you what to cut
• Spreadsheets work but nobody maintains them

I wanted something in between.

---

**3/10**
So I built SubTrim.

You add your subs manually (60 seconds for 10 services) and answer 3 questions per subscription:

• How often do you use it?
• How much do you enjoy it?
• Would you miss it if it disappeared?

That's it. It tells you exactly what to cut.

---

**4/10**
The part nobody else has: overlap detection.

SubTrim spots when you're double-paying:

• Spotify + Apple Music
• Netflix + Hulu + Prime Video (overlap on ~40% of catalog)
• iCloud + Google One + Dropbox
• Two VPNs from different $3.99/mo "deals"

Flagged automatically.

---

**5/10**
The result is a receipt.

📄 Line-by-line breakdown
✂️ Crossed-out items you're cutting
→ Downgrades (with the new price)
💸 Annual savings total

You can export it as a PNG and share it. Seeing "$1,840 saved" beats any chart.

[screenshot of receipt]

---

**6/10**
Privacy stuff because this matters:

• No bank OAuth. No Plaid. No transaction scraping.
• Manual entry only (fast because you're entering ~10 things)
• You own your data, export CSV anytime
• No ads, no data broker deals

If the tool is free, some other product shouldn't be you.

---

**7/10**
Tech stack for the curious:

• React + Vite (inline styles, no CSS framework)
• Supabase (Postgres + RLS + Auth)
• Prerendered SSR for 193 static pages (SEO long-tail)
• Vercel
• html2canvas for the shareable receipt

Total infra cost: ~$0/mo at current scale.

---

**8/10**
What's free forever:

• Full audit (unlimited subscriptions)
• Overlap detection
• Renewal calendar
• Savings receipt export
• Cancel guides for 75+ services

What'll be paid eventually:

• Household sharing beyond 2 members
• Monthly promo digest
• Concierge cancellation

---

**9/10**
Who I am: solo dev, grad student. Built this part-time because I was tired of watching "$14.99/mo here, $9.99/mo there" drain my bank account without ever seeing the number in one place.

I'd love if you tried it and told me what sucks. Every piece of feedback ships the next week.

---

**10/10 (CTA)**
Try the demo — no signup, takes 3 minutes:

👉 https://subtrim.dev/demo

If it's useful, an RT on tweet 1 helps more than anything. Thanks 🙏

---

## Follow-up single tweets (post over next 7 days)

**Day 2:** "Update from SubTrim launch: 500 people ran the demo, average savings flagged = $312/year. The #1 cut: streaming overlaps (surprise). The #1 keep: productivity tools (also surprise)."

**Day 4:** [Screenshot of a user's receipt] "This is why I built SubTrim. One audit, $840 saved. Full anon receipt here."

**Day 7:** "Week 1 numbers for SubTrim: [X] signups, [Y] audits run, [$Z] total savings flagged across all users. The audit algorithm needs work — share the subs it got wrong for you."

## Reply playbook

When someone says "cool, but why not just use a spreadsheet":
> Fair — I used a spreadsheet for 18 months. The reason I built this: the hard part isn't tracking, it's deciding what to cut. A spreadsheet won't tell you that your Spotify + Apple Music overlap is costing you $120/year.

When someone says "but Rocket Money does this":
> Rocket Money aggregates your bank transactions and charges 30-40% of first-year savings for cancellation. SubTrim asks you 3 questions per sub and tells you what to cancel for free. Different tradeoffs — bank integration saves 60 seconds of typing but costs your bank creds and a cut.

When someone says "looks great, can I add [service]":
> Yep, custom subscriptions work. If a service should be in our default catalog (with cancel guide + price data), drop the name here and I'll add it today.

## Hashtags (sparingly — Twitter de-prioritizes hashtagged posts)

Use zero to one per tweet. If using one: #buildinpublic or #indiehackers.

## When NOT to post

- Friday 4pm+ (weekend tanks reach)
- Monday before 9am ET (still processing weekend)
- During a big news event (your launch drowns)
