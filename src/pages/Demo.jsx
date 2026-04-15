import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';
import { TIERS, SERVICE_CATS } from '../data/serviceData';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"};
const fm=n=>'$'+Number(n).toFixed(2);

const CATS={
  streaming:{e:"🎬",c:"#e74c3c"},music:{e:"🎵",c:"#a855f7"},gaming:{e:"🎮",c:"#2ecc71"},
  productivity:{e:"💼",c:"#3498db"},creative:{e:"🎨",c:"#f39c12"},ai:{e:"🤖",c:"#8b5cf6"},
  cloud:{e:"☁️",c:"#06b6d4"},vpn:{e:"🛡️",c:"#607d8b"},passwords:{e:"🔑",c:"#78909c"},
  lifestyle:{e:"✨",c:"#ec4899"},education:{e:"📚",c:"#14b8a6"},fitness:{e:"💪",c:"#e67e22"},
  news:{e:"📰",c:"#1abc9c"},
};

const PICK_ORDER=[
  'Netflix','Spotify','Hulu','Disney+','HBO Max','Amazon Prime Video','Apple TV+',
  'YouTube Premium','Paramount+','Peacock','Crunchyroll',
  'Apple Music','YouTube Music','Tidal',
  'ChatGPT Plus','Claude Pro',
  'Adobe Creative Cloud','Figma','Microsoft 365','Notion',
  'Xbox Game Pass','PlayStation Plus','Discord Nitro',
  'NordVPN','1Password','Dropbox','Google One','iCloud+',
  'Audible','Duolingo','Calm','NYT',
];

// Verified Simple Icons slugs (trademark-approved brands only)
const LOGOS={
  'Netflix':'netflix','Spotify':'spotify','HBO Max':'max','Apple TV+':'appletv',
  'YouTube Premium':'youtube','Paramount+':'paramountplus','Peacock':'peacock',
  'Crunchyroll':'crunchyroll','Apple Music':'applemusic','YouTube Music':'youtubemusic',
  'Tidal':'tidal','Claude Pro':'claude','Notion':'notion',
  'PlayStation Plus':'playstation','NordVPN':'nordvpn','1Password':'1password',
  'Dropbox':'dropbox','iCloud+':'icloud',
  'Audible':'audible','Figma':'figma','Duolingo':'duolingo',
  'Discord Nitro':'discord','NYT':'newyorktimes',
};

// Domain fallback for brands Simple Icons doesn't carry (Google favicon service)
const DOMAINS={
  'Hulu':'hulu.com','Disney+':'disneyplus.com','Amazon Prime Video':'primevideo.com',
  'ChatGPT Plus':'openai.com','Adobe Creative Cloud':'adobe.com',
  'Microsoft 365':'microsoft.com','Xbox Game Pass':'xbox.com',
  'Google One':'one.google.com','Calm':'calm.com',
};

const EXTRAS={
  'Audible':{cat:'lifestyle',price:14.95},
  'Figma':{cat:'creative',price:15},
  'Duolingo':{cat:'education',price:6.99},
  'Discord Nitro':{cat:'productivity',price:9.99},
  'Calm':{cat:'fitness',price:14.99},
  'NYT':{cat:'news',price:17},
};

const getCat=n=>EXTRAS[n]?.cat||SERVICE_CATS[n]||'productivity';
const getPrice=n=>EXTRAS[n]?.price??TIERS[n]?.[0]?.p??9.99;

const fO=[{v:"daily",e:"🔥",l:"Daily"},{v:"weekly",e:"👍",l:"Weekly"},{v:"monthly",e:"🤷",l:"Monthly"},{v:"rarely",e:"😬",l:"Rarely"},{v:"never",e:"💀",l:"Never"}];
const fMap={daily:1,weekly:0.75,monthly:0.4,rarely:0.15,never:0};

const gR=s=>{
  const f=s.freq,sa=s.sat,m=s.miss,c=s.cost;
  if(!f||!sa)return"keep";
  if(f==="never")return"cancel";
  if(f==="rarely"&&(!m||sa<=2))return"cancel";
  if(!m&&sa<=2)return"cancel";
  if(f==="rarely")return"downgrade";
  if(f==="monthly"&&(!m||sa<=3||c>10))return"downgrade";
  if(!m&&c>10)return"downgrade";
  if(sa<=2&&c>10)return"downgrade";
  return"keep";
};

function Logo({name,cat,size=34}){
  const[stage,setStage]=useState(0);
  const c=CATS[cat]||{e:"📦",c:"#666"};
  const slug=LOGOS[name];
  const domain=DOMAINS[name];
  const ic=Math.round(size*0.58);
  const favSize=size>=48?64:32;
  const sources=[];
  if(slug)sources.push(`https://cdn.simpleicons.org/${slug}/ffffff`);
  if(domain)sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=${favSize}`);
  const src=stage<sources.length?sources[stage]:null;
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*0.42),flexShrink:0,overflow:"hidden"}}>
      {src?<img src={src} alt={name} width={ic} height={ic} loading="lazy" onError={()=>setStage(s=>s+1)} style={{objectFit:"contain",borderRadius:4}}/>:c.e}
    </div>
  );
}

export default function Demo(){
  const[picks,setPicks]=useState({});
  const[search,setSearch]=useState("");
  const[subs,setSubs]=useState([]);
  const[step,setStep]=useState(-2);
  const[done,setDone]=useState(false);
  const[customOpen,setCustomOpen]=useState(false);
  const[customName,setCustomName]=useState("");
  const[customPrice,setCustomPrice]=useState("");

  const togglePick=n=>setPicks(p=>{const next={...p};if(next[n])delete next[n];else next[n]=getPrice(n);return next});
  const pickCount=Object.keys(picks).length;
  const pickTotal=Object.values(picks).reduce((a,v)=>a+v,0);

  const addCustom=()=>{
    const nm=customName.trim();
    const pr=parseFloat(customPrice);
    if(!nm||!isFinite(pr)||pr<=0)return;
    setPicks(p=>({...p,[nm]:pr}));
    setCustomName("");setCustomPrice("");setCustomOpen(false);
  };

  const startAudit=()=>{
    const built=Object.entries(picks).map(([name,cost],i)=>({
      id:i+1,name,cat:getCat(name),cost,freq:null,sat:null,miss:null
    }));
    setSubs(built);setStep(-1);
  };

  const resetAll=()=>{setPicks({});setSubs([]);setDone(false);setStep(-2);setSearch("");setCustomOpen(false);setCustomName("");setCustomPrice("")};

  const update=(id,field,val)=>setSubs(prev=>prev.map(s=>s.id===id?{...s,[field]:val}:s));

  const score=useMemo(()=>{
    const audited=subs.filter(s=>s.freq&&s.sat);
    if(!audited.length)return 0;
    const totalCost=audited.reduce((a,s)=>a+s.cost,0)||1;
    const perSub=audited.map(s=>{const f=fMap[s.freq]??0.5,sa=(s.sat||3)/5,m=s.miss?1:0;return{eff:f*0.4+sa*0.3+m*0.3,w:s.cost/totalCost}});
    return Math.max(0,Math.min(100,Math.round(perSub.reduce((a,v)=>a+v.eff*v.w,0)*100)));
  },[subs]);

  const recs=subs.map(s=>({...s,rec:gR(s)}));
  const cuts=recs.filter(r=>r.rec==="cancel");
  const cS=cuts.reduce((a,r)=>a+r.cost,0);

  const finish=()=>{
    setStep(-1);setDone(true);
    try{
      const audit=subs.map(s=>({name:s.name,cat:s.cat,cost:s.cost,freq:s.freq,sat:s.sat,miss:s.miss}));
      localStorage.setItem('subtrim_demo',JSON.stringify({subs:audit,ts:Date.now()}));
    }catch{}
  };

  const filteredServices=PICK_ORDER.filter(n=>!search||n.toLowerCase().includes(search.toLowerCase()));

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Try SubTrim Demo | Free Subscription Audit | SubTrim"
      description="Try SubTrim's subscription audit with your own subscriptions. See how it works before creating an account."
      canonical="https://subtrim.dev/demo"
    />
    <style>{`*{box-sizing:border-box;margin:0}button:active:not(:disabled){transform:scale(0.97)}`}</style>

    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{...B,background:G,color:"#000",padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",borderRadius:10}}>Sign Up Free</Link>
    </nav>

    <div style={{maxWidth:640,margin:"0 auto",padding:"20px 20px 80px"}}>
      {/* Banner */}
      <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:12,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>🧪</span>
        <div style={{fontSize:13,color:G,fontWeight:600}}>Demo Mode <span style={{fontWeight:400,color:MT}}>. Nothing is saved until you create an account</span></div>
      </div>

      {/* Picker */}
      {step===-2&&(()=>{const customKeys=Object.keys(picks).filter(k=>!PICK_ORDER.includes(k));return(
        <div>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:44,marginBottom:10}}>📋</div>
            <h1 style={{fontSize:26,fontWeight:800,marginBottom:8}}>Pick your subscriptions</h1>
            <p style={{fontSize:15,color:MT,lineHeight:1.5}}>Tap the ones you currently pay for. We'll audit them and tell you what to keep, cancel, or downgrade.</p>
          </div>

          <label htmlFor="demo-search" style={{position:"absolute",width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0}}>Search services</label>
          <input id="demo-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services..." aria-label="Search services" style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid #222`,background:SF,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12}}/>

          {customKeys.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {customKeys.map(name=>(
              <div key={name} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px 6px 12px",background:G+"18",border:`1px solid ${G}44`,borderRadius:20}}>
                <span style={{fontSize:13,fontWeight:600,color:TX}}>{name}</span>
                <span style={{fontSize:12,color:MT}}>{fm(picks[name])}/mo</span>
                <button onClick={()=>togglePick(name)} aria-label={`Remove ${name}`} style={{border:"none",background:"none",color:MT,cursor:"pointer",fontSize:16,padding:0,lineHeight:1,fontFamily:"inherit"}}>×</button>
              </div>
            ))}
          </div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:12}}>
            {filteredServices.map(name=>{
              const cat=getCat(name);
              const sel=!!picks[name];
              const price=getPrice(name);
              return(<button key={name} onClick={()=>togglePick(name)} aria-pressed={sel} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:sel?G+"18":EL,border:sel?`2px solid ${G}`:"2px solid transparent",borderRadius:12,cursor:"pointer",color:TX,fontFamily:"inherit",transition:"all 0.15s",textAlign:"left"}}>
                <Logo name={name} cat={cat} size={34}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
                  <div style={{fontSize:11,color:MT}}>{fm(price)}/mo</div>
                </div>
                {sel&&<div style={{width:22,height:22,borderRadius:"50%",background:G,color:"#000",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✓</div>}
              </button>);
            })}
          </div>

          {filteredServices.length===0&&<div style={{textAlign:"center",color:MT,fontSize:14,padding:"20px 0"}}>No matches in our list. Use "Add custom" below.</div>}

          {/* Custom add */}
          {!customOpen?(
            <button onClick={()=>setCustomOpen(true)} style={{...B,width:"100%",background:EL,color:TX,padding:"14px",borderRadius:12,border:`1px dashed #333`,fontSize:14,fontWeight:600,marginBottom:20}}>+ Add custom subscription</button>
          ):(
            <div style={{background:SF,border:`1px solid #222`,borderRadius:12,padding:14,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Add custom subscription</div>
              <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                <input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="e.g. LinkedIn Premium" aria-label="Custom subscription name" maxLength={40} style={{flex:"2 1 200px",padding:"10px 12px",borderRadius:8,border:`1px solid #222`,background:EL,color:TX,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                <input value={customPrice} onChange={e=>setCustomPrice(e.target.value.replace(/[^0-9.]/g,''))} placeholder="9.99" aria-label="Monthly price" inputMode="decimal" style={{flex:"1 1 100px",padding:"10px 12px",borderRadius:8,border:`1px solid #222`,background:EL,color:TX,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setCustomOpen(false);setCustomName("");setCustomPrice("")}} style={{...B,flex:1,background:EL,color:MT,fontSize:13,borderRadius:8}}>Cancel</button>
                <button onClick={addCustom} disabled={!customName.trim()||!parseFloat(customPrice)} style={{...B,flex:2,background:(!customName.trim()||!parseFloat(customPrice))?EL:G,color:(!customName.trim()||!parseFloat(customPrice))?MT:"#000",fontSize:13,borderRadius:8,opacity:(!customName.trim()||!parseFloat(customPrice))?0.5:1}}>Add</button>
              </div>
            </div>
          )}

          <div style={{position:"sticky",bottom:20,background:BG,padding:"16px 0",borderTop:`1px solid #222`,display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:MT}}>{pickCount} selected</div>
              {pickCount>0&&<div style={{fontSize:15,fontWeight:700}}>{fm(pickTotal)}/mo</div>}
            </div>
            <button onClick={startAudit} disabled={pickCount===0} style={{...B,background:pickCount===0?EL:G,color:pickCount===0?MT:"#000",padding:"14px 28px",fontSize:15,fontWeight:700,borderRadius:10,opacity:pickCount===0?0.5:1,cursor:pickCount===0?"not-allowed":"pointer"}}>Start Audit →</button>
          </div>
        </div>
      )})()}

      {/* Overview */}
      {step===-1&&!done&&(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🧠</div>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:8}}>Ready to audit</h1>
          <p style={{fontSize:15,color:MT,marginBottom:24,lineHeight:1.5}}>Answer 3 quick questions for each. We'll tell you what to keep, cancel, or downgrade.</p>
          <div style={{background:SF,borderRadius:14,overflow:"hidden",marginBottom:24}}>
            {subs.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:i<subs.length-1?`1px solid ${EL}`:"none",gap:12}}>
                <Logo name={s.name} cat={s.cat} size={38}/>
                <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:15,fontWeight:600}}>{s.name}</div></div>
                <span style={{fontSize:15,fontWeight:700,color:MT}}>-{fm(s.cost)}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:14,color:MT,marginBottom:16}}>Total: <strong style={{color:TX}}>{fm(subs.reduce((a,s)=>a+s.cost,0))}/mo</strong></div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={()=>setStep(-2)} style={{...B,background:EL,color:MT,padding:"14px 22px",fontSize:14,borderRadius:10}}>← Edit list</button>
            <button onClick={()=>setStep(0)} style={{...B,background:G,color:"#000",padding:"14px 32px",fontSize:16,fontWeight:700,borderRadius:10}}>Start Audit</button>
          </div>
        </div>
      )}

      {/* Audit questions */}
      {step>=0&&step<subs.length&&(()=>{const s=subs[step];return(
        <div>
          <div style={{display:"flex",gap:2,marginBottom:16}}>{subs.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<step?G:i===step?"#00b8d4":EL}}/>)}</div>
          <div style={{fontSize:13,color:MT,textAlign:"center",marginBottom:16}}>{step+1}/{subs.length}</div>
          <div style={{background:SF,borderRadius:16,padding:32,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><Logo name={s.name} cat={s.cat} size={56}/></div>
            <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:14,color:MT,marginBottom:4}}>{fm(s.cost)}/mo</div>

            <div style={{marginTop:24,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>How often do you use this?</div>
              <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>{fO.map(o=><button key={o.v} onClick={()=>update(s.id,'freq',o.v)} style={{...B,padding:"8px 16px",fontSize:13,borderRadius:8,background:s.freq===o.v?(o.v==="daily"?G:o.v==="never"?"#ef4444":"#f59e0b"):EL,color:s.freq===o.v?"#000":MT}}>{o.e} {o.l}</button>)}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>How much do you enjoy it?</div>
              <div style={{display:"flex",gap:4,justifyContent:"center"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>update(s.id,'sat',n)} aria-label={`${n} out of 5 stars`} aria-pressed={s.sat===n} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",filter:(s.sat||0)>=n?"none":"grayscale(1) opacity(0.3)",transition:"all 0.15s",padding:2,fontFamily:"inherit"}}>⭐</button>)}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Would you miss it if it was gone?</div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                <button onClick={()=>update(s.id,'miss',true)} style={{...B,padding:"10px 28px",fontSize:14,borderRadius:8,background:s.miss===true?G:EL,color:s.miss===true?"#000":MT}}>Yes</button>
                <button onClick={()=>update(s.id,'miss',false)} style={{...B,padding:"10px 28px",fontSize:14,borderRadius:8,background:s.miss===false?"#ef4444":EL,color:s.miss===false?"#fff":MT}}>No</button>
              </div>
            </div>
          </div>
          {(()=>{const ready=!!s.freq&&!!s.sat&&s.miss!==null;return(
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button onClick={()=>setStep(step-1)} style={{...B,flex:1,background:EL,color:MT,fontSize:14,borderRadius:10,padding:"14px"}}>← Back</button>
            <button onClick={()=>{if(step<subs.length-1)setStep(step+1);else finish()}} disabled={!ready} title={ready?"":"Answer all 3 questions to continue"} style={{...B,flex:2,background:ready?G:EL,color:ready?"#000":MT,fontWeight:700,fontSize:14,borderRadius:10,padding:"14px",opacity:ready?1:0.6,cursor:ready?"pointer":"not-allowed"}}>{step<subs.length-1?"Next →":"Finish Audit"}</button>
          </div>
          )})()}
        </div>
      )})()}

      {/* Results */}
      {done&&(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,fontWeight:700,marginBottom:4}}>{score}</div>
          <div style={{fontSize:14,color:MT,fontWeight:500,marginBottom:20}}>SubScore</div>

          {cS>0&&<div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:20}}>
            <div><div style={{fontSize:22,fontWeight:700,color:G}}>{fm(cS)}</div><div style={{fontSize:12,color:MT}}>saved/mo</div></div>
            <div><div style={{fontSize:22,fontWeight:700,color:G}}>{fm(cS*12)}</div><div style={{fontSize:12,color:MT}}>saved/yr</div></div>
          </div>}

          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:28}}>
            {[{l:"Keep",n:recs.filter(r=>r.rec==="keep").length,c:"#00d48a"},{l:"Cut",n:cuts.length,c:"#ef4444"},{l:"Downgrade",n:recs.filter(r=>r.rec==="downgrade").length,c:"#f59e0b"}].map((x,i)=>(
              <span key={i} style={{fontSize:13,fontWeight:600,color:x.c,background:x.c+"18",padding:"4px 14px",borderRadius:20}}>{x.l} {x.n}</span>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:28}}>
            {recs.map(s=>{const rc=s.rec==="cancel"?"#ef4444":s.rec==="downgrade"?"#f59e0b":"#00d48a";return(
              <div key={s.id} style={{display:"flex",alignItems:"center",padding:"12px 16px",background:SF,borderRadius:10,borderLeft:`3px solid ${rc}`,gap:10}}>
                <Logo name={s.name} cat={s.cat} size={34}/>
                <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{s.name}</div><div style={{fontSize:11,color:MT}}>{s.freq||"-"} . {s.sat||0}★</div></div>
                <span style={{fontSize:12,fontWeight:700,color:rc,background:rc+"18",padding:"3px 10px",borderRadius:6}}>{s.rec==="cancel"?"Cut":s.rec==="downgrade"?"Downgrade":"Keep"}</span>
              </div>
            )})}
          </div>

          <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:24,marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Save this to your account</div>
            <p style={{fontSize:13,color:MT,lineHeight:1.5,marginBottom:16}}>Create a free account to keep these results, track your real subs, catch overlaps, and get deal alerts. Your audit answers carry over automatically.</p>
            <Link to="/app" style={{...B,background:G,color:"#000",padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-block",borderRadius:10}}>Save & Create Account</Link>
            <div style={{marginTop:12,fontSize:12,color:MT}}>Already have an account? <Link to="/app" style={{color:G,textDecoration:"none",fontWeight:600}}>Log in →</Link></div>
          </div>

          <button onClick={resetAll} style={{...B,background:EL,color:MT,fontSize:13,borderRadius:8}}>Reset Demo</button>
        </div>
      )}
    </div>
  </div>)
}
