const cacheName = 'pwa-conf-v1';
const staticAssets = [
    '/',
    '/index.html',

    /* CSSs */
    '/assets/css/bootstrap.min.css',
    '/assets/css/style.css',
    '/assets/css/DT_bootstrap.css',

    '/assets/js/jquery.js',
    '/assets/js/jquery.dataTables.js',
    '/assets/js/bootstrap.min.js',
    '/assets/js/DT_bootstrap.js',
    '/assets/js/jquery.cookies.2.2.0.min.js',
    '/assets/js/numeral/numeral.min.js',
    '/assets/js/moment.min.js',
    '/assets/js/purl.js',
    '/assets/js/statsioparser.js'
];

// Define the hostnames that you want to ignore
const ignoredHosts = ['localhost'];


self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
        
    // Destructure the hostname out of the event's request 
    // URL by creating a new URL instance
    const {hostname} = new URL(evt.request.url);

    // Bail out if our definition contains this url
    if (ignoredHosts.indexOf(hostname) >= 0) {
        return;
    }

    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}