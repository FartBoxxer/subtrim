const CACHE_NAME = 'subtrim-v1';
const PRECACHE = ['/', '/icon-192.png', '/icon-512.png', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // Skip Supabase API calls — always go to network
  if (url.hostname.includes('supabase')) return;

  // Network-first for HTML (SPA navigation)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return res;
      }).catch(() => caches.match('/') || caches.match(request))
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok && (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(png|svg|woff2?)$/))) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      });
    })
  );
});
