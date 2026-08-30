// Network-first, falling back to cache when offline. This is deliberately NOT cache-first:
// during active development, a cache-first strategy means anyone who already loaded the
// app once keeps seeing that exact snapshot forever, no matter what ships later - the
// service worker update lag (new SW installs in the background, only takes over after a
// second reload) compounds this. Network-first fixes that for anyone online, while still
// falling back to the cache so the app keeps working offline.
// Bump CACHE_NAME whenever the precache list itself changes (files added/removed).
const CACHE_NAME = 'mitkartebitte-v15';

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
  './js/ui/verbUtils.js',
  './js/views/checkpoint.js',
  './js/views/dataPanel.js',
  './js/views/grammarRules.js',
  './js/views/learnHome.js',
  './js/views/legal.js',
  './js/views/level.js',
  './js/views/onboarding.js',
  './js/views/practice.js',
  './js/views/verbCard.js',
  './js/views/foundationsHome.js',
  './js/views/foundationsGroup.js',
  './js/views/foundationsCard.js',
  './js/views/casesGrammar.js',
  './js/views/grammarA1.js',
  './js/views/grammarTierHome.js',
  './js/views/grammarPoint.js',
  './js/views/grammarLesson.js',
  './js/views/grammarPractice.js',
  './js/views/grammarCheckpoint.js',
  './js/data/verbs-a1.js',
  './js/data/rules.js',
  './js/data/practicePool.js',
  './js/data/foundations.js',
  './js/data/grammarPoints.js',
  './js/data/grammarDeck.js',
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
