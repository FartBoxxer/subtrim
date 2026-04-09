import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';
import { BLOG_POSTS, AUTHORS } from '../data/blogPosts';

const BG='#0d0d0d',SF='#141414',EL='#1f1f1f',G='#00d48a',MT='#888',TX='#fff';

const CAT_COLORS={data:"#3498db",tips:"#f59e0b",compare:"#a855f7"};

export default function Blog(){
  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="SubTrim Blog | Subscription Tips, Comparisons & Data"
      description="Practical advice on managing subscriptions, cutting costs, and choosing the right services. No fluff."
      canonical="https://subtrim.dev/blog"
    />

    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Compare</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
      </div>
    </nav>

    <div style={{maxWidth:720,margin:"0 auto",padding:"40px 20px 80px"}}>
      <h1 style={{fontSize:32,fontWeight:800,marginBottom:8}}>Blog</h1>
      <p style={{fontSize:16,color:MT,marginBottom:36,lineHeight:1.5}}>Subscription tips, comparisons, and data. Updated regularly.</p>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {BLOG_POSTS.map(post=>{
          const cc=CAT_COLORS[post.category]||MT;
          return(
          <Link key={post.slug} to={`/blog/${post.slug}`} style={{textDecoration:"none",color:"inherit"}}>
            <article style={{background:SF,borderRadius:14,padding:"24px 28px",transition:"all 0.15s",border:`1px solid transparent`}} onMouseEnter={e=>e.currentTarget.style.borderColor=EL} onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,color:cc,background:cc+"18",padding:"3px 10px",borderRadius:6,textTransform:"uppercase",letterSpacing:0.5}}>{post.category}</span>
                <span style={{fontSize:12,color:MT}}>{post.readTime}</span>
                <span style={{fontSize:12,color:"#444"}}>{post.date}</span>
              </div>
              <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 8px",lineHeight:1.3}}>{post.title}</h2>
              <p style={{fontSize:14,color:MT,margin:"0 0 6px",lineHeight:1.5}}>{post.description}</p>
              {post.author&&AUTHORS[post.author]&&<div style={{fontSize:12,color:"#555"}}>By {AUTHORS[post.author].name}</div>}
            </article>
          </Link>
        )})}
      </div>
    </div>

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
