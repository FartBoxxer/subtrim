import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"};
const fm=n=>'$'+Number(n).toFixed(2);

const DEMO_SUBS=[
  {id:1,name:"Netflix",cat:"streaming",cost:15.49,freq:null,sat:null,miss:null},
  {id:2,name:"Spotify",cat:"music",cost:10.99,freq:null,sat:null,miss:null},
  {id:3,name:"Hulu",cat:"streaming",cost:17.99,freq:null,sat:null,miss:null},
  {id:4,name:"ChatGPT Plus",cat:"ai_tools",cost:20,freq:null,sat:null,miss:null},
  {id:5,name:"Adobe CC",cat:"creative",cost:54.99,freq:null,sat:null,miss:null},
  {id:6,name:"iCloud+",cat:"productivity",cost:2.99,freq:null,sat:null,miss:null},
];

const CATS={
  streaming:{e:"🎬",c:"#e74c3c"},music:{e:"🎵",c:"#a855f7"},gaming:{e:"🎮",c:"#2ecc71"},
  productivity:{e:"💼",c:"#3498db"},creative:{e:"🎨",c:"#f39c12"},ai_tools:{e:"🤖",c:"#00bcd4"},
};

const fO=[{v:"daily",e:"🔥",l:"Daily"},{v:"weekly",e:"👍",l:"Weekly"},{v:"monthly",e:"🤷",l:"Monthly"},{v:"rarely",e:"😬",l:"Rarely"},{v:"never",e:"💀",l:"Never"}];
const fMap={daily:1,weekly:0.75,monthly:0.4,rarely:0.15,never:0};

const gR=s=>{
  if(!s.freq||!s.sat)return"keep";
  if((s.freq==="rarely"||s.freq==="never")&&s.sat<=2&&!s.miss)return"cancel";
  if((s.freq==="rarely"||s.freq==="never")&&s.sat<=3)return"downgrade";
  if(s.freq==="monthly"&&s.cost>15&&s.sat<=3)return"downgrade";
  return"keep";
};

export default function Demo(){
  const[subs,setSubs]=useState(DEMO_SUBS);
  const[step,setStep]=useState(-1);
  const[done,setDone]=useState(false);

  const update=(id,field,val)=>setSubs(prev=>prev.map(s=>s.id===id?{...s,[field]:val}:s));
  const cur=subs[step];
  const ans=cur||{};

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

  const finish=()=>{setStep(-1);setDone(true)};

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Try SubTrim Demo | Free Subscription Audit | SubTrim"
      description="Try SubTrim's subscription audit with sample data. See how it works before creating an account."
      canonical="https://subtrim.dev/demo"
    />
    <style>{`*{box-sizing:border-box;margin:0}button:active:not(:disabled){transform:scale(0.97)}`}</style>

    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{...B,background:G,color:"#000",padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",borderRadius:10}}>Sign Up Free</Link>
    </nav>

    <div style={{maxWidth:560,margin:"0 auto",padding:"20px 20px 80px"}}>
      {/* Banner */}
      <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:12,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>🧪</span>
        <div style={{fontSize:13,color:G,fontWeight:600}}>Demo Mode <span style={{fontWeight:400,color:MT}}>— sample data, nothing is saved</span></div>
      </div>

      {/* Overview */}
      {step===-1&&!done&&(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🧠</div>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:8}}>Subscription Audit</h1>
          <p style={{fontSize:15,color:MT,marginBottom:24,lineHeight:1.5}}>Answer 3 quick questions for each subscription. We'll tell you what to keep, cancel, or downgrade.</p>
          <div style={{background:SF,borderRadius:14,overflow:"hidden",marginBottom:24}}>
            {subs.map((s,i)=>{const c=CATS[s.cat]||{e:"📦",c:"#666"};return(
              <div key={s.id} style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:i<subs.length-1?`1px solid ${EL}`:"none"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:12}}>{c.e}</div>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{s.name}</div></div>
                <span style={{fontSize:15,fontWeight:700,color:MT}}>-{fm(s.cost)}</span>
              </div>
            )})}
          </div>
          <div style={{fontSize:14,color:MT,marginBottom:16}}>Total: <strong style={{color:TX}}>{fm(subs.reduce((a,s)=>a+s.cost,0))}/mo</strong></div>
          <button onClick={()=>setStep(0)} style={{...B,background:G,color:"#000",padding:"14px 32px",fontSize:16,fontWeight:700,borderRadius:10}}>Start Audit</button>
        </div>
      )}

      {/* Audit questions */}
      {step>=0&&step<subs.length&&(()=>{const s=subs[step];const c=CATS[s.cat]||{e:"📦",c:"#666"};return(
        <div>
          <div style={{display:"flex",gap:2,marginBottom:16}}>{subs.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<step?G:i===step?"#00b8d4":EL}}/>)}</div>
          <div style={{fontSize:13,color:MT,textAlign:"center",marginBottom:16}}>{step+1}/{subs.length}</div>
          <div style={{background:SF,borderRadius:16,padding:32,textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>{c.e}</div>
            <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:14,color:MT,marginBottom:4}}>{fm(s.cost)}/mo</div>

            <div style={{marginTop:24,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>How often do you use this?</div>
              <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>{fO.map(o=><button key={o.v} onClick={()=>update(s.id,'freq',o.v)} style={{...B,padding:"8px 16px",fontSize:13,borderRadius:8,background:s.freq===o.v?(o.v==="daily"?G:o.v==="never"?"#ef4444":"#f59e0b"):EL,color:s.freq===o.v?"#000":MT}}>{o.e} {o.l}</button>)}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>How much do you enjoy it?</div>
              <div style={{display:"flex",gap:4,justifyContent:"center"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>update(s.id,'sat',n)} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",filter:(s.sat||0)>=n?"none":"grayscale(1) opacity(0.3)",transition:"all 0.15s"}}>⭐</button>)}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Would you miss it if it was gone?</div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                <button onClick={()=>update(s.id,'miss',true)} style={{...B,padding:"10px 28px",fontSize:14,borderRadius:8,background:s.miss===true?G:EL,color:s.miss===true?"#000":MT}}>Yes</button>
                <button onClick={()=>update(s.id,'miss',false)} style={{...B,padding:"10px 28px",fontSize:14,borderRadius:8,background:s.miss===false?"#ef4444":EL,color:s.miss===false?"#fff":MT}}>No</button>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button onClick={()=>setStep(step-1)} disabled={step===0} style={{...B,flex:1,background:EL,color:step===0?"#333":MT,fontSize:14,borderRadius:10,padding:"14px",opacity:step===0?0.4:1}}>← Back</button>
            <button onClick={()=>{if(step<subs.length-1)setStep(step+1);else finish()}} style={{...B,flex:2,background:G,color:"#000",fontWeight:700,fontSize:14,borderRadius:10,padding:"14px"}}>{step<subs.length-1?"Next →":"Finish Audit"}</button>
          </div>
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
            {recs.map(s=>{const c=CATS[s.cat]||{e:"📦",c:"#666"};const rc=s.rec==="cancel"?"#ef4444":s.rec==="downgrade"?"#f59e0b":"#00d48a";return(
              <div key={s.id} style={{display:"flex",alignItems:"center",padding:"12px 16px",background:SF,borderRadius:10,borderLeft:`3px solid ${rc}`}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:10}}>{c.e}</div>
                <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{s.name}</div><div style={{fontSize:11,color:MT}}>{s.freq||"—"} · {s.sat||0}★</div></div>
                <span style={{fontSize:12,fontWeight:700,color:rc,background:rc+"18",padding:"3px 10px",borderRadius:6}}>{s.rec==="cancel"?"Cut":s.rec==="downgrade"?"Downgrade":"Keep"}</span>
              </div>
            )})}
          </div>

          <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:24,marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>That took about 2 minutes.</div>
            <p style={{fontSize:13,color:MT,lineHeight:1.5,marginBottom:16}}>With a free account, SubTrim tracks your real subscriptions, detects overlaps automatically, finds active deals, and keeps your SubScore updated over time.</p>
            <Link to="/app" style={{...B,background:G,color:"#000",padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-block",borderRadius:10}}>Create Free Account</Link>
          </div>

          <button onClick={()=>{setSubs(DEMO_SUBS);setDone(false);setStep(-1)}} style={{...B,background:EL,color:MT,fontSize:13,borderRadius:8}}>Reset Demo</button>
        </div>
      )}
    </div>
  </div>)
}
