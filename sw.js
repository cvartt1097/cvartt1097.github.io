const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    'about.html',
    'offlinemsg.html',
    'settings.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/app.js',
    '/js/api.js',
    '/images/icons/48.png',
    '/images/icons/57.png',
    '/images/icons/60.png',
    '/images/icons/72.png',
    '/images/icons/76.png',
    '/images/icons/96.png',
    '/images/icons/120.png',
    '/images/icons/128.png',
    '/images/icons/144.png',
    '/images/icons/152.png',
    '/images/icons/180.png',
    '/images/icons/192.png',
    '/images/icons/256.png',
    '/images/icons/512.png',
    '/images/screenshots/homeTabAndroid.png',
    '/images/screenshots/aboutTabAndroid.png',
    '/images/screenshots/settingsTabAndroid.png'

]





self.addEventListener('install', (e) => {
    console.log('ServiceWorker: installed');

    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service Worker: Caching Files');
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    );
});


self.addEventListener('activate', (e) => {
    console.log('ServiceWorker: activated');
    // remove unwanted caches 
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

});

//call fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request)) 
    );
})






