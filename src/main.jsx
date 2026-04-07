import { StrictMode, Component, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
const App = lazy(() => import("./App.jsx"));
const Landing = lazy(() => import("./pages/Landing.jsx"));
const CancelGuide = lazy(() => import("./pages/CancelGuide.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const Calculator = lazy(() => import("./pages/Calculator.jsx"));
const Guides = lazy(() => import("./pages/Guides.jsx"));
const CompareIndex = lazy(() => import("./pages/CompareIndex.jsx"));
const Alternatives = lazy(() => import("./pages/Alternatives.jsx"));
const AlternativesIndex = lazy(() => import("./pages/AlternativesIndex.jsx"));

const Loading = () => (
  <div style={{background:"#0d0d0d",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",color:"#888"}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12}}>✂️</div>
      <div style={{fontSize:14}}>Loading...</div>
    </div>
  </div>
);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{background:"#0d0d0d",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",color:"#fff",padding:20,textAlign:"center"}}>
          <div>
            <div style={{fontSize:48,marginBottom:16}}>✂️</div>
            <div style={{fontSize:22,fontWeight:700,marginBottom:8}}>Something went wrong</div>
            <p style={{fontSize:14,color:"#888",maxWidth:400,margin:"0 auto 20px",lineHeight:1.5}}>SubTrim ran into an unexpected error. Your data is safe.</p>
            <button onClick={()=>window.location.reload()} style={{background:"#00d48a",color:"#000",border:"none",borderRadius:10,padding:"12px 28px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<App />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/cancel/:service" element={<CancelGuide />} />
            <Route path="/compare" element={<CompareIndex />} />
            <Route path="/compare/:slug" element={<Compare />} />
            <Route path="/alternatives" element={<AlternativesIndex />} />
            <Route path="/alternatives/:service" element={<Alternatives />} />
            <Route path="/calculator" element={<Calculator />} />
            {/* Fallback — show the app (handles its own auth) */}
            <Route path="*" element={<App />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </ErrorBoundary>
  </StrictMode>
);
