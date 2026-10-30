(function(){
"use strict";var rz;
if(window.top!==window.self){document.documentElement.innerHTML='';throw new Error('framed')}
var LS='scotPinMap.v1', LSUI='scotPinMap.ui2';
var CATS={hike:['Hike / walk','#2f7d4f',180],castle:['Castle / history','#7a4a8c',120],scenic:['Scenic stop','#1f6f9a',30],city:['Town / city','#b0542b',120],food:['Food / drink','#c28a12',75],stay:['Lodging','#3c4447',0]};
var STAGES={library:'Library',queue:'Queue',done:'Done'};
var REF_DATE='2026-11-15';
var ROAD=1.35, KMH=58;
/* default packing list; ids are referenced by the outfit rules */
var GEAR=[
 ['Layers','base_top','Merino / synthetic base-layer top',2],['Layers','base_bot','Long underwear bottoms',1],['Layers','fleece','Grid fleece (ECWCS L2)',1],['Layers','puffy','Synthetic puffy (ECWCS L7 / Nano Puff)',1],['Layers','shell','Waterproof jacket (ECWCS L6 Gore-Tex)',1],['Layers','pants','Stretch softshell hiking pants (L5 / Ferrosi)',2],['Layers','overpants','Waterproof overtrousers (L6)',1],
 ['Head & hands','beanie','Beanie',1],['Head & hands','neck','Neck gaiter / buff',1],['Head & hands','liners','Liner gloves',1],['Head & hands','wgloves','Waterproof gloves',1],
 ['Feet','socks','Wool hiking socks',3],['Feet','boots','Lowa mids (re-proofed)',1],['Feet','gaiters','Leg gaiters',1],['Feet','spikes','Microspikes',1],
 ['Day pack','daypack','Daypack + rain cover / dry bag',1],['Day pack','headlamp','Headlamp + spare batteries',1],['Day pack','thermos','Thermos / water bottle',1],['Day pack','power','Power bank + cable',1],['Day pack','maps','Offline maps downloaded',1],['Day pack','firstaid','First-aid kit',1],['Day pack','snacks','Trail snacks',1],
 ['Town & travel','town','Casual outfit + dry shoes for evenings',1],['Town & travel','docs','Passport + booking confirmations',1],['Town & travel','adapter','UK plug adapter',1]];
var GEARNAME={};GEAR.forEach(function(g){GEARNAME[g[1]]=g[2]});

function $(s){return document.querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function migrate(s){
  if(!s||!s.pins)return null;
  s.trip=s.trip||{start:'',days:7};
  if(!s.v||s.v<2){
    s.pins.forEach(function(p){var st=p.status;p.stage=(st==='want'||st==='booked')?'queue':st==='done'?'done':'library';p.booked=st==='booked';if(p.day>0&&p.stage==='library')p.stage='queue';delete p.status});
    s.v=2;
  }
  s.trip.dayCfg=s.trip.dayCfg||{};
  if(!s.spend)s.spend={rate:1.33,rateManual:false,budgetUsd:null,cur:'GBP',items:[]};
  if(!s.pack)s.pack={items:GEAR.map(function(g){return {id:g[1],group:g[0],name:g[2],qty:g[3],packed:false}})};
  /* sanitize everything that came from storage or a pasted backup */
  function num(v){v=+v;return isFinite(v)?v:null}
  s.pins=s.pins.filter(function(p){return p&&typeof p==='object'});
  s.pins.forEach(function(p){p.id=String(p.id||uid()).replace(/[^\w-]/g,'').slice(0,40)||uid();p.name=String(p.name||'Untitled').slice(0,120);p.notes=String(p.notes||'').slice(0,2000);
    if(!CATS[p.cat])p.cat='scenic';if(!STAGES[p.stage])p.stage='library';p.day=Math.max(0,Math.min(60,parseInt(p.day,10)||0));p.order=num(p.order)||0;
    p.lat=num(p.lat);p.lng=num(p.lng);if(p.lat!=null&&(Math.abs(p.lat)>90))p.lat=null;if(p.lng!=null&&Math.abs(p.lng)>180)p.lng=null;
    p.cost=p.cost==null||p.cost===''?null:num(p.cost);p.mins=p.mins==null||p.mins===''?null:num(p.mins);
    ['slot','conf','swapId'].forEach(function(k){if(p[k]!=null)p[k]=String(p[k]).slice(0,80)})});
  s.trip.days=Math.max(1,Math.min(30,parseInt(s.trip.days,10)||7));s.trip.start=/^\d{4}-\d{2}-\d{2}$/.test(s.trip.start||'')?s.trip.start:'';
  Object.keys(s.trip.dayCfg).forEach(function(k){var c=s.trip.dayCfg[k]||{};if(c.leave&&!/^\d{1,2}:\d{2}$/.test(c.leave))c.leave='08:30';['start','end'].forEach(function(x){if(c[x])c[x]=String(c[x]).replace(/[^\w-]/g,'')})});
  if(s.spend&&s.spend.items)s.spend.items=s.spend.items.filter(function(e){return e&&typeof e==='object'}).map(function(e){return {id:String(e.id||uid()).replace(/[^\w-]/g,''),amt:num(e.amt)||0,cur:e.cur==='USD'?'USD':'GBP',cat:String(e.cat||'other').replace(/[^\w]/g,''),day:Math.max(0,parseInt(e.day,10)||0),note:String(e.note||'').slice(0,120),ts:num(e.ts)||0,src:e.src?String(e.src).replace(/[^\w-]/g,''):undefined}});
  if(s.pack&&s.pack.items)s.pack.items=s.pack.items.filter(function(i){return i&&typeof i==='object'}).map(function(i){return {id:String(i.id||uid()).replace(/[^\w-]/g,''),group:String(i.group||'Other').slice(0,40),name:String(i.name||'').slice(0,100),qty:Math.max(1,parseInt(i.qty,10)||1),packed:!!i.packed}});
  s.pins.forEach(function(p){if(p.stage!=='queue')p.day=0;p.day=p.day||0;if(p.lat==null||p.lng==null){p.lat=null;p.lng=null}});
  s.v=3;return s;
}
var state;
try{state=migrate(JSON.parse(localStorage.getItem(LS)))}catch(e){}
if(!state){try{state=migrate(JSON.parse(document.getElementById('seed').textContent))}catch(e){}}
if(!state)state=migrate({v:2,updated:0,trip:{start:'',days:7},pins:[]});
var ui={tab:'queue',day:1,cat:'all',showLib:false,min:false,t:null,q:''};
try{var u=JSON.parse(localStorage.getItem(LSUI));if(u)for(var k in u)ui[k]=u[k]}catch(e){}
(function(){var T={queue:1,plan:1,pack:1,spend:1,library:1,done:1};if(!T[ui.tab])ui.tab='queue';ui.day=Math.max(1,parseInt(ui.day,10)||1);if(ui.cat!=='all'&&!CATS[ui.cat])ui.cat='all';ui.q=String(ui.q||'').slice(0,60);ui.min=!!ui.min;ui.showLib=!!ui.showLib;
  var v=ui.view;if(!(v&&v.c&&isFinite(v.c[0])&&isFinite(v.c[1])&&Math.abs(v.c[0])<=180&&Math.abs(v.c[1])<=85&&isFinite(v.z)&&v.z>=0&&v.z<=20))ui.view=null;if(ui.spCat&&!/^\w+$/.test(ui.spCat))ui.spCat='food'})();
if(ui.day>state.trip.days)ui.day=1;
function saveUI(){try{localStorage.setItem(LSUI,JSON.stringify(ui))}catch(e){}}

/* ---------- persistence (this device) + live data ---------- */
var timer=null,editing=false,pending=false,fxRate=null,fxAt='',wx=state.wx||null,geo=null;
if(state.fx){fxRate=state.fx.gbpUsd;fxAt=state.fx.at}
function setSave(t){var el=$('#save');if(el)el.textContent=t}
function persist(){try{localStorage.setItem(LS,JSON.stringify(state));setSave('Saved')}catch(e){setSave('Couldn’t save — storage full?')}}
function commit(){state.updated=Date.now();persist();clearTimeout(timer);timer=setTimeout(function(){if(planKey()!==(wx&&wx.key))refreshWx(true)},1500)}
function busyInput(){return false}
document.addEventListener('visibilitychange',function(){if(document.hidden)saveUI();else maybeRefresh()});
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
var WMO={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Showers',81:'Heavy showers',82:'Violent showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'};
var wxBusy=false;
function planKey(){var a=[];for(var n=1;n<=state.trip.days;n++){var b=wxPlace(n);a.push(isoDate(n)+':'+(b?b.lat.toFixed(2)+','+b.lng.toFixed(2):''))}return a.join('|')}
function refreshWx(force){
  if(wxBusy||!state.trip.start)return Promise.resolve();
  var today=new Date().toISOString().slice(0,10),lim=new Date(Date.now()+15*864e5).toISOString().slice(0,10),groups={};
  for(var n=1;n<=state.trip.days;n++){var d=isoDate(n),b=wxPlace(n);if(!d||!b||d<today||d>lim)continue;var k=b.lat.toFixed(2)+','+b.lng.toFixed(2);(groups[k]=groups[k]||{p:b,dates:[]}).dates.push(d)}
  var keys=Object.keys(groups);if(!keys.length)return Promise.resolve();
  if(!force&&wx&&wx.fetchedAt&&Date.now()-Date.parse(wx.fetchedAt)<3*3600e3&&wx.key===planKey())return Promise.resolve();
  wxBusy=true;var days=Object.assign({},(wx&&wx.days)||{}),ok=0;
  return Promise.all(keys.map(function(k){var g=groups[k];
    var u='https://api.open-meteo.com/v1/forecast?latitude='+g.p.lat.toFixed(3)+'&longitude='+g.p.lng.toFixed(3)+'&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max&wind_speed_unit=mph&timezone=Europe%2FLondon&forecast_days=16';
    return fetch(u).then(function(r){return r.json()}).then(function(j){var D=j&&j.daily;if(!D)return;ok++;
      D.time.forEach(function(t,i){if(g.dates.indexOf(t)<0)return;var mm=D.precipitation_sum[i],pp=D.precipitation_probability_max[i];if(pp==null)pp=mm>=5?80:mm>=1?50:20;
        days[t]={place:g.p.name,hiC:D.temperature_2m_max[i],loC:D.temperature_2m_min[i],feelsC:D.apparent_temperature_min[i],rainPct:pp,rainMm:mm,windMph:Math.round(D.wind_speed_10m_max[i]||0),gustMph:Math.round(D.wind_gusts_10m_max[i]||0),summary:WMO[D.weather_code[i]]||'',source:'Open-Meteo'}})
    }).catch(function(){})
  })).then(function(){wxBusy=false;if(!ok)return;wx={fetchedAt:new Date().toISOString(),days:days,key:planKey()};state.wx=wx;persist();render()});
}
function refreshFx(force){
  if(!force&&state.fx&&Date.now()-(state.fx.ts||0)<12*3600e3)return;
  fetch('https://api.frankfurter.dev/v1/latest?base=GBP&symbols=USD').then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return fetch('https://api.frankfurter.app/latest?from=GBP&to=USD').then(function(r){return r.json()})}).then(function(j){var v=j&&j.rates&&j.rates.USD;if(v>1&&v<2){fxRate=v;fxAt=new Date().toISOString();state.fx={gbpUsd:v,at:fxAt,ts:Date.now()};persist();renderTabs();if(ui.tab==='spend')renderPanel()}}).catch(function(){});
}
function maybeRefresh(){refreshWx(false);refreshFx(false)}
function shareOrDownload(name,text,mime){
  try{var f=new File([text],name,{type:mime||'text/csv'});if(navigator.canShare&&navigator.canShare({files:[f]})){return navigator.share({files:[f],title:name}).then(function(){return 'shared'},function(e){if(e&&e.name==='AbortError')return 'cancelled';throw e})}}catch(e){}
  return new Promise(function(res){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:mime||'text/csv'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);res('saved')});
}
/* ---------- undo toast ---------- */
var undoSnap=null,toastT=null;
function snap(){return JSON.stringify(state)}
function toast(msg,snapshot){
  undoSnap=snapshot||null;var el=$('#toast');
  el.innerHTML='<span>'+esc(msg)+'</span>'+(snapshot?'<button id="undoB">Undo</button>':'');el.classList.add('on');
  if(snapshot)$('#undoB').onclick=function(){state=migrate(JSON.parse(undoSnap));undoSnap=null;commit();render();el.classList.remove('on')};
  clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('on')},snapshot?6000:2600);
}

/* ---------- helpers ---------- */
function hasLoc(p){return !!p&&p.lat!=null&&p.lng!=null}
function isoDate(n){if(!state.trip.start)return '';var d=new Date(state.trip.start+'T12:00:00Z');if(isNaN(d))return '';d.setUTCDate(d.getUTCDate()+n-1);return d.toISOString().slice(0,10)}
function dayDate(n){var i=isoDate(n);if(!i)return '';return new Date(i+'T12:00:00Z').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',timeZone:'UTC'})}
function dayLabel(n){if(!n)return 'Not on a day';var d=dayDate(n);return 'Day '+n+(d?' · '+d:'')}
function km(a,b){var R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x))}
function driveMin(a,b){return Math.max(5,Math.round(km(a,b)*ROAD/KMH*60/5)*5)}
function gmaps(p){return 'https://www.google.com/maps/search/?api=1&query='+(hasLoc(p)?p.lat.toFixed(5)+','+p.lng.toFixed(5):encodeURIComponent(p.name+' Scotland'))}
function gdir(a,b){return 'https://www.google.com/maps/dir/?api=1&origin='+a.lat+','+a.lng+'&destination='+b.lat+','+b.lng+'&travelmode=driving'}
function uid(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function byId(id){if(!id)return null;for(var i=0;i<state.pins.length;i++)if(state.pins[i].id===id)return state.pins[i];return null}
function catOk(p){return ui.cat==='all'||p.cat===ui.cat}
function inStage(s){return state.pins.filter(function(p){return p.stage===s})}
function dayPins(n){return state.pins.filter(function(p){return p.stage==='queue'&&p.day===n}).sort(function(a,b){return (a.order||0)-(b.order||0)})}
function unplanned(){return state.pins.filter(function(p){return p.stage==='queue'&&!p.day}).sort(function(a,b){return (a.order||0)-(b.order||0)})}
function nextOrder(){return state.pins.reduce(function(m,p){return Math.max(m,p.order||0)},0)+1}
function mins(p){return p.mins!=null&&p.mins!==''?+p.mins:(CATS[p.cat]||CATS.scenic)[2]}
function hm(m){m=Math.round(m);var h=Math.floor(((m%1440)+1440)%1440/60),mm=((m%60)+60)%60;return (h<10?'0':'')+h+':'+(mm<10?'0':'')+mm}
function dur(m){m=Math.round(m);var h=Math.floor(m/60),r=m%60;return h?(h+'h'+(r?' '+r+'m':'')):r+'m'}
function money(n){return '£'+(Math.round(n*100)/100).toFixed(n%1?2:0)}
function cfg(n){return state.trip.dayCfg[n]||(state.trip.dayCfg[n]={})}
function startBase(n,depth){depth=depth||0;var c=state.trip.dayCfg[n]||{};if(c.start)return byId(c.start);if(n>1&&depth<40)return endBase(n-1,depth+1);return null}
function endBase(n,depth){var c=state.trip.dayCfg[n]||{};if(c.end)return byId(c.end);return startBase(n,(depth||0)+1)}
function wxPlace(n){var b=startBase(n);if(hasLoc(b))return b;var s=dayPins(n).filter(hasLoc)[0];return s||null}
function parseCoords(s){
  s=String(s||'');var m=s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||s.match(/[?&](?:q|query|ll|destination)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i)||s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)||s.match(/(-?\d{1,2}\.\d{2,})\s*[, ]\s*(-?\d{1,3}\.\d{2,})/);
  if(!m)return null;var la=+m[1],lo=+m[2];if(Math.abs(la)>90||Math.abs(lo)>180)return null;return{lat:la,lng:lo};
}
function nameFromLink(s){var m=String(s).match(/\/place\/([^\/@?]+)/);if(m){try{return decodeURIComponent(m[1].replace(/\+/g,' '))}catch(e){}}return ''}
function findExisting(q){q=q.toLowerCase().trim();if(q.length<4)return null;var hits=state.pins.filter(function(p){return p.name.toLowerCase().indexOf(q)>=0});return hits.length?hits[0]:null}

/* ---------- sun & day budget ---------- */
var ldnFmt;try{ldnFmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',hour12:false})}catch(e){}
function ldnMin(d){if(!ldnFmt)return d.getUTCHours()*60+d.getUTCMinutes();var p=ldnFmt.format(d).split(':');return (+p[0])*60+(+p[1])}
function sun(iso,lat,lng){
  var r=Math.PI/180,day=new Date(iso+'T12:00:00Z'),J=day.getTime()/864e5+2440587.5,n=Math.ceil(J-2451545+0.0008),Js=n-lng/360;
  var M=(357.5291+0.98560028*Js)%360,C=1.9148*Math.sin(M*r)+0.02*Math.sin(2*M*r)+0.0003*Math.sin(3*M*r),L=(M+C+180+102.9372)%360;
  var Jt=2451545+Js+0.0053*Math.sin(M*r)-0.0069*Math.sin(2*L*r),dec=Math.asin(Math.sin(L*r)*Math.sin(23.4397*r));
  var cw=(Math.sin(-0.833*r)-Math.sin(lat*r)*Math.sin(dec))/(Math.cos(lat*r)*Math.cos(dec));if(cw<-1||cw>1)return null;var w=Math.acos(cw)/r;
  function d(j){return new Date((j-2440587.5)*864e5)}
  return {rise:ldnMin(d(Jt-w/360)),set:ldnMin(d(Jt+w/360))};
}
function parseHM(s){var m=String(s||'').match(/^(\d{1,2}):(\d{2})/);return m?(+m[1])*60+(+m[2]):510}
function dayRouteLink(dp){
  var seq=[];if(hasLoc(dp.start))seq.push(dp.start);dp.rows.forEach(function(r){if(hasLoc(r.p))seq.push(r.p)});if(hasLoc(dp.end)&&seq[seq.length-1]!==dp.end)seq.push(dp.end);
  if(seq.length<2)return '';
  var ll=function(p){return p.lat.toFixed(5)+','+p.lng.toFixed(5)},mid=seq.slice(1,-1);
  var u='https://www.google.com/maps/dir/?api=1&origin='+ll(seq[0])+'&destination='+ll(seq[seq.length-1])+(mid.length?'&waypoints='+mid.map(ll).join('%7C'):'')+'&travelmode=driving';
  return '<a class="btn sm gm" href="'+u+'" target="_blank" rel="noopener">Open today’s route in Google Maps ↗</a>'+(mid.length>3?'<div class="small o" style="margin-top:3px">The phone app may only show the first few stops. Use the per-stop directions links below if it cuts some off.</div>':'');
}
function dayPlan(n){
  var c=state.trip.dayCfg[n]||{},sb=startBase(n),eb=endBase(n),stops=dayPins(n),t=parseHM(c.leave||'08:30'),drive=0,onsite=0,rows=[],prev=hasLoc(sb)?sb:null,warn=[];
  var ref=wxPlace(n)||{lat:57,lng:-4.5},date=isoDate(n)||REF_DATE,s=sun(date,ref.lat,ref.lng)||{rise:465,set:960};
  stops.forEach(function(p){
    var leg=0;if(prev&&hasLoc(p)){leg=driveMin(prev,p);drive+=leg;t+=leg}
    var arrive=t,m=mins(p);onsite+=m;t+=m;
    var r={p:p,leg:leg,from:prev,arrive:arrive,leave:t,late:false};
    if(p.cat==='hike'&&t>s.set-20){r.late=true;warn.push(p.name+' finishes after dark')}
    if(p.slot){var sm=parseHM(p.slot);if(/^\d/.test(p.slot)&&arrive>sm+10){r.miss=true;warn.push('Late for '+p.name+' ('+p.slot+')')}}
    rows.push(r);if(hasLoc(p))prev=p;
  });
  var back=0;if(prev&&hasLoc(eb)&&prev!==eb){back=driveMin(prev,eb);drive+=back;t+=back}
  var cost=stops.reduce(function(a,p){return a+(+p.cost||0)},0);
  if(t>s.set+60)warn.push(dur(t-s.set)+' of driving after sunset');
  return {rows:rows,start:sb,end:eb,back:back,lastStop:prev,leaveAt:parseHM(c.leave||'08:30'),finish:t,drive:drive,onsite:onsite,sun:s,date:date,estDate:!isoDate(n),warn:warn,cost:cost};
}

/* ---------- weather & outfit ---------- */
function wxFor(n){var d=isoDate(n);if(!d||!wx||!wx.days)return null;return wx.days[d]||null}
function cF(c){return Math.round(c*9/5+32)}
function isWet(w){return w&&((+w.rainPct||0)>=70||(+w.gustMph||0)>=40)}
function outfit(n){
  var w=wxFor(n),stops=dayPins(n),hike=stops.some(function(p){return p.cat==='hike'}),high=stops.some(function(p){return p.cat==='hike'&&p.high});
  var est=!w,hi=w?+w.hiC:8,lo=w?+w.loC:3,rain=w?+w.rainPct||0:60,gust=w?+w.gustMph||0:30,feels=w&&w.feelsC!=null?+w.feelsC:lo-(gust>30?3:1),sum=w?String(w.summary||''):'';
  var wear=[],pack=[],alerts=[];
  function W(id){if(wear.indexOf(id)<0)wear.push(id)}function P(id){if(wear.indexOf(id)<0&&pack.indexOf(id)<0)pack.push(id)}
  W('base_top');W('socks');W('pants');W('boots');
  if(hi<=6)W('base_bot');
  if(hi<13)W('fleece');
  if(feels<=4)W('puffy');else if(hike||hi<10)P('puffy');
  if(rain>=40||gust>=25)W('shell');else P('shell');
  if(hike){if(rain>=60)W('overpants');else P('overpants')}
  if(lo<=7||feels<=5)W('beanie');
  if(gust>=30||feels<=2)W('neck');
  if(hi<=10)W('liners');
  if((rain>=50&&hi<=9)||lo<=1)W('wgloves');else if(hike)P('wgloves');
  if(hike&&rain>=50)W('gaiters');
  if(high&&lo<=3)P('spikes');
  if(hike||rain>=40)P('daypack');
  if(hike){P('headlamp');P('thermos');P('firstaid');P('snacks')}
  P('power');P('maps');
  if(gust>=45)alerts.push('Gusts around '+gust+' mph — stay off exposed ridges and summits; consider a swap.');
  if(hike&&rain>=80)alerts.push('Heavy rain: burns rise fast. Skip river crossings and stepping stones (Lost Valley, Fairy Pools).');
  if(high&&lo<=1)alerts.push('Freezing on the tops — expect ice above ~600 m.');
  if(/snow|sleet/i.test(sum))alerts.push('Snow or sleet in the forecast — check road conditions (Traffic Scotland) before high passes.');
  if(hike)alerts.push('Dark by about 4pm — headlamp in the pack.');
  return {w:w,est:est,hi:hi,lo:lo,rain:rain,gust:gust,feels:feels,wear:wear,pack:pack,alerts:alerts,hike:hike};
}
function gearName(id){var it=state.pack.items.filter(function(i){return i.id===id})[0];return it?it.name:(GEARNAME[id]||id)}


/* ---------- spending ---------- */
var SPC={lodging:['Lodging','#3c4447'],food:['Food & drink','#c28a12'],fuel:['Fuel & car','#b0542b'],tickets:['Tickets & entry','#7a4a8c'],transport:['Ferries, trains & parking','#1f6f9a'],gear:['Gear','#2f7d4f'],gifts:['Gifts','#c2577a'],other:['Other','#8a9497']};
function rate(){return (!state.spend.rateManual&&fxRate)?fxRate:(+state.spend.rate||1.33)}
function usd(e){return e.cur==='USD'?+e.amt:+e.amt*rate()}
function gbp(e){return e.cur==='USD'?+e.amt/rate():+e.amt}
function usdf(n){return '$'+Math.round(n).toLocaleString()}
function gbpf(n){return '£'+(Math.round(n*100)/100).toLocaleString(undefined,{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})}
function tripDayToday(){if(!state.trip.start)return 0;var t=new Date(),s=new Date(state.trip.start+'T00:00:00'),d=Math.floor((t-s)/864e5)+1;if(d<1)return 0;if(d>state.trip.days)return ui.day;return d}
function spCatFor(p){return p.cat==='stay'?'lodging':p.cat==='food'?'food':'tickets'}

/* Quick add: one place per line. */
function quickAdd(text,day){
  var lines=String(text).split(/\n+/).map(function(l){return l.trim()}).filter(Boolean),before=snap(),added=0,moved=0,already=0,noLoc=0,last=null;
  lines.forEach(function(line){
    var c=parseCoords(line),nm=nameFromLink(line);
    if(!c&&!/^https?:/i.test(line)){var ex=findExisting(line);
      if(ex){if(ex.stage==='queue'&&(!day||ex.day===day)){already++;return}ex.stage='queue';ex.order=nextOrder();if(day)ex.day=day;ex.seed=false;moved++;last=ex;return}}
    if(!nm)nm=c?line.replace(/https?:\/\/\S+/g,'').replace(/-?\d{1,3}\.\d+\s*[, ]\s*-?\d{1,3}\.\d+/,'').replace(/[,;:\-–]+\s*$/,'').trim():line;
    if(/^https?:/i.test(nm)||!nm)nm=c?'Pin at '+c.lat.toFixed(3)+', '+c.lng.toFixed(3):'Unnamed place';
    var p={id:uid(),name:nm.slice(0,80),lat:c?c.lat:null,lng:c?c.lng:null,cat:'scenic',stage:'queue',booked:false,day:day||0,order:nextOrder(),notes:''};
    if(!c)noLoc++;state.pins.push(p);added++;last=p;
  });
  if(!added&&!moved){toast(already?'Already in your queue':'Nothing to add');return}
  commit();render();
  var msg=[];if(added)msg.push(added+' added');if(moved)msg.push(moved+' pulled from Library');if(already)msg.push(already+' already queued');
  toast(msg.join(' · ')+(noLoc?' — '+noLoc+' need a location':''),before);
  if(last&&hasLoc(last)&&lines.length===1)flyTo(last,4);
}

/* ---------- layout ---------- */
$('#app').innerHTML=
'<header><div class="grow"><h1>Trip Planner</h1><div class="sub" id="sub"></div></div><span class="save" id="save"></span><button class="btn" id="bTrip">Trip</button></header>'+
'<div id="mapwrap"><div id="map"></div><div id="hint"></div>'+
'<div class="fabs"><button class="btn primary" id="bAdd">+ Pin</button><button class="btn" id="bFit" title="Reset view">⤢</button></div><div id="legend"></div></div>'+
'<section id="panel"><div class="tabs" id="tabs"></div><div id="pbody"></div></section>'+
'<div id="toast"></div><div class="ov hidden" id="ov"><div class="sheet" id="sheet"></div></div><div class="lb hidden" id="lb"></div>';
$('#legend').innerHTML=Object.keys(CATS).map(function(k){return '<span><i class="sw" style="background:'+CATS[k][1]+'"></i>'+CATS[k][0]+'</span>'}).join('')+'<span><i class="sw base"></i>Base</span>';

$('#lb').onclick=function(e){var n=e.target.closest('.lbn');if(n){e.stopPropagation();lbI=(lbI+(+n.getAttribute('data-d'))+lbList.length)%lbList.length;drawLb();return}if(e.target.closest('a'))return;$('#lb').classList.add('hidden')};
document.addEventListener('keydown',function(e){if($('#lb').classList.contains('hidden'))return;if(e.key==='Escape')$('#lb').classList.add('hidden');if(e.key==='ArrowRight'||e.key==='ArrowLeft'){lbI=(lbI+(e.key==='ArrowRight'?1:-1)+lbList.length)%lbList.length;drawLb()}});
/* ---------- map (MapLibre + OpenFreeMap) ---------- */
var STYLE='https://tiles.openfreemap.org/styles/liberty';
var map=null,mapReady=false,addMode=null,selId=null,HOME={c:[-4.6,57.0],z:5.3};
function fc(f){return {type:'FeatureCollection',features:f}}
function initMap(){
  if(!window.maplibregl){$('#mapwrap').insertAdjacentHTML('beforeend','<div class="mapfail">The map needs a connection the first time. Everything else works offline.</div>');return}
  var v=ui.view||HOME;
  map=new maplibregl.Map({container:'map',style:STYLE,center:v.c,zoom:v.z,attributionControl:{compact:true},dragRotate:false,pitchWithRotate:false,maxPitch:0});
  try{map.touchZoomRotate.disableRotation()}catch(e){}
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-left');
  geo=new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:true},trackUserLocation:true,showUserLocation:true,showAccuracyCircle:true,fitBoundsOptions:{maxZoom:13}});
  map.addControl(geo,'top-left');
  map.addControl(new maplibregl.ScaleControl({unit:'imperial'}),'bottom-right');
  map.on('load',function(){
    map.addSource('route',{type:'geojson',data:fc([])});
    map.addSource('pins',{type:'geojson',data:fc([])});
    map.addLayer({id:'route',type:'line',source:'route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#2b5d6b','line-width':3.5,'line-dasharray':[1.5,1.2],'line-opacity':.85}});
    map.addLayer({id:'pins',type:'circle',source:'pins',paint:{'circle-color':['get','color'],'circle-radius':['get','r'],'circle-opacity':['get','op'],'circle-stroke-color':['get','sc'],'circle-stroke-width':['get','sw'],'circle-stroke-opacity':['get','op']}});
    map.addLayer({id:'pin-num',type:'symbol',source:'pins',filter:['!=',['get','num'],''],layout:{'text-field':['get','num'],'text-size':11,'text-font':['Noto Sans Bold'],'text-allow-overlap':true,'text-ignore-placement':true},paint:{'text-color':'#ffffff'}});
    map.addLayer({id:'pin-lbl',type:'symbol',source:'pins',minzoom:8,filter:['!=',['get','role'],'lib'],layout:{'text-field':['get','name'],'text-size':12,'text-font':['Noto Sans Bold'],'text-offset':[0.95,0],'text-anchor':'left','text-max-width':12},paint:{'text-color':'#1f2a2e','text-halo-color':'#ffffff','text-halo-width':1.6}});
    mapReady=true;drawPins();drawRoute();
  });
  map.on('click','pins',function(e){if(addMode)return;var f=e.features&&e.features[0];if(f){e.originalEvent&&(e.originalEvent._pin=1);openEditor(f.properties.id)}});
  map.on('mouseenter','pins',function(){map.getCanvas().style.cursor='pointer'});
  map.on('mouseleave','pins',function(){map.getCanvas().style.cursor=''});
  map.on('click',function(e){
    if(!addMode){if(map.queryRenderedFeatures(e.point,{layers:['pins']}).length)return;var l=landmarkAt(e.point);if(l)openLandmark(l,e.lngLat);return}var ll=e.lngLat,m=addMode;setAdd(null);
    if(m.move){var p=byId(m.move);p.lat=+ll.lat.toFixed(5);p.lng=+ll.lng.toFixed(5);commit();render();openEditor(p.id);return}
    var p={id:uid(),name:'New pin',lat:+ll.lat.toFixed(5),lng:+ll.lng.toFixed(5),cat:'scenic',stage:'queue',booked:false,day:ui.tab==='plan'?ui.day:0,order:nextOrder(),notes:''};
    state.pins.push(p);commit();render();openEditor(p.id,true);
  });
  map.on('moveend',function(){var c=map.getCenter();ui.view={c:[+c.lng.toFixed(4),+c.lat.toFixed(4)],z:+map.getZoom().toFixed(2)};saveUI()});
  map.on('error',function(){});
}
function mapPins(){
  var out=[],qn=inStage('queue').length,bases={};
  if(ui.tab==='plan'||ui.tab==='pack'){var sb=startBase(ui.day),eb=endBase(ui.day);if(hasLoc(sb))bases[sb.id]=1;if(hasLoc(eb))bases[eb.id]=1}
  state.pins.forEach(function(p){
    if(!hasLoc(p))return;var role=null;
    if(bases[p.id])role='base';
    else if(!catOk(p))return;
    else if(ui.tab==='plan'||ui.tab==='pack'){if(p.stage==='queue')role=p.day===ui.day?'planned':(!p.day&&ui.tab==='plan'?'cand':null)}
    else if(ui.tab==='library'){if(p.stage==='library')role='lib'}
    else if(ui.tab==='done'){if(p.stage==='done')role='donep'}
    else{if(p.stage==='queue')role='q';else if((ui.showLib||!qn)&&p.stage==='library')role='lib'}
    if(role)out.push({p:p,role:role});
  });
  return out;
}
function drawPins(){
  if(!mapReady)return;var idx={};
  if(ui.tab==='plan'||ui.tab==='pack')dayPins(ui.day).forEach(function(p,i){idx[p.id]=i+1});
  var feats=mapPins().map(function(d){var p=d.p,r=d.role,c=(CATS[p.cat]||CATS.scenic)[1],sel=p.id===selId;
    return {type:'Feature',geometry:{type:'Point',coordinates:[p.lng,p.lat]},properties:{id:p.id,name:p.name,role:r,
      color:r==='base'?'#ffffff':r==='donep'?'#8a9497':c,r:r==='planned'||r==='base'?10:r==='lib'||r==='cand'?6:8,op:r==='lib'?.55:r==='cand'?.6:1,
      sc:sel||r==='base'?'#1f2a2e':'#ffffff',sw:sel?3.5:r==='base'?3:2,num:r==='planned'?String(idx[p.id]):''}}});
  feats.sort(function(a,b){var ra=a.properties.role==='planned'||a.properties.role==='base'?1:0,rb=b.properties.role==='planned'||b.properties.role==='base'?1:0;return ra-rb});
  map.getSource('pins').setData(fc(feats));
}
function drawRoute(){
  if(!mapReady)return;var seq=[];
  if(ui.tab==='plan'||ui.tab==='pack'){var sb=startBase(ui.day),eb=endBase(ui.day);if(hasLoc(sb))seq.push(sb);seq=seq.concat(dayPins(ui.day).filter(hasLoc));if(hasLoc(eb)&&seq.length&&seq[seq.length-1]!==eb)seq.push(eb)}
  map.getSource('route').setData(fc(seq.length>1?[{type:'Feature',geometry:{type:'LineString',coordinates:seq.map(function(p){return [p.lng,p.lat]})},properties:{}}]:[]));
}
function fit(){if(map)map.flyTo({center:HOME.c,zoom:HOME.z,duration:700})}
function flyTo(p,k){if(!hasLoc(p)||!map)return;map.flyTo({center:[p.lng,p.lat],zoom:Math.max(map.getZoom(),6+(k||4)),duration:700})}
function fitTo(l){
  l=l.filter(hasLoc);if(!l.length||!map)return;if(l.length===1){flyTo(l[0],4);return}
  var b=new maplibregl.LngLatBounds();l.forEach(function(p){b.extend([p.lng,p.lat])});
  map.fitBounds(b,{padding:{top:60,bottom:40,left:60,right:60},maxZoom:12,duration:700});
}
function fitDay(n){var l=dayPins(n).slice(),sb=startBase(n),eb=endBase(n);if(sb)l.push(sb);if(eb)l.push(eb);fitTo(l)}
function setAdd(m){addMode=m;$('#mapwrap').classList.toggle('adding',!!m);var h=$('#hint');h.style.display=m?'block':'none';h.textContent=m&&m.move?'Tap the spot for “'+(byId(m.move)||{}).name+'”':'Tap the map to drop a pin';$('#bAdd').textContent=m?'Cancel':'+ Pin';$('#bAdd').classList.toggle('primary',!m)}
$('#bAdd').onclick=function(){setAdd(addMode?null:{})};
$('#bFit').onclick=function(){fit()};


/* ---------- photos & info (Wikipedia + Wikimedia Commons, free & keyless) ---------- */
var infoCache={};
function stripTags(s){var d=document.createElement('div');d.innerHTML=String(s||'').replace(/<(script|style)[\s\S]*?<\/\1>/gi,'');return (d.textContent||'').replace(/\s+/g,' ').trim()}
function jget(u){return fetch(u).then(function(r){if(!r.ok)throw 0;return r.json()})}
var WP='https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query';
var WC='https://commons.wikimedia.org/w/api.php?format=json&origin=*&action=query';
function norm(s){return String(s||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\b(the|of|and|a)\b/g,' ').replace(/\s+/g,' ').trim()}
function similar(a,b){a=norm(a);b=norm(b);if(!a||!b)return false;if(a===b||a.indexOf(b)>=0||b.indexOf(a)>=0)return true;var A=a.split(' '),B=b.split(' '),hit=A.filter(function(w){return w.length>2&&B.indexOf(w)>=0}).length;return hit>=Math.min(2,Math.max(1,Math.min(A.length,B.length)-0))}
function wikiArticle(name,lat,lng){
  var near=lat!=null?jget(WP+'&list=geosearch&gscoord='+lat.toFixed(5)+'|'+lng.toFixed(5)+'&gsradius=3000&gslimit=12').then(function(j){var g=(j.query&&j.query.geosearch)||[];var m=g.filter(function(x){return similar(x.title,name)})[0];return m?m.title:null}).catch(function(){return null}):Promise.resolve(null);
  return near.then(function(t){if(t)return t;return jget(WP+'&list=search&srlimit=3&srsearch='+encodeURIComponent(name+' Scotland')).then(function(j){var s=(j.query&&j.query.search)||[];var m=s.filter(function(x){return similar(x.title,name)})[0];return m?m.title:null}).catch(function(){return null})})
  .then(function(t){if(!t)return null;return jget(WP+'&prop=extracts|pageimages|info&inprop=url&exintro=1&explaintext=1&exsentences=3&piprop=thumbnail&pithumbsize=900&titles='+encodeURIComponent(t)).then(function(j){var ps=j.query&&j.query.pages;if(!ps)return null;var p=ps[Object.keys(ps)[0]];if(!p||p.missing!=null)return null;return {title:p.title,extract:p.extract||'',url:p.fullurl||('https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title)),thumb:p.thumbnail&&p.thumbnail.source}})}).catch(function(){return null});
}
function commonsPhotos(lat,lng,radius){
  if(lat==null)return Promise.resolve([]);
  return jget(WC+'&generator=geosearch&ggsnamespace=6&ggscoord='+lat.toFixed(5)+'|'+lng.toFixed(5)+'&ggsradius='+(radius||800)+'&ggslimit=24&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=640&iiextmetadatafilter=Artist|LicenseShortName|ObjectName|ImageDescription')
  .then(function(j){var ps=(j.query&&j.query.pages)||{};return Object.keys(ps).map(function(k){var p=ps[k],ii=p.imageinfo&&p.imageinfo[0];if(!ii||!/jpe?g|png|webp/.test(ii.mime||''))return null;var md=ii.extmetadata||{};
    return {thumb:ii.thumburl,full:ii.thumburl&&ii.thumburl.replace(/\/\d+px-/,'/1280px-'),page:ii.descriptionurl,credit:stripTags(md.Artist&&md.Artist.value).slice(0,80),lic:stripTags(md.LicenseShortName&&md.LicenseShortName.value),cap:stripTags((md.ImageDescription&&md.ImageDescription.value)||(md.ObjectName&&md.ObjectName.value)||p.title.replace(/^File:|\.\w+$/g,'')).slice(0,140)}}).filter(function(x){return x&&x.thumb&&/^https:\/\/upload\.wikimedia\.org\//.test(x.thumb)}).slice(0,14)}).catch(function(){return []});
}
function placeInfo(name,lat,lng,radius){
  var key=name+'|'+(lat!=null?lat.toFixed(3)+','+lng.toFixed(3):'');if(infoCache[key])return infoCache[key];
  var pr=Promise.all([wikiArticle(name,lat,lng),commonsPhotos(lat,lng,radius)]).then(function(r){var art=r[0],ph=r[1];if(art&&art.thumb&&/^https:\/\/upload\.wikimedia\.org\//.test(art.thumb)&&!ph.some(function(x){return x.thumb===art.thumb}))ph.unshift({thumb:art.thumb,full:art.thumb,page:art.url,credit:'Wikipedia',lic:'',cap:art.title});return {art:art,photos:ph}});
  infoCache[key]=pr;return pr;
}
var lbList=[],lbI=0;
function showLightbox(list,i){lbList=list;lbI=i;var el=$('#lb');el.classList.remove('hidden');drawLb()}
function drawLb(){var x=lbList[lbI];if(!x)return;$('#lb').innerHTML='<img src="'+esc(x.full||x.thumb)+'" alt="">'+
  '<div class="lbcap">'+esc(x.cap||'')+'<br><span class="o">'+esc([x.credit,x.lic].filter(Boolean).join(' · '))+' · <a href="'+esc(x.page)+'" target="_blank" rel="noopener">source</a></span></div>'+
  (lbList.length>1?'<button class="lbn l" data-d="-1">‹</button><button class="lbn r" data-d="1">›</button>':'')+'<button class="lbx">✕</button><div class="lbi">'+(lbI+1)+' / '+lbList.length+'</div>'}
function fillPhotos(el,name,lat,lng,radius){
  if(!el)return;el.innerHTML='<div class="small o">Loading photos…</div>';
  placeInfo(name,lat,lng,radius).then(function(r){if(!el.isConnected)return;var h='';
    if(r.photos.length){h+='<div class="strip">'+r.photos.map(function(x,i){return '<img loading="lazy" src="'+esc(x.thumb)+'" alt="'+esc(x.cap)+'" data-i="'+i+'">'}).join('')+'</div><div class="small o" style="margin-top:3px">Photos from Wikimedia Commons, taken near this spot. Tap to enlarge and see credits.</div>'}
    else h+='<div class="small o">No photos found nearby.</div>';
    if(r.art&&r.art.extract)h+='<p class="blurb">'+esc(r.art.extract)+' <a href="'+esc(r.art.url)+'" target="_blank" rel="noopener">Wikipedia ↗</a></p>';
    el.innerHTML=h;$$('img[data-i]',el).forEach(function(im){im.onclick=function(){showLightbox(r.photos,+im.getAttribute('data-i'))};im.onerror=function(){im.remove()}});
  });
}
/* tapping a landmark, peak or town on the base map */
var LM_LAYERS=['poi','mountain_peak','place','water_name','aerodrome_label','park'];
function landmarkAt(point){
  if(!map)return null;var fs=map.queryRenderedFeatures([[point.x-8,point.y-8],[point.x+8,point.y+8]]).filter(function(f){var sl=f.sourceLayer||'';var p=f.properties||{};return LM_LAYERS.indexOf(sl)>=0&&(p['name:en']||p.name_en||p.name)&&f.layer&&f.layer.type==='symbol'});
  if(!fs.length)return null;var f=fs[0],p=f.properties,g=f.geometry,c=g&&g.type==='Point'?g.coordinates:null;
  return {name:String(p['name:en']||p.name_en||p.name).slice(0,100),kind:String(p.subclass||p.class||f.sourceLayer||'').replace(/_/g,' '),ele:p.ele,lng:c?c[0]:null,lat:c?c[1]:null,layer:f.sourceLayer};
}
function guessCatLM(l){var k=(l.kind||'')+' '+l.layer;if(/peak|mountain|volcano|saddle/.test(k))return 'hike';if(/castle|ruins|monument|memorial|museum|attraction|historic|place_of_worship|church/.test(k))return 'castle';if(/restaurant|pub|cafe|bar|fast food|brewery|food/.test(k))return 'food';if(/hotel|hostel|guest|lodging|camp/.test(k))return 'stay';if(/place|city|town|village|hamlet/.test(k))return 'city';return 'scenic'}
function openLandmark(l,ll){
  if(l.lat==null){l.lat=ll.lat;l.lng=ll.lng}
  editing=true;var ex=state.pins.filter(function(p){return hasLoc(p)&&p.name.toLowerCase()===l.name.toLowerCase()&&km(p,l)<3})[0];
  $('#sheet').innerHTML='<h2>'+esc(l.name)+'</h2><div class="small o" style="margin:-6px 0 10px">'+esc(l.kind)+(l.ele?' · '+esc(l.ele)+' m ('+Math.round(+l.ele*3.281)+' ft)':'')+'</div>'+
    '<div id="lmPhotos" class="photos"></div>'+
    '<div class="acts" style="margin-top:12px">'+(ex?'<button class="btn" id="lmOpen">Open your pin</button>':'<button class="btn primary" id="lmAdd">+ Add to queue</button>')+'<a class="btn" href="'+gmaps(l)+'" target="_blank" rel="noopener" style="text-decoration:none">Google Maps ↗</a><span class="grow"></span><button class="btn" id="lmDone">Close</button></div>';
  $('#ov').classList.remove('hidden');
  fillPhotos($('#lmPhotos'),l.name,l.lat,l.lng,l.layer==='place'?2500:l.layer==='mountain_peak'?1500:600);
  $('#lmDone').onclick=closeSheet;
  if(ex)$('#lmOpen').onclick=function(){openEditor(ex.id)};
  else $('#lmAdd').onclick=function(){var before=snap();var p={id:uid(),name:l.name,lat:+l.lat.toFixed(5),lng:+l.lng.toFixed(5),cat:guessCatLM(l),stage:'queue',booked:false,day:0,order:nextOrder(),notes:l.ele?l.ele+' m':''};state.pins.push(p);commit();closeSheet();toast(p.name+' added to queue',before)};
}

/* ---------- place search (Photon / OpenStreetMap) ---------- */
var sTimer=null,sSeq=0,sResults=[];
function guessCat(pr){var v=(pr.osm_value||''),k=(pr.osm_key||'');
  if(/castle|ruins|monument|memorial|archaeolog|museum|church|cathedral|abbey|fort|battlefield|historic/.test(v)||k==='historic')return 'castle';
  if(/peak|hill|volcano|ridge|saddle|nature_reserve|path|trailhead|footway/.test(v))return 'hike';
  if(/restaurant|pub|cafe|bar|fast_food|distillery|brewery|food_court|ice_cream/.test(v))return 'food';
  if(/hotel|guest_house|hostel|motel|camp_site|chalet|apartment|caravan|bed_and_breakfast/.test(v))return 'stay';
  if(/city|town|village|hamlet|suburb|locality/.test(v)||k==='place'&&!/island|islet/.test(v))return 'city';
  return 'scenic';}
function searchPlaces(q){
  var my=++sSeq,c=map?map.getCenter():{lat:57,lng:-4.6};
  fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&lat='+c.lat.toFixed(3)+'&lon='+c.lng.toFixed(3)+'&limit=7&lang=en').then(function(r){return r.json()}).then(function(j){
    if(my!==sSeq)return;sResults=(j.features||[]).map(function(f){var pr=f.properties||{};return {name:pr.name||pr.street||'Unnamed',where:[pr.city||pr.town||pr.village,pr.county,pr.state,pr.country].filter(Boolean).filter(function(x,i,a){return a.indexOf(x)===i}).slice(0,3).join(', '),lng:f.geometry.coordinates[0],lat:f.geometry.coordinates[1],cat:guessCat(pr),kind:(pr.osm_value||'').replace(/_/g,' ')}});
    showResults();
  }).catch(function(){if(my===sSeq){sResults=[];var el=$('#sRes');if(el)el.innerHTML='<div class="empty">Search needs a connection.</div>'}});
}
function showResults(){var el=$('#sRes');if(!el)return;
  el.innerHTML=sResults.length?sResults.map(function(r,i){return '<div class="row sr"><i class="sw" style="background:'+CATS[r.cat][1]+';width:12px;height:12px"></i><div class="nm"><div>'+esc(r.name)+'</div><div class="meta">'+esc([r.kind,r.where].filter(Boolean).join(' · '))+'</div></div><div class="ra"><button class="ib" data-sv="'+i+'" title="Show on map">👁</button><button class="btn sm" data-sa="'+i+'">+ Queue</button></div></div>'}).join(''):'<div class="empty">No matches.</div>';
  $$('[data-sa]',el).forEach(function(b){b.onclick=function(){var r=sResults[+b.getAttribute('data-sa')],before=snap();var p={id:uid(),name:r.name.slice(0,80),lat:+r.lat.toFixed(5),lng:+r.lng.toFixed(5),cat:r.cat,stage:'queue',booked:false,day:0,order:nextOrder(),notes:r.where?'Near '+r.where:''};state.pins.push(p);commit();sResults=[];render();flyTo(p,4);toast(p.name+' added to queue',before)}});
  $$('[data-sv]',el).forEach(function(b){b.onclick=function(){var r=sResults[+b.getAttribute('data-sv')];if(map)map.flyTo({center:[r.lng,r.lat],zoom:12,duration:700})}});
}
/* ---------- panel ---------- */
function renderTabs(){
  var q=inStage('queue').length,lib=inStage('library').length,dn=inStage('done').length,pl=state.pins.filter(function(p){return p.stage==='queue'&&p.day}).length;
  var pk=state.pack.items.filter(function(i){return i.packed}).length+'/'+state.pack.items.length;
  var spent=state.spend.items.reduce(function(s,e){return s+usd(e)},0);
  var tabs=[['queue','Queue',q],['plan','Plan',pl],['pack','Pack',pk],['spend','Spend',usdf(spent)],['library','Library',lib],['done','Done',dn]];
  $('#tabs').innerHTML=tabs.map(function(t){return '<button class="tab'+(ui.tab===t[0]?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+' <span class="n">'+t[2]+'</span></button>'}).join('')+'<button class="tab tog" id="tog">'+(ui.min?'▲':'▼')+'</button>';
  $$('[data-tab]').forEach(function(b){b.onclick=function(){var nt=b.getAttribute('data-tab');if(ui.min){ui.min=false;$('#panel').classList.remove('min');setTimeout(resize,60)}ui.tab=nt;saveUI();render();$('#pbody').scrollTop=0;
    if(nt==='plan'||nt==='pack')fitDay(ui.day);else if(nt==='queue')fitTo(inStage('queue'));else if(nt==='done')fitTo(inStage('done'))}});
  $('#tog').onclick=function(){ui.min=!ui.min;$('#panel').classList.toggle('min',ui.min);saveUI();renderTabs();setTimeout(resize,60)};
}
function catSelect(){return '<select data-act="cat" class="mini"><option value="all">All types</option>'+Object.keys(CATS).map(function(k){return '<option value="'+k+'"'+(ui.cat===k?' selected':'')+'>'+CATS[k][0]+'</option>'}).join('')+'</select>'}
function daySelect(p,label){var h='<select class="mini" data-act="setday" data-id="'+p.id+'"><option value="0">'+(label||'Add to day…')+'</option>';for(var i=1;i<=state.trip.days;i++)h+='<option value="'+i+'"'+(p.day===i?' selected':'')+'>'+esc(dayLabel(i))+'</option>';return h+'</select>'}
function dayChips(){var h='<div class="chips">';for(var i=1;i<=state.trip.days;i++){var n=dayPins(i).length,dd=dayDate(i),w=wxFor(i);h+='<button class="chip'+(ui.day===i?' on':'')+'" data-act="day" data-d="'+i+'">Day '+i+(dd?' <span class="o">'+esc(dd.replace(/^\w+, /,''))+'</span>':'')+(w?' <span class="o">'+cF(+w.hiC)+'°'+(isWet(w)?'☔':'')+'</span>':'')+(n&&ui.tab==='plan'?' <span class="o">('+n+')</span>':'')+'</button>'}return h+'</div>'}
function row(p,opts){
  opts=opts||{};var c=(CATS[p.cat]||CATS.scenic)[1];
  var meta=opts.meta||[(CATS[p.cat]||['?'])[0]];
  if(!opts.meta){if(p.booked)meta.push('<b class="bk">Booked</b>');if(!hasLoc(p))meta.push('<b class="warn">No location</b>');if(p.notes)meta.push(esc(p.notes.slice(0,60))+(p.notes.length>60?'…':''))}
  return '<div class="row'+(opts.faded?' faded':'')+'" data-open="'+p.id+'">'+(opts.num?'<span class="num" style="background:'+c+'">'+opts.num+'</span>':'<i class="sw" style="background:'+c+';width:12px;height:12px"></i>')+
  '<div class="nm"><div>'+esc(p.name)+'</div><div class="meta">'+meta.join(' · ')+'</div></div><div class="ra">'+(opts.actions||'')+'</div></div>';
}
function baseOptions(sel,label){
  var l=state.pins.filter(function(p){return hasLoc(p)&&p.stage!=='done'}).sort(function(a,b){return (a.cat==='stay'?0:1)-(b.cat==='stay'?0:1)||a.name.localeCompare(b.name)});
  return '<option value="">'+label+'</option>'+l.map(function(p){return '<option value="'+p.id+'"'+(p.id===sel?' selected':'')+'>'+(p.cat==='stay'?'⌂ ':'')+esc(p.name)+'</option>'}).join('');
}
function wxLine(n){
  var w=wxFor(n);
  if(w)return '<div class="wx"><b>'+cF(+w.hiC)+'° / '+cF(+w.loC)+'°F</b> <span class="o">('+Math.round(+w.hiC)+'/'+Math.round(+w.loC)+'°C)</span> · '+esc(w.summary||'')+' · rain '+(w.rainPct!=null?w.rainPct+'%':'?')+' · gusts '+(w.gustMph!=null?w.gustMph+' mph':'?')+(w.place?' <span class="o">@ '+esc(w.place)+'</span>':'')+'</div>';
  return '<div class="wx o">'+(isoDate(n)?'No forecast yet — the morning pull starts 7 days before Day 1.':'Set your dates under Trip to get forecasts.')+' Outfit below uses typical mid-Nov weather.</div>';
}
function outfitCard(n,compact){
  var o=outfit(n),h='<div class="card"><div class="ct">'+(o.est?'Typical-day outfit':'Today’s outfit')+'</div>';
  h+='<div class="kit"><span class="kl">Wear</span>'+o.wear.map(function(id){return '<span class="k w">'+esc(gearName(id))+'</span>'}).join('')+'</div>';
  h+='<div class="kit"><span class="kl">In the pack</span>'+o.pack.map(function(id){return '<span class="k">'+esc(gearName(id))+'</span>'}).join('')+'</div>';
  if(o.alerts.length)h+='<ul class="al">'+o.alerts.map(function(a){return '<li>'+esc(a)+'</li>'}).join('')+'</ul>';
  if(compact)h+='<button class="lnk" data-act="gopack">Full packing list →</button>';
  return h+'</div>';
}
function renderPanel(){
  var b=$('#pbody'),h='';
  if(ui.tab==='queue'){
    var up=unplanned().filter(catOk),planned=state.pins.filter(function(p){return p.stage==='queue'&&p.day&&catOk(p)});
    h+='<div class="addbar"><input id="sQ" class="mini grow" type="search" autocomplete="off" placeholder="🔎 Search places (e.g. Sligachan, Old Man of Storr)"></div><div id="sRes"></div>';
    h+='<div class="addbar"><textarea id="qAdd" rows="1" placeholder="Or paste Google Maps links / coordinates, one per line"></textarea><button class="btn primary" id="qGo">Add</button></div>';
    h+='<div class="bar"><span class="small">'+up.length+' waiting · '+planned.length+' on days</span><span class="grow"></span>'+catSelect()+'<label class="small chk"><input type="checkbox" data-act="showlib"'+(ui.showLib?' checked':'')+'> Library on map</label></div>';
    if(!up.length&&!planned.length)h+='<div class="empty">Your queue is empty. Type a place above, tap “+ Pin” on the map, or pull ideas from the <a href="#" data-act="golib">Library</a>.</div>';
    if(up.length){h+='<div class="sect"><span>Waiting to be planned</span><button class="lnk" data-act="clearq">Clear queue</button></div>';
      up.forEach(function(p){h+=row(p,{actions:daySelect(p)+'<button class="ib" title="Back to Library" data-act="tolib" data-id="'+p.id+'">✕</button>'})})}
    if(planned.length){h+='<div class="sect"><span>Already on a day</span><button class="lnk" data-act="goplan">Open Plan →</button></div>';
      planned.sort(function(a,b){return a.day-b.day||(a.order||0)-(b.order||0)}).forEach(function(p){h+=row(p,{faded:true,actions:'<span class="dayb">D'+p.day+'</span>'})})}
  }
  else if(ui.tab==='plan'){
    var n=ui.day,dp=dayPlan(n),c=state.trip.dayCfg[n]||{},total=state.pins.filter(function(p){return p.stage!=='library'}).reduce(function(a,p){return a+(+p.cost||0)},0);
    h+=dayChips();
    h+='<div class="sect"><span>'+esc(dayLabel(n))+'</span><span>'+(dp.cost?'<span class="cost">'+money(dp.cost)+' today</span> ':'')+(total?'<span class="cost o">'+money(total)+' trip</span>':'')+'</span></div>';
    h+=wxLine(n);
    var day=dp.sun.set-dp.sun.rise,used=dp.finish-dp.leaveAt,pct=Math.min(100,used/day*100),over=dp.finish>dp.sun.set;
    h+='<div class="card"><div class="sunrow"><span>☀ '+hm(dp.sun.rise)+'–'+hm(dp.sun.set)+' ('+dur(day)+' daylight'+(dp.estDate?', est.':'')+')</span><span>Leave <input type="time" class="tin" data-act="leave" value="'+esc(c.leave||'08:30')+'"></span></div>'+
      '<div class="budget"><div class="bfill'+(over?' over':'')+'" style="width:'+pct+'%"></div><div class="bsun" style="left:'+Math.min(100,(dp.sun.set-dp.leaveAt)/Math.max(used,day)*100)+'%"></div></div>'+
      '<div class="small">'+dur(dp.drive)+' driving + '+dur(dp.onsite)+' at stops → back ~'+hm(dp.finish)+(over?' <b class="warn">('+dur(dp.finish-dp.sun.set)+' after sunset)</b>':' <b class="bk">fits in daylight</b>')+'</div>'+
      '<div class="two" style="margin-top:8px"><div class="f"><label>Start from</label><select data-act="sbase">'+baseOptions(c.start,startBase(n)&&!c.start?'Last night’s base ('+esc(startBase(n).name)+')':'Choose a base…')+'</select></div><div class="f"><label>Sleep at</label><select data-act="ebase">'+baseOptions(c.end,'Same as start')+'</select></div></div>'+
      dayRouteLink(dp)+(dp.warn.length?'<ul class="al">'+dp.warn.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'</div>';
    h+='<div class="sect"><span>Stops</span>'+(dp.rows.length?'<button class="lnk" data-act="clearday">Clear day</button>':'')+'</div>';
    if(!dp.rows.length)h+='<div class="empty">Nothing planned yet. Add from your queue below.</div>';
    if(hasLoc(dp.start)&&dp.rows.length)h+='<div class="leg">⌂ '+esc(dp.start.name)+' · leave '+hm(dp.leaveAt)+'</div>';
    var wet=isWet(wxFor(n));
    dp.rows.forEach(function(r,i){
      var p=r.p;if(r.leg)h+='<div class="leg">↓ ~'+dur(r.leg)+' drive · '+Math.round(km(r.from,p)*ROAD)+' km'+(r.from&&hasLoc(p)?' · <a href="'+gdir(r.from,p)+'" target="_blank" rel="noopener">directions</a>':'')+'</div>';
      var sw=byId(p.swapId),meta=['<b>'+hm(r.arrive)+'–'+hm(r.leave)+'</b>',dur(mins(p))];
      if(r.late)meta.push('<b class="warn">ends after dark</b>');if(r.miss)meta.push('<b class="warn">late for '+esc(p.slot)+'</b>');if(p.booked)meta.push('<b class="bk">Booked'+(p.slot?' '+esc(p.slot):'')+'</b>');if(+p.cost)meta.push(money(+p.cost));
      var acts=(sw?'<button class="btn sm'+(wet?' hot':'')+'" data-act="swap" data-id="'+p.id+'" title="Swap with '+esc(sw.name)+'">☔ '+esc(sw.name.slice(0,14))+'</button>':'')+'<button class="ib" data-act="up" data-id="'+p.id+'">▲</button><button class="ib" data-act="dn" data-id="'+p.id+'">▼</button><button class="ib" title="Mark done" data-act="done" data-id="'+p.id+'">✓</button><button class="ib" title="Back to queue" data-act="unplan" data-id="'+p.id+'">↩</button>';
      h+=row(p,{num:i+1,meta:meta,actions:acts});
    });
    if(dp.back&&hasLoc(dp.end))h+='<div class="leg">↓ ~'+dur(dp.back)+' drive · <a href="'+gdir(dp.lastStop,dp.end)+'" target="_blank" rel="noopener">directions</a><br>⌂ '+esc(dp.end.name)+' · ~'+hm(dp.finish)+'</div>';
    if(dp.rows.length&&!hasLoc(dp.start))h+='<div class="small" style="padding:4px 6px">Tip: set where you’re starting from so the first drive counts.</div>';
    h+=outfitCard(n,true);
    var up2=unplanned();
    h+='<div class="sect"><span>From your queue ('+up2.length+')</span></div>';
    if(!up2.length)h+='<div class="empty">Queue is empty — add places in the Queue tab.</div>';
    up2.forEach(function(p){h+=row(p,{faded:true,actions:'<button class="btn sm" data-act="addday" data-id="'+p.id+'">+ Day '+n+'</button>'})});
    h+='<div class="sect"><span>Take it offline</span></div><div class="small" style="padding:0 6px 6px">Export your queued and planned places as a CSV for Google My Maps, then open that map in the Google Maps app and download the area for offline use. <button class="btn sm" data-act="export">Export for Google Maps</button></div>';
  }
  else if(ui.tab==='pack'){
    h+=dayChips();
    h+='<div class="sect"><span>'+esc(dayLabel(ui.day))+'</span>'+(wx&&wx.fetchedAt?'<span class="o">forecast '+esc(new Date(wx.fetchedAt).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))+'</span>':'')+'</div>';
    h+=wxLine(ui.day)+outfitCard(ui.day,false);
    var o=outfit(ui.day),today={};o.wear.concat(o.pack).forEach(function(id){today[id]=1});
    var groups={};state.pack.items.forEach(function(it){(groups[it.group||'Other']=groups[it.group||'Other']||[]).push(it)});
    var done=state.pack.items.filter(function(i){return i.packed}).length;
    h+='<div class="sect"><span>Packing list · '+done+'/'+state.pack.items.length+'</span><button class="lnk" data-act="unpackall">Untick all</button></div>';
    h+='<div class="addbar"><input id="packAdd" class="mini grow" placeholder="Add an item (e.g. Spare laces)"><button class="btn sm" id="packGo">Add</button></div>';
    Object.keys(groups).forEach(function(g){
      h+='<div class="pg">'+esc(g)+'</div>';
      groups[g].forEach(function(it){h+='<label class="pi'+(it.packed?' on':'')+'"><input type="checkbox" data-act="packtick" data-id="'+it.id+'"'+(it.packed?' checked':'')+'><span class="grow">'+esc(it.name)+(it.qty>1?' <span class="o">×'+it.qty+'</span>':'')+(today[it.id]?' <span class="today">day '+ui.day+'</span>':'')+'</span><button class="ib" data-act="packdel" data-id="'+it.id+'" title="Remove">✕</button></label>'});
    });
  }
  else if(ui.tab==='spend'){
    var sp=state.spend,items=sp.items.slice().sort(function(x,y){return (y.ts||0)-(x.ts||0)}),tot=items.reduce(function(s,e){return s+usd(e)},0),totG=items.reduce(function(s,e){return s+gbp(e)},0);
    var unpaid=state.pins.filter(function(p){return +p.cost>0&&!p.paid&&p.stage!=='library'}),unpaidG=unpaid.reduce(function(s,p){return s+(+p.cost)},0);
    var bud=+sp.budgetUsd||0,curDay=tripDayToday(),cur=sp.cur||'GBP';
    h+='<div class="card"><div class="spbig">'+usdf(tot)+' <span class="o">spent · '+gbpf(totG)+'</span></div>';
    if(bud){var pc=Math.min(100,tot/bud*100),proj=tot+unpaidG*rate();h+='<div class="budget" style="margin:8px 0 4px"><div class="bfill'+(tot>bud?' over':'')+'" style="width:'+pc+'%"></div></div><div class="small">'+(tot<=bud?usdf(bud-tot)+' left of '+usdf(bud):'<b class="warn">'+usdf(tot-bud)+' over the '+usdf(bud)+' budget</b>')+(unpaidG?' · incl. unlogged bookings: '+usdf(proj):'')+'</div>'}
    else h+='<div class="small" style="margin-top:4px">Set a trip budget in Settings below to track what’s left.</div>';
    h+='<div class="small" style="margin-top:6px">£1 = $'+rate().toFixed(3)+' '+(!sp.rateManual&&fxRate?'<span class="o">(auto, '+esc(fxAt?new Date(fxAt).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'')+')</span>':'<span class="o">('+(sp.rateManual?'manual':'default')+')</span>')+'</div></div>';
    h+='<div class="sect"><span>Log a purchase</span></div><div class="spform"><div class="sprow"><div class="segs cur"><button class="seg'+(cur==='GBP'?' on':'')+'" data-act="spcur" data-c="GBP">£</button><button class="seg'+(cur==='USD'?' on':'')+'" data-act="spcur" data-c="USD">$</button></div><input id="spAmt" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0.00"><select id="spCat">'+Object.keys(SPC).map(function(k){return '<option value="'+k+'"'+(k===(ui.spCat||'food')?' selected':'')+'>'+SPC[k][0]+'</option>'}).join('')+'</select></div>'+
      '<div class="sprow"><select id="spDay"><option value="0"'+(curDay===0?' selected':'')+'>Before the trip</option>'+(function(){var o='';for(var i=1;i<=state.trip.days;i++)o+='<option value="'+i+'"'+(curDay===i?' selected':'')+'>'+esc(dayLabel(i))+'</option>';return o})()+'</select><input id="spNote" placeholder="What was it? (optional)"><button class="btn primary" id="spGo">Add</button></div></div>';
    if(unpaid.length){h+='<div class="sect"><span>From your bookings · '+gbpf(unpaidG)+' not logged</span></div>';
      unpaid.forEach(function(p){h+=row(p,{meta:[(p.day?'Day '+p.day:'Not on a day'),gbpf(+p.cost)+(p.booked?' · booked':'')],actions:'<button class="btn sm" data-act="logpin" data-id="'+p.id+'">Log '+gbpf(+p.cost)+'</button>'})})}
    if(items.length){
      var byCat={},byDay={},mx=0,mxd=0;items.forEach(function(e){byCat[e.cat]=(byCat[e.cat]||0)+usd(e);byDay[e.day||0]=(byDay[e.day||0]||0)+usd(e)});
      Object.keys(byCat).forEach(function(k){mx=Math.max(mx,byCat[k])});Object.keys(byDay).forEach(function(k){mxd=Math.max(mxd,byDay[k])});
      h+='<div class="sect"><span>By category</span></div>'+Object.keys(byCat).sort(function(x,y){return byCat[y]-byCat[x]}).map(function(k){var c=SPC[k]||SPC.other;return '<div class="sbar"><span class="sl">'+c[0]+'</span><span class="st"><i style="width:'+(byCat[k]/mx*100)+'%;background:'+c[1]+'"></i></span><span class="sv">'+usdf(byCat[k])+'</span></div>'}).join('');
      h+='<div class="sect"><span>By day</span></div>'+Object.keys(byDay).sort(function(x,y){return x-y}).map(function(k){return '<div class="sbar"><span class="sl">'+(+k?'Day '+k+(dayDate(+k)?' <span class="o">'+esc(dayDate(+k).replace(/^\w+, /,''))+'</span>':''):'Before trip')+'</span><span class="st"><i style="width:'+(byDay[k]/mxd*100)+'%;background:var(--accent)"></i></span><span class="sv">'+usdf(byDay[k])+'</span></div>'}).join('');
      h+='<div class="sect"><span>All purchases ('+items.length+')</span><button class="lnk" data-act="spexport">Export CSV</button></div>';
      items.forEach(function(e){var c=SPC[e.cat]||SPC.other;h+='<div class="row"><i class="sw" style="background:'+c[1]+';width:12px;height:12px"></i><div class="nm"><div>'+(e.cur==='USD'?'$'+(+e.amt).toFixed(2):gbpf(+e.amt))+' · '+esc(e.note||c[0])+'</div><div class="meta">'+c[0]+' · '+(e.day?'Day '+e.day:'Before trip')+(e.cur==='GBP'?' · ≈ '+usdf(usd(e)):' · ≈ '+gbpf(gbp(e)))+'</div></div><div class="ra"><button class="ib" data-act="spdel" data-id="'+e.id+'" title="Delete">✕</button></div></div>'});
    }else h+='<div class="empty">Nothing logged yet. Add purchases above as you go. Any cost you put on a booking shows up here so you can log it in one tap.</div>';
    h+='<div class="sect"><span>Settings</span></div><div class="two" style="padding:0 2px"><div class="f"><label>Trip budget ($)</label><input id="spBud" type="number" min="0" step="50" value="'+(sp.budgetUsd||'')+'" placeholder="e.g. 2500"></div><div class="f"><label>£1 in $ (blank = '+(fxRate?'auto':'default')+')</label><input id="spRate" type="number" min="0.5" max="3" step="0.001" value="'+(sp.rateManual?sp.rate:'')+'" placeholder="'+rate().toFixed(3)+'"></div></div>';
  }
  else if(ui.tab==='library'){
    var ql=(ui.q||'').toLowerCase(),lib=inStage('library').filter(function(p){return catOk(p)&&(!ql||(p.name+' '+p.notes).toLowerCase().indexOf(ql)>=0)}).sort(function(a,b){return a.name.localeCompare(b.name)});
    h+='<div class="bar"><input id="libQ" class="mini grow" placeholder="Search library…" value="'+esc(ui.q||'')+'">'+catSelect()+'</div>';
    h+='<div class="sect"><span>Ideas you haven’t queued</span></div>';
    if(!lib.length)h+='<div class="empty">Nothing here'+(ql?' matching “'+esc(ui.q)+'”':'')+'. Anything you remove from the queue lands here.</div>';
    lib.forEach(function(p){h+=row(p,{actions:'<button class="btn sm" data-act="toq" data-id="'+p.id+'">+ Queue</button><button class="ib" title="Delete" data-act="del" data-id="'+p.id+'">🗑</button>'})});
  }
  else{
    var dn=inStage('done').filter(catOk);
    h+='<div class="bar"><span class="small">'+dn.length+' done</span><span class="grow"></span>'+catSelect()+'</div>';
    if(!dn.length)h+='<div class="empty">Tick ✓ on a planned stop once you’ve done it.</div>';
    dn.forEach(function(p){h+=row(p,{actions:'<button class="ib" title="Back to queue" data-act="toq" data-id="'+p.id+'">↩</button>'})});
  }
  b.innerHTML=h;
  var sq=$('#sQ');if(sq){sq.oninput=function(){var v=this.value.trim();clearTimeout(sTimer);if(v.length<3){sResults=[];$('#sRes').innerHTML='';return}sTimer=setTimeout(function(){searchPlaces(v)},350)}}
  var qa=$('#qAdd');if(qa){qa.oninput=function(){this.style.height='auto';this.style.height=Math.min(140,this.scrollHeight)+'px'};
    qa.onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey&&this.value.indexOf('\n')<0){e.preventDefault();$('#qGo').click()}};
    $('#qGo').onclick=function(){var v=qa.value;if(!v.trim())return;qa.value='';quickAdd(v,0)}}
  var lq=$('#libQ');if(lq){lq.oninput=function(){ui.q=this.value;var pos=this.selectionStart;renderPanel();var n=$('#libQ');n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
  var sg=$('#spGo');if(sg){
    var add=function(){var v=parseFloat($('#spAmt').value);if(!(v>0)){$('#spAmt').focus();return}var before=snap();ui.spCat=$('#spCat').value;saveUI();
      state.spend.items.push({id:'e'+uid(),amt:Math.round(v*100)/100,cur:state.spend.cur||'GBP',cat:$('#spCat').value,day:+$('#spDay').value,note:$('#spNote').value.trim().slice(0,80),ts:Date.now()});
      commit();render();toast('Logged '+(state.spend.cur==='USD'?'$'+v.toFixed(2):gbpf(v)),before)};
    sg.onclick=add;$('#spAmt').onkeydown=$('#spNote').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();add()}};
    $('#spBud').onchange=function(){var v=parseFloat(this.value);state.spend.budgetUsd=v>0?v:null;commit();render()};
    $('#spRate').onchange=function(){var v=parseFloat(this.value);if(v>0){state.spend.rate=v;state.spend.rateManual=true}else{state.spend.rateManual=false}commit();render()};
  }
  var pa=$('#packAdd');if(pa){pa.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();$('#packGo').click()}};$('#packGo').onclick=function(){var v=pa.value.trim();if(!v)return;state.pack.items.push({id:'g'+uid(),group:'My extras',name:v.slice(0,80),qty:1,packed:false});pa.value='';commit();render()}}
}
$('#pbody').addEventListener('click',function(e){
  var t=e.target.closest('[data-act]');
  if(t&&t.tagName!=='SELECT'&&t.tagName!=='INPUT'){e.stopPropagation();e.preventDefault();act(t.getAttribute('data-act'),t);return}
  if(e.target.closest('select,input,textarea,button,a,label'))return;
  var r=e.target.closest('[data-open]');if(r){var p=byId(r.getAttribute('data-open'));if(hasLoc(p))flyTo(p,5);openEditor(p.id)}
});
$('#pbody').addEventListener('change',function(e){var t=e.target.closest('[data-act]');if(t)act(t.getAttribute('data-act'),t)});
function act(a,el){
  var id=el.getAttribute('data-id'),p=id?byId(id):null,before=snap(),n=ui.day;
  switch(a){
    case 'cat':ui.cat=el.value;saveUI();render();return;
    case 'showlib':ui.showLib=el.checked;saveUI();drawPins();return;
    case 'golib':ui.tab='library';saveUI();render();return;
    case 'goplan':ui.tab='plan';saveUI();render();fitDay(ui.day);return;
    case 'gopack':ui.tab='pack';saveUI();render();$('#pbody').scrollTop=0;return;
    case 'day':ui.day=+el.getAttribute('data-d');saveUI();render();fitDay(ui.day);return;
    case 'leave':cfg(n).leave=el.value||'08:30';commit();render();return;
    case 'sbase':cfg(n).start=el.value||'';commit();render();fitDay(n);return;
    case 'ebase':cfg(n).end=el.value||'';commit();render();fitDay(n);return;
    case 'setday':p.day=+el.value;p.order=nextOrder();commit();render();if(p.day)toast(p.name+' → '+dayLabel(p.day),before);return;
    case 'addday':p.day=n;p.order=nextOrder();commit();render();toast(p.name+' → Day '+n,before);return;
    case 'unplan':p.day=0;commit();render();toast(p.name+' back in queue',before);return;
    case 'done':p.stage='done';p.day=0;commit();render();toast(p.name+' marked done',before);return;
    case 'tolib':p.stage='library';p.day=0;commit();render();toast(p.name+' moved to Library',before);return;
    case 'toq':p.stage='queue';p.day=0;p.order=nextOrder();p.seed=false;commit();render();toast(p.name+' added to queue',before);return;
    case 'del':state.pins=state.pins.filter(function(q){return q!==p});commit();render();toast('Deleted '+p.name,before);return;
    case 'swap':var alt=byId(p.swapId);if(!alt)return;alt.stage='queue';alt.day=p.day;alt.order=p.order;if(!alt.swapId)alt.swapId=p.id;p.day=0;p.order=nextOrder();commit();render();toast('Swapped in '+alt.name+' — '+p.name+' back in queue',before);return;
    case 'clearq':var up=unplanned();up.forEach(function(q){q.stage='library'});commit();render();toast('Cleared '+up.length+' from queue (kept in Library)',before);return;
    case 'clearday':var dp=dayPins(n);dp.forEach(function(q){q.day=0});commit();render();toast('Day '+n+' cleared — '+dp.length+' back in queue',before);return;
    case 'up':case 'dn':var l=dayPins(n),i=l.indexOf(p),j=i+(a==='up'?-1:1);if(j<0||j>=l.length)return;l.forEach(function(q,k){q.order=k+1});var o=l[i].order;l[i].order=l[j].order;l[j].order=o;commit();render();return;
    case 'packtick':var it=state.pack.items.filter(function(x){return x.id===id})[0];if(it){it.packed=el.checked;commit();renderTabs();el.closest('.pi').classList.toggle('on',el.checked)}return;
    case 'packdel':var it2=state.pack.items.filter(function(x){return x.id===id})[0];state.pack.items=state.pack.items.filter(function(x){return x.id!==id});commit();render();if(it2)toast('Removed '+it2.name,before);return;
    case 'unpackall':state.pack.items.forEach(function(x){x.packed=false});commit();render();toast('All unticked',before);return;
    case 'export':exportCSV();return;
    case 'spcur':state.spend.cur=el.getAttribute('data-c');commit();$$('.segs.cur .seg').forEach(function(s){s.classList.toggle('on',s===el)});return;
    case 'logpin':state.spend.items.push({id:'e'+uid(),amt:+p.cost,cur:'GBP',cat:spCatFor(p),day:p.day||0,note:p.name,ts:Date.now(),src:p.id});p.paid=true;commit();render();toast('Logged '+gbpf(+p.cost)+' for '+p.name,before);return;
    case 'spdel':var e=state.spend.items.filter(function(x){return x.id===id})[0];if(!e)return;state.spend.items=state.spend.items.filter(function(x){return x!==e});if(e.src){var sp2=byId(e.src);if(sp2)sp2.paid=false}commit();render();toast('Removed purchase',before);return;
    case 'spexport':spendCSV();return;
  }
}

/* ---------- export ---------- */
function csvCell(v){v=String(v==null?'':v);if(/^[=+\-@\t\r]/.test(v)&&!/^-?\d/.test(v))v="'"+v;return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function buildCSV(){
  var rows=[['Name','Latitude','Longitude','Day','Date','Stop','Type','Booked','Time','Booking ref','Cost GBP','Notes']];
  var l=state.pins.filter(function(p){return hasLoc(p)&&p.stage==='queue'}).sort(function(a,b){return (a.day||99)-(b.day||99)||(a.order||0)-(b.order||0)});
  var ord={};for(var n=1;n<=state.trip.days;n++)dayPins(n).forEach(function(p,i){ord[p.id]=i+1});
  l.forEach(function(p){rows.push([p.name,p.lat,p.lng,p.day?'Day '+p.day:'Unplanned',p.day?isoDate(p.day):'',ord[p.id]||'',(CATS[p.cat]||['?'])[0],p.booked?'yes':'',p.slot||'',p.conf||'',p.cost||'',p.notes||''])});
  return {csv:rows.map(function(r){return r.map(csvCell).join(',')}).join('\n'),count:l.length};
}
function spendCSV(){
  var rows=[['Date logged','Trip day','Category','Note','Amount','Currency','USD','GBP']];
  state.spend.items.slice().sort(function(a,b){return (a.ts||0)-(b.ts||0)}).forEach(function(e){rows.push([new Date(e.ts||0).toISOString().slice(0,10),e.day?'Day '+e.day:'Before trip',(SPC[e.cat]||SPC.other)[0],e.note||'',e.amt,e.cur,usd(e).toFixed(2),gbp(e).toFixed(2)])});
  var csv=rows.map(function(r){return r.map(csvCell).join(',')}).join('\n');
  shareOrDownload('trip-spending.csv',csv).then(function(r){if(r!=='cancelled')toast('Spending CSV ready')},function(){copyFallback(csv)});
}
function copyFallback(csv){try{navigator.clipboard.writeText(csv).then(function(){toast('Spending CSV copied')},function(){toast('Couldn’t copy here')})}catch(e){toast('Couldn’t copy here')}}
function exportCSV(){
  var x=buildCSV();if(!x.count){toast('Nothing queued with a location yet');return}
  editing=true;
  $('#sheet').innerHTML='<h2>Export for Google Maps</h2><ol class="small steps"><li>Save the CSV below ('+x.count+' places).</li><li>On a computer, open <a href="https://www.google.com/mymaps" target="_blank" rel="noopener">Google My Maps</a> → Create a new map → Import → pick the file.</li><li>Choose <b>Latitude</b>/<b>Longitude</b> for position and <b>Name</b> for the title. Style by “Day” to color each day.</li><li>On your phone: Google Maps → You → Maps shows it. Then download offline areas for Skye, Glencoe and the Cairngorms.</li></ol>'+
  '<div class="acts"><button class="btn primary" id="xSave">Save / share CSV</button><button class="btn" id="xCopy">Copy CSV</button><span class="grow"></span><button class="btn" id="xDone">Done</button></div><div class="small" id="xMsg" style="min-height:18px;margin-top:6px"></div><textarea id="xTxt" style="width:100%;min-height:90px;font-size:11px;font-family:ui-monospace,monospace;margin-top:4px"></textarea>';
  $('#xTxt').value=x.csv;$('#ov').classList.remove('hidden');
  $('#xSave').onclick=function(){shareOrDownload('trip-pins.csv',x.csv).then(function(r){$('#xMsg').textContent=r==='cancelled'?'Cancelled.':'Done — choose “Save to Files” if asked.'},function(){$('#xMsg').textContent='Couldn’t save here — use Copy instead.'})};
  $('#xCopy').onclick=function(){var t=$('#xTxt');try{navigator.clipboard.writeText(t.value).then(function(){$('#xMsg').textContent='Copied — paste into a file named trip.csv.'},function(){t.select();$('#xMsg').textContent='Selected — copy it manually.'})}catch(e){t.select()}};
  $('#xDone').onclick=closeSheet;
}

/* ---------- editor ---------- */
function closeSheet(){$('#ov').classList.add('hidden');editing=false;selId=null;render();if(pending)schedule()}
$('#ov').onclick=function(e){if(e.target.id==='ov')closeSheet()};
function openEditor(id,isNew){
  var p=byId(id);if(!p)return;selId=id;editing=true;drawPins();
  var days='<option value="0">Not on a day</option>';for(var i=1;i<=state.trip.days;i++)days+='<option value="'+i+'"'+(p.day===i?' selected':'')+'>'+esc(dayLabel(i))+'</option>';
  var seg=Object.keys(STAGES).map(function(k){return '<button class="seg'+(p.stage===k?' on':'')+'" data-stage="'+k+'">'+STAGES[k]+'</button>'}).join('');
  var swaps='<option value="">None</option>'+state.pins.filter(function(q){return q!==p&&q.stage!=='done'}).sort(function(a,b){return a.name.localeCompare(b.name)}).map(function(q){return '<option value="'+q.id+'"'+(p.swapId===q.id?' selected':'')+'>'+esc(q.name)+'</option>'}).join('');
  $('#sheet').innerHTML='<h2>'+(isNew?'New pin':'Edit place')+'</h2>'+
  '<div class="f"><label>Name</label><input id="eName" value="'+esc(p.name)+'"></div>'+
  '<div class="f"><label>Where it lives</label><div class="segs" id="eStage">'+seg+'</div></div>'+
  '<div class="three"><div class="f"><label>Type</label><select id="eCat">'+Object.keys(CATS).map(function(k){return '<option value="'+k+'"'+(p.cat===k?' selected':'')+'>'+CATS[k][0]+'</option>'}).join('')+'</select></div><div class="f"><label>Day</label><select id="eDay">'+days+'</select></div><div class="f"><label>Time there (min)</label><input id="eMins" type="number" min="0" step="15" placeholder="'+(CATS[p.cat]||CATS.scenic)[2]+'" value="'+(p.mins!=null?esc(p.mins):'')+'"></div></div>'+
  '<label class="chk" id="eHighW" style="margin-bottom:8px;display:'+(p.cat==='hike'?'flex':'none')+'"><input type="checkbox" id="eHigh"'+(p.high?' checked':'')+'> High or exposed hill (adds ice / wind checks)</label>'+
  '<div class="f"><label>Bad-weather swap</label><select id="eSwap">'+swaps+'</select></div>'+
  '<details class="bkbox"'+(p.booked||p.conf||p.cost||p.slot?' open':'')+'><summary>Booking &amp; cost</summary><label class="chk" style="margin:8px 0;display:flex"><input type="checkbox" id="eBk"'+(p.booked?' checked':'')+'> Booked / tickets sorted</label>'+
  '<div class="three"><div class="f"><label>Time slot</label><input id="eSlot" placeholder="10:30" value="'+esc(p.slot||'')+'"></div><div class="f"><label>Booking ref</label><input id="eConf" value="'+esc(p.conf||'')+'"></div><div class="f"><label>Cost (£)</label><input id="eCost" type="number" min="0" step="0.5" value="'+(p.cost!=null?esc(p.cost):'')+'"></div></div></details>'+
  (hasLoc(p)?'<div class="f"><label>Photos &amp; info</label><div id="ePhotos" class="photos"></div></div>':'')+
  '<div class="f"><label>Notes</label><textarea id="eNotes" placeholder="Parking, tickets, weather backup…">'+esc(p.notes)+'</textarea></div>'+
  (hasLoc(p)?'<div class="small" style="margin-bottom:8px">'+p.lat.toFixed(4)+', '+p.lng.toFixed(4)+' · <a href="'+gmaps(p)+'" target="_blank" rel="noopener">Open in Google Maps</a></div>':
   '<div class="f"><label>No location yet — paste a Google Maps link or coordinates</label><input id="eLoc" placeholder="https://www.google.com/maps/place/…/@57.29,-6.17…"><div class="small"><a href="'+gmaps(p)+'" target="_blank" rel="noopener">Look it up in Google Maps</a>, then copy the long link from the address bar.</div></div>')+
  '<div class="acts"><button class="btn" id="eMove">'+(hasLoc(p)?'Move pin':'Place on map')+'</button><button class="btn danger" id="eDel">Delete</button><span class="grow"></span><button class="btn primary" id="eDone">Done</button></div>';
  $('#ov').classList.remove('hidden');
  if(isNew)setTimeout(function(){var n=$('#eName');n.focus();n.select()},50);
  if(hasLoc(p)&&!isNew)fillPhotos($('#ePhotos'),p.name,p.lat,p.lng,p.cat==='city'?2500:p.cat==='hike'?1500:600);else if($('#ePhotos'))$('#ePhotos').innerHTML='<div class="small o">Name it and reopen to see photos.</div>';
  function upd(){p.name=$('#eName').value.trim()||'Untitled';p.cat=$('#eCat').value;p.booked=$('#eBk').checked;p.notes=$('#eNotes').value;
    var mv=$('#eMins').value;p.mins=mv===''?null:Math.max(0,+mv);p.high=$('#eHigh').checked;p.swapId=$('#eSwap').value||'';
    p.slot=$('#eSlot').value.trim();p.conf=$('#eConf').value.trim();var cv=$('#eCost').value;p.cost=cv===''?null:Math.max(0,+cv);
    $('#eHighW').style.display=p.cat==='hike'?'flex':'none';$('#eMins').placeholder=(CATS[p.cat]||CATS.scenic)[2];
    var nd=+$('#eDay').value;if(nd!==p.day){p.day=nd;p.order=nextOrder();if(nd&&p.stage!=='queue'){p.stage='queue';$$('#eStage .seg').forEach(function(s){s.classList.toggle('on',s.getAttribute('data-stage')==='queue')})}}
    p.seed=false;commit();drawPins();drawRoute();renderTabs();renderPanel()}
  ['eName','eNotes','eMins','eSlot','eConf','eCost'].forEach(function(x){$('#'+x).oninput=upd});['eCat','eDay','eBk','eHigh','eSwap'].forEach(function(x){$('#'+x).onchange=upd});
  $$('#eStage .seg').forEach(function(s){s.onclick=function(){p.stage=s.getAttribute('data-stage');if(p.stage!=='queue'){p.day=0;$('#eDay').value='0'}else p.order=nextOrder();$$('#eStage .seg').forEach(function(x){x.classList.toggle('on',x===s)});upd()}});
  var el=$('#eLoc');if(el)el.oninput=function(){var c=parseCoords(this.value);if(!c)return;p.lat=c.lat;p.lng=c.lng;var nm=nameFromLink(this.value);if(nm&&(p.name==='Unnamed place'))p.name=nm;commit();openEditor(p.id);flyTo(p,5)};
  $('#eDone').onclick=closeSheet;
  $('#eMove').onclick=function(){$('#ov').classList.add('hidden');editing=false;setAdd({move:id})};
  $('#eDel').onclick=function(){var before=snap();state.pins=state.pins.filter(function(q){return q.id!==id});commit();closeSheet();toast('Deleted '+p.name,before)};
}
$('#bTrip').onclick=function(){
  editing=true;
  var total=state.pins.filter(function(p){return p.stage!=='library'}).reduce(function(a,p){return a+(+p.cost||0)},0);
  $('#sheet').innerHTML='<h2>Trip settings</h2><div class="two"><div class="f"><label>First day</label><input type="date" id="tStart" value="'+esc(state.trip.start)+'"></div><div class="f"><label>Number of days</label><input type="number" min="1" max="30" id="tDays" value="'+state.trip.days+'"></div></div>'+
  '<p class="small">Weather is live from Open-Meteo for any trip day up to 16 days out, using each day’s base (or first stop). It refreshes when you open the app.'+(wx&&wx.fetchedAt?' Last update: '+esc(new Date(wx.fetchedAt).toLocaleString())+'.':'')+' <button class="lnk" id="tWx">Refresh now</button></p>'+
  '<div class="card"><div class="ct">Offline maps</div><div class="small">Saves the Scotland overview plus close-up map around every queued place, for when signal drops. Use Wi-Fi; roughly 20–60 MB.</div><div class="acts"><button class="btn" id="tOff">Save maps for offline</button></div><div class="small" id="tOffMsg"></div></div>'+
  '<div class="card"><div class="ct">On iPhone</div><div class="small">In Safari tap Share → <b>Add to Home Screen</b>. It opens full-screen like an app, can use your location, and keeps your data on the phone. Copy a backup now and then.</div></div>'+
  (total?'<p class="small">Booked costs so far: <b>'+money(total)+'</b></p>':'')+
  '<div class="f"><label>Backup — copy somewhere safe, or paste one in to restore (v1 backups work too)</label><textarea id="tJson" style="min-height:80px;font-size:11px;font-family:ui-monospace,monospace"></textarea></div><div class="small" id="tMsg" style="min-height:18px"></div>'+
  '<div class="acts"><button class="btn" id="tCopy">Copy backup</button><button class="btn" id="tRestore">Restore pasted</button><button class="btn" id="tExp">Export for Google Maps</button><span class="grow"></span><button class="btn primary" id="tDone">Done</button></div>';
  $('#tJson').value=JSON.stringify(state);$('#ov').classList.remove('hidden');
  $('#tStart').onchange=$('#tDays').onchange=function(){state.trip.start=$('#tStart').value;state.trip.days=Math.max(1,Math.min(30,+$('#tDays').value||7));state.pins.forEach(function(p){if(p.day>state.trip.days)p.day=0});if(ui.day>state.trip.days)ui.day=1;commit();render()};
  $('#tCopy').onclick=function(){var t=$('#tJson');try{navigator.clipboard.writeText(t.value).then(function(){$('#tMsg').textContent='Copied.'},function(){t.select();$('#tMsg').textContent='Selected — copy it manually.'})}catch(e){t.select();$('#tMsg').textContent='Selected — copy it manually.'}};
  $('#tRestore').onclick=function(){try{var s=migrate(JSON.parse($('#tJson').value));if(!s)throw 0;state=s;commit();render();$('#tMsg').textContent='Restored '+s.pins.length+' places.'}catch(e){$('#tMsg').textContent='That isn’t a valid backup.'}};
  $('#tExp').onclick=function(){exportCSV()};
  $('#tWx').onclick=function(){this.textContent='Refreshing…';refreshWx(true).then(function(){var b=$('#tWx');if(b)b.textContent='Updated'})};
  $('#tOff').onclick=function(){var b=this;b.disabled=true;offlineMaps(function(t){$('#tOffMsg').textContent=t}).then(function(){b.disabled=false})};
  $('#tDone').onclick=closeSheet;
};

/* ---------- offline map saving ---------- */
function lon2x(l,z){return Math.floor((l+180)/360*Math.pow(2,z))}
function lat2y(a,z){var r=a*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*Math.pow(2,z))}
function offlineMaps(msg){
  if(!window.caches){msg('This browser can’t save maps offline.');return Promise.resolve()}
  msg('Getting map info…');
  return fetch(STYLE).then(function(r){return r.json()}).then(function(st){
    var src=null;for(var k in st.sources){if(st.sources[k].type==='vector'&&st.sources[k].url){src=st.sources[k].url;break}}
    return fetch(src).then(function(r){return r.json()}).then(function(tj){
      var tpl=tj.tiles[0],urls={};
      function add(z,x,y){urls[tpl.replace('{z}',z).replace('{x}',x).replace('{y}',y)]=1}
      function box(w,s,e,n,z0,z1){for(var z=z0;z<=z1;z++){for(var x=lon2x(w,z);x<=lon2x(e,z);x++)for(var y=lat2y(n,z);y<=lat2y(s,z);y++)add(z,x,y)}}
      box(-8.2,54.6,-0.7,60.9,4,9);
      state.pins.filter(function(p){return p.stage==='queue'&&hasLoc(p)}).forEach(function(p){box(p.lng-.09,p.lat-.05,p.lng+.09,p.lat+.05,10,13)});
      var extra=[];if(st.sprite){var sp=typeof st.sprite==='string'?st.sprite:st.sprite[0].url;['.json','.png','@2x.json','@2x.png'].forEach(function(x){extra.push(sp+x)})}
      if(st.glyphs)['Noto Sans Regular','Noto Sans Bold','Noto Sans Italic'].forEach(function(f){['0-255','256-511','8192-8447'].forEach(function(rg){extra.push(st.glyphs.replace('{fontstack}',encodeURIComponent(f)).replace('{range}',rg))})});
      var list=Object.keys(urls).concat(extra,[STYLE,src]),done=0,fail=0,bytes=0;
      return caches.open('tiles-v1').then(function(cache){
        var i=0;function next(){if(i>=list.length)return Promise.resolve();var u=list[i++];
          return cache.match(u).then(function(hit){if(hit){done++;return}return fetch(u).then(function(r){if(r.ok){return r.clone().arrayBuffer().then(function(b){bytes+=b.byteLength;return cache.put(u,r)})}fail++}).catch(function(){fail++}).then(function(){done++})})
          .then(function(){if(done%25===0)msg('Saving maps… '+done+' / '+list.length+' ('+(bytes/1048576).toFixed(1)+' MB)');return next()})}
        return Promise.all([next(),next(),next(),next(),next(),next()]).then(function(){msg('Saved '+(done-fail)+' map pieces ('+(bytes/1048576).toFixed(1)+' MB new)'+(fail?' · '+fail+' failed, try again on better signal':'')+'. Add more places? Run this again.')});
      });
    });
  }).catch(function(){msg('Couldn’t reach the map server — try again on Wi-Fi.')});
}
/* ---------- boot ---------- */
function render(){
  $('#sub').textContent=(state.trip.start?dayDate(1)+' → '+dayDate(state.trip.days):state.trip.days+' days · set dates under Trip')+' · sunset ≈ 4pm';
  renderTabs();renderPanel();drawPins();drawRoute();
}
function resize(){if(map)map.resize()}
$('#panel').classList.toggle('min',!!ui.min);
render();initMap();
try{new ResizeObserver(function(){clearTimeout(rz);rz=setTimeout(resize,80)}).observe($('#mapwrap'))}catch(e){}
setSave('Saved on this phone');
maybeRefresh();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
