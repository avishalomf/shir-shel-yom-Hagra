// Version: v1.7.16 - Service Worker
const CACHE_NAME = 'shir-shel-yom-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// התקנת ה-Service Worker ושמירת הקבצים במטמון
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// שליפת קבצים במצב אופליין או מהרשת
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
