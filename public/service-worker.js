importScripts("https://js.pusher.com/beams/service-worker.js");

// Basic PWA cache functionality
const CACHE_NAME = 'atelier-logos-v3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/web-app-manifest-192x192-black.png',
  '/web-app-manifest-512x512-black.png',
  '/apple-touch-icon.png',
  '/favicon-96x96.png'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});