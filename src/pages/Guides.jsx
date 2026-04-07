import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CANCEL_GUIDES } from '../data/cancelGuides';
import { Helmet, JsonLd } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"};

const DIFF_INFO={easy:{color:G,label:'Easy',icon:'✅',desc:'1-2 minutes'},medium:{color:'#f59e0b',label:'Medium',icon:'⚠️',desc:'~5 minutes'},hard:{color:'#ef4444',label:'Hard',icon:'🔴',desc:'May need support'}};

const guides=Object.entries(CANCEL_GUIDES).map(([name,g])=>({
  name,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),...g
})).sort((a,b)=>a.name.localeCompare(b.name));

export default function GuidesIndex(){
  const[search,setSearch]=useState('');
  const[diffFilter,setDiffFilter]=useState('all');

  const filtered=useMemo(()=>guides.filter(g=>{
    if(diffFilter!=='all'&&g.difficulty!==diffFilter)return false;
    if(search&&!g.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[search,diffFilter]);

  const counts={easy:guides.filter(g=>g.difficulty==='easy').length,medium:guides.filter(g=>g.difficulty==='medium').length,hard:guides.filter(g=>g.difficulty==='hard').length};

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Cancellation Guides — How to Cancel Any Subscription | SubTrim"
      description={`Step-by-step cancellation guides for ${guides.length}+ subscriptions. Find out how to cancel Netflix, Spotify, Adobe, Planet Fitness, and more.`}
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"ItemList",
      name:"Subscription Cancellation Guides",
      description:`Step-by-step guides for cancelling ${guides.length}+ popular subscriptions.`,
      numberOfItems:guides.length,
      itemListElement:guides.slice(0,20).map((g,i)=>({"@type":"ListItem",position:i+1,url:`https://subtrim.dev/guides/cancel/${g.slug}`,name:`How to Cancel ${g.name}`}))
    }}/>
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:1000,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
    </nav>

    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
      {/* Header */}
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,fontSize:13,color:MT}}>
          <Link to="/" style={{color:MT,textDecoration:"none"}}>Home</Link>
          <span style={{color:"#444"}}>›</span>
          <span style={{color:TX}}>Cancellation Guides</span>
        </div>
        <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 8px"}}>How to Cancel Any Subscription</h1>
        <p style={{fontSize:16,color:MT,margin:"0 0 24px",lineHeight:1.5}}>Step-by-step guides for {guides.length}+ services. No more hunting through settings menus.</p>

        {/* Stats bar */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:24}}>
          {Object.entries(DIFF_INFO).map(([k,v])=>(
            <div key={k} style={{background:SF,borderRadius:10,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:16}}>{v.icon}</span>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:v.color}}>{counts[k]}</div>
                <div style={{fontSize:11,color:MT}}>{v.label} · {v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services..." style={{flex:1,minWidth:200,padding:"12px 16px",borderRadius:10,border:"1px solid #222",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:6}}>
            {[{k:'all',l:'All'},{k:'easy',l:'Easy'},{k:'medium',l:'Medium'},{k:'hard',l:'Hard'}].map(f=>(
              <button key={f.k} onClick={()=>setDiffFilter(f.k)} style={{...B,background:diffFilter===f.k?(f.k==='all'?EL:(DIFF_INFO[f.k]?.color||EL)+'22'):'transparent',color:diffFilter===f.k?(f.k==='all'?TX:(DIFF_INFO[f.k]?.color||TX)):MT,border:diffFilter===f.k?`1px solid ${f.k==='all'?'#333':(DIFF_INFO[f.k]?.color||'#333')}`:'1px solid #222',borderRadius:8,padding:"8px 14px",fontSize:12}}>{f.l}{f.k!=='all'?` (${counts[f.k]})`:''}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide list */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtered.map(g=>{
          const di=DIFF_INFO[g.difficulty]||DIFF_INFO.easy;
          return(
            <Link key={g.name} to={`/guides/cancel/${g.slug}`} style={{background:SF,borderRadius:12,padding:"18px 20px",textDecoration:"none",color:TX,display:"flex",flexDirection:"column",gap:8,border:"1px solid transparent",transition:"border 0.15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontSize:15,fontWeight:700}}>{g.name}</div>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:di.color+"22",color:di.color,fontWeight:600,flexShrink:0}}>{di.label}</span>
              </div>
              <div style={{fontSize:12,color:MT}}>{g.steps.length} steps · {di.desc}</div>
              {g.note&&<div style={{fontSize:11,color:"#555",lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.note}</div>}
            </Link>
          );
        })}
      </div>

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"40px 0",color:MT}}>
          <div style={{fontSize:32,marginBottom:8}}>🔍</div>
          <div style={{fontSize:15}}>No guides match your search.</div>
        </div>
      )}

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center",marginTop:40}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Track What You Keep</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>After you cancel what you don't need, use SubTrim to track and optimize what's left.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </div>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
