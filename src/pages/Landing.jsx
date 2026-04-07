import { useState } from 'react';
import { Link } from 'react-router-dom';

const G='#00d48a',BG='#0d0d0d',SF='#141414',EL='#1f1f1f',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"14px 28px",cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:"inherit",transition:"all 0.15s"};
const fm=n=>'$'+Number(n).toFixed(2);

const RECEIPT_ITEMS=[
  {n:"Netflix",p:15.49,cut:false},{n:"Spotify",p:10.99,cut:false},{n:"Hulu",p:17.99,cut:true},
  {n:"Disney+",p:13.99,cut:false},{n:"YouTube Premium",p:13.99,cut:true},{n:"HBO Max",p:15.99,cut:false},
  {n:"iCloud+",p:2.99,cut:false},{n:"ChatGPT Plus",p:20,cut:false},{n:"Adobe CC",p:54.99,cut:true},
  {n:"Xbox Game Pass",p:19.99,cut:false},
];

export default function Landing(){
  const[showBanner,setShowBanner]=useState(true);
  const[cfName,setCfName]=useState('');
  const[cfEmail,setCfEmail]=useState('');
  const[cfMsg,setCfMsg]=useState('');
  const[cfStatus,setCfStatus]=useState('');
  const[cfSending,setCfSending]=useState(false);

  const total=RECEIPT_ITEMS.reduce((a,i)=>a+i.p,0);
  const saved=RECEIPT_ITEMS.filter(i=>i.cut).reduce((a,i)=>a+i.p,0);

  const handleContact=async(e)=>{
    e.preventDefault();
    if(!cfName.trim()||!cfEmail.trim()||!cfMsg.trim()){setCfStatus('Please fill in all fields.');return}
    setCfSending(true);setCfStatus('');
    try{
      const res=await fetch('https://formsubmit.co/ajax/hello@subtrim.dev',{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name:cfName.trim(),email:cfEmail.trim(),message:cfMsg.trim(),_subject:'SubTrim Contact Form'})
      });
      if(res.ok){setCfStatus('sent');setCfName('');setCfEmail('');setCfMsg('')}
      else{setCfStatus('Something went wrong. Try emailing hello@subtrim.dev directly.')}
    }catch{setCfStatus('Something went wrong. Try emailing hello@subtrim.dev directly.')}
    setCfSending(false);
  };

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <style>{`@keyframes cutLine{from{width:0}to{width:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    {/* Dev banner */}
    {showBanner&&<div style={{background:'linear-gradient(135deg,#00d48a18,#3498db18)',borderBottom:'1px solid #00d48a33',padding:'14px 24px',position:'relative'}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
        <span style={{fontSize:20}}>👀</span>
        <div style={{fontSize:14,color:TX,textAlign:'center',lineHeight:1.5}}>
          <strong>Wow. How did you find this?</strong>
          <span style={{color:MT}}> — We're currently under development, so please don't freak out if things start drastically changing.</span>
        </div>
        <button onClick={()=>setShowBanner(false)} style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:MT,fontSize:18,cursor:'pointer',padding:4,lineHeight:1}}>×</button>
      </div>
    </div>}
    {/* Nav */}
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:1100,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:TX,textDecoration:"none"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Compare</Link>
        <Link to="/calculator" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Calculator</Link>
        <Link to="/app" style={{...B,background:G,color:"#000",padding:"10px 22px",fontSize:14,textDecoration:"none"}}>Get Started</Link>
      </div>
    </nav>

    {/* Hero — Receipt */}
    <section style={{padding:"60px 24px 40px",maxWidth:520,margin:"0 auto"}}>
      <div style={{background:"#0f0f0f",border:"1px solid #1a1a1a",borderRadius:2,padding:"40px 36px",position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        {/* Torn top */}
        <div style={{position:"absolute",top:-1,left:0,right:0,height:6,background:BG,maskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q 2.5 0 5 6 Q 7.5 0 10 6 Q 12.5 0 15 6 Q 17.5 0 20 6 Q 22.5 0 25 6 Q 27.5 0 30 6 Q 32.5 0 35 6 Q 37.5 0 40 6 Q 42.5 0 45 6 Q 47.5 0 50 6 Q 52.5 0 55 6 Q 57.5 0 60 6 Q 62.5 0 65 6 Q 67.5 0 70 6 Q 72.5 0 75 6 Q 77.5 0 80 6 Q 82.5 0 85 6 Q 87.5 0 90 6 Q 92.5 0 95 6 Q 97.5 0 100 6' fill='white'/%3E%3C/svg%3E\")",WebkitMaskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q 2.5 0 5 6 Q 7.5 0 10 6 Q 12.5 0 15 6 Q 17.5 0 20 6 Q 22.5 0 25 6 Q 27.5 0 30 6 Q 32.5 0 35 6 Q 37.5 0 40 6 Q 42.5 0 45 6 Q 47.5 0 50 6 Q 52.5 0 55 6 Q 57.5 0 60 6 Q 62.5 0 65 6 Q 67.5 0 70 6 Q 72.5 0 75 6 Q 77.5 0 80 6 Q 82.5 0 85 6 Q 87.5 0 90 6 Q 92.5 0 95 6 Q 97.5 0 100 6' fill='white'/%3E%3C/svg%3E\")"}}/>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:16,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:"#444"}}>Monthly Statement</div>
          <div style={{fontSize:32,fontWeight:800,marginTop:8}}>✂️ SubTrim</div>
          <div style={{fontSize:13,color:"#444",marginTop:4,fontFamily:"monospace"}}>— — — — — — — — — — — — — —</div>
        </div>
        <div style={{fontFamily:"'Inter',monospace"}}>
          {RECEIPT_ITEMS.map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px dashed #1a1a1a",position:"relative",animation:`dropIn 0.3s ease ${i*0.08}s both`}}>
              <span style={{fontSize:15,color:item.cut?"#555":"#ccc",textDecoration:item.cut?"line-through":"none"}}>{item.n}</span>
              <span style={{fontSize:15,fontWeight:600,fontVariantNumeric:"tabular-nums",color:item.cut?"#555":"#ccc",textDecoration:item.cut?"line-through":"none"}}>{fm(item.p)}</span>
              {item.cut&&<div style={{position:"absolute",top:"50%",left:0,height:2,background:"#ef4444",animation:`cutLine 0.4s ease ${0.8+i*0.08}s both`}}/>}
            </div>
          ))}
        </div>
        <div style={{fontFamily:"monospace",fontSize:13,color:"#444",textAlign:"center",margin:"16px 0",letterSpacing:2}}>— — — — — — — — — — — — — —</div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",animation:"fadeIn 0.5s ease 1.2s both"}}>
          <span style={{fontSize:14,color:MT}}>Subtotal</span>
          <span style={{fontSize:14,color:MT,textDecoration:"line-through"}}>{fm(total)}/mo</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",animation:"fadeIn 0.5s ease 1.4s both"}}>
          <span style={{fontSize:14,color:"#ef4444",fontWeight:600}}>✂️ SubTrim savings</span>
          <span style={{fontSize:14,color:"#ef4444",fontWeight:700}}>-{fm(saved)}/mo</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 4px",borderTop:"2px solid #222",animation:"fadeIn 0.5s ease 1.6s both"}}>
          <span style={{fontSize:20,fontWeight:800}}>New Total</span>
          <span style={{fontSize:20,fontWeight:800,color:G}}>{fm(total-saved)}/mo</span>
        </div>
        <div style={{textAlign:"right",fontSize:13,color:G,fontWeight:600,animation:"fadeIn 0.5s ease 1.8s both"}}>You save {fm(saved*12)}/year</div>
        {/* Torn bottom */}
        <div style={{position:"absolute",bottom:-1,left:0,right:0,height:6,background:BG,maskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 2.5 6 5 0 Q 7.5 6 10 0 Q 12.5 6 15 0 Q 17.5 6 20 0 Q 22.5 6 25 0 Q 27.5 6 30 0 Q 32.5 6 35 0 Q 37.5 6 40 0 Q 42.5 6 45 0 Q 47.5 6 50 0 Q 52.5 6 55 0 Q 57.5 6 60 0 Q 62.5 6 65 0 Q 67.5 6 70 0 Q 72.5 6 75 0 Q 77.5 6 80 0 Q 82.5 6 85 0 Q 87.5 6 90 0 Q 92.5 6 95 0 Q 97.5 6 100 0' fill='white'/%3E%3C/svg%3E\")",WebkitMaskImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 2.5 6 5 0 Q 7.5 6 10 0 Q 12.5 6 15 0 Q 17.5 6 20 0 Q 22.5 6 25 0 Q 27.5 6 30 0 Q 32.5 6 35 0 Q 37.5 6 40 0 Q 42.5 6 45 0 Q 47.5 6 50 0 Q 52.5 6 55 0 Q 57.5 6 60 0 Q 62.5 6 65 0 Q 67.5 6 70 0 Q 72.5 6 75 0 Q 77.5 6 80 0 Q 82.5 6 85 0 Q 87.5 6 90 0 Q 92.5 6 95 0 Q 97.5 6 100 0' fill='white'/%3E%3C/svg%3E\")"}}/>
      </div>
      <div style={{textAlign:"center",marginTop:32}}>
        <p style={{fontSize:18,color:MT,marginBottom:20,lineHeight:1.5}}>The average American wastes <strong style={{color:TX}}>{fm(saved*12)}/year</strong> on subscriptions they barely use.</p>
        <Link to="/app" style={{...B,background:G,color:"#000",fontSize:16,padding:"16px 36px",textDecoration:"none",display:"inline-block"}}>Find Your Savings — Free</Link>
        <p style={{fontSize:13,color:"#555",marginTop:14}}>No credit card. Takes 2 minutes.</p>
      </div>
    </section>

    {/* Features */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
        {[
          {e:"📊",t:"Usage Audit",d:"3 questions per subscription. Get instant keep, cancel, or downgrade recommendations based on how you actually use each service."},
          {e:"🔍",t:"Overlap Detector",d:"Flags when you're paying for multiple services that do the same thing — like two music streamers or three cloud storage plans."},
          {e:"💰",t:"Promo Aggregator",d:"Real-time deals and discounts for your subscriptions. Never miss a price drop or a better plan."},
          {e:"📅",t:"Renewal Calendar",d:"See every upcoming charge at a glance. No more surprise renewals."},
          {e:"🏠",t:"Household Sharing",d:"Track shared subscriptions with family or roommates. See who's paying for what."},
          {e:"📈",t:"SubScore",d:"One number (0-100) that tracks your subscription efficiency over time. Gamified optimization."},
        ].map((f,i)=>(
          <div key={i} style={{background:SF,borderRadius:16,padding:28}}>
            <div style={{fontSize:28,marginBottom:12}}>{f.e}</div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:8}}>{f.t}</div>
            <p style={{fontSize:14,color:MT,lineHeight:1.6,margin:0}}>{f.d}</p>
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section style={{background:SF,padding:"64px 24px"}}>
      <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{fontSize:28,fontWeight:800,marginBottom:40}}>How It Works</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32}}>
          {[
            {n:"1",t:"Add Your Subs",d:"Pick from 75+ known services or add custom ones."},
            {n:"2",t:"Run the Audit",d:"Answer 3 quick questions per subscription."},
            {n:"3",t:"Get Results",d:"See exactly what to keep, cancel, or downgrade — and how much you'll save."},
          ].map((s,i)=>(
            <div key={i}>
              <div style={{width:48,height:48,borderRadius:"50%",background:G+"22",color:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,margin:"0 auto 14px"}}>{s.n}</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{s.t}</div>
              <p style={{fontSize:13,color:MT,lineHeight:1.5,margin:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SEO links */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"64px 24px"}}>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Popular Cancellation Guides</h2>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["Netflix","Spotify","Hulu","Disney+","Adobe Creative Cloud","HBO Max","ChatGPT Plus","Xbox Game Pass","YouTube Premium","Apple TV+","Amazon Prime","Audible","Planet Fitness","SiriusXM","Grammarly","Canva Pro","DoorDash DashPass","New York Times","LinkedIn Premium","GitHub Copilot"].map(s=>(
          <Link key={s} to={`/guides/cancel/${s.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:`1px solid #222`}}>
            How to cancel {s}
          </Link>
        ))}
      </div>
      <div style={{marginTop:16}}><Link to="/guides" style={{color:G,fontSize:14,fontWeight:600,textDecoration:"none"}}>View all 50+ guides →</Link></div>
    </section>

    {/* Compare tool */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 40px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontSize:22,fontWeight:800,margin:0}}>Compare Services</h2>
        <Link to="/compare" style={{color:G,fontSize:14,fontWeight:600,textDecoration:"none"}}>Open compare tool →</Link>
      </div>
      <p style={{fontSize:14,color:MT,margin:"0 0 16px",lineHeight:1.5}}>Not sure which service to keep? Compare any two subscriptions side by side — plans, pricing, features, pros & cons.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[["Netflix","Hulu"],["Spotify","Apple Music"],["Disney+","HBO Max"],["ChatGPT Plus","Claude Pro"],["Xbox Game Pass","PlayStation Plus"],["Dropbox","Google One"],["Netflix","Disney+"],["Hulu","Paramount+"],["YouTube Music","Spotify"],["NordVPN","1Password"]].map(([a,b])=>{
          const slug=`${a.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-vs-${b.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
          return <Link key={slug} to={`/compare/${slug}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:`1px solid #222`}}>{a} vs {b}</Link>
        })}
      </div>
    </section>

    {/* Alternatives */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 40px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontSize:22,fontWeight:800,margin:0}}>Find Cheaper Alternatives</h2>
        <Link to="/alternatives" style={{color:G,fontSize:14,fontWeight:600,textDecoration:"none"}}>Browse all alternatives →</Link>
      </div>
      <p style={{fontSize:14,color:MT,margin:"0 0 16px",lineHeight:1.5}}>Paying too much for a service? See what else is out there — ranked by price, features, and our recommendations.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["Netflix","Spotify","ChatGPT Plus","Adobe Creative Cloud","Microsoft 365","Dropbox","NordVPN","Xbox Game Pass","Disney+"].map(s=>(
          <Link key={s} to={`/alternatives/${s.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:`1px solid #222`}}>
            {s} alternatives
          </Link>
        ))}
      </div>
    </section>

    {/* Contact */}
    <section id="contact" style={{background:SF,padding:"64px 24px"}}>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,marginBottom:8}}>💬</div>
          <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Get in Touch</h2>
          <p style={{fontSize:14,color:MT,margin:0,lineHeight:1.5}}>Questions, feedback, or just want to say hi? We'd love to hear from you.</p>
        </div>
        {cfStatus==='sent'?(
          <div style={{textAlign:"center",background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:32}}>
            <div style={{fontSize:32,marginBottom:12}}>✉️</div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Message Sent!</div>
            <p style={{fontSize:14,color:MT,margin:0}}>Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        ):(
          <form onSubmit={handleContact} style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:4}}>Name</div>
              <input value={cfName} onChange={e=>setCfName(e.target.value)} placeholder="Your name" maxLength={64} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid #222",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:4}}>Email</div>
              <input value={cfEmail} onChange={e=>setCfEmail(e.target.value)} placeholder="your@email.com" type="email" maxLength={64} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid #222",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:12,color:MT,fontWeight:600,marginBottom:4}}>Message</div>
              <textarea value={cfMsg} onChange={e=>setCfMsg(e.target.value)} placeholder="What's on your mind?" maxLength={1000} rows={4} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid #222",background:EL,color:TX,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",resize:"vertical"}}/>
            </div>
            {cfStatus&&cfStatus!=='sent'&&<div style={{fontSize:13,color:"#ef4444",textAlign:"center"}}>{cfStatus}</div>}
            <button type="submit" disabled={cfSending} style={{...B,background:G,color:"#000",padding:"14px",fontSize:15,borderRadius:10,width:"100%",opacity:cfSending?0.6:1}}>{cfSending?"Sending...":"Send Message"}</button>
          </form>
        )}
        <div style={{textAlign:"center",marginTop:16}}>
          <span style={{fontSize:12,color:"#444"}}>Or email us directly at </span>
          <a href="mailto:hello@subtrim.dev" style={{fontSize:12,color:G,textDecoration:"none",fontWeight:600}}>hello@subtrim.dev</a>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{borderTop:"1px solid #1a1a1a",padding:"32px 24px",textAlign:"center"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✂️ SubTrim</div>
      <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        <Link to="/guides" style={{color:MT,fontSize:12,textDecoration:"none"}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:12,textDecoration:"none"}}>Compare</Link>
        <Link to="/alternatives" style={{color:MT,fontSize:12,textDecoration:"none"}}>Alternatives</Link>
        <Link to="/calculator" style={{color:MT,fontSize:12,textDecoration:"none"}}>Calculator</Link>
        <a href="#contact" style={{color:MT,fontSize:12,textDecoration:"none"}}>Contact</a>
        <Link to="/app" style={{color:MT,fontSize:12,textDecoration:"none"}}>Sign Up</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
