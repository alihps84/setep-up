// نصب Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('stepup-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js'
      ]);
    })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== 'stepup-v1';
        }).map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// پاسخ به درخواست‌ها از کش
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
