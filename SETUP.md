# SubTrim — Local Setup Guide

## Prerequisites
- **Node.js v18+** → [Download here](https://nodejs.org)
- **A free Supabase account** → [Sign up here](https://supabase.com)

---

## Step 1: Create the project

Open your terminal and run:

```bash
npx create-vite@latest subtrim -- --template react
cd subtrim
```

## Step 2: Install dependencies

```bash
npm install
```

> Dependencies are already defined in `package.json`: React, React DOM, Supabase JS, Vite, and the Vite React plugin.

## Step 3: Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to finish provisioning (~1 minute)
3. Go to **Project Settings → API** and copy:
   - `Project URL` (looks like `https://xxxxx.supabase.co`)
   - `Publishable key` (starts with `sb_publishable_...`)

4. In your project root, create a `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
```

5. Go to **SQL Editor** in the Supabase dashboard
6. Click **New Query**
7. Paste the entire contents of `supabase_migration.sql` (downloaded from the demo)
8. Click **Run** — this creates all 9 tables, indexes, RLS policies, and seeds 75 services + 20 promos

## Step 4: Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication → URL Configuration**
4. Add `http://localhost:5173` to **Redirect URLs**

## Step 5: Add the app code

Replace the contents of `src/App.jsx` with the `subtrim-app.jsx` file you downloaded from the demo.

Then at the very top of the file, uncomment/add the Supabase client:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

## Step 6: Verify vite.config.js

`vite.config.js` should already contain:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

## Step 7: Run it

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Quick Reference: Project Structure

```
subtrim/
├── .env.local              ← Your Supabase keys (never commit this)
├── index.html              ← Vite HTML entry point
├── vite.config.js          ← Vite config
├── package.json
├── supabase_migration.sql  ← Database schema + seed data
├── subtrim-app.jsx         ← Original source (reference copy)
└── src/
    ├── main.jsx            ← React mount point
    └── App.jsx             ← The SubTrim app
```

---

## Wiring Real Auth (replacing mock)

In `App.jsx`, find the `handleAuth` function and replace the mock setTimeout with:

```javascript
const handleAuth = async () => {
  setAuthLoading(true);
  setAuthErr("");

  if (authMode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { display_name: name } }
    });
    if (error) { setAuthErr(error.message); setAuthLoading(false); return; }
    setUser(data.user);
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) { setAuthErr(error.message); setAuthLoading(false); return; }
    setUser(data.user);
  }
  setAuthLoading(false);
};
```

Add session persistence at the top of the App component:

```javascript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => setUser(session?.user ?? null)
  );
  return () => subscription.unsubscribe();
}, []);
```

And update the logout button:

```javascript
<button onClick={() => supabase.auth.signOut()}>Log Out</button>
```

---

## Wiring Real Subscription CRUD (Phase 3 preview)

### Fetching subscriptions:
```javascript
const fetchSubs = async () => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, known_services(*)')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('renewal_date', { ascending: true });

  if (!error) setSubs(data);
};

useEffect(() => { if (user) fetchSubs(); }, [user]);
```

### Adding a subscription:
```javascript
const addSub = async (serviceId, cost, renewalDate, billingCycle) => {
  const { error } = await supabase.from('subscriptions').insert({
    user_id: user.id,
    service_id: serviceId,
    monthly_cost: cost,
    renewal_date: renewalDate,
    billing_cycle: billingCycle,
    status: 'active',
  });
  if (!error) fetchSubs();
};
```

### Removing (archiving) a subscription:
```javascript
const removeSub = async (id) => {
  const { error } = await supabase
    .from('subscriptions')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id);
  if (!error) fetchSubs();
};
```

---

## Troubleshooting

**"Invalid API key" error**
→ Check that `.env.local` has the correct values with no extra spaces or quotes
→ New Supabase projects use `sb_publishable_...` format keys — make sure you're copying the Publishable key, not the Secret key

**Auth signup not working**
→ Check Supabase dashboard → Authentication → make sure Email provider is enabled
→ By default Supabase requires email confirmation. To disable for testing:
  Go to Authentication → Settings → toggle off "Enable email confirmations"

**Blank page after login**
→ Open browser console (F12) and check for errors
→ Make sure the SQL migration ran successfully (check Tables in Supabase dashboard)

**Port 5173 already in use**
→ Run `npm run dev -- --port 3000` to use a different port
