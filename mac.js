(function(){
if(window.__mac)return;window.__mac=1;
var D=document,B=D.body,$=function(s,r){return(r||D).querySelector(s)};
var NL=function(){return localStorage.getItem('lang')!=='en'};
function isHome(){var h=location.hash;return h===''||h==='#'}
var mac=D.createElement('div');mac.id='mac';
var ic=function(g,c){return '<svg viewBox="0 0 64 64">'+'<defs><linearGradient id="g'+c+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.split('-')[0]+'"/><stop offset="1" stop-color="'+c.split('-')[1]+'"/></linearGradient></defs><rect width="64" height="64" fill="url(#g'+c+')"/>'+g+'</svg>'};
var ICONS={
fd:ic('<path d="M10 22h20l4 5h20v22H10z" fill="#fff" opacity=".95"/><path d="M10 27h44v22H10z" fill="#cfe6ff"/>','#4db3ff-#1765d6'),
ph:ic('<g transform="translate(32 32)"><circle r="6" fill="#fff"/><ellipse rx="6" ry="14" cy="-14" fill="#ff5f6d"/><ellipse rx="6" ry="14" cy="-14" fill="#ffc371" transform="rotate(60)"/><ellipse rx="6" ry="14" cy="-14" fill="#4ade80" transform="rotate(120)"/><ellipse rx="6" ry="14" cy="-14" fill="#38bdf8" transform="rotate(180)"/><ellipse rx="6" ry="14" cy="-14" fill="#a78bfa" transform="rotate(240)"/><ellipse rx="6" ry="14" cy="-14" fill="#f472b6" transform="rotate(300)"/></g>','#ffffff-#e9e9ee'),
sf:ic('<circle cx="32" cy="32" r="21" fill="none" stroke="#fff" stroke-width="3"/><path d="M42 22l-6 14-14 6 6-14z" fill="#ff4d4d"/><path d="M42 22l-6 14-6-6z" fill="#fff"/>','#5ac8fa-#0a6cf0'),
ct:ic('<circle cx="32" cy="26" r="9" fill="#fff"/><path d="M14 52c2-12 10-16 18-16s16 4 18 16z" fill="#fff"/>','#b08968-#7f5539'),
ml:ic('<rect x="11" y="18" width="42" height="28" rx="4" fill="#fff"/><path d="M12 20l20 15 20-15" fill="none" stroke="#2a8bff" stroke-width="3"/>','#5ac8fa-#1a73e8'),
qt:ic('<circle cx="32" cy="32" r="18" fill="#1c1c1e"/><path d="M26 22l16 10-16 10z" fill="#fff"/>','#6e6e78-#2a2a30')
};
var APPS=[['fd','Werk','Werk'],['ph','Fictief werk','Fictief werk'],['sf','PR-OTASI','PR-OTASI'],['ct','Over mij','Over mij'],['ml','Contact','Contact'],['qt','Trailers','Trailers']];
mac.innerHTML='<div class="mc-mb"><div class="mc-lid"><div class="mc-cam"></div><div class="mc-scr" id="mcs"><div class="mc-wp"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 40C20 28 38 34 55 26S88 22 100 30V60H0z" fill="rgba(20,20,70,.28)"/><path d="M0 48C25 38 45 46 65 38S90 36 100 42V60H0z" fill="rgba(10,10,40,.34)"/></svg></div><div class="mc-notch"></div>'+
'<div class="mc-bar"><span class="lg"></span><b>Portfolio</b><span class="menus"><span>Bestand</span>&nbsp;&nbsp;&nbsp;<span>Bewerken</span>&nbsp;&nbsp;&nbsp;<span>Beeld</span>&nbsp;&nbsp;&nbsp;<span>Venster</span>&nbsp;&nbsp;&nbsp;<span>Help</span></span><span class="r"><svg viewBox="0 0 20 14"><path d="M1 5a13 13 0 0118 0M4 8a8 8 0 0112 0M7 11a3.5 3.5 0 016 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg><svg viewBox="0 0 26 12"><rect x="1" y="1" width="21" height="10" rx="3" fill="none" stroke="#fff" stroke-width="1.2"/><rect x="2.6" y="2.6" width="15" height="6.8" rx="1.6" fill="#fff"/></svg><span id="mcclk"></span></span></div>'+
'<div class="mc-nf" id="mcnf"><span class="lg"></span><div><b>Welkom, ik ben Dylan</b>Open een app in het dock om mijn werk te bekijken.</div></div>'+
'<div class="mc-dock" id="mcdock"></div><div class="mc-boot" id="mcboot"><span class="lg"></span><div class="pb"><i></i></div></div></div></div><div class="mc-base"><div class="mc-nt"></div></div></div>';
B.appendChild(mac);
var fs=D.createElement('div');fs.id='mcfs';fs.innerHTML='<div class="nt"></div><span class="lg"></span><button id="mcback">◀ <span>Terug naar bureaublad</span></button><span class="clk" id="mcclk2"></span>';B.appendChild(fs);
var bz=D.createElement('div');bz.id='mcbz';B.appendChild(bz);
var scr=$('#mcs'),mb=$('.mc-mb',mac),dock=$('#mcdock');
function clk(){var d=new Date(),t=d.toLocaleDateString(NL()?'nl-BE':'en-GB',{weekday:'short',day:'numeric',month:'short'})+'  '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);var a=$('#mcclk'),b=$('#mcclk2');if(a)a.textContent=t;if(b)b.textContent=t}
clk();setInterval(clk,15000);
/* vensters */
var W={},z=20;
function winW(){return scr.clientWidth||1000}
function mkWin(id,title,x,y,w,h,body,dark){
var e=D.createElement('div');e.className='mc-w'+(dark?' dk':'');e.id='mcw-'+id;e.dataset.x=x;e.dataset.y=y;e.dataset.w=w;e.dataset.h=h;
e.innerHTML='<div class="mc-tb"><i class="mc-l r"></i><i class="mc-l y"></i><i class="mc-l g"></i><span class="mc-tt">'+title+'</span></div><div class="mc-bd">'+body+'</div>';
scr.insertBefore(e,$('.mc-nf',scr));W[id]=e;
$('.r',e).onclick=function(ev){ev.stopPropagation();closeW(id)};
$('.y',e).onclick=function(ev){ev.stopPropagation();closeW(id)};
$('.g',e).onclick=function(ev){ev.stopPropagation();e.classList.toggle('max')};
e.addEventListener('mousedown',function(){e.style.zIndex=++z});
var tb=$('.mc-tb',e);
tb.addEventListener('pointerdown',function(ev){if(ev.target.classList.contains('mc-l')||e.classList.contains('max'))return;
var sx=ev.clientX,sy=ev.clientY,ox=e.offsetLeft,oy=e.offsetTop,k=scr.getBoundingClientRect().width/scr.offsetWidth||1;
function mv(m){e.style.left=(ox+(m.clientX-sx)/k)+'px';e.style.top=Math.max(scr.offsetWidth*.021,oy+(m.clientY-sy)/k)+'px'}
function up(){removeEventListener('pointermove',mv);removeEventListener('pointerup',up)}
addEventListener('pointermove',mv);addEventListener('pointerup',up)});
return e}
function place(e){var w=winW(),p=+e.dataset.w/100,q=+e.dataset.h/100;e.style.setProperty('--w',w+'px');
if(!e.dataset.placed){e.style.left=(w*(+e.dataset.x)/100)+'px';e.style.top=(scr.clientHeight*(+e.dataset.y)/100)+'px';e.style.width=(w*p)+'px';e.style.height=(scr.clientHeight*q)+'px';e.dataset.placed=1}}
function openW(id){var e=W[id];if(!e)return;place(e);e.classList.add('open');e.style.zIndex=++z;var i=$('.mc-ic[data-a="'+id+'"]',dock);if(i)i.classList.add('run');
if(id==='qt'){var v=$('video',e);if(v&&!v.src){v.src=V[cur]||V.ts;}}}
function closeW(id){var e=W[id];e.classList.remove('open','max');var v=$('video',e);if(v)v.pause();var i=$('.mc-ic[data-a="'+id+'"]',dock);if(i)i.classList.remove('run')}
function relayout(){Object.keys(W).forEach(function(k){var e=W[k];e.style.setProperty('--w',winW()+'px');if(e.dataset.placed){delete e.dataset.placed;place(e)}})}
/* inhoud */
function tiles(fic){return P.filter(function(p){return /FICTIEF/.test(p.tag)===fic}).map(function(p){return '<a class="mc-tile" href="#/'+p.id+'" data-go="'+p.id+'"><img src="img/bn-'+p.id+'.jpg" alt=""><span>'+p.t+'</span><em>'+p.tag.replace(/\.FICTIEF/,'').replace(/_/g,' ').toLowerCase()+' · '+p.yr+'</em></a>'}).join('')}
function finder(){return '<div class="mc-fd"><aside><small>Favorieten</small><a class="on">Werk</a><a data-o="ph">Fictief werk</a><a data-o="sf">PR-OTASI</a><a data-o="ct">Over mij</a><a data-o="ml">Contact</a></aside><div class="mc-grid">'+tiles(false)+'</div></div>'}
function photos(){return '<div class="mc-fd"><aside><small>Albums</small><a data-o="fd">Werk</a><a class="on">Fictief werk</a></aside><div class="mc-grid">'+tiles(true)+'</div></div>'}
function safari(){var n=N.slice().sort(function(a,b){return a.d<b.d?1:-1}).slice(0,4);return '<div class="mc-sf"><div class="tool"><span>◀ ▶</span><span class="ad">pr-otasi.be</span></div><div class="pg"><h2>PR-OTASI</h2><div class="rule"></div>'+n.map(function(x){return '<a class="art" href="#/nieuws/'+x.id+'"><small>'+x.cat+' · '+x.d+'</small><b>'+x.t+'</b></a>'}).join('')+'<a class="mc-btn" href="#/nieuws">Alle artikelen</a></div></div>'}
function contacts(){var p=$('#over .win p');return '<div class="mc-ct"><img src="img/ab1.jpg" alt="Dylan"><div><h3>Dylan Protasi</h3><p>'+(p?p.textContent:'')+'</p><div class="row"><span>e-mail</span>dylan.protasi@gmail.com</div><div class="row"><span>woont</span>Liedekerke, België</div></div></div>'}
function mail(){return '<div class="mc-ml"><div class="f"><span>Aan:</span><input value="dylan.protasi@gmail.com" readonly></div><div class="f"><span>Onderwerp:</span><input id="mcsub" placeholder="Samenwerking"></div><textarea id="mcmsg" placeholder="Schrijf hier je bericht…"></textarea><div class="ft"><button class="mc-btn" id="mcsend">Verstuur</button></div></div>'}
var TR=[['ts','The Strangers: Chapter 3'],['lh','LifeHack'],['backrooms','Backrooms'],['furious','The Furious'],['kang','Kangaroo']],cur='ts';
function player(){return '<div class="mc-qt"><video controls playsinline preload="metadata"></video><div class="ctl"><span id="mcttl">'+TR[0][1]+'</span><button id="mcnext">Volgende ▶</button></div></div>'}
mkWin('fd','Werk',6,12,58,62,finder());
mkWin('ph','Fictief werk',10,16,58,62,photos());
mkWin('sf','PR-OTASI',14,10,60,70,safari());
mkWin('ct','Over mij',18,18,56,58,contacts());
mkWin('ml','Nieuw bericht',24,20,46,52,mail());
mkWin('qt','Trailers',20,12,52,64,player(),1);
APPS.forEach(function(a){var d=D.createElement('div');d.className='mc-ic';d.dataset.a=a[0];d.innerHTML=ICONS[a[0]]+'<i>'+a[1]+'</i>';d.onclick=function(){d.classList.add('bn');setTimeout(function(){d.classList.remove('bn')},1000);if(W[a[0]].classList.contains('open')){W[a[0]].style.zIndex=++z}else openW(a[0])};dock.appendChild(d)});
/* delegatie */
scr.addEventListener('click',function(ev){
var o=ev.target.closest('[data-o]');if(o){openW(o.dataset.o);return}
var g=ev.target.closest('[data-go]');if(g){ev.preventDefault();zoomTo('#/'+g.dataset.go);return}
var a=ev.target.closest('a.art,a.mc-btn[href^="#/"]');if(a){ev.preventDefault();zoomTo(a.getAttribute('href'))}
if(ev.target.id==='mcsend'){var s=encodeURIComponent($('#mcsub').value||'Hallo Dylan'),m=encodeURIComponent($('#mcmsg').value);location.href='mailto:dylan.protasi@gmail.com?subject='+s+'&body='+m}
if(ev.target.id==='mcnext'){var i=(TR.findIndex(function(t){return t[0]===cur})+1)%TR.length;cur=TR[i][0];var v=$('#mcw-qt video');v.src=V[cur];v.play().catch(function(){});$('#mcttl').textContent=TR[i][1]}
});
/* zoom */
function zoomTo(hash){
var r=scr.getBoundingClientRect(),vw=innerWidth,vh=innerHeight,k=Math.max(vw/r.width,(vh-30)/r.height);
if(vw<=820||vw/vh<1){location.hash=hash;return}
var c=mb.getBoundingClientRect(),cx=c.left+c.width/2,cy=c.top+c.height/2,sx=r.left+r.width/2,sy=r.top+r.height/2;
var tx=vw/2-cx-k*(sx-cx),ty=(vh+30)/2-cy-k*(sy-cy);
mb.style.transform='translate('+tx+'px,'+ty+'px) scale('+k+')';mb.dataset.t=mb.style.transform;
setTimeout(function(){location.hash=hash},880)}
$('#mcback').onclick=function(){if(history.length>1&&D.referrer.indexOf(location.host)>-1&&0)history.back();else location.hash=''};
/* opstarten */
var booted=0;
function boot(){if(booted)return;booted=1;var b=$('#mcboot');b.classList.add('go');var done=function(){b.classList.add('off');setTimeout(function(){var n=$('#mcnf');n.classList.add('on');setTimeout(function(){n.classList.remove('on')},6500)},500)};setTimeout(done,1500);b.onclick=done}
function route(){
var h=location.hash,home=isHome(),sect=/^#(werk|fictief|over|contact)$/.test(h);
if(home||sect){
 var was=B.classList.contains('mfull');
 B.classList.add('mac');B.classList.remove('mfull');mac.style.display='flex';scrollTo(0,0);relayout();
 if(was&&mb.dataset.t){mb.classList.add('nt');mb.style.transform=mb.dataset.t;void mb.offsetWidth;mb.classList.remove('nt');mb.style.transform='';mb.dataset.t=''}
 if(sect){openW({'#werk':'fd','#fictief':'ph','#over':'ct','#contact':'ml'}[h]);history.replaceState(null,'',location.pathname)}
 if(!booted)boot();else{}
}else{B.classList.remove('mac');B.classList.add('mfull');mac.style.display='none'}
}
addEventListener('hashchange',route);addEventListener('resize',relayout);
route();
})();
