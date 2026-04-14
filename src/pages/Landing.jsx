import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

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
  const glowRef=useRef(null);
  useEffect(()=>{
    if(window.matchMedia('(hover:none)').matches)return;
    const move=e=>{if(glowRef.current)glowRef.current.style.transform=`translate(${e.clientX-120}px,${e.clientY-120}px)`};
    window.addEventListener('mousemove',move);
    return()=>window.removeEventListener('mousemove',move);
  },[]);
  const[cfName,setCfName]=useState('');
  const[cfEmail,setCfEmail]=useState('');
  const[cfMsg,setCfMsg]=useState('');
  const[cfStatus,setCfStatus]=useState('');
  const[cfSending,setCfSending]=useState(false);
  const[showSavings,setShowSavings]=useState(false);
  const[menuOpen,setMenuOpen]=useState(false);
  const receiptRef=useRef(null);
  const[shareImg,setShareImg]=useState(null);
  const shareReceipt=async()=>{if(!receiptRef.current)return;try{const{default:html2canvas}=await import('html2canvas');const canvas=await html2canvas(receiptRef.current,{backgroundColor:'#0d0d0d',scale:2,useCORS:true});setShareImg(canvas.toDataURL('image/png'))}catch{}};
  const downloadShareImg=()=>{if(!shareImg)return;const a=document.createElement('a');a.href=shareImg;a.download='subtrim-statement.png';document.body.appendChild(a);a.click();document.body.removeChild(a)};

  const total=RECEIPT_ITEMS.reduce((a,i)=>a+i.p,0);
  const saved=RECEIPT_ITEMS.filter(i=>i.cut).reduce((a,i)=>a+i.p,0);
  const[subCount,setSubCount]=useState(null);
  const[userCount,setUserCount]=useState(null);
  const[auditCount,setAuditCount]=useState(null);
  const INFLATE={users:0,subs:0,audits:0};
  const[waitEmail,setWaitEmail]=useState('');
  const[waitStatus,setWaitStatus]=useState('');
  useEffect(()=>{
    try{
      const url=import.meta.env.VITE_SUPABASE_URL;
      const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if(!url||!key)return;
      const sb=createClient(url,key);
      sb.from('subscriptions').select('id',{count:'exact',head:true}).then(({count})=>{if(count!=null)setSubCount(count)});
      sb.from('profiles').select('id',{count:'exact',head:true}).then(({count})=>{if(count!=null)setUserCount(count)});
      sb.from('usage_surveys').select('id',{count:'exact',head:true}).then(({count})=>{if(count!=null)setAuditCount(count)});
    }catch{}
  },[]);

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
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",position:"relative"}}>
    <div ref={glowRef} aria-hidden="true" style={{position:"fixed",top:0,left:0,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,212,138,0.14) 0%, rgba(0,212,138,0.05) 40%, transparent 70%)",pointerEvents:"none",zIndex:1,transition:"transform 0.12s cubic-bezier(0.2,0.8,0.2,1)",willChange:"transform",mixBlendMode:"screen"}}/>
    <style>{`@keyframes cutLine{from{width:0}to{width:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.lp-cta{box-shadow:0 4px 14px rgba(0,212,138,0.28);transition:transform 0.15s ease,box-shadow 0.15s ease}.lp-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,212,138,0.4)}.lp-cta:active{transform:translateY(0)}.lp-marquee{display:flex;width:max-content;animation:marquee 40s linear infinite}.lp-marquee:hover{animation-play-state:paused}.lp-marquee-mask{mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}@media(max-width:600px){.lp-nav-links{display:none!important}.lp-hamburger{display:flex!important}}@media(min-width:601px){.lp-mobile-menu{display:none!important}}`}</style>
    {/* Nav */}
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px clamp(16px,4vw,32px)",maxWidth:1100,margin:"0 auto",position:"relative"}}>
      <Link to="/" style={{fontSize:22,fontWeight:800,letterSpacing:"-0.5px",color:TX,textDecoration:"none",flexShrink:0}}>✂️ SubTrim</Link>
      <div className="lp-nav-links" style={{display:"flex",gap:24,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500,whiteSpace:"nowrap"}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500,whiteSpace:"nowrap"}}>Compare</Link>
        <Link to="/alternatives" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500,whiteSpace:"nowrap"}}>Alternatives</Link>
        <Link to="/demo" style={{color:TX,fontSize:14,textDecoration:"none",fontWeight:600,whiteSpace:"nowrap"}}>Try Demo</Link>
        <Link to="/app" style={{...B,background:G,color:"#000",padding:"10px 24px",fontSize:14,textDecoration:"none",whiteSpace:"nowrap",borderRadius:10}}>Sign Up</Link>
      </div>
      <button className="lp-hamburger" onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",alignItems:"center",justifyContent:"center",background:"none",border:"none",color:TX,fontSize:24,cursor:"pointer",padding:4}}>
        {menuOpen?"✕":"☰"}
      </button>
    </nav>
    {menuOpen&&<div className="lp-mobile-menu" style={{background:SF,borderBottom:"1px solid #1a1a1a",padding:"12px 24px",display:"flex",flexDirection:"column",gap:12}}>
      <Link to="/guides" onClick={()=>setMenuOpen(false)} style={{color:MT,fontSize:15,textDecoration:"none",fontWeight:500,padding:"8px 0"}}>Guides</Link>
      <Link to="/compare" onClick={()=>setMenuOpen(false)} style={{color:MT,fontSize:15,textDecoration:"none",fontWeight:500,padding:"8px 0"}}>Compare</Link>
      <Link to="/alternatives" onClick={()=>setMenuOpen(false)} style={{color:MT,fontSize:15,textDecoration:"none",fontWeight:500,padding:"8px 0"}}>Alternatives</Link>
      <Link to="/demo" onClick={()=>setMenuOpen(false)} style={{color:TX,fontSize:15,textDecoration:"none",fontWeight:600,padding:"8px 0"}}>Try Demo</Link>
      <Link to="/app" onClick={()=>setMenuOpen(false)} style={{...B,background:G,color:"#000",padding:"12px 24px",fontSize:15,textDecoration:"none",textAlign:"center",borderRadius:10}}>Sign Up</Link>
    </div>}

    {/* Hero — Receipt */}
    <section style={{padding:"60px 24px 40px",maxWidth:520,margin:"0 auto"}}>
      <div ref={receiptRef} style={{background:"#0f0f0f",border:"1px solid #1a1a1a",borderRadius:2,padding:"40px clamp(16px,5vw,36px)",position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
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
        <div style={{position:"relative",animation:"fadeIn 0.5s ease 1.4s both"}} onMouseEnter={()=>setShowSavings(true)} onMouseLeave={()=>setShowSavings(false)} onClick={()=>setShowSavings(prev=>!prev)}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",cursor:"pointer"}}>
            <span style={{fontSize:14,color:"#ef4444",fontWeight:600}}>✂️ SubTrim savings</span>
            <span style={{fontSize:14,color:"#ef4444",fontWeight:700}}>-{fm(saved)}/mo</span>
          </div>
          {showSavings&&<div style={{position:"absolute",left:0,right:0,top:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:10,padding:"12px 16px",zIndex:10,animation:"fadeIn 0.15s ease"}}>
            <div style={{fontSize:11,color:MT,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Savings breakdown</div>
            {RECEIPT_ITEMS.filter(i=>i.cut).map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
                <span style={{color:"#ccc"}}>{item.n}</span>
                <span style={{color:"#ef4444",fontWeight:600}}>-{fm(item.p)}</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid #333",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700}}>
              <span style={{color:"#ccc"}}>Total saved</span>
              <span style={{color:"#ef4444"}}>{fm(saved)}/mo ({fm(saved*12)}/yr)</span>
            </div>
          </div>}
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
        <Link to="/demo" className="lp-cta" style={{...B,background:G,color:"#000",fontSize:16,padding:"16px 36px",textDecoration:"none",display:"inline-block"}}>Try the Audit (Free)</Link>
        <p style={{fontSize:13,color:"#555",marginTop:14}}>No signup. Takes 2 minutes.</p>
        <p style={{fontSize:13,color:MT,marginTop:6}}>Already convinced? <Link to="/app" style={{color:G,textDecoration:"none",fontWeight:600}}>Create a free account →</Link></p>
      </div>
    </section>

    {/* Brand marquee */}
    <section style={{padding:"20px 0 32px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",fontSize:12,color:"#555",textTransform:"uppercase",letterSpacing:2,marginBottom:20,fontWeight:600}}>Tracks every subscription you've got</div>
      </div>
      <div className="lp-marquee-mask" style={{overflow:"hidden"}}>
        <div className="lp-marquee">
          {[...Array(2)].map((_,dup)=>(
            <div key={dup} style={{display:"flex",gap:56,alignItems:"center",padding:"0 28px",flexShrink:0}}>
              {[
                {s:'netflix',n:'Netflix'},{s:'spotify',n:'Spotify'},{s:'hulu',n:'Hulu'},
                {s:'amazonprimevideo',n:'Prime Video'},{s:'youtube',n:'YouTube'},{s:'adobe',n:'Adobe'},
                {s:'openai',n:'ChatGPT'},{s:'notion',n:'Notion'},{s:'dropbox',n:'Dropbox'},
                {s:'nordvpn',n:'NordVPN'},{s:'1password',n:'1Password'},{s:'crunchyroll',n:'Crunchyroll'},
                {s:'playstation',n:'PlayStation'},{s:'apple',n:'Apple'},{s:'hbo',n:'HBO Max'},
              ].map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,opacity:0.45,flexShrink:0}}>
                  <img src={`https://cdn.simpleicons.org/${b.s}/ffffff`} alt={b.n} width={24} height={24} loading="lazy" style={{filter:"grayscale(1)"}}/>
                  <span style={{fontSize:15,color:"#888",fontWeight:600,whiteSpace:"nowrap"}}>{b.n}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Social proof */}
    {(subCount>0||userCount>0||auditCount>0||INFLATE.users>0)&&(
      <section style={{padding:"0 24px 32px"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
          {(userCount||0)+INFLATE.users>0&&<div style={{display:"flex",alignItems:"center",gap:8,background:SF,borderRadius:40,padding:"10px 22px",border:"1px solid #1a1a1a"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:G,animation:"pulse 2s ease-in-out infinite"}}/>
            <span style={{fontSize:14,color:MT}}><strong style={{color:TX}}>{((userCount||0)+INFLATE.users).toLocaleString()}</strong> users</span>
          </div>}
          {(subCount||0)+INFLATE.subs>0&&<div style={{display:"flex",alignItems:"center",gap:8,background:SF,borderRadius:40,padding:"10px 22px",border:"1px solid #1a1a1a"}}>
            <span style={{fontSize:14,color:MT}}><strong style={{color:TX}}>{((subCount||0)+INFLATE.subs).toLocaleString()}</strong> subs tracked</span>
          </div>}
          {(auditCount||0)+INFLATE.audits>0&&<div style={{display:"flex",alignItems:"center",gap:8,background:SF,borderRadius:40,padding:"10px 22px",border:"1px solid #1a1a1a"}}>
            <span style={{fontSize:14,color:MT}}><strong style={{color:TX}}>{((auditCount||0)+INFLATE.audits).toLocaleString()}</strong> audits run</span>
          </div>}
        </div>
      </section>
    )}

    {/* Features */}
    <section style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
        {[
          {e:"📊",t:"Usage Audit",d:"Answer 3 quick questions per sub and we'll tell you what to keep, cancel, or downgrade. No guesswork."},
          {e:"🔍",t:"Overlap Detector",d:"Paying for two music streamers? Three cloud storage plans? We'll catch it."},
          {e:"💰",t:"Promo Aggregator",d:"Active deals and discounts for stuff you already pay for. We pull them so you don't have to Google it."},
          {e:"📅",t:"Renewal Calendar",d:"See what's charging you next and when. No more \"wait, when did I get billed for that?\""},
          {e:"🏠",t:"Household Sharing",d:"Split tracking with roommates or family. See who's paying for what across the house."},
          {e:"📈",t:"SubScore",d:"A single 0–100 score for how well you're managing your subs. Basically a credit score, but for subscriptions."},
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
            {n:"1",t:"Add Your Subs",d:"Pick from 75+ services or add your own. Takes about a minute."},
            {n:"2",t:"Run the Audit",d:"3 questions per sub. How often do you use it? Would you miss it? That kind of thing."},
            {n:"3",t:"See What to Cut",d:"We crunch the numbers and tell you what's worth keeping and what's dead weight."},
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

    {/* Why SubTrim */}
    <section style={{maxWidth:800,margin:"0 auto",padding:"64px 24px"}}>
      <h2 style={{fontSize:24,fontWeight:800,textAlign:"center",marginBottom:32}}>Why SubTrim?</h2>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {[
          {q:"Don't apps like Rocket Money already do this?",a:"Rocket Money tells you what you're subscribed to. Cool. SubTrim tells you which ones are actually worth keeping, based on how much you use them, not just that they exist."},
          {q:"Is this actually free?",a:"Yep. Fully free. We don't take a cut of your savings, there's no premium tier, and we're not going to upsell you on anything."},
          {q:"How is this different from a spreadsheet?",a:"Your spreadsheet doesn't know you're paying for Spotify AND Apple Music. It can't tell you that you haven't opened Hulu in 3 months. SubTrim can, and it takes about 3 minutes to set up."},
        ].map((item,i)=>(
          <div key={i} style={{background:SF,borderRadius:14,padding:"24px 28px"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:8,color:TX}}>{item.q}</div>
            <p style={{fontSize:14,color:MT,lineHeight:1.6,margin:0}}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA + Demo */}
    <section style={{padding:"64px 24px",textAlign:"center"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <h2 style={{fontSize:28,fontWeight:800,lineHeight:1.3,marginBottom:12}}>You're probably paying for something you don't use</h2>
        <p style={{fontSize:16,color:MT,lineHeight:1.6,marginBottom:28}}>Most people are. SubTrim finds it in about 3 minutes.</p>
        <Link to="/app" className="lp-cta" style={{...B,background:G,color:"#000",fontSize:16,padding:"16px 40px",textDecoration:"none",display:"inline-block",borderRadius:12}}>Get Started (It's Free)</Link>
        <div style={{marginTop:16}}>
          <Link to="/demo" style={{fontSize:14,color:MT,textDecoration:"none",fontWeight:500}}>or <span style={{color:G,textDecoration:"underline"}}>try the demo first</span></Link>
        </div>
      </div>
    </section>

    {/* Founder + Email capture */}
    <section style={{padding:"48px 24px"}}>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{background:SF,borderRadius:16,padding:"28px 32px",border:"1px solid #1a1a1a",marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Who built this?</div>
          <p style={{fontSize:14,color:MT,lineHeight:1.7,margin:0}}>Hey, I'm just a programmer who had over 10 subscriptions but only actually used about half of them. I wanted to make the process of trimming them down a bit easier to visualize, so I built SubTrim. If you're in the same boat, I think you'll like it.</p>
        </div>
        <div style={{textAlign:"center"}}>
          <p style={{fontSize:13,color:MT,marginBottom:12}}>Get notified when we launch new features. No spam.</p>
          {waitStatus==='sent'?<div style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:10,padding:"12px 20px",fontSize:13,color:G,fontWeight:600}}>You're on the list.</div>:(
            <form onSubmit={async e=>{e.preventDefault();const trimmed=waitEmail.trim();if(!trimmed||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)){setWaitStatus('Enter a valid email');return}setWaitStatus('sending');try{const url=import.meta.env.VITE_SUPABASE_URL;const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error('no config');const sb=createClient(url,key);const{error}=await sb.from('waitlist').insert({email:trimmed.toLowerCase()});if(error&&error.code!=='23505')throw error;setWaitStatus('sent');setWaitEmail('')}catch{setWaitStatus('Something went wrong. Try again.')}}} style={{display:"flex",gap:8,maxWidth:400,margin:"0 auto"}}>
              <input value={waitEmail} onChange={e=>setWaitEmail(e.target.value)} placeholder="your@email.com" type="email" style={{flex:1,padding:"12px 14px",borderRadius:10,border:"1px solid #222",background:EL,color:TX,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <button type="submit" disabled={waitStatus==='sending'} style={{...B,background:G,color:"#000",padding:"12px 20px",fontSize:13,borderRadius:10,whiteSpace:"nowrap",opacity:waitStatus==='sending'?0.6:1}}>{waitStatus==='sending'?'...':'Notify Me'}</button>
            </form>
          )}
          {waitStatus&&waitStatus!=='sent'&&waitStatus!=='sending'&&<div style={{fontSize:12,color:"#ef4444",marginTop:8}}>{waitStatus}</div>}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section id="contact" style={{background:SF,padding:"64px 24px"}}>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,marginBottom:8}}>💬</div>
          <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Say Hi</h2>
          <p style={{fontSize:14,color:MT,margin:0,lineHeight:1.5}}>Bug report, feature idea, or just want to chat. We read everything.</p>
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

    {/* Share image modal */}
    {shareImg&&<div onClick={()=>setShareImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:480,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        <img src={shareImg} alt="SubTrim Statement" style={{width:"100%",borderRadius:8,border:"1px solid #333"}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={downloadShareImg} style={{...B,background:G,color:"#000",fontSize:14,padding:"12px 28px",borderRadius:10}}>Download Image</button>
          <button onClick={()=>setShareImg(null)} style={{...B,background:SF,color:MT,fontSize:14,padding:"12px 28px",borderRadius:10,border:"1px solid #333"}}>Close</button>
        </div>
        <p style={{fontSize:12,color:"#555",margin:0}}>Long-press or right-click the image to save or share</p>
      </div>
    </div>}

    {/* Footer */}
    <footer style={{borderTop:"1px solid #1a1a1a",padding:"32px 24px",textAlign:"center"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✂️ SubTrim</div>
      <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        <Link to="/guides" style={{color:MT,fontSize:12,textDecoration:"none"}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:12,textDecoration:"none"}}>Compare</Link>
        <Link to="/alternatives" style={{color:MT,fontSize:12,textDecoration:"none"}}>Alternatives</Link>
        <Link to="/blog" style={{color:MT,fontSize:12,textDecoration:"none"}}>Blog</Link>
        <a href="#contact" style={{color:MT,fontSize:12,textDecoration:"none"}}>Contact</a>
        <Link to="/app" style={{color:MT,fontSize:12,textDecoration:"none"}}>Sign Up</Link>
      </div>
      <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        <Link to="/privacy" style={{color:"#444",fontSize:11,textDecoration:"none"}}>Privacy Policy</Link>
        <Link to="/terms" style={{color:"#444",fontSize:11,textDecoration:"none"}}>Terms of Service</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>© {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
