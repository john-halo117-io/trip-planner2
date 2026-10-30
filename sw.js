/* Trip Planner service worker.
   App shell: offline, refreshed in the background. Map tiles: cache-first, capped.
   Weather/exchange rates: network-first with offline fallback. Place searches are never cached. */
const SHELL='shell-v6',TILES='tiles-v1',DATA='data-v1',PHOTOS='photos-v1',TILE_CAP=8000,PHOTO_CAP=400;
const SHELL_URLS=['./','./index.html','./app.js','./style.css','./fonts.css','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./vendor/maplibre-gl.js','./vendor/maplibre-gl.css',
 './vendor/fonts/inter-latin-400-normal.woff2','./vendor/fonts/inter-latin-500-normal.woff2','./vendor/fonts/inter-latin-600-normal.woff2','./vendor/fonts/fraunces-latin-600-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.all(SHELL_URLS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>![SHELL,TILES,DATA,PHOTOS].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
let trimming=false;
function trimTiles(){if(trimming)return;trimming=true;caches.open(TILES).then(c=>c.keys().then(ks=>{const extra=ks.length-TILE_CAP;return extra>0?Promise.all(ks.slice(0,extra).map(k=>c.delete(k))):0})).finally(()=>{trimming=false})}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  let u;try{u=new URL(req.url)}catch(_){return}
  if(u.protocol!=='https:'&&u.origin!==location.origin)return;
  if(u.hostname==='tiles.openfreemap.org'){
    e.respondWith(caches.open(TILES).then(c=>c.match(req.url).then(hit=>hit||fetch(req).then(r=>{if(r.ok&&r.type!=='opaque'){c.put(req.url,r.clone());if(Math.random()<0.02)trimTiles()}return r}))));return}
  if(u.hostname==='upload.wikimedia.org'){ // photos you've looked at stay viewable offline
    e.respondWith(caches.open(PHOTOS).then(c=>c.match(req.url).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){c.put(req.url,r.clone());c.keys().then(ks=>{if(ks.length>PHOTO_CAP)ks.slice(0,ks.length-PHOTO_CAP).forEach(k=>c.delete(k))})}return r}))));return}
  if(/\.wikipedia\.org$|^commons\.wikimedia\.org$/.test(u.hostname)){
    e.respondWith(fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(DATA).then(c=>c.put(req,cl))}return r}).catch(()=>caches.match(req).then(h=>h||Response.error())));return}
  if(u.hostname==='photon.komoot.io'||u.hostname==='overpass-api.de')return; // searches go straight to the network, never stored
  if(u.hostname==='api.open-meteo.com'||/^api\.frankfurter\.(app|dev)$/.test(u.hostname)){
    e.respondWith(fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(DATA).then(c=>c.put(req,cl))}return r}).catch(()=>caches.match(req).then(h=>h||Response.error())));return}
  if(u.origin===location.origin){
    e.respondWith(caches.open(SHELL).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>{const net=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>hit||Response.error());return hit||net})));}
});
