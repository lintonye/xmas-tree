"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/xmas-tree/index.html","f169f07cc5d102c552dcfe84deb50587"],["/xmas-tree/static/css/main.65027555.css","41e5e45b9b5d9ecaa09b72c11eed3386"],["/xmas-tree/static/js/main.8485a1a0.js","b010c4750b0a5d3b79015097a5787721"],["/xmas-tree/static/media/background.4bc95b53.png","4bc95b5313753f1259d80d0596ba6387"],["/xmas-tree/static/media/background.cea7c88c.mp3","cea7c88c349d313a30e24b01aa745e26"],["/xmas-tree/static/media/flowerWatering.88eff4a5.mp3","88eff4a5a641142e01ae02a34aa01909"],["/xmas-tree/static/media/foreground.c72d15e2.png","c72d15e22c6f3ed6b09ee97d68eedcc5"],["/xmas-tree/static/media/magicGrowth.a962f8f5.mp3","a962f8f54178f4c3f5ce4308c4382070"],["/xmas-tree/static/media/supermanBored.ee9ef40e.gif","ee9ef40e78c0d7b45d619302c47b38a7"],["/xmas-tree/static/media/supermanMagic.2df99083.gif","2df990839425c8125c37b7f6c2080f9f"],["/xmas-tree/static/media/tree3.d30ccdbd.png","d30ccdbd74a6d39ea02ce8983b4df17d"],["/xmas-tree/static/media/tree4.f069793e.png","f069793e848ec27a3b0d8f6e49eaaac1"],["/xmas-tree/static/media/xmas.b1f327cc.mp3","b1f327cc561cec3dc4c615a954ea8a31"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,t,a,r){var n=new URL(e);return r&&n.pathname.match(r)||(n.search+=(n.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),n.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],r=new URL(t,self.location),n=createCacheKey(r,hashParamName,a,/\.\w{8}\./);return[r.toString(),n]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var r=new Request(a,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),r="index.html";(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,r),t=urlsToCacheKeys.has(a));var n="/xmas-tree/index.html";!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(a=new URL(n,self.location).toString(),t=urlsToCacheKeys.has(a)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});