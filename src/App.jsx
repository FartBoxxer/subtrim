import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import { CANCEL_GUIDES } from './data/cancelGuides';

let supabase = null;
try {
  const _url = import.meta.env.VITE_SUPABASE_URL;
  const _key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (_url && _key) supabase = createClient(_url, _key);
} catch(e) { console.warn('Supabase init skipped:', e.message); }

const CATS = {
  streaming:{l:"Streaming",c:"#e74c3c",e:"🎬"},music:{l:"Music",c:"#9b59b6",e:"🎵"},
  gaming:{l:"Gaming",c:"#2ecc71",e:"🎮"},productivity:{l:"Productivity",c:"#3498db",e:"💼"},
  fitness:{l:"Fitness",c:"#e67e22",e:"💪"},news:{l:"News",c:"#1abc9c",e:"📰"},
  creative:{l:"Creative",c:"#f39c12",e:"🎨"},security:{l:"Security",c:"#607d8b",e:"🔒"},
  food:{l:"Food",c:"#e91e63",e:"🍕"},ai_tools:{l:"AI Tools",c:"#00bcd4",e:"🤖"},
  lifestyle:{l:"Lifestyle",c:"#8e44ad",e:"✨"},
};

const TIERS={
  'Netflix':[{n:'Standard with Ads',p:6.99},{n:'Standard',p:15.49},{n:'Premium',p:22.99}],
  'Hulu':[{n:'With Ads',p:7.99},{n:'No Ads',p:17.99},{n:'Live TV',p:76.99}],
  'Disney+':[{n:'Basic',p:7.99},{n:'Premium',p:13.99},{n:'Bundle (w/ Hulu & ESPN+)',p:14.99}],
  'HBO Max':[{n:'With Ads',p:9.99},{n:'No Ads',p:15.99},{n:'Ultimate',p:19.99}],
  'Paramount+':[{n:'Essential',p:5.99},{n:'With Showtime',p:11.99}],
  'Peacock':[{n:'Premium',p:5.99},{n:'Premium Plus',p:11.99}],
  'Apple TV+':[{n:'Monthly',p:9.99},{n:'Apple One Individual',p:19.95},{n:'Apple One Family',p:25.95}],
  'YouTube Premium':[{n:'Individual',p:13.99},{n:'Family',p:22.99},{n:'Student',p:7.99}],
  'Spotify':[{n:'Individual',p:10.99},{n:'Duo',p:14.99},{n:'Family',p:16.99},{n:'Student',p:5.99}],
  'Apple Music':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'Student',p:5.99}],
  'Tidal':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'HiFi Plus',p:19.99}],
  'YouTube Music':[{n:'Individual',p:10.99},{n:'Family',p:16.99},{n:'Student',p:5.49}],
  'Xbox Game Pass':[{n:'Core',p:9.99},{n:'Standard',p:14.99},{n:'Ultimate',p:19.99}],
  'PlayStation Plus':[{n:'Essential',p:9.99},{n:'Extra',p:14.99},{n:'Premium',p:17.99}],
  'ChatGPT Plus':[{n:'Plus',p:20},{n:'Pro',p:200}],
  'Claude Pro':[{n:'Pro',p:20},{n:'Team',p:25}],
  'Adobe Creative Cloud':[{n:'Photography',p:9.99},{n:'Single App',p:22.99},{n:'All Apps',p:54.99}],
  'Microsoft 365':[{n:'Personal',p:9.99},{n:'Family',p:12.99}],
  'NordVPN':[{n:'Basic',p:12.99},{n:'Plus',p:13.99},{n:'Complete',p:14.99}],
  'Dropbox':[{n:'Plus',p:11.99},{n:'Professional',p:22},{n:'Family',p:19.99}],
  '1Password':[{n:'Individual',p:2.99},{n:'Family',p:4.99}],
  'Crunchyroll':[{n:'Fan',p:7.99},{n:'Mega Fan',p:9.99},{n:'Ultimate Fan',p:14.99}],
  'Amazon Prime Video':[{n:'Prime Video Only',p:8.99},{n:'Amazon Prime',p:14.99}],
  'Google One':[{n:'100 GB',p:2.99},{n:'2 TB',p:9.99}],
  'iCloud+':[{n:'50 GB',p:0.99},{n:'200 GB',p:2.99},{n:'2 TB',p:9.99}],
  'Notion':[{n:'Plus',p:8},{n:'Business',p:15}],
};

const LABELS=[
  {k:"promo",l:"Promo",c:"#e74c3c"},{k:"student",l:"Student",c:"#3498db"},
  {k:"family",l:"Family",c:"#9b59b6"},{k:"annual",l:"Annual Deal",c:"#f39c12"},
  {k:"grandfathered",l:"Grandfathered",c:"#2ecc71"},{k:"bundled",l:"Bundled",c:"#e67e22"},
];

// Auto promo feed — curated deals that show when DB promos are empty
const AUTO_PROMOS=[
  {svc:"Hulu",cat:"streaming",disc:50,desc:"First 3 months at $3.99/mo for new & returning subscribers",type:"new_customer",until:"2026-06-30",url:"https://www.hulu.com/welcome"},
  {svc:"Paramount+",cat:"streaming",disc:50,desc:"Annual plan 50% off — $29.99/yr (Essential)",type:"everyone",until:"2026-05-15",url:"https://www.paramountplus.com"},
  {svc:"YouTube Premium",cat:"streaming",disc:30,desc:"3-month free trial for new subscribers",type:"new_customer",until:"2026-12-31",url:"https://www.youtube.com/premium"},
  {svc:"NordVPN",cat:"security",disc:72,desc:"2-year plan — $3.09/mo + 3 months free",type:"everyone",until:"2026-07-01",url:"https://nordvpn.com/offer"},
  {svc:"Spotify",cat:"music",disc:100,desc:"3 months free Premium for new users",type:"new_customer",until:"2026-09-30",url:"https://www.spotify.com/premium"},
  {svc:"Apple Music",cat:"music",disc:100,desc:"1 month free trial for new subscribers",type:"new_customer",until:"2026-12-31",url:"https://www.apple.com/apple-music"},
  {svc:"Disney+",cat:"streaming",disc:33,desc:"Bundle with Hulu (No Ads) — save $10/mo vs separate",type:"everyone",until:"2026-12-31",url:"https://www.disneyplus.com"},
  {svc:"Adobe Creative Cloud",cat:"creative",disc:40,desc:"Students & teachers — All Apps at $19.99/mo",type:"new_customer",until:"2026-08-31",url:"https://www.adobe.com/creativecloud/plans.html"},
  {svc:"1Password",cat:"security",disc:25,desc:"Annual plan — save 25% vs monthly billing",type:"everyone",until:"2026-12-31",url:"https://1password.com"},
  {svc:"Xbox Game Pass",cat:"gaming",disc:50,desc:"First month of Ultimate for $7.99",type:"new_customer",until:"2026-06-30",url:"https://www.xbox.com/en-US/xbox-game-pass"},
  {svc:"Dropbox",cat:"productivity",disc:20,desc:"Plus annual plan — $9.99/mo billed yearly",type:"everyone",until:"2026-12-31",url:"https://www.dropbox.com/plans"},
  {svc:"Peacock",cat:"streaming",disc:50,desc:"Premium annual plan — $29.99/yr (save 50%)",type:"everyone",until:"2026-05-31",url:"https://www.peacocktv.com"},
];

const TH={
  dark:{bg:"#0d0d0d",sb:"#0a0a0a",sf:"#141414",el:"#1f1f1f",bd:"#1a1a1a",bd2:"#222",bd3:"#333",tx:"#fff",tx2:"#ccc",mt:"#666",mt2:"#999",mt3:"#888",dm:"#444",dm2:"#555",acc:"#00d48a",acc2:"#00b8d4",abg:"#0d0d0dee"},
  light:{bg:"#f5f5f7",sb:"#fff",sf:"#fff",el:"#ebebeb",bd:"#e0e0e0",bd2:"#d0d0d0",bd3:"#bbb",tx:"#111",tx2:"#444",mt:"#888",mt2:"#666",mt3:"#777",dm:"#aaa",dm2:"#999",acc:"#00b377",acc2:"#0097a7",abg:"#f5f5f7ee"}
};

function genPalettes(){return Array.from({length:10},(_,i)=>{const h1=Math.floor(Math.random()*360),h2=(h1+40+Math.floor(Math.random()*120))%360,s1=60+Math.floor(Math.random()*30),s2=60+Math.floor(Math.random()*30),l1=42+Math.floor(Math.random()*18),l2=42+Math.floor(Math.random()*18),a=Math.floor(Math.random()*360);const tp=i%3;return{id:`g${i}`,bg:tp===0?`hsl(${h1},${s1}%,${l1}%)`:tp===1?`linear-gradient(${a}deg,hsl(${h1},${s1}%,${l1}%),hsl(${h2},${s2}%,${l2}%))`:`radial-gradient(circle at ${30+Math.floor(Math.random()*40)}% ${30+Math.floor(Math.random()*40)}%,hsl(${h1},${s1}%,${l1}%),hsl(${h2},${s2}%,${l2}%))`}})}

const dU=d=>d?Math.ceil((new Date(d)-new Date())/864e5):999;
const CURRENCIES=[{code:"USD",sym:"$",loc:"en-US"},{code:"EUR",sym:"€",loc:"de-DE"},{code:"GBP",sym:"£",loc:"en-GB"},{code:"CAD",sym:"CA$",loc:"en-CA"},{code:"AUD",sym:"A$",loc:"en-AU"},{code:"JPY",sym:"¥",loc:"ja-JP"},{code:"BRL",sym:"R$",loc:"pt-BR"},{code:"MXN",sym:"MX$",loc:"es-MX"},{code:"INR",sym:"₹",loc:"en-IN"},{code:"KRW",sym:"₩",loc:"ko-KR"}];
const _fmtCache={};const mkFmt=c=>{if(!_fmtCache[c]){const ci=CURRENCIES.find(x=>x.code===c)||CURRENCIES[0];_fmtCache[c]=new Intl.NumberFormat(ci.loc,{style:'currency',currency:ci.code,minimumFractionDigits:ci.code==='JPY'||ci.code==='KRW'?0:2,maximumFractionDigits:ci.code==='JPY'||ci.code==='KRW'?0:2})}return _fmtCache[c]};
const mS=d=>{if(!d)return 1;const n=new Date(),t=new Date(d);if(isNaN(t))return 1;return Math.max(1,(n.getFullYear()-t.getFullYear())*12+n.getMonth()-t.getMonth())};

const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.15s",fontFamily:"inherit"};
const SB_W=260;

// Avatar helper — renders a colored/gradient circle
function Av({bg,size=40,border}){
  return(<div style={{width:size,height:size,borderRadius:"50%",background:bg,flexShrink:0,border:border||"none"}}/>)
}

function Ring({s:sc,size=100,sw=8,c1="#00d48a",c2="#00b8d4",bg="#1a1a1a",tc="#fff"}){
  const[a,sA]=useState(0);const r=(size-sw)/2,ci=2*Math.PI*r;
  useEffect(()=>{let f,st;const run=t=>{if(!st)st=t;const p=Math.min((t-st)/1000,1);sA(Math.round((1-Math.pow(1-p,3))*sc));if(p<1)f=requestAnimationFrame(run)};f=requestAnimationFrame(run);return()=>cancelAnimationFrame(f)},[sc]);
  return(<div style={{position:"relative",width:size,height:size,flexShrink:0}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><defs><linearGradient id={`rg${size}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#rg${size})`} strokeWidth={sw} strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(a/100)*ci} style={{filter:`drop-shadow(0 0 5px ${c1}44)`}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:size*0.28,fontWeight:700,color:tc}}>{a}</span>
      {size>=80&&<span style={{fontSize:size>=120?11:9,color:"#888",fontWeight:500}}>SubScore</span>}
    </div>
  </div>)
}

function Confetti({on}){
  const particles=useMemo(()=>Array.from({length:40},(_,i)=>({left:`${Math.random()*100}%`,w:4+Math.random()*6,h:6+Math.random()*8,color:["#e74c3c","#f39c12","#2ecc71","#3498db","#9b59b6","#00d48a","#e91e63"][i%7],br:i%3?"2px":"50%",rot:`rotate(${Math.random()*360}deg)`,dur:`${1+Math.random()*1.5}s`,del:`${Math.random()*0.5}s`})),[on]);
  if(!on)return null;
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{particles.map((p,i)=><div key={i} style={{position:"absolute",left:p.left,top:-10,width:p.w,height:p.h,background:p.color,borderRadius:p.br,transform:p.rot,animation:`cF ${p.dur} ease-in ${p.del} forwards`}}/>)}</div>)
}

// ═══════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const[user,setUser]=useState(null);
  const[authMode,setAuthMode]=useState("login");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[name,setName]=useState("");
  const[authErr,setAuthErr]=useState("");
  const[authInfo,setAuthInfo]=useState("");
  const[authLoading,setAuthLoading]=useState(false);
  const[sessionLoading,setSessionLoading]=useState(true);
  const[showAuth,setShowAuth]=useState(false);
  const[onboarding,setOnboarding]=useState(false);
  const[obPicks,setObPicks]=useState({});
  const[obLoading,setObLoading]=useState(false);

  const[pg,setPg]=useState("dashboard");
  const[subs,setSubs]=useState([]);
  const[knSvc,setKnSvc]=useState([]);
  const[promos,setPromos]=useState([]);
  const[priceChanges,setPriceChanges]=useState([]);
  const[simOn,setSimOn]=useState(false);
  const[simT,setSimT]=useState({});
  const[conf,setConf]=useState(false);
  const[aStep,setAS]=useState(-1);
  const[aAns,setAA]=useState({});
  const[addM,setAddM]=useState(false);
  const[addS,setAddS]=useState("");
  const[addSvc,setAddSvc]=useState(null);
  const[addCost,setAddCost]=useState("");
  const[pF,setPF]=useState("all");
  const[aTab,setATab]=useState("profile");
  const[toast,setToast]=useState(null);
  const[sort,setSort]=useState("renewal");
  const[permIgn,setPermIgn]=useState(()=>{try{const s=localStorage.getItem('st_pign');return s?new Set(JSON.parse(s)):new Set()}catch{return new Set()}});
  const[dism,setDism]=useState(new Set());
  const[av,setAv]=useState(()=>{try{const s=localStorage.getItem('st_av');return s?JSON.parse(s):{id:"def",bg:"#00d48a"}}catch{return{id:"def",bg:"#00d48a"}}});
  const[avOptions,setAvOptions]=useState(()=>genPalettes());
  const[hovCal,setHovCal]=useState(null);
  const[theme,setTheme]=useState(()=>localStorage.getItem('st_theme')||"dark");
  const[editId,setEditId]=useState(null);
  const[editCost,setEditCost]=useState("");
  const[editCycle,setEditCycle]=useState("monthly");
  const[editRenewal,setEditRenewal]=useState("");
  const[editLabels,setEditLabels]=useState([]);
  const[editNotes,setEditNotes]=useState("");
  const[addLabels,setAddLabels]=useState([]);
  const[addNotes,setAddNotes]=useState("");
  const[customMode,setCustomMode]=useState(false);
  const[customName,setCustomName]=useState("");
  const[customCat,setCustomCat]=useState("streaming");
  const[customCost,setCustomCost]=useState("");
  const[latestScore,setLatestScore]=useState(0);
  const[savedAmt,setSavedAmt]=useState(0);
  const[dismissedPC,setDismissedPC]=useState(new Set());
  const[showSavedTip,setShowSavedTip]=useState(false);
  const[budgets,setBudgets]=useState({streaming:25,music:15,gaming:20,productivity:30,fitness:20,news:15,creative:30,security:15,food:20,ai_tools:25,lifestyle:20});
  const[emailPrefs,setEmailPrefs]=useState({monthly_digest:false,promo_alerts:false,price_change_alerts:false,trial_reminders:false});
  const[csvImporting,setCsvImporting]=useState(false);
  const fileRef=useRef(null);
  const[deleteConfirm,setDeleteConfirm]=useState(false);
  const[deleteText,setDeleteText]=useState("");
  const[deleting,setDeleting]=useState(false);
  const[resetMode,setResetMode]=useState(false);
  const[recoveryMode,setRecoveryMode]=useState(false);
  const[newPass,setNewPass]=useState("");
  const[dataLoading,setDataLoading]=useState(false);
  const[obSearch,setObSearch]=useState("");
  const[removing,setRemoving]=useState(null);
  const[saving,setSaving]=useState(false);
  const[costView,setCostView]=useState("monthly");
  const[subSearch,setSubSearch]=useState("");
  const[catFilter,setCatFilter]=useState("all");
  const[currency,setCurrency]=useState(()=>localStorage.getItem('st_cur')||'USD');
  const fm=useCallback(n=>mkFmt(currency).format(Number(n)),[currency]);
  const reportRef=useRef(null);

  useEffect(()=>{localStorage.setItem('st_av',JSON.stringify(av))},[av]);

  const[isMobile,setIsMobile]=useState(typeof window!=="undefined"?window.innerWidth<768:false);
  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);

  // Session persistence
  useEffect(()=>{
    if(!supabase){setSessionLoading(false);return}
    const timeout=setTimeout(()=>setSessionLoading(false),3000);
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null);
      setSessionLoading(false);clearTimeout(timeout);
    }).catch(()=>{setSessionLoading(false);clearTimeout(timeout)});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setUser(session?.user??null);
      if(event==='PASSWORD_RECOVERY'){setRecoveryMode(true);setShowAuth(true)}
    });
    return()=>{subscription.unsubscribe();clearTimeout(timeout)};
  },[]);

  // Fetch data when user logs in
  useEffect(()=>{
    if(!user){setSubs([]);setLatestScore(0);setSavedAmt(0);setDataLoading(false);return}
    setDataLoading(true);
    const load=async()=>{
      // Fetch subs with tags for overlap detection
      const{data:subData}=await supabase.from('subscriptions')
        .select('*, known_services(name, category, typical_monthly_price, tags)')
        .is('archived_at',null).order('created_at');
      // Fetch surveys
      const{data:surveyData}=await supabase.from('usage_surveys')
        .select('subscription_id, frequency, satisfaction, would_miss')
        .eq('user_id',user.id).order('surveyed_at',{ascending:false});
      const svMap={};
      if(surveyData) surveyData.forEach(s=>{if(!svMap[s.subscription_id])svMap[s.subscription_id]=s;});
      const mapped=subData?subData.map(s=>{const sv=svMap[s.id]||{};return{
        id:s.id,serviceId:s.service_id,
        name:s.custom_name||s.known_services?.name||'Unknown',
        cat:s.custom_category||s.known_services?.category||'lifestyle',
        cost:Number(s.monthly_cost),cycle:s.billing_cycle,
        renewal:s.renewal_date,trial:s.is_trial,
        trialEnd:s.trial_end_date,
        sat:sv.satisfaction||null,freq:sv.frequency||null,miss:sv.would_miss??null,
        audit:s.last_audited_at,added:s.created_at?.split('T')[0],
        tags:s.known_services?.tags||[],
        labels:s.custom_tags||[],notes:s.notes||'',
      }}):[];
      setSubs(mapped);
      // Fetch latest score
      const{data:sc}=await supabase.from('score_history')
        .select('score').eq('user_id',user.id)
        .order('calculated_at',{ascending:false}).limit(1).maybeSingle();
      if(sc) setLatestScore(sc.score);
      // Fetch archived subs for saved counter
      const{data:arch}=await supabase.from('subscriptions')
        .select('monthly_cost, archived_at').eq('user_id',user.id).not('archived_at','is',null);
      if(arch){const now=new Date();setSavedAmt(arch.reduce((a,s)=>{
        const mo=Math.max(1,Math.round((now-new Date(s.archived_at))/(30*864e5)));
        return a+Number(s.monthly_cost)*mo;
      },0))}
      // Only show onboarding for truly new users (no active or archived subs)
      if(mapped.length===0&&(!arch||arch.length===0))setOnboarding(true);
      // Load profile (budgets, email prefs, theme, avatar)
      const{data:prof}=await supabase.from('profiles').select('category_budgets,email_preferences,theme,currency').eq('id',user.id).maybeSingle();
      if(prof){
        if(prof.category_budgets&&Object.keys(prof.category_budgets).length)setBudgets(prev=>({...prev,...prof.category_budgets}));
        if(prof.email_preferences)setEmailPrefs(prof.email_preferences);
        if(prof.theme&&prof.theme!=='system'){setTheme(prof.theme);localStorage.setItem('st_theme',prof.theme);document.body.style.background=TH[prof.theme]?.bg||'#0d0d0d'}
        if(prof.currency){setCurrency(prof.currency);localStorage.setItem('st_cur',prof.currency)}
      }
      setDataLoading(false);
    };
    load();
    // Parallel fetches (no dependencies)
    supabase.from('known_services').select('id,name,category,typical_monthly_price')
      .order('name').then(({data})=>{if(data)setKnSvc(data)});
    supabase.from('promos').select('*, known_services(name, category)')
      .gte('valid_until',new Date().toISOString().split('T')[0])
      .order('discount_percent',{ascending:false})
      .then(({data})=>{
        if(data&&data.length>0){
          setPromos(data.map(p=>({id:p.id,svc:p.known_services?.name||'',cat:p.known_services?.category||'',disc:p.discount_percent,desc:p.promo_description,type:p.promo_type,until:p.valid_until,url:p.promo_url||null,src:'db'})));
        }else{
          // Use auto feed when no DB promos
          const today=new Date().toISOString().split('T')[0];
          setPromos(AUTO_PROMOS.filter(p=>p.until>=today).map((p,i)=>({id:`auto-${i}`,svc:p.svc,cat:p.cat,disc:p.disc,desc:p.desc,type:p.type,until:p.until,url:p.url,src:'auto'})));
        }
      });
    supabase.from('price_changes').select('*, known_services(name)')
      .order('effective_date',{ascending:false}).limit(5)
      .then(({data})=>{if(data)setPriceChanges(data.map(p=>({
        svc:p.known_services?.name||'',old:Number(p.old_price),
        now:Number(p.new_price),dt:p.effective_date
      })))});
  },[user]);

  const t=TH[theme]||TH.dark;
  const userName=user?.user_metadata?.display_name||user?.email?.split('@')[0]||'User';

  const toastTimer=useRef(null);
  const confTimer=useRef(null);

  const ign=k=>permIgn.has(k)||dism.has(k);
  const dismiss=k=>setDism(new Set([...dism,k]));
  const permDismiss=k=>{const n=new Set([...permIgn,k]);setPermIgn(n);localStorage.setItem('st_pign',JSON.stringify([...n]));notify("Won't show this again")};
  const notify=useCallback(m=>{if(toastTimer.current)clearTimeout(toastTimer.current);setToast(m);toastTimer.current=setTimeout(()=>{setToast(null);toastTimer.current=null},3000)},[]);
  const pop=useCallback(()=>{setConf(true);if(confTimer.current)clearTimeout(confTimer.current);confTimer.current=setTimeout(()=>setConf(false),2500)},[]);
  useEffect(()=>()=>{if(toastTimer.current)clearTimeout(toastTimer.current);if(confTimer.current)clearTimeout(confTimer.current)},[]);

  // Keyboard shortcuts (desktop)
  useEffect(()=>{
    const h=e=>{
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
      if(e.key==='Escape'){setAddM(false);setEditId(null);return}
      if(e.key==='1')setPg('dashboard');
      if(e.key==='2'){setPg('audit');setAS(-1)}
      if(e.key==='3')setPg('promos');
      if(e.key==='4')setPg('account');
      if((e.key==='n'||e.key==='N')&&user&&pg==='dashboard')setAddM(true);
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[user,pg]);

  // Persist theme to Supabase
  const syncTheme=async(th)=>{setTheme(th);localStorage.setItem('st_theme',th);document.body.style.background=TH[th]?.bg||'#0d0d0d';if(user)await supabase.from('profiles').update({theme:th}).eq('id',user.id)};
  // Save budget to Supabase
  const saveBudget=async(cat,val)=>{const nb={...budgets,[cat]:val};setBudgets(nb);if(user)await supabase.from('profiles').update({category_budgets:nb}).eq('id',user.id)};
  // Save email prefs
  const saveEmailPref=async(key,val)=>{const np={...emailPrefs,[key]:val};setEmailPrefs(np);if(user)await supabase.from('profiles').update({email_preferences:np}).eq('id',user.id)};
  // Save currency
  const saveCurrency=async(c)=>{setCurrency(c);localStorage.setItem('st_cur',c);if(user)await supabase.from('profiles').update({currency:c}).eq('id',user.id)};
  // CSV export
  const exportCSV=()=>{
    const rows=[["Name","Category","Monthly Cost","Billing Cycle","Renewal Date","Labels","Notes"]];
    act.forEach(s=>rows.push([s.name,s.cat,s.cost,s.cycle||"monthly",s.renewal||"",
      (s.labels||[]).join(";"),s.notes||""]));
    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`subtrim-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
    notify("📤 Exported "+act.length+" subscriptions");
  };
  // CSV import
  const importCSV=async(file)=>{
    setCsvImporting(true);
    try{
      const text=await file.text();
      const lines=text.split("\n").filter(l=>l.trim());
      if(lines.length<2){notify("CSV is empty or has no data rows");setCsvImporting(false);return}
      const hdr=lines[0].toLowerCase();
      const hasHeader=hdr.includes("name")&&hdr.includes("cost");
      const dataLines=hasHeader?lines.slice(1):lines;
      const parseRow=row=>{const cols=[];let cur="",inQ=false;
        for(const ch of row){if(ch==='"'){inQ=!inQ}else if(ch===","&&!inQ){cols.push(cur.trim());cur=""}else{cur+=ch}}
        cols.push(cur.trim());return cols.map(c=>c.replace(/^"|"$/g,"").replace(/""/g,'"'))};
      let added=0;
      for(const line of dataLines){
        const cols=parseRow(line);if(cols.length<3)continue;
        const[name,cat,cost]=cols;const price=parseFloat(cost);
        if(!name||isNaN(price)||price<=0)continue;
        if(act.some(s=>s.name.toLowerCase()===name.trim().toLowerCase()))continue;
        // Try to match known service
        const match=knSvc.find(k=>k.name.toLowerCase()===name.trim().toLowerCase());
        const ins={user_id:user.id,monthly_cost:price,billing_cycle:cols[3]||"monthly",
          renewal_date:cols[4]||new Date(Date.now()+30*864e5).toISOString().split("T")[0],status:"active"};
        if(match){ins.service_id=match.id}else{ins.custom_name=name.trim();ins.custom_category=Object.keys(CATS).includes(cat)?cat:"lifestyle"}
        if(cols[5])ins.custom_tags=cols[5].split(";").filter(Boolean);
        if(cols[6])ins.notes=cols[6];
        const{data,error}=await supabase.from("subscriptions").insert(ins).select("*, known_services(name, category, tags)").single();
        if(!error&&data){added++;setSubs(prev=>[...prev,{id:data.id,serviceId:data.service_id,name:data.custom_name||data.known_services?.name||name.trim(),cat:data.custom_category||data.known_services?.category||"lifestyle",cost:Number(data.monthly_cost),cycle:data.billing_cycle,renewal:data.renewal_date,trial:false,trialEnd:null,sat:null,freq:null,miss:null,audit:null,added:data.created_at?.split("T")[0],tags:data.known_services?.tags||[],labels:data.custom_tags||[],notes:data.notes||""}])}
      }
      notify(added>0?`📥 Imported ${added} subscription${added>1?"s":""}`:"No new subscriptions to import");
    }catch(e){notify("Import failed: "+e.message)}
    setCsvImporting(false);
  };

  const act=subs.filter(s=>!s.archived);
  const reg=act.filter(s=>!s.trial);
  const tri=act.filter(s=>s.trial);
  const mTot=act.reduce((a,s)=>a+s.cost,0);
  const saved=savedAmt;const score=latestScore;
  const hasAudit=act.some(s=>!s.trial&&s.audit);
  const _now=new Date();const todayDay=_now.getDate();const calMonth=_now.getMonth();const calYear=_now.getFullYear();const calDays=new Date(calYear,calMonth+1,0).getDate();const calStart=new Date(calYear,calMonth,1).getDay();const calLabel=_now.toLocaleString('en-US',{month:'long',year:'numeric'});
  // Overlap detection from tags (memoized)
  const allOL=useMemo(()=>{const out=[];
    for(let i=0;i<act.length;i++)for(let j=i+1;j<act.length;j++){
      const a=act[i],b=act[j];if(!a.tags?.length||!b.tags?.length)continue;
      const sh=a.tags.filter(tg=>b.tags.includes(tg));
      if(sh.length)out.push({a:a.name,b:b.name,tag:sh[0].replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),k:`${a.id}-${b.id}`});
    }return out},[act]);
  const olaps=allOL.filter(o=>!ign("ol-"+o.k));
  const needA=useMemo(()=>act.filter(s=>!s.trial&&(!s.audit||dU(s.audit)<-60)),[act]);
  const showAA=needA.length>0&&!ign("reaudit");
  const relP=useMemo(()=>promos.filter(p=>act.some(s=>s.name===p.svc||s.cat===p.cat)).length,[promos,act]);

  const remove=async(id)=>{if(removing)return;setRemoving(id);const s=subs.find(x=>x.id===id);const{error}=await supabase.from('subscriptions').update({archived_at:new Date().toISOString(),status:'cancelled'}).eq('id',id);setRemoving(null);if(error){notify('Failed to remove');return}setSubs(subs.filter(x=>x.id!==id));notify(`✂️ ${s?.name} removed! Cancel directly with the service.`);pop()};

  const openEdit=(s)=>{setEditId(s.id);setEditCost(String(s.cost));setEditCycle(s.cycle||'monthly');setEditRenewal(s.renewal||'');setEditLabels(s.labels||[]);setEditNotes(s.notes||'')};
  const toggleLabel=(arr,set,k)=>set(arr.includes(k)?arr.filter(x=>x!==k):[...arr,k]);
  const saveSub=async()=>{
    if(saving)return;const c=parseFloat(editCost);if(isNaN(c)||c<0){notify('Enter a valid cost');return}
    setSaving(true);
    const{error}=await supabase.from('subscriptions').update({monthly_cost:c,billing_cycle:editCycle,renewal_date:editRenewal||null,custom_tags:editLabels,notes:editNotes||null}).eq('id',editId);
    setSaving(false);
    if(error){notify('Failed to save');return}
    setSubs(prev=>prev.map(s=>s.id===editId?{...s,cost:c,cycle:editCycle,renewal:editRenewal,labels:editLabels,notes:editNotes}:s));
    setEditId(null);notify('Saved');
  };

  const addCustomSub=async()=>{
    const c=parseFloat(customCost);if(!customName.trim()){notify('Enter a name');return}
    if(isNaN(c)||c<=0){notify('Enter a valid cost');return}
    if(act.some(s=>s.name.toLowerCase()===customName.trim().toLowerCase())){notify(`⚠️ ${customName.trim()} already exists`);return}
    const{data,error}=await supabase.from('subscriptions').insert({
      user_id:user.id,custom_name:customName.trim(),custom_category:customCat,
      monthly_cost:c,billing_cycle:'monthly',
      renewal_date:new Date(Date.now()+30*864e5).toISOString().split('T')[0],status:'active',
      custom_tags:addLabels.length?addLabels:null,notes:addNotes||null,
    }).select().single();
    if(error){notify('Failed to add');return}
    setSubs(prev=>[...prev,{id:data.id,name:data.custom_name,cat:data.custom_category,cost:Number(data.monthly_cost),cycle:data.billing_cycle,renewal:data.renewal_date,trial:false,trialEnd:null,sat:null,freq:null,miss:null,audit:null,added:data.created_at?.split('T')[0],tags:[],labels:data.custom_tags||[],notes:data.notes||''}]);
    notify(`✅ ${customName.trim()} added`);setAddM(false);setAddS("");setAddSvc(null);setAddCost("");setCustomMode(false);setCustomName("");setCustomCost("");
  };

  const fMap={daily:1,weekly:0.75,monthly:0.4,rarely:0.15,never:0};
  const calcScore=(subsArr,olCount)=>{
    if(!subsArr.length)return 0;
    const perSub=subsArr.map(s=>{const f=fMap[s.freq]??0.5,sa=(s.sat||3)/5,m=s.miss?1:0;return f*0.4+sa*0.3+m*0.3});
    let sc=Math.round((perSub.reduce((a,v)=>a+v,0)/perSub.length)*100);
    sc-=(olCount||0)*2;
    if(subsArr.every(s=>s.audit&&dU(s.audit)>-60))sc+=5;
    return Math.max(0,Math.min(100,sc));
  };

  const saveAudit=async()=>{
    const now=new Date().toISOString();
    const audited=aud.filter(s=>aAns[s.id]);
    if(!audited.length){setAS(-1);return}
    const surveys=audited.map(s=>{const a=aAns[s.id];return{
      user_id:user.id,subscription_id:s.id,
      frequency:a.frequency||s.freq,satisfaction:a.satisfaction||s.sat,
      would_miss:a.wouldMiss!==undefined?a.wouldMiss:s.miss
    }});
    const{error:svErr}=await supabase.from('usage_surveys').insert(surveys);
    if(svErr){notify("Failed to save audit: "+svErr.message);return}
    await Promise.all(audited.map(s=>supabase.from('subscriptions').update({last_audited_at:now}).eq('id',s.id)));
    // Update local state
    const updated=aud.map(s=>{const a=aAns[s.id]||{};return{...s,freq:a.frequency||s.freq,sat:a.satisfaction||s.sat,miss:a.wouldMiss!==undefined?a.wouldMiss:s.miss,audit:now.split('T')[0]}});
    setSubs(prev=>prev.map(s=>{const u=updated.find(x=>x.id===s.id);return u||s}));
    const newScore=calcScore(updated,allOL.length);
    await supabase.from('score_history').insert({user_id:user.id,score:newScore,total_monthly_spend:mTot,total_subscriptions:act.length,overlap_count:allOL.length,unused_count:updated.filter(s=>s.freq==='rarely'||s.freq==='never').length});
    setLatestScore(newScore);setAS(-1);setAA({});pop();notify("🎉 Audit complete! Score: "+newScore);
  };

  // Downgrade path finder
  const getDowngrade=(name,cost)=>{const tiers=TIERS[name];if(!tiers)return null;const sorted=[...tiers].sort((a,b)=>a.p-b.p);const cheaper=sorted.filter(tr=>tr.p<cost);if(!cheaper.length)return null;const best=cheaper[cheaper.length-1];return{name:best.n,price:best.p,save:cost-best.p}};

  // Export audit report as image
  const exportReport=async()=>{if(!reportRef.current)return;try{const canvas=await html2canvas(reportRef.current,{backgroundColor:'#0d0d0d',scale:2,useCORS:true});canvas.toBlob(blob=>{if(!blob)return;if(navigator.share&&navigator.canShare){navigator.share({files:[new File([blob],'subtrim-audit.png',{type:'image/png'})],title:'My SubTrim Audit'}).catch(()=>{})}else{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='subtrim-audit.png';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)}},'image/png')}catch{notify('Failed to export report')}};

  const simSave=Object.entries(simT).filter(([,v])=>v).reduce((a,[id])=>{const s=act.find(x=>x.id===id);return a+(s?s.cost:0)},0);
  const sorted=[...reg].sort((a,b)=>sort==="cost"?b.cost-a.cost:sort==="category"?a.cat.localeCompare(b.cat):dU(a.renewal)-dU(b.renewal));

  const{catSpend,catList}=useMemo(()=>{const cs={};act.forEach(s=>{cs[s.cat]=(cs[s.cat]||0)+s.cost});
    return{catSpend:cs,catList:Object.entries(cs).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({k,v,pct:mTot>0?Math.round(v/mTot*100):0,...(CATS[k]||{l:k,c:"#666",e:"📦"})}))}
  },[act,mTot]);

  const d=!isMobile;

  // ═══ AUTH SCREEN ═══
  const handleAuth=async()=>{
    setAuthLoading(true);setAuthErr("");setAuthInfo("");
    if(!email||!pass){setAuthErr("Please fill in all fields");setAuthLoading(false);return}
    if(authMode==="signup"&&!name.trim()){setAuthErr("Please enter your name");setAuthLoading(false);return}
    if(authMode==="signup"&&name.trim().length>24){setAuthErr("Name must be 24 characters or less");setAuthLoading(false);return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setAuthErr("Please enter a valid email");setAuthLoading(false);return}
    if(pass.length<6){setAuthErr("Password must be 6+ characters");setAuthLoading(false);return}
    try{
      if(authMode==="signup"){
        const{data,error}=await supabase.auth.signUp({email:email.trim(),password:pass,options:{data:{display_name:(name.trim()||email.split("@")[0]).slice(0,24)}}});
        if(error){setAuthErr(error.message);setAuthLoading(false);return}
        if(!data.session){setAuthInfo("✉️ Check your email to confirm your account");setAuthLoading(false);return}
      }else{
        const{error}=await supabase.auth.signInWithPassword({email:email.trim(),password:pass});
        if(error){setAuthErr(error.message);setAuthLoading(false);return}
      }
    }catch(e){setAuthErr("Connection error. Please try again.")}
    setAuthLoading(false);
  };

  if(sessionLoading) return(
    <div style={{background:t.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",color:t.tx}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:10}}>✂️</div>
        <div style={{fontSize:14,color:t.mt}}>Loading...</div>
      </div>
    </div>
  );

  // ═══ LANDING PAGES ═══
  const goAuth=(mode)=>{setShowAuth(true);setAuthMode(mode||"signup")};
  const LpNav=()=><nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:d?"20px 48px":"16px 20px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>✂️</span><span style={{fontSize:20,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</span></div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={()=>goAuth("login")} style={{...B,background:"transparent",color:t.mt2,fontSize:d?14:12,padding:d?"10px 20px":"8px 14px"}}>Log In</button>
      <button onClick={()=>goAuth("signup")} style={{...B,background:t.acc,color:"#000",fontSize:d?14:12,fontWeight:700,padding:d?"10px 24px":"8px 16px",borderRadius:8}}>Get Started Free</button>
    </div>
  </nav>;
  const LpFoot=()=><footer style={{borderTop:`1px solid ${t.bd}`,padding:d?"20px 48px":"16px 20px",textAlign:"center",fontSize:d?13:11,color:t.dm}}>&copy; {new Date().getFullYear()} SubTrim. All rights reserved.</footer>;

  // ——— LANDING PAGE (RECEIPT) ———
  const Landing=()=>{
    const items=[{n:"Netflix",p:15.49},{n:"Spotify",p:10.99},{n:"Hulu",p:17.99},{n:"Disney+",p:13.99},{n:"YouTube Premium",p:13.99},{n:"HBO Max",p:15.99},{n:"iCloud+",p:2.99},{n:"ChatGPT Plus",p:20},{n:"Adobe CC",p:54.99},{n:"Xbox Game Pass",p:19.99}];
    const cuts=[3,5,8];const total=items.reduce((a,i)=>a+i.p,0);
    const saved=cuts.reduce((a,i)=>a+items[i].p,0);
    return(<div style={{background:t.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:t.tx,overflowX:"hidden"}}>
      <style>{`*{box-sizing:border-box;margin:0}@keyframes cutLine{from{width:0}to{width:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
      <LpNav/>
      <div style={{maxWidth:d?520:400,margin:"0 auto",padding:d?"60px 20px 40px":"36px 20px 24px"}}>
        {/* Receipt paper */}
        <div style={{background:theme==="dark"?"#0f0f0f":"#fafaf8",border:`1px solid ${theme==="dark"?"#1a1a1a":"#e8e8e4"}`,borderRadius:2,padding:d?"40px 36px":"28px 24px",position:"relative",boxShadow:theme==="dark"?"0 20px 60px rgba(0,0,0,0.5)":"0 20px 60px rgba(0,0,0,0.08)"}}>
          {/* Torn top edge */}
          <div style={{position:"absolute",top:-1,left:0,right:0,height:6,background:t.bg,maskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q 2.5 0 5 6 Q 7.5 0 10 6 Q 12.5 0 15 6 Q 17.5 0 20 6 Q 22.5 0 25 6 Q 27.5 0 30 6 Q 32.5 0 35 6 Q 37.5 0 40 6 Q 42.5 0 45 6 Q 47.5 0 50 6 Q 52.5 0 55 6 Q 57.5 0 60 6 Q 62.5 0 65 6 Q 67.5 0 70 6 Q 72.5 0 75 6 Q 77.5 0 80 6 Q 82.5 0 85 6 Q 87.5 0 90 6 Q 92.5 0 95 6 Q 97.5 0 100 6' fill='white'/%3E%3C/svg%3E\")",WebkitMaskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q 2.5 0 5 6 Q 7.5 0 10 6 Q 12.5 0 15 6 Q 17.5 0 20 6 Q 22.5 0 25 6 Q 27.5 0 30 6 Q 32.5 0 35 6 Q 37.5 0 40 6 Q 42.5 0 45 6 Q 47.5 0 50 6 Q 52.5 0 55 6 Q 57.5 0 60 6 Q 62.5 0 65 6 Q 67.5 0 70 6 Q 72.5 0 75 6 Q 77.5 0 80 6 Q 82.5 0 85 6 Q 87.5 0 90 6 Q 92.5 0 95 6 Q 97.5 0 100 6' fill='white'/%3E%3C/svg%3E\")"}}/>

          <div style={{textAlign:"center",marginBottom:d?28:20}}>
            <div style={{fontSize:d?16:13,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:theme==="dark"?"#444":"#999"}}>Monthly Statement</div>
            <div style={{fontSize:d?32:24,fontWeight:800,marginTop:8}}>✂️ SubTrim</div>
            <div style={{fontSize:d?13:11,color:theme==="dark"?"#444":"#aaa",marginTop:4,fontFamily:"monospace"}}>— — — — — — — — — — — — — —</div>
          </div>

          {/* Line items */}
          <div style={{fontFamily:"'Inter',monospace"}}>
            {items.map((item,i)=>{const isCut=cuts.includes(i);return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:d?"10px 0":"7px 0",borderBottom:`1px dashed ${theme==="dark"?"#1a1a1a":"#e0e0dd"}`,position:"relative",animation:`dropIn 0.3s ease ${i*0.08}s both`}}>
                <span style={{fontSize:d?15:13,color:isCut?(theme==="dark"?"#555":"#bbb"):(theme==="dark"?"#ccc":"#333"),textDecoration:isCut?"line-through":"none"}}>{item.n}</span>
                <span style={{fontSize:d?15:13,fontWeight:600,fontVariantNumeric:"tabular-nums",color:isCut?(theme==="dark"?"#555":"#bbb"):(theme==="dark"?"#ccc":"#333"),textDecoration:isCut?"line-through":"none"}}>{fm(item.p)}</span>
                {isCut&&<div style={{position:"absolute",top:"50%",left:0,height:2,background:"#ef4444",animation:`cutLine 0.4s ease ${0.8+i*0.08}s both`}}/>}
              </div>
            )})}
          </div>

          <div style={{fontFamily:"monospace",fontSize:d?13:11,color:theme==="dark"?"#444":"#aaa",textAlign:"center",margin:"16px 0",letterSpacing:2}}>— — — — — — — — — — — — — —</div>

          {/* Totals */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",animation:"fadeIn 0.5s ease 1.2s both"}}>
            <span style={{fontSize:d?14:12,color:t.mt}}>Subtotal</span>
            <span style={{fontSize:d?14:12,color:t.mt,textDecoration:"line-through"}}>{fm(total)}/mo</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",animation:"fadeIn 0.5s ease 1.4s both"}}>
            <span style={{fontSize:d?14:12,color:"#ef4444",fontWeight:600}}>✂️ SubTrim savings</span>
            <span style={{fontSize:d?14:12,color:"#ef4444",fontWeight:700}}>-{fm(saved)}/mo</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 4px",borderTop:`2px solid ${theme==="dark"?"#222":"#ddd"}`,animation:"fadeIn 0.5s ease 1.6s both"}}>
            <span style={{fontSize:d?20:16,fontWeight:800}}>New Total</span>
            <span style={{fontSize:d?20:16,fontWeight:800,color:t.acc}}>{fm(total-saved)}/mo</span>
          </div>
          <div style={{textAlign:"right",fontSize:d?13:11,color:t.acc,fontWeight:600,animation:"fadeIn 0.5s ease 1.8s both"}}>You save {fm(saved*12)}/year</div>

          {/* Torn bottom */}
          <div style={{position:"absolute",bottom:-1,left:0,right:0,height:6,background:t.bg,maskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 2.5 6 5 0 Q 7.5 6 10 0 Q 12.5 6 15 0 Q 17.5 6 20 0 Q 22.5 6 25 0 Q 27.5 6 30 0 Q 32.5 6 35 0 Q 37.5 6 40 0 Q 42.5 6 45 0 Q 47.5 6 50 0 Q 52.5 6 55 0 Q 57.5 6 60 0 Q 62.5 6 65 0 Q 67.5 6 70 0 Q 72.5 6 75 0 Q 77.5 6 80 0 Q 82.5 6 85 0 Q 87.5 6 90 0 Q 92.5 6 95 0 Q 97.5 6 100 0' fill='white'/%3E%3C/svg%3E\")",WebkitMaskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 2.5 6 5 0 Q 7.5 6 10 0 Q 12.5 6 15 0 Q 17.5 6 20 0 Q 22.5 6 25 0 Q 27.5 6 30 0 Q 32.5 6 35 0 Q 37.5 6 40 0 Q 42.5 6 45 0 Q 47.5 6 50 0 Q 52.5 6 55 0 Q 57.5 6 60 0 Q 62.5 6 65 0 Q 67.5 6 70 0 Q 72.5 6 75 0 Q 77.5 6 80 0 Q 82.5 6 85 0 Q 87.5 6 90 0 Q 92.5 6 95 0 Q 97.5 6 100 0' fill='white'/%3E%3C/svg%3E\")"}}/>
        </div>

        <div style={{textAlign:"center",marginTop:d?36:24}}>
          <p style={{fontSize:d?18:14,color:t.mt,marginBottom:d?20:14,lineHeight:1.5}}>The average person wastes <strong style={{color:t.tx}}>{fm(saved*12)}/year</strong> on subscriptions they barely use.</p>
          <button onClick={()=>goAuth("signup")} style={{...B,background:t.acc,color:"#000",fontSize:d?18:15,fontWeight:700,padding:d?"16px 40px":"14px 32px",borderRadius:12,width:"100%",maxWidth:320}}>Find Your Savings — Free</button>
          <p style={{fontSize:d?13:11,color:t.dm,marginTop:10}}>No credit card. Takes 2 minutes.</p>
        </div>
      </div>

      {/* Minimal features below receipt */}
      <section style={{maxWidth:d?800:400,margin:"0 auto",padding:d?"20px 20px 60px":"16px 20px 40px"}}>
        <div style={d?{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}:{display:"flex",flexDirection:"column",gap:8}}>
          {[{e:"🧠",t:"Smart Audit",d:"3 questions per sub. Instant keep/cancel/downgrade."},{e:"🔍",t:"Overlap Finder",d:"Flags duplicate services automatically."},{e:"📊",t:"SubScore",d:"One number to track your efficiency."}].map((f,i)=>
            <div key={i} style={{background:t.sf,borderRadius:10,padding:d?"20px":"14px 16px",display:"flex",gap:d?0:12,flexDirection:d?"column":"row",alignItems:d?"flex-start":"center"}}>
              <div style={{fontSize:d?24:20,marginBottom:d?8:0}}>{f.e}</div>
              <div><div style={{fontSize:d?15:13,fontWeight:700}}>{f.t}</div><div style={{fontSize:d?13:11,color:t.mt,marginTop:2}}>{f.d}</div></div>
            </div>
          )}
        </div>
      </section>
      <LpFoot/>
    </div>)
  };

  if(!user&&!showAuth) return <Landing/>;

  if(recoveryMode) return(
    <div style={{background:t.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",color:t.tx,padding:20}}>
      <style>{`*{box-sizing:border-box;margin:0}input::placeholder{color:${t.dm}}`}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:10}}>🔑</div>
          <div style={{fontSize:24,fontWeight:800}}>Set New Password</div>
          <div style={{fontSize:14,color:t.mt,marginTop:8}}>Choose a new password for your account</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password (6+ characters)" type="password" style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.sf,color:t.tx,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {authErr&&<div style={{fontSize:13,color:"#e74c3c",textAlign:"center"}}>{authErr}</div>}
          {authInfo&&<div style={{fontSize:13,color:t.acc,textAlign:"center",background:t.acc+"11",padding:"10px 14px",borderRadius:8}}>{authInfo}</div>}
          <button onClick={async()=>{
            if(newPass.length<6){setAuthErr("Password must be 6+ characters");return}
            setAuthLoading(true);setAuthErr("");
            const{error}=await supabase.auth.updateUser({password:newPass});
            setAuthLoading(false);
            if(error){setAuthErr(error.message);return}
            setRecoveryMode(false);setNewPass("");setAuthErr("");setAuthInfo("");
            notify("✅ Password updated successfully!");
          }} disabled={authLoading} style={{...B,background:t.acc,color:"#000",padding:"14px",fontSize:15,fontWeight:700,borderRadius:10,width:"100%",opacity:authLoading?0.6:1}}>
            {authLoading?"Updating...":"Update Password"}
          </button>
        </div>
      </div>
    </div>
  );

  if(!user&&showAuth) return(
    <div style={{background:t.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",color:t.tx,padding:20}}>
      <style>{`*{box-sizing:border-box;margin:0}input::placeholder{color:${t.dm}}`}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <button onClick={()=>setShowAuth(false)} style={{...B,background:"none",color:t.mt,fontSize:14,padding:"0 0 16px",display:"flex",alignItems:"center",gap:6}}>← Back</button>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:48,marginBottom:10}}>✂️</div>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</div>
          <div style={{fontSize:14,color:t.mt,marginTop:6}}>Take control of your subscriptions</div>
        </div>

        <div style={{display:"flex",background:t.sf,borderRadius:10,padding:3,marginBottom:20}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setAuthMode(m);setAuthErr("")}} style={{...B,flex:1,background:authMode===m?t.el:"transparent",color:authMode===m?t.tx:t.mt,fontSize:14,borderRadius:8,padding:"10px 0"}}>{m==="login"?"Log In":"Sign Up"}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {authMode==="signup"&&(
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" maxLength={24} style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.sf,color:t.tx,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" maxLength={64} style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.sf,color:t.tx,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.sf,color:t.tx,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {authErr&&<div style={{fontSize:13,color:"#e74c3c",textAlign:"center"}}>{authErr}</div>}
          {authInfo&&<div style={{fontSize:13,color:t.acc,textAlign:"center",background:t.acc+"11",padding:"10px 14px",borderRadius:8}}>{authInfo}</div>}
          <button onClick={handleAuth} disabled={authLoading} style={{...B,background:t.acc,color:"#000",padding:"14px",fontSize:15,fontWeight:700,borderRadius:10,width:"100%",opacity:authLoading?0.6:1}}>
            {authLoading?"...":(authMode==="login"?"Log In":"Create Account")}
          </button>
        </div>

        {authMode==="login"&&!resetMode&&<div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>{setResetMode(true);setAuthErr("");setAuthInfo("")}} style={{fontSize:13,color:t.dm2,cursor:"pointer",borderBottom:`1px dashed ${t.dm}44`}}>Forgot password?</span>
        </div>}
        {resetMode&&<div style={{background:t.sf,borderRadius:14,padding:d?"20px":"16px",marginTop:12,border:`1px solid ${t.bd2}`}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Reset Password</div>
          <div style={{fontSize:13,color:t.mt,marginBottom:12,lineHeight:1.5}}>Enter the email address you signed up with. We'll send you a link to reset your password.</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}}/>
          {authErr&&<div style={{fontSize:12,color:"#e74c3c",textAlign:"center",marginBottom:8}}>{authErr}</div>}
          {authInfo&&<div style={{fontSize:12,color:t.acc,textAlign:"center",background:t.acc+"11",padding:"8px 12px",borderRadius:8,marginBottom:8}}>{authInfo}</div>}
          <button onClick={async()=>{
            if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setAuthErr("Enter a valid email address");return}
            setAuthLoading(true);setAuthErr("");setAuthInfo("");
            const{error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:'https://subtrim.dev/app'});
            setAuthLoading(false);
            if(error){setAuthErr(error.message);return}
            setAuthErr("");setAuthInfo("✉️ Reset link sent! Check your inbox (and spam folder). The link will expire in 24 hours.");
          }} disabled={authLoading} style={{...B,width:"100%",background:t.acc,color:"#000",fontWeight:700,fontSize:14,borderRadius:10,padding:"12px",opacity:authLoading?0.6:1}}>{authLoading?"Sending...":"Send Reset Link"}</button>
          <div style={{textAlign:"center",marginTop:10}}><span onClick={()=>{setResetMode(false);setAuthErr("");setAuthInfo("")}} style={{fontSize:13,color:t.mt,cursor:"pointer"}}>← Back to login</span></div>
        </div>}
        {!resetMode&&<div style={{textAlign:"center",marginTop:18,fontSize:13,color:t.dm}}>
          {authMode==="login"?"Don't have an account? ":"Already have one? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("");setAuthInfo("");setResetMode(false)}} style={{color:t.acc,cursor:"pointer",fontWeight:600}}>{authMode==="login"?"Sign Up":"Log In"}</span>
        </div>}
      </div>
    </div>
  );

  // ═══ DASHBOARD ═══
  const Skel=({w,h,r,mb})=><div style={{width:w||"100%",height:h||14,borderRadius:r||4,background:t.el,marginBottom:mb||0,animation:"pulse 1.5s ease-in-out infinite"}}/>;
  const Dash=()=>{
    if(dataLoading) return(<div style={{display:"flex",flexDirection:"column",gap:d?18:14}}>
      <div style={{background:t.sf,borderRadius:16,padding:d?"28px 32px":"20px 16px"}}>
        <Skel w={120} h={12} mb={12}/><Skel w={180} h={d?42:32} mb={8}/><Skel w={200} h={10}/>
      </div>
      <div style={{background:t.sf,borderRadius:14,overflow:"hidden"}}>
        {[1,2,3,4,5].map(i=><div key={i} style={{display:"flex",alignItems:"center",gap:d?16:12,padding:d?"16px 20px":"12px 14px",borderBottom:i<5?`1px solid ${t.el}`:"none"}}>
          <div style={{width:d?44:36,height:d?44:36,borderRadius:"50%",background:t.el,flexShrink:0,animation:"pulse 1.5s ease-in-out infinite"}}/>
          <div style={{flex:1}}><Skel w={d?120:90} h={14} mb={6}/><Skel w={d?80:60} h={10}/></div>
          <Skel w={60} h={18}/>
        </div>)}
      </div>
    </div>);
    return(<div style={{display:"flex",flexDirection:"column",gap:d?18:14}}>
    {/* Stats row */}
    <div style={isMobile?{}:{display:"flex",gap:28,alignItems:"center",background:t.sf,borderRadius:16,padding:"28px 32px"}}>
      <div style={{textAlign:isMobile?"center":"left",padding:isMobile?"8px 0 4px":0,flex:isMobile?undefined:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <div style={{fontSize:d?13:11,color:t.mt,fontWeight:500,textTransform:"uppercase",letterSpacing:1}}>Total Subscriptions</div>
          <div style={{display:"flex",background:t.el,borderRadius:6,padding:1}}>
            {["monthly","annual"].map(v=><button key={v} onClick={()=>setCostView(v)} style={{...B,padding:d?"3px 10px":"2px 8px",fontSize:d?11:9,borderRadius:5,background:costView===v?t.acc:"transparent",color:costView===v?"#000":t.dm,fontWeight:costView===v?700:400}}>{v==="monthly"?"/mo":"/yr"}</button>)}
          </div>
        </div>
        <div style={{fontSize:d?52:38,fontWeight:700,letterSpacing:"-1px"}}>{fm(costView==="annual"?mTot*12:mTot)}</div>
        <div style={{fontSize:d?14:12,color:t.mt,marginTop:4}}>{costView==="annual"?`${fm(mTot)}/mo`:`${fm(mTot*12)}/yr`} · {act.length} active{saved>0&&<span> · <span onClick={()=>setShowSavedTip(v=>!v)} style={{color:t.acc,cursor:"pointer",borderBottom:`1px dashed ${t.acc}44`}}>{fm(saved)} saved</span></span>}</div>
        {showSavedTip&&<div style={{fontSize:d?12:10,color:t.mt,marginTop:6,background:t.el,padding:d?"10px 14px":"8px 12px",borderRadius:8,lineHeight:1.5}}>Estimated savings from subscriptions you've removed — calculated as each removed sub's monthly cost × months since removal. <span onClick={()=>setShowSavedTip(false)} style={{color:t.acc,cursor:"pointer",marginLeft:4}}>Got it</span></div>}
      </div>

      {hasAudit&&<div style={{display:"flex",justifyContent:"center",padding:isMobile?"4px 0":0,flexShrink:0}}>
        <Ring s={score} size={d?130:90} bg={t.bd} tc={t.tx}/>
      </div>}

      <div style={{flex:isMobile?undefined:1}}>
        <div style={{display:"flex",gap:2,height:d?8:6,borderRadius:4,overflow:"hidden",marginBottom:10}}>
          {catList.map((c,i)=><div key={i} style={{flex:c.pct,background:c.c,minWidth:3}}/>)}
        </div>
        <div style={{display:"flex",gap:d?12:8,flexWrap:"wrap"}}>
          {catList.map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:d?12:10,color:t.mt}}>
              <div style={{width:d?9:7,height:d?9:7,borderRadius:2,background:c.c}}/>{c.l} <span style={{color:t.tx,fontWeight:600}}>{fm(c.v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Alerts */}
    {showAA&&(
      <div style={{background:t.sf,borderRadius:12,padding:d?"14px 18px":"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,borderLeft:"3px solid #f59e0b"}}>
        <span style={{fontSize:d?14:12,color:t.tx2}}>🔄 <strong>{needA.length}</strong> sub{needA.length>1?"s":""} need re-audit</span>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setPg("audit")} style={{...B,padding:d?"6px 14px":"4px 10px",background:"#f59e0b",color:"#000",fontSize:d?12:11,borderRadius:6}}>Audit Now</button>
          <button onClick={()=>dismiss("reaudit")} style={{...B,padding:d?"6px 14px":"4px 10px",background:t.el,color:t.mt,fontSize:d?12:11,borderRadius:6}}>Ignore</button>
          <button onClick={()=>permDismiss("reaudit")} style={{...B,padding:d?"6px 14px":"4px 10px",background:t.el,color:t.dm,fontSize:d?11:10,borderRadius:6}}>Don't Show Again</button>
        </div>
      </div>
    )}
    {olaps.length>0&&(
      <div style={{background:t.sf,borderRadius:12,padding:d?"14px 18px":"10px 14px",borderLeft:"3px solid #e67e22"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:olaps.length>1?8:0,flexWrap:"wrap",gap:6}}>
          <span style={{fontSize:d?14:12,color:t.tx2}}>🔍 <strong>{olaps.length}</strong> overlap{olaps.length>1?"s":""} detected</span>
          <button onClick={()=>setPg("audit")} style={{...B,padding:d?"6px 14px":"4px 10px",background:"#e67e22",color:"#000",fontSize:d?12:11,borderRadius:6}}>Review in Audit</button>
        </div>
        {olaps.map(o=><div key={o.k} style={{display:"flex",alignItems:"center",gap:6,fontSize:d?13:11,color:t.mt,padding:"3px 0"}}>
          <span style={{color:t.tx2,fontWeight:600}}>{o.a}</span>
          <span style={{color:t.dm}}>&</span>
          <span style={{color:t.tx2,fontWeight:600}}>{o.b}</span>
          <span style={{fontSize:d?11:9,background:"#e67e2222",color:"#e67e22",padding:"2px 8px",borderRadius:4}}>{o.tag}</span>
          <button onClick={()=>permDismiss("ol-"+o.k)} style={{...B,padding:"2px 6px",background:t.el,color:t.dm,fontSize:d?10:8,borderRadius:4,marginLeft:"auto"}}>Dismiss</button>
        </div>)}
      </div>
    )}
    {/* Budget alerts disabled for now — re-enable by uncommenting
    {(()=>{const over=Object.entries(catSpend).filter(([k,v])=>budgets[k]&&v>budgets[k]).map(([k,v])=>({k,v,lim:budgets[k],...(CATS[k]||{l:k,e:"📦"})}));
      return over.length>0&&!ign("budget-warn")&&<div style={{background:t.sf,borderRadius:12,padding:d?"14px 18px":"10px 14px",borderLeft:"3px solid #ef4444"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:d?14:12,color:t.tx2,fontWeight:600}}>💰 Budget exceeded</span>
          <button onClick={()=>dismiss("budget-warn")} style={{...B,padding:"2px 8px",background:t.el,color:t.dm,fontSize:d?11:9,borderRadius:4}}>Dismiss</button>
        </div>
        {over.map(o=><div key={o.k} style={{fontSize:d?13:11,color:t.mt,padding:"2px 0"}}>{o.e} {o.l}: <span style={{color:"#ef4444",fontWeight:600}}>{fm(o.v)}</span> / {fm(o.lim)} budget</div>)}
      </div>
    })()} */}

    {/* Trials */}
    {tri.length>0&&<>
      <div style={{fontSize:d?15:13,fontWeight:700,color:t.tx,marginTop:2}}>⏱️ Active Trials</div>
      <div style={{display:"flex",gap:d?14:10,overflowX:"auto",paddingBottom:4}}>
        {tri.map(s=>{const dd=dU(s.trialEnd),c=CATS[s.cat]||{e:"📦",c:"#666"},uc=dd<=2?"#ef4444":dd<=5?"#f59e0b":"#00d48a";
        return(<div key={s.id} style={{minWidth:d?220:180,background:t.sf,borderRadius:14,padding:d?18:14,flexShrink:0,borderTop:`3px solid ${uc}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:d?36:30,height:d?36:30,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?16:14}}>{c.e}</div>
            <span style={{fontWeight:600,fontSize:d?15:13}}>{s.name}</span>
          </div>
          <div style={{fontSize:d?32:26,fontWeight:700,color:uc,marginBottom:2}}>{dd}d</div>
          <div style={{fontSize:d?13:11,color:t.mt}}>until {fm(s.cost)}/mo charge</div>
          <button onClick={()=>remove(s.id)} style={{...B,width:"100%",marginTop:10,background:uc+"22",color:uc,fontSize:d?13:11,padding:d?"9px 0":"7px 0",borderRadius:8}}>Cancel Trial</button>
        </div>)})}
      </div>
    </>}

    {/* Calendar */}
    <div>
      <div style={{fontSize:d?16:13,fontWeight:700,marginBottom:d?12:8}}>📅 {calLabel}</div>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:d?6:2,textAlign:"center"}}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((dd,i)=><div key={i} style={{fontSize:d?13:10,fontWeight:600,color:t.dm2,padding:d?"8px 4px":"3px 0"}}>{d?dd:dd[0]}</div>)}
          {[...Array(calStart)].map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:calDays},(_,i)=>{const day=i+1,ds=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,rn=act.filter(s=>s.renewal===ds),isT=day===todayDay;
          return(<div key={day} onMouseEnter={()=>rn.length&&setHovCal(day)} onMouseLeave={()=>setHovCal(null)} style={{padding:d?"12px 6px":"5px 2px",borderRadius:8,fontSize:d?15:11,fontWeight:isT?700:rn.length?600:400,color:isT?"#000":rn.length?t.tx:t.dm,background:isT?t.acc:rn.length?t.el:"transparent",position:"relative",cursor:rn.length?"pointer":"default",transition:"background 0.15s"}}>
            {day}
            {rn.length>0&&!isT&&<div style={{position:"absolute",bottom:d?3:1,left:"50%",transform:"translateX(-50%)",display:"flex",gap:2}}>{rn.map((r,j)=><div key={j} style={{width:d?5:3,height:d?5:3,borderRadius:"50%",background:CATS[r.cat]?.c||t.acc}}/>)}</div>}
            {hovCal===day&&rn.length>0&&<div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",borderRadius:12,padding:d?"14px 18px":"10px 14px",zIndex:20,whiteSpace:"nowrap",marginTop:6,boxShadow:"0 12px 32px rgba(0,0,0,0.7)",pointerEvents:"none",minWidth:d?180:140}}>
              <div style={{fontSize:d?11:9,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{new Date(calYear,calMonth,day).toLocaleString('en-US',{month:'short'})} {day}</div>
              {rn.map((r,j)=>{const cc=CATS[r.cat]||{e:"📦",c:"#666"};return <div key={j} style={{display:"flex",alignItems:"center",gap:d?10:8,padding:d?"5px 0":"3px 0",borderTop:j?`1px solid #2a2a2a`:"none"}}>
                <div style={{width:d?8:6,height:d?8:6,borderRadius:"50%",background:cc.c,flexShrink:0}}/>
                <span style={{color:"#fff",fontWeight:500,fontSize:d?13:11,flex:1}}>{r.name}</span>
                <span style={{color:"#fff",fontWeight:700,fontSize:d?13:11}}>{fm(r.cost)}</span>
              </div>})}
              {rn.length>1&&<div style={{borderTop:"1px solid #2a2a2a",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:d?12:10}}>
                <span style={{color:"#888"}}>Total</span>
                <span style={{color:t.acc,fontWeight:700}}>{fm(rn.reduce((a,r)=>a+r.cost,0))}</span>
              </div>}
            </div>}
          </div>)})}
        </div>
      </div>
    </div>

    {/* Subscriptions */}
    <div style={{display:"flex",flexDirection:"column",gap:d?16:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:d?16:13,fontWeight:700}}>Subscriptions</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <input value={subSearch} onChange={e=>setSubSearch(e.target.value)} placeholder="Search..." style={{width:d?140:100,padding:d?"6px 10px":"4px 8px",borderRadius:6,border:`1px solid ${t.bd2}`,background:t.sf,color:t.tx,fontSize:d?12:10,outline:"none",fontFamily:"inherit"}}/>
          {d&&pg==="dashboard"&&<button onClick={()=>setAddM(true)} style={{...B,padding:"6px 16px",background:t.acc,color:"#000",fontSize:12,borderRadius:8,fontWeight:700}}>+ Add</button>}
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{background:t.sf,color:t.mt2,border:`1px solid ${t.bd2}`,borderRadius:6,padding:d?"6px 8px":"4px 6px",fontSize:d?12:10,fontFamily:"inherit",cursor:"pointer"}}>
            <option value="renewal">Renewal</option><option value="cost">Cost ↓</option><option value="category">Category</option>
          </select>
          <button onClick={()=>setSimOn(!simOn)} style={{...B,padding:d?"6px 14px":"4px 10px",background:simOn?t.acc:t.sf,color:simOn?"#000":t.mt2,fontSize:d?12:11,borderRadius:6,border:simOn?"none":`1px solid ${t.bd2}`}}>
            {simOn?"✕ Close":"⚡ What If?"}
          </button>
        </div>
      </div>

      {simOn&&(()=>{const simCount=Object.values(simT).filter(Boolean).length;return(
        <div style={{background:t.acc+"11",border:`1px solid ${t.acc}33`,borderRadius:10,padding:d?"14px 18px":"10px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:d?13:11,color:t.mt}}>Toggle subs to simulate cutting</div>
              {simCount>0&&<div style={{fontSize:d?12:10,color:t.mt,marginTop:2}}>{simCount} selected · New total: {fm(mTot-simSave)}/mo</div>}
            </div>
            <span style={{fontSize:d?24:20,fontWeight:700,color:t.acc}}>{fm(simSave)}<span style={{fontSize:d?14:12,color:t.mt}}>/mo · {fm(simSave*12)}/yr</span></span>
          </div>
          {simCount>0&&<button onClick={async()=>{if(!window.confirm(`Remove ${simCount} subscription${simCount>1?"s":""}? This will archive them.`))return;const ids=Object.entries(simT).filter(([,v])=>v).map(([id])=>id);for(const id of ids)await remove(id);setSimT({});setSimOn(false)}} style={{...B,marginTop:10,background:t.acc,color:"#000",fontWeight:700,fontSize:d?14:12,borderRadius:8,padding:d?"10px 24px":"8px 18px"}}>✂️ Cut {simCount} sub{simCount>1?"s":""} — save {fm(simSave)}/mo</button>}
        </div>
      )})()}

      {(catList.length>1||subSearch)&&<div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>
        <button onClick={()=>setCatFilter("all")} style={{...B,fontSize:d?11:9,padding:d?"5px 12px":"3px 8px",borderRadius:6,background:catFilter==="all"?t.acc:t.sf,color:catFilter==="all"?"#000":t.mt,whiteSpace:"nowrap",border:catFilter==="all"?"none":`1px solid ${t.bd2}`}}>All</button>
        {catList.map(c=><button key={c.k} onClick={()=>setCatFilter(catFilter===c.k?"all":c.k)} style={{...B,fontSize:d?11:9,padding:d?"5px 12px":"3px 8px",borderRadius:6,background:catFilter===c.k?c.c+"33":t.sf,color:catFilter===c.k?c.c:t.mt,whiteSpace:"nowrap",border:catFilter===c.k?`1px solid ${c.c}44`:`1px solid ${t.bd2}`}}>{c.e} {c.l}</button>)}
      </div>}

      {(()=>{const filtered=sorted.filter(s=>(catFilter==="all"||s.cat===catFilter)&&(!subSearch||s.name.toLowerCase().includes(subSearch.toLowerCase())));return(
      <div style={{background:t.sf,borderRadius:14,overflow:"hidden"}}>
        {filtered.length===0&&<div style={{padding:d?"24px 20px":"16px 14px",textAlign:"center",color:t.mt,fontSize:d?14:12}}>{act.length===0?"No subscriptions yet. Tap + to add one.":"No matches found."}</div>}
        {filtered.map((s,i)=>{const c=CATS[s.cat]||{e:"📦",c:"#666",l:s.cat},dd=dU(s.renewal),off=simT[s.id];
        return(<div key={s.id} onClick={()=>{if(!simOn)openEdit(s)}} style={{display:"flex",alignItems:"center",padding:d?"16px 20px":"12px 14px",borderBottom:i<sorted.length-1?`1px solid ${t.el}`:"none",opacity:off?0.35:1,transition:"all 0.2s",position:"relative",cursor:simOn?"default":"pointer"}}>
          {off&&<div style={{position:"absolute",left:20,right:20,top:"50%",height:1,background:"#ef4444"}}/>}
          <div style={{width:d?44:36,height:d?44:36,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?20:16,marginRight:d?16:12,flexShrink:0}}>{c.e}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:d?16:14,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
              {s.name}
              {(s.freq==="rarely"||s.freq==="never")&&<span style={{fontSize:d?10:9,background:"#ef444422",color:"#ef4444",padding:"2px 8px",borderRadius:4}}>low use</span>}
              {s.labels?.map(lb=>{const lbl=LABELS.find(x=>x.k===lb);return lbl?<span key={lb} style={{fontSize:d?10:9,background:lbl.c+"22",color:lbl.c,padding:"2px 8px",borderRadius:4}}>{lbl.l}</span>:null})}
            </div>
            <div style={{fontSize:d?13:11,color:t.mt,marginTop:2}}>{c.l}{dd<999?` · ${dd}d`:""}{s.notes?` · ${s.notes}`:""}{s.sat?` · ${"⭐".repeat(s.sat)}`:""}</div>
          </div>
          <div style={{textAlign:"right",marginRight:simOn?8:0}}>
            <div style={{fontSize:d?18:15,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>-{fm(costView==="annual"?s.cost*12:s.cost)}</div>
          </div>
          {simOn&&(
            <button onClick={e=>{e.stopPropagation();setSimT({...simT,[s.id]:!off})}} style={{background:off?"#ef4444":t.el,color:off?"#fff":t.mt,border:"none",borderRadius:6,padding:d?"6px 10px":"4px 8px",fontSize:d?12:10,cursor:"pointer",marginLeft:8,fontWeight:600,fontFamily:"inherit"}}>{off?"↩":"✕"}</button>
          )}
          {!simOn&&(
            <button onClick={e=>{e.stopPropagation();if(window.confirm(`Remove ${s.name}?`))remove(s.id)}} style={{background:"transparent",color:t.bd3,border:"none",fontSize:d?20:16,cursor:"pointer",padding:"0 4px",marginLeft:8}}>×</button>
          )}
        </div>)})}
      </div>)})()}
    </div>
  </div>)};

  // ═══ AUDIT ═══
  const aud=act.filter(s=>!s.trial);
  const fO=[{v:"daily",e:"🔥",l:"Daily"},{v:"weekly",e:"👍",l:"Weekly"},{v:"monthly",e:"🤷",l:"Monthly"},{v:"rarely",e:"😬",l:"Rarely"},{v:"never",e:"💀",l:"Never"}];
  const gR=s=>{const a=aAns[s.id]||{},f=a.frequency||s.freq,sa=a.satisfaction||s.sat,m=a.wouldMiss!==undefined?a.wouldMiss:s.miss;if(!f||!sa)return"keep";if((f==="rarely"||f==="never")&&sa<=2&&!m)return"cancel";if((f==="rarely"||f==="never")&&sa<=3)return"downgrade";if(f==="monthly"&&s.cost>15&&sa<=3)return"downgrade";return"keep"};

  const Audit=()=>{
    if(aStep===-1){
      const recs=aud.map(s=>({...s,rec:gR(s)}));const has=aud.some(s=>aAns[s.id]||s.sat);
      const cuts=recs.filter(r=>r.rec==="cancel"),cS=cuts.reduce((a,r)=>a+r.cost,0);
      return(<div style={{display:"flex",flexDirection:"column",gap:d?18:14,maxWidth:d?900:undefined,margin:d?"0 auto":undefined}}>
        <div style={{textAlign:"center",padding:d?"24px 0":"16px 0"}}>
          <Ring s={score} size={d?130:100} bg={t.bd} tc={t.tx}/>
          <p style={{fontSize:d?15:13,color:t.mt,marginTop:12,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>{score>=80?"Looking good — let's confirm nothing changed":"A few tweaks could boost your score"}</p>
          {aud.length>0?<button onClick={()=>setAS(0)} style={{...B,background:t.acc,color:"#000",padding:d?"14px 32px":"12px 28px",fontSize:d?16:14,fontWeight:700,borderRadius:10,marginTop:14}}>Start Audit · {aud.length} subs</button>
          :<div style={{fontSize:d?14:12,color:t.mt,marginTop:14}}>No subscriptions to audit yet</div>}
        </div>

        {has&&<>
          <div ref={reportRef} style={{background:t.sf,borderRadius:16,padding:d?32:24,textAlign:"center"}}>
            <div style={{fontSize:d?12:10,color:t.dm,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>✂️ Audit Report</div>
            <div style={{fontSize:d?52:42,fontWeight:700,lineHeight:1}}>{score}</div>
            <div style={{fontSize:d?14:12,color:t.mt,fontWeight:500,marginTop:6,marginBottom:20}}>SubScore</div>
            <div style={{display:"flex",justifyContent:"center",gap:d?32:24,marginBottom:14}}>
              <div><div style={{fontSize:d?24:20,fontWeight:700,color:t.acc}}>{fm(cS)}</div><div style={{fontSize:d?12:10,color:t.mt}}>monthly</div></div>
              <div><div style={{fontSize:d?24:20,fontWeight:700,color:t.acc}}>{fm(cS*12)}</div><div style={{fontSize:d?12:10,color:t.mt}}>annual</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:10}}>
              {[{l:"Keep",n:recs.filter(r=>r.rec==="keep").length,c:"#00d48a"},{l:"Cut",n:cuts.length,c:"#ef4444"},{l:"Downgrade",n:recs.filter(r=>r.rec==="downgrade").length,c:"#f59e0b"}].map((x,i)=>(
                <span key={i} style={{fontSize:d?13:11,fontWeight:600,color:x.c,background:x.c+"18",padding:d?"4px 14px":"3px 10px",borderRadius:20}}>{x.l} {x.n}</span>
              ))}
            </div>
            <div style={{fontSize:d?10:8,color:t.dm,marginTop:14}}>subtrim.dev</div>
          </div>
          <button onClick={exportReport} style={{...B,background:t.sf,color:t.mt2,fontSize:d?13:11,borderRadius:8,border:`1px solid ${t.bd2}`,padding:d?"10px 20px":"8px 16px",alignSelf:"center"}}>📤 Share Report</button>

          <div style={isMobile?{}:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[{k:"keep",l:"Keep",c:"#00d48a"},{k:"downgrade",l:"Downgrade",c:"#f59e0b"},{k:"cancel",l:"Cut",c:"#ef4444"}].map(({k,l,c})=>{
            const items=recs.filter(r=>r.rec===k);
            return(<div key={k}>
              <div style={{fontSize:d?14:12,fontWeight:700,color:c,marginBottom:8}}>{l} ({items.length})</div>
              <div style={{background:t.sf,borderRadius:12,overflow:"hidden",minHeight:d?60:48}}>
                {items.length===0&&<div style={{padding:d?"16px 18px":"12px 14px",fontSize:d?13:11,color:t.dm,textAlign:"center"}}>None</div>}
                {items.map((s,i)=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",padding:d?"14px 18px":"10px 14px",borderBottom:i<items.length-1?`1px solid ${t.el}`:"none"}}>
                    <div style={{width:d?38:32,height:d?38:32,borderRadius:"50%",background:(CATS[s.cat]?.c||"#666")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?16:14,marginRight:d?12:10}}>{CATS[s.cat]?.e||"📦"}</div>
                    <div style={{flex:1}}><div style={{fontSize:d?15:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:d?12:10,color:t.mt}}>{k==="cancel"?`Saves ${fm(s.cost*12)}/yr`:k==="keep"?`${s.freq||"—"} · ${s.sat||0}★`:(()=>{const dg=getDowngrade(s.name,s.cost);return dg?`Switch to ${dg.name} — save ${fm(dg.save)}/mo`:"Consider a lower plan"})()}</div>{k==="cancel"&&CANCEL_GUIDES[s.name]&&<button onClick={()=>setEditId(s.id)} style={{...B,padding:0,fontSize:d?11:9,color:t.acc,fontWeight:600,marginTop:2}}>How to cancel →</button>}</div>
                    <span style={{fontSize:d?16:14,fontWeight:700,color:c}}>-{fm(s.cost)}</span>
                  </div>
                ))}
              </div>
            </div>)})}
          </div>
        </>}
      </div>)
    }
    const cur=aud[aStep];if(!cur)return null
    const ans=aAns[cur.id]||{},ct=CATS[cur.cat]||{e:"📦"},tp=cur.cost*mS(cur.added);
    return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:d?18:14,maxWidth:d?560:420,margin:"0 auto",width:"100%"}}>
      <div style={{width:"100%",display:"flex",gap:2}}>{aud.map((_,i)=><div key={i} style={{flex:1,height:d?4:3,borderRadius:2,background:i<aStep?t.acc:i===aStep?t.acc2:t.el}}/>)}</div>
      <div style={{fontSize:d?13:11,color:t.mt}}>{aStep+1}/{aud.length}</div>
      <div style={{width:"100%",background:t.sf,borderRadius:16,padding:d?36:24,textAlign:"center"}}>
        <div style={{width:d?60:50,height:d?60:50,borderRadius:"50%",background:(CATS[cur.cat]?.c||"#666")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?28:24,margin:"0 auto 12px"}}>{ct.e}</div>
        <div style={{fontSize:d?22:18,fontWeight:700,marginBottom:4}}>{cur.name}</div>
        <div style={{fontSize:d?14:12,color:t.mt}}>{fm(cur.cost)}/mo</div>
        <div style={{fontSize:d?13:11,color:"#f59e0b",fontWeight:600,marginBottom:22}}>Total paid: {fm(tp)} over {mS(cur.added)}mo</div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:d?14:12,fontWeight:600,marginBottom:10}}>How often do you use this?</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>{fO.map(o=><button key={o.v} onClick={()=>setAA({...aAns,[cur.id]:{...ans,frequency:o.v}})} style={{...B,padding:d?"8px 16px":"6px 11px",fontSize:d?13:11,borderRadius:8,background:ans.frequency===o.v?(o.v==="daily"?t.acc:o.v==="never"?"#ef4444":"#f59e0b"):t.el,color:ans.frequency===o.v?"#000":t.mt2}}>{o.e} {o.l}</button>)}</div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:d?14:12,fontWeight:600,marginBottom:10}}>How much do you enjoy it?</div>
          <div style={{display:"flex",gap:4,justifyContent:"center"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setAA({...aAns,[cur.id]:{...ans,satisfaction:n}})} style={{background:"none",border:"none",fontSize:d?28:22,cursor:"pointer",filter:(ans.satisfaction||0)>=n?"none":"grayscale(1) opacity(0.3)",transition:"all 0.15s"}}>⭐</button>)}</div>
        </div>
        <div>
          <div style={{fontSize:d?14:12,fontWeight:600,marginBottom:10}}>Would you miss it?</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={()=>setAA({...aAns,[cur.id]:{...ans,wouldMiss:true}})} style={{...B,padding:d?"10px 24px":"8px 16px",fontSize:d?14:13,borderRadius:8,background:ans.wouldMiss===true?t.acc:t.el,color:ans.wouldMiss===true?"#000":t.mt2}}>Yes</button>
            <button onClick={()=>setAA({...aAns,[cur.id]:{...ans,wouldMiss:false}})} style={{...B,padding:d?"10px 24px":"8px 16px",fontSize:d?14:13,borderRadius:8,background:ans.wouldMiss===false?"#ef4444":t.el,color:ans.wouldMiss===false?"#fff":t.mt2}}>No</button>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,width:"100%"}}>
        {aStep>0&&<button onClick={()=>setAS(aStep-1)} style={{...B,flex:1,background:t.el,color:t.mt2,borderRadius:10,fontSize:d?15:13}}>←</button>}
        <button onClick={()=>{if(aStep<aud.length-1)setAS(aStep+1);else saveAudit()}} style={{...B,flex:2,background:t.acc,color:"#000",fontWeight:700,borderRadius:10,fontSize:d?15:13}}>{aStep<aud.length-1?"Next →":"🎉 Finish"}</button>
      </div>
    </div>)
  };

  // ═══ PROMOS ═══
  const Promos=()=>{
    const myN=new Set(act.map(s=>s.name)),myC=new Set(act.map(s=>s.cat));
    const fil=promos.filter(p=>pF==="all"||(pF==="relevant"&&(myN.has(p.svc)||myC.has(p.cat)))||pF===p.cat);
    const pcKey=p=>`${p.svc}-${p.dt}`;
    const visPC=priceChanges.filter(p=>!dismissedPC.has(pcKey(p)));
    return(<div style={{display:"flex",flexDirection:"column",gap:d?16:12}}>

      {visPC.length>0&&<div style={{background:t.sf,borderRadius:12,padding:d?16:12,borderLeft:"3px solid #f59e0b"}}>
        <div style={{fontSize:d?13:11,fontWeight:700,color:"#f59e0b",marginBottom:6}}>⚠️ Price Changes</div>
        {visPC.map((p,i)=>{return<div key={pcKey(p)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:d?"8px 0":"6px 0",fontSize:d?14:12,borderTop:i?`1px solid ${t.el}`:"none"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600}}>{p.svc}</div>
            <div style={{fontSize:d?11:10,color:t.mt,marginTop:2}}>Effective {p.dt?new Date(p.dt+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'TBD'}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:d?12:8}}>
            <span><span style={{color:t.mt,textDecoration:"line-through"}}>{fm(p.old)}</span><span style={{color:"#ef4444",fontWeight:700,marginLeft:6}}>{fm(p.now)}</span></span>
            <button onClick={()=>setDismissedPC(prev=>{const n=new Set(prev);n.add(pcKey(p));return n})} style={{...B,width:d?28:24,height:d?28:24,borderRadius:"50%",background:t.el,color:t.mt,fontSize:d?14:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>
          </div>
        </div>})}
      </div>}

      {promos.length>0&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,flex:1}}>{[{k:"all",l:"All"},{k:"relevant",l:"🎯 For Me"},...Object.entries(CATS).slice(0,5).map(([k,v])=>({k,l:`${v.e} ${v.l}`}))].map(f=><button key={f.k} onClick={()=>setPF(f.k)} style={{...B,fontSize:d?12:10,padding:d?"7px 14px":"5px 10px",background:pF===f.k?t.acc:t.sf,color:pF===f.k?"#000":t.mt,whiteSpace:"nowrap",borderRadius:6,border:pF===f.k?"none":`1px solid ${t.bd2}`}}>{f.l}</button>)}</div>
        </div>
        <div style={isMobile?{background:t.sf,borderRadius:14,overflow:"hidden"}:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {fil.map((p,i)=>{const c=CATS[p.cat]||{e:"📦",c:"#666"},mine=myN.has(p.svc),safeUrl=p.url&&p.url.startsWith('https://')?p.url:null;
          return(<div key={p.id} onClick={()=>safeUrl&&window.open(safeUrl,'_blank','noopener,noreferrer')} style={{display:"flex",alignItems:"center",padding:d?"16px 18px":"12px 14px",borderBottom:isMobile&&i<fil.length-1?`1px solid ${t.el}`:"none",background:isMobile?"transparent":t.sf,borderRadius:isMobile?0:12,cursor:safeUrl?"pointer":"default",transition:"background 0.15s"}} onMouseEnter={e=>{if(safeUrl)e.currentTarget.style.background=t.el}} onMouseLeave={e=>{e.currentTarget.style.background=isMobile?"transparent":t.sf}}>
            <div style={{width:d?44:36,height:d?44:36,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?20:16,marginRight:d?14:12,flexShrink:0}}>{c.e}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:d?15:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>{p.svc}
                {mine&&<span style={{fontSize:d?10:9,background:t.acc+"22",color:t.acc,padding:"2px 8px",borderRadius:4}}>subscribed</span>}
                {p.type==="new_customer"&&<span style={{fontSize:d?10:9,background:"#3498db22",color:"#3498db",padding:"2px 6px",borderRadius:4}}>new users</span>}
              </div>
              <div style={{fontSize:d?13:11,color:t.mt}}>{p.desc}</div>
              <div style={{fontSize:d?11:9,color:t.dm,marginTop:2}}>Ends {new Date(p.until+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}{safeUrl&&<span style={{color:t.acc,marginLeft:6}}>View Deal →</span>}</div>
            </div>
            <div style={{background:c.c,color:"#fff",fontWeight:800,fontSize:d?14:12,padding:d?"4px 10px":"3px 8px",borderRadius:6,flexShrink:0}}>{p.disc}%</div>
          </div>)})}
        </div>
      </>}

      {promos.length===0&&visPC.length===0&&<div style={{background:t.sf,borderRadius:14,padding:d?32:24,textAlign:"center",color:t.mt,fontSize:d?14:12}}>No deals or price alerts right now. Check back later!</div>}
    </div>)
  };

  // ═══ ACCOUNT ═══
  const Acct=()=>(<div style={{display:"flex",flexDirection:"column",gap:d?16:12,maxWidth:d?800:undefined,margin:d?"0 auto":undefined}}>
    <div style={{display:"flex",alignItems:"center",gap:d?16:12,padding:d?"12px 0":"8px 0"}}>
      <Av bg={av.bg} size={d?64:48}/>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:d?22:16,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div><div style={{fontSize:d?14:11,color:t.mt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div></div>
      {hasAudit&&<Ring s={score} size={d?64:44} sw={d?6:4} bg={t.bd} tc={t.tx}/>}
    </div>

    <div style={{display:"flex",background:t.sf,borderRadius:8,padding:2,gap:2}}>
      {[{k:"profile",l:"Profile"},{k:"household",l:"Household"},{k:"data",l:"Data"}].map(tb=><button key={tb.k} onClick={()=>setATab(tb.k)} style={{...B,flex:1,background:aTab===tb.k?t.el:"transparent",color:aTab===tb.k?t.tx:t.dm2,fontSize:d?14:11,borderRadius:6,padding:d?"9px 4px":"7px 4px"}}>{tb.l}</button>)}
    </div>

    {aTab==="profile"&&<>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:d?14:12,fontWeight:700}}>Choose your color</div>
          <button onClick={()=>setAvOptions(genPalettes())} style={{...B,padding:d?"6px 14px":"4px 10px",background:t.el,color:t.mt,fontSize:d?12:10,borderRadius:6}}>🎲 Shuffle</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${d?5:5},1fr)`,gap:d?12:8}}>{avOptions.map(a=>(
          <button key={a.id} onClick={()=>setAv(a)} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:d?6:4,borderRadius:12,background:av.id===a.id?t.el:"transparent",border:av.id===a.id?`2px solid ${t.acc}`:"2px solid transparent",cursor:"pointer",transition:"all 0.15s"}}>
            <Av bg={a.bg} size={d?52:40} border="none"/>
          </button>
        ))}</div>
      </div>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{fontSize:d?14:12,fontWeight:700,marginBottom:12}}>Appearance</div>
        <div style={{display:"flex",gap:8}}>
          {["dark","light"].map(m=>(
            <button key={m} onClick={()=>syncTheme(m)} style={{...B,flex:1,background:theme===m?t.el:"transparent",color:theme===m?t.tx:t.mt,fontSize:d?14:12,borderRadius:8,border:theme===m?`1px solid ${t.acc}`:`1px solid ${t.bd2}`,padding:d?"10px 0":"8px 0"}}>
              {m==="dark"?"🌙 Dark":"☀️ Light"}
            </button>
          ))}
        </div>
      </div>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{fontSize:d?14:12,fontWeight:700,marginBottom:10}}>Currency</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {CURRENCIES.map(c=>(
            <button key={c.code} onClick={()=>saveCurrency(c.code)} style={{...B,padding:d?"8px 14px":"6px 10px",fontSize:d?13:11,borderRadius:8,background:currency===c.code?t.acc+"22":"transparent",color:currency===c.code?t.acc:t.mt,border:currency===c.code?`1px solid ${t.acc}`:`1px solid ${t.bd2}`,fontWeight:currency===c.code?700:500}}>{c.sym} {c.code}</button>
          ))}
        </div>
        <div style={{fontSize:d?11:9,color:t.dm,marginTop:8}}>All amounts displayed in {currency}. Costs are stored as entered — no auto-conversion.</div>
      </div>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{fontSize:d?14:12,fontWeight:700,marginBottom:10}}>Email Preferences</div>
        {[{k:"monthly_digest",l:"Monthly digest"},{k:"promo_alerts",l:"Promo alerts"},{k:"price_change_alerts",l:"Price change alerts"},{k:"trial_reminders",l:"Trial reminders"}].map(p=><div key={p.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:d?"9px 0":"7px 0",borderBottom:`1px solid ${t.el}`,fontSize:d?14:12,color:t.mt3}}>
          <span>{p.l}</span>
          <button onClick={()=>saveEmailPref(p.k,!emailPrefs[p.k])} style={{width:d?44:38,height:d?24:20,borderRadius:12,background:emailPrefs[p.k]?t.acc:t.el,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",padding:0}}>
            <div style={{width:d?18:14,height:d?18:14,borderRadius:"50%",background:"#fff",position:"absolute",top:d?3:3,left:emailPrefs[p.k]?(d?23:21):(d?3:3),transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
          </button>
        </div>)}
        <div style={{fontSize:d?11:9,color:t.dm,marginTop:8}}>Email delivery will be enabled in a future update. Your preferences are saved.</div>
      </div>
      <button onClick={()=>supabase.auth.signOut()} style={{...B,background:t.el,color:"#ef4444",fontSize:d?14:12,borderRadius:10,padding:d?"12px 18px":"10px 18px"}}>Log Out</button>
      {!deleteConfirm&&<button onClick={()=>setDeleteConfirm(true)} style={{...B,background:"#ef444411",color:"#ef4444",fontSize:d?13:11,borderRadius:10,border:"1px solid #ef444422"}}>Delete Account</button>}
      {deleteConfirm&&<div style={{background:t.sf,borderRadius:14,padding:d?20:14,border:"1px solid #ef444444"}}>
        <div style={{fontSize:d?16:14,fontWeight:700,color:"#ef4444",marginBottom:8}}>Delete your account?</div>
        <div style={{fontSize:d?13:11,color:t.mt,marginBottom:12,lineHeight:1.5}}>This will permanently delete all your subscriptions, audit history, scores, and profile data. This cannot be undone.</div>
        <div style={{fontSize:d?13:11,color:t.mt,marginBottom:8}}>Type <strong style={{color:t.tx}}>DELETE</strong> to confirm:</div>
        <input value={deleteText} onChange={e=>setDeleteText(e.target.value)} placeholder="DELETE" style={{width:"100%",padding:d?"10px 14px":"8px 12px",borderRadius:8,border:`1px solid #ef444444`,background:t.el,color:t.tx,fontSize:d?14:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12}}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setDeleteConfirm(false);setDeleteText("")}} style={{...B,flex:1,background:t.el,color:t.mt,fontSize:d?13:11,borderRadius:8}}>Cancel</button>
          <button disabled={deleteText!=="DELETE"||deleting} onClick={async()=>{
            setDeleting(true);
            try{
              const{error}=await supabase.functions.invoke('delete-account');
              if(error)throw error;
              await supabase.auth.signOut();
              setDeleteConfirm(false);setDeleteText("");
            }catch(e){notify("Deletion failed: "+(e.message||"Unknown error"))}
            setDeleting(false);
          }} style={{...B,flex:1,background:deleteText==="DELETE"?"#ef4444":"#ef444444",color:"#fff",fontSize:d?13:11,borderRadius:8,fontWeight:700,opacity:deleteText!=="DELETE"||deleting?0.5:1}}>{deleting?"Deleting...":"Permanently Delete"}</button>
        </div>
      </div>}
    </>}

    {aTab==="budgets"&&<div style={{display:"flex",flexDirection:"column",gap:d?12:8}}>
      <div style={{fontSize:d?13:11,color:t.mt,padding:"0 2px"}}>Set monthly spending limits per category. You'll see alerts on the dashboard when exceeded.</div>
      <div style={isMobile?{display:"flex",flexDirection:"column",gap:8}:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {Object.entries(CATS).map(([k,c])=>{const sp=act.filter(s=>s.cat===k).reduce((a,s)=>a+s.cost,0),lim=budgets[k]||0,pct=lim>0?Math.min(100,(sp/lim)*100):0,ov=lim>0&&sp>lim;
      return(<div key={k} style={{background:t.sf,borderRadius:10,padding:d?16:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,fontSize:d?14:12}}>
          <span style={{fontWeight:600}}>{c.e} {c.l}</span>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:ov?"#ef4444":t.mt,fontWeight:ov?700:400}}>{fm(sp)}/</span>
            <span style={{color:t.mt}}>$</span>
            <input value={lim} onChange={e=>{const v=parseInt(e.target.value)||0;saveBudget(k,v)}} type="number" min="0" step="5" style={{width:d?52:44,padding:"2px 4px",borderRadius:4,border:`1px solid ${t.bd2}`,background:t.el,color:ov?"#ef4444":t.tx,fontSize:d?13:11,fontWeight:600,outline:"none",fontFamily:"inherit",textAlign:"right"}}/>
            {ov&&<span style={{fontSize:d?12:10}}>⚠️</span>}
          </div>
        </div>
        <div style={{height:d?6:4,borderRadius:3,background:t.el}}><div style={{height:"100%",borderRadius:3,width:`${pct}%`,background:ov?"#ef4444":pct>80?"#f59e0b":t.acc,transition:"width 0.3s"}}/></div>
      </div>)})}
      </div>
    </div>}

    {aTab==="household"&&<div style={{background:t.sf,borderRadius:14,padding:d?32:24,textAlign:"center"}}>
      <div style={{fontSize:d?48:36,marginBottom:10}}>🏠</div>
      <div style={{fontSize:d?18:14,fontWeight:700,marginBottom:6}}>Household</div>
      <p style={{fontSize:d?14:12,color:t.mt,maxWidth:320,margin:"0 auto 16px"}}>Combine subs with family or roommates to find overlaps and save.</p>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <button onClick={()=>notify("Household feature coming soon")} style={{...B,background:t.acc,color:"#000",borderRadius:8,fontSize:d?14:13,padding:d?"10px 24px":"10px 18px"}}>Create</button>
        <button onClick={()=>notify("Household feature coming soon")} style={{...B,background:t.el,color:t.mt2,borderRadius:8,fontSize:d?14:13,padding:d?"10px 24px":"10px 18px"}}>Join</button>
      </div>
    </div>}

    {aTab==="data"&&<>
      <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])importCSV(e.target.files[0]);e.target.value=""}}/>
      <div style={{background:t.sf,borderRadius:14,padding:d?20:14}}>
        <div style={{fontSize:d?14:12,fontWeight:700,marginBottom:10}}>Your Data</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={exportCSV} disabled={!act.length} style={{...B,flex:1,background:t.el,color:act.length?t.mt2:t.dm,fontSize:d?14:12,borderRadius:8,opacity:act.length?1:0.5}}>📤 Export ({act.length})</button>
          <button onClick={()=>fileRef.current?.click()} disabled={csvImporting} style={{...B,flex:1,background:t.el,color:t.mt2,fontSize:d?14:12,borderRadius:8,opacity:csvImporting?0.5:1}}>{csvImporting?"Importing...":"📥 Import"}</button>
        </div>
        <div style={{fontSize:d?11:9,color:t.dm,marginTop:8}}>CSV format: Name, Category, Monthly Cost, Billing Cycle, Renewal Date, Labels, Notes</div>
      </div>
      <div style={{background:theme==="dark"?"linear-gradient(135deg,#141414,#1a1025)":"linear-gradient(135deg,#f5f5f7,#ede8f5)",borderRadius:16,padding:d?32:24,textAlign:"center",border:theme==="dark"?"1px solid #2a1a3e":"1px solid #d0c8e0"}}>
        <div style={{fontSize:d?12:10,color:"#9b59b6",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Coming December 2026</div>
        <div style={{fontSize:d?36:28,marginBottom:8}}>🎁</div>
        <div style={{fontSize:d?22:18,fontWeight:700,marginBottom:6}}>SubTrim Wrapped</div>
        <p style={{fontSize:d?13:11,color:t.mt,maxWidth:320,margin:"0 auto 16px",lineHeight:1.5}}>Your year-in-review. Total spend, savings, top services, and SubScore journey.</p>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:14}}>
          {["📊","💰","🔥","⭐","✂️"].map((e,i)=><div key={i} style={{width:d?32:26,height:d?44:38,borderRadius:6,background:["#e74c3c","#9b59b6","#2ecc71","#3498db","#f39c12"][i]+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?12:10,border:"1px solid #ffffff08"}}>{e}</div>)}
        </div>
        <span style={{fontSize:d?12:10,color:"#9b59b6",fontWeight:600,background:"#9b59b622",padding:"4px 12px",borderRadius:20}}>🔔 We'll notify you</span>
      </div>
    </>}
  </div>);

  const addSub=async(svc,cost)=>{
    const price=cost||svc.price||0;
    const{data,error}=await supabase.from('subscriptions').insert({
      user_id:user.id,service_id:svc.id,
      monthly_cost:price,
      billing_cycle:'monthly',
      renewal_date:new Date(Date.now()+30*864e5).toISOString().split('T')[0],
      status:'active',
      custom_tags:addLabels.length?addLabels:null,
      notes:addNotes||null,
    }).select('*, known_services(name, category, tags)').single();
    if(error){notify('Failed to add: '+error.message);return}
    setSubs(prev=>[...prev,{
      id:data.id,serviceId:data.service_id,
      name:data.known_services?.name||'Unknown',
      cat:data.known_services?.category||'lifestyle',
      cost:Number(data.monthly_cost),cycle:data.billing_cycle,
      renewal:data.renewal_date,trial:data.is_trial,
      trialEnd:data.trial_end_date,sat:null,freq:null,miss:null,
      audit:null,added:data.created_at?.split('T')[0],
      tags:data.known_services?.tags||[],labels:data.custom_tags||[],notes:data.notes||'',
    }]);
    notify(`✅ ${svc.n} added`);setAddM(false);setAddS("");setAddSvc(null);setAddCost("");setAddLabels([]);setAddNotes("");
  };

  // Top services for onboarding (order = popularity)
  const OB_TOP=['Netflix','Spotify','Amazon Prime Video','YouTube Premium','Disney+','Hulu','HBO Max',
    'Apple Music','ChatGPT Plus','iCloud+','Google One','Microsoft 365','Apple TV+','Xbox Game Pass',
    'PlayStation Plus','Adobe Creative Cloud','Paramount+','Peacock','NordVPN','Claude Pro'];

  const finishOnboarding=async()=>{
    const picks=Object.entries(obPicks).filter(([,v])=>v);
    if(!picks.length){setOnboarding(false);return}
    setObLoading(true);
    let added=0;
    for(const[svcName,cost] of picks){
      const match=knSvc.find(k=>k.name===svcName);
      if(!match)continue;
      const{data}=await supabase.from('subscriptions').insert({
        user_id:user.id,service_id:match.id,monthly_cost:cost,billing_cycle:'monthly',
        renewal_date:new Date(Date.now()+30*864e5).toISOString().split('T')[0],status:'active',
      }).select('*, known_services(name, category, tags)').single();
      if(data){added++;setSubs(prev=>[...prev,{id:data.id,serviceId:data.service_id,name:data.known_services?.name||svcName,
        cat:data.known_services?.category||'lifestyle',cost:Number(data.monthly_cost),cycle:data.billing_cycle,
        renewal:data.renewal_date,trial:false,trialEnd:null,sat:null,freq:null,miss:null,audit:null,
        added:data.created_at?.split('T')[0],tags:data.known_services?.tags||[],labels:[],notes:''}])}
    }
    setObLoading(false);setOnboarding(false);setObPicks({});setObSearch("");
    notify(added>0?`✅ Added ${added} subscription${added>1?"s":""}`:  "No subscriptions added");if(added>0)pop();
  };

  // ═══ NAV + SHELL ═══
  const nav=[{k:"dashboard",l:"Home",e:"📊"},{k:"audit",l:"Audit",e:"🧠",b:needA.length||null},{k:"promos",l:"Deals",e:"🏷️",b:relP||null},{k:"account",l:"Account",e:"👤"}];
  const kn=knSvc.map(s=>({n:s.name,c:s.category,id:s.id,price:s.typical_monthly_price}));
  const fK=addS?kn.filter(k=>k.n.toLowerCase().includes(addS.toLowerCase())):kn;

  return(<div style={{background:t.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:t.tx}}>
    <style>{`*{box-sizing:border-box;margin:0}input::placeholder{color:${t.dm}}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${t.bd3};border-radius:2px}@keyframes cF{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes sU{from{transform:translateY(14px) translateX(-50%);opacity:0}to{transform:translateY(0) translateX(-50%);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}button:active:not(:disabled){transform:scale(0.97)}`}</style>
    <Confetti on={conf}/>

    {/* ═══ DESKTOP SIDEBAR ═══ */}
    {d&&(
      <div style={{position:"fixed",left:0,top:0,bottom:0,width:SB_W,background:t.sb,borderRight:`1px solid ${t.bd}`,display:"flex",flexDirection:"column",zIndex:50,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"24px 22px 32px"}}>
          <span style={{fontSize:22}}>✂️</span>
          <span style={{fontSize:20,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</span>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
          {nav.map(i=>(
            <button key={i.k} onClick={()=>{setPg(i.k);if(i.k==="audit")setAS(-1)}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 22px",background:pg===i.k?t.sf:"transparent",color:pg===i.k?t.tx:t.mt,border:"none",borderLeft:pg===i.k?`3px solid ${t.acc}`:"3px solid transparent",cursor:"pointer",fontSize:15,fontWeight:pg===i.k?600:400,fontFamily:"inherit",transition:"all 0.15s",position:"relative"}}>
              <span style={{fontSize:18}}>{i.e}</span>
              {i.l}
              {i.b&&<div style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto"}}>{i.b}</div>}
            </button>
          ))}
        </div>

        <div style={{padding:"14px 18px",borderTop:`1px solid ${t.bd}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setPg("account")}>
          <Av bg={av.bg} size={36}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
            <div style={{fontSize:11,color:t.mt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
          </div>
        </div>
      </div>
    )}

    {/* ═══ MOBILE TOP BAR ═══ */}
    {isMobile&&(
      <div style={{position:"sticky",top:0,zIndex:50,background:t.abg,borderBottom:`1px solid ${t.bd}`,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
        <div style={{maxWidth:480,margin:"0 auto",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>✂️</span><span style={{fontSize:15,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</span></div>
          <div onClick={()=>setPg("account")} style={{cursor:"pointer"}}><Av bg={av.bg} size={28}/></div>
        </div>
      </div>
    )}

    {/* ═══ CONTENT ═══ */}
    <div style={isMobile?{maxWidth:480,margin:"0 auto",padding:"12px 16px 96px"}:{marginLeft:SB_W,padding:"28px 48px 40px"}}>
      {pg==="dashboard"&&Dash()}{pg==="audit"&&Audit()}{pg==="promos"&&Promos()}{pg==="account"&&Acct()}
    </div>

    {/* FAB — mobile only */}
    {isMobile&&pg==="dashboard"&&<button onClick={()=>setAddM(true)} style={{position:"fixed",bottom:72,right:20,width:48,height:48,borderRadius:"50%",background:t.acc,color:"#000",border:"none",fontSize:22,fontWeight:300,cursor:"pointer",boxShadow:`0 4px 16px ${t.acc}44`,zIndex:40,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>}

    {/* ═══ MOBILE BOTTOM NAV ═══ */}
    {isMobile&&(
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:t.abg,borderTop:`1px solid ${t.bd}`,zIndex:50,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"flex"}}>{nav.map(i=><button key={i.k} onClick={()=>{setPg(i.k);if(i.k==="audit")setAS(-1)}} style={{flex:1,padding:"8px 0 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,position:"relative"}}>
          <div style={{position:"relative"}}><span style={{fontSize:16,filter:pg===i.k?"none":"grayscale(0.6) opacity(0.4)"}}>{i.e}</span>
            {i.b&&<div style={{position:"absolute",top:-3,right:-7,background:"#ef4444",color:"#fff",fontSize:8,fontWeight:800,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{i.b}</div>}
          </div>
          <span style={{fontSize:9,fontWeight:pg===i.k?700:400,color:pg===i.k?t.acc:t.dm}}>{i.l}</span>
        </button>)}</div>
      </div>
    )}

    {/* Toast */}
    {toast&&<div style={{position:"fixed",top:isMobile?52:24,left:isMobile?"50%":undefined,right:isMobile?undefined:48,transform:isMobile?"translateX(-50%)":"none",background:t.sf,border:`1px solid ${t.acc}44`,borderRadius:10,padding:d?"10px 20px":"8px 16px",zIndex:200,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",animation:"sU 0.25s ease",fontSize:d?14:12,fontWeight:600,maxWidth:"85%",textAlign:"center"}}>{toast}</div>}

    {/* Add Modal */}
    {addM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center"}} onClick={()=>{setAddM(false);setAddS("");setAddSvc(null);setAddCost("");setAddLabels([]);setAddNotes("");setCustomMode(false);setCustomName("");setCustomCost("")}}>

      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:d?560:480,background:t.sf,borderRadius:isMobile?"16px 16px 0 0":"16px",padding:d?28:18,maxHeight:isMobile?"60vh":"70vh",overflowY:"auto"}}>
        {isMobile&&<div style={{width:32,height:4,borderRadius:2,background:t.bd3,margin:"0 auto 12px"}}/>}

        {/* Step 2: Tier/configure */}
        {addSvc&&!customMode&&(()=>{const tiers=TIERS[addSvc.n];const cc=CATS[addSvc.c]||{e:"📦",c:"#666"};return(<div>
          <button onClick={()=>{setAddSvc(null);setAddCost("")}} style={{...B,padding:"4px 0",background:"none",color:t.mt,fontSize:d?13:11,marginBottom:8}}>← Back</button>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:d?48:40,height:d?48:40,borderRadius:"50%",background:cc.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?22:18}}>{cc.e}</div>
            <div><div style={{fontSize:d?20:16,fontWeight:700}}>{addSvc.n}</div><div style={{fontSize:d?13:11,color:t.mt}}>{cc.l||addSvc.c}</div></div>
          </div>
          {tiers&&<>
            <div style={{fontSize:d?13:11,color:t.mt,fontWeight:600,marginBottom:8}}>Select your plan</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
              {tiers.map(tr=><button key={tr.n} onClick={()=>setAddCost(String(tr.p))} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:d?"14px 16px":"11px 14px",background:addCost===String(tr.p)?t.acc+"22":t.el,border:addCost===String(tr.p)?`1px solid ${t.acc}`:`1px solid transparent`,borderRadius:10,cursor:"pointer",color:t.tx,fontSize:d?15:13,fontWeight:500,fontFamily:"inherit",transition:"all 0.15s"}}>
                <span>{tr.n}</span>
                <span style={{fontWeight:700,fontSize:d?16:14}}>{fm(tr.p)}<span style={{fontSize:d?11:9,color:t.mt,fontWeight:400}}>/mo</span></span>
              </button>)}
            </div>
          </>}
          {!tiers&&<div style={{fontSize:d?13:11,color:t.mt,marginBottom:6}}>Typical price: {fm(addSvc.price||0)}/mo</div>}
          <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:4}}>{tiers?"Or enter custom price":"Monthly cost"}</div>
          <input value={addCost} onChange={e=>setAddCost(e.target.value)} placeholder={String(addSvc.price||0)} type="number" min="0" step="0.01" style={{width:"100%",padding:d?"12px 14px":"10px 12px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?16:14,fontWeight:700,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12}}/>
          <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:6}}>Labels</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>{LABELS.map(lb=><button key={lb.k} onClick={()=>toggleLabel(addLabels,setAddLabels,lb.k)} style={{...B,padding:d?"5px 12px":"4px 10px",fontSize:d?12:10,borderRadius:6,background:addLabels.includes(lb.k)?lb.c+"22":t.el,color:addLabels.includes(lb.k)?lb.c:t.mt,border:addLabels.includes(lb.k)?`1px solid ${lb.c}44`:"1px solid transparent"}}>{lb.l}</button>)}</div>
          <input value={addNotes} onChange={e=>setAddNotes(e.target.value)} placeholder="Note (e.g. $2.99/mo until Dec 2026)" maxLength={80} style={{width:"100%",padding:d?"10px 14px":"8px 12px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?13:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12}}/>
          <button onClick={()=>{const c=parseFloat(addCost)||addSvc.price||0;if(c<=0){notify('Enter a price');return}addSub(addSvc,c)}} style={{...B,width:"100%",background:t.acc,color:"#000",fontWeight:700,fontSize:d?15:13,borderRadius:10,padding:d?"14px":"12px"}}>Add {addSvc.n} · {fm(parseFloat(addCost)||addSvc.price||0)}/mo</button>
        </div>)})()}

        {/* Step 1: Search */}
        {!addSvc&&!customMode&&<>
          <div style={{fontSize:d?18:15,fontWeight:700,marginBottom:12}}>Add Subscription</div>
          <input value={addS} onChange={e=>setAddS(e.target.value)} placeholder="Search services..." style={{width:"100%",padding:d?"13px 16px":"11px 14px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?15:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}}/>
          <div style={{display:"flex",flexDirection:"column",gap:2,maxHeight:d?360:280,overflowY:"auto",paddingRight:4}}>
            {fK.map(k=>{const dup=act.some(s=>s.name===k.n),cc=CATS[k.c]||{e:"📦",c:"#666"},hasTiers=!!TIERS[k.n];return <button key={k.n} onClick={()=>{if(dup){notify(`⚠️ ${k.n} is already in your subscriptions`);return}setAddSvc(k);setAddCost("")}} style={{display:"flex",alignItems:"center",gap:10,padding:d?"12px 14px":"10px 12px",background:t.el,border:"none",borderRadius:8,cursor:"pointer",width:"100%",textAlign:"left",color:t.tx,fontSize:d?15:13,fontWeight:500,fontFamily:"inherit",transition:"background 0.1s",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.background=t.bd2} onMouseLeave={e=>e.currentTarget.style.background=t.el}>
              <div style={{width:d?36:30,height:d?36:30,borderRadius:"50%",background:cc.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?15:13}}>{cc.e}</div>
              <span style={{flex:1}}>{k.n}</span>
              {hasTiers&&<span style={{fontSize:d?10:8,background:t.acc+"22",color:t.acc,padding:"2px 6px",borderRadius:4,fontWeight:600}}>{TIERS[k.n].length} plans</span>}
              {!hasTiers&&k.price>0&&<span style={{fontSize:d?11:9,color:t.mt,fontWeight:400}}>{fm(k.price)}/mo</span>}
              {dup&&<span style={{fontSize:d?11:9,color:t.mt,fontWeight:400}}>added</span>}
            </button>})}
          </div>
        </>}

        {/* Custom subscription */}
        {!addSvc&&<button onClick={()=>setCustomMode(!customMode)} style={{...B,width:"100%",marginTop:10,background:customMode?t.acc:t.el,color:customMode?"#000":t.mt,fontSize:d?13:11,borderRadius:8}}>{customMode?"← Back to catalog":"+ Custom subscription"}</button>}
        {customMode&&<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
          <div style={{fontSize:d?18:15,fontWeight:700,marginBottom:4}}>Custom Subscription</div>
          <input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Service name" maxLength={40} style={{width:"100%",padding:d?"12px 14px":"10px 12px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?14:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:8}}>
            <select value={customCat} onChange={e=>setCustomCat(e.target.value)} style={{flex:1,padding:d?"12px 10px":"10px 8px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?13:11,fontFamily:"inherit",cursor:"pointer"}}>
              {Object.entries(CATS).map(([k,v])=><option key={k} value={k}>{v.e} {v.l}</option>)}
            </select>
            <input value={customCost} onChange={e=>setCustomCost(e.target.value)} placeholder="$/mo" type="number" min="0" step="0.01" style={{width:100,padding:d?"12px 10px":"10px 8px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?13:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <button onClick={addCustomSub} style={{...B,width:"100%",background:t.acc,color:"#000",fontWeight:700,fontSize:d?14:12,borderRadius:8}}>Add Custom</button>
        </div>}
      </div>
    </div>}

    {/* Edit Modal */}
    {editId&&(()=>{const es=subs.find(x=>x.id===editId);if(!es)return null;const ec=CATS[es.cat]||{e:"📦",c:"#666",l:es.cat};return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center"}} onClick={()=>setEditId(null)}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:d?480:420,background:t.sf,borderRadius:isMobile?"16px 16px 0 0":"16px",padding:d?28:18}}>
        {isMobile&&<div style={{width:32,height:4,borderRadius:2,background:t.bd3,margin:"0 auto 12px"}}/>}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:d?48:40,height:d?48:40,borderRadius:"50%",background:ec.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?22:18}}>{ec.e}</div>
          <div><div style={{fontSize:d?20:16,fontWeight:700}}>{es.name}</div><div style={{fontSize:d?13:11,color:t.mt}}>{ec.l}</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:4}}>Monthly Cost</div>
            <input value={editCost} onChange={e=>setEditCost(e.target.value)} type="number" min="0" step="0.01" style={{width:"100%",padding:d?"12px 14px":"10px 12px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?18:15,fontWeight:700,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:4}}>Billing Cycle</div>
              <select value={editCycle} onChange={e=>setEditCycle(e.target.value)} style={{width:"100%",padding:d?"12px 10px":"10px 8px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?14:12,fontFamily:"inherit",cursor:"pointer"}}>
                <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="annual">Annual</option>
              </select>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:4}}>Renewal Date</div>
              <input value={editRenewal} onChange={e=>setEditRenewal(e.target.value)} type="date" style={{width:"100%",padding:d?"12px 10px":"10px 8px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?14:12,fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
          </div>
          <div>
            <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:6}}>Labels</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{LABELS.map(lb=><button key={lb.k} onClick={()=>toggleLabel(editLabels,setEditLabels,lb.k)} style={{...B,padding:d?"5px 12px":"4px 10px",fontSize:d?12:10,borderRadius:6,background:editLabels.includes(lb.k)?lb.c+"22":t.el,color:editLabels.includes(lb.k)?lb.c:t.mt,border:editLabels.includes(lb.k)?`1px solid ${lb.c}44`:"1px solid transparent"}}>{lb.l}</button>)}</div>
          </div>
          <div>
            <div style={{fontSize:d?12:10,color:t.mt,fontWeight:600,marginBottom:4}}>Note</div>
            <input value={editNotes} onChange={e=>setEditNotes(e.target.value)} placeholder="e.g. $2.99/mo promo until Dec 2026" maxLength={80} style={{width:"100%",padding:d?"10px 14px":"8px 12px",borderRadius:8,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?13:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          {(()=>{const cg=CANCEL_GUIDES[es.name];if(!cg)return null;return(
          <details style={{background:t.el,borderRadius:10,overflow:"hidden"}}>
            <summary style={{padding:d?"12px 14px":"10px 12px",fontSize:d?13:11,fontWeight:600,color:t.acc,cursor:"pointer",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>📋 How to Cancel {es.name}</span>
              <span style={{fontSize:d?11:9,padding:"2px 8px",borderRadius:4,background:cg.difficulty==='easy'?'#00d48a22':cg.difficulty==='medium'?'#f59e0b22':'#ef444422',color:cg.difficulty==='easy'?'#00d48a':cg.difficulty==='medium'?'#f59e0b':'#ef4444',fontWeight:600}}>{cg.difficulty}</span>
            </summary>
            <div style={{padding:d?"0 14px 14px":"0 12px 12px"}}>
              <ol style={{margin:0,paddingLeft:d?20:16,fontSize:d?12:10,color:t.mt,lineHeight:1.8}}>
                {cg.steps.map((step,i)=><li key={i}>{step}</li>)}
              </ol>
              {cg.note&&<div style={{fontSize:d?11:9,color:t.dm,marginTop:8,fontStyle:"italic"}}>💡 {cg.note}</div>}
              {cg.url&&<a href={cg.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:d?12:10,color:t.acc,fontWeight:600,textDecoration:"none"}}>Go to cancellation page →</a>}
            </div>
          </details>)})()}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={saveSub} disabled={saving} style={{...B,flex:2,background:t.acc,color:"#000",fontWeight:700,fontSize:d?15:13,borderRadius:10,opacity:saving?0.6:1}}>{saving?"Saving...":"Save"}</button>
            <button onClick={()=>{if(window.confirm(`Remove ${es.name}?`)){remove(es.id);setEditId(null)}}} disabled={!!removing} style={{...B,flex:1,background:"#ef444422",color:"#ef4444",fontSize:d?13:11,borderRadius:10,opacity:removing?0.5:1}}>Remove</button>
          </div>
        </div>
      </div>
    </div>)})()}

    {/* Onboarding */}
    {onboarding&&<div style={{position:"fixed",inset:0,background:t.bg+"f5",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:d?640:480,maxHeight:"85vh",overflowY:"auto",background:t.sf,borderRadius:20,padding:d?36:24}}>
        <div style={{textAlign:"center",marginBottom:d?28:20}}>
          <div style={{fontSize:d?40:32,marginBottom:8}}>✂️</div>
          <div style={{fontSize:d?24:18,fontWeight:800}}>Welcome to SubTrim!</div>
          <p style={{fontSize:d?15:13,color:t.mt,marginTop:8,lineHeight:1.5}}>Which of these do you subscribe to? Tap to select — we'll add them for you.</p>
        </div>
        <input value={obSearch} onChange={e=>setObSearch(e.target.value)} placeholder="Search services..." style={{width:"100%",padding:d?"12px 16px":"10px 14px",borderRadius:10,border:`1px solid ${t.bd2}`,background:t.el,color:t.tx,fontSize:d?14:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:d?12:8}}/>
        <div style={{display:"grid",gridTemplateColumns:d?"repeat(2,1fr)":"1fr",gap:d?8:6}}>
          {OB_TOP.filter(sn=>!obSearch||sn.toLowerCase().includes(obSearch.toLowerCase())).map(sn=>{const match=knSvc.find(k=>k.name===sn);if(!match)return null;
            const cc=CATS[match.category]||{e:"📦",c:"#666"};
            const sel=!!obPicks[sn];
            const tiers=TIERS[sn];const price=tiers?tiers[0].p:match.typical_monthly_price;
            return(<button key={sn} onClick={()=>setObPicks(prev=>{const n={...prev};if(n[sn])delete n[sn];else n[sn]=price;return n})} style={{display:"flex",alignItems:"center",gap:d?12:10,padding:d?"14px 16px":"11px 14px",background:sel?t.acc+"18":t.el,border:sel?`2px solid ${t.acc}`:"2px solid transparent",borderRadius:12,cursor:"pointer",color:t.tx,fontSize:d?15:13,fontWeight:500,fontFamily:"inherit",transition:"all 0.15s",textAlign:"left"}}>
              <div style={{width:d?40:34,height:d?40:34,borderRadius:"50%",background:cc.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:d?18:15,flexShrink:0}}>{cc.e}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600}}>{sn}</div>
                <div style={{fontSize:d?12:10,color:t.mt}}>{fm(price)}/mo</div>
              </div>
              {sel&&<div style={{width:d?24:20,height:d?24:20,borderRadius:"50%",background:t.acc,color:"#000",fontSize:d?14:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✓</div>}
            </button>)
          })}
        </div>
        {(()=>{const cnt=Object.keys(obPicks).length;const tot=Object.values(obPicks).reduce((a,v)=>a+v,0);return(
          <div style={{marginTop:d?24:16,display:"flex",flexDirection:"column",gap:8}}>
            {cnt>0&&<div style={{textAlign:"center",fontSize:d?14:12,color:t.mt}}>{cnt} selected · {fm(tot)}/mo</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setOnboarding(false);setObPicks({});setObSearch("")}} style={{...B,flex:1,background:t.el,color:t.mt,fontSize:d?15:13,borderRadius:10,padding:d?"14px":"12px"}}>Skip</button>
              <button onClick={finishOnboarding} disabled={obLoading} style={{...B,flex:2,background:t.acc,color:"#000",fontWeight:700,fontSize:d?15:13,borderRadius:10,padding:d?"14px":"12px",opacity:obLoading?0.6:1}}>{obLoading?"Adding...":(cnt>0?`Add ${cnt} subscription${cnt>1?"s":""}`:  "Continue")}</button>
            </div>
          </div>
        )})()}
      </div>
    </div>}
  </div>)
}
