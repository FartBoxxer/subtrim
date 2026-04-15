import { useMemo } from 'react';

function Av({bg,size=40,border}){
  return(<div style={{width:size,height:size,borderRadius:"50%",background:bg,flexShrink:0,border:border||"none"}}/>)
}

function Confetti({on}){
  const particles=useMemo(()=>Array.from({length:40},(_,i)=>({left:`${Math.random()*100}%`,w:4+Math.random()*6,h:6+Math.random()*8,color:["#e74c3c","#f39c12","#2ecc71","#3498db","#9b59b6","#00d48a","#e91e63"][i%7],br:i%3?"2px":"50%",rot:`rotate(${Math.random()*360}deg)`,dur:`${1+Math.random()*1.5}s`,del:`${Math.random()*0.5}s`})),[on]);
  if(!on)return null;
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{particles.map((p,i)=><div key={i} style={{position:"absolute",left:p.left,top:-10,width:p.w,height:p.h,background:p.color,borderRadius:p.br,transform:p.rot,animation:`cF ${p.dur} ease-in ${p.del} forwards`}}/>)}</div>)
}

export { Confetti, Av };
