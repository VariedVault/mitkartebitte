// Cache-first offline shell. Bump CACHE_NAME whenever any precached file changes so
// clients pick up the new version instead of serving stale assets forever.
const CACHE_NAME = 'mitkartebitte-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './js/app.js',
  './js/router.js',
  './js/srs.js',
  './js/store.js',
  './js/tts.js',
  './js/ui/components.js',
  './js/ui/drills.js',
  './js/views/courseMap.js',
  './js/views/dataPanel.js',
  './js/views/lesson.js',
  './js/views/onboarding.js',
  './js/views/practice.js',
  './js/views/profiles.js',
  './js/data/verbs.js',
  './js/data/conjugate.js',
  './js/data/modules/index.js',
  './js/data/modules/tier1-01-praesens.js',
  './js/data/modules/tier1-02-stem-changing.js',
  './js/data/modules/tier1-03-sein-haben-werden.js',
  './js/data/modules/tier1-04-modalverben.js',
  './js/data/modules/tier1-05-imperativ.js',
  './js/data/modules/tier2-06-perfekt-weak.js',
  './js/data/modules/tier2-07-perfekt-strong-sein.js',
  './js/data/modules/tier2-08-praeteritum-weak.js',
  './js/data/modules/tier2-09-praeteritum-strong-modals.js',
  './js/data/modules/tier3-10-separable-prefixes.js',
  './js/data/modules/tier3-11-reflexive.js',
  './js/data/modules/tier4-12-plusquamperfekt.js',
  './js/data/modules/tier4-13-futur.js',
  './js/data/modules/tier4-14-konjunktiv2.js',
  './js/data/modules/tier4-15-konjunktiv1.js',
  './js/data/modules/tier4-16-passiv.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    })
  );
});
