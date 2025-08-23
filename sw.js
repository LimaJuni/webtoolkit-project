// Service Worker for Caching
const CACHE_NAME = 'webtoolkit-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/calculator.html',
    '/phonebook.html',
    '/gallery.html',
    '/about.html',
    '/css/main.css',
    '/css/design-tokens.css',
    '/css/reset.css',
    '/css/typography.css',
    '/css/components.css',
    '/js/main.js',
    '/js/theme-manager.js',
    '/js/app-polish.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for offline
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});