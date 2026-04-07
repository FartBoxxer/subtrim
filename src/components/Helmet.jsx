import { useEffect } from 'react';

const DEFAULT_TITLE='SubTrim | Subscription Tracker & Optimizer';
const DEFAULT_DESC='SubTrim helps you track, audit, and optimize your subscriptions. Find overlaps, run usage audits, get keep/cancel/downgrade recommendations, and save hundreds per year.';

function setMeta(name,content,attr='name'){
  let el=document.querySelector(`meta[${attr}="${name}"]`);
  if(el)el.setAttribute('content',content);
}

export function Helmet({ title, description }){
  useEffect(()=>{
    if(title){
      document.title=title;
      setMeta('og:title',title,'property');
      setMeta('twitter:title',title,'name');
    }
    if(description){
      setMeta('description',description);
      setMeta('og:description',description,'property');
      setMeta('twitter:description',description,'name');
    }
    return()=>{
      document.title=DEFAULT_TITLE;
      setMeta('description',DEFAULT_DESC);
      setMeta('og:title','SubTrim | Track, Audit & Optimize Your Subscriptions','property');
      setMeta('og:description','Stop overpaying. SubTrim finds overlapping subscriptions, runs usage audits, and tells you exactly what to keep, cancel, or downgrade.','property');
      setMeta('twitter:title','SubTrim | Subscription Tracker & Optimizer','name');
      setMeta('twitter:description','Track, audit, and optimize your subscriptions. Find overlaps and save hundreds per year.','name');
    };
  },[title,description]);
  return null;
}

export function JsonLd({ data }){
  useEffect(()=>{
    const script=document.createElement('script');
    script.type='application/ld+json';
    script.textContent=JSON.stringify(data);
    script.setAttribute('data-jsonld','dynamic');
    document.head.appendChild(script);
    return()=>{script.remove()};
  },[data]);
  return null;
}
