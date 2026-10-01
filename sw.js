// Version: v5.4 - Service Worker
const CACHE_NAME = 'shir-shel-yom-v5.4';
const ASSETS = [
    './',
    './index.html',
    './psalms.json',
    './manifest.json',
    './favicon.png',
    'https://cdn.jsdelivr.net/npm/@hebcal/core@latest/dist/bundle.min.js'
];

// התקנה ודילוג על המתנה לעדכון מהיר
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// הפעלה וניקוי מטמונים ישנים
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// אסטרטגיית שליפה: רשת תחילה עם גיבוי למטמון (Network First, falling back to Cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // אם הבקשה הצליחה ברשת, נשמור עותק מעודכן במטמון ונחזיר
                if (response && response.status === 200) {
                    let responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // אם אין רשת, נשלף ישירות מהמטמון ללא שגיאות
                return caches.match(event.request);
            })
    );
});
