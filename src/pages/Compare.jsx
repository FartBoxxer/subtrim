import { useParams, Link } from 'react-router-dom';
import { TIERS, SERVICE_CATS, CATS } from '../data/serviceData';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const fm=n=>'$'+Number(n).toFixed(2);

// Build slug→name map
const SLUG_MAP={};
Object.keys(TIERS).forEach(name=>{
  SLUG_MAP[name.toLowerCase().replace(/[^a-z0-9]+/g,'-')]=name;
});

export default function Compare(){
  const{slug}=useParams();
  const parts=(slug||'').split('-vs-');
  const nameA=SLUG_MAP[parts[0]];
  const nameB=SLUG_MAP[parts[1]];
  const tiersA=nameA?TIERS[nameA]:null;
  const tiersB=nameB?TIERS[nameB]:null;

  if(!tiersA||!tiersB)return(
    <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
      <div style={{fontSize:48,marginBottom:16}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Comparison Not Found</h1>
      <p style={{color:MT,marginBottom:24}}>We couldn't find one or both of those services.</p>
      <Link to="/" style={{color:G,fontWeight:600,textDecoration:"none"}}>← Back to SubTrim</Link>
    </div>
  );

  const catA=SERVICE_CATS[nameA]||'lifestyle';
  const catB=SERVICE_CATS[nameB]||'lifestyle';
  const infoA=CATS[catA]||{e:'📦',c:'#666',l:'Other'};
  const infoB=CATS[catB]||{e:'📦',c:'#666',l:'Other'};
  const cheapestA=Math.min(...tiersA.map(t=>t.p));
  const cheapestB=Math.min(...tiersB.map(t=>t.p));
  const guideA=CANCEL_GUIDES[nameA];
  const guideB=CANCEL_GUIDES[nameB];

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title={`${nameA} vs ${nameB} (${new Date().getFullYear()}) — Price Comparison | SubTrim`}
      description={`Compare ${nameA} (from ${fm(cheapestA)}/mo) vs ${nameB} (from ${fm(cheapestB)}/mo). See plans, pricing, and which one is right for you.`}
    />
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
    </nav>

    <article style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 80px"}}>
      {/* Breadcrumbs */}
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap",fontSize:13,color:MT}}>
        <Link to="/" style={{color:MT,textDecoration:"none"}}>Home</Link>
        <span style={{color:"#444"}}>›</span>
        <span>Compare</span>
        <span style={{color:"#444"}}>›</span>
        <span style={{color:TX}}>{nameA} vs {nameB}</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 8px"}}>{nameA} vs {nameB}</h1>
      <p style={{fontSize:16,color:MT,margin:"0 0 36px",lineHeight:1.5}}>Side-by-side comparison of plans and pricing to help you pick the right {infoA.l.toLowerCase()} subscription.</p>

      {/* Head-to-head cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
        {[[nameA,tiersA,infoA,cheapestA],[nameB,tiersB,infoB,cheapestB]].map(([name,tiers,info,cheap],idx)=>(
          <div key={idx} style={{background:SF,borderRadius:16,padding:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:info.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{info.e}</div>
              <div>
                <div style={{fontSize:18,fontWeight:700}}>{name}</div>
                <div style={{fontSize:12,color:MT}}>{info.l}</div>
              </div>
            </div>
            <div style={{fontSize:13,color:MT,marginBottom:4}}>Starting from</div>
            <div style={{fontSize:28,fontWeight:800,color:G,marginBottom:16}}>{fm(cheap)}<span style={{fontSize:13,fontWeight:500,color:MT}}>/mo</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {tiers.map((t,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:EL,borderRadius:8}}>
                  <span style={{fontSize:13,fontWeight:500}}>{t.n}</span>
                  <span style={{fontSize:14,fontWeight:700}}>{fm(t.p)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick comparison table */}
      <div style={{background:SF,borderRadius:16,padding:24,marginBottom:32}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Quick Comparison</h2>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${EL}`}}>
              <th style={{textAlign:"left",padding:"10px 0",color:MT,fontWeight:500}}></th>
              <th style={{textAlign:"center",padding:"10px 0",fontWeight:600}}>{nameA}</th>
              <th style={{textAlign:"center",padding:"10px 0",fontWeight:600}}>{nameB}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom:`1px solid ${EL}`}}>
              <td style={{padding:"12px 0",color:MT}}>Cheapest Plan</td>
              <td style={{padding:"12px 0",textAlign:"center",fontWeight:600}}>{fm(cheapestA)}/mo</td>
              <td style={{padding:"12px 0",textAlign:"center",fontWeight:600}}>{fm(cheapestB)}/mo</td>
            </tr>
            <tr style={{borderBottom:`1px solid ${EL}`}}>
              <td style={{padding:"12px 0",color:MT}}>Number of Plans</td>
              <td style={{padding:"12px 0",textAlign:"center"}}>{tiersA.length}</td>
              <td style={{padding:"12px 0",textAlign:"center"}}>{tiersB.length}</td>
            </tr>
            <tr style={{borderBottom:`1px solid ${EL}`}}>
              <td style={{padding:"12px 0",color:MT}}>Annual Cost (cheapest)</td>
              <td style={{padding:"12px 0",textAlign:"center",fontWeight:600}}>{fm(cheapestA*12)}/yr</td>
              <td style={{padding:"12px 0",textAlign:"center",fontWeight:600}}>{fm(cheapestB*12)}/yr</td>
            </tr>
            <tr>
              <td style={{padding:"12px 0",color:MT}}>Cancellation</td>
              <td style={{padding:"12px 0",textAlign:"center"}}>{guideA?<span style={{color:guideA.difficulty==='easy'?G:guideA.difficulty==='medium'?'#f59e0b':'#ef4444',fontWeight:600}}>{guideA.difficulty}</span>:'—'}</td>
              <td style={{padding:"12px 0",textAlign:"center"}}>{guideB?<span style={{color:guideB.difficulty==='easy'?G:guideB.difficulty==='medium'?'#f59e0b':'#ef4444',fontWeight:600}}>{guideB.difficulty}</span>:'—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cancel guide links */}
      {(guideA||guideB)&&(
        <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
          {guideA&&<Link to={`/guides/cancel/${nameA.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{background:EL,borderRadius:10,padding:"12px 18px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>How to cancel {nameA} →</Link>}
          {guideB&&<Link to={`/guides/cancel/${nameB.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{background:EL,borderRadius:10,padding:"12px 18px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>How to cancel {nameB} →</Link>}
        </div>
      )}

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Not Sure Which to Keep?</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>Add both to SubTrim and run a usage audit. We'll recommend which to keep based on how you actually use them.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </article>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
