import { useState, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════
//  SUPABASE CLIENT (swap mock→real here)
//  For local: npm install @supabase/supabase-js
//  import { createClient } from '@supabase/supabase-js'
//  const supabase = createClient(URL, ANON_KEY)
// ═══════════════════════════════════════════

const CATS = {
  streaming:{l:"Streaming",c:"#e74c3c",e:"🎬"},music:{l:"Music",c:"#9b59b6",e:"🎵"},
  gaming:{l:"Gaming",c:"#2ecc71",e:"🎮"},productivity:{l:"Productivity",c:"#3498db",e:"💼"},
  fitness:{l:"Fitness",c:"#e67e22",e:"💪"},news:{l:"News",c:"#1abc9c",e:"📰"},
  creative:{l:"Creative",c:"#f39c12",e:"🎨"},security:{l:"Security",c:"#607d8b",e:"🔒"},
  food:{l:"Food",c:"#e91e63",e:"🍕"},ai_tools:{l:"AI Tools",c:"#00bcd4",e:"🤖"},
  lifestyle:{l:"Lifestyle",c:"#8e44ad",e:"✨"},
};

const AVATARS=[
  {id:"a1",e:"🦊",bg:"linear-gradient(135deg,#e74c3c,#f39c12)"},
  {id:"a2",e:"🐺",bg:"linear-gradient(135deg,#3498db,#2ecc71)"},
  {id:"a3",e:"🦁",bg:"linear-gradient(135deg,#f39c12,#e67e22)"},
  {id:"a4",e:"🐸",bg:"linear-gradient(135deg,#2ecc71,#1abc9c)"},
  {id:"a5",e:"🦉",bg:"linear-gradient(135deg,#9b59b6,#3498db)"},
  {id:"a6",e:"🐧",bg:"linear-gradient(135deg,#607d8b,#3498db)"},
  {id:"a7",e:"🦋",bg:"linear-gradient(135deg,#e91e63,#9b59b6)"},
  {id:"a8",e:"🐉",bg:"linear-gradient(135deg,#e74c3c,#9b59b6)"},
  {id:"a9",e:"🦈",bg:"linear-gradient(135deg,#2c3e50,#3498db)"},
  {id:"a10",e:"🦜",bg:"linear-gradient(135deg,#2ecc71,#f39c12)"},
  {id:"a11",e:"🐼",bg:"linear-gradient(135deg,#bdc3c7,#2c3e50)"},
  {id:"a12",e:"🦄",bg:"linear-gradient(135deg,#e91e63,#f39c12)"},
];

const INIT_SUBS=[
  {id:"1",name:"Netflix",cat:"streaming",cost:15.49,cycle:"monthly",renewal:"2026-04-18",trial:false,sat:4,freq:"daily",miss:true,audit:"2026-03-10",added:"2025-06-01"},
  {id:"2",name:"Spotify",cat:"music",cost:10.99,cycle:"monthly",renewal:"2026-04-12",trial:false,sat:5,freq:"daily",miss:true,audit:"2026-03-10",added:"2025-01-15"},
  {id:"3",name:"Xbox Game Pass",cat:"gaming",cost:14.99,cycle:"monthly",renewal:"2026-04-22",trial:false,sat:3,freq:"weekly",miss:true,audit:"2026-03-10",added:"2025-09-01"},
  {id:"4",name:"Adobe CC",cat:"creative",cost:54.99,cycle:"monthly",renewal:"2026-04-08",trial:false,sat:2,freq:"rarely",miss:false,audit:"2026-02-01",added:"2024-11-01"},
  {id:"5",name:"ChatGPT Plus",cat:"ai_tools",cost:20.00,cycle:"monthly",renewal:"2026-04-15",trial:false,sat:4,freq:"daily",miss:true,audit:"2026-03-10",added:"2025-03-01"},
  {id:"6",name:"Paramount+",cat:"streaming",cost:5.99,cycle:"monthly",renewal:"2026-04-25",trial:true,trialEnd:"2026-04-09",sat:null,freq:null,miss:null,audit:null,added:"2026-04-02"},
  {id:"7",name:"NYT Digital",cat:"news",cost:17.00,cycle:"monthly",renewal:"2026-04-30",trial:false,sat:2,freq:"monthly",miss:false,audit:"2026-03-10",added:"2025-08-01"},
  {id:"8",name:"YouTube Music",cat:"music",cost:10.99,cycle:"monthly",renewal:"2026-04-19",trial:false,sat:2,freq:"rarely",miss:false,audit:"2026-03-10",added:"2025-05-01"},
  {id:"9",name:"NordVPN",cat:"security",cost:12.99,cycle:"monthly",renewal:"2026-04-28",trial:false,sat:4,freq:"daily",miss:true,audit:"2026-03-10",added:"2025-07-01"},
  {id:"10",name:"Cursor Pro",cat:"ai_tools",cost:20.00,cycle:"monthly",renewal:"2026-04-10",trial:true,trialEnd:"2026-04-07",sat:null,freq:null,miss:null,audit:null,added:"2026-04-01"},
];

const PROMOS=[
  {id:"p1",svc:"Hulu",cat:"streaming",disc:63,desc:"3 months for $2.99/mo",type:"new_customer",until:"2026-06-30"},
  {id:"p2",svc:"NordVPN",cat:"security",disc:72,desc:"72% off 2-year plan",type:"everyone",until:"2026-06-01"},
  {id:"p3",svc:"Surfshark",cat:"security",disc:83,desc:"83% off + 3 months free",type:"new_customer",until:"2026-05-15"},
  {id:"p4",svc:"Xbox Game Pass",cat:"gaming",disc:93,desc:"First month for $1",type:"new_customer",until:"2026-06-30"},
  {id:"p5",svc:"Spotify",cat:"music",disc:100,desc:"Premium free 3 months",type:"new_customer",until:"2026-12-31"},
  {id:"p6",svc:"Disney+",cat:"streaming",disc:40,desc:"Bundle Disney+ Hulu ESPN+",type:"everyone",until:"2026-12-31"},
  {id:"p7",svc:"Kindle Unlimited",cat:"news",disc:97,desc:"3 months for $0.99",type:"new_customer",until:"2026-05-15"},
  {id:"p8",svc:"Adobe CC",cat:"creative",disc:65,desc:"65% off for students",type:"new_customer",until:"2026-12-31"},
  {id:"p9",svc:"HelloFresh",cat:"food",disc:60,desc:"16 free meals + free shipping",type:"new_customer",until:"2026-05-31"},
  {id:"p10",svc:"Peacock",cat:"streaming",disc:50,desc:"First year $29.99",type:"new_customer",until:"2026-07-01"},
];

const PC=[{svc:"Spotify",old:9.99,now:10.99,dt:"2026-06-01"},{svc:"Apple TV+",old:6.99,now:9.99,dt:"2026-02-01"}];

const dU=d=>d?Math.ceil((new Date(d)-new Date())/864e5):999;
const fm=n=>"$"+Number(n).toFixed(2);
const mS=d=>{const n=new Date(),t=new Date(d);return Math.max(1,(n.getFullYear()-t.getFullYear())*12+n.getMonth()-t.getMonth())};

const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.15s",fontFamily:"inherit"};

function Ring({s:sc,size=100,sw=8,c1="#00d48a",c2="#00b8d4",bg="#1a1a1a",tc="#fff"}){
  const[a,sA]=useState(0);const r=(size-sw)/2,ci=2*Math.PI*r;
  useEffect(()=>{let f,st;const run=t=>{if(!st)st=t;const p=Math.min((t-st)/1000,1);sA(Math.round((1-Math.pow(1-p,3))*sc));if(p<1)f=requestAnimationFrame(run)};f=requestAnimationFrame(run);return()=>cancelAnimationFrame(f)},[sc]);
  return(<div style={{position:"relative",width:size,height:size,flexShrink:0}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><defs><linearGradient id={`rg${size}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#rg${size})`} strokeWidth={sw} strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(a/100)*ci} style={{filter:`drop-shadow(0 0 5px ${c1}44)`}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:size*0.28,fontWeight:700,color:tc}}>{a}</span>
      {size>=80&&<span style={{fontSize:9,color:"#666",fontWeight:500}}>SubScore</span>}
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
  const[authLoading,setAuthLoading]=useState(false);

  const[pg,setPg]=useState("dashboard");
  const[subs,setSubs]=useState(INIT_SUBS);
  const[simOn,setSimOn]=useState(false);
  const[simT,setSimT]=useState({});
  const[conf,setConf]=useState(false);
  const[aStep,setAS]=useState(-1);
  const[aAns,setAA]=useState({});
  const[addM,setAddM]=useState(false);
  const[addS,setAddS]=useState("");
  const[pF,setPF]=useState("all");
  const[aTab,setATab]=useState("profile");
  const[toast,setToast]=useState(null);
  const[sort,setSort]=useState("renewal");
  const[permIgn,setPermIgn]=useState(new Set());
  const[dism,setDism]=useState(new Set());
  const[av,setAv]=useState(AVATARS[0]);

  const ign=k=>permIgn.has(k)||dism.has(k);
  const dismiss=k=>setDism(new Set([...dism,k]));
  const permDismiss=k=>{setPermIgn(new Set([...permIgn,k]));notify("Won't show this again")};
  const notify=m=>{setToast(m);setTimeout(()=>setToast(null),3000)};
  const pop=()=>{setConf(true);setTimeout(()=>setConf(false),2500)};

  const act=subs.filter(s=>!s.archived);
  const reg=act.filter(s=>!s.trial);
  const tri=act.filter(s=>s.trial);
  const mTot=act.reduce((a,s)=>a+s.cost,0);
  const saved=247.50;const score=72;
  const hasAudit=act.some(s=>!s.trial&&s.audit);
  const _now=new Date();const todayDay=_now.getFullYear()===2026&&_now.getMonth()===3?_now.getDate():-1;
  const allOL=[{a:"Spotify",b:"YouTube Music",tag:"Music Streaming",k:"sp-yt"}];
  const olaps=allOL.filter(o=>!ign("ol-"+o.k));
  const needA=act.filter(s=>!s.trial&&(!s.audit||dU(s.audit)<-60));
  const showAA=needA.length>0&&!ign("reaudit");
  const relP=PROMOS.filter(p=>act.some(s=>s.name===p.svc||s.cat===p.cat)).length;

  const remove=id=>{const s=subs.find(x=>x.id===id);setSubs(subs.map(x=>x.id===id?{...x,archived:true}:x));notify(`✂️ ${s?.name} removed! Cancel directly with the service.`);pop()};
  const simSave=Object.entries(simT).filter(([,v])=>v).reduce((a,[id])=>{const s=act.find(x=>x.id===id);return a+(s?s.cost:0)},0);
  const sorted=[...reg].sort((a,b)=>sort==="cost"?b.cost-a.cost:sort==="category"?a.cat.localeCompare(b.cat):dU(a.renewal)-dU(b.renewal));

  // Category breakdown for spending bar
  const catSpend={};act.forEach(s=>{catSpend[s.cat]=(catSpend[s.cat]||0)+s.cost});
  const catList=Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({k,v,pct:Math.round(v/mTot*100),...(CATS[k]||{l:k,c:"#666",e:"📦"})}));

  // ═══ AUTH SCREEN ═══
  const handleAuth=()=>{
    setAuthLoading(true);setAuthErr("");
    // Mock auth — replace with supabase.auth.signUp / signInWithPassword
    setTimeout(()=>{
      if(!email||!pass){setAuthErr("Please fill in all fields");setAuthLoading(false);return}
      if(authMode==="signup"&&!name){setAuthErr("Please enter your name");setAuthLoading(false);return}
      if(pass.length<6){setAuthErr("Password must be 6+ characters");setAuthLoading(false);return}
      setUser({email,name:name||email.split("@")[0]});
      setAuthLoading(false);
    },800);
  };

  if(!user) return(
    <div style={{background:"#0d0d0d",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",color:"#fff",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0}input::placeholder{color:#444}`}</style>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:8}}>✂️</div>
          <div style={{fontSize:24,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</div>
          <div style={{fontSize:13,color:"#666",marginTop:4}}>Take control of your subscriptions</div>
        </div>

        <div style={{display:"flex",background:"#141414",borderRadius:10,padding:3,marginBottom:20}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setAuthMode(m);setAuthErr("")}} style={{...B,flex:1,background:authMode===m?"#1f1f1f":"transparent",color:authMode===m?"#fff":"#666",fontSize:13,borderRadius:8,padding:"8px 0"}}>{m==="login"?"Log In":"Sign Up"}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {authMode==="signup"&&(
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{width:"100%",padding:"13px 16px",borderRadius:10,border:"1px solid #222",background:"#141414",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:"13px 16px",borderRadius:10,border:"1px solid #222",background:"#141414",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:"13px 16px",borderRadius:10,border:"1px solid #222",background:"#141414",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {authErr&&<div style={{fontSize:12,color:"#e74c3c",textAlign:"center"}}>{authErr}</div>}
          <button onClick={handleAuth} disabled={authLoading} style={{...B,background:"#00d48a",color:"#000",padding:"13px",fontSize:14,fontWeight:700,borderRadius:10,width:"100%",opacity:authLoading?0.6:1}}>
            {authLoading?"...":(authMode==="login"?"Log In":"Create Account")}
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:"#444"}}>
          {authMode==="login"?"Don't have an account? ":"Already have one? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("")}} style={{color:"#00d48a",cursor:"pointer",fontWeight:600}}>{authMode==="login"?"Sign Up":"Log In"}</span>
        </div>
      </div>
    </div>
  );

  // ═══ DASHBOARD ═══
  const Dash=()=>(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {/* Total */}
    <div style={{textAlign:"center",padding:"8px 0 4px"}}>
      <div style={{fontSize:11,color:"#666",fontWeight:500,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Total Subscriptions</div>
      <div style={{fontSize:38,fontWeight:700,letterSpacing:"-1px"}}>{fm(mTot)}</div>
      <div style={{fontSize:12,color:"#666",marginTop:2}}>{fm(mTot*12)}/yr · {act.length} active · <span style={{color:"#00d48a"}}>{fm(saved)} saved</span></div>
    </div>

    {/* Category bar */}
    <div>
      <div style={{display:"flex",gap:2,height:6,borderRadius:3,overflow:"hidden",marginBottom:8}}>
        {catList.map((c,i)=><div key={i} style={{flex:c.pct,background:c.c,minWidth:3}}/>)}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {catList.map((c,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#666"}}>
            <div style={{width:7,height:7,borderRadius:2,background:c.c}}/>{c.l} <span style={{color:"#fff",fontWeight:600}}>{fm(c.v)}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Score */}
    {hasAudit&&<div style={{display:"flex",justifyContent:"center",padding:"4px 0"}}>
      <Ring s={score} size={90}/>
    </div>}

    {/* Alerts */}
    {olaps.map(o=>(
      <div key={o.k} style={{background:"#141414",borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,borderLeft:"3px solid #e67e22"}}>
        <span style={{fontSize:12,color:"#ccc"}}>🔀 <strong>{o.a} & {o.b}</strong> overlap ({o.tag})</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setPg("audit")} style={{...B,padding:"4px 10px",background:"#e67e22",color:"#fff",fontSize:11,borderRadius:6}}>Review</button>
          <button onClick={()=>dismiss("ol-"+o.k)} style={{...B,padding:"4px 10px",background:"#1f1f1f",color:"#666",fontSize:11,borderRadius:6}}>Ignore</button>
          <button onClick={()=>permDismiss("ol-"+o.k)} style={{...B,padding:"4px 10px",background:"#1f1f1f",color:"#444",fontSize:10,borderRadius:6}}>Don't Show Again</button>
        </div>
      </div>
    ))}

    {showAA&&(
      <div style={{background:"#141414",borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,borderLeft:"3px solid #f59e0b"}}>
        <span style={{fontSize:12,color:"#ccc"}}>🔄 <strong>{needA.length}</strong> sub{needA.length>1?"s":""} need re-audit</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setPg("audit")} style={{...B,padding:"4px 10px",background:"#f59e0b",color:"#000",fontSize:11,borderRadius:6}}>Audit Now</button>
          <button onClick={()=>dismiss("reaudit")} style={{...B,padding:"4px 10px",background:"#1f1f1f",color:"#666",fontSize:11,borderRadius:6}}>Ignore</button>
          <button onClick={()=>permDismiss("reaudit")} style={{...B,padding:"4px 10px",background:"#1f1f1f",color:"#444",fontSize:10,borderRadius:6}}>Don't Show Again</button>
        </div>
      </div>
    )}

    {/* Trials */}
    {tri.length>0&&<>
      <div style={{fontSize:13,fontWeight:700,color:"#fff",marginTop:2}}>⏱️ Active Trials</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
        {tri.map(s=>{const d=dU(s.trialEnd),c=CATS[s.cat]||{e:"📦",c:"#666"},uc=d<=2?"#ef4444":d<=5?"#f59e0b":"#00d48a";
        return(<div key={s.id} style={{minWidth:180,background:"#141414",borderRadius:14,padding:14,flexShrink:0,borderTop:`3px solid ${uc}`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{c.e}</div>
            <span style={{fontWeight:600,fontSize:13}}>{s.name}</span>
          </div>
          <div style={{fontSize:26,fontWeight:700,color:uc,marginBottom:2}}>{d}d</div>
          <div style={{fontSize:11,color:"#666"}}>until {fm(s.cost)}/mo charge</div>
          <button onClick={()=>remove(s.id)} style={{...B,width:"100%",marginTop:8,background:uc+"22",color:uc,fontSize:11,padding:"7px 0",borderRadius:8}}>Cancel Trial</button>
        </div>)})}
      </div>
    </>}

    {/* Sub Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
      <div style={{fontSize:13,fontWeight:700}}>Subscriptions</div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{background:"#141414",color:"#999",border:"1px solid #222",borderRadius:6,padding:"4px 6px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
          <option value="renewal">Renewal</option><option value="cost">Cost ↓</option><option value="category">Category</option>
        </select>
        <button onClick={()=>setSimOn(!simOn)} style={{...B,padding:"4px 10px",background:simOn?"#00d48a":"#141414",color:simOn?"#000":"#999",fontSize:11,borderRadius:6,border:simOn?"none":"1px solid #222"}}>
          {simOn?"✕ Close":"⚡ What If?"}
        </button>
      </div>
    </div>

    {simOn&&(
      <div style={{background:"#00d48a11",border:"1px solid #00d48a33",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
        <span style={{fontSize:11,color:"#666"}}>Toggle subs to simulate</span>
        <span style={{fontSize:20,fontWeight:700,color:"#00d48a"}}>{fm(simSave)}<span style={{fontSize:12,color:"#666"}}>/mo · {fm(simSave*12)}/yr</span></span>
      </div>
    )}

    {/* Transaction list */}
    <div style={{background:"#141414",borderRadius:14,overflow:"hidden"}}>
      {sorted.map((s,i)=>{const c=CATS[s.cat]||{e:"📦",c:"#666",l:s.cat},d=dU(s.renewal),off=simT[s.id];
      return(<div key={s.id} style={{display:"flex",alignItems:"center",padding:"12px 14px",borderBottom:i<sorted.length-1?"1px solid #1f1f1f":"none",opacity:off?0.35:1,transition:"all 0.2s",position:"relative"}}>
        {off&&<div style={{position:"absolute",left:14,right:14,top:"50%",height:1,background:"#ef4444"}}/>}
        <div style={{width:36,height:36,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:12,flexShrink:0}}>{c.e}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
            {s.name}
            {(s.freq==="rarely"||s.freq==="never")&&<span style={{fontSize:9,background:"#ef444422",color:"#ef4444",padding:"1px 6px",borderRadius:4}}>low use</span>}
          </div>
          <div style={{fontSize:11,color:"#666"}}>{c.l} · {d}d · {"⭐".repeat(s.sat||0)}</div>
        </div>
        <div style={{textAlign:"right",marginRight:simOn?8:0}}>
          <div style={{fontSize:15,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>-{fm(s.cost)}</div>
        </div>
        {simOn&&(
          <button onClick={()=>setSimT({...simT,[s.id]:!off})} style={{background:off?"#ef4444":"#1f1f1f",color:off?"#fff":"#666",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",marginLeft:6,fontWeight:600,fontFamily:"inherit"}}>{off?"↩":"✕"}</button>
        )}
        {!simOn&&(
          <button onClick={()=>remove(s.id)} style={{background:"transparent",color:"#333",border:"none",fontSize:16,cursor:"pointer",padding:"0 4px",marginLeft:6}}>×</button>
        )}
      </div>)})}
    </div>

    {/* Calendar */}
    <div style={{fontSize:13,fontWeight:700,marginTop:2}}>📅 April 2026</div>
    <div style={{background:"#141414",borderRadius:14,padding:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
        {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{fontSize:10,fontWeight:600,color:"#444",padding:3}}>{d}</div>)}
        {[...Array(3)].map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:30},(_,i)=>{const day=i+1,ds=`2026-04-${String(day).padStart(2,"0")}`,rn=act.filter(s=>s.renewal===ds),isT=day===todayDay;
        return(<div key={day} title={rn.map(r=>`${r.name}: ${fm(r.cost)}`).join("\n")} style={{padding:"5px 2px",borderRadius:6,fontSize:11,fontWeight:isT?700:rn.length?600:400,color:isT?"#000":rn.length?"#fff":"#444",background:isT?"#00d48a":rn.length?"#1f1f1f":"transparent",position:"relative"}}>
          {day}{rn.length>0&&!isT&&<div style={{position:"absolute",bottom:1,left:"50%",transform:"translateX(-50%)",display:"flex",gap:1}}>{rn.map((r,j)=><div key={j} style={{width:3,height:3,borderRadius:"50%",background:CATS[r.cat]?.c||"#00d48a"}}/>)}</div>}
        </div>)})}
      </div>
    </div>
  </div>);

  // ═══ AUDIT ═══
  const aud=act.filter(s=>!s.trial);
  const fO=[{v:"daily",e:"🔥",l:"Daily"},{v:"weekly",e:"👍",l:"Weekly"},{v:"monthly",e:"🤷",l:"Monthly"},{v:"rarely",e:"😬",l:"Rarely"},{v:"never",e:"💀",l:"Never"}];
  const gR=s=>{const a=aAns[s.id]||{},f=a.frequency||s.freq,sa=a.satisfaction||s.sat,m=a.wouldMiss!==undefined?a.wouldMiss:s.miss;if(!f||!sa)return"keep";if((f==="rarely"||f==="never")&&sa<=2&&!m)return"cancel";if((f==="rarely"||f==="never")&&sa<=3)return"downgrade";if(f==="monthly"&&s.cost>15&&sa<=3)return"downgrade";return"keep"};

  const Audit=()=>{
    if(aStep===-1){
      const recs=aud.map(s=>({...s,rec:gR(s)}));const has=aud.some(s=>aAns[s.id]||s.sat);
      const cuts=recs.filter(r=>r.rec==="cancel"),cS=cuts.reduce((a,r)=>a+r.cost,0);
      return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{textAlign:"center",padding:"16px 0"}}>
          <Ring s={score} size={100}/>
          <p style={{fontSize:13,color:"#666",marginTop:10,maxWidth:340,marginLeft:"auto",marginRight:"auto"}}>{score>=80?"Looking good — let's confirm nothing changed":"A few tweaks could boost your score"}</p>
          <button onClick={()=>setAS(0)} style={{...B,background:"#00d48a",color:"#000",padding:"12px 28px",fontSize:14,fontWeight:700,borderRadius:10,marginTop:12}}>Start Audit · {aud.length} subs</button>
        </div>

        {has&&<>
          {/* Share card */}
          <div style={{background:"#141414",borderRadius:16,padding:24,textAlign:"center"}}>
            <div style={{position:"relative",display:"inline-block"}}><div style={{position:"absolute",top:-2,right:-30,fontSize:9,color:"#444"}}>subtrim.dev</div></div>
            <div style={{fontSize:10,color:"#444",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>✂️ Audit Report</div>
            <div style={{fontSize:42,fontWeight:700,lineHeight:1}}>{score}</div>
            <div style={{fontSize:12,color:"#00d48a",fontWeight:600,marginTop:4,marginBottom:16}}>+16 since last audit</div>
            <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:12}}>
              <div><div style={{fontSize:20,fontWeight:700,color:"#00d48a"}}>{fm(cS)}</div><div style={{fontSize:10,color:"#666"}}>monthly</div></div>
              <div><div style={{fontSize:20,fontWeight:700,color:"#00d48a"}}>{fm(cS*12)}</div><div style={{fontSize:10,color:"#666"}}>annual</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              {[{l:"Keep",n:recs.filter(r=>r.rec==="keep").length,c:"#00d48a"},{l:"Cut",n:cuts.length,c:"#ef4444"},{l:"Downgrade",n:recs.filter(r=>r.rec==="downgrade").length,c:"#f59e0b"}].map((x,i)=>(
                <span key={i} style={{fontSize:11,fontWeight:600,color:x.c,background:x.c+"18",padding:"3px 10px",borderRadius:20}}>{x.l} {x.n}</span>
              ))}
            </div>
          </div>

          {/* Lanes */}
          {[{k:"keep",l:"Keep",c:"#00d48a"},{k:"downgrade",l:"Downgrade",c:"#f59e0b"},{k:"cancel",l:"Cut",c:"#ef4444"}].map(({k,l,c})=>{
            const items=recs.filter(r=>r.rec===k);if(!items.length)return null;
            return(<div key={k}>
              <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:6}}>{l}</div>
              <div style={{background:"#141414",borderRadius:12,overflow:"hidden"}}>
                {items.map((s,i)=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<items.length-1?"1px solid #1f1f1f":"none"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:(CATS[s.cat]?.c||"#666")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:10}}>{CATS[s.cat]?.e||"📦"}</div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:10,color:"#666"}}>{k==="cancel"?`Saves ${fm(s.cost*12)}/yr`:k==="keep"?`${s.freq} · ${s.sat}★`:"High cost, low use"}</div></div>
                    <span style={{fontSize:14,fontWeight:700,color:c}}>-{fm(s.cost)}</span>
                  </div>
                ))}
              </div>
            </div>)})}
        </>}
      </div>)
    }
    const cur=aud[aStep];if(!cur){setAS(-1);return null}
    const ans=aAns[cur.id]||{},ct=CATS[cur.cat]||{e:"📦"},tp=cur.cost*mS(cur.added);
    return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,maxWidth:420,margin:"0 auto",width:"100%"}}>
      <div style={{width:"100%",display:"flex",gap:2}}>{aud.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<aStep?"#00d48a":i===aStep?"#00b8d4":"#1f1f1f"}}/>)}</div>
      <div style={{fontSize:11,color:"#666"}}>{aStep+1}/{aud.length}</div>
      <div style={{width:"100%",background:"#141414",borderRadius:16,padding:24,textAlign:"center"}}>
        <div style={{width:50,height:50,borderRadius:"50%",background:(CATS[cur.cat]?.c||"#666")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 10px"}}>{ct.e}</div>
        <div style={{fontSize:18,fontWeight:700,marginBottom:2}}>{cur.name}</div>
        <div style={{fontSize:12,color:"#666"}}>{fm(cur.cost)}/mo</div>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:18}}>Total paid: {fm(tp)} over {mS(cur.added)}mo</div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>How often do you use this?</div>
          <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}>{fO.map(o=><button key={o.v} onClick={()=>setAA({...aAns,[cur.id]:{...ans,frequency:o.v}})} style={{...B,padding:"6px 11px",fontSize:11,borderRadius:8,background:ans.frequency===o.v?(o.v==="daily"?"#00d48a":o.v==="never"?"#ef4444":"#f59e0b"):"#1f1f1f",color:ans.frequency===o.v?"#000":"#999"}}>{o.e} {o.l}</button>)}</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>How much do you enjoy it?</div>
          <div style={{display:"flex",gap:3,justifyContent:"center"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setAA({...aAns,[cur.id]:{...ans,satisfaction:n}})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",filter:(ans.satisfaction||0)>=n?"none":"grayscale(1) opacity(0.3)",transition:"all 0.15s"}}>⭐</button>)}</div>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Would you miss it?</div>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
            <button onClick={()=>setAA({...aAns,[cur.id]:{...ans,wouldMiss:true}})} style={{...B,padding:"8px 16px",borderRadius:8,background:ans.wouldMiss===true?"#00d48a":"#1f1f1f",color:ans.wouldMiss===true?"#000":"#999"}}>Yes</button>
            <button onClick={()=>setAA({...aAns,[cur.id]:{...ans,wouldMiss:false}})} style={{...B,padding:"8px 16px",borderRadius:8,background:ans.wouldMiss===false?"#ef4444":"#1f1f1f",color:ans.wouldMiss===false?"#fff":"#999"}}>No</button>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,width:"100%"}}>
        {aStep>0&&<button onClick={()=>setAS(aStep-1)} style={{...B,flex:1,background:"#1f1f1f",color:"#999",borderRadius:10}}>←</button>}
        <button onClick={()=>{if(aStep<aud.length-1)setAS(aStep+1);else{setAS(-1);pop();notify("🎉 Audit complete!")}}} style={{...B,flex:2,background:"#00d48a",color:"#000",fontWeight:700,borderRadius:10}}>{aStep<aud.length-1?"Next →":"🎉 Finish"}</button>
      </div>
    </div>)
  };

  // ═══ PROMOS ═══
  const Promos=()=>{
    const myN=new Set(act.map(s=>s.name)),myC=new Set(act.map(s=>s.cat));
    const fil=PROMOS.filter(p=>pF==="all"||(pF==="relevant"&&(myN.has(p.svc)||myC.has(p.cat)))||pF===p.cat);
    return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"#141414",borderRadius:14,padding:16,borderLeft:"3px solid #e74c3c"}}>
        <div style={{fontSize:10,color:"#e74c3c",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Featured</div>
        <div style={{fontSize:16,fontWeight:700,marginTop:4}}>Hulu — 3 months for $2.99/mo</div>
        <div style={{fontSize:11,color:"#666",marginTop:2}}>63% off · New customers · Ends Jun 30</div>
      </div>
      <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>{[{k:"all",l:"All"},{k:"relevant",l:"🎯 For Me"},...Object.entries(CATS).slice(0,5).map(([k,v])=>({k,l:`${v.e} ${v.l}`}))].map(f=><button key={f.k} onClick={()=>setPF(f.k)} style={{...B,fontSize:10,padding:"5px 10px",background:pF===f.k?"#00d48a":"#141414",color:pF===f.k?"#000":"#666",whiteSpace:"nowrap",borderRadius:6,border:pF===f.k?"none":"1px solid #222"}}>{f.l}</button>)}</div>

      {PC.length>0&&<div style={{background:"#141414",borderRadius:12,padding:12,borderLeft:"3px solid #f59e0b"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:4}}>⚠️ Price Changes</div>
        {PC.map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12,borderTop:i?"1px solid #1f1f1f":"none"}}><span style={{fontWeight:600}}>{p.svc}</span><span><span style={{color:"#666",textDecoration:"line-through"}}>{fm(p.old)}</span><span style={{color:"#ef4444",fontWeight:700,marginLeft:5}}>{fm(p.now)}</span></span></div>)}
      </div>}

      <div style={{background:"#141414",borderRadius:14,overflow:"hidden"}}>
        {fil.map((p,i)=>{const c=CATS[p.cat]||{e:"📦",c:"#666"},mine=myN.has(p.svc);
        return(<div key={p.id} style={{display:"flex",alignItems:"center",padding:"12px 14px",borderBottom:i<fil.length-1?"1px solid #1f1f1f":"none"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:12,flexShrink:0}}>{c.e}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>{p.svc}{mine&&<span style={{fontSize:9,background:"#00d48a22",color:"#00d48a",padding:"1px 6px",borderRadius:4}}>subscribed</span>}</div>
            <div style={{fontSize:11,color:"#666"}}>{p.desc}</div>
          </div>
          <div style={{background:c.c,color:"#fff",fontWeight:800,fontSize:12,padding:"3px 8px",borderRadius:6,flexShrink:0}}>{p.disc}%</div>
        </div>)})}
      </div>
    </div>)
  };

  // ═══ ACCOUNT ═══
  const Acct=()=>(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0"}}>
      <div style={{width:48,height:48,borderRadius:"50%",background:av.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{av.e}</div>
      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700}}>{user.name}</div><div style={{fontSize:11,color:"#666"}}>{user.email}</div></div>
      {hasAudit&&<Ring s={score} size={44} sw={4}/>}
    </div>

    <div style={{display:"flex",background:"#141414",borderRadius:8,padding:2,gap:2}}>
      {[{k:"profile",l:"Profile"},{k:"budgets",l:"Budgets"},{k:"household",l:"Household"},{k:"data",l:"Data"}].map(t=><button key={t.k} onClick={()=>setATab(t.k)} style={{...B,flex:1,background:aTab===t.k?"#1f1f1f":"transparent",color:aTab===t.k?"#fff":"#555",fontSize:11,borderRadius:6,padding:"7px 4px"}}>{t.l}</button>)}
    </div>

    {aTab==="profile"&&<>
      <div style={{background:"#141414",borderRadius:14,padding:14}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Avatar</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>{AVATARS.map(a=><button key={a.id} onClick={()=>setAv(a)} style={{width:"100%",aspectRatio:"1",borderRadius:"50%",background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,border:av.id===a.id?"2px solid #00d48a":"2px solid transparent",cursor:"pointer",transition:"all 0.15s"}}>{a.e}</button>)}</div>
      </div>
      <div style={{background:"#141414",borderRadius:14,padding:14}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Email Preferences</div>
        {["Monthly digest","Promo alerts","Price alerts","Trial reminders"].map(p=><div key={p} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #1f1f1f",fontSize:12,color:"#888"}}><span>{p}</span><span style={{fontSize:10,color:"#00b8d4",fontWeight:600}}>Coming Soon</span></div>)}
      </div>
      <button onClick={()=>setUser(null)} style={{...B,background:"#1f1f1f",color:"#ef4444",fontSize:12,borderRadius:10}}>Log Out</button>
      <button onClick={()=>{if(window.confirm("Are you sure? This will permanently delete your account and all data."))notify("Account deletion is not yet implemented")}} style={{...B,background:"#ef444411",color:"#ef4444",fontSize:11,borderRadius:10,border:"1px solid #ef444422"}}>Delete Account</button>
    </>}

    {aTab==="budgets"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      {Object.entries(CATS).slice(0,6).map(([k,c])=>{const sp=act.filter(s=>s.cat===k).reduce((a,s)=>a+s.cost,0),lim=k==="streaming"?25:k==="music"?15:30,pct=Math.min(100,(sp/lim)*100),ov=sp>lim;
      return(<div key={k} style={{background:"#141414",borderRadius:10,padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}><span style={{fontWeight:600}}>{c.e} {c.l}</span><span style={{color:ov?"#ef4444":"#666",fontWeight:ov?700:400}}>{fm(sp)}/{fm(lim)}{ov&&" ⚠️"}</span></div>
        <div style={{height:4,borderRadius:2,background:"#1f1f1f"}}><div style={{height:"100%",borderRadius:2,width:`${pct}%`,background:ov?"#ef4444":pct>80?"#f59e0b":"#00d48a"}}/></div>
      </div>)})}
    </div>}

    {aTab==="household"&&<div style={{background:"#141414",borderRadius:14,padding:24,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:8}}>🏠</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Household</div>
      <p style={{fontSize:12,color:"#666",maxWidth:280,margin:"0 auto 12px"}}>Combine subs with family or roommates to find overlaps and save.</p>
      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
        <button style={{...B,background:"#00d48a",color:"#000",borderRadius:8}}>Create</button>
        <button style={{...B,background:"#1f1f1f",color:"#999",borderRadius:8}}>Join</button>
      </div>
    </div>}

    {aTab==="data"&&<>
      <div style={{background:"#141414",borderRadius:14,padding:14}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Your Data</div>
        <div style={{display:"flex",gap:6}}>
          <button style={{...B,flex:1,background:"#1f1f1f",color:"#999",fontSize:12,borderRadius:8}}>📤 Export</button>
          <button style={{...B,flex:1,background:"#1f1f1f",color:"#999",fontSize:12,borderRadius:8}}>📥 Import</button>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#141414,#1a1025)",borderRadius:16,padding:24,textAlign:"center",border:"1px solid #2a1a3e"}}>
        <div style={{fontSize:10,color:"#9b59b6",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Coming December 2026</div>
        <div style={{fontSize:28,marginBottom:6}}>🎁</div>
        <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>SubTrim Wrapped</div>
        <p style={{fontSize:11,color:"#666",maxWidth:280,margin:"0 auto 14px",lineHeight:1.5}}>Your year-in-review. Total spend, savings, top services, and SubScore journey.</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:12}}>
          {["📊","💰","🔥","⭐","✂️"].map((e,i)=><div key={i} style={{width:26,height:38,borderRadius:5,background:["#e74c3c","#9b59b6","#2ecc71","#3498db","#f39c12"][i]+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,border:"1px solid #ffffff08"}}>{e}</div>)}
        </div>
        <span style={{fontSize:10,color:"#9b59b6",fontWeight:600,background:"#9b59b622",padding:"3px 10px",borderRadius:20}}>🔔 We'll notify you</span>
      </div>
    </>}
  </div>);

  // ═══ NAV + SHELL ═══
  const nav=[{k:"dashboard",l:"Home",e:"📊"},{k:"audit",l:"Audit",e:"🧠",b:needA.length||null},{k:"promos",l:"Deals",e:"🏷️",b:relP||null},{k:"account",l:"Account",e:"👤"}];
  const kn=["Netflix","Hulu","Disney+","Spotify","Apple Music","YouTube Premium","Xbox Game Pass","ChatGPT Plus","Claude Pro","NordVPN","Adobe CC","Notion","Audible","Amazon Prime","Canva Pro","Figma"];
  const fK=addS?kn.filter(n=>n.toLowerCase().includes(addS.toLowerCase())):kn.slice(0,8);

  return(<div style={{background:"#0d0d0d",minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:"#fff"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0}input::placeholder{color:#444}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes cF{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes sU{from{transform:translateY(14px) translateX(-50%);opacity:0}to{transform:translateY(0) translateX(-50%);opacity:1}}button:active{transform:scale(0.97)}`}</style>
    <Confetti on={conf}/>

    {/* Top */}
    <div style={{position:"sticky",top:0,zIndex:50,background:"#0d0d0dee",borderBottom:"1px solid #1a1a1a",backdropFilter:"blur(10px)"}}>
      <div style={{maxWidth:480,margin:"0 auto",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>✂️</span><span style={{fontSize:15,fontWeight:800,letterSpacing:"-0.5px"}}>SubTrim</span></div>
        <div style={{width:28,height:28,borderRadius:"50%",background:av.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer"}} onClick={()=>setPg("account")}>{av.e}</div>
      </div>
    </div>

    {/* Content */}
    <div style={{maxWidth:480,margin:"0 auto",padding:"12px 16px 96px"}}>
      {pg==="dashboard"&&Dash()}{pg==="audit"&&Audit()}{pg==="promos"&&Promos()}{pg==="account"&&Acct()}
    </div>

    {/* FAB */}
    {pg==="dashboard"&&<button onClick={()=>setAddM(true)} style={{position:"fixed",bottom:72,right:20,width:48,height:48,borderRadius:"50%",background:"#00d48a",color:"#000",border:"none",fontSize:22,fontWeight:300,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,212,138,0.3)",zIndex:40,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>}

    {/* Bottom Nav */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0d0d0dee",borderTop:"1px solid #1a1a1a",zIndex:50,backdropFilter:"blur(10px)"}}>
      <div style={{maxWidth:480,margin:"0 auto",display:"flex"}}>{nav.map(i=><button key={i.k} onClick={()=>{setPg(i.k);if(i.k==="audit")setAS(-1)}} style={{flex:1,padding:"8px 0 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,position:"relative"}}>
        <div style={{position:"relative"}}><span style={{fontSize:16,filter:pg===i.k?"none":"grayscale(0.6) opacity(0.4)"}}>{i.e}</span>
          {i.b&&<div style={{position:"absolute",top:-3,right:-7,background:"#ef4444",color:"#fff",fontSize:8,fontWeight:800,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{i.b}</div>}
        </div>
        <span style={{fontSize:9,fontWeight:pg===i.k?700:400,color:pg===i.k?"#00d48a":"#444"}}>{i.l}</span>
      </button>)}</div>
    </div>

    {/* Toast */}
    {toast&&<div style={{position:"fixed",top:52,left:"50%",transform:"translateX(-50%)",background:"#141414",border:"1px solid #00d48a44",borderRadius:10,padding:"8px 16px",zIndex:200,boxShadow:"0 8px 24px rgba(0,0,0,0.5)",animation:"sU 0.25s ease",fontSize:12,fontWeight:600,maxWidth:"85%",textAlign:"center"}}>{toast}</div>}

    {/* Add Modal */}
    {addM&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setAddM(false)}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"#141414",borderRadius:"16px 16px 0 0",padding:18,maxHeight:"60vh",overflowY:"auto"}}>
        <div style={{width:32,height:4,borderRadius:2,background:"#333",margin:"0 auto 12px"}}/>
        <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>Add Subscription</div>
        <input value={addS} onChange={e=>setAddS(e.target.value)} placeholder="Search services..." style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1px solid #222",background:"#1a1a1a",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8}}/>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {fK.map(n=><button key={n} onClick={()=>{const newSub={id:String(Date.now()),name:n,cat:"streaming",cost:0,cycle:"monthly",renewal:new Date(Date.now()+30*864e5).toISOString().split("T")[0],trial:false,sat:null,freq:null,miss:null,audit:null,added:new Date().toISOString().split("T")[0]};setSubs([...subs,newSub]);notify(`✅ ${n} added`);setAddM(false);setAddS("")}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"#1a1a1a",border:"none",borderRadius:8,cursor:"pointer",width:"100%",textAlign:"left",color:"#fff",fontSize:13,fontWeight:500,fontFamily:"inherit",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background="#222"} onMouseLeave={e=>e.currentTarget.style.background="#1a1a1a"}>
            <div style={{width:30,height:30,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>📦</div>{n}
          </button>)}
        </div>
        <button style={{...B,width:"100%",marginTop:8,background:"#1a1a1a",color:"#666",fontSize:11,borderRadius:8}}>+ Custom subscription</button>
      </div>
    </div>}
  </div>)
}
