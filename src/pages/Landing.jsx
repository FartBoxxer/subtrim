import { useState } from 'react';
import { Link } from 'react-router-dom';

const G='#00d48a',BG='#0d0d0d',SF='#141414',EL='#1f1f1f',MT='#888',TX='#fff';
const B={border:"none",borderRadius:10,padding:"14px 28px",cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:"inherit",transition:"all 0.15s"};

export default function Landing(){
  const[showBanner,setShowBanner]=useState(true);
  const[cfName,setCfName]=useState('');
  const[cfEmail,setCfEmail]=useState('');
  const[cfMsg,setCfMsg]=useState('');
  const[cfStatus,setCfStatus]=useState('');
  const[cfSending,setCfSending]=useState(false);

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
      <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px"}}>✂️ SubTrim</div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/calculator" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Calculator</Link>
        <Link to="/app" style={{...B,background:G,color:"#000",padding:"10px 22px",fontSize:14,textDecoration:"none"}}>Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section style={{textAlign:"center",padding:"80px 24px 60px",maxWidth:720,margin:"0 auto"}}>
      <div style={{fontSize:52,marginBottom:16}}>✂️</div>
      <h1 style={{fontSize:42,fontWeight:800,lineHeight:1.15,margin:"0 0 20px",letterSpacing:"-1px"}}>Stop Overpaying for<br/><span style={{color:G}}>Subscriptions</span></h1>
      <p style={{fontSize:18,color:MT,lineHeight:1.6,maxWidth:540,margin:"0 auto 36px"}}>SubTrim tracks every subscription, audits your usage, finds overlaps, and tells you exactly what to keep, cancel, or downgrade.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Link to="/app" style={{...B,background:G,color:"#000",fontSize:16,padding:"16px 36px",textDecoration:"none"}}>Start Free — No Card Required</Link>
      </div>
      <p style={{fontSize:13,color:"#555",marginTop:14}}>Free forever. Your data stays yours.</p>
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
          <Link key={s} to={`/guides/cancel-${s.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:`1px solid #222`}}>
            How to cancel {s}
          </Link>
        ))}
      </div>
    </section>

    {/* Popular comparisons */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 64px"}}>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Compare Services</h2>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[["Netflix","Hulu"],["Spotify","Apple Music"],["Disney+","HBO Max"],["ChatGPT Plus","Claude Pro"],["Xbox Game Pass","PlayStation Plus"],["Dropbox","Google One"]].map(([a,b])=>{
          const slug=`${a.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-vs-${b.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
          return <Link key={slug} to={`/compare/${slug}`} style={{background:SF,borderRadius:8,padding:"10px 16px",fontSize:13,color:MT,textDecoration:"none",fontWeight:500,border:`1px solid #222`}}>{a} vs {b}</Link>
        })}
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
        <Link to="/calculator" style={{color:MT,fontSize:12,textDecoration:"none"}}>Calculator</Link>
        <a href="#contact" style={{color:MT,fontSize:12,textDecoration:"none"}}>Contact</a>
        <Link to="/app" style={{color:MT,fontSize:12,textDecoration:"none"}}>Sign Up</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
