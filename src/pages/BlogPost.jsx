import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet, JsonLd } from '../components/Helmet';
import { BLOG_POSTS, AUTHORS } from '../data/blogPosts';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';

function renderBlock(block,i){
  if(block.type==='p') return <p key={i} style={{fontSize:16,color:"#ccc",lineHeight:1.7,margin:"0 0 18px"}}>{block.text}</p>;
  if(block.type==='h2') return <h2 key={i} style={{fontSize:22,fontWeight:700,margin:"32px 0 12px",color:TX}}>{block.text}</h2>;
  if(block.type==='list') return(
    <ul key={i} style={{margin:"0 0 18px",paddingLeft:24}}>
      {block.items.map((item,j)=><li key={j} style={{fontSize:15,color:"#ccc",lineHeight:1.7,marginBottom:6}}>{item}</li>)}
    </ul>
  );
  if(block.type==='cta') return(
    <div key={i} style={{background:G+"11",border:`1px solid ${G}33`,borderRadius:14,padding:"24px 28px",margin:"28px 0",textAlign:"center"}}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Ready to audit your subscriptions?</div>
      <p style={{fontSize:14,color:MT,margin:"0 0 16px",lineHeight:1.5}}>SubTrim tells you exactly what to keep, cancel, or downgrade. Takes about 3 minutes.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <Link to="/demo" style={{background:EL,color:TX,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:600,textDecoration:"none",fontFamily:"inherit"}}>Try Demo</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Start Free Audit</Link>
      </div>
    </div>
  );
  return null;
}

export default function BlogPost(){
  const{slug}=useParams();
  const post=BLOG_POSTS.find(p=>p.slug===slug);

  if(!post) return <Navigate to="/blog" replace />;

  const CAT_COLORS={data:"#3498db",tips:"#f59e0b",compare:"#a855f7"};
  const cc=CAT_COLORS[post.category]||MT;

  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title={`${post.title} | SubTrim`}
      description={post.description}
      canonical={`https://subtrim.dev/blog/${post.slug}`}
    />
    <JsonLd data={{
      "@context":"https://schema.org","@type":"BlogPosting",
      headline:post.title,
      description:post.description,
      datePublished:post.date,
      dateModified:post.date,
      author:post.author&&AUTHORS[post.author]?{"@type":"Person",name:AUTHORS[post.author].name,jobTitle:AUTHORS[post.author].title}:{"@type":"Organization",name:"SubTrim"},
      publisher:{"@type":"Organization",name:"SubTrim",logo:{"@type":"ImageObject",url:"https://subtrim.dev/icon-512.png"}},
      mainEntityOfPage:{"@type":"WebPage","@id":`https://subtrim.dev/blog/${post.slug}`},
      image:"https://subtrim.dev/og.png",
      articleSection:post.category
    }}/>

    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/blog" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Blog</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
      </div>
    </nav>

    <article style={{maxWidth:680,margin:"0 auto",padding:"40px 20px 80px"}}>
      <Link to="/blog" style={{fontSize:13,color:MT,textDecoration:"none",fontWeight:500,display:"inline-block",marginBottom:20}}>← All posts</Link>

      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:11,fontWeight:700,color:cc,background:cc+"18",padding:"3px 10px",borderRadius:6,textTransform:"uppercase",letterSpacing:0.5}}>{post.category}</span>
        <span style={{fontSize:12,color:MT}}>{post.readTime}</span>
        <span style={{fontSize:12,color:"#444"}}>{post.date}</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,margin:"0 0 12px",lineHeight:1.25}}>{post.title}</h1>
      {post.author&&AUTHORS[post.author]&&(
        <div style={{fontSize:13,color:MT,marginBottom:28}}>By <span style={{color:"#ccc",fontWeight:500}}>{AUTHORS[post.author].name}</span> · {AUTHORS[post.author].title}</div>
      )}

      {post.content.map((block,i)=>renderBlock(block,i))}
    </article>

    <footer style={{borderTop:"1px solid #1a1a1a",padding:"32px 24px",textAlign:"center"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✂️ SubTrim</div>
      <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        <Link to="/guides" style={{color:MT,fontSize:12,textDecoration:"none"}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:12,textDecoration:"none"}}>Compare</Link>
        <Link to="/alternatives" style={{color:MT,fontSize:12,textDecoration:"none"}}>Alternatives</Link>
        <Link to="/calculator" style={{color:MT,fontSize:12,textDecoration:"none"}}>Calculator</Link>
        <Link to="/blog" style={{color:G,fontSize:12,textDecoration:"none",fontWeight:600}}>Blog</Link>
        <Link to="/terms" style={{color:MT,fontSize:12,textDecoration:"none"}}>Terms</Link>
        <Link to="/privacy" style={{color:MT,fontSize:12,textDecoration:"none"}}>Privacy</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>&copy; {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
