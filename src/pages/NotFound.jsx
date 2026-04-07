import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',G='#00d48a',MT='#888',TX='#fff';

export default function NotFound(){
  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
    <Helmet
      title="Page Not Found | SubTrim"
      description="This page doesn't exist. Head back to SubTrim to audit your subscriptions and find savings."
    />

    {/* Nav */}
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Compare</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
      </div>
    </nav>

    {/* Content */}
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{fontSize:80,marginBottom:16,lineHeight:1}} aria-hidden="true">✂️</div>
        <div style={{fontSize:14,fontWeight:700,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>404</div>
        <h1 style={{fontSize:32,fontWeight:800,margin:"0 0 12px",lineHeight:1.2}}>Page Not Found</h1>
        <p style={{fontSize:16,color:MT,margin:"0 0 36px",lineHeight:1.6}}>
          Looks like this page got cancelled. It either doesn't exist or it moved somewhere else.
        </p>

        <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
          <Link to="/" style={{
            display:"inline-block",background:G,color:"#000",border:"none",borderRadius:10,
            padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",fontFamily:"inherit",
            width:"100%",maxWidth:280,textAlign:"center",boxSizing:"border-box"
          }}>
            ← Back to SubTrim
          </Link>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
            <Link to="/app" style={{color:G,fontSize:14,textDecoration:"none",fontWeight:600}}>Try the App</Link>
            <span style={{color:"#333"}}>|</span>
            <Link to="/guides" style={{color:G,fontSize:14,textDecoration:"none",fontWeight:600}}>Browse Guides</Link>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer style={{borderTop:"1px solid #1a1a1a",padding:"32px 24px",textAlign:"center"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✂️ SubTrim</div>
      <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        <Link to="/guides" style={{color:MT,fontSize:12,textDecoration:"none"}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:12,textDecoration:"none"}}>Compare</Link>
        <Link to="/alternatives" style={{color:MT,fontSize:12,textDecoration:"none"}}>Alternatives</Link>
        <Link to="/calculator" style={{color:MT,fontSize:12,textDecoration:"none"}}>Calculator</Link>
        <Link to="/terms" style={{color:MT,fontSize:12,textDecoration:"none"}}>Terms</Link>
        <Link to="/privacy" style={{color:MT,fontSize:12,textDecoration:"none"}}>Privacy</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>&copy; {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
