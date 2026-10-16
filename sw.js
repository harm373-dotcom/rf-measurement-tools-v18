/* RF Measurement Tools v2.4 PWA — static offline shell. EvaMaps requires a connection. */
'use strict';
const CACHE_NAME = 'rf-measurement-tools-v2.4-pwa-01';
const CACHE_PREFIX = 'rf-measurement-tools-';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './icons/favicon-64.png', './icons/apple-touch-icon.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy)));}
   return response;
  }).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.put(req,copy)));}
  return response;
 })));
});
