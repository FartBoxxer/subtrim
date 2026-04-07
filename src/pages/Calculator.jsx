import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet, JsonLd } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';
const fm=n=>'$'+Number(n).toFixed(2);
const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"};

const PRESETS=[
  {n:'Netflix',p:15.49},{n:'Spotify',p:10.99},{n:'Hulu',p:7.99},{n:'Disney+',p:7.99},
  {n:'YouTube Premium',p:13.99},{n:'ChatGPT Plus',p:20},{n:'HBO Max',p:15.99},
  {n:'Xbox Game Pass',p:14.99},{n:'iCloud+',p:2.99},{n:'Amazon Prime',p:14.99},
  {n:'Apple Music',p:10.99},{n:'Adobe CC',p:54.99},{n:'Microsoft 365',p:9.99},
  {n:'NordVPN',p:12.99},{n:'1Password',p:2.99},{n:'Notion',p:8},
];

export default function Calculator(){
  const[items,setItems]=useState([]);
  const[custom,setCustom]=useState({name:'',price:''});

  const toggle=preset=>{
    setItems(prev=>{
      const exists=prev.find(x=>x.n===preset.n);
      if(exists)return prev.filter(x=>x.n!==preset.n);
      return[...prev,{...preset}];
    });
  };

  const addCustom=()=>{
    if(!custom.name.trim()||!custom.price)return;
    setItems(prev=>[...prev,{n:custom.name.trim(),p:Number(custom.price)}]);
    setCustom({name:'',price:''});
  };

  const removeItem=name=>setItems(prev=>prev.filter(x=>x.n!==name));

  const monthly=items.reduce((s,i)=>s+i.p,0);
  const annual=monthly*12;

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Subscription Cost Calculator — How Much Do You Spend? | SubTrim"
      description="Add up all your subscriptions and see what you're really spending each month and year. The total is probably worse than you think."
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"WebApplication",
      name:"Subscription Cost Calculator",
      url:"https://subtrim.dev/calculator",
      applicationCategory:"FinanceApplication",
      description:"Calculate your total monthly and yearly subscription spending. See what your subscriptions really cost.",
      offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}
    }}/>
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Track for Free</Link>
    </nav>

    <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{marginBottom:36}}>
        <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 8px"}}>Subscription Cost Calculator</h1>
        <p style={{fontSize:16,color:MT,margin:0,lineHeight:1.5}}>Tap the ones you pay for. The total might surprise you.</p>
      </div>

      {/* Total display */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
        <div style={{background:SF,borderRadius:16,padding:24,textAlign:"center"}}>
          <div style={{fontSize:13,color:MT,marginBottom:4}}>Monthly Total</div>
          <div style={{fontSize:36,fontWeight:800,color:monthly>100?'#ef4444':monthly>50?'#f59e0b':G}}>{fm(monthly)}</div>
        </div>
        <div style={{background:SF,borderRadius:16,padding:24,textAlign:"center"}}>
          <div style={{fontSize:13,color:MT,marginBottom:4}}>Annual Total</div>
          <div style={{fontSize:36,fontWeight:800,color:annual>1200?'#ef4444':annual>600?'#f59e0b':G}}>{fm(annual)}</div>
        </div>
      </div>

      {/* Quick add presets */}
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:16,fontWeight:700,marginBottom:12}}>Tap to Add</h2>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {PRESETS.map(p=>{
            const active=items.some(x=>x.n===p.n);
            return(
              <button key={p.n} onClick={()=>toggle(p)} style={{...B,background:active?G+"22":"transparent",color:active?G:MT,border:active?`1px solid ${G}`:`1px solid #333`,borderRadius:20,padding:"8px 16px",fontSize:13}}>
                {p.n} · {fm(p.p)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom add */}
      <div style={{background:SF,borderRadius:14,padding:20,marginBottom:24}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Add Custom Subscription</div>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <div style={{flex:2}}>
            <div style={{fontSize:11,color:MT,marginBottom:4}}>Name</div>
            <input value={custom.name} onChange={e=>setCustom(c=>({...c,name:e.target.value}))} placeholder="e.g. Gym membership" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #333",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:MT,marginBottom:4}}>$/month</div>
            <input value={custom.price} onChange={e=>setCustom(c=>({...c,price:e.target.value}))} type="number" min="0" step="0.01" placeholder="9.99" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #333",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <button onClick={addCustom} style={{...B,background:G,color:"#000",fontWeight:700,padding:"10px 20px",flexShrink:0}}>Add</button>
        </div>
      </div>

      {/* Item list */}
      {items.length>0&&(
        <div style={{background:SF,borderRadius:14,overflow:"hidden",marginBottom:32}}>
          <div style={{fontSize:14,fontWeight:700,padding:"16px 20px 8px"}}>Your Subscriptions ({items.length})</div>
          {items.map((item,i)=>(
            <div key={item.n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderTop:i>0?`1px solid ${EL}`:"none"}}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{item.n}</div>
                <div style={{fontSize:12,color:MT}}>{fm(item.p)}/mo · {fm(item.p*12)}/yr</div>
              </div>
              <button onClick={()=>removeItem(item.n)} style={{...B,background:"#ef444422",color:"#ef4444",fontSize:12,padding:"6px 14px",borderRadius:8}}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {/* Insight */}
      {items.length>=3&&(
        <div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:20,marginBottom:32}}>
          <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:4}}>💡 Insight</div>
          <p style={{fontSize:14,color:MT,lineHeight:1.5,margin:0}}>
            {fm(annual)}/year on {items.length} subscriptions.
            That's {fm(annual/52)} every week — or about {Math.round(annual/5)} cups of coffee a year.
            {monthly>100?" Might be worth running an audit to see what's actually pulling its weight.":''}
          </p>
        </div>
      )}

      {/* CTA */}
      <div style={{background:SF,borderRadius:16,padding:28,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>✂️</div>
        <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>Now what?</h3>
        <p style={{fontSize:14,color:MT,lineHeight:1.5,maxWidth:440,margin:"0 auto 20px"}}>Knowing the total is step one. SubTrim looks at which ones you actually use and tells you where to cut. Takes about 3 minutes.</p>
        <Link to="/app" style={{display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free</Link>
      </div>
    </div>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"24px",textAlign:"center"}}>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim</p>
    </footer>
  </div>)
}
