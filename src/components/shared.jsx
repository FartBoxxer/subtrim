import { useState, useEffect, useMemo } from 'react';

// Avatar helper — renders a colored/gradient circle
function Av({bg,size=40,border}){
  return(<div style={{width:size,height:size,borderRadius:"50%",background:bg,flexShrink:0,border:border||"none"}}/>)
}

function Ring({s:sc,size=100,sw=8,c1="#00d48a",c2="#00b8d4",bg="#1a1a1a",tc="#fff"}){
  const[a,sA]=useState(0);const r=(size-sw)/2,ci=2*Math.PI*r;
  useEffect(()=>{let f,st;const run=t=>{if(!st)st=t;const p=Math.min((t-st)/1000,1);sA(Math.round((1-Math.pow(1-p,3))*sc));if(p<1)f=requestAnimationFrame(run)};f=requestAnimationFrame(run);return()=>cancelAnimationFrame(f)},[sc]);
  return(<div style={{position:"relative",width:size,height:size,flexShrink:0}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><defs><linearGradient id={`rg${size}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#rg${size})`} strokeWidth={sw} strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(a/100)*ci} style={{filter:`drop-shadow(0 0 5px ${c1}44)`}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:size*0.28,fontWeight:700,color:tc}}>{a}</span>
      {size>=80&&<span style={{fontSize:size>=120?11:9,color:"#888",fontWeight:500}}>SubScore</span>}
    </div>
  </div>)
}

function Confetti({on}){
  const particles=useMemo(()=>Array.from({length:40},(_,i)=>({left:`${Math.random()*100}%`,w:4+Math.random()*6,h:6+Math.random()*8,color:["#e74c3c","#f39c12","#2ecc71","#3498db","#9b59b6","#00d48a","#e91e63"][i%7],br:i%3?"2px":"50%",rot:`rotate(${Math.random()*360}deg)`,dur:`${1+Math.random()*1.5}s`,del:`${Math.random()*0.5}s`})),[on]);
  if(!on)return null;
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{particles.map((p,i)=><div key={i} style={{position:"absolute",left:p.left,top:-10,width:p.w,height:p.h,background:p.color,borderRadius:p.br,transform:p.rot,animation:`cF ${p.dur} ease-in ${p.del} forwards`}}/>)}</div>)
}

export { Ring, Confetti, Av };
