// Version: v1.7.12 - Service Worker
const CACHE_NAME = 'shir-shel-yom-v1.7.12';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// התקנה ודילוג על המתנה לעדכון מהיר
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// הפעלה וניקוי כל המטמונים הישנים
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// שליפת נתונים ברשת עם גיבוי למטמון (אופליין)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
