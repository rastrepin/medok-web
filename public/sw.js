/* MED OK DOVIRA · Service Worker (minimal — PWA installability + basic offline) */
const SW_VERSION = 'medok-sw-v1';
const STATIC_CACHE = `static-${SW_VERSION}`;
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;

// Page-shell URLs to pre-cache (tiny — just the fallback)
const PRECACHE = [
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((c) => c.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache API / admin / cron endpoints — they must always be fresh.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin/')
  ) {
    return;
  }

  // Navigation: network-first, fall back to cached offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy)).catch(() => undefined);
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match('/offline.html')),
        ),
    );
    return;
  }

  // Static assets (images, fonts, js, css): stale-while-revalidate.
  if (/\.(png|jpg|jpeg|svg|webp|ico|woff2?|ttf|css|js)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy)).catch(() => undefined);
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      }),
    );
  }
});
