#!/usr/bin/env node
/**
 * Prerender script for SubTrim
 *
 * Runs after `vite build` to generate static HTML for SEO-critical pages.
 * Uses Vite's SSR build to render React components server-side, then injects
 * the rendered HTML + correct meta tags into the built index.html template.
 *
 * Usage: node scripts/prerender.mjs
 * (Called automatically by the build script)
 */

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { build } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');

async function prerender() {
  const startTime = Date.now();

  // Step 1: Build the SSR bundle
  console.log('\n[prerender] Building SSR bundle...');
  await build({
    root: ROOT,
    build: {
      ssr: true,
      outDir: 'dist/ssr',
      rollupOptions: {
        input: resolve(ROOT, 'src/entry-prerender.jsx'),
        output: {
          format: 'es',
          entryFileNames: 'entry-prerender.mjs',
          // Override manualChunks from vite.config.js (not applicable to SSR)
          manualChunks: undefined,
        },
      },
      // Don't copy public dir to SSR output (only needed for client build)
      copyPublicDir: false,
      // Don't clear the main dist folder
      emptyOutDir: false,
    },
    logLevel: 'warn',
  });

  // Step 2: Import the SSR module
  console.log('[prerender] Loading SSR module...');
  const ssrPath = resolve(DIST, 'ssr/entry-prerender.mjs');
  // Use pathToFileURL for cross-platform dynamic import compatibility (required on Windows)
  const ssrModule = await import(pathToFileURL(ssrPath).href);
  const { getRoutes, render } = ssrModule;

  // Step 3: Read the built index.html template
  const templatePath = resolve(DIST, 'index.html');
  if (!existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run `vite build` first.');
  }
  const template = readFileSync(templatePath, 'utf-8');

  // Save a clean copy of index.html as the SPA fallback (for /app and other non-prerendered routes).
  // Vercel rewrites will serve this for routes that don't have a prerendered file.
  const fallbackPath = resolve(DIST, '200.html');
  writeFileSync(fallbackPath, template, 'utf-8');

  // Step 4: Get all routes to prerender
  const routes = getRoutes();
  console.log(`[prerender] Prerendering ${routes.length} routes...`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      const { html: appHtml, head } = render(route);

      // Inject rendered HTML into the template
      let result = template;

      // Replace the <div id="root"></div> with prerendered content
      // The client-side JS will hydrate this on load
      result = result.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      // Inject correct <title> if collected
      if (head.title) {
        result = result.replace(
          /<title>[^<]*<\/title>/,
          `<title>${escapeHtml(head.title)}</title>`
        );
        // Update og:title
        result = result.replace(
          /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.title)}$2`
        );
        // Update twitter:title
        result = result.replace(
          /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.title)}$2`
        );
      }

      // Inject correct <meta name="description"> if collected
      if (head.description) {
        result = result.replace(
          /(<meta\s+name="description"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.description)}$2`
        );
        result = result.replace(
          /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.description)}$2`
        );
        result = result.replace(
          /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.description)}$2`
        );
      }

      // Inject correct canonical URL
      if (head.canonical) {
        result = result.replace(
          /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
          `$1${escapeAttr(head.canonical)}$2`
        );
        result = result.replace(
          /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
          `$1${escapeAttr(head.canonical)}$2`
        );
      }

      // Inject noindex if specified
      if (head.noindex) {
        result = result.replace(
          '</head>',
          '    <meta name="robots" content="noindex, nofollow" />\n  </head>'
        );
      }

      // Inject JSON-LD scripts if collected
      if (head.jsonLd && head.jsonLd.length > 0) {
        const jsonLdScripts = head.jsonLd
          .map(data => `    <script type="application/ld+json">${JSON.stringify(data)}</script>`)
          .join('\n');
        result = result.replace(
          '</head>',
          `${jsonLdScripts}\n  </head>`
        );
      }

      // Determine output path
      const filePath = route === '/'
        ? resolve(DIST, 'index.html')
        : resolve(DIST, route.slice(1), 'index.html');

      // Ensure directory exists
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(filePath, result, 'utf-8');
      successCount++;
    } catch (err) {
      console.error(`  [error] ${route}: ${err.message}`);
      errorCount++;
    }
  }

  // Step 5: Clean up SSR build artifacts (not needed in production)
  try {
    rmSync(resolve(DIST, 'ssr'), { recursive: true, force: true });
  } catch {}

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[prerender] Done! ${successCount} pages prerendered, ${errorCount} errors (${elapsed}s)\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '$$$$');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '$$$$');
}

prerender().catch(err => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
