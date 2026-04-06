const CACHE_NAME = 'shir-shel-yom-v2';
const ASSETS = [
  '/shir-shel-yom-Hagra1/',
  '/shir-shel-yom-Hagra1/index.html',
  '/shir-shel-yom-Hagra1/manifest.json',
  '/shir-shel-yom-Hagra1/psalms.json',
  '/shir-shel-yom-Hagra1/favicon.png',
  '/shir-shel-yom-Hagra1/icon-192.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
