// Service Worker para Portafolio Raldy Lopez
// Carga ultra rápida y soporte offline inteligente

const CACHE_NAME = 'raldy-portfolio-v1';

const STATIC_SHELL = [
  './',
  'index.html',
  'fitness.html',
  'lifestyle.html',
  'about.html',
  'contact.html',
  'style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
  'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js'
];

// Instalación: precarga de archivos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de recuperación de peticiones:
// 1. Para imágenes: Cache First con fallback a Network y guardado en caché.
// 2. Para HTML y CSS: Stale While Revalidate (rápido pero siempre actualizado).
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorar analytics u otras extensiones
  if (url.origin.includes('google-analytics') || url.origin.includes('googletagmanager')) {
    return;
  }

  // Imágenes (WebP) -> Cache First
  if (request.destination === 'image' || url.pathname.endsWith('.webp')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse;
        }
      })
    );
    return;
  }

  // Resto de recursos (HTML, CSS, JS) -> Stale While Revalidate
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
