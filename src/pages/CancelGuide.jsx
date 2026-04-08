import { useParams, Link } from 'react-router-dom';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { Helmet, JsonLd } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';

// Build a slug→name map for lookup
const SLUG_MAP={};
Object.keys(CANCEL_GUIDES).forEach(name=>{
  SLUG_MAP[name.replace(/\+/g,' plus').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')]=name;
});

export default function CancelGuide(){
  const{service}=useParams();
  const name=SLUG_MAP[service];
  const guide=name?CANCEL_GUIDES[name]:null;

  if(!guide)return(
    <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
      <div style={{fontSize:48,marginBottom:16}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Guide Not Found</h1>
      <p style={{color:MT,marginBottom:24}}>We don't have a cancellation guide for that service yet.</p>
      <Link to="/" style={{color:G,fontWeight:600,textDecoration:"none"}}>← Back to SubTrim</Link>
    </div>
  );

  const diffColor=guide.difficulty==='easy'?G:guide.difficulty==='medium'?'#f59e0b':'#ef4444';

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title={`How to Cancel ${name} (${new Date().getFullYear()}) | Step-by-Step Guide | SubTrim`}
      description={`Cancel your ${name} subscription in ${guide.steps.length} easy steps. ${guide.difficulty==='easy'?'Takes under 2 minutes.':guide.difficulty==='medium'?'Takes about 5 minutes.':'May require contacting support.'}`}
      canonical={`https://subtrim.dev/guides/cancel/${service}`}
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"HowTo",
      name:`How to Cancel ${name}`,
      description:`Step-by-step guide to cancel your ${name} subscription.`,
      totalTime:guide.difficulty==='easy'?'PT2M':guide.difficulty==='medium'?'PT5M':'PT15M',
      step:guide.steps.map((s,i)=>({"@type":"HowToStep",position:i+1,text:s})),
      ...(guide.url?{url:guide.url}:{})
    }}/>
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:800,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
    </nav>

    <article style={{maxWidth:720,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
          <Link to="/" style={{color:MT,fontSize:13,textDecoration:"none"}}>Home</Link>
          <span style={{color:"#444"}}>›</span>
          <span style={{color:MT,fontSize:13}}>Cancellation Guides</span>
          <span style={{color:"#444"}}>›</span>
          <span style={{fontSize:13}}>{name}</span>
        </div>
        <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 12px"}}>How to Cancel {name}</h1>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:13,padding:"4px 12px",borderRadius:6,background:diffColor+"22",color:diffColor,fontWeight:600}}>{guide.difficulty==='easy'?'Easy (1-2 min)':guide.difficulty==='medium'?'Medium (~5 min)':'Hard (may need support)'}</span>
          <span style={{fontSize:13,color:MT}}>{guide.steps.length} steps</span>
          <span style={{fontSize:13,color:MT}}>Updated {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>
        </div>
      </div>

      {/* Steps */}
      <div style={{background:SF,borderRadius:16,padding:28,marginBottom:24}}>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 20px"}}>Step-by-Step Instructions</h2>
        <ol style={{margin:0,paddingLeft:24,listStyle:"none",counterReset:"steps"}}>
          {guide.steps.map((step,i)=>(
            <li key={i} style={{position:"relative",paddingLeft:12,paddingBottom:i<guide.steps.length-1?20:0,borderLeft:i<guide.steps.length-1?`2px solid ${EL}`:"none",marginLeft:12}}>
              <div style={{position:"absolute",left:-13,top:0,width:24,height:24,borderRadius:"50%",background:G+"22",color:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{i+1}</div>
              <div style={{fontSize:15,lineHeight:1.6,paddingTop:1}}>{step}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* Note */}
      {guide.note&&(
        <div style={{background:"#f59e0b11",border:"1px solid #f59e0b33",borderRadius:12,padding:18,marginBottom:24}}>
          <div style={{fontSize:14,color:"#f59e0b",fontWeight:600,marginBottom:4}}>💡 Good to Know</div>
          <p style={{fontSize:14,color:MT,lineHeight:1.6,margin:0}}>{guide.note}</p>
        </div>
      )}

      {/* Direct link */}
      {guide.url&&(
        <a href={guide.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,background:EL,borderRadius:10,padding:"14px 22px",fontSize:14,color:G,fontWeight:600,textDecoration:"none",border:`1px solid #222`,marginBottom:32}}>
          Go to {name} account page →
        </a>
      )}

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center",marginTop:24}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Track All Your Subscriptions</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>SubTrim audits your subscriptions, finds overlaps, and saves you hundreds per year. Totally free.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </article>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}

// Export all guide slugs for pre-rendering
export const GUIDE_SLUGS=Object.keys(CANCEL_GUIDES).map(n=>n.replace(/\+/g,' plus').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''));
