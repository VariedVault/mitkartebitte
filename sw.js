// Network-first, falling back to cache when offline. This is deliberately NOT cache-first:
// during active development, a cache-first strategy means anyone who already loaded the
// app once keeps seeing that exact snapshot forever, no matter what ships later - the
// service worker update lag (new SW installs in the background, only takes over after a
// second reload) compounds this. Network-first fixes that for anyone online, while still
// falling back to the cache so the app keeps working offline.
// Bump CACHE_NAME whenever the precache list itself changes (files added/removed).
const CACHE_NAME = 'mitkartebitte-v4';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './css/fonts.css',
  './fonts/baloo2-latin.woff2',
  './fonts/baloo2-latin-ext.woff2',
  './fonts/inter-latin.woff2',
  './fonts/inter-latin-ext.woff2',
  './fonts/jetbrainsmono-latin.woff2',
  './fonts/jetbrainsmono-latin-ext.woff2',
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
  './js/views/legal.js',
  './js/views/lesson.js',
  './js/views/onboarding.js',
  './js/views/practice.js',
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
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
  );
});
