// End-to-end test of demo → signup → import handoff
// Mirrors App.jsx's first-login import logic exactly.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(readFileSync('.env.local','utf8').trim().split('\n').map(l=>l.split('=')));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

const rand = Math.random().toString(36).slice(2,10);
const email = `handoff-test-${rand}@subtrim-test.dev`;
const password = `Test-${rand}-Pass!9`;

// Simulated demo audit (what Demo.jsx writes to localStorage)
const demoSubs = [
  {name:'Netflix',        cat:'streaming',    cost:15.49, freq:'daily',   sat:5, miss:true },
  {name:'Hulu',           cat:'streaming',    cost:17.99, freq:'never',   sat:1, miss:false},
  {name:'Spotify',        cat:'music',        cost:10.99, freq:'daily',   sat:4, miss:true },
  {name:'ChatGPT Plus',   cat:'ai',           cost:20,    freq:'rarely',  sat:3, miss:false},
  {name:'Adobe Creative Cloud', cat:'creative', cost:54.99, freq:'weekly', sat:4, miss:true},
  {name:'LinkedIn Premium', cat:'productivity', cost:39.99, freq:'monthly', sat:2, miss:false}, // custom
];

console.log(`\n=== Demo Handoff Test ===`);
console.log(`Email: ${email}`);
console.log(`Demo subs: ${demoSubs.length}`);
demoSubs.forEach(s => console.log(`  - ${s.name} ($${s.cost}) ${s.freq}/${s.sat}*/miss=${s.miss}`));

// 1. Sign up
console.log(`\n[1] Signing up...`);
const { data: signup, error: signupErr } = await supabase.auth.signUp({ email, password });
if (signupErr) { console.error('Signup failed:', signupErr.message); process.exit(1); }
const user = signup.user;
if (!user) { console.error('No user returned. Email confirmation likely required.'); process.exit(1); }
console.log(`    user.id = ${user.id}`);

// Wait a moment for profile trigger to fire
await new Promise(r => setTimeout(r, 800));

// Sign in to get session (required for RLS)
const { data: session, error: signinErr } = await supabase.auth.signInWithPassword({ email, password });
if (signinErr) { console.error('Signin failed:', signinErr.message); process.exit(1); }
console.log(`    session acquired`);

// 2. Replicate App.jsx import logic (lines 207-240)
console.log(`\n[2] Running first-login import...`);
const { data: ksRows, error: ksErr } = await supabase.from('known_services').select('id,name,category,typical_monthly_price,tags');
if (ksErr) { console.error('known_services fetch failed:', ksErr.message); process.exit(1); }
console.log(`    known_services has ${ksRows.length} rows`);

const nameMap = { 'Adobe CC': 'Adobe Creative Cloud' };
const inserted = [];
const skipped = [];
for (const d of demoSubs) {
  const lookupName = nameMap[d.name] || d.name;
  const match = ksRows.find(k => k.name === lookupName);
  const payload = match ? {
    user_id: user.id, service_id: match.id, monthly_cost: d.cost, billing_cycle: 'monthly',
    renewal_date: new Date(Date.now()+30*864e5).toISOString().split('T')[0], status: 'active',
  } : {
    user_id: user.id, custom_name: d.name, custom_category: d.cat || 'productivity',
    monthly_cost: d.cost, billing_cycle: 'monthly',
    renewal_date: new Date(Date.now()+30*864e5).toISOString().split('T')[0], status: 'active',
  };
  if (!match) skipped.push(d.name);
  const { data: subRow, error: insErr } = await supabase.from('subscriptions').insert(payload).select('*, known_services(name, category, tags)').single();
  if (insErr) { console.error(`    insert failed for ${d.name}:`, insErr.message); continue; }
  if (subRow && d.freq && d.sat != null) {
    const { error: svErr } = await supabase.from('usage_surveys').insert({
      user_id: user.id, subscription_id: subRow.id,
      frequency: d.freq, satisfaction: d.sat, would_miss: !!d.miss,
    });
    if (svErr) console.error(`    survey insert failed for ${d.name}:`, svErr.message);
    await supabase.from('subscriptions').update({ last_audited_at: new Date().toISOString() }).eq('id', subRow.id);
  }
  inserted.push({ name: subRow.known_services?.name || subRow.custom_name, id: subRow.id, custom: !match });
}

console.log(`    Inserted: ${inserted.length}`);
inserted.forEach(i => console.log(`      + ${i.name}${i.custom ? ' [custom]' : ''}`));
if (skipped.length) console.log(`    Not in known_services (inserted as custom): ${skipped.join(', ')}`);

// 3. Verify round-trip: query back
console.log(`\n[3] Verifying round-trip...`);
const { data: subs } = await supabase.from('subscriptions').select('id, monthly_cost, last_audited_at, custom_name, custom_category, known_services(name, category)').eq('user_id', user.id).is('archived_at', null);
const { data: surveys } = await supabase.from('usage_surveys').select('subscription_id, frequency, satisfaction, would_miss').eq('user_id', user.id);
console.log(`    subscriptions in DB: ${subs?.length || 0}`);
console.log(`    usage_surveys in DB: ${surveys?.length || 0}`);

// Cross-check: every inserted sub should have a survey
const subIds = new Set((subs||[]).map(s=>s.id));
const surveyedIds = new Set((surveys||[]).map(s=>s.subscription_id));
const missingSurveys = [...subIds].filter(id => !surveyedIds.has(id));
if (missingSurveys.length) console.log(`    ⚠ ${missingSurveys.length} subs missing surveys`);
else console.log(`    ✓ every sub has a matching survey`);

console.log(`\n=== Summary ===`);
console.log(`  Demo entries:      ${demoSubs.length}`);
console.log(`  Imported:          ${inserted.length}`);
console.log(`  Custom subs:       ${inserted.filter(i=>i.custom).length}`);
console.log(`  Surveys matched:   ${surveys?.length || 0} / ${inserted.length}`);
const lost = demoSubs.length - inserted.length;
console.log(`  Lost in handoff:   ${lost}  ${lost ? '← BUG' : '✓'}`);
console.log(`  Test user:         ${email}`);
// Spot-check: print what the dashboard would see for each sub
console.log(`\nDashboard view:`);
(subs||[]).forEach(s => {
  const name = s.known_services?.name || s.custom_name;
  const cat = s.known_services?.category || s.custom_category;
  console.log(`  - ${name} (${cat}) $${s.monthly_cost}/mo ${s.last_audited_at ? '[audited]' : ''}`);
});
