/* Trip Planner service worker: app shell offline, map tiles cache-first, live data network-first */
const SHELL='shell-v1',TILES='tiles-v1',DATA='data-v1';
const SHELL_URLS=['./','./index.html','./app.js','./style.css','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./vendor/maplibre-gl.js','./vendor/maplibre-gl.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.all(SHELL_URLS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>![SHELL,TILES,DATA].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.hostname==='tiles.openfreemap.org'){
    e.respondWith(caches.open(TILES).then(c=>c.match(req.url).then(hit=>hit||fetch(req).then(r=>{if(r.ok)c.put(req.url,r.clone());return r}))));return}
  if(/open-meteo|frankfurter|photon\.komoot/.test(u.hostname)){
    e.respondWith(fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(DATA).then(c=>c.put(req,cl))}return r}).catch(()=>caches.match(req)));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
    e.respondWith(caches.open(SHELL).then(c=>c.match(req,{ignoreSearch:u.origin===location.origin}).then(hit=>{const net=fetch(req).then(r=>{if(r.ok||r.type==='opaque')c.put(req,r.clone());return r}).catch(()=>hit);return hit||net})));}
});
