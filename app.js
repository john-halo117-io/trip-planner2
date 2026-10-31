(function(){
"use strict";var rz;
if(window.top!==window.self){document.documentElement.innerHTML='';throw new Error('framed')}
var APP_VERSION='2026.10.30-library';var LS='scotPinMap.v1', LSUI='scotPinMap.ui2';
var CATS={hike:['Hike / walk','#2f7d4f',180],castle:['Castle / history','#7a4a8c',120],scenic:['Scenic stop','#1f6f9a',30],city:['Town / city','#b0542b',120],food:['Food / drink','#c28a12',75],stay:['Lodging','#3c4447',0],shop:['Books & antiques','#8a5a2b',75]};
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
var GEAR_GENERIC=[['Layers','base_top','Base-layer top (merino/synthetic)',2],['Layers','base_bot','Base-layer leggings',1],['Layers','fleece','Fleece mid-layer',1],['Layers','puffy','Insulated puffy jacket',1],['Layers','shell','Waterproof jacket',1],['Layers','pants','Hiking trousers',2],['Layers','overpants','Waterproof overtrousers',1],
 ['Head & hands','beanie','Warm hat',1],['Head & hands','neck','Neck gaiter / buff',1],['Head & hands','liners','Liner gloves',1],['Head & hands','wgloves','Waterproof gloves',1],
 ['Feet','socks','Wool hiking socks',3],['Feet','boots','Waterproof hiking boots',1],['Feet','gaiters','Leg gaiters',1],['Feet','spikes','Microspikes',1],
 ['Day pack','daypack','Daypack + rain cover',1],['Day pack','headlamp','Headlamp',1],['Day pack','thermos','Water bottle / thermos',1],['Day pack','snacks','Trail snacks',1],
 ['Town & travel','town','Evening outfit + dry shoes',1],['Town & travel','docs','Passport + tickets',1]];
var PCOL=['#2b5d6b','#c0612f','#7a4a8c','#2f7d4f','#c28a12','#c2577a'];
var LIB2=[["Doune Castle",56.1855,-4.0503,"castle","14th-century castle used in Monty Python and Outlander (Castle Leoch). Historic Environment Scotland site: shorter winter hours, check before you go."],["National Wallace Monument",56.1386,-3.9187,"castle","Tower on Abbey Craig with William Wallace’s sword and huge views over Stirling."],["Battle of Bannockburn",56.0937,-3.9373,"castle","Site of Robert the Bruce’s 1314 victory, with an interactive visitor centre and statue."],["Linlithgow Palace",55.9768,-3.6007,"castle","Roofless royal palace where Mary Queen of Scots was born. Access can be limited during conservation work. Historic Environment Scotland site: shorter winter hours, check before you go."],["Blackness Castle",56.0049,-3.5185,"castle","“The ship that never sailed”: a castle shaped like a ship on the Forth, used in Outlander. Historic Environment Scotland site: shorter winter hours, check before you go."],["Craigmillar Castle",55.9265,-3.1408,"castle","Edinburgh’s quieter castle: one of Scotland’s best-preserved medieval ruins, and Mary Queen of Scots stayed here. Historic Environment Scotland site: shorter winter hours, check before you go."],["Tantallon Castle",56.056,-2.651,"castle","Red cliff-top fortress facing the Bass Rock. Dramatic in wind. Historic Environment Scotland site: shorter winter hours, check before you go."],["St Andrews Cathedral & Castle",56.3398,-2.788,"castle","Ruins of Scotland’s largest medieval cathedral, with a tower to climb, plus the clifftop castle and its siege tunnels. Historic Environment Scotland site: shorter winter hours, check before you go."],["Falkland Palace",56.2534,-3.2063,"castle","Renaissance hunting palace of the Stuarts in a pretty village. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Culross",56.0558,-3.629,"castle","Perfectly preserved 17th-century village with cobbles and the ochre “Palace”, used in Outlander."],["Glamis Castle",56.6206,-3.0016,"castle","Childhood home of the Queen Mother; the setting of Macbeth. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Scone Palace",56.4227,-3.44,"castle","Crowning place of Scottish kings (the Stone of Destiny). Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Blair Castle",56.7663,-3.8479,"castle","White-harled castle of the Dukes of Atholl. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Kilchurn Castle",56.4048,-5.029,"castle","Ruined castle on a spit of land in Loch Awe. One of the most photogenic ruins in Scotland."],["Castle Stalker (view)",56.5703,-5.387,"castle","The island tower from Monty Python. Best seen from the café car park lay-by on the A828; the castle itself is private."],["Inveraray Castle",56.2373,-5.0735,"castle","Fairytale seat of the Dukes of Argyll on Loch Fyne. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Duart Castle (Mull)",56.4556,-5.6548,"castle","MacLean clan castle on a crag above the Sound of Mull. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Dunvegan Castle (Skye)",57.4486,-6.59,"castle","MacLeod seat for 800 years, with the Fairy Flag. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Duntulm Castle ruins (Skye)",57.6878,-6.344,"castle","Wind-blasted clifftop MacDonald ruin at the tip of Trotternish. View from the path; the ruin is unstable."],["Castle Tioram",56.7848,-5.8277,"castle","Tidal-island castle on Loch Moidart; walk the sand spit at low tide. Exterior only."],["Ardvreck Castle",58.166,-4.993,"castle","Lonely 16th-century ruin on Loch Assynt."],["Glenfinnan Monument",56.871,-5.438,"castle","Where Bonnie Prince Charlie raised his standard in 1745, at the head of Loch Shiel."],["Fort George",57.5835,-4.07,"castle","Vast 18th-century artillery fort, still a working barracks, with dolphins often in the firth. Historic Environment Scotland site: shorter winter hours, check before you go."],["Cawdor Castle",57.5245,-3.9277,"castle","Macbeth-linked castle with gardens. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Elgin Cathedral",57.6505,-3.3108,"castle","“Lantern of the North”: magnificent cathedral ruins. Historic Environment Scotland site: shorter winter hours, check before you go."],["Dunrobin Castle",57.9817,-3.945,"castle","French-chateau-style castle above the sea. Usually closed in November (opens roughly Apr–Oct), but worth seeing from outside."],["Glasgow Cathedral",55.8628,-4.2347,"castle","Mainland Scotland’s only medieval cathedral to survive the Reformation intact. Next to the Necropolis."],["New Lanark",55.6633,-3.7835,"castle","UNESCO-listed 18th-century mill village by the Falls of Clyde."],["Melrose Abbey",55.5985,-2.718,"castle","Ruined abbey where Robert the Bruce’s heart is buried. Lovely carvings, including a bagpiping pig. Historic Environment Scotland site: shorter winter hours, check before you go."],["Jedburgh Abbey",55.4769,-2.5546,"castle","Huge, nearly complete Augustinian abbey ruin in the Borders. Historic Environment Scotland site: shorter winter hours, check before you go."],["Abbotsford",55.5992,-2.782,"castle","Sir Walter Scott’s fantastical home. The house can be seasonal; check."],["Caerlaverock Castle",54.9757,-3.524,"castle","Unique triangular moated castle near Dumfries. Historic Environment Scotland site: shorter winter hours, check before you go."],["Kilmartin Glen",56.1339,-5.488,"castle","Over 800 prehistoric monuments: cairns, standing stones and rock art. Good museum."],["Dunadd Fort",56.0896,-5.479,"castle","Hill where the kings of Dál Riata were crowned; put your foot in the carved footprint."],["Iona Abbey",56.3346,-6.3926,"castle","Cradle of Scottish Christianity, reached via Mull and a short ferry."],["Calanais Standing Stones (Lewis)",58.1975,-6.7453,"castle","Cross-shaped circle of 5,000-year-old stones."],["Skara Brae (Orkney)",59.0487,-3.3418,"castle","Neolithic village older than the pyramids."],["Ring of Brodgar (Orkney)",59.0015,-3.2296,"castle","Vast stone circle between two lochs."],["Castle Campbell & Dollar Glen",56.1765,-3.673,"castle","Castle Gloom above a ravine walk with bridges and waterfalls. Historic Environment Scotland site: shorter winter hours, check before you go."],["Falkirk Wheel",56.0,-3.841,"castle","The world’s only rotating boat lift. Free to watch."],["Queen's View",56.7166,-3.8053,"scenic","Classic view west along Loch Tummel, admired by Queen Victoria in 1866."],["Rest and Be Thankful",56.2268,-4.864,"scenic","A83 summit viewpoint down Glen Croe. The road is prone to landslip closures, so check Traffic Scotland."],["Three Sisters viewpoint, Glencoe",56.668,-5.044,"scenic","The big Glencoe lay-by view of the three buttresses. Arrive early; it gets busy."],["Rannoch Moor (Lochan na h-Achlaise)",56.59,-4.803,"scenic","Wild moor and lochans on the A82. Stunning in frost or low sun."],["Commando Memorial",56.8975,-4.9268,"scenic","WWII memorial with a panorama of Ben Nevis and the Grey Corries."],["Loch Garry “map of Scotland” viewpoint",57.076,-4.994,"scenic","A87 lay-by where the loch’s shape looks like a map of Scotland."],["Five Sisters viewpoint (Mam Ratagan)",57.214,-5.474,"scenic","Hairpin road above Glen Shiel with the best view of the Five Sisters of Kintail."],["Bealach na Bà (Applecross)",57.4205,-5.723,"scenic","Britain’s highest road pass, a steep single-track with Skye views. Avoid in snow or ice; it often closes."],["Corrieshalloch Gorge",57.7547,-5.0218,"scenic","Suspension bridge over a 60 m slot gorge and the Falls of Measach, near Ullapool."],["Falls of Foyers",57.2505,-4.492,"scenic","Waterfall above Loch Ness that Robert Burns wrote about. Short steep paths."],["Plodda Falls",57.278,-4.858,"scenic","46 m waterfall with a viewing platform over the drop, in old Douglas firs."],["Kilt Rock & Mealt Falls (Skye)",57.6105,-6.172,"scenic","Waterfall plunging off basalt sea cliffs. Roadside viewpoint."],["Sligachan Old Bridge (Skye)",57.2905,-6.172,"scenic","Iconic view of the Cuillin. Legend says dipping your face in the river gives eternal beauty."],["Elgol (Skye)",57.146,-6.1065,"scenic","Arguably the finest view of the Cuillin, across Loch Scavaig. Single-track road."],["Inveruglas Pyramid",56.2505,-4.7125,"scenic","Architectural viewpoint on Loch Lomond’s shore."],["Luss",56.101,-4.638,"scenic","Pretty conservation village and pier on Loch Lomond."],["Dun na Cuaiche watchtower",56.244,-5.066,"scenic","Woodland climb above Inveraray to a folly tower with a view down Loch Fyne."],["Scott's View",55.6018,-2.645,"scenic","Sir Walter Scott’s favourite view over the Tweed and the Eildon Hills."],["Linn of Dee",56.99,-3.548,"scenic","River Dee squeezed through a rocky gorge west of Braemar."],["Duncansby Head stacks",58.644,-3.026,"scenic","Lighthouse cliffs and pointed sea stacks near John o’ Groats."],["Dunnet Head",58.671,-3.376,"scenic","The most northerly point of mainland Britain, with views to Orkney."],["Smoo Cave",58.5631,-4.7194,"scenic","Huge sea cave with a waterfall chamber near Durness."],["Achmelvich Beach",58.17,-5.307,"scenic","White sand and turquoise water in Assynt."],["Luskentyre Beach (Harris)",57.884,-6.93,"scenic","Often called one of the world’s most beautiful beaches."],["Tobermory harbour (Mull)",56.6235,-6.066,"scenic","The colourful harbour front. Tobermory distillery is on the quay."],["Pap of Glencoe",56.689,-5.091,"hike","The best viewpoint hike in Glencoe, looking down Loch Leven. About 4 hours; steep and rocky near the top."],["Ben Lomond (Rowardennan)",56.153,-4.644,"hike","Scotland’s most southerly Munro on a clear path. About 5 hours; wintry on top in November."],["The Cobbler (Succoth)",56.202,-4.782,"hike","Arrochar’s jagged favourite. About 5 hours; the summit block is a scramble, so skip it if wet."],["Schiehallion (Braes of Foss)",56.656,-4.045,"hike","“Fairy hill of the Caledonians”, with a good path to a boulder-field top. About 4–5 hours."],["Ben Vrackie (Pitlochry)",56.717,-3.739,"hike","Popular half-day hill from Moulin with a big Perthshire view. About 3–4 hours."],["Meall a' Bhuachaille (Glenmore)",57.168,-3.684,"hike","Corbett above Glenmore via the Ryvoan bothy and the green lochan. About 4 hours."],["The Book Shop, Wigtown",54.8675,-4.4425,"shop","Scotland’s largest second-hand bookshop: about a mile of shelving and 100,000 books, in Scotland’s National Book Town."],["ReadingLasses Bookshop & Café, Wigtown",54.867,-4.443,"shop","Bookshop-café in the Book Town. Wigtown has over a dozen bookshops; make a day of it."],["Byre Books, Wigtown",54.8668,-4.444,"shop","Characterful Wigtown shop for folklore, Scottish history and rare finds."],["Leakey's Bookshop, Inverness",57.4796,-4.2275,"shop","Huge second-hand bookshop in an old Gaelic church, with a wood stove and balcony."],["Armchair Books, Edinburgh",55.9468,-3.1983,"shop","Magical floor-to-ceiling second-hand and antiquarian shop off the Grassmarket."],["McNaughtan's Bookshop, Edinburgh",55.9586,-3.184,"shop","Scotland’s oldest second-hand bookshop (1957). Shares its basement with Typewronger."],["The Watermill, Aberfeldy",56.6217,-3.865,"shop","Restored watermill bookshop, café and gallery, named one of the world’s great bookshops."],["Mainstreet Trading Co, St Boswells",55.571,-2.65,"shop","Beloved Borders bookshop with a café and deli. Pair with Scott’s View and Melrose."],["Voltaire & Rousseau, Glasgow",55.8745,-4.2885,"shop","Glasgow’s legendary chaotic second-hand bookshop in Otago Lane."],["Old Aberdeen Bookshop",57.165,-2.101,"shop","Second-hand books in the old university quarter."],["Scottish Antique & Arts Centre, Abernyte",56.4725,-3.178,"shop","One of Scotland’s biggest antiques centres: dozens of dealers plus a restaurant, between Perth and Dundee. Open 7 days."],["Scottish Antique & Arts Centre, Doune",56.1935,-4.02,"shop","Sister antiques centre near Doune Castle. Pair the two."],["Georgian Antiques, Leith",55.9715,-3.166,"shop","Vast Leith antiques warehouse (around 50,000 sq ft) of furniture and curios. Check opening days."],["Kinning Park Antique Centre, Glasgow",55.8505,-4.29,"shop","Ever-growing multi-dealer antiques centre in Glasgow’s Southside. Check opening days."],["The Barras Market, Glasgow",55.8545,-4.233,"shop","Historic weekend market for vintage, antiques and oddities. Weekends only."],["Armstrongs Vintage, Edinburgh",55.9475,-3.195,"shop","Long-running Grassmarket vintage emporium: tweed, kilts, curiosities."]];
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
    ['slot','conf','swapId','hoursSrc'].forEach(function(k){if(p[k]!=null)p[k]=String(p[k]).slice(0,80)});if(p.hours!=null)p.hours=String(p.hours).slice(0,200);p.hoursChecked=num(p.hoursChecked);p.u=num(p.u)||0});
  s.trip.days=Math.max(1,Math.min(30,parseInt(s.trip.days,10)||7));s.trip.start=/^\d{4}-\d{2}-\d{2}$/.test(s.trip.start||'')?s.trip.start:'';
  Object.keys(s.trip.dayCfg).forEach(function(k){var c=s.trip.dayCfg[k]||{};if(c.leave&&!/^\d{1,2}:\d{2}$/.test(c.leave))c.leave='08:30';['start','end'].forEach(function(x){if(c[x])c[x]=String(c[x]).replace(/[^\w-]/g,'')})});
  if(s.spend&&s.spend.items)s.spend.items=s.spend.items.filter(function(e){return e&&typeof e==='object'}).map(function(e){return {id:String(e.id||uid()).replace(/[^\w-]/g,''),amt:num(e.amt)||0,cur:e.cur==='USD'?'USD':'GBP',cat:String(e.cat||'other').replace(/[^\w]/g,''),day:Math.max(0,parseInt(e.day,10)||0),note:String(e.note||'').slice(0,120),ts:num(e.ts)||0,src:e.src?String(e.src).replace(/[^\w-]/g,''):undefined,u:num(e.u)||0}});
  if(s.pack&&s.pack.items)s.pack.items=s.pack.items.filter(function(i){return i&&typeof i==='object'}).map(function(i){return {id:String(i.id||uid()).replace(/[^\w-]/g,''),group:String(i.group||'Other').slice(0,40),name:String(i.name||'').slice(0,100),qty:Math.max(1,parseInt(i.qty,10)||1),packed:!!i.packed,who:String(i.who||'').replace(/[^\w-]/g,'').slice(0,20),u:num(i.u)||0}});
  s.pins.forEach(function(p){if(p.stage!=='queue')p.day=0;p.day=p.day||0;if(p.lat==null||p.lng==null){p.lat=null;p.lng=null}});
  if(!Array.isArray(s.people)||!s.people.length)s.people=[{id:'p1',name:'Me',color:PCOL[0],u:0}];
  s.people=s.people.filter(function(x){return x&&typeof x==='object'}).slice(0,8).map(function(x,i){return {id:String(x.id||('p'+(i+1))).replace(/[^\w-]/g,'').slice(0,20)||('p'+(i+1)),name:String(x.name||'Traveler').slice(0,24),color:/^#[0-9a-f]{6}$/i.test(x.color||'')?x.color:PCOL[i%PCOL.length],u:num(x.u)||0}});
  var pids={};s.people.forEach(function(x){pids[x.id]=1});
  s.pack.items.forEach(function(i){if(!pids[i.who])i.who=s.people[0].id});
  if(!Array.isArray(s.fits))s.fits=[];
  s.fits=s.fits.filter(function(f){return f&&typeof f==='object'&&pids[f.who]}).map(function(f){var set={};if(f.set&&typeof f.set==='object')Object.keys(f.set).slice(0,60).forEach(function(k){if(/^[\w:-]{1,60}$/.test(k)&&/^(wear|pack|off)$/.test(f.set[k]))set[k]=f.set[k]});
    return {id:String(f.id||'').replace(/[^\w-]/g,'').slice(0,60),day:Math.max(1,parseInt(f.day,10)||1),who:f.who,set:set,extra:(Array.isArray(f.extra)?f.extra:[]).slice(0,12).map(function(x){return String(x).slice(0,60)}),note:String(f.note||'').slice(0,200),by:String(f.by||'').slice(0,24),u:num(f.u)||0}}).filter(function(f){return f.id});
  s.flags=(s.flags&&typeof s.flags==='object')?{xmas26:!!s.flags.xmas26,lib2:!!s.flags.lib2}:{};
  if(!s.flags.xmas26){s.flags.xmas26=true;if(!s.pins.some(function(p){return /christmas market/i.test(p.name)}))s.pins.push({id:'evt-xmas26',name:"Edinburgh's Christmas Market",lat:55.9519,lng:-3.1925,cat:'city',stage:'queue',booked:false,day:0,order:0,notes:'East Princes Street Gardens. 14 Nov 2026 – 3 Jan 2027, usually 10am–10pm (closed 25 Dec; a few dates have shorter hours). Free entry; Big Wheel & rides paid. Christmas at the Botanics light trail and George St ice rink are nearby (ticketed).',hours:'Mo-Su 10:00-22:00',hoursSrc:'Edinburgh’s Christmas',mins:150,u:0})}
  s.flags.lib2=!!(s.flags.lib2||(s.flags&&s.flags.lib2));
  if(!s.flags.lib2){s.flags.lib2=true;var have={};s.pins.forEach(function(p){have[p.name.toLowerCase().replace(/[^a-z]/g,'')]=1});
    LIB2.forEach(function(x,i){var k=x[0].toLowerCase().replace(/[^a-z]/g,'');if(have[k])return;s.pins.push({id:'l2-'+i,name:x[0],lat:x[1],lng:x[2],cat:x[3],stage:'library',booked:false,day:0,order:1000+i,notes:x[4],seed:true,u:0})})}
  var dl={};if(s.del&&typeof s.del==='object')Object.keys(s.del).forEach(function(k){var t=num(s.del[k]);if(t&&/^[\w-]{1,40}$/.test(k)&&Date.now()-t<90*864e5)dl[k]=t});s.del=dl;
  s.v=3;return s;
}
var state;
try{state=migrate(JSON.parse(localStorage.getItem(LS)))}catch(e){}
if(!state){try{state=migrate(JSON.parse(document.getElementById('seed').textContent))}catch(e){}}
if(!state)state=migrate({v:2,updated:0,trip:{start:'',days:7},pins:[]});
var ui={tab:'queue',day:1,cat:'all',showLib:false,min:false,t:null,q:''};
try{var u=JSON.parse(localStorage.getItem(LSUI));if(u)for(var k in u)ui[k]=u[k]}catch(e){}
(function(){var T={today:1,queue:1,plan:1,pack:1,near:1,spend:1,library:1,done:1};if(ui.area&&!/^[a-z]{3,4}$/.test(ui.area))ui.area='auto';if(ui.tcat&&!/^[a-z]{3,6}$/.test(ui.tcat))ui.tcat='all';if(ui.ecat&&!/^[a-z]{3,6}$/.test(ui.ecat))ui.ecat='food';if(!T[ui.tab])ui.tab='queue';ui.day=Math.max(1,parseInt(ui.day,10)||1);if(ui.cat!=='all'&&!CATS[ui.cat])ui.cat='all';ui.q=String(ui.q||'').slice(0,60);ui.min=!!ui.min;ui.showLib=!!ui.showLib;
  var v=ui.view;if(!(v&&v.c&&isFinite(v.c[0])&&isFinite(v.c[1])&&Math.abs(v.c[0])<=180&&Math.abs(v.c[1])<=85&&isFinite(v.z)&&v.z>=0&&v.z<=20))ui.view=null;if(ui.spCat&&!/^\w+$/.test(ui.spCat))ui.spCat='food';if(ui.who!=null&&!/^[\w-]{1,20}$/.test(String(ui.who)))ui.who=null})();
if(ui.day>state.trip.days)ui.day=1;
function saveUI(){try{localStorage.setItem(LSUI,JSON.stringify(ui))}catch(e){}}

/* ---------- persistence (this device) + live data ---------- */
var timer=null,editing=false,pending=false,fxRate=null,fxAt='',wx=state.wx||null,geo=null;
if(state.fx){fxRate=state.fx.gbpUsd;fxAt=state.fx.at}
function setSave(t){var el=$('#save');if(el)el.textContent=t}
function persist(){try{localStorage.setItem(LS,JSON.stringify(state));setSave('Saved')}catch(e){setSave('Couldn’t save — storage full?')}}
function commit(){state.updated=Date.now();if(sync){try{stampAll()}catch(e){}}persist();if(sync)scheduleSync();clearTimeout(timer);timer=setTimeout(function(){if(planKey()!==(wx&&wx.key))refreshWx(true)},1500)}
function busyInput(){return false}
document.addEventListener('visibilitychange',function(){if(document.hidden){saveUI();if(sync)syncNow()}else{maybeRefresh();if(sync)scheduleSync(300)}});
window.addEventListener('online',function(){if(sync)scheduleSync(300)});
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
var WMO={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Showers',81:'Heavy showers',82:'Violent showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'};
var wxBusy=false;
function planKey(){var a=[];for(var n=1;n<=state.trip.days;n++){var b=wxPlace(n);a.push(isoDate(n)+':'+(b?b.lat.toFixed(2)+','+b.lng.toFixed(2):''))}return a.join('|')}
function localIso(addDays){var d=new Date();d.setDate(d.getDate()+(addDays||0));return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function refreshWx(force){
  if(wxBusy||!state.trip.start)return Promise.resolve();
  var today=localIso(0),lim=localIso(15),groups={};
  for(var n=1;n<=state.trip.days;n++){var d=isoDate(n),b=wxPlace(n);if(!d||!b||d<today||d>lim)continue;var k=b.lat.toFixed(2)+','+b.lng.toFixed(2);(groups[k]=groups[k]||{p:b,dates:[]}).dates.push(d)}
  var keys=Object.keys(groups);if(!keys.length)return Promise.resolve();
  if(!force&&wx&&wx.fetchedAt&&Date.now()-Date.parse(wx.fetchedAt)<3*3600e3&&wx.key===planKey())return Promise.resolve();
  wxBusy=true;var days=Object.assign({},(wx&&wx.days)||{}),ok=0;
  return Promise.all(keys.map(function(k){var g=groups[k];
    var u='https://api.open-meteo.com/v1/forecast?latitude='+g.p.lat.toFixed(3)+'&longitude='+g.p.lng.toFixed(3)+'&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max&wind_speed_unit=mph&timezone=Europe%2FLondon&past_days=1&forecast_days=16';
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

/* ---------- end-to-end encrypted sync (Supabase stores only ciphertext) ---------- */
var LSSYNC='scotPinMap.sync',LSBASE='scotPinMap.syncbase';
var sync=null,syncK=null,syncBase=null,syncBusy=false,syncAgain=false,syncTimer=null,syncState={msg:'',ok:true,at:0};
try{sync=JSON.parse(localStorage.getItem(LSSYNC))}catch(e){}
try{syncBase=JSON.parse(localStorage.getItem(LSBASE))}catch(e){}
var enc=new TextEncoder(),decd=new TextDecoder();
function b64u(buf){var s='',b=new Uint8Array(buf);for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64u(s){s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
function validUrl(u){return /^https:\/\/[a-z0-9]{8,40}\.supabase\.co$/.test(u)}
function keyKind(k){k=String(k||'').trim();if(/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(k))return 'pub';if(/^sb_secret_/.test(k))return 'secret';
  var m=k.match(/^[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+$/);if(m){try{var p=JSON.parse(decd.decode(ub64u(m[1])));return p.role==='anon'?'pub':p.role==='service_role'?'secret':'bad'}catch(e){}}return 'bad'}
function deriveKeys(secret){
  var raw=ub64u(secret);if(raw.length!==32)return Promise.reject(new Error('bad code'));
  return crypto.subtle.importKey('raw',raw,'HKDF',false,['deriveKey','deriveBits']).then(function(base){
    var salt=enc.encode('trip-planner-sync-v1');
    function bits(info,n){return crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt:salt,info:enc.encode(info)},base,n)}
    return Promise.all([bits('trip-id',128),bits('write-token',256),crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt:salt,info:enc.encode('encryption')},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])])
      .then(function(r){return {id:hex(r[0]),token:hex(r[1]),key:r[2]}});
  });
}
function seal(obj){var iv=crypto.getRandomValues(new Uint8Array(12));return crypto.subtle.encrypt({name:'AES-GCM',iv:iv,additionalData:enc.encode(syncK.id)},syncK.key,enc.encode(JSON.stringify(obj))).then(function(ct){return 'v1.'+b64u(iv)+'.'+b64u(ct)})}
function unseal(s){var p=String(s).split('.');if(p[0]!=='v1'||p.length!==3)return Promise.reject(new Error('format'));return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64u(p[1]),additionalData:enc.encode(syncK.id)},syncK.key,ub64u(p[2])).then(function(b){return JSON.parse(decd.decode(b))})}
function rpc(fn,args){var h={'Content-Type':'application/json',apikey:sync.key};if(keyKind(sync.key)==='pub'&&!/^sb_/.test(sync.key))h.Authorization='Bearer '+sync.key;
  return fetch(sync.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:h,body:JSON.stringify(args),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}).then(function(r){return r.text().then(function(t){var j=null;try{j=JSON.parse(t)}catch(e){}if(!r.ok){var e=new Error((j&&(j.message||j.hint))||('HTTP '+r.status));e.status=r.status;throw e}return j})})}
function syncable(s){var c=JSON.parse(JSON.stringify(s));delete c.wx;delete c.fx;return c}
function strip(x){var c=Object.assign({},x);delete c.u;return JSON.stringify(c)}
function stampColl(cur,old,now,del){var om={};(old||[]).forEach(function(x){om[x.id]=x});var cm={};(cur||[]).forEach(function(x){cm[x.id]=1;var o=om[x.id];if(!o){if(!x.u)x.u=now}else if(strip(x)!==strip(o))x.u=now});(old||[]).forEach(function(x){if(!cm[x.id])del[x.id]=now})}
function stampAll(){if(!sync||!syncBase)return;var now=Date.now();state.del=state.del||{};stampColl(state.pins,syncBase.pins,now,state.del);stampColl(state.spend.items,syncBase.spend&&syncBase.spend.items,now,state.del);stampColl(state.pack.items,syncBase.pack&&syncBase.pack.items,now,state.del);stampColl(state.people,syncBase.people,now,state.del);stampColl(state.fits,syncBase.fits,now,state.del)}
function mergeColl(a,b,del){var m={};(a||[]).forEach(function(x){m[x.id]=x});(b||[]).forEach(function(x){var y=m[x.id];if(!y||(x.u||0)>(y.u||0))m[x.id]=x});return Object.keys(m).map(function(k){return m[k]}).filter(function(x){return !(del[x.id]&&del[x.id]>=(x.u||0))})}
function mergeStates(L,R){var del=Object.assign({},R.del||{});Object.keys(L.del||{}).forEach(function(k){del[k]=Math.max(del[k]||0,L.del[k])});
  var newer=(R.updated||0)>(L.updated||0)?R:L,out=JSON.parse(JSON.stringify(newer));
  out.pins=mergeColl(L.pins,R.pins,del);out.spend.items=mergeColl(L.spend.items,R.spend.items,del);out.pack.items=mergeColl(L.pack.items,R.pack.items,del);out.people=mergeColl(L.people,R.people,del);out.fits=mergeColl(L.fits,R.fits,del);
  out.del=del;out.updated=Math.max(L.updated||0,R.updated||0);out.wx=state.wx;out.fx=state.fx;return out}
function setBase(s){syncBase=syncable(s);try{localStorage.setItem(LSBASE,JSON.stringify(syncBase))}catch(e){}}
function saveSyncCfg(){try{if(sync)localStorage.setItem(LSSYNC,JSON.stringify(sync));else{localStorage.removeItem(LSSYNC);localStorage.removeItem(LSBASE)}}catch(e){}}
function syncStatus(msg,ok){syncState={msg:msg,ok:ok!==false,at:Date.now()};var el=$('#syncMsg');if(el)el.textContent=msg;setSave(ok===false?'⚠ '+msg:msg)}
function scheduleSync(ms){if(!sync)return;clearTimeout(syncTimer);syncTimer=setTimeout(syncNow,ms==null?2500:ms)}
function syncNow(){
  if(!sync)return Promise.resolve();if(syncBusy){syncAgain=true;return Promise.resolve()}
  if(!navigator.onLine){syncStatus('Offline — will sync later',true);return Promise.resolve()}
  syncBusy=true;var tries=0;
  function ready(){return syncK?Promise.resolve():deriveKeys(sync.secret).then(function(k){syncK=k})}
  function pull(){return rpc('get_trip',{p_id:syncK.id}).then(function(rows){var row=rows&&rows[0];if(!row)return null;
    if(+row.version===sync.version)return null;
    return unseal(row.data).then(function(remote){remote=migrate(remote);if(!remote)throw new Error('bad data');
      stampAll();var merged=mergeStates(syncable(state),remote);state=migrate(merged)||state;sync.version=+row.version;saveSyncCfg();setBase(remote);
      try{localStorage.setItem(LS,JSON.stringify(state))}catch(e){}if(!editing)render();return true})})}
  function push(){stampAll();var cur=syncable(state);if(syncBase&&JSON.stringify(cur)===JSON.stringify(syncBase)&&sync.version>0)return Promise.resolve('clean');
    return seal(cur).then(function(blob){if(blob.length>1900000)throw new Error('Trip too large to sync');return rpc('put_trip',{p_id:syncK.id,p_token:syncK.token,p_expected:sync.version,p_data:blob})}).then(function(v){v=+v;
      if(v<0){if(++tries>3)throw new Error('Busy — try again');sync.version=sync.version;return pull().then(push)}
      sync.version=v;saveSyncCfg();setBase(cur);return 'pushed'})}
  return ready().then(pull).then(push).then(function(){syncStatus('Synced ✓ '+new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}))},function(e){
      var m=String(e&&e.message||e);syncStatus(/not allowed/i.test(m)?'Sync refused: this code can’t edit that trip':/Failed to fetch|NetworkError|Load failed/i.test(m)?'Can’t reach sync server — will retry':/bad code|decrypt|OperationError/i.test(m)?'Sync code doesn’t match this trip':'Sync problem: '+m.slice(0,80),false)})
    .then(function(){syncBusy=false;if(syncAgain){syncAgain=false;scheduleSync(500)}});
}
function makeCode(url,key,secret){return 'TP1:'+b64u(enc.encode(JSON.stringify({u:url,k:key,s:secret})))}
function readCode(c){c=String(c||'').trim().replace(/\s+/g,'');if(!/^TP1:[A-Za-z0-9_-]+$/.test(c))return null;try{var o=JSON.parse(decd.decode(ub64u(c.slice(4))));if(validUrl(o.u)&&keyKind(o.k)==='pub'&&ub64u(o.s).length===32)return {url:o.u,key:o.k,secret:o.s}}catch(e){}return null}
function startSync(cfg,isNew){
  sync={url:cfg.url,key:cfg.key,secret:cfg.secret,version:0};syncK=null;
  if(isNew){setBase({pins:[],spend:{items:[]},pack:{items:[]},people:[],fits:[]});}else{syncBase=null;try{localStorage.removeItem(LSBASE)}catch(e){}}
  saveSyncCfg();syncStatus('Connecting…');
  return deriveKeys(sync.secret).then(function(k){syncK=k;
    if(isNew)return syncNow();
    return rpc('get_trip',{p_id:k.id}).then(function(rows){var row=rows&&rows[0];if(!row)throw new Error('No trip found for that code');
      return unseal(row.data).then(function(remote){remote=migrate(remote);
        /* keep what this phone added or changed before joining (untouched suggestions defer to the shared trip) */
        var now=Date.now(),tmp={};stampColl(state.pins.filter(function(p){return !p.seed}),remote.pins,now,tmp);stampColl(state.spend.items,remote.spend.items,now,tmp);stampColl(state.pack.items.filter(function(i){return i.packed||/^g/.test(i.id)}),remote.pack.items,now,tmp);
        var merged=mergeStates(syncable(state),remote);state=migrate(merged);sync.version=+row.version;saveSyncCfg();setBase(remote);persist();render();return syncNow()})});
  }).catch(function(e){var m=String(e&&e.message||e);sync=null;syncK=null;saveSyncCfg();syncStatus(/decrypt|OperationError/.test(m)?'That code doesn’t unlock this trip':m.slice(0,90),false);throw e});
}
function stopSync(){sync=null;syncK=null;saveSyncCfg();clearTimeout(syncTimer);setSave('Saved on this phone')}
function syncCard(){
  if(!sync)return '<div class="card"><div class="ct">🔒 Sync &amp; travel partner</div><div class="small">End-to-end encrypted: your trip is locked on this phone before upload, so the server only stores scrambled data. Set up Supabase once (see the guide in the repo), then start here.</div>'+
    '<div class="f" style="margin-top:8px"><label>Supabase Project URL</label><input id="syURL" placeholder="https://xxxxxxxx.supabase.co" autocomplete="off" autocapitalize="off" spellcheck="false"></div>'+
    '<div class="f"><label>Publishable key (never the secret key)</label><input id="syKey" placeholder="sb_publishable_…" autocomplete="off" autocapitalize="off" spellcheck="false"></div>'+
    '<div class="acts"><button class="btn primary" id="syNew">Start syncing this trip</button></div>'+
    '<div class="f" style="margin-top:10px"><label>…or join with a sync code from your partner or other device</label><textarea id="syCode" placeholder="TP1:…" style="min-height:54px;font-family:ui-monospace,monospace;font-size:12px" autocapitalize="off" spellcheck="false"></textarea></div>'+
    '<div class="acts"><button class="btn" id="syJoin">Join trip</button></div><div class="small" id="syncMsg" style="min-height:18px"></div></div>';
  return '<div class="card"><div class="ct">🔒 Sync &amp; travel partner</div><div class="small">On · end-to-end encrypted · '+esc(sync.url.replace('https://',''))+'</div><div class="small" id="syncMsg" style="min-height:18px">'+esc(syncState.msg)+'</div>'+
    '<div class="acts"><button class="btn" id="sySync">Sync now</button><button class="btn" id="syShare">Share sync code</button></div>'+
    '<div class="small o" style="margin-top:6px">The sync code is the key to your trip: anyone who has it can read and edit it. Only send it to your partner through an encrypted chat (iMessage or Signal), and never post it anywhere.</div>'+
    '<div class="acts"><button class="btn" id="syOff">Stop syncing on this phone</button><button class="btn danger" id="syDel">Delete trip from server</button></div></div>';
}
function bindSyncCard(){
  function on(id,fn){var el=$('#'+id);if(el)el.onclick=function(){fn(el)}}
  on('syNew',function(b){var url=$('#syURL').value.trim().replace(/\/+$/,''),key=$('#syKey').value.trim(),kk=keyKind(key);
    if(!validUrl(url)){syncStatus('That URL should look like https://abcdefgh.supabase.co',false);return}
    if(kk==='secret'){$('#syKey').value='';syncStatus('That’s your SECRET key. Never put it in an app. Use the publishable key, and consider rotating the secret one.',false);return}
    if(kk!=='pub'){syncStatus('That doesn’t look like a publishable key (sb_publishable_…)',false);return}
    var sec=b64u(crypto.getRandomValues(new Uint8Array(32)));b.disabled=true;startSync({url:url,key:key,secret:sec},true).then(function(){$('#bTrip').click()},function(){b.disabled=false})});
  on('syJoin',function(b){var cfg=readCode($('#syCode').value);if(!cfg){syncStatus('That isn’t a valid sync code',false);return}b.disabled=true;startSync(cfg,false).then(function(){$('#syCode').value='';$('#bTrip').click()},function(){b.disabled=false})});
  on('sySync',function(){syncNow()});
  on('syShare',function(){var code=makeCode(sync.url,sync.key,sync.secret);
    if(navigator.share)navigator.share({text:code}).catch(function(){});else{try{navigator.clipboard.writeText(code).then(function(){syncStatus('Code copied, so paste it into an encrypted chat')})}catch(e){}}});
  on('syOff',function(){stopSync();$('#bTrip').click()});
  var armed=false;on('syDel',function(b){if(!armed){armed=true;b.textContent='Tap again: removes it for everyone';return}
    b.disabled=true;(syncK?Promise.resolve():deriveKeys(sync.secret).then(function(k){syncK=k})).then(function(){return rpc('delete_trip',{p_id:syncK.id,p_token:syncK.token})}).then(function(){stopSync();toast('Deleted from the server. This phone still has its copy.');$('#bTrip').click()},function(e){b.disabled=false;syncStatus('Couldn’t delete: '+String(e.message||e).slice(0,60),false)})});
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
function nameFromLink(s){s=String(s);var m=s.match(/\/place\/([^\/@?]+)/)||s.match(/[?&](?:q|query|name)=([^&#]+)/i);if(m){try{var v=decodeURIComponent(m[1].replace(/\+/g,' ')).trim();if(!/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(v))return v.slice(0,80)}catch(e){}}return ''}
/* Google/Apple share links from phones are short redirects with no location inside.
   We never open them (that would contact Google/Apple); instead we use the text shared with them. */
function isShortLink(u){return /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs|maps\.apple(\.com)?\/p\/|share\.google)/i.test(u)}
function splitShared(text){
  /* pair each URL with the words shared next to it; plain lines with no URL stay as their own items */
  text=String(text||'').replace(/\r/g,'');var urlRe=/https?:\/\/[^\s<>"]+/g,items=[],last=0,m;
  if(!urlRe.test(text))return text.split(/\n+/).map(function(l){return {text:l.trim(),url:''}}).filter(function(x){return x.text});
  urlRe.lastIndex=0;
  while((m=urlRe.exec(text))){var before=text.slice(last,m.index).trim();last=m.index+m[0].length;
    /* text before the URL belongs to it (Google: "Name, address\nlink"); only keep its last block */
    var blocks=before.split(/\n\s*\n/);items.push({text:(blocks[blocks.length-1]||'').replace(/\s+/g,' ').trim(),url:m[0]})}
  var tail=text.slice(last).trim();if(tail){if(items.length&&!items[items.length-1].text)items[items.length-1].text=tail.replace(/\s+/g,' ');else tail.split(/\n+/).forEach(function(l){l=l.trim();if(l)items.push({text:l,url:''})})}
  return items;
}
function cleanShareText(t){return String(t||'').replace(/^(check out|here'?s|see)\b[^:]*:?/i,'').replace(/\s*[·•|]\s*/g,', ').replace(/★?\s*\d\.\d\s*\(\d[\d,]*\)/g,'').replace(/\s{2,}/g,' ').replace(/^[,\s]+|[,\s]+$/g,'').slice(0,160)}
function geocodeText(q){var c=map?map.getCenter():{lat:57,lng:-4.6};
  return fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&lat='+c.lat.toFixed(2)+'&lon='+c.lng.toFixed(2)+'&limit=1&lang=en').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){var f=j.features&&j.features[0];if(!f)return null;var pr=f.properties||{};return {lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0],name:pr.name||'',cat:guessCat(pr),where:[pr.city||pr.town||pr.village,pr.county].filter(Boolean).join(', ')}}).catch(function(){return null})}
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


/* ---------- travelers & per-person outfits ---------- */
function people(){return state.people}
function me(){var id=null;try{id=localStorage.getItem('scotPinMap.me')}catch(e){}return byPerson(id)||state.people[0]}
function byPerson(id){for(var i=0;i<state.people.length;i++)if(state.people[i].id===id)return state.people[i];return null}
function curPerson(){return byPerson(ui.who)||me()}
function gearOf(pid){return state.pack.items.filter(function(i){return i.who===pid})}
function ruleId(i){return String(i.id).replace(/^[\w-]+:/,'')}
function fitFor(n,pid){var id='f-'+n+'-'+pid;for(var i=0;i<state.fits.length;i++)if(state.fits[i].id===id)return state.fits[i];return null}
function fitEnsure(n,pid){var f=fitFor(n,pid);if(!f){f={id:'f-'+n+'-'+pid,day:n,who:pid,set:{},extra:[],note:'',by:'',u:0};state.fits.push(f)}return f}
/* forecast suggestion + that person's overrides -> {wear:[items],pack:[items],off:[items],extra,note,changed,o} */
function outfitFor(n,pid){
  var o=outfit(n),f=fitFor(n,pid),gear=gearOf(pid),res={wear:[],pack:[],off:[],extra:f?f.extra:[],note:f?f.note:'',by:f?f.by:'',changed:{},o:o};
  gear.forEach(function(it){var r=ruleId(it),st=o.wear.indexOf(r)>=0?'wear':o.pack.indexOf(r)>=0?'pack':'off';
    if(f&&f.set[it.id]){if(f.set[it.id]!==st)res.changed[it.id]=1;st=f.set[it.id]}res[st].push(it)});
  return res;
}
function addPerson(name){var i=state.people.length,id='p'+Date.now().toString(36).slice(-5)+Math.random().toString(36).slice(2,4);
  state.people.push({id:id,name:String(name).slice(0,24),color:PCOL[i%PCOL.length],u:0});
  GEAR_GENERIC.forEach(function(g){state.pack.items.push({id:id+':'+g[1],group:g[0],name:g[2],qty:g[3],packed:false,who:id,u:0})});return id}
function personChips(act){return '<div class="chips">'+state.people.map(function(p){return '<button class="chip pchip'+(curPerson().id===p.id?' on':'')+'" data-act="'+act+'" data-p="'+esc(p.id)+'"><i class="dot" style="background:'+esc(p.color)+'"></i>'+esc(p.name)+(me().id===p.id?' <span class="o">(me)</span>':'')+'</button>'}).join('')+'<button class="chip" data-act="people">＋ / edit</button></div>'}
function fitEditor(n){
  var p=curPerson(),r=outfitFor(n,p.id),w=r.o;
  function chip(it,st){return '<button class="k fit '+st+(r.changed[it.id]?' chg':'')+'" data-act="fitcycle" data-id="'+esc(it.id)+'" data-st="'+st+'">'+esc(it.name)+'</button>'}
  var h='<div class="card"><div class="ct">'+esc(p.name)+'’s outfit · Day '+n+(w.est?' <span class="o">(typical weather)</span>':'')+'</div>'+
   '<div class="small o" style="margin-bottom:6px">Starts from the forecast. Tap an item to move it: Wear → Pack → Not today.'+(Object.keys(r.changed).length||r.extra.length||r.note?' <button class="lnk" data-act="fitreset">Reset to forecast</button>':'')+'</div>'+
   '<div class="kit"><span class="kl">Wear</span>'+(r.wear.map(function(it){return chip(it,'wear')}).join('')||'<span class="small o">nothing yet</span>')+r.extra.map(function(x,i){return '<button class="k fit wear chg" data-act="fitxdel" data-i="'+i+'">'+esc(x)+' ✕</button>'}).join('')+'</div>'+
   '<div class="kit"><span class="kl">In the pack</span>'+(r.pack.map(function(it){return chip(it,'pack')}).join('')||'<span class="small o">nothing</span>')+'</div>'+
   '<details class="offbox"'+(r.off.length&&Object.keys(r.changed).length?' open':'')+'><summary>Not today ('+r.off.length+')</summary><div class="kit" style="margin-top:6px">'+r.off.map(function(it){return chip(it,'off')}).join('')+'</div></details>'+
   '<div class="srow" style="margin-top:6px"><input id="fitX" class="grow" placeholder="Add something for today (e.g. sunglasses)" maxlength="60"><button class="btn sm" data-act="fitxadd">Add</button></div>'+
   '<div class="f" style="margin:6px 0 0"><label>Note for '+esc(p.name)+(r.by?' <span class="o">· last edited by '+esc(r.by)+'</span>':'')+'</label><input id="fitNote" placeholder="e.g. wear the blue jacket for photos" maxlength="200" value="'+esc(r.note)+'"></div>'+
   (w.alerts.length?'<ul class="al">'+w.alerts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'</div>';
  return h;
}
function wearSummary(n){return '<div class="card"><div class="ct">Wear today</div>'+state.people.map(function(p){var r=outfitFor(n,p.id);
  return '<div class="who"><span class="wn"><i class="dot" style="background:'+esc(p.color)+'"></i>'+esc(p.name)+'</span><div class="kit">'+r.wear.map(function(it){return '<span class="k w">'+esc(it.name)+'</span>'}).join('')+r.extra.map(function(x){return '<span class="k w chg">'+esc(x)+'</span>'}).join('')+'</div>'+(r.note?'<div class="small fitnote">📝 '+esc(r.note)+'</div>':'')+'</div>'}).join('')+
  (outfit(n).alerts.length?'<ul class="al">'+outfit(n).alerts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'<button class="lnk" data-act="gopack">Change outfits →</button></div>'}
function openPeople(){
  editing=true;var my=me();
  $('#sheet').innerHTML='<h2>Travelers</h2><div class="small o" style="margin-bottom:8px">Each person gets their own packing list and daily outfit. Anyone on the trip can adjust anyone’s outfit, and it syncs.</div>'+
   state.people.map(function(p){return '<div class="srow"><i class="dot" style="background:'+esc(p.color)+'"></i><input class="grow" data-pn="'+esc(p.id)+'" value="'+esc(p.name)+'" maxlength="24"><label class="chk"><input type="radio" name="meis" data-me="'+esc(p.id)+'"'+(my.id===p.id?' checked':'')+'> this is me</label>'+(state.people.length>1?'<button class="ib" data-pdel="'+esc(p.id)+'" title="Remove">🗑</button>':'')+'</div>'}).join('')+
   '<div class="srow" style="margin-top:8px"><input id="pNew" class="grow" placeholder="Add a traveler (first name)" maxlength="24"><button class="btn sm" id="pAdd">Add</button></div>'+
   '<div class="small o" style="margin-top:6px">“This is me” is remembered on this phone only.</div><div class="acts"><span class="grow"></span><button class="btn primary" id="pDone">Done</button></div>';
  $('#ov').classList.remove('hidden');
  $$('[data-pn]').forEach(function(inp){inp.onchange=function(){var p=byPerson(inp.getAttribute('data-pn'));p.name=inp.value.trim().slice(0,24)||'Traveler';commit()}});
  $$('[data-me]').forEach(function(r){r.onchange=function(){try{localStorage.setItem('scotPinMap.me',r.getAttribute('data-me'))}catch(e){}}});
  $$('[data-pdel]').forEach(function(b){var armed=false;b.onclick=function(){if(!armed){armed=true;b.textContent='Sure?';return}var id=b.getAttribute('data-pdel'),before=snap();
    state.people=state.people.filter(function(p){return p.id!==id});state.pack.items=state.pack.items.filter(function(i){return i.who!==id});state.fits=state.fits.filter(function(f){return f.who!==id});if(ui.who===id)ui.who=null;commit();openPeople();toast('Traveler removed',before)}});
  $('#pAdd').onclick=function(){var v=$('#pNew').value.trim();if(!v)return;if(state.people.length>=8){toast('Up to 8 travelers');return}var id=addPerson(v);ui.who=id;saveUI();commit();openPeople()};
  $('#pNew').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();$('#pAdd').click()}};
  $('#pDone').onclick=closeSheet;
}

/* Quick add: one place per line. */
function quickAdd(text,day){
  var items=splitShared(text),before=snap(),added=0,moved=0,already=0,noLoc=0,found=0,shortOnly=0,last=null,pend=[];
  items.forEach(function(it){
    var line=it.url?(it.text+' '+it.url).trim():it.text,c=parseCoords(it.url||'')||parseCoords(it.text),nm=nameFromLink(it.url||'');
    if(!it.url&&!c){var ex=findExisting(it.text);
      if(ex){if(ex.stage==='queue'&&(!day||ex.day===day)){already++;return}ex.stage='queue';ex.order=nextOrder();if(day)ex.day=day;ex.seed=false;moved++;last=ex;return}}
    var words=cleanShareText(it.text.replace(/-?\d{1,3}\.\d+\s*[, ]\s*-?\d{1,3}\.\d+/,''));
    if(!nm)nm=(words.split(',')[0]||'').trim();
    if(!nm)nm=c?'Pin at '+c.lat.toFixed(3)+', '+c.lng.toFixed(3):'';
    if(!c&&it.url&&!words){shortOnly++;return}
    var p={id:uid(),name:(nm||'Unnamed place').slice(0,80),lat:c?c.lat:null,lng:c?c.lng:null,cat:'scenic',stage:'queue',booked:false,day:day||0,order:nextOrder(),notes:''};
    state.pins.push(p);added++;last=p;
    if(!c){if(words||it.text){pend.push({p:p,q:words||it.text})}else noLoc++}
  });
  if(!added&&!moved){toast(shortOnly?'That link has no location inside. In Google Maps tap Share → Copy, and paste the whole message (name + link), or use the search box above.':already?'Already in your queue':'Nothing to add');return}
  commit();render();
  function done(){var msg=[];if(added)msg.push(added+' added');if(found)msg.push(found+' located by name');if(moved)msg.push(moved+' pulled from Library');if(already)msg.push(already+' already queued');
    var miss=noLoc+(pend.length-found);toast(msg.join(' · ')+(miss?' — '+miss+' need a location (open it to place on map)':'')+(shortOnly?' · '+shortOnly+' bare link skipped':''),before);
    if(last&&hasLoc(last)&&items.length===1)flyTo(last,4)}
  if(!pend.length){done();return}
  toast('Finding '+pend.length+' place'+(pend.length>1?'s':'')+'…');
  (function next(i){if(i>=pend.length){commit();render();done();return}var x=pend[i];
    geocodeText(x.q).then(function(g){if(g&&byId(x.p.id)){x.p.lat=+g.lat.toFixed(5);x.p.lng=+g.lng.toFixed(5);if(g.cat)x.p.cat=g.cat;if(/^(Unnamed place|Pin at)/.test(x.p.name)&&g.name)x.p.name=g.name.slice(0,80);x.p.notes=(x.p.notes?x.p.notes+' ':'')+'Located by name: check the pin.';found++}setTimeout(function(){next(i+1)},250)})})(0);
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
  map.on('click','pins',function(e){if(addMode)return;var f=e.features&&e.features[0];if(f){var pid=f.properties.id;if(/^tip\d+$/.test(pid)){var el=document.getElementById('tp-'+pid);if(el){el.parentNode.scrollIntoView({behavior:'smooth',block:'center'});el.parentNode.classList.add('flash');setTimeout(function(){el.parentNode.classList.remove('flash')},1200)}return}openEditor(pid)}});
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
  if(ui.tab==='today')ui.day=tripStatus().day;
  if(ui.tab==='plan'||ui.tab==='pack'||ui.tab==='today'){var sb=startBase(ui.day),eb=endBase(ui.day);if(hasLoc(sb))bases[sb.id]=1;if(hasLoc(eb))bases[eb.id]=1}
  state.pins.forEach(function(p){
    if(!hasLoc(p))return;var role=null;
    if(bases[p.id])role='base';
    else if(!catOk(p))return;
    else if(ui.tab==='plan'||ui.tab==='pack'||ui.tab==='today'){if(p.stage==='queue')role=p.day===ui.day?'planned':(!p.day&&ui.tab==='plan'?'cand':null)}
    else if(ui.tab==='library'){if(p.stage==='library')role='lib'}
    else if(ui.tab==='done'){if(p.stage==='done')role='donep'}
    else{if(p.stage==='queue')role='q';else if((ui.showLib||!qn)&&p.stage==='library')role='lib'}
    if(role)out.push({p:p,role:role});
  });
  if(ui.tab==='near'){var ar=curArea(),cat=ui.tcat||'all';TIPO.forEach(function(t){if(t.a===ar.id&&(cat==='all'||t.c===cat))out.push({p:{id:t.id,name:t.n,lat:t.lat,lng:t.lng,cat:TCAT[t.c]},role:'tip'})})}
  return out;
}
function drawPins(){
  if(!mapReady)return;var idx={};
  if(ui.tab==='plan'||ui.tab==='pack'||ui.tab==='today')dayPins(ui.day).forEach(function(p,i){idx[p.id]=i+1});
  var feats=mapPins().map(function(d){var p=d.p,r=d.role,c=(CATS[p.cat]||CATS.scenic)[1],sel=p.id===selId;
    return {type:'Feature',geometry:{type:'Point',coordinates:[p.lng,p.lat]},properties:{id:p.id,name:p.name,role:r,
      color:r==='base'?'#ffffff':r==='donep'?'#8a9497':r==='tip'?'#c0612f':c,r:r==='planned'||r==='base'?10:r==='lib'||r==='cand'||r==='tip'?6:8,op:r==='lib'?.55:r==='cand'?.6:1,
      sc:sel||r==='base'?'#1f2a2e':'#ffffff',sw:sel?3.5:r==='base'?3:2,num:r==='planned'?String(idx[p.id]):''}}});
  feats.sort(function(a,b){var ra=a.properties.role==='planned'||a.properties.role==='base'?1:0,rb=b.properties.role==='planned'||b.properties.role==='base'?1:0;return ra-rb});
  map.getSource('pins').setData(fc(feats));
}
function drawRoute(){
  if(!mapReady)return;var seq=[];
  if(ui.tab==='plan'||ui.tab==='pack'||ui.tab==='today'){var sb=startBase(ui.day),eb=endBase(ui.day);if(hasLoc(sb))seq.push(sb);seq=seq.concat(dayPins(ui.day).filter(hasLoc));if(hasLoc(eb)&&seq.length&&seq[seq.length-1]!==eb)seq.push(eb)}
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
  if(/books|antiques|second_hand|charity|art$|crafts|gift/.test(v))return 'shop';
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

/* ---------- trip phase ---------- */
function tripStatus(){
  if(!state.trip.start)return {phase:'none',day:ui.day};
  var now=new Date(),todayIso=new Date(now.getTime()-now.getTimezoneOffset()*6e4).toISOString().slice(0,10);
  var s=Date.parse(state.trip.start+'T00:00:00Z'),t=Date.parse(todayIso+'T00:00:00Z'),d=Math.round((t-s)/864e5)+1;
  if(d<1)return {phase:'before',day:1,until:1-d};if(d>state.trip.days)return {phase:'after',day:ui.day};return {phase:'during',day:d};
}

/* ---------- opening hours (OpenStreetMap via Overpass; only when you tap "check") ---------- */
var DN=['Mo','Tu','We','Th','Fr','Sa','Su'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function ohRange(list,tok,n){var m=tok.split('-');var i=list.indexOf(m[0]),j=m[1]!=null?list.indexOf(m[1]):i;if(i<0||j<0)return null;var out=[];for(var k=i;;k=(k+1)%n){out.push(k);if(k===j)break}return out}
function ohParse(str){
  str=String(str||'').trim();if(!str)return null;if(/^24\/7$/.test(str))return [{months:null,days:[0,1,2,3,4,5,6],ranges:[[0,1440]]}];
  var rules=[],parts=str.split(/;|\|\|/);
  for(var i=0;i<parts.length;i++){var r=parts[i].trim();if(!r)continue;var months=null,days=null,ranges=null;
    var mm=r.match(/^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?(?:,(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?)*)\s*:?\s*/);
    if(mm){months=[];mm[1].split(',').forEach(function(t){var x=ohRange(MN,t,12);if(x)months=months.concat(x)});r=r.slice(mm[0].length)}
    var dm=r.match(/^((?:Mo|Tu|We|Th|Fr|Sa|Su|PH|SH)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:\s*,\s*(?:Mo|Tu|We|Th|Fr|Sa|Su|PH|SH)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?)*)\s*/);
    if(dm){days=[];var onlyHol=true;dm[1].split(/\s*,\s*/).forEach(function(t){if(t==='PH'||t==='SH')return;onlyHol=false;var x=ohRange(DN,t,7);if(x)days=days.concat(x)});r=r.slice(dm[0].length);if(onlyHol)continue}
    r=r.trim();
    if(/^(off|closed)\b/i.test(r))ranges=[];
    else if(r){ranges=[];var bad=false;r.split(/\s*,\s*/).forEach(function(t){var tm=t.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\+?$/);if(!tm){bad=true;return}var s=+tm[1]*60+ +tm[2],e=+tm[3]*60+ +tm[4];if(e<=s)e+=1440;ranges.push([s,e])});if(bad)return null}
    else if(months||days)ranges=[[0,1440]];
    else return null;
    rules.push({months:months,days:days||[0,1,2,3,4,5,6],ranges:ranges});
  }
  return rules.length?rules:null;
}
function ohOn(str,iso){var rules=ohParse(str);if(!rules||!iso)return null;var d=new Date(iso+'T12:00:00Z'),wd=(d.getUTCDay()+6)%7,mo=d.getUTCMonth(),res=[];
  rules.forEach(function(r){if(r.months&&r.months.indexOf(mo)<0)return;if(r.days.indexOf(wd)<0)return;res=r.ranges});return res}
function ohText(ranges){if(!ranges)return '';if(!ranges.length)return 'Closed';return ranges.map(function(r){return r[0]===0&&r[1]===1440?'Open 24h':hm(r[0])+'–'+hm(r[1])}).join(', ')}
function ohCheck(p,iso,arrive,leave){var rg=ohOn(p.hours,iso);if(rg==null)return null;if(!rg.length)return {bad:true,txt:'Closed that day'};
  if(arrive!=null){var ok=rg.some(function(r){return arrive>=r[0]-5&&arrive<r[1]});if(!ok){var first=rg[0];return {bad:true,txt:arrive<first[0]?'Opens '+hm(first[0]):'Closed by then ('+ohText(rg)+')'}}
    var end=rg.filter(function(r){return arrive>=r[0]-5&&arrive<r[1]})[0];if(end&&leave>end[1])return {bad:true,txt:'Closes '+hm(end[1])+' — cut it short'}}
  return {bad:false,txt:ohText(rg)}}
function fetchHours(p){
  if(!hasLoc(p))return Promise.resolve(false);
  var q='[out:json][timeout:20];nwr(around:250,'+p.lat.toFixed(5)+','+p.lng.toFixed(5)+')["opening_hours"];out tags center 30;';
  return fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
    var els=(j.elements||[]).filter(function(e){return e.tags&&e.tags.opening_hours});if(!els.length){p.hoursChecked=Date.now();return false}
    var best=els.filter(function(e){return similar(e.tags.name||e.tags['name:en']||'',p.name)})[0]||null;
    if(!best){p.hoursChecked=Date.now();return false}
    p.hours=String(best.tags.opening_hours).slice(0,200);p.hoursSrc='OpenStreetMap';p.hoursChecked=Date.now();return true}).catch(function(){return null});
}

/* ---------- calendar export (.ics built on the phone) ---------- */
function ldnOffsetMin(iso){try{var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',timeZoneName:'shortOffset'});var s=f.formatToParts(new Date(iso+'T12:00:00Z')).filter(function(x){return x.type==='timeZoneName'})[0].value;var m=s.match(/GMT([+-]\d+)?(?::(\d+))?/);return m&&m[1]?(+m[1])*60+(m[2]?(+m[2])*(m[1][0]==='-'?-1:1):0):0}catch(e){return 0}}
function icsTime(iso,min){var off=ldnOffsetMin(iso),d=new Date(Date.parse(iso+'T00:00:00Z')+(min-off)*6e4);return d.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')}
function icsEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1')}
function icsFold(l){var out='';while(l.length>73){out+=l.slice(0,73)+'\r\n ';l=l.slice(73)}return out+l}
function buildICS(withPrivate){
  var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Trip Planner//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Scotland trip'],now=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),count=0;
  for(var n=1;n<=state.trip.days;n++){var iso=isoDate(n);if(!iso)continue;var dp=dayPlan(n);
    dp.rows.forEach(function(r){var p=r.p,desc=[];if(r.leg&&r.from)desc.push('~'+dur(r.leg)+' drive from '+r.from.name);if(p.notes)desc.push(p.notes);if(p.hours)desc.push('Hours: '+p.hours);if(withPrivate){if(p.conf)desc.push('Booking ref: '+p.conf);if(+p.cost)desc.push('Cost: £'+p.cost)}
      if(hasLoc(p))desc.push(gmaps(p));
      L.push('BEGIN:VEVENT','UID:'+p.id+'-d'+n+'@trip-planner','DTSTAMP:'+now,'DTSTART:'+icsTime(iso,r.arrive),'DTEND:'+icsTime(iso,Math.max(r.leave,r.arrive+15)),icsFold('SUMMARY:'+icsEsc((p.booked?'✓ ':'')+p.name)),icsFold('DESCRIPTION:'+icsEsc(desc.join('\n'))));
      if(hasLoc(p))L.push('GEO:'+p.lat.toFixed(5)+';'+p.lng.toFixed(5),icsFold('LOCATION:'+icsEsc(p.name)));
      L.push('END:VEVENT');count++});
  }
  L.push('END:VCALENDAR');return {ics:L.join('\r\n')+'\r\n',count:count};
}
function exportICS(){
  if(!state.trip.start){toast('Set your trip dates under Trip first');return}
  editing=true;
  $('#sheet').innerHTML='<h2>Add to Calendar</h2><p class="small">Creates a calendar file on your phone with each planned stop at its scheduled time. Nothing is uploaded by this app. Calendars often sync to iCloud or Google, so private details are left out unless you tick the box.</p>'+
    '<label class="chk" style="display:flex;margin:8px 0"><input type="checkbox" id="icPriv"> Include booking refs &amp; costs</label>'+
    '<ol class="small steps"><li>Tap <b>Create calendar file</b> and choose <b>Save to Files</b> or open it.</li><li>Open the file. iPhone asks to <b>Add All</b> events, so pick a calendar (a new one called “Scotland” keeps it tidy).</li><li>Re-plan later? Delete that calendar and export again.</li></ol>'+
    '<div class="acts"><button class="btn primary" id="icGo">Create calendar file</button><span class="grow"></span><button class="btn" id="icDone">Close</button></div><div class="small" id="icMsg" style="min-height:18px;margin-top:6px"></div>';
  $('#ov').classList.remove('hidden');
  $('#icDone').onclick=closeSheet;
  $('#icGo').onclick=function(){var x=buildICS($('#icPriv').checked);if(!x.count){$('#icMsg').textContent='No stops are planned on any day yet.';return}
    shareOrDownload('scotland-trip.ics',x.ics,'text/calendar').then(function(r){$('#icMsg').textContent=r==='cancelled'?'Cancelled.':x.count+' stops ready. Open the file to add them.'},function(){$('#icMsg').textContent='Couldn’t create the file here.'})};
}

/* ---------- safety card (fully offline; your location never leaves the phone) ---------- */
var HOSP=[['Raigmore Hospital, Inverness',57.4740,-4.1925],['Belford Hospital, Fort William',56.8205,-5.1063],['Broadford Hospital, Skye',57.2405,-5.9170],['Lorn & Islands Hospital, Oban',56.4013,-5.4734],['Western Isles Hospital, Stornoway',58.2161,-6.3870],['Caithness General, Wick',58.4404,-3.0930],["Dr Gray's Hospital, Elgin",57.6470,-3.3255],['Balfour Hospital, Kirkwall',58.9727,-2.9540],['Gilbert Bain Hospital, Lerwick',60.1533,-1.1520],['Aberdeen Royal Infirmary',57.1540,-2.1370],['Ninewells Hospital, Dundee',56.4640,-3.0390],['Perth Royal Infirmary',56.3960,-3.4590],['Forth Valley Royal, Larbert',56.0330,-3.8170],['Royal Infirmary of Edinburgh',55.9214,-3.1355],['Queen Elizabeth University Hospital, Glasgow',55.8620,-4.3410],['Glasgow Royal Infirmary',55.8655,-4.2340],['University Hospital Crosshouse, Kilmarnock',55.6175,-4.5550],['Dumfries & Galloway Royal Infirmary',55.0800,-3.5800],['Borders General Hospital, Melrose',55.5960,-2.7430],["St John's Hospital, Livingston",55.8860,-3.5230],['Victoria Hospital, Kirkcaldy',56.1240,-3.1700]];
function osGrid(lat,lon){
  var r=Math.PI/180,a=6378137,b=6356752.3142,e2=1-b*b/(a*a),ph=lat*r,la=lon*r,sp=Math.sin(ph),cp=Math.cos(ph);
  var nu=a/Math.sqrt(1-e2*sp*sp),x=nu*cp*Math.cos(la),y=nu*cp*Math.sin(la),z=(1-e2)*nu*sp;
  var tx=-446.448,ty=125.157,tz=-542.060,s=20.4894e-6,rx=-0.1502/3600*r,ry=-0.2470/3600*r,rz=-0.8421/3600*r;
  var x2=tx+(1+s)*x-rz*y+ry*z,y2=ty+rz*x+(1+s)*y-rx*z,z2=tz-ry*x+rx*y+(1+s)*z;
  a=6377563.396;b=6356256.909;e2=1-b*b/(a*a);var p=Math.sqrt(x2*x2+y2*y2),phi=Math.atan2(z2,p*(1-e2)),phiP=2*Math.PI;
  while(Math.abs(phi-phiP)>1e-12){nu=a/Math.sqrt(1-e2*Math.sin(phi)*Math.sin(phi));phiP=phi;phi=Math.atan2(z2+e2*nu*Math.sin(phi),p)}
  var lam=Math.atan2(y2,x2),F0=0.9996012717,ph0=49*r,la0=-2*r,N0=-100000,E0=400000,n=(a-b)/(a+b),n2=n*n,n3=n*n*n;
  var cos=Math.cos(phi),sin=Math.sin(phi);nu=a*F0/Math.sqrt(1-e2*sin*sin);var rho=a*F0*(1-e2)/Math.pow(1-e2*sin*sin,1.5),eta2=nu/rho-1;
  var Ma=(1+n+(5/4)*n2+(5/4)*n3)*(phi-ph0),Mb=(3*n+3*n*n+(21/8)*n3)*Math.sin(phi-ph0)*Math.cos(phi+ph0),Mc=((15/8)*n2+(15/8)*n3)*Math.sin(2*(phi-ph0))*Math.cos(2*(phi+ph0)),Md=(35/24)*n3*Math.sin(3*(phi-ph0))*Math.cos(3*(phi+ph0)),M=b*F0*(Ma-Mb+Mc-Md);
  var cos3=cos*cos*cos,cos5=cos3*cos*cos,tan2=Math.tan(phi)*Math.tan(phi),tan4=tan2*tan2;
  var I=M+N0,II=(nu/2)*sin*cos,III=(nu/24)*sin*cos3*(5-tan2+9*eta2),IIIA=(nu/720)*sin*cos5*(61-58*tan2+tan4),IV=nu*cos,V=(nu/6)*cos3*(nu/rho-tan2),VI=(nu/120)*cos5*(5-18*tan2+tan4+14*eta2-58*tan2*eta2);
  var dl=lam-la0,N=I+II*dl*dl+III*Math.pow(dl,4)+IIIA*Math.pow(dl,6),E=E0+IV*dl+V*Math.pow(dl,3)+VI*Math.pow(dl,5);
  if(E<0||E>=700000||N<0||N>=1300000)return null;
  var e100=Math.floor(E/100000),n100=Math.floor(N/100000),l1=(19-n100)-(19-n100)%5+Math.floor((e100+10)/5),l2=(19-n100)*5%25+e100%5;
  if(l1>7)l1++;if(l2>7)l2++;var letters=String.fromCharCode(l1+65,l2+65),e=Math.floor(E%100000),nn=Math.floor(N%100000);
  function pad(v,d){v=String(Math.floor(v/Math.pow(10,5-d)));while(v.length<d)v='0'+v;return v}
  return {six:letters+' '+pad(e,3)+' '+pad(nn,3),ten:letters+' '+pad(e,5)+' '+pad(nn,5)};
}
function nearestHosp(pt,k){return HOSP.map(function(h){var d=km(pt,{lat:h[1],lng:h[2]});return {n:h[0],lat:h[1],lng:h[2],d:d}}).sort(function(x,y){return x.d-y.d}).slice(0,k||3)}
function openSafety(){
  editing=true;var st=tripStatus(),ref=wxPlace(st.day)||{lat:57.0,lng:-4.6,name:'the Highlands'};
  function hospHtml(pt,label){return '<div class="small o" style="margin-bottom:4px">Nearest hospitals with an emergency department'+(label?' to '+esc(label):'')+':</div>'+nearestHosp(pt,3).map(function(h){return '<div class="srow"><span class="grow">'+esc(h.n)+' <span class="o">· '+Math.round(h.d*0.621)+' mi</span></span><a class="btn sm" href="https://www.google.com/maps/dir/?api=1&destination='+h.lat+','+h.lng+'" target="_blank" rel="noopener">Directions</a></div>'}).join('')}
  $('#sheet').innerHTML='<h2>🆘 Safety card</h2>'+
  '<div class="sos"><a class="btn big danger2" href="tel:999">Call 999</a><a class="btn big" href="tel:112">or 112</a></div>'+
  '<div class="card"><div class="ct">On the hill</div><div class="small"><b>Dial 999, ask for Police, then Mountain Rescue.</b> Have ready: where you are (grid ref below), who’s hurt and how, the weather, and your phone number. Then stay put, keep warm, and save battery.</div>'+
  '<div class="small" style="margin-top:6px"><b>No signal for calls?</b> A text to 999 can still get through, but <b>only if you registered first</b>. Do it now: <a href="sms:999&body=register">text “register” to 999</a> and follow the reply.</div></div>'+
  '<div class="card"><div class="ct">Where am I?</div><div id="sfLoc" class="small o">Uses your phone’s GPS. Your location stays on this phone and isn’t sent anywhere.</div><div class="acts"><button class="btn primary" id="sfGps">Get my grid reference</button></div></div>'+
  '<div class="card" id="sfHosp">'+hospHtml(ref,ref.name)+'</div>'+
  '<div class="card"><div class="ct">Not an emergency</div><div class="srow"><span class="grow">NHS 111: urgent medical advice, 24/7</span><a class="btn sm" href="tel:111">Call</a></div><div class="srow"><span class="grow">Police non-emergency</span><a class="btn sm" href="tel:101">101</a></div></div>'+
  '<div class="card"><div class="ct">US citizens</div><div class="srow"><span class="grow">US Embassy London, 24/7 emergencies<br><span class="o">+44 20 7499 9000</span></span><a class="btn sm" href="tel:+442074999000">Call</a></div><div class="srow"><span class="grow">US Consulate General Edinburgh<br><span class="o">+44 131 556 8315 · weekdays, office hours</span></span><a class="btn sm" href="tel:+441315568315">Call</a></div><div class="small o" style="margin-top:4px">Lost passport, arrest, hospital stay: the consulate helps. Enroll in <a href="https://step.state.gov" target="_blank" rel="noopener">STEP</a> before you fly.</div></div>'+
  '<div class="card"><div class="ct">Before a hill day</div><ul class="al" style="color:inherit"><li>Check the mountain forecast: <a href="https://www.mwis.org.uk/forecasts/scottish" target="_blank" rel="noopener">MWIS</a></li><li>Tell someone your route and when you’ll be back.</li><li>Off the hill by ~3:30pm; carry a headlamp anyway.</li><li>Charged phone + power bank; download offline maps (Trip → Save maps).</li><li>Roads & ferries: <a href="https://trafficscotland.org" target="_blank" rel="noopener">Traffic Scotland</a> · <a href="https://www.calmac.co.uk/service-status" target="_blank" rel="noopener">CalMac status</a></li></ul></div>'+
  '<div class="acts"><span class="grow"></span><button class="btn" id="sfDone">Close</button></div>';
  $('#ov').classList.remove('hidden');$('#sfDone').onclick=closeSheet;
  $('#sfGps').onclick=function(){var el=$('#sfLoc');if(!navigator.geolocation){el.textContent='GPS isn’t available in this browser.';return}el.textContent='Finding you… (step outside or near a window if it’s slow)';
    navigator.geolocation.getCurrentPosition(function(pos){var c=pos.coords,g=osGrid(c.latitude,c.longitude),txt=(g?'Grid ref '+g.six+' ('+g.ten+')':'')+' · '+c.latitude.toFixed(5)+', '+c.longitude.toFixed(5)+' · ±'+Math.round(c.accuracy)+' m';
      el.className='small';el.innerHTML='<div class="gridref">'+esc(g?g.six:c.latitude.toFixed(5)+', '+c.longitude.toFixed(5))+'</div>'+esc(txt)+'<div class="acts"><a class="btn sm" href="sms:&body='+encodeURIComponent('My location: '+txt)+'">Text it</a><button class="btn sm" id="sfCopy">Copy</button></div>';
      $('#sfCopy').onclick=function(){try{navigator.clipboard.writeText(txt).then(function(){toast('Copied')})}catch(e){}};
      $('#sfHosp').innerHTML=hospHtml({lat:c.latitude,lng:c.longitude},'you')},
      function(err){el.textContent=err&&err.code===1?'Location permission is off. Settings → Privacy → Location Services → Safari Websites (or this app) → While Using.':'Couldn’t get a fix. Try again in the open.'},{enableHighAccuracy:true,timeout:20000,maximumAge:30000})};
}

/* ---------- Today ---------- */
var todayTimer=null;
function renderToday(){
  var st=tripStatus(),n=st.day,h='';
  if(st.phase==='before')h+='<div class="card hero"><div class="ct">Countdown</div><div class="big2">'+st.until+' day'+(st.until===1?'':'s')+'</div><div class="small">until Day 1 ('+esc(dayDate(1))+'). Here’s Day 1 so far:</div></div>';
  else if(st.phase==='none')h+='<div class="card hero"><div class="small">Set your trip dates under <b>Trip</b> and this screen becomes your daily dashboard. Showing Day '+n+' for now.</div></div>';
  else if(st.phase==='after')h+='<div class="card hero"><div class="small">Trip’s over: welcome home. Showing Day '+n+'.</div></div>';
  var dp=dayPlan(n),nowMin=ldnMin(new Date()),live=st.phase==='during';
  h+='<div class="sect"><span>'+esc(dayLabel(n))+(live?' · today':'')+'</span><button class="lnk" data-act="goplan">Edit plan →</button></div>'+wxLine(n);
  var toSet=dp.sun.set-nowMin;
  h+='<div class="sunrow small" style="padding:0 6px 6px"><span>☀ Sunset '+hm(dp.sun.set)+(live&&toSet>0&&toSet<720?' · <b>'+dur(toSet)+' of light left</b>':'')+'</span><span>'+(dp.rows.length?'Back ~'+hm(dp.finish):'')+'</span></div>';
  var next=null;if(dp.rows.length){next=live?dp.rows.filter(function(r){return r.leave>nowMin&&r.p.stage==='queue'})[0]:dp.rows[0]}
  if(next){var p=next.p,leaveBy=next.arrive-(next.leg||0),late=live&&nowMin>leaveBy+5&&nowMin<next.arrive,hrs=p.hours?ohCheck(p,dp.date,next.arrive,next.leave):null;
    h+='<div class="card nextc"><div class="ct">'+(live&&nowMin>=next.arrive?'Now':'Next up')+'</div><div class="nname">'+esc(p.name)+'</div>'+
      '<div class="small">'+(next.leg?'Leave by <b>'+hm(leaveBy)+'</b> · ~'+dur(next.leg)+' drive · ':'')+'arrive '+hm(next.arrive)+', '+dur(mins(p))+' there'+(late?' · <b class="warn">running late</b>':'')+'</div>'+
      (hrs?'<div class="small '+(hrs.bad?'warn':'bk')+'">'+esc(hrs.txt)+'</div>':'')+(p.booked||p.conf?'<div class="small">'+(p.booked?'<b class="bk">Booked</b> ':'')+(p.slot?esc(p.slot)+' ':'')+(p.conf?'· ref '+esc(p.conf):'')+'</div>':'')+
      '<div class="acts">'+(hasLoc(p)?'<a class="btn primary" href="https://www.google.com/maps/dir/?api=1&destination='+p.lat.toFixed(5)+','+p.lng.toFixed(5)+'&travelmode=driving" target="_blank" rel="noopener">Navigate ↗</a>':'')+'<button class="btn" data-act="open" data-id="'+p.id+'">Details</button>'+(live?'<button class="btn" data-act="done" data-id="'+p.id+'">✓ Done</button>':'')+'</div></div>';}
  else h+='<div class="empty">Nothing planned for this day. Add stops in Plan.</div>';
  if(dp.rows.length>1){h+='<div class="sect"><span>Rest of the day</span></div>';dp.rows.forEach(function(r,i){if(next&&r===next)return;if(live&&r.leave<=nowMin)return;var c=r.p.hours?ohCheck(r.p,dp.date,r.arrive,r.leave):null;h+=row(r.p,{num:i+1,meta:['<b>'+hm(r.arrive)+'</b>',dur(mins(r.p))].concat(c&&c.bad?['<b class="warn">'+esc(c.txt)+'</b>']:[]),actions:''})})}
  h+=wearSummary(n);
  var spentToday=state.spend.items.filter(function(e){return e.day===n}).reduce(function(s,e){return s+usd(e)},0);
  h+='<div class="card"><div class="srow"><span class="grow">Spent on Day '+n+': <b>'+usdf(spentToday)+'</b></span><button class="btn sm" data-act="gospend">Log a purchase</button></div></div>';
  h+=tipsTodayCard(n);
  h+='<button class="btn sosb" data-act="safety">🆘 Safety card: 999, grid ref, hospitals</button>';
  return h;
}

/* Curated tips (researched Oct 2026). c: food|pub|sight|walk|books|shop|rainy|event. w: winter caution. */
var AREAS=[
 {id:'edi',n:'Edinburgh',lat:55.9533,lng:-3.1883,r:9},
 {id:'gla',n:'Glasgow',lat:55.8642,lng:-4.2518,r:9},
 {id:'sky',n:'Isle of Skye',lat:57.33,lng:-6.25,r:45},
 {id:'fwg',n:'Fort William & Glencoe',lat:56.75,lng:-5.06,r:22},
 {id:'inv',n:'Inverness & Loch Ness',lat:57.45,lng:-4.25,r:22},
 {id:'avi',n:'Aviemore & Cairngorms',lat:57.18,lng:-3.80,r:20},
 {id:'obn',n:'Oban',lat:56.415,lng:-5.471,r:14},
 {id:'pit',n:'Pitlochry',lat:56.704,lng:-3.729,r:12}];
var W_HL='Many Highland and island places close or cut hours in November. Check before you go and book dinner.';
var TIPS=[
 /* ---- Edinburgh ---- */
 ['edi','event',"Edinburgh's Christmas Market",55.9519,-3.1925,'About 70 wooden chalets in East Princes Street Gardens under the Scott Monument: mulled wine, street food, gifts. Free entry; rides like the Big Wheel are paid.','14 Nov 2026 – 3 Jan 2027, usually 10am–10pm; closed 25 Dec, and a few dates have shorter hours.'],
 ['edi','event','George Street ice rink & lights',55.9533,-3.1990,'Part of Edinburgh’s Christmas: outdoor skating and festive bars along George Street.','Ticketed. Book a slot for weekend evenings.'],
 ['edi','event','Christmas at the Botanics',55.9650,-3.2090,'An evening light trail through the Royal Botanic Garden. One of the nicest things in the city in late November.','Ticketed, timed entry, and it sells out, so book early.'],
 ['edi','food','Ondine',55.9488,-3.1925,'One of the city’s best-known seafood restaurants, with an oyster bar, on George IV Bridge in the Old Town.','Book ahead.'],
 ['edi','food','Timberyard',55.9465,-3.1985,'Michelin-starred (with a Green Star): seasonal Scottish produce in a converted warehouse.','Tasting menu; book well ahead.'],
 ['edi','food','The Kitchin (Leith)',55.9771,-3.1722,'Michelin-starred “nature to plate” Scottish cooking on the Leith waterfront. Set lunch is the best value.','Book ahead; tram or bus to Leith.'],
 ['edi','food','Makars Gourmet Mash Bar',55.9512,-3.1955,'Hearty Scottish comfort food (haggis, pies, mash) by the Mound. A warm-up after the market.',''],
 ['edi','food',"Mary's Milk Bar",55.9477,-3.1960,'Tiny Grassmarket spot for gelato and thick hot chocolate with a castle view.','Small, so expect a short queue.'],
 ['edi','food','Oink (Victoria Street)',55.9488,-3.1937,'Hog roast rolls carved to order. Cheap, filling, classic Old Town lunch.',''],
 ['edi','pub','The Bow Bar',55.9483,-3.1946,'Narrow wood-panelled Victoria Street pub: cask ales and 300+ malts, no music, no TVs. Widely called the best pub in the Old Town.',''],
 ['edi','pub',"Sandy Bell's",55.9455,-3.1903,'Legendary little folk pub with near-nightly trad music sessions and a big whisky range.','Gets packed; go early evening.'],
 ['edi','pub','Café Royal Circle Bar',55.9545,-3.1902,'Ornate Victorian bar with tiled murals and gas-lamp atmosphere, just off Princes Street.',''],
 ['edi','pub',"Kay's Bar",55.9562,-3.2045,'Tiny New Town pub in a former wine merchant’s, with a fire and a good dram list. Perfect on a cold night.',''],
 ['edi','pub','The Royal Oak',55.9480,-3.1838,'Folk music most nights in a cosy two-level bar near the Royal Mile.',''],
 ['edi','books','Armchair Books',55.9468,-3.1983,'Floor-to-ceiling second-hand and antiquarian books just off the Grassmarket. Often called the city’s most magical bookshop.',''],
 ['edi','books','Edinburgh Books',55.9465,-3.1997,'Ramshackle maze of second-hand and collectable books on West Port, a few doors from Armchair.',''],
 ['edi','books',"Till's Bookshop",55.9405,-3.1824,'Beloved second-hand shop by the Meadows, around since 1985.',''],
 ['edi','books',"McNaughtan's & Typewronger",55.9586,-3.1840,'Scotland’s oldest second-hand bookshop (1957), sharing a basement with a typewriter-and-books shop.',''],
 ['edi','books','Topping & Company',55.9564,-3.1820,'Big independent bookshop with ladders, free tea and lots of signed copies.',''],
 ['edi','books','Golden Hare Books',55.9585,-3.2070,'Small, beautiful Stockbridge bookshop. Pair with a Stockbridge wander.',''],
 ['edi','rainy','National Museum of Scotland',55.9469,-3.1901,'Free, huge and excellent, from Dolly the sheep to the Lewis Chessmen. Don’t miss the rooftop terrace view.','Free entry.'],
 ['edi','rainy',"The Real Mary King's Close",55.9502,-3.1903,'Guided tour of 17th-century streets buried under the Royal Mile.','Timed tickets; book ahead.'],
 ['edi','rainy','Camera Obscura & World of Illusions',55.9490,-3.1957,'Victorian camera obscura plus five floors of optical illusions by the castle.',''],
 ['edi','sight','Victoria Street & Grassmarket',55.9484,-3.1938,'The curved, colourful street said to have inspired Diagon Alley, down into the old market square.',''],
 ['edi','sight','Greyfriars Kirkyard',55.9466,-3.1922,'Atmospheric old graveyard and the Greyfriars Bobby statue.',''],
 ['edi','sight','Scott Monument',55.9524,-3.1933,'Gothic spire above the Christmas market; 287 steps up for the view.','Paid; narrow stairs.'],
 ['edi','sight','Palace of Holyroodhouse',55.9527,-3.1722,'The King’s official residence in Scotland, with Mary Queen of Scots’ rooms. At the bottom of the Royal Mile.','Check opening; closes for royal visits.'],
 ['edi','walk','Dean Village & Water of Leith',55.9524,-3.2196,'Storybook mill village 10 min from Princes Street; follow the river path to Stockbridge.','Easy, about 1 hr.'],
 ['edi','shop','Stockbridge Market',55.9583,-3.2082,'Sunday street-food and makers’ market in a village-y corner of the city.','Sundays.'],
 /* ---- Glasgow ---- */
 ['gla','rainy','Kelvingrove Art Gallery & Museum',55.8686,-4.2906,'Free and spectacular: Dalí’s Christ of St John of the Cross, a Spitfire, and an organ recital most days.','Free.'],
 ['gla','rainy','Riverside Museum',55.8650,-4.3060,'Free transport museum in a Zaha Hadid building, with a tall ship moored outside.','Free.'],
 ['gla','food','Ashton Lane',55.8746,-4.2930,'Cobbled West End lane of fairy-lit bars and restaurants, including the long-running Ubiquitous Chip.',''],
 ['gla','books','Caledonia Books',55.8780,-4.2840,'Classic West End second-hand bookshop with rare and out-of-print titles.',''],
 ['gla','pub','The Pot Still',55.8642,-4.2580,'Snug city-centre whisky bar with hundreds of malts and a staff happy to guide you.',''],
 /* ---- Skye ---- */
 ['sky','food','Scorrybreac (Portree)',57.4155,-6.1924,'Michelin-recommended: Skye mussels, scallops and venison in a tiny dining room.',W_HL],
 ['sky','food','Dulse & Brose (Portree)',57.4136,-6.1945,'Cosy hotel restaurant: Skye langoustines in garlic butter, cranachan for pudding.',W_HL],
 ['sky','food','Sea Breezes (Portree harbour)',57.4118,-6.1923,'Mid-priced seafood on the quay: langoustines, mussels, oysters.',W_HL],
 ['sky','food','The Three Chimneys (Colbost)',57.4418,-6.6532,'Skye’s most famous restaurant, in a stone croft on Loch Dunvegan.','Destination dining; book well ahead. '+W_HL],
 ['sky','food','Loch Bay (Stein)',57.5155,-6.5765,'Michelin-starred seafood in a tiny fishing-village restaurant.','Book ahead. '+W_HL],
 ['sky','food','The Oyster Shed (Carbost)',57.3010,-6.3577,'Seafood shack near Talisker: oysters, scallops and crab to eat standing at barrels.','Casual, with outdoor tables. '+W_HL],
 ['sky','pub','The Old Inn (Carbost)',57.3005,-6.3540,'Lochside pub with a fire and a specials board, a great stop after a wet hike.',''],
 ['sky','pub',"Seumas' Bar, Sligachan",57.2902,-6.1729,'Climbers’ bar at the foot of the Cuillin, with a big malt list. Next to the old bridge.',''],
 ['sky','rainy','Talisker Distillery',57.3025,-6.3570,'Skye’s classic peaty whisky, with lochside tours and tastings.','Book tours ahead; winter hours are shorter.'],
 ['sky','shop','Isle of Skye Candle Co (Portree)',57.4084,-6.1974,'Local candles and gifts, with wood-fired pizza (Gasta) inside.',''],
 ['sky','walk','Fairy Glen (Uig)',57.5878,-6.3480,'Strange little conical hills and a rock “castle”. Short, easy and eerie in mist.','About 45 min.'],
 ['sky','walk','Coral Beach (Claigan)',57.4890,-6.6260,'White “coral” (actually seaweed) beach walk near Dunvegan.','About 1.5 hr round trip; muddy.'],
 ['sky','sight','Portree harbour',57.4118,-6.1918,'The row of pastel houses everyone photographs. Best from the Lump viewpoint above town.',''],
 /* ---- Fort William & Glencoe ---- */
 ['fwg','pub','Clachaig Inn (Glencoe)',56.6640,-5.0640,'Legendary climbers’ pub deep in Glencoe: real ales, hearty food, live music some weekends.','Busy after hill days; there’s a big Boots Bar.'],
 ['fwg','food','Crannog (Fort William pier)',56.8170,-5.1140,'Seafood on the pier with the best location in town.','Book dinner.'],
 ['fwg','food','The Silly Goose at the Lime Tree',56.8155,-5.1170,'Often rated the best restaurant in Fort William: seasonal local produce and an art gallery.','Book dinner.'],
 ['fwg','pub','Ben Nevis Bar',56.8195,-5.1080,'Snug high-street bar with good pints, malts and pub food, and a loch-view terrace.',''],
 ['fwg','pub','Black Isle Bar',56.8188,-5.1110,'Organic craft beer and wood-fired pizza.',''],
 ['fwg','pub','Ben Nevis Inn (Achintee)',56.8072,-5.0790,'Converted barn at the start of the Ben Nevis path, built for post-hike pints.','Check winter opening days.'],
 ['fwg','rainy','Glencoe Visitor Centre',56.6838,-5.1060,'National Trust exhibits on the 1692 massacre and the glen’s geology, with a café.','Winter hours are shorter.'],
 ['fwg','rainy','West Highland Museum',56.8183,-5.1124,'Free and quirky Jacobite museum, including the secret portrait of Bonnie Prince Charlie.','Free; check winter days.'],
 ['fwg','walk','Glencoe Lochan',56.6862,-5.0920,'Easy woodland loop round a lochan with mountain reflections.','About 1 hr; good bad-weather option.'],
 ['fwg','sight','Nevis Range gondola',56.8577,-4.9880,'Gondola to 650 m on Aonach Mòr for big views without the climb.','Can close for wind or winter maintenance; check same day.'],
 /* ---- Inverness ---- */
 ['inv','books',"Leakey's Bookshop",57.4796,-4.2275,'Scotland’s largest second-hand bookshop, in an old Gaelic church with a wood-burning stove and spiral stairs.','Unmissable for book lovers.'],
 ['inv','shop','Victorian Market',57.4790,-4.2260,'1870s covered arcades of independent shops, plus a food hall.','Under cover; good on a wet day.'],
 ['inv','pub','Hootananny',57.4800,-4.2270,'Live traditional music most nights. Touristy but tons of fun.',''],
 ['inv','food','The River House',57.4775,-4.2290,'Small riverside seafood restaurant that locals call underrated.','Pricey; book.'],
 ['inv','food',"Girvans",57.4785,-4.2235,'An Inverness institution for breakfast.',''],
 ['inv','walk','Ness Islands',57.4675,-4.2325,'Gentle riverside loop over Victorian footbridges, 15 min from the centre.','Flat, about 1 hr.'],
 ['inv','sight','Clava Cairns',57.4740,-4.0730,'4,000-year-old burial cairns and standing stones near Culloden.','Free; atmospheric at dusk.'],
 ['inv','rainy','Inverness Museum & Art Gallery',57.4765,-4.2265,'Free museum of Highland history, Pictish stones and Jacobite items.','Free.'],
 /* ---- Aviemore & Cairngorms ---- */
 ['avi','pub','Old Bridge Inn',57.1900,-3.8225,'Cosy riverside pub with a roaring fire, the classic post-hill warm-up.',''],
 ['avi','food','The Winking Owl',57.1955,-3.8270,'Scottish classics and Cairngorm Brewery ales on the main street.','Book dinner at weekends.'],
 ['avi','food','The Barn at Rothiemurchus',57.1815,-3.8170,'Café with stews, soup and cake by the Rothiemurchus estate.',''],
 ['avi','sight','Cairngorm Reindeer Centre',57.1680,-3.6900,'Britain’s only free-ranging reindeer herd; join a guided hill visit.','Fixed daily times; check and book.'],
 ['avi','walk','Loch Morlich beach',57.1665,-3.7090,'Sandy beach under the Cairngorms. Lovely short walk at sunrise.',''],
 ['avi','sight','Cairngorm Mountain',57.1340,-3.6700,'Snowsports and big views; the funicular runs when conditions allow.','Check status and weather on the day.'],
 /* ---- Oban ---- */
 ['obn','sight',"McCaig's Tower",56.4149,-5.4682,'Free Colosseum-style folly above town with the best sunset view over the bay.','Free; short steep climb.'],
 ['obn','rainy','Oban Distillery',56.4146,-5.4721,'Tours and tastings right in the town centre.','Book tours.'],
 ['obn','food','Oban Seafood Hut',56.4113,-5.4752,'The famous green shack on the pier: cheap, fresh seafood.','Hours vary in winter.'],
 ['obn','food','Ee-Usk',56.4163,-5.4728,'Seafood restaurant with big windows on the North Pier.','Book dinner.'],
 ['obn','shop','Oban Chocolate Co',56.4185,-5.4730,'Handmade chocolates and hot chocolate on the seafront.',''],
 /* ---- Pitlochry ---- */
 ['pit','sight','Pitlochry Dam & Fish Ladder',56.7020,-3.7350,'Visitor centre and walkway over the dam with river views.',''],
 ['pit','rainy','Blair Athol Distillery',56.7005,-3.7290,'Bell’s whisky distillery in town, with tours.','Book tours.'],
 ['pit','pub','Moulin Inn',56.7155,-3.7370,'Characterful old inn above Pitlochry that brews its own ale.','']
];

var TC={food:['🍽','Food'],pub:['🍺','Pubs & whisky'],sight:['🏰','Sights'],walk:['🥾','Walks'],books:['📚','Bookshops'],shop:['🛍','Shopping'],rainy:['☔','Rainy day'],event:['🎄','Seasonal']};
var TCAT={food:'food',pub:'food',sight:'castle',walk:'hike',books:'shop',shop:'shop',rainy:'castle',event:'city'};
var TIPO=TIPS.map(function(t,i){return {id:'tip'+i,a:t[0],c:t[1],n:t[2],lat:t[3],lng:t[4],why:t[5],w:t[6]||''}});
var here=null;/* {lat,lng,at} from GPS; stays on this phone */
function areaOf(pt){if(!pt)return null;var best=null,bd=1e9;AREAS.forEach(function(ar){var d=km(pt,ar);if(d<=ar.r&&d<bd){bd=d;best=ar}});return best}
function tipRef(){var st=tripStatus();if(here&&Date.now()-here.at<30*6e4)return {pt:here,label:'you'};var b=wxPlace(st.phase==='during'?st.day:ui.day);if(b)return {pt:b,label:b.name};return null}
function curArea(){if(ui.area&&ui.area!=='auto'){for(var i=0;i<AREAS.length;i++)if(AREAS[i].id===ui.area)return AREAS[i]}var r=tipRef(),ar=r&&areaOf(r.pt);return ar||AREAS[0]}
function tipQueued(t){return state.pins.some(function(p){return p.stage!=='library'&&hasLoc(p)&&km(p,t)<0.25&&(p.name.toLowerCase()===t.n.toLowerCase()||similar(p.name,t.n))})}
function tipCard(t,ref){var d=ref?km(ref.pt,t):null,q=tipQueued(t);
  return '<div class="tipc"><div class="tiph"><span class="tico">'+TC[t.c][0]+'</span><div class="grow"><div class="tipn">'+esc(t.n)+'</div><div class="meta">'+TC[t.c][1]+(d!=null?' · '+(d<1?Math.round(d*1000/1609*1760/10)*10+' yd':(d*0.621).toFixed(d<10?1:0)+' mi')+' from '+esc(ref.label==='you'?'you':ref.label):'')+'</div></div></div>'+
   '<div class="small">'+esc(t.why)+'</div>'+(t.w?'<div class="small warnbox">⚠ '+esc(t.w)+'</div>':'')+
   '<div class="acts"><button class="btn sm'+(q?'':' primary')+'" data-act="tipq" data-id="'+t.id+'"'+(q?' disabled':'')+'>'+(q?'✓ In your trip':'+ Queue')+'</button><button class="btn sm" data-act="tipph" data-id="'+t.id+'">Photos</button><button class="btn sm" data-act="tipmap" data-id="'+t.id+'">Map</button><a class="btn sm" href="'+gmaps(t)+'" target="_blank" rel="noopener">Google ↗</a></div><div class="photos" id="tp-'+t.id+'"></div></div>'}
function renderNearby(){
  var ar=curArea(),ref=tipRef(),cat=ui.tcat||'all',h='';
  h+='<div class="chips"><button class="chip'+(!ui.area||ui.area==='auto'?' on':'')+'" data-act="tarea" data-a="auto">📍 Auto</button>'+AREAS.map(function(x){return '<button class="chip'+(ui.area===x.id?' on':'')+'" data-act="tarea" data-a="'+x.id+'">'+esc(x.n)+'</button>'}).join('')+'</div>';
  var list=TIPO.filter(function(t){return t.a===ar.id});
  var cats={};list.forEach(function(t){cats[t.c]=(cats[t.c]||0)+1});
  h+='<div class="chips"><button class="chip'+(cat==='all'?' on':'')+'" data-act="tcat" data-c="all">All '+list.length+'</button>'+Object.keys(TC).filter(function(k){return cats[k]}).map(function(k){return '<button class="chip'+(cat===k?' on':'')+'" data-act="tcat" data-c="'+k+'">'+TC[k][0]+' '+TC[k][1]+' '+cats[k]+'</button>'}).join('')+'</div>';
  h+='<div class="sect"><span>'+esc(ar.n)+'</span><button class="lnk" data-act="tgps">'+(here?'📍 Update my location':'📍 Use my location')+'</button></div>';
  if(!ui.area||ui.area==='auto')h+='<div class="small o" style="padding:0 6px 6px">'+(ref?'Showing tips near '+esc(ref.label==='you'?'your location':ref.label)+'.':'Set a base for the day (Plan) or tap “Use my location” to auto-pick the area.')+'</div>';
  var shown=list.filter(function(t){return cat==='all'||t.c===cat});
  if(ref)shown.sort(function(x,y){return (x.c==='event'?-1:0)-(y.c==='event'?-1:0)||km(ref.pt,x)-km(ref.pt,y)});
  shown.forEach(function(t){h+=tipCard(t,ref)});
  if(!shown.length)h+='<div class="empty">No curated tips here for that category yet. Try Explore below.</div>';
  var ec=ui.ecat||'food';
  h+='<div class="card"><div class="ct">Explore more nearby</div><div class="small o">Live OpenStreetMap search around '+esc(ref?(ref.label==='you'?'you':ref.label):ar.n)+'. Well-known places (with a Wikipedia entry) come first. Only a rough location, about 1 km off, is sent, and only when you tap.</div>'+
   '<div class="srow" style="margin-top:6px"><select id="exCat" class="grow">'+[['food','🍽 Restaurants & cafés'],['pub','🍺 Pubs & bars'],['books','📚 Bookshops'],['shop','🛍 Gift, craft & outdoor shops'],['sight','🏰 Sights & museums'],['walk','🥾 Viewpoints & nature']].map(function(o){return '<option value="'+o[0]+'"'+(ec===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select><button class="btn sm primary" data-act="explore">Search</button></div><div id="exRes"></div></div>';
  h+='<div class="small o" style="padding:6px">Tips are researched picks, not live ratings: hours change, so check before you go. Your location is only used on this phone.</div>';
  return h;
}
var EXQ={food:'nwr["amenity"~"^(restaurant|cafe)$"]',pub:'nwr["amenity"~"^(pub|bar)$"]',books:'nwr["shop"="books"]',shop:'nwr["shop"~"^(gift|crafts|antiques|art|outdoor|chocolate|deli)$"]',sight:'nwr["tourism"~"^(attraction|museum|gallery)$"];nwr["historic"~"^(castle|monument|ruins|memorial)$"]',walk:'nwr["tourism"="viewpoint"];nwr["natural"="peak"]["name"];nwr["leisure"="nature_reserve"]["name"]'};
function explore(cat){
  var el=$('#exRes'),ref=tipRef(),ar=curArea(),pt=ref?ref.pt:ar;if(!el)return;
  var lat=Math.round(pt.lat*100)/100,lng=Math.round(pt.lng*100)/100,rad=cat==='walk'?6000:1800;  /* ~1 km rounding for privacy */
  el.innerHTML='<div class="small o">Searching…</div>';
  var q='[out:json][timeout:20];('+EXQ[cat].split(';').map(function(s){return s+'["name"](around:'+rad+','+lat+','+lng+');'}).join('')+');out tags center 60;';
  fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
    var seen={},items=(j.elements||[]).map(function(e){var c=e.center||e,t=e.tags||{};return {n:String(t['name:en']||t.name||'').slice(0,80),lat:c.lat,lng:c.lon,kind:String(t.cuisine||t.amenity||t.shop||t.tourism||t.historic||t.natural||t.leisure||'').replace(/[_;]/g,' ').slice(0,40),fame:(t.wikidata||t.wikipedia)?1:0,oh:t.opening_hours?String(t.opening_hours).slice(0,200):'',web:/^https:\/\//.test(t.website||'')?String(t.website).slice(0,200):''}})
      .filter(function(x){if(!x.n||x.lat==null||seen[x.n])return false;seen[x.n]=1;return true});
    items.forEach(function(x){x.d=km(pt,x)});items.sort(function(x,y){return y.fame-x.fame||x.d-y.d});items=items.slice(0,20);
    if(!items.length){el.innerHTML='<div class="small o">Nothing found nearby.</div>';return}
    var iso=isoDate(tripStatus().day)||localIso(0);
    el.innerHTML=items.map(function(x,i){var oh=x.oh?ohText(ohOn(x.oh,iso)):'';return '<div class="srow exr"><div class="grow"><b>'+esc(x.n)+'</b>'+(x.fame?' <span class="fame">★ notable</span>':'')+'<div class="meta">'+esc(x.kind)+' · '+(x.d*0.621).toFixed(1)+' mi'+(oh?' · '+esc(oh):'')+'</div></div><button class="btn sm" data-ex="'+i+'">+ Queue</button></div>'}).join('');
    $$('[data-ex]',el).forEach(function(b){b.onclick=function(){var x=items[+b.getAttribute('data-ex')],before=snap();state.pins.push({id:uid(),name:x.n,lat:+x.lat.toFixed(5),lng:+x.lng.toFixed(5),cat:TCAT[cat]||'scenic',stage:'queue',booked:false,day:0,order:nextOrder(),notes:x.kind,hours:x.oh||null,hoursSrc:x.oh?'OpenStreetMap':null});commit();renderTabs();b.textContent='✓ Added';b.disabled=true;toast(x.n+' added to queue',before)}});
  }).catch(function(){el.innerHTML='<div class="small o">Couldn’t reach OpenStreetMap. Try again with signal.</div>'});
}
function locateMe(btn){if(!navigator.geolocation){toast('Location isn’t available here');return}if(btn){btn.textContent='Locating…';btn.disabled=true}
  navigator.geolocation.getCurrentPosition(function(p){here={lat:p.coords.latitude,lng:p.coords.longitude,at:Date.now()};ui.area='auto';saveUI();render()},function(){if(btn){btn.disabled=false;btn.textContent='📍 Use my location'}toast('Couldn’t get your location (check Location permission)')},{enableHighAccuracy:false,timeout:15000,maximumAge:120000})}
function tipsTodayCard(n){var ref=tipRef(),ar=ref&&areaOf(ref.pt);if(!ar)return '';var list=TIPO.filter(function(t){return t.a===ar.id});if(!list.length)return '';
  var ev=list.filter(function(t){return t.c==='event'});var cats={};list.forEach(function(t){cats[t.c]=(cats[t.c]||0)+1});
  return '<div class="card"><div class="ct">💡 Tips around '+esc(ar.n)+'</div>'+(ev.length?'<div class="small">'+ev.map(function(t){return TC.event[0]+' <b>'+esc(t.n)+'</b>'}).join('<br>')+'</div>':'')+'<div class="small o" style="margin-top:4px">'+Object.keys(cats).map(function(k){return TC[k][0]+' '+cats[k]}).join(' · ')+'</div><button class="lnk" data-act="gonear">See tips →</button></div>'}

/* ---------- panel ---------- */
function renderTabs(){
  var q=inStage('queue').length,lib=inStage('library').length,dn=inStage('done').length,pl=state.pins.filter(function(p){return p.stage==='queue'&&p.day}).length;
  var pkm=gearOf(curPerson().id),pk=pkm.filter(function(i){return i.packed}).length+'/'+pkm.length;
  var spent=state.spend.items.reduce(function(s,e){return s+usd(e)},0);
  var tabs=[['today','Today',''],['queue','Queue',q],['plan','Plan',pl],['pack','Pack',pk],['near','Tips',''],['spend','Spend',usdf(spent)],['library','Library',lib],['done','Done',dn]];
  $('#tabs').innerHTML=tabs.map(function(t){return '<button class="tab'+(ui.tab===t[0]?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+(t[2]!==''?' <span class="n">'+t[2]+'</span>':'')+'</button>'}).join('')+'<button class="tab tog" id="tog">'+(ui.min?'▲':'▼')+'</button>';
  $$('[data-tab]').forEach(function(b){b.onclick=function(){var nt=b.getAttribute('data-tab');if(ui.min){ui.min=false;$('#panel').classList.remove('min');setTimeout(resize,60)}ui.tab=nt;saveUI();render();$('#pbody').scrollTop=0;
    if(nt==='near'){var ar0=curArea();if(map)map.flyTo({center:[ar0.lng,ar0.lat],zoom:ar0.r>30?8:ar0.r>15?10:12.5,duration:700})}
    if(nt==='plan'||nt==='pack'||nt==='today'){if(nt==='today')ui.day=tripStatus().day;fitDay(ui.day)}else if(nt==='queue')fitTo(inStage('queue'));else if(nt==='done')fitTo(inStage('done'))}});
  try{var at=$('#tabs .tab.on');if(at)at.scrollIntoView({block:'nearest',inline:'nearest'})}catch(e){}
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
  return '<div class="wx o">'+(isoDate(n)?'No forecast yet. Forecasts appear once a day is within 16 days and has a base or a stop.':'Set your dates under Trip to get forecasts.')+' Outfit below uses typical mid-Nov weather.</div>';
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
  if(ui.tab==='today'){h+=renderToday()}
  else if(ui.tab==='near'){h+=renderNearby()}
  else if(ui.tab==='queue'){
    var up=unplanned().filter(catOk),planned=state.pins.filter(function(p){return p.stage==='queue'&&p.day&&catOk(p)});
    h+='<div class="addbar"><input id="sQ" class="mini grow" type="search" autocomplete="off" placeholder="🔎 Search places (e.g. Sligachan, Old Man of Storr)"></div><div id="sRes"></div>';
    h+='<div class="addbar"><button class="btn sm" id="qPaste" title="Paste from clipboard">📋</button><textarea id="qAdd" rows="1" placeholder="Paste from Google/Apple Maps (Share → Copy), a link, or coordinates"></textarea><button class="btn primary" id="qGo">Add</button></div>';
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
    h+='<div class="sect"><span>Stops</span><span>'+(dp.rows.length?'<button class="lnk" data-act="hoursday">Check opening hours</button> <button class="lnk" data-act="clearday">Clear day</button>':'')+'</span></div>';
    if(!dp.rows.length)h+='<div class="empty">Nothing planned yet. Add from your queue below.</div>';
    if(hasLoc(dp.start)&&dp.rows.length)h+='<div class="leg">⌂ '+esc(dp.start.name)+' · leave '+hm(dp.leaveAt)+'</div>';
    var wet=isWet(wxFor(n));
    dp.rows.forEach(function(r,i){
      var p=r.p;if(r.leg)h+='<div class="leg">↓ ~'+dur(r.leg)+' drive · '+Math.round(km(r.from,p)*ROAD)+' km'+(r.from&&hasLoc(p)?' · <a href="'+gdir(r.from,p)+'" target="_blank" rel="noopener">directions</a>':'')+'</div>';
      var sw=byId(p.swapId),meta=['<b>'+hm(r.arrive)+'–'+hm(r.leave)+'</b>',dur(mins(p))];
      if(r.late)meta.push('<b class="warn">ends after dark</b>');if(p.hours){var hc=ohCheck(p,dp.date,r.arrive,r.leave);if(hc)meta.push(hc.bad?'<b class="warn">'+esc(hc.txt)+'</b>':'<span class="bk">'+esc(hc.txt)+'</span>')}if(r.miss)meta.push('<b class="warn">late for '+esc(p.slot)+'</b>');if(p.booked)meta.push('<b class="bk">Booked'+(p.slot?' '+esc(p.slot):'')+'</b>');if(+p.cost)meta.push(money(+p.cost));
      var acts=(sw?'<button class="btn sm'+(wet?' hot':'')+'" data-act="swap" data-id="'+p.id+'" title="Swap with '+esc(sw.name)+'">☔ '+esc(sw.name.slice(0,14))+'</button>':'')+'<button class="ib" data-act="up" data-id="'+p.id+'">▲</button><button class="ib" data-act="dn" data-id="'+p.id+'">▼</button><button class="ib" title="Mark done" data-act="done" data-id="'+p.id+'">✓</button><button class="ib" title="Back to queue" data-act="unplan" data-id="'+p.id+'">↩</button>';
      h+=row(p,{num:i+1,meta:meta,actions:acts});
    });
    if(dp.back&&hasLoc(dp.end))h+='<div class="leg">↓ ~'+dur(dp.back)+' drive · <a href="'+gdir(dp.lastStop,dp.end)+'" target="_blank" rel="noopener">directions</a><br>⌂ '+esc(dp.end.name)+' · ~'+hm(dp.finish)+'</div>';
    if(dp.rows.length&&!hasLoc(dp.start))h+='<div class="small" style="padding:4px 6px">Tip: set where you’re starting from so the first drive counts.</div>';
    h+=wearSummary(n);
    var up2=unplanned();
    h+='<div class="sect"><span>From your queue ('+up2.length+')</span></div>';
    if(!up2.length)h+='<div class="empty">Queue is empty — add places in the Queue tab.</div>';
    up2.forEach(function(p){h+=row(p,{faded:true,actions:'<button class="btn sm" data-act="addday" data-id="'+p.id+'">+ Day '+n+'</button>'})});
    h+='<div class="sect"><span>Take it offline</span></div><div class="small" style="padding:0 6px 6px">Export your queued and planned places as a CSV for Google My Maps, then open that map in the Google Maps app and download the area for offline use. <button class="btn sm" data-act="export">Export for Google Maps</button> <button class="btn sm" data-act="ics">Add to Calendar</button></div>';
  }
  else if(ui.tab==='pack'){
    var P=curPerson();
    h+=dayChips();
    h+='<div class="sect"><span>'+esc(dayLabel(ui.day))+'</span>'+(wx&&wx.fetchedAt?'<span class="o">forecast '+esc(new Date(wx.fetchedAt).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))+'</span>':'')+'</div>';
    h+=wxLine(ui.day)+personChips('who')+fitEditor(ui.day);
    var fr=outfitFor(ui.day,P.id),today={};fr.wear.concat(fr.pack).forEach(function(it){today[it.id]=1});
    var mine=gearOf(P.id),groups={};mine.forEach(function(it){(groups[it.group||'Other']=groups[it.group||'Other']||[]).push(it)});
    var done=mine.filter(function(i){return i.packed}).length;
    h+='<div class="sect"><span>'+esc(P.name)+'’s packing list · '+done+'/'+mine.length+'</span><button class="lnk" data-act="unpackall">Untick all</button></div>';
    h+='<div class="addbar"><input id="packAdd" class="mini grow" placeholder="Add an item for '+esc(P.name)+'" maxlength="80"><button class="btn sm" id="packGo">Add</button></div>';
    Object.keys(groups).forEach(function(g){
      h+='<div class="pg">'+esc(g)+'</div>';
      groups[g].forEach(function(it){h+='<label class="pi'+(it.packed?' on':'')+'"><input type="checkbox" data-act="packtick" data-id="'+esc(it.id)+'"'+(it.packed?' checked':'')+'><span class="grow">'+esc(it.name)+(it.qty>1?' <span class="o">×'+it.qty+'</span>':'')+(today[it.id]?' <span class="today">day '+ui.day+'</span>':'')+'</span><button class="ib" data-act="packdel" data-id="'+esc(it.id)+'" title="Remove">✕</button></label>'});
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
    h+='<div class="bar"><input id="libQ" class="mini grow" placeholder="Search library…" value="'+esc(ui.q||'')+'"></div>';
    var lc={};inStage('library').forEach(function(p){lc[p.cat]=(lc[p.cat]||0)+1});
    h+='<div class="chips"><button class="chip'+(ui.cat==='all'?' on':'')+'" data-act="libcat" data-c="all">All '+inStage('library').length+'</button>'+Object.keys(CATS).filter(function(k){return lc[k]}).map(function(k){return '<button class="chip'+(ui.cat===k?' on':'')+'" data-act="libcat" data-c="'+k+'"><i class="dot" style="background:'+CATS[k][1]+'"></i>'+CATS[k][0]+' '+lc[k]+'</button>'}).join('')+'</div>';
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
  try{$$('.chips',b).forEach(function(c){var on=c.querySelector('.chip.on');if(on)c.scrollLeft=Math.max(0,on.offsetLeft-c.clientWidth/2+on.clientWidth/2)})}catch(e){}
  var sq=$('#sQ');if(sq){sq.oninput=function(){var v=this.value.trim();clearTimeout(sTimer);if(v.length<3){sResults=[];$('#sRes').innerHTML='';return}sTimer=setTimeout(function(){searchPlaces(v)},350)}}
  var qa=$('#qAdd');if(qa){qa.oninput=function(){this.style.height='auto';this.style.height=Math.min(140,this.scrollHeight)+'px'};
    qa.onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey&&this.value.indexOf('\n')<0){e.preventDefault();$('#qGo').click()}};
    $('#qGo').onclick=function(){var v=qa.value;if(!v.trim())return;qa.value='';quickAdd(v,0)};
    $('#qPaste').onclick=function(){if(!navigator.clipboard||!navigator.clipboard.readText){qa.focus();toast('Long-press the box and tap Paste');return}navigator.clipboard.readText().then(function(t){if(t&&t.trim()){quickAdd(t.slice(0,4000),0)}else toast('Clipboard is empty')},function(){qa.focus();toast('Long-press the box and tap Paste')})}}
  var lq=$('#libQ');if(lq){lq.oninput=function(){ui.q=this.value;var pos=this.selectionStart;renderPanel();var n=$('#libQ');n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
  var sg=$('#spGo');if(sg){
    var add=function(){var v=parseFloat($('#spAmt').value);if(!(v>0)){$('#spAmt').focus();return}var before=snap();ui.spCat=$('#spCat').value;saveUI();
      state.spend.items.push({id:'e'+uid(),amt:Math.round(v*100)/100,cur:state.spend.cur||'GBP',cat:$('#spCat').value,day:+$('#spDay').value,note:$('#spNote').value.trim().slice(0,80),ts:Date.now()});
      commit();render();toast('Logged '+(state.spend.cur==='USD'?'$'+v.toFixed(2):gbpf(v)),before)};
    sg.onclick=add;$('#spAmt').onkeydown=$('#spNote').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();add()}};
    $('#spBud').onchange=function(){var v=parseFloat(this.value);state.spend.budgetUsd=v>0?v:null;commit();render()};
    $('#spRate').onchange=function(){var v=parseFloat(this.value);if(v>0){state.spend.rate=v;state.spend.rateManual=true}else{state.spend.rateManual=false}commit();render()};
  }
  var fn=$('#fitNote');if(fn)fn.onchange=function(){var f=fitEnsure(ui.day,curPerson().id);f.note=this.value.trim().slice(0,200);f.by=me().name;commit()};
  var fx=$('#fitX');if(fx)fx.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();act('fitxadd',fx)}};
  var pa=$('#packAdd');if(pa){pa.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();$('#packGo').click()}};$('#packGo').onclick=function(){var v=pa.value.trim();if(!v)return;state.pack.items.push({id:'g'+uid(),group:'My extras',name:v.slice(0,80),qty:1,packed:false,who:curPerson().id});pa.value='';commit();render()}}
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
    case 'libcat':ui.cat=el.getAttribute('data-c');saveUI();render();return;
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
    case 'unpackall':gearOf(curPerson().id).forEach(function(x){x.packed=false});commit();render();toast('All unticked',before);return;
    case 'export':exportCSV();return;
    case 'ics':exportICS();return;
    case 'gonear':ui.tab='near';saveUI();render();$('#pbody').scrollTop=0;return;
    case 'tarea':ui.area=el.getAttribute('data-a');ui.tcat='all';saveUI();render();var a1=curArea();if(map)map.flyTo({center:[a1.lng,a1.lat],zoom:a1.r>30?8:a1.r>15?10:12.5,duration:700});return;
    case 'tcat':ui.tcat=el.getAttribute('data-c');saveUI();renderPanel();drawPins();return;
    case 'tgps':locateMe(el);return;
    case 'explore':ui.ecat=$('#exCat').value;saveUI();explore(ui.ecat);return;
    case 'tipmap':var tm=TIPO.filter(function(x){return x.id===id})[0];if(tm&&map)map.flyTo({center:[tm.lng,tm.lat],zoom:15,duration:700});return;
    case 'tipph':var tp=TIPO.filter(function(x){return x.id===id})[0];if(tp)fillPhotos($('#tp-'+id),tp.n,tp.lat,tp.lng,tp.c==='walk'?1200:400);return;
    case 'tipq':var tq=TIPO.filter(function(x){return x.id===id})[0];if(!tq)return;state.pins.push({id:uid(),name:tq.n,lat:tq.lat,lng:tq.lng,cat:TCAT[tq.c]||'scenic',stage:'queue',booked:false,day:0,order:nextOrder(),notes:tq.why+(tq.w?' ⚠ '+tq.w:'')});commit();render();toast(tq.n+' added to queue',before);return;
    case 'who':ui.who=el.getAttribute('data-p');saveUI();renderPanel();return;
    case 'people':openPeople();return;
    case 'fitcycle':var P=curPerson(),f=fitEnsure(n,P.id),cur=el.getAttribute('data-st'),nx=cur==='wear'?'pack':cur==='pack'?'off':'wear';f.set[id]=nx;f.by=me().name;commit();renderPanel();return;
    case 'fitreset':var f2=fitFor(n,curPerson().id);if(f2){f2.set={};f2.extra=[];f2.note='';f2.by=me().name}commit();renderPanel();toast('Back to the forecast suggestion',before);return;
    case 'fitxadd':var xv=($('#fitX').value||'').trim().slice(0,60);if(!xv)return;var f3=fitEnsure(n,curPerson().id);if(f3.extra.length<12)f3.extra.push(xv);f3.by=me().name;commit();renderPanel();return;
    case 'fitxdel':var f4=fitFor(n,curPerson().id);if(f4){f4.extra.splice(+el.getAttribute('data-i'),1);f4.by=me().name}commit();renderPanel();return;
    case 'safety':openSafety();return;
    case 'open':if(hasLoc(p))flyTo(p,5);openEditor(p.id);return;
    case 'gospend':ui.tab='spend';saveUI();render();$('#pbody').scrollTop=0;return;
    case 'hoursday':var hp=dayPins(n).filter(function(x){return hasLoc(x)&&!x.hours});if(!hp.length){toast('Nothing left to check');return}el.textContent='Checking…';el.disabled=true;
      (function go(i,found){if(i>=hp.length){commit();render();toast('Found hours for '+found+' of '+hp.length+' stops');return}fetchHours(hp[i]).then(function(ok){setTimeout(function(){go(i+1,found+(ok?1:0))},1100)})})(0,0);return;
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
  '<div class="f"><label>Opening hours'+(p.hoursSrc?' <span class="o">(from '+esc(p.hoursSrc)+', check before you go)</span>':'')+'</label><div class="srow"><input id="eHours" class="grow" placeholder="e.g. Mo-Su 09:30-16:00 or Nov-Mar: Sa,Su 10:00-16:00" value="'+esc(p.hours||'')+'">'+(hasLoc(p)?'<button class="btn sm" id="eHrsGo" title="Looks up OpenStreetMap. Sends this pin’s location to the Overpass map service.">Look up</button>':'')+'</div><div class="small o" id="eHrsMsg">'+(p.hours&&!ohParse(p.hours)?'Can’t read this format automatically; shown as written.':'')+'</div></div>'+
  '<div class="f"><label>Bad-weather swap</label><select id="eSwap">'+swaps+'</select></div>'+
  '<details class="bkbox"'+(p.booked||p.conf||p.cost||p.slot?' open':'')+'><summary>Booking &amp; cost</summary><label class="chk" style="margin:8px 0;display:flex"><input type="checkbox" id="eBk"'+(p.booked?' checked':'')+'> Booked / tickets sorted</label>'+
  '<div class="three"><div class="f"><label>Time slot</label><input id="eSlot" placeholder="10:30" value="'+esc(p.slot||'')+'"></div><div class="f"><label>Booking ref</label><input id="eConf" value="'+esc(p.conf||'')+'"></div><div class="f"><label>Cost (£)</label><input id="eCost" type="number" min="0" step="0.5" value="'+(p.cost!=null?esc(p.cost):'')+'"></div></div></details>'+
  (hasLoc(p)?'<div class="f"><label>Photos &amp; info</label><div id="ePhotos" class="photos"></div></div>':'')+
  '<div class="f"><label>Notes</label><textarea id="eNotes" placeholder="Parking, tickets, weather backup…">'+esc(p.notes)+'</textarea></div>'+
  (hasLoc(p)?'<div class="small" style="margin-bottom:8px">'+p.lat.toFixed(4)+', '+p.lng.toFixed(4)+' · <a href="'+gmaps(p)+'" target="_blank" rel="noopener">Open in Google Maps</a></div>':
   '<div class="f"><label>No location yet</label><input id="eLoc" placeholder="Paste a shared link + name, coordinates, or type the place"><div class="small" id="eLocMsg" style="min-height:16px"></div><div class="small"><a href="'+gmaps(p)+'" target="_blank" rel="noopener">Look it up in Google Maps</a>, then copy the long link from the address bar.</div></div>')+
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
  ['eName','eNotes','eMins','eSlot','eConf','eCost'].forEach(function(x){$('#'+x).oninput=upd});
  $('#eHours').onchange=function(){var v=this.value.trim().slice(0,200);p.hours=v||null;p.hoursSrc=v?'you':null;$('#eHrsMsg').textContent=v&&!ohParse(v)?'Can’t read this format automatically; shown as written.':'';commit();renderPanel()};
  var hg=$('#eHrsGo');if(hg)hg.onclick=function(){hg.disabled=true;hg.textContent='…';fetchHours(p).then(function(ok){hg.disabled=false;hg.textContent='Look up';if(ok){$('#eHours').value=p.hours;$('#eHrsMsg').textContent='Found on OpenStreetMap. Winter hours can differ, so confirm on the official site.';commit();renderPanel()}else $('#eHrsMsg').textContent=ok===null?'Couldn’t reach the lookup service.':'No hours listed on OpenStreetMap. Type them in if you know them.'})};['eCat','eDay','eBk','eHigh','eSwap'].forEach(function(x){$('#'+x).onchange=upd});
  $$('#eStage .seg').forEach(function(s){s.onclick=function(){p.stage=s.getAttribute('data-stage');if(p.stage!=='queue'){p.day=0;$('#eDay').value='0'}else p.order=nextOrder();$$('#eStage .seg').forEach(function(x){x.classList.toggle('on',x===s)});upd()}});
  var el=$('#eLoc');if(el){var locT=null;el.oninput=function(){var v=this.value;clearTimeout(locT);var it=splitShared(v)[0]||{text:v,url:''},c=parseCoords(it.url||'')||parseCoords(it.text);
    if(c){p.lat=c.lat;p.lng=c.lng;var nm=nameFromLink(it.url||'')||cleanShareText(it.text).split(',')[0];if(nm&&/^(Unnamed place|New pin|Pin at)/.test(p.name))p.name=nm.slice(0,80);commit();openEditor(p.id);flyTo(p,5);return}
    var q=cleanShareText(it.text)||(!it.url?v.trim():'');if(!q){if(it.url&&isShortLink(it.url))$('#eLocMsg').textContent='Short share links have no location. Paste the whole shared message (with the name), or type the place name.';return}
    $('#eLocMsg').textContent='Looking up “'+q.slice(0,40)+'”…';locT=setTimeout(function(){geocodeText(q).then(function(g){if(!g){$('#eLocMsg').textContent='Couldn’t find that. Try adding the town name.';return}p.lat=+g.lat.toFixed(5);p.lng=+g.lng.toFixed(5);commit();openEditor(p.id);flyTo(p,5);toast('Placed: check it’s the right spot')})},700)}}
  $('#eDone').onclick=closeSheet;
  $('#eMove').onclick=function(){$('#ov').classList.add('hidden');editing=false;setAdd({move:id})};
  $('#eDel').onclick=function(){var before=snap();state.pins=state.pins.filter(function(q){return q.id!==id});commit();closeSheet();toast('Deleted '+p.name,before)};
}
$('#bTrip').onclick=function(){
  editing=true;
  var total=state.pins.filter(function(p){return p.stage!=='library'}).reduce(function(a,p){return a+(+p.cost||0)},0);
  $('#sheet').innerHTML='<h2>Trip settings</h2><div class="two"><div class="f"><label>First day</label><input type="date" id="tStart" value="'+esc(state.trip.start)+'"></div><div class="f"><label>Number of days</label><input type="number" min="1" max="30" id="tDays" value="'+state.trip.days+'"></div></div>'+
  '<p class="small">Weather is live from Open-Meteo for any trip day up to 16 days out, using each day’s base (or first stop). It refreshes when you open the app.'+(wx&&wx.fetchedAt?' Last update: '+esc(new Date(wx.fetchedAt).toLocaleString())+'.':'')+' <button class="lnk" id="tWx">Refresh now</button></p>'+
  syncCard()+
  '<div class="card"><div class="ct">Offline maps</div><div class="small">Saves the Scotland overview plus close-up map around every queued place, for when signal drops. Use Wi-Fi; roughly 20–60 MB.</div><div class="acts"><button class="btn" id="tOff">Save maps for offline</button></div><div class="small" id="tOffMsg"></div></div>'+
  '<div class="card"><div class="ct">On iPhone</div><div class="small">In Safari tap Share → <b>Add to Home Screen</b>. It opens full-screen like an app, can use your location, and keeps your data on the phone. Copy a backup now and then.</div></div>'+
  (total?'<p class="small">Booked costs so far: <b>'+money(total)+'</b></p>':'')+
  '<div class="f"><label>Backup — copy somewhere safe, or paste one in to restore (v1 backups work too)</label><textarea id="tJson" style="min-height:80px;font-size:11px;font-family:ui-monospace,monospace"></textarea></div><div class="small" id="tMsg" style="min-height:18px"></div>'+
  '<div class="small o" style="margin:-4px 0 8px">App version '+APP_VERSION+'</div><div class="acts"><button class="btn" id="tCopy">Copy backup</button><button class="btn" id="tRestore">Restore pasted</button><button class="btn" id="tExp">Export for Google Maps</button><span class="grow"></span><button class="btn primary" id="tDone">Done</button></div>';
  $('#tJson').value=JSON.stringify(state);$('#ov').classList.remove('hidden');
  $('#tStart').onchange=$('#tDays').onchange=function(){state.trip.start=$('#tStart').value;state.trip.days=Math.max(1,Math.min(30,+$('#tDays').value||7));state.pins.forEach(function(p){if(p.day>state.trip.days)p.day=0});if(ui.day>state.trip.days)ui.day=1;commit();render()};
  $('#tCopy').onclick=function(){var t=$('#tJson');try{navigator.clipboard.writeText(t.value).then(function(){$('#tMsg').textContent='Copied.'},function(){t.select();$('#tMsg').textContent='Selected — copy it manually.'})}catch(e){t.select();$('#tMsg').textContent='Selected — copy it manually.'}};
  bindSyncCard();
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
try{if(JSON.stringify(JSON.parse(localStorage.getItem(LS)||'null'))!==JSON.stringify(state))localStorage.setItem(LS,JSON.stringify(state))}catch(e){}
if(tripStatus().phase==='during')ui.tab='today';
render();initMap();
setInterval(function(){if(ui.tab==='today'&&!editing&&document.visibilityState==='visible'&&!$('#pbody').contains(document.activeElement))renderPanel()},60000);
try{new ResizeObserver(function(){clearTimeout(rz);rz=setTimeout(resize,80)}).observe($('#mapwrap'))}catch(e){}
setSave(sync?'Syncing…':'Saved on this phone');
if(sync){syncNow();setInterval(function(){if(sync&&document.visibilityState==='visible'&&!editing)syncNow()},45000)}
maybeRefresh();
if('serviceWorker' in navigator&&location.protocol==='https:'){
  var hadSW=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(function(reg){try{reg.update()}catch(e){};document.addEventListener('visibilitychange',function(){if(!document.hidden)try{reg.update()}catch(e){}})}).catch(function(){});
  /* a new version took over: reload once so it shows immediately (not while you're typing) */
  navigator.serviceWorker.addEventListener('controllerchange',function(){if(!hadSW)return;var go=function(){if(editing||busyInput()){setTimeout(go,2000);return}try{if(sessionStorage.getItem('tpReloaded'))return;sessionStorage.setItem('tpReloaded','1')}catch(e){}location.reload()};go()});
}
})();
