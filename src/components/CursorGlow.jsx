import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function CursorGlow(){
  const glowRef=useRef(null);
  const {pathname}=useLocation();
  const disabled=pathname.startsWith('/app');

  useEffect(()=>{
    if(disabled)return;
    const move=e=>{if(glowRef.current)glowRef.current.style.transform=`translate(${e.clientX-55}px,${e.clientY-55}px)`};
    window.addEventListener('pointermove',move,{passive:true});
    return()=>window.removeEventListener('pointermove',move);
  },[disabled]);

  if(disabled)return null;

  return(
    <div ref={glowRef} aria-hidden="true" style={{position:"fixed",top:0,left:0,width:110,height:110,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,212,138,0.07) 0%, rgba(0,212,138,0.02) 45%, transparent 70%)",pointerEvents:"none",zIndex:1,transition:"transform 0.12s cubic-bezier(0.2,0.8,0.2,1)",willChange:"transform",mixBlendMode:"screen"}}/>
  );
}
