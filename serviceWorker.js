// Served from the site root so its scope is "/" and it can control every
// page, including /noumena/.  A worker under /js/ only ever gets scope
// "/js/", which is why the previous one controlled nothing.

const CACHE = 'joshua-wood-dev-v2';

// Shell assets only.  Photos and videos are deliberately absent: the
// journal's media is measured in gigabytes and does not belong in a
// browser cache.
const SHELL = [
  '/css/htmlize.css',
  '/css/readtheorg.css',
  '/js/jquery.min.js',
  '/js/bootstrap.min.js',
  '/js/jquery.tablesorter.min.js',
  '/js/jquery.stickytableheaders.min.js',
  '/js/script.js',
];

// Each asset is added on its own and its failure is swallowed.  addAll()
// rejects as a unit, and that rejection inside waitUntil() is what kept
// this worker from ever installing.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(
        SHELL.map((asset) => cache.add(asset).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

const isShellAsset = (url) =>
  url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/');

// Network first, so a day published today is never shadowed by the copy
// cached yesterday.  The cache is the offline fallback, not the source of
// truth.
const networkFirst = (request) =>
  fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => caches.match(request));

// Cache first for the shell, refreshed in the background: these change
// rarely and are what makes a cold start feel instant.
const cacheFirst = (request) =>
  caches.match(request).then((cached) => {
    const network = fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => cached);
    return cached || network;
  });

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Anything else is left entirely alone: other origins (the CDN), form
  // posts, and the range requests a <video> uses to seek — intercepting
  // those breaks playback.
  if (request.method !== 'GET') return;
  if (request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (isShellAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
