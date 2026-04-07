import { useEffect } from 'react';

export function Helmet({ title, description }){
  useEffect(()=>{
    if(title) document.title=title;
    if(description){
      let meta=document.querySelector('meta[name="description"]');
      if(meta) meta.setAttribute('content',description);
    }
    return()=>{
      document.title='SubTrim — Subscription Tracker & Optimizer | Cut Costs, Keep What Matters';
      const meta=document.querySelector('meta[name="description"]');
      if(meta) meta.setAttribute('content','SubTrim helps you track, audit, and optimize your subscriptions. Find overlaps, run usage audits, get keep/cancel/downgrade recommendations, and save hundreds per year.');
    };
  },[title,description]);
  return null;
}
