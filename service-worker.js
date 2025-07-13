self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('kundali-cache').then(cache =>
      cache.addAll([
        'index.html',
        'style.css',
        'main.js',
        'districts.js',
        'manifest.json',
        'icon-192.png'
      ])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
