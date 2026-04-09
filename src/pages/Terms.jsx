import { Link } from 'react-router-dom';
import { Helmet } from '../components/Helmet';

const BG='#0d0d0d',SF='#141414',G='#00d48a',MT='#888',TX='#fff';

const sectionStyle={marginBottom:40};
const h2Style={fontSize:20,fontWeight:700,margin:'0 0 16px',color:TX};
const pStyle={fontSize:14,color:'#bbb',lineHeight:1.7,margin:'0 0 12px'};
const ulStyle={margin:'0 0 12px',paddingLeft:20};
const liStyle={fontSize:14,color:'#bbb',lineHeight:1.7,marginBottom:6};

export default function Terms(){
  return(
  <div style={{background:BG,minHeight:"100vh",color:TX,fontFamily:"'Inter',system-ui,sans-serif"}}>
    <Helmet
      title="Terms of Service | SubTrim"
      description="SubTrim's terms of service. Read the terms and conditions governing your use of the SubTrim subscription tracker and optimizer."
      canonical="https://subtrim.dev/terms"
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
        <span style={{color:TX}}>Terms of Service</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.2,margin:"0 0 8px"}}>Terms of Service</h1>
      <p style={{fontSize:14,color:MT,margin:"0 0 40px"}}>Last updated: April 7, 2026</p>

      {/* 1. Acceptance */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>1. Acceptance of Terms</h2>
        <p style={pStyle}>
          By accessing or using SubTrim ("the Service"), available at subtrim.dev, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
        </p>
        <p style={pStyle}>
          We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the revised Terms. We will update the "Last updated" date when changes are made.
        </p>
      </div>

      {/* 2. Description */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>2. Description of Service</h2>
        <p style={pStyle}>
          SubTrim is a web-based subscription tracking and optimization tool. The Service allows you to:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Track your recurring subscriptions, their costs, and renewal dates</li>
          <li style={liStyle}>Conduct usage audits with keep, cancel, or downgrade recommendations</li>
          <li style={liStyle}>Detect overlapping subscriptions</li>
          <li style={liStyle}>Simulate cost changes with the "What If" calculator</li>
          <li style={liStyle}>Set category budgets and track spending</li>
          <li style={liStyle}>View promotional deals and price change alerts</li>
          <li style={liStyle}>Create or join households to coordinate shared subscriptions</li>
        </ul>
        <p style={pStyle}>
          SubTrim is currently offered as a free service. We reserve the right to introduce paid tiers or modify features in the future, with reasonable notice to existing users.
        </p>
      </div>

      {/* 3. User Accounts */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>3. User Accounts</h2>
        <p style={pStyle}>
          To use SubTrim, you must create an account with a valid email address and password. You are responsible for:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Maintaining the confidentiality of your login credentials</li>
          <li style={liStyle}>All activity that occurs under your account</li>
          <li style={liStyle}>Providing accurate and complete information</li>
          <li style={liStyle}>Notifying us promptly if you suspect unauthorized access to your account</li>
        </ul>
        <p style={pStyle}>
          You must be at least 13 years of age to create an account and use the Service.
        </p>
      </div>

      {/* 4. Acceptable Use */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>4. Acceptable Use</h2>
        <p style={pStyle}>You agree not to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
          <li style={liStyle}>Attempt to gain unauthorized access to the Service, other accounts, or our systems</li>
          <li style={liStyle}>Interfere with or disrupt the integrity or performance of the Service</li>
          <li style={liStyle}>Use automated means (bots, scrapers, etc.) to access the Service without our written permission</li>
          <li style={liStyle}>Upload or transmit malicious code, viruses, or harmful content</li>
          <li style={liStyle}>Impersonate another person or entity</li>
          <li style={liStyle}>Use the Service to spam, harass, or harm other users</li>
        </ul>
        <p style={pStyle}>
          We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
        </p>
      </div>

      {/* 5. User Data & Content */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>5. User Data & Content</h2>
        <p style={pStyle}>
          You retain ownership of all data you enter into SubTrim, including subscription details, survey responses, and preferences. By using the Service, you grant us a limited license to store and process your data solely for the purpose of providing the Service to you.
        </p>
        <p style={pStyle}>
          You are responsible for the accuracy of the data you enter. SubTrim provides recommendations based on information you supply; these recommendations are informational and should not be considered financial advice.
        </p>
        <p style={pStyle}>
          For details on how we handle your data, please see our <Link to="/privacy" style={{color:G,textDecoration:"none"}}>Privacy Policy</Link>.
        </p>
      </div>

      {/* 6. Intellectual Property */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>6. Intellectual Property</h2>
        <p style={pStyle}>
          The SubTrim name, logo, design, code, and all associated content are the intellectual property of SubTrim and its creators. You may not:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Copy, modify, or distribute any part of the Service without written permission</li>
          <li style={liStyle}>Use the SubTrim name or branding in a way that suggests endorsement or affiliation without our consent</li>
          <li style={liStyle}>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
        </ul>
        <p style={pStyle}>
          Subscription service names, logos, and trademarks referenced within SubTrim (e.g., Netflix, Spotify) belong to their respective owners. SubTrim is not affiliated with or endorsed by any of these services.
        </p>
      </div>

      {/* 7. Disclaimers */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>7. Disclaimers</h2>
        <div style={{background:SF,borderRadius:12,padding:20,marginBottom:12}}>
          <p style={{...pStyle,margin:0}}>
            The Service is provided <strong style={{color:TX}}>"as is"</strong> and <strong style={{color:TX}}>"as available"</strong> without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </div>
        <p style={pStyle}>
          We do not guarantee that:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>The Service will be uninterrupted, timely, secure, or error-free</li>
          <li style={liStyle}>Subscription pricing, promotional deals, or service information displayed will be accurate or current at all times</li>
          <li style={liStyle}>Audit recommendations will result in actual savings or improved outcomes</li>
        </ul>
        <p style={pStyle}>
          SubTrim is a tracking and informational tool. It does not provide financial advice. Always verify subscription details directly with your service providers before making cancellation or billing decisions.
        </p>
      </div>

      {/* 8. Limitation of Liability */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>
          To the maximum extent permitted by applicable law, SubTrim and its creators, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Loss of profits, data, or goodwill</li>
          <li style={liStyle}>Service interruption or inability to access the Service</li>
          <li style={liStyle}>Unauthorized access to or alteration of your data</li>
          <li style={liStyle}>Any other matter relating to the Service</li>
        </ul>
        <p style={pStyle}>
          Our total liability for any claim arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim (which, for free users, is zero).
        </p>
      </div>

      {/* 9. Termination */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>9. Termination</h2>
        <p style={pStyle}>
          You may stop using the Service and delete your account at any time by contacting us at <a href="mailto:hello@subtrim.dev" style={{color:G,textDecoration:"none"}}>hello@subtrim.dev</a>.
        </p>
        <p style={pStyle}>
          We may suspend or terminate your access to the Service at our discretion, without prior notice, if:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>You violate these Terms of Service</li>
          <li style={liStyle}>Your use of the Service poses a security risk or may harm other users</li>
          <li style={liStyle}>We are required to do so by law</li>
          <li style={liStyle}>We decide to discontinue the Service (with reasonable notice to active users)</li>
        </ul>
        <p style={pStyle}>
          Upon termination, your right to access the Service ceases immediately. We will retain your data for a reasonable period to allow you to request an export, after which it will be permanently deleted.
        </p>
      </div>

      {/* 10. Indemnification */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>10. Indemnification</h2>
        <p style={pStyle}>
          You agree to indemnify and hold harmless SubTrim and its creators from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to your use of the Service or your violation of these Terms.
        </p>
      </div>

      {/* 11. Governing Law */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>11. Governing Law</h2>
        <p style={pStyle}>
          These Terms shall be governed by and construed in accordance with the laws of the State of South Carolina, United States, without regard to its conflict of law provisions.
        </p>
        <p style={pStyle}>
          Any disputes arising from these Terms or the Service shall be resolved in the state or federal courts located in South Carolina, and you consent to the personal jurisdiction of such courts.
        </p>
      </div>

      {/* 12. Severability */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>12. Severability</h2>
        <p style={pStyle}>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
        </p>
      </div>

      {/* 13. Contact */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>13. Contact</h2>
        <p style={pStyle}>
          If you have questions about these Terms of Service, contact us at:
        </p>
        <div style={{background:SF,borderRadius:12,padding:20}}>
          <div style={{fontSize:14,color:'#bbb',lineHeight:1.8}}>
            <strong style={{color:TX}}>SubTrim</strong><br/>
            Email: <a href="mailto:hello@subtrim.dev" style={{color:G,textDecoration:"none"}}>hello@subtrim.dev</a><br/>
            Website: <a href="https://subtrim.dev" style={{color:G,textDecoration:"none"}}>subtrim.dev</a>
          </div>
        </div>
      </div>

      {/* Related links */}
      <div style={{borderTop:"1px solid #1a1a1a",paddingTop:24,marginTop:48,display:"flex",gap:16,flexWrap:"wrap"}}>
        <Link to="/privacy" style={{color:G,fontSize:14,textDecoration:"none",fontWeight:600}}>Privacy Policy</Link>
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
