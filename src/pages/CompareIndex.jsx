import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TIERS, SERVICE_CATS, CATS, COMPARE_PAIRS } from '../data/serviceData';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { COMPARE_DATA } from '../data/compareData';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"};
const fm=n=>'$'+Number(n).toFixed(2);

const ALL_SERVICES=Object.keys(TIERS).sort();
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-');

export default function CompareIndex(){
  const[pickA,setPickA]=useState('');
  const[pickB,setPickB]=useState('');

  const tiersA=pickA?TIERS[pickA]:null;
  const tiersB=pickB?TIERS[pickB]:null;
  const bothPicked=tiersA&&tiersB&&pickA!==pickB;

  const cheapA=tiersA?Math.min(...tiersA.map(t=>t.p)):0;
  const cheapB=tiersB?Math.min(...tiersB.map(t=>t.p)):0;
  const dataA=COMPARE_DATA[pickA];
  const dataB=COMPARE_DATA[pickB];
  const guideA=CANCEL_GUIDES[pickA];
  const guideB=CANCEL_GUIDES[pickB];
  const catA=CATS[SERVICE_CATS[pickA]]||{e:'📦',c:'#666',l:'Other'};
  const catB=CATS[SERVICE_CATS[pickB]]||{e:'📦',c:'#666',l:'Other'};

  // All unique features between the two
  const allFeatures=useMemo(()=>{
    if(!dataA?.features&&!dataB?.features)return[];
    const setA=new Set(dataA?.features||[]);
    const setB=new Set(dataB?.features||[]);
    return[...new Set([...(dataA?.features||[]),...(dataB?.features||[])])];
  },[dataA,dataB]);

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Compare Subscriptions Side by Side | SubTrim"
      description="Compare any two subscriptions side by side. See plans, pricing, features, pros & cons to decide which to keep."
    />
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:1000,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try Free</Link>
      </div>
    </nav>

    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <h1 style={{fontSize:32,fontWeight:800,margin:"0 0 8px"}}>Compare Any Two Subscriptions</h1>
        <p style={{fontSize:16,color:MT,margin:0}}>Pick two services to see plans, pricing, features, and our recommendation side by side.</p>
      </div>

      {/* Selectors */}
      <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"center",marginBottom:40,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200,maxWidth:300}}>
          <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:6,textAlign:"center"}}>Service A</div>
          <select value={pickA} onChange={e=>setPickA(e.target.value)} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${pickA?catA.c:EL}`,background:SF,color:TX,fontSize:15,fontFamily:"inherit",cursor:"pointer",appearance:"none",textAlign:"center",fontWeight:600}}>
            <option value="">Select a service...</option>
            {ALL_SERVICES.filter(s=>s!==pickB).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{fontSize:24,fontWeight:800,color:MT,padding:"20px 0 0"}}>vs</div>
        <div style={{flex:1,minWidth:200,maxWidth:300}}>
          <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:6,textAlign:"center"}}>Service B</div>
          <select value={pickB} onChange={e=>setPickB(e.target.value)} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${pickB?catB.c:EL}`,background:SF,color:TX,fontSize:15,fontFamily:"inherit",cursor:"pointer",appearance:"none",textAlign:"center",fontWeight:600}}>
            <option value="">Select a service...</option>
            {ALL_SERVICES.filter(s=>s!==pickA).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Prompt if not both selected */}
      {!bothPicked&&(
        <div style={{textAlign:"center",padding:"40px 0",color:MT}}>
          {pickA===pickB&&pickA?<div style={{fontSize:15}}>Pick two <em>different</em> services to compare.</div>
          :<>
            <div style={{fontSize:40,marginBottom:12}}>⚖️</div>
            <div style={{fontSize:15}}>Select two services above to see a full comparison.</div>
          </>}
        </div>
      )}

      {/* Results */}
      {bothPicked&&<>
        {/* Price cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
          {[[pickA,tiersA,catA,cheapA],[pickB,tiersB,catB,cheapB]].map(([name,tiers,info,cheap],idx)=>(
            <div key={idx} style={{background:SF,borderRadius:16,padding:24}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:info.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{info.e}</div>
                <div>
                  <div style={{fontSize:18,fontWeight:700}}>{name}</div>
                  <div style={{fontSize:12,color:MT}}>{info.l}</div>
                </div>
              </div>
              <div style={{fontSize:13,color:MT,marginBottom:4}}>Starting from</div>
              <div style={{fontSize:28,fontWeight:800,color:cheap<=Math.min(cheapA,cheapB)?G:TX,marginBottom:16}}>{fm(cheap)}<span style={{fontSize:13,fontWeight:500,color:MT}}>/mo</span></div>
              {tiers.map((t,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:EL,borderRadius:8,marginBottom:i<tiers.length-1?6:0}}>
                  <span style={{fontSize:13}}>{t.n}</span>
                  <span style={{fontSize:14,fontWeight:700}}>{fm(t.p)}/mo</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Stats table */}
        <div style={{background:SF,borderRadius:16,padding:24,marginBottom:28}}>
          <h2 style={{fontSize:17,fontWeight:700,margin:"0 0 14px"}}>Quick Comparison</h2>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`1px solid ${EL}`}}>
              <th style={{textAlign:"left",padding:"10px 0",color:MT,fontWeight:500}}></th>
              <th style={{textAlign:"center",padding:"10px 0",fontWeight:600}}>{pickA}</th>
              <th style={{textAlign:"center",padding:"10px 0",fontWeight:600}}>{pickB}</th>
            </tr></thead>
            <tbody>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Cheapest Plan</td>
                <td style={{padding:"11px 0",textAlign:"center",fontWeight:600,color:cheapA<=cheapB?G:TX}}>{fm(cheapA)}/mo{cheapA<cheapB?' ✓':''}</td>
                <td style={{padding:"11px 0",textAlign:"center",fontWeight:600,color:cheapB<=cheapA?G:TX}}>{fm(cheapB)}/mo{cheapB<cheapA?' ✓':''}</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Annual Cost</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(cheapA*12)}/yr</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(cheapB*12)}/yr</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Plans</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{tiersA.length}</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{tiersB.length}</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Cancellation</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{guideA?<span style={{color:guideA.difficulty==='easy'?G:guideA.difficulty==='medium'?'#f59e0b':'#ef4444',fontWeight:600}}>{guideA.difficulty}</span>:'—'}</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{guideB?<span style={{color:guideB.difficulty==='easy'?G:guideB.difficulty==='medium'?'#f59e0b':'#ef4444',fontWeight:600}}>{guideB.difficulty}</span>:'—'}</td>
              </tr>
              {dataA?.stats&&dataB?.stats&&Object.keys(dataA.stats).filter(k=>dataB.stats[k]).map(k=>(
                <tr key={k} style={{borderBottom:`1px solid ${EL}`}}>
                  <td style={{padding:"11px 0",color:MT,textTransform:"capitalize"}}>{k}</td>
                  <td style={{padding:"11px 0",textAlign:"center"}}>{dataA.stats[k]}</td>
                  <td style={{padding:"11px 0",textAlign:"center"}}>{dataB.stats[k]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pros & Cons */}
        {(dataA?.pros||dataB?.pros)&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
            {[{name:pickA,data:dataA,info:catA},{name:pickB,data:dataB,info:catB}].map(({name,data,info},idx)=>(
              <div key={idx} style={{background:SF,borderRadius:16,padding:20}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>{name}</div>
                {data?.pros&&<div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:G,marginBottom:4}}>PROS</div>
                  {data.pros.map((p,i)=><div key={i} style={{fontSize:12,color:MT,padding:"4px 0",display:"flex",gap:6}}><span style={{color:G}}>+</span>{p}</div>)}
                </div>}
                {data?.cons&&<div>
                  <div style={{fontSize:11,fontWeight:600,color:"#ef4444",marginBottom:4}}>CONS</div>
                  {data.cons.map((c,i)=><div key={i} style={{fontSize:12,color:MT,padding:"4px 0",display:"flex",gap:6}}><span style={{color:"#ef4444"}}>−</span>{c}</div>)}
                </div>}
                {!data&&<div style={{fontSize:12,color:"#444"}}>Detailed data coming soon</div>}
              </div>
            ))}
          </div>
        )}

        {/* Our Take */}
        {(dataA?.bestFor||dataB?.bestFor)&&(
          <div style={{background:SF,borderRadius:16,padding:24,marginBottom:28}}>
            <h2 style={{fontSize:17,fontWeight:700,margin:"0 0 14px"}}>Our Take</h2>
            {[{name:pickA,data:dataA,info:catA},{name:pickB,data:dataB,info:catB}].filter(x=>x.data?.bestFor).map(({name,data,info},idx)=>(
              <div key={idx} style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:EL,borderRadius:12,marginBottom:idx===0?10:0}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:info.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{info.e}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{name}</div>
                  <div style={{fontSize:13,color:MT,lineHeight:1.5}}>{data.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel guides */}
        {(guideA||guideB)&&(
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
            {guideA&&<Link to={`/guides/cancel/${slug(pickA)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>How to cancel {pickA} →</Link>}
            {guideB&&<Link to={`/guides/cancel/${slug(pickB)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>How to cancel {pickB} →</Link>}
          </div>
        )}
      </>}

      {/* Popular comparisons */}
      <div style={{marginTop:48}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>Popular Comparisons</h2>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {COMPARE_PAIRS.map(([a,b])=>(
            <Link key={`${a}-${b}`} to={`/compare/${slug(a)}-vs-${slug(b)}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:"1px solid #222"}}>{a} vs {b}</Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center",marginTop:40}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Can't Decide? Let SubTrim Help</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>Add your subscriptions and run a usage audit. We'll tell you exactly what to keep based on how you actually use them.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </div>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
