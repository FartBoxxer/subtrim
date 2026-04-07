import { useParams, Link } from 'react-router-dom';
import { TIERS } from '../data/serviceData';
import { ALTERNATIVES, ALT_SLUGS } from '../data/alternatives';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const fm=n=>'$'+Number(n).toFixed(2);
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-');

export default function Alternatives(){
  const{service}=useParams();
  const name=ALT_SLUGS[service];
  const data=name?ALTERNATIVES[name]:null;
  const tiers=name?TIERS[name]:null;
  const cheapest=tiers?Math.min(...tiers.map(t=>t.p)):0;
  const guide=name?CANCEL_GUIDES[name]:null;

  if(!data)return(
    <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
      <div style={{fontSize:48,marginBottom:16}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Not Found</h1>
      <p style={{color:MT,marginBottom:24}}>We don't have alternatives for that service yet.</p>
      <Link to="/" style={{color:G,fontWeight:600,textDecoration:"none"}}>← Back to SubTrim</Link>
    </div>
  );

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title={`Best ${name} Alternatives (${new Date().getFullYear()}) | Cheaper & Better Options | SubTrim`}
      description={`Looking to replace ${name}? Compare the best alternatives with pricing, features, and our recommendations.`}
    />
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
    </nav>

    <article style={{maxWidth:760,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,fontSize:13,color:MT,flexWrap:"wrap"}}>
        <Link to="/" style={{color:MT,textDecoration:"none"}}>Home</Link>
        <span style={{color:"#444"}}>›</span>
        <span>Alternatives</span>
        <span style={{color:"#444"}}>›</span>
        <span style={{color:TX}}>{name}</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 10px"}}>Best {name} Alternatives</h1>
      <p style={{fontSize:16,color:MT,margin:"0 0 12px",lineHeight:1.5}}>{data.tagline}</p>
      {tiers&&<p style={{fontSize:14,color:MT,margin:"0 0 32px"}}>{name} currently costs <strong style={{color:TX}}>{fm(cheapest)}/mo</strong> (cheapest plan). Here's what else is out there:</p>}

      {/* Alternatives list */}
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
        {data.alts.map((alt,i)=>{
          const altTiers=TIERS[alt.name];
          const hasGuide=!!CANCEL_GUIDES[alt.name];
          return(
            <div key={alt.name} style={{background:SF,borderRadius:14,padding:22,border:"1px solid #1a1a1a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13,color:MT,fontWeight:600}}>#{i+1}</span>
                    <h3 style={{fontSize:18,fontWeight:700,margin:0}}>{alt.name}</h3>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:22,fontWeight:800,color:alt.price===0?G:(alt.price<cheapest?G:TX)}}>{alt.price===0?'Free':fm(alt.price)+'/mo'}</div>
                  {alt.price>0&&alt.price<cheapest&&<div style={{fontSize:11,color:G}}>Save {fm(cheapest-alt.price)}/mo vs {name}</div>}
                  {alt.price===0&&<div style={{fontSize:11,color:G}}>Free forever</div>}
                </div>
              </div>
              <p style={{fontSize:14,color:MT,lineHeight:1.6,margin:"0 0 12px"}}>{alt.why}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {altTiers&&<Link to={`/compare/${slug(name)}-vs-${slug(alt.name)}`} style={{fontSize:12,color:G,textDecoration:"none",fontWeight:600,background:G+"11",padding:"6px 12px",borderRadius:6}}>Compare with {name} →</Link>}
                {hasGuide&&<Link to={`/guides/cancel/${slug(alt.name)}`} style={{fontSize:12,color:MT,textDecoration:"none",fontWeight:500,background:EL,padding:"6px 12px",borderRadius:6}}>Cancel guide</Link>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel the original */}
      {guide&&(
        <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:20,marginBottom:32}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Ready to cancel {name}?</div>
          <p style={{fontSize:13,color:MT,lineHeight:1.5,margin:"0 0 12px"}}>We have a step-by-step guide to help you cancel. Difficulty: <strong style={{color:guide.difficulty==='easy'?G:guide.difficulty==='medium'?'#f59e0b':'#ef4444'}}>{guide.difficulty}</strong></p>
          <Link to={`/guides/cancel/${slug(name)}`} style={{display:"inline-block",fontSize:13,color:G,textDecoration:"none",fontWeight:600}}>How to cancel {name} →</Link>
        </div>
      )}

      {/* More alternatives */}
      <div style={{marginBottom:32}}>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:14}}>More Alternatives</h2>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {Object.keys(ALTERNATIVES).filter(n=>n!==name).map(n=>(
            <Link key={n} to={`/alternatives/${slug(n)}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:"1px solid #1a1a1a"}}>
              {n} alternatives
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Want to audit everything?</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>SubTrim looks at all your subs, not just this one. Add them in, run the audit, and see what's actually worth keeping.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </article>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
