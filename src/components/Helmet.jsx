import { useEffect, createContext, useContext } from 'react';

const DEFAULT_TITLE='SubTrim | Subscription Tracker & Optimizer';
const DEFAULT_DESC='The average person wastes $50-100/mo on subscriptions they barely use. SubTrim audits everything you pay for and tells you exactly what to keep, cancel, or downgrade — free.';

// SSR head context — used during prerendering to collect meta tags
export const HeadContext = createContext(null);

function setMeta(name,content,attr='name'){
  let el=document.querySelector(`meta[${attr}="${name}"]`);
  if(el)el.setAttribute('content',content);
}

export function Helmet({ title, description, canonical, noindex }){
  // SSR path: collect head data into context instead of manipulating DOM
  const headCtx = useContext(HeadContext);

  // CSR path: manipulate DOM via useEffect
  // NOTE: useEffect is a no-op during SSR (renderToString ignores it),
  // so this hook is safe to call unconditionally.
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
    if(canonical){
      const link=document.querySelector("link[rel='canonical']");
      if(link)link.setAttribute('href',canonical);
      setMeta('og:url',canonical,'property');
    }
    if(noindex){
      let el=document.querySelector('meta[name="robots"]');
      if(!el){el=document.createElement('meta');el.setAttribute('name','robots');document.head.appendChild(el)}
      el.setAttribute('content','noindex, nofollow');
    }
    return()=>{
      document.title=DEFAULT_TITLE;
      setMeta('description',DEFAULT_DESC);
      setMeta('og:title','SubTrim | Track, Audit & Optimize Your Subscriptions','property');
      setMeta('og:description','Stop overpaying. SubTrim finds overlapping subscriptions, runs usage audits, and tells you exactly what to keep, cancel, or downgrade.','property');
      setMeta('twitter:title','SubTrim | Subscription Tracker & Optimizer','name');
      setMeta('twitter:description','Track, audit, and optimize your subscriptions. Find overlaps and save hundreds per year.','name');
      const link=document.querySelector("link[rel='canonical']");
      if(link)link.setAttribute('href','https://subtrim.dev');
      setMeta('og:url','https://subtrim.dev','property');
      const robots=document.querySelector('meta[name="robots"]');
      if(robots)robots.remove();
    };
  },[title,description,canonical,noindex]);

  // During SSR, collect head data for injection into the HTML template
  if(headCtx){
    if(title) headCtx.title = title;
    if(description) headCtx.description = description;
    if(canonical) headCtx.canonical = canonical;
    if(noindex) headCtx.noindex = true;
  }

  return null;
}

export function JsonLd({ data }){
  const headCtx = useContext(HeadContext);

  // CSR path: inject script tag (no-op during SSR)
  useEffect(()=>{
    const script=document.createElement('script');
    script.type='application/ld+json';
    script.textContent=JSON.stringify(data);
    script.setAttribute('data-jsonld','dynamic');
    document.head.appendChild(script);
    return()=>{script.remove()};
  },[data]);

  // During SSR, collect JSON-LD for injection into the HTML template
  if(headCtx){
    if(!headCtx.jsonLd) headCtx.jsonLd = [];
    headCtx.jsonLd.push(data);
  }

  return null;
}
