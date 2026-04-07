import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TIERS, SERVICE_CATS, CATS } from '../data/serviceData';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { COMPARE_DATA } from '../data/compareData';
import { Helmet, JsonLd } from '../components/Helmet';

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
      description="Pick any two subscriptions and see the pricing, features, and trade-offs side by side. Helps you figure out which one's worth keeping."
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"WebApplication",
      name:"SubTrim Compare Tool",
      url:"https://subtrim.dev/compare",
      applicationCategory:"UtilityApplication",
      description:"Compare any two subscriptions side by side. Plans, pricing, features, pros and cons.",
      offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}
    }}/>
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
        <p style={{fontSize:16,color:MT,margin:0}}>Pick two services. We'll show you the pricing, features, and which one's actually the better deal.</p>
      </div>

      {/* Selectors */}
      <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"center",marginBottom:40,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200,maxWidth:300}}>
          <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:6,textAlign:"center"}}>Service A</div>
          <select value={pickA} onChange={e=>{setPickA(e.target.value);if(pickB&&SERVICE_CATS[e.target.value]!==SERVICE_CATS[pickB])setPickB('')}} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${pickA?catA.c:EL}`,background:SF,color:TX,fontSize:15,fontFamily:"inherit",cursor:"pointer",appearance:"none",textAlign:"center",fontWeight:600}}>
            <option value="">Select a service...</option>
            {ALL_SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{fontSize:24,fontWeight:800,color:MT,padding:"20px 0 0"}}>vs</div>
        <div style={{flex:1,minWidth:200,maxWidth:300}}>
          <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:6,textAlign:"center"}}>Service B {pickA&&<span style={{color:"#555",fontWeight:400}}>({CATS[SERVICE_CATS[pickA]]?.l||'same category'})</span>}</div>
          <select value={pickB} onChange={e=>setPickB(e.target.value)} disabled={!pickA} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`2px solid ${pickB?catB.c:EL}`,background:SF,color:TX,fontSize:15,fontFamily:"inherit",cursor:pickA?"pointer":"not-allowed",appearance:"none",textAlign:"center",fontWeight:600,opacity:pickA?1:0.5}}>
            <option value="">{pickA?'Select a service...':'Pick Service A first'}</option>
            {ALL_SERVICES.filter(s=>s!==pickA&&SERVICE_CATS[s]===SERVICE_CATS[pickA]).map(s=><option key={s} value={s}>{s}</option>)}
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
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:28}}>
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

        {/* Savings highlight */}
        {cheapA!==cheapB&&(
          <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:20,marginBottom:28,textAlign:"center"}}>
            <div style={{fontSize:13,color:MT,marginBottom:4}}>💰 Switching to the cheaper option saves you</div>
            <div style={{fontSize:32,fontWeight:800,color:G}}>{fm(Math.abs(cheapA-cheapB))}<span style={{fontSize:14,color:MT}}>/mo</span></div>
            <div style={{fontSize:14,color:G,fontWeight:600,marginTop:4}}>That's {fm(Math.abs(cheapA-cheapB)*12)}/year by choosing {cheapA<cheapB?pickA:pickB}</div>
          </div>
        )}

        {/* Stats table */}
        <div style={{background:SF,borderRadius:16,padding:24,marginBottom:28}}>
          <h2 style={{fontSize:17,fontWeight:700,margin:"0 0 14px"}}>Quick Comparison</h2>
          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:480}}>
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
                <td style={{padding:"11px 0",color:MT}}>Most Expensive</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(Math.max(...tiersA.map(t=>t.p)))}/mo</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(Math.max(...tiersB.map(t=>t.p)))}/mo</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Annual Cost (cheapest)</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(cheapA*12)}/yr</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{fm(cheapB*12)}/yr</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Plan Options</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{tiersA.length}</td>
                <td style={{padding:"11px 0",textAlign:"center"}}>{tiersB.length}</td>
              </tr>
              <tr style={{borderBottom:`1px solid ${EL}`}}>
                <td style={{padding:"11px 0",color:MT}}>Category</td>
                <td style={{padding:"11px 0",textAlign:"center"}}><span style={{background:catA.c+"22",color:catA.c,padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:600}}>{catA.e} {catA.l}</span></td>
                <td style={{padding:"11px 0",textAlign:"center"}}><span style={{background:catB.c+"22",color:catB.c,padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:600}}>{catB.e} {catB.l}</span></td>
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
        </div>

        {/* Feature comparison */}
        {allFeatures.length>0&&(
          <div style={{background:SF,borderRadius:16,padding:24,marginBottom:28}}>
            <h2 style={{fontSize:17,fontWeight:700,margin:"0 0 14px"}}>Feature Comparison</h2>
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:480}}>
              <thead><tr style={{borderBottom:`1px solid ${EL}`}}>
                <th style={{textAlign:"left",padding:"10px 0",color:MT,fontWeight:500}}>Feature</th>
                <th style={{textAlign:"center",padding:"10px 0",fontWeight:600,width:80}}>{pickA}</th>
                <th style={{textAlign:"center",padding:"10px 0",fontWeight:600,width:80}}>{pickB}</th>
              </tr></thead>
              <tbody>
                {allFeatures.map((f,i)=>{
                  const hasA=dataA?.features?.includes(f);
                  const hasB=dataB?.features?.includes(f);
                  return(<tr key={i} style={{borderBottom:`1px solid ${EL}`}}>
                    <td style={{padding:"11px 0",color:TX,fontSize:13}}>{f}</td>
                    <td style={{padding:"11px 0",textAlign:"center",fontSize:16}}>{hasA?<span style={{color:G}}>✓</span>:<span style={{color:"#444"}}>—</span>}</td>
                    <td style={{padding:"11px 0",textAlign:"center",fontSize:16}}>{hasB?<span style={{color:G}}>✓</span>:<span style={{color:"#444"}}>—</span>}</td>
                  </tr>);
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* Pros & Cons */}
        {(dataA?.pros||dataB?.pros)&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:28}}>
            {[{name:pickA,data:dataA,info:catA},{name:pickB,data:dataB,info:catB}].map(({name,data,info},idx)=>(
              <div key={idx} style={{background:SF,borderRadius:16,padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:info.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{info.e}</div>
                  <div style={{fontSize:15,fontWeight:700}}>{name}</div>
                </div>
                {data?.pros&&<div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:G,marginBottom:6,letterSpacing:1}}>PROS</div>
                  {data.pros.map((p,i)=><div key={i} style={{fontSize:13,color:MT,padding:"5px 0",display:"flex",gap:8,lineHeight:1.4}}><span style={{color:G,flexShrink:0}}>+</span>{p}</div>)}
                </div>}
                {data?.cons&&<div>
                  <div style={{fontSize:11,fontWeight:600,color:"#ef4444",marginBottom:6,letterSpacing:1}}>CONS</div>
                  {data.cons.map((c,i)=><div key={i} style={{fontSize:13,color:MT,padding:"5px 0",display:"flex",gap:8,lineHeight:1.4}}><span style={{color:"#ef4444",flexShrink:0}}>−</span>{c}</div>)}
                </div>}
                {!data&&<div style={{fontSize:13,color:"#444",padding:8}}>Detailed data coming soon</div>}
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

        {/* Cancel guides + alternatives links */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28}}>
          {guideA&&<Link to={`/guides/cancel/${slug(pickA)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222",textAlign:"center",whiteSpace:"nowrap"}}>Cancel {pickA} →</Link>}
          {guideB&&<Link to={`/guides/cancel/${slug(pickB)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222",textAlign:"center",whiteSpace:"nowrap"}}>Cancel {pickB} →</Link>}
          <Link to={`/alternatives/${slug(pickA)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:"1px solid #222",textAlign:"center",whiteSpace:"nowrap"}}>{pickA} alts</Link>
          <Link to={`/alternatives/${slug(pickB)}`} style={{background:EL,borderRadius:10,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:"1px solid #222",textAlign:"center",whiteSpace:"nowrap"}}>{pickB} alts</Link>
        </div>
      </>}

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center",marginTop:40}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Still not sure?</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>Add both to SubTrim and run the audit. It'll tell you which one you actually use more. No more guessing.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </div>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
