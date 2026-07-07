// Fono service worker — offline support with fresh-when-online behavior.
// Bump CACHE_VERSION on every release so old caches are purged.
const CACHE_VERSION = 'fono-v2.0.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

// Install: pre-cache the app shell. Cache assets individually so one failure
// (e.g. a stray 404) can't abort the whole cache and break offline support.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      Promise.all(ASSETS.map(url =>
        cache.add(url).catch(() => { /* skip assets that fail; app still caches the rest */ })
      ))
    ).then(() => self.skipWaiting())
  );
});

// Activate: remove caches from older versions.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch strategy:
//  - HTML/navigation: network-first (always get the newest deploy when online),
//    fall back to cache when offline.
//  - Other same-origin assets (icons, manifest): cache-first for speed offline.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});
