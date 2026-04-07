import { Link } from 'react-router-dom';
import { ALTERNATIVES } from '../data/alternatives';
import { TIERS } from '../data/serviceData';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',G='#00d48a',MT='#888',TX='#fff';
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const fm=n=>'$'+Number(n).toFixed(2);

export default function AlternativesIndex(){
  const services=Object.keys(ALTERNATIVES);
  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Find Cheaper Alternatives to Any Subscription | SubTrim"
      description="Spending too much on a subscription? We found cheaper options for Netflix, Spotify, ChatGPT, Adobe, and more."
    />
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:1000,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Compare</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try Free</Link>
      </div>
    </nav>

    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:40,marginBottom:12}}>🔄</div>
        <h1 style={{fontSize:32,fontWeight:800,margin:"0 0 8px"}}>Find Cheaper Alternatives</h1>
        <p style={{fontSize:16,color:MT,margin:0,lineHeight:1.5}}>Spending too much on something? There's probably a cheaper option. Here's what we found.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {services.map(name=>{
          const data=ALTERNATIVES[name];
          const tiers=TIERS[name];
          const cheapest=tiers?fm(Math.min(...tiers.map(t=>t.p))):null;
          const cheapestAlt=data.alts.length?fm(Math.min(...data.alts.map(a=>a.price))):null;
          return(
            <Link key={name} to={`/alternatives/${slug(name)}`} style={{background:SF,borderRadius:16,padding:24,textDecoration:"none",color:TX,border:"1px solid #1a1a1a",transition:"border-color 0.15s",display:"flex",flexDirection:"column"}}>
              <div style={{fontSize:20,fontWeight:700,marginBottom:6}}>{name}</div>
              <div style={{fontSize:13,color:MT,lineHeight:1.5,marginBottom:16,flex:1}}>{data.tagline}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  {cheapest&&<div style={{fontSize:12,color:MT}}>From <span style={{color:TX,fontWeight:600}}>{cheapest}/mo</span></div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12,color:G,fontWeight:600}}>{data.alts.length} alternatives</span>
                  <span style={{color:G}}>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center",marginTop:40}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Want the full picture?</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>Add all your subs to SubTrim and we'll find the overlaps, flag what you're not using, and help you cut the fat.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </div>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
