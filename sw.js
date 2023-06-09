var GHPATH = "https://necdetuygur.github.io/eshot-duraga-yaklasan-otobusler/";
var APP_PREFIX = "r_";
var VERSION = "v1";
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/bootstrap.min.css`,
  `${GHPATH}/favicon.ico`,
  `${GHPATH}/index.html`,
  `${GHPATH}/manifest.webmanifest`,
  `${GHPATH}/script.js`,
  `${GHPATH}/style.css`,
  `${GHPATH}/sw.js`,
  `${GHPATH}/assets/icons/icon-128x128.png`,
  `${GHPATH}/assets/icons/icon-144x144.png`,
  `${GHPATH}/assets/icons/icon-152x152.png`,
  `${GHPATH}/assets/icons/icon-192x192.png`,
  `${GHPATH}/assets/icons/icon-384x384.png`,
  `${GHPATH}/assets/icons/icon-48x48.png`,
  `${GHPATH}/assets/icons/icon-512x512.png`,
  `${GHPATH}/assets/icons/icon-72x72.png`,
  `${GHPATH}/assets/icons/icon-96x96.png`,
  `${GHPATH}/assets/loading.gif`,
];

//////////////////////////////////////

var CACHE_NAME = APP_PREFIX + VERSION;
self.addEventListener("fetch", function (e) {
  // console.log("Fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // console.log("Responding with cache : " + e.request.url);
        return request;
      } else {
        // console.log("File is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // console.log("Installing cache : " + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            // console.log("Deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
