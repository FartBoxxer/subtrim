import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',G='#00d48a',MT='#888',TX='#fff';

const sectionStyle={marginBottom:40};
const h2Style={fontSize:20,fontWeight:700,margin:'0 0 16px',color:TX};
const pStyle={fontSize:14,color:'#bbb',lineHeight:1.7,margin:'0 0 12px'};
const ulStyle={margin:'0 0 12px',paddingLeft:20};
const liStyle={fontSize:14,color:'#bbb',lineHeight:1.7,marginBottom:6};

export default function Privacy(){
  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Privacy Policy | SubTrim"
      description="SubTrim's privacy policy. Learn how we collect, use, and protect your data. No ad trackers, no data selling, no cookies beyond essential auth."
      canonical="https://subtrim.dev/privacy"
    />

    {/* Nav */}
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",maxWidth:900,margin:"0 auto"}}>
      <Link to="/" style={{fontSize:20,fontWeight:800,color:TX,textDecoration:"none",letterSpacing:"-0.5px"}}>✂️ SubTrim</Link>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Link to="/guides" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Guides</Link>
        <Link to="/compare" style={{color:MT,fontSize:14,textDecoration:"none",fontWeight:500}}>Compare</Link>
        <Link to="/app" style={{background:G,color:"#000",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:"inherit"}}>Try SubTrim Free</Link>
      </div>
    </nav>

    {/* Content */}
    <div style={{maxWidth:720,margin:"0 auto",padding:"40px 24px 80px"}}>
      {/* Breadcrumb */}
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,fontSize:13,color:MT}}>
        <Link to="/" style={{color:MT,textDecoration:"none"}}>Home</Link>
        <span style={{color:"#444"}}>›</span>
        <span style={{color:TX}}>Privacy Policy</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 8px"}}>Privacy Policy</h1>
      <p style={{fontSize:14,color:MT,margin:"0 0 40px"}}>Last updated: April 7, 2026</p>

      {/* Intro */}
      <div style={sectionStyle}>
        <p style={pStyle}>
          SubTrim ("we," "our," or "us") operates the website at subtrim.dev and the SubTrim web application. This Privacy Policy explains how we collect, use, store, and protect your information when you use our service.
        </p>
        <p style={pStyle}>
          We believe in transparency and minimal data collection. We do not sell your data, we do not use third-party ad trackers, and we do not place non-essential cookies on your device.
        </p>
      </div>

      {/* What We Collect */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>1. What We Collect</h2>
        <p style={pStyle}><strong style={{color:TX}}>Account Information</strong></p>
        <ul style={ulStyle}>
          <li style={liStyle}>Email address and password (used for authentication)</li>
          <li style={liStyle}>Display name, avatar selection, and account preferences you choose to set</li>
        </ul>
        <p style={pStyle}><strong style={{color:TX}}>Subscription Data</strong></p>
        <ul style={ulStyle}>
          <li style={liStyle}>Subscription names, costs, billing cycles, renewal dates, and categories you enter</li>
          <li style={liStyle}>Audit survey responses (usage frequency, satisfaction, would-miss ratings)</li>
          <li style={liStyle}>Budget settings and household membership information</li>
        </ul>
        <p style={pStyle}><strong style={{color:TX}}>Automatically Collected</strong></p>
        <ul style={ulStyle}>
          <li style={liStyle}>Basic web analytics via Vercel Analytics (page views, referrer, country, device type). This is privacy-friendly and does not use cookies or track individuals.</li>
          <li style={liStyle}>Authentication session tokens stored in your browser's local storage (essential for keeping you logged in)</li>
        </ul>
        <p style={pStyle}><strong style={{color:TX}}>Contact Form</strong></p>
        <ul style={ulStyle}>
          <li style={liStyle}>If you use our contact form, we collect your name, email address, and message. This data is sent via FormSubmit.co to our email at hello@subtrim.dev.</li>
        </ul>
      </div>

      {/* How We Use It */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>2. How We Use Your Data</h2>
        <p style={pStyle}>We use your information exclusively to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Provide and operate the SubTrim service (tracking subscriptions, generating audit recommendations, and calculating your savings)</li>
          <li style={liStyle}>Authenticate your identity and maintain your session</li>
          <li style={liStyle}>Enable household sharing features when you opt in</li>
          <li style={liStyle}>Respond to your support inquiries and feedback</li>
          <li style={liStyle}>Understand aggregate usage patterns to improve the product (via anonymous analytics)</li>
        </ul>
        <p style={pStyle}>
          We do <strong style={{color:TX}}>not</strong> use your data for advertising, profiling, or selling to third parties. Ever.
        </p>
      </div>

      {/* Data Storage & Security */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>3. Data Storage & Security</h2>
        <p style={pStyle}>
          Your data is stored in a Supabase-hosted PostgreSQL database. Supabase provides enterprise-grade security including:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Encryption at rest and in transit (TLS/SSL)</li>
          <li style={liStyle}>Row Level Security (RLS) policies ensuring you can only access your own data</li>
          <li style={liStyle}>SOC 2 Type II compliant infrastructure</li>
          <li style={liStyle}>Data hosted on secure cloud infrastructure</li>
        </ul>
        <p style={pStyle}>
          Passwords are hashed using bcrypt via Supabase Auth. We never store or have access to your plaintext password.
        </p>
      </div>

      {/* Third-Party Services */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>4. Third-Party Services</h2>
        <p style={pStyle}>We use a limited number of third-party services, each chosen for their privacy practices:</p>
        <div style={{background:SF,borderRadius:12,padding:20,marginBottom:12}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>Supabase</div>
              <div style={{fontSize:13,color:'#bbb',lineHeight:1.5}}>Authentication, database, and backend services. Processes your account and subscription data.</div>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>Vercel</div>
              <div style={{fontSize:13,color:'#bbb',lineHeight:1.5}}>Website hosting and privacy-friendly analytics. Collects anonymous, aggregated usage data. No cookies used.</div>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>FormSubmit.co</div>
              <div style={{fontSize:13,color:'#bbb',lineHeight:1.5}}>Contact form processing. Receives your name, email, and message when you submit the contact form.</div>
            </div>
          </div>
        </div>
        <p style={pStyle}>
          We do not use Google Analytics, Facebook Pixel, or any advertising or behavioral tracking tools.
        </p>
      </div>

      {/* Cookies */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>5. Cookies & Local Storage</h2>
        <p style={pStyle}>
          SubTrim does not use tracking cookies. The only client-side storage we use is:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}><strong style={{color:TX}}>Local Storage:</strong> Authentication session tokens managed by Supabase Auth (essential for keeping you logged in)</li>
          <li style={liStyle}><strong style={{color:TX}}>Local Storage:</strong> UI preferences such as dismissed alerts and theme settings</li>
        </ul>
        <p style={pStyle}>
          No cookie consent banner is needed because we do not use non-essential cookies.
        </p>
      </div>

      {/* Your Rights */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>6. Your Rights</h2>
        <p style={pStyle}>You have the right to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}><strong style={{color:TX}}>Access</strong> your data. All your subscription data is visible to you in the app at all times.</li>
          <li style={liStyle}><strong style={{color:TX}}>Export</strong> your data. CSV export functionality is available in your account settings.</li>
          <li style={liStyle}><strong style={{color:TX}}>Correct</strong> your data. You can edit any subscription or profile information at any time.</li>
          <li style={liStyle}><strong style={{color:TX}}>Delete</strong> your data. You can request complete account deletion by emailing us.</li>
          <li style={liStyle}><strong style={{color:TX}}>Withdraw consent</strong>. You can stop using the service at any time; no data is retained after deletion.</li>
        </ul>
        <p style={pStyle}>
          To exercise any of these rights, contact us at <a href="mailto:hello@subtrim.dev" style={{color:G,textDecoration:"none"}}>hello@subtrim.dev</a>.
        </p>
      </div>

      {/* Children */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>7. Children's Privacy</h2>
        <p style={pStyle}>
          SubTrim is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us and we will promptly delete it.
        </p>
      </div>

      {/* Contact */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>8. Contact</h2>
        <p style={pStyle}>
          If you have questions about this Privacy Policy or your data, contact us at:
        </p>
        <div style={{background:SF,borderRadius:12,padding:20}}>
          <div style={{fontSize:14,color:'#bbb',lineHeight:1.8}}>
            <strong style={{color:TX}}>SubTrim</strong><br/>
            Email: <a href="mailto:hello@subtrim.dev" style={{color:G,textDecoration:"none"}}>hello@subtrim.dev</a><br/>
            Website: <a href="https://subtrim.dev" style={{color:G,textDecoration:"none"}}>subtrim.dev</a>
          </div>
        </div>
      </div>

      {/* Changes */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>9. Changes to This Policy</h2>
        <p style={pStyle}>
          We may update this Privacy Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this page. For significant changes, we will notify registered users via email.
        </p>
        <p style={pStyle}>
          Continued use of SubTrim after changes constitutes acceptance of the updated policy.
        </p>
      </div>

      {/* Related links */}
      <div style={{borderTop:"1px solid #1a1a1a",paddingTop:24,marginTop:48,display:"flex",gap:16,flexWrap:"wrap"}}>
        <Link to="/terms" style={{color:G,fontSize:14,textDecoration:"none",fontWeight:600}}>Terms of Service</Link>
        <Link to="/" style={{color:MT,fontSize:14,textDecoration:"none"}}>Back to Home</Link>
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
        <Link to="/blog" style={{color:MT,fontSize:12,textDecoration:"none"}}>Blog</Link>
        <Link to="/terms" style={{color:MT,fontSize:12,textDecoration:"none"}}>Terms</Link>
        <Link to="/privacy" style={{color:MT,fontSize:12,textDecoration:"none"}}>Privacy</Link>
      </div>
      <p style={{fontSize:11,color:"#444",margin:0}}>&copy; {new Date().getFullYear()} SubTrim. All rights reserved.</p>
    </footer>
  </div>)
}
