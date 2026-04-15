// SSR entry point for prerendering
// This file is built by Vite in SSR mode and executed by scripts/prerender.mjs
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import { HeadContext } from './components/Helmet';

// Import pages directly (no lazy loading for SSR)
import Landing from './pages/Landing.jsx';
import CancelGuide from './pages/CancelGuide.jsx';
import Compare from './pages/Compare.jsx';
import Calculator from './pages/Calculator.jsx';
import Guides from './pages/Guides.jsx';
import CompareIndex from './pages/CompareIndex.jsx';
import Alternatives from './pages/Alternatives.jsx';
import AlternativesIndex from './pages/AlternativesIndex.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';
import Demo from './pages/Demo.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import WorthIt from './pages/WorthIt.jsx';

// Import data for route generation
import { CANCEL_GUIDES } from './data/cancelGuides';
import { TIERS, SERVICE_CATS, COMPARE_PAIRS } from './data/serviceData';
import { ALTERNATIVES } from './data/alternatives';
import { BLOG_POSTS } from './data/blogPosts';
import { WORTH_IT } from './data/worthIt';

// Slug helper (same as used in page components)
const toSlug = n => n.replace(/\+/g, ' plus').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

/**
 * Generate all routes that should be prerendered.
 * Does NOT include /app (authenticated dashboard).
 */
export function getRoutes() {
  const routes = [];

  // Static pages
  routes.push('/');
  routes.push('/guides');
  routes.push('/compare');
  routes.push('/alternatives');
  routes.push('/calculator');
  routes.push('/demo');
  routes.push('/blog');
  routes.push('/privacy');
  routes.push('/terms');

  // Cancel guide pages — one per service in CANCEL_GUIDES
  for (const name of Object.keys(CANCEL_GUIDES)) {
    routes.push(`/guides/cancel/${toSlug(name)}`);
  }

  // Compare pages — pre-defined pairs from COMPARE_PAIRS
  for (const [a, b] of COMPARE_PAIRS) {
    routes.push(`/compare/${toSlug(a)}-vs-${toSlug(b)}`);
  }

  // Also generate all same-category comparison pairs for comprehensive coverage
  const categories = {};
  for (const [service, cat] of Object.entries(SERVICE_CATS)) {
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(service);
  }
  for (const services of Object.values(categories)) {
    for (let i = 0; i < services.length; i++) {
      for (let j = i + 1; j < services.length; j++) {
        const route = `/compare/${toSlug(services[i])}-vs-${toSlug(services[j])}`;
        if (!routes.includes(route)) {
          routes.push(route);
        }
      }
    }
  }

  // Alternatives pages — one per service in ALTERNATIVES
  for (const name of Object.keys(ALTERNATIVES)) {
    routes.push(`/alternatives/${toSlug(name)}`);
  }

  // Blog post pages
  for (const post of BLOG_POSTS) {
    routes.push(`/blog/${post.slug}`);
  }

  // Worth-It pages — one per service in WORTH_IT
  for (const name of Object.keys(WORTH_IT)) {
    routes.push(`/worth-it/${toSlug(name)}`);
  }

  return routes;
}

/**
 * Render a single route to HTML string.
 * Returns { html, head } where head contains collected meta tags.
 */
export function render(url) {
  const headData = {};

  const html = renderToString(
    <HeadContext.Provider value={headData}>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/cancel/:service" element={<CancelGuide />} />
          <Route path="/compare" element={<CompareIndex />} />
          <Route path="/compare/:slug" element={<Compare />} />
          <Route path="/alternatives" element={<AlternativesIndex />} />
          <Route path="/alternatives/:service" element={<Alternatives />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/worth-it/:service" element={<WorthIt />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StaticRouter>
    </HeadContext.Provider>
  );

  return { html, head: headData };
}
