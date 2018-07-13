let staticCacheName = 'restaurant_01';

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
      	'/',
        '/index.html',
        '/restaurant.html',
        '/js/',
        '/js/restaurant_info.js',
        '/js/main.js',
        '/js/dbhelper.js',
        '/data/restaurants.json',
        '/css/styles.css',
        '/img/blank.jpg',
        '/data/restaurants.json'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant_') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // TODO: respond to requests for the root page with
  // the page skeleton from the cache
	var requestUrl = new URL(event.request.url);
	if(requestUrl.origin === self.location.origin){
		if(requestUrl.pathname ==='/'){
			event.respondWith(caches.match('/index.html'));
			return;
		}
	}
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
      .then(function(response){
      	return caches.open(staticCacheName).then(function(cache){
      	cache.put(event.request, response.clone());
      	return response; 
      	});
      }).catch(function(error){
      	if(event.request.url.endsWith(".jpg")){
      		return cache.catch("")
      	}
      })
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting('/img/blank.jpg');
  }
  return new response('Cann\'t connect, please heck your internet connection')
});