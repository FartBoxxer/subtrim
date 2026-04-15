import { useParams, Link } from 'react-router-dom';
import { WORTH_IT, WORTH_IT_SLUGS } from '../data/worthIt';
import { ALTERNATIVES } from '../data/alternatives';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { TIERS } from '../data/serviceData';
import { Helmet, JsonLd } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const fm=n=>'$'+Number(n).toFixed(2);
const slug=n=>n.replace(/\+/g,' plus').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');

const VERDICT_COLORS={yes:G,no:'#ef4444',conditional:'#f59e0b'};
const VERDICT_LABELS={yes:'Yes, worth it',no:'No, not worth it',conditional:'It depends'};

export default function WorthIt(){
  const{service}=useParams();
  const name=WORTH_IT_SLUGS[service];
  const data=name?WORTH_IT[name]:null;
  const year=new Date().getFullYear();

  if(!data)return(
    <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
      <div style={{fontSize:48,marginBottom:16}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Not Found</h1>
      <p style={{color:MT,marginBottom:24}}>We have not reviewed that service yet.</p>
      <Link to="/" style={{color:G,fontWeight:600,textDecoration:"none"}}>← Back to SubTrim</Link>
    </div>
  );

  const vc=VERDICT_COLORS[data.verdict]||MT;
  const hasAlt=!!ALTERNATIVES[name];
  const hasGuide=!!CANCEL_GUIDES[name];
  const tiers=TIERS[name];
  const cheapest=tiers?Math.min(...tiers.map(t=>t.p)):data.price;

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title={`Is ${name} Worth It in ${year}? | SubTrim`}
      description={`${data.summary} Full breakdown of who should keep ${name} and who should cancel.`}
      canonical={`https://subtrim.dev/worth-it/${service}`}
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"Product",
      name,
      description:data.summary,
      brand:{"@type":"Brand",name},
      offers:{"@type":"Offer",price:cheapest.toFixed(2),priceCurrency:"USD",availability:"https://schema.org/InStock"},
      review:{
        "@type":"Review",
        reviewRating:{"@type":"Rating",ratingValue:data.verdict==='yes'?5:data.verdict==='conditional'?3:2,bestRating:5,worstRating:1},
        author:{"@type":"Organization",name:"SubTrim"},
        datePublished:`${year}-01-01`,
        reviewBody:`${VERDICT_LABELS[data.verdict]}. ${data.summary} Keep it if: ${data.whoShouldKeep} Cancel it if: ${data.whoShouldCancel}`,
        name:`Is ${name} Worth It in ${year}?`
      }
    }}/>
    <JsonLd data={{
      "@context":"https://schema.org","@type":"FAQPage",
      mainEntity:[
        {"@type":"Question",name:`Is ${name} worth it in ${year}?`,acceptedAnswer:{"@type":"Answer",text:`${VERDICT_LABELS[data.verdict]}. ${data.summary}`}},
        {"@type":"Question",name:`Who should keep ${name}?`,acceptedAnswer:{"@type":"Answer",text:data.whoShouldKeep}},
        {"@type":"Question",name:`Who should cancel ${name}?`,acceptedAnswer:{"@type":"Answer",text:data.whoShouldCancel}},
        ...(data.breakEven?[{"@type":"Question",name:`When does ${name} break even?`,acceptedAnswer:{"@type":"Answer",text:data.breakEven}}]:[])
      ]
    }}/>
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
    </nav>

    <article style={{maxWidth:760,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,fontSize:13,color:MT,flexWrap:"wrap"}}>
        <Link to="/" style={{color:MT,textDecoration:"none"}}>Home</Link>
        <span style={{color:"#444"}}>›</span>
        <span>Worth It</span>
        <span style={{color:"#444"}}>›</span>
        <span style={{color:TX}}>{name}</span>
      </div>

      <h1 style={{fontSize:34,fontWeight:800,lineHeight:1.15,margin:"0 0 14px",letterSpacing:"-0.01em"}}>Is {name} Worth It in {year}?</h1>

      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:20}}>
        <span style={{background:vc+"18",color:vc,fontSize:13,fontWeight:700,padding:"6px 14px",borderRadius:20,letterSpacing:0.3}}>{VERDICT_LABELS[data.verdict]}</span>
        <span style={{fontSize:14,color:MT}}>From <strong style={{color:TX}}>{fm(cheapest)}/mo</strong></span>
      </div>

      <p style={{fontSize:17,color:"#ccc",lineHeight:1.6,margin:"0 0 32px"}}>{data.summary}</p>

      {/* Pros / Cons */}
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16,marginBottom:32}}>
        <div style={{background:SF,borderRadius:14,padding:22,border:`1px solid ${G}22`}}>
          <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:10,letterSpacing:0.5}}>WORTH IT IF</div>
          {data.worthIt.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:14,color:"#ccc",lineHeight:1.5}}>
              <span style={{color:G,flexShrink:0,fontWeight:700}}>+</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
        <div style={{background:SF,borderRadius:14,padding:22,border:`1px solid #ef444422`}}>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:10,letterSpacing:0.5}}>NOT WORTH IT IF</div>
          {data.notWorthIt.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:14,color:"#ccc",lineHeight:1.5}}>
              <span style={{color:"#ef4444",flexShrink:0,fontWeight:700}}>−</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Who / Who */}
      <div style={{background:SF,borderRadius:14,padding:22,marginBottom:24}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>Our Take</h2>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:4}}>KEEP IT</div>
          <p style={{fontSize:14,color:"#ccc",lineHeight:1.6,margin:0}}>{data.whoShouldKeep}</p>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:4}}>CANCEL IT</div>
          <p style={{fontSize:14,color:"#ccc",lineHeight:1.6,margin:0}}>{data.whoShouldCancel}</p>
        </div>
      </div>

      {/* Break-even math */}
      {data.breakEven&&(
        <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:20,marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:6,letterSpacing:0.5}}>THE MATH</div>
          <p style={{fontSize:14,color:"#ccc",lineHeight:1.6,margin:0}}>{data.breakEven}</p>
        </div>
      )}

      {/* Links to related pages */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:32}}>
        {hasAlt&&<Link to={`/alternatives/${slug(name)}`} style={{background:EL,borderRadius:10,padding:"12px 18px",fontSize:13,color:G,textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>{name} alternatives →</Link>}
        {hasGuide&&<Link to={`/guides/cancel/${slug(name)}`} style={{background:EL,borderRadius:10,padding:"12px 18px",fontSize:13,color:"#ef4444",textDecoration:"none",fontWeight:600,border:"1px solid #222"}}>How to cancel {name} →</Link>}
      </div>

      {/* Related worth-it pages */}
      <div style={{marginBottom:32}}>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:14}}>More Worth-It Breakdowns</h2>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {Object.keys(WORTH_IT).filter(n=>n!==name).slice(0,10).map(n=>(
            <Link key={n} to={`/worth-it/${slug(n)}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:"1px solid #1a1a1a"}}>
              Is {n} worth it?
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Not Sure? Run the Audit.</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>SubTrim asks how you actually use each subscription and tells you what to keep, cancel, or downgrade. Takes about 3 minutes.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </article>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {year} SubTrim</p>
    </footer>
  </div>)
}
