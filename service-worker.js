"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/xmas-tree/index.html","2d830de413549672d837b01ebc4181d4"],["/xmas-tree/static/css/main.65027555.css","41e5e45b9b5d9ecaa09b72c11eed3386"],["/xmas-tree/static/js/main.0cecb465.js","fd1c22cfb1e663ef6e75d3f2e3ccae3b"],["/xmas-tree/static/media/background.38b79f0b.mp3","38b79f0b4c5af9b9fde838b5377cfdcf"],["/xmas-tree/static/media/background.e9a6a9e5.png","e9a6a9e5af4e64b46917ee3adf92cc26"],["/xmas-tree/static/media/boxBody.44d05f1a.svg","44d05f1a74c657f3fa80642f9a8f4ea0"],["/xmas-tree/static/media/boxLid.999f4463.svg","999f44634df0bcd16b08cf11aea6f149"],["/xmas-tree/static/media/coupon.96e40370.svg","96e40370578ec1b563476a5f8d5d2af1"],["/xmas-tree/static/media/flowerWatering.88eff4a5.mp3","88eff4a5a641142e01ae02a34aa01909"],["/xmas-tree/static/media/foreground.5b84e894.png","5b84e8945454773726c2249ca127f987"],["/xmas-tree/static/media/gift.496b4235.gif","496b4235cc7c219079926a904adba61c"],["/xmas-tree/static/media/giftUnwrapping.1d5c776a.gif","1d5c776a8715bc99df2f74629530899f"],["/xmas-tree/static/media/magicGrowth.a962f8f5.mp3","a962f8f54178f4c3f5ce4308c4382070"],["/xmas-tree/static/media/midground.58ce1d20.png","58ce1d20b3a29e02ce9727dbd29ed8de"],["/xmas-tree/static/media/supermanBored.655a2be7.gif","655a2be7206e04892852695520ad8b93"],["/xmas-tree/static/media/supermanCelebrate.c2b43c74.gif","c2b43c749d76e0995f4f4f45d812491e"],["/xmas-tree/static/media/supermanMagic.c81f7d48.gif","c81f7d488f409748dcc19f2f15fdfdca"],["/xmas-tree/static/media/tree0.74630f1e.gif","74630f1e9a05e090f528451448f3c82d"],["/xmas-tree/static/media/tree1.2469cd2b.gif","2469cd2bedb5a3ed97084ad30ef452ac"],["/xmas-tree/static/media/tree2.b20025c8.gif","b20025c8c517cab8484f87b6ef0ae168"],["/xmas-tree/static/media/tree3.33ffa977.gif","33ffa9774d096f9ab8d33636239c4d27"],["/xmas-tree/static/media/tree4.0f7b400c.gif","0f7b400c8d36212e9b387bc44d03362f"],["/xmas-tree/static/media/tree5.837c4553.gif","837c455379643b8ad43b4b41a8e429a7"],["/xmas-tree/static/media/tree6.0dcca89e.gif","0dcca89e76479b72b690bdff8083d8f2"],["/xmas-tree/static/media/tree7.0a3a5279.gif","0a3a52791d4b93c9e03986c49670e40f"],["/xmas-tree/static/media/xmas.9c957927.mp3","9c95792796b488eb915244a505d3a347"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,t,a,r){var n=new URL(e);return r&&n.pathname.match(r)||(n.search+=(n.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),n.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],r=new URL(t,self.location),n=createCacheKey(r,hashParamName,a,/\.\w{8}\./);return[r.toString(),n]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var r=new Request(a,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),r="index.html";(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,r),t=urlsToCacheKeys.has(a));var n="/xmas-tree/index.html";!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(a=new URL(n,self.location).toString(),t=urlsToCacheKeys.has(a)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});