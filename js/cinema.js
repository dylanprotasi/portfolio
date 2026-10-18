/* Cinemahal: 3D-gang waarin elke zaal een project is */
(function(){
var root=document.getElementById('cine');
if(!root||typeof THREE==='undefined'){return}
function lang(){try{return localStorage.getItem('lang')==='en'?'en':'nl'}catch(e){return 'nl'}}
function T(nl,en){return lang()==='en'?en:nl}
function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){}}

var W=4.2,H=4.4,ZEND=-52,CAMY=1.65,YM=.72;
var D=[
{k:'kinepolis',s:-1,z:-9,t:'Kinepolis Film Distribution',y:'2026',c:'#4f86ff',img:'img/bn-kinepolis.jpg',go:'#/kinepolis',n:1,r:['Stage · Marketing Assistent','Internship · Marketing Assistant'],chip:'Kinepolis'},
{k:'rhode-xmas',s:1,z:-13,t:'Rhode — Christmas Edit',y:'2026',c:'#ff5252',img:'img/bn-rhode-xmas.jpg',go:'#/rhode-xmas',n:6,r:['Fictieve campagne','Fictional campaign'],chip:'Rhode Christmas'},
{k:'hampton',s:-1,z:-17,t:'Hampton Bays',y:'2026',c:'#eadcc0',img:'img/bn-hampton.jpg',go:'#/hampton',n:2,r:['Stage · Belgisch modemerk','Internship · Belgian fashion brand'],chip:'Hampton Bays'},
{k:'rhode',s:1,z:-21,t:'Rhode — Peptide Lip Boost',y:'2026',c:'#ffb3c7',img:'img/bn-rhode.jpg',go:'#/rhode',n:7,r:['Fictieve campagne','Fictional campaign'],chip:'Rhode'},
{k:'pinko',s:-1,z:-25,t:'PINKO',y:'2025',c:'#ff4fa3',img:'img/bn-pinko.jpg',go:'#/pinko',n:3,r:['Dagstage · Fashion Masterclass','Day internship · Fashion Masterclass'],chip:'PINKO'},
{k:'ioan',s:1,z:-29,t:'IOAN — Sun Set 50',y:'2026',c:'#ffa63a',img:'img/bn-ioan.jpg',go:'#/ioan',n:8,r:['Fictieve campagne','Fictional campaign'],chip:'IOAN'},
{k:'disney',s:-1,z:-33,t:'Disney Winter Village',y:'2026',c:'#7fc4ff',img:'img/bn-disney.jpg',go:'#/disney',n:4,r:['Bachelorproef · Retailconcept','Bachelor thesis · Retail concept'],chip:'Disney'},
{k:'pr',s:1,z:-37,t:'PR-OTASI',y:'',c:'#f2ecd9',poster:'press',go:'#/nieuws',lab:['PERSRUIMTE','PRESS ROOM'],r:['Persberichten & blog','Press releases & blog'],chip:'PR-OTASI'},
{k:'fifth',s:-1,z:-41,t:'Magazine The Fifth',y:'2025',c:'#d9b45f',img:'img/bn-fifth.jpg',go:'#/fifth',n:5,r:['Eindwerk · Magazine','Final project · Magazine'],chip:'The Fifth'},
{k:'over',s:1,z:-45,t:'Over mij',t2:'About me',y:'',c:'#8fe3a0',poster:'about',go:'classic:#over',lab:['BACKSTAGE','BACKSTAGE'],r:['Wie is Dylan?','Who is Dylan?'],chip:'Over mij'},
{k:'contact',s:0,z:ZEND,t:'Contact',t2:'Contact',y:'',c:'#ff6a6a',go:'classic:#contact',lab:['KASSA','BOX OFFICE'],r:['Boek een kaartje: stuur me een bericht','Book a ticket: send me a message'],chip:'Contact',end:1}
];

/* ---------- renderer ---------- */
var renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(e){window.__cineFail=1;return}
var DPR=Math.min(devicePixelRatio||1,innerWidth<700?1.5:2);
renderer.setPixelRatio(DPR);renderer.setClearColor(0x07050a);
var cvs=renderer.domElement;cvs.id='cine-cv';root.insertBefore(cvs,root.firstChild);
var scene=new THREE.Scene();scene.fog=new THREE.Fog(0x07050a,7,34);
var cam=new THREE.PerspectiveCamera(62,1,.1,80);cam.rotation.order='YXZ';
function size(){var w=root.clientWidth||innerWidth,h=root.clientHeight||innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.8?78:(w/h<1.3?70:62);cam.updateProjectionMatrix()}

/* ---------- helpers ---------- */
var redraw=[];
function mkTex(w,h,fn,live){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');fn(x,w,h);var t=new THREE.CanvasTexture(c);t.anisotropy=4;if(live)redraw.push(function(){x.clearRect(0,0,w,h);fn(x,w,h);t.needsUpdate=true});return t}
function box(w,h,d,mat,x,y,z,par){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);(par||scene).add(m);return m}
function plane(w,h,mat,x,y,z,par){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);(par||scene).add(m);return m}
function col(hex){return new THREE.Color(hex)}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function fit(x,txt,max,font){var s=parseInt(font);x.font=font.replace(s+'px',s+'px');while(x.measureText(txt).width>max&&s>14){s-=2;x.font=font.replace(/\d+px/,s+'px')}return s}

/* ---------- licht ---------- */
scene.add(new THREE.AmbientLight(0x8a7a95,.62));
var hemi=new THREE.HemisphereLight(0xffd9a8,0x1a0f1f,.35);scene.add(hemi);
var camLight=new THREE.PointLight(0xffe2b8,.55,14);scene.add(camLight);

/* ---------- gang ---------- */
var LEN=64,CZ=-(LEN/2)+8;
var carpet=mkTex(256,256,function(x,w,h){x.fillStyle='#1a1226';x.fillRect(0,0,w,h);x.strokeStyle='#7e1d3a';x.lineWidth=6;for(var i=0;i<2;i++)for(var j=0;j<2;j++){var cx=64+i*128,cy=64+j*128;x.beginPath();x.moveTo(cx,cy-52);x.lineTo(cx+52,cy);x.lineTo(cx,cy+52);x.lineTo(cx-52,cy);x.closePath();x.stroke();x.fillStyle='#c9a24a';x.beginPath();x.arc(cx,cy,6,0,7);x.fill()}x.fillStyle='rgba(255,255,255,.05)';for(var k=0;k<400;k++)x.fillRect(Math.random()*w,Math.random()*h,2,2)});
carpet.wrapS=carpet.wrapT=THREE.RepeatWrapping;carpet.repeat.set(W*2/4,LEN/4);
var floor=plane(W*2,LEN,new THREE.MeshLambertMaterial({map:carpet,color:0xffffff}),0,0,CZ);floor.rotation.x=-Math.PI/2;
var ceil=plane(W*2,LEN,new THREE.MeshLambertMaterial({color:0x0d0a12}),0,H,CZ);ceil.rotation.x=Math.PI/2;
var wallTex=mkTex(256,256,function(x,w,h){x.fillStyle='#24101a';x.fillRect(0,0,w,h);for(var i=0;i<8;i++){x.fillStyle=i%2?'#2c1421':'#1e0d16';x.fillRect(i*32,0,32,h);x.fillStyle='rgba(255,255,255,.035)';x.fillRect(i*32,0,2,h)}});
wallTex.wrapS=wallTex.wrapT=THREE.RepeatWrapping;wallTex.repeat.set(LEN/2,1);
var wallMat=new THREE.MeshLambertMaterial({map:wallTex});
var trimMat=new THREE.MeshBasicMaterial({color:0xffb347});
[-1,1].forEach(function(s){
  var w=plane(LEN,H,wallMat,s*W,H/2,CZ);w.rotation.y=-s*Math.PI/2;
  box(.06,.9,LEN,new THREE.MeshLambertMaterial({color:0x120a0e}),s*(W-.04),.45,CZ);
  box(.05,.05,LEN,trimMat,s*(W-.05),.95,CZ);
  box(.05,.05,LEN,trimMat,s*(W-.05),H-.35,CZ);
  for(var z=0;z>-60;z-=2){box(.05,.05,.5,new THREE.MeshBasicMaterial({color:0xffd9a0}),s*(W-1),.02,z)}
});
/* plafondlampen en sterren */
var lampM=new THREE.MeshBasicMaterial({color:0xffe3b0});
for(var z=0;z>-56;z-=4){box(1.4,.04,.4,lampM,0,H-.02,z);box(.9,.03,.3,lampM,-2.6,H-.02,z-2);box(.9,.03,.3,lampM,2.6,H-.02,z-2)}
(function(){var g=new THREE.BufferGeometry(),n=900,a=new Float32Array(n*3);for(var i=0;i<n;i++){a[i*3]=(Math.random()*2-1)*W;a[i*3+1]=H-.01;a[i*3+2]=8-Math.random()*70}g.setAttribute('position',new THREE.BufferAttribute(a,3));var p=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff2d0,size:.06,sizeAttenuation:true,transparent:true,opacity:.8}));scene.add(p)})();
/* achterwand (ingang) en eindwand */
plane(W*2,H,new THREE.MeshLambertMaterial({color:0x14090f}),0,H/2,ZEND-.01);
var endW=plane(W*2,H,new THREE.MeshLambertMaterial({map:wallTex}),0,H/2,ZEND);

/* ---------- posters / borden ---------- */
var imgCache={};
function loadImg(src,cb){if(imgCache[src]){cb(imgCache[src]);return}var im=new Image();im.onload=function(){imgCache[src]=im;cb(im)};im.src=src}
function posterCanvas(d){
  var t=mkTex(1280,720,function(x,w,h){
    if(d.poster==='press'){x.fillStyle='#f2ecd9';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font='700 190px Oswald,Impact,sans-serif';x.textAlign='center';x.fillText('PR-OTASI',w/2,300);x.fillRect(80,330,w-160,8);x.font='500 44px Oswald,sans-serif';x.fillText(T('PERSBERICHTEN · BLOG · NIEUWS','PRESS RELEASES · BLOG · NEWS'),w/2,410);x.fillStyle='#444';for(var c=0;c<3;c++){for(var l=0;l<7;l++){x.fillRect(100+c*370,460+l*32,330-(l%3)*40,10)}}}
    else if(d.poster==='about'){x.fillStyle='#0f2a1a';x.fillRect(0,0,w,h);var im=imgCache['img/xs-ab.jpg'];if(im){var sc=Math.max(w*.5/im.width,h/im.height);x.drawImage(im,w*.5,0,w*.5,h,w*.5+0,0,w*.5,h);}x.fillStyle='#8fe3a0';x.textAlign='left';x.font='700 150px Oswald,Impact,sans-serif';x.fillText(T('OVER','ABOUT'),70,300);x.fillText(T('MIJ','ME'),70,450);x.fillStyle='#fff';x.font='500 40px Oswald,sans-serif';x.fillText('Dylan Protasi',74,540)}
  });
  if(d.poster==='about'&&!imgCache['img/xs-ab.jpg'])loadImg('img/xs-ab.jpg',function(){redraw.forEach(function(f){f()})});
  return t;
}
var hits=[],bays=[];
function makeBay(d,i){
  if(d.end)return makeEnd(d,i);
  var g=new THREE.Group();g.position.set(d.s*W,0,d.z);g.rotation.y=-d.s*Math.PI/2;scene.add(g);
  var acc=col(d.c),dark=acc.clone().multiplyScalar(.28);
  box(7.3,3.7,.1,new THREE.MeshLambertMaterial({color:0x140a10}),0,1.95,.03,g);
  /* deur */
  var dl=new THREE.MeshLambertMaterial({color:dark.getHex()});
  var door=box(.98,2.6,.07,dl,-2.7,1.3,.1,g);door.userData.i=i;hits.push(door);
  var door2=box(.98,2.6,.07,dl,-1.7,1.3,.1,g);door2.userData.i=i;hits.push(door2);
  var gm=new THREE.MeshBasicMaterial({color:acc.getHex(),transparent:true,opacity:.5});
  [[-2.7],[-1.7]].forEach(function(a){var p=new THREE.Mesh(new THREE.CircleGeometry(.2,20),gm);p.position.set(a[0],1.75,.15);g.add(p)});
  var em=new THREE.MeshBasicMaterial({color:acc.getHex()});
  box(2.18,.05,.06,em,-2.2,2.62,.08,g);box(.05,2.6,.06,em,-3.3,1.3,.08,g);box(.05,2.6,.06,em,-1.1,1.3,.08,g);
  var spill=plane(2,.9,new THREE.MeshBasicMaterial({color:acc.getHex(),transparent:true,opacity:.28}),-2.2,.02,.9,g);spill.rotation.x=-Math.PI/2;
  /* bord boven deur */
  var lab=d.lab?d.lab:[T('ZAAL ','SCREEN ')+d.n,'SCREEN '+d.n];
  var sg=mkTex(512,128,function(x,w,h){x.fillStyle='#0b0709';x.fillRect(0,0,w,h);x.strokeStyle=d.c;x.lineWidth=6;rr(x,6,6,w-12,h-12,18);x.stroke();x.fillStyle=d.c;x.shadowColor=d.c;x.shadowBlur=22;x.textAlign='center';var txt=d.lab?T(d.lab[0],d.lab[1]):T('ZAAL ','SCREEN ')+d.n;x.font='700 72px Oswald,Impact,sans-serif';fit(x,txt,w-60,'700 72px Oswald,Impact,sans-serif');x.fillText(txt,w/2,88)},true);
  plane(2.2,.55,new THREE.MeshBasicMaterial({map:sg}),-2.2,3.05,.1,g);
  /* poster */
  box(3.5,2.06,.1,new THREE.MeshLambertMaterial({color:0x0d0709}),1.35,2.05,.08,g);
  var pm=new THREE.MeshBasicMaterial({color:0xffffff});
  var po=plane(3.3,1.86,pm,1.35,2.05,.14,g);po.userData.i=i;hits.push(po);
  if(d.poster){pm.map=posterCanvas(d)}else{new THREE.TextureLoader().load(d.img,function(t){t.anisotropy=4;pm.map=t;pm.needsUpdate=true})}
  [[1.35,3.1,3.5,.05],[1.35,1.0,3.5,.05]].forEach(function(a){box(a[2],a[3],.06,em,a[0],a[1],.14,g)});
  [[-.4],[3.1]].forEach(function(a){box(.05,2.1,.06,em,a[0],2.05,.14,g)});
  /* plaatje onder poster */
  var pl=mkTex(1024,220,function(x,w,h){x.fillStyle='#0b0709';x.fillRect(0,0,w,h);x.strokeStyle=d.c;x.lineWidth=5;rr(x,5,5,w-10,h-10,16);x.stroke();x.textAlign='center';x.fillStyle='#fff';var s=fit(x,T(d.t,d.t2||d.t),w-60,'700 72px Oswald,Impact,sans-serif');x.fillText(T(d.t,d.t2||d.t),w/2,95);x.fillStyle=d.c;x.font='500 40px Oswald,sans-serif';x.fillText((T(d.r[0],d.r[1]))+(d.y?'  ·  '+d.y:''),w/2,160)},true);
  var plt=plane(3.3,.7,new THREE.MeshBasicMaterial({map:pl}),1.35,.62,.1,g);plt.userData.i=i;hits.push(plt);
  var L=new THREE.PointLight(acc.getHex(),.9,8);L.position.set(-1,2.4,1.6);g.add(L);
  var L2=new THREE.PointLight(0xfff0d0,.5,6);L2.position.set(1.35,3.3,1.2);g.add(L2);
  d.glow=gm;d.spill=spill.material;d.pm=pm;d.po=po;d.dz=d.z+(d.s<0?2.2:-2.2);d.tx=d.s*(W-1.2);d.ty=-d.s*Math.PI/2;d.pz=d.z+(d.s<0?-1.35:1.35);d.cz0=d.z+4.2;
  bays.push(g);
}
function makeEnd(d,i){
  var g=new THREE.Group();g.position.set(0,0,ZEND+.05);scene.add(g);
  var acc=col(d.c);
  var sg=mkTex(2048,900,function(x,w,h){x.fillStyle='#0b0709';x.fillRect(0,0,w,h);x.strokeStyle=d.c;x.lineWidth=14;rr(x,20,20,w-40,h-40,40);x.stroke();x.textAlign='center';x.fillStyle=d.c;x.shadowColor=d.c;x.shadowBlur=36;x.font='700 330px Oswald,Impact,sans-serif';x.fillText(T('KASSA','BOX OFFICE'),w/2,400);x.shadowBlur=0;x.fillStyle='#fff';x.font='500 90px Oswald,sans-serif';x.fillText(T('Boek een kaartje: stuur me een bericht','Book a ticket: send me a message'),w/2,560);x.fillStyle=d.c;x.font='500 80px Oswald,sans-serif';x.fillText('dylan.protasi@gmail.com',w/2,700)},true);
  var s=plane(5.4,2.37,new THREE.MeshBasicMaterial({map:sg}),0,2.7,0,g);s.userData.i=i;hits.push(s);
  var cm=new THREE.MeshLambertMaterial({color:0x2a1620});
  var ct=box(6.4,1.05,1.1,cm,0,.52,1.1,g);ct.userData.i=i;hits.push(ct);
  box(6.5,.08,1.2,new THREE.MeshBasicMaterial({color:acc.getHex()}),0,1.07,1.1,g);
  var L=new THREE.PointLight(acc.getHex(),1.1,10);L.position.set(0,2.8,3);g.add(L);
  d.glow=new THREE.MeshBasicMaterial({transparent:true,opacity:0});d.spill=d.glow;d.dz=ZEND;d.tx=0;d.ty=0;d.cz0=ZEND+5.2;d.po=s;
}
D.forEach(makeBay);
/* wandtitels */
function wallHead(side,z,txt,c){
  var g=new THREE.Group();g.position.set(side*W,0,z);g.rotation.y=-side*Math.PI/2;scene.add(g);
  var t=mkTex(1024,256,function(x,w,h){x.fillStyle='#0b0709';x.fillRect(0,0,w,h);x.strokeStyle=c;x.lineWidth=7;rr(x,7,7,w-14,h-14,22);x.stroke();x.textAlign='center';x.fillStyle=c;x.shadowColor=c;x.shadowBlur=26;x.font='700 120px Oswald,Impact,sans-serif';x.fillText(T(txt[0],txt[1]),w/2,140);x.shadowBlur=0;x.fillStyle='#fff';x.font='500 42px Oswald,sans-serif';x.fillText(T(txt[2],txt[3]),w/2,208)},true);
  plane(3.8,.95,new THREE.MeshBasicMaterial({map:t}),0,2.6,.06,g);
}
wallHead(-1,-3.2,['WERK','WORK','Nu in de zalen','Now showing'],'#ffcf5a');
wallHead(1,-6.6,['FICTIEF WERK','FICTIONAL WORK','Arthouse-zalen','Arthouse screens'],'#ff8ad0');
/* hangend welkomstbord */
var wel=mkTex(1400,300,function(x,w,h){x.fillStyle='rgba(0,0,0,0)';x.clearRect(0,0,w,h);x.textAlign='center';x.fillStyle='#ffd27a';x.shadowColor='#ff9a1f';x.shadowBlur=30;x.font='700 150px Oswald,Impact,sans-serif';x.fillText('DYLAN PROTASI',w/2,160);x.shadowBlur=14;x.font='500 54px Oswald,sans-serif';x.fillText(T('C I N E M A  ·  CONTENT & MARKETING','C I N E M A  ·  CONTENT & MARKETING'),w/2,250)});
var welM=new THREE.MeshBasicMaterial({map:wel,transparent:true});
plane(6.2,1.33,welM,0,3.3,-5.5);

/* ---------- navigatie ---------- */
var p=0,pt=0,yaw=0,lk=0,fly=null,hover=-1,drag=null,focus=-1,raf=0,last=0,on=false,tm=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
var PMAX=-ZEND-4.5;
var cxs=0,cxt=0;
function portrait(){return cam.aspect<.9}
function wgt(cz,d){return Math.exp(-Math.pow((cz-d.pz)/3,2))}
function autoYaw(cz){
  var s=0,ws=0,i,d;
  if(portrait()){var mx=0,sx=0;for(i=0;i<D.length;i++){d=D[i];if(d.end)continue;var w=wgt(cz,d),ang=Math.max(-1.5,Math.min(1.5,Math.atan2(-(d.s*W-cxs),-(d.pz-cz)))),q=Math.pow(w,5);s+=q*ang;sx+=q*d.s;ws+=q;if(w>mx)mx=w}var k=Math.min(1,mx*2.6);cxt=ws>0?-(sx/ws)*2*k:0;return ws>0?s/ws*k:0}
  for(i=0;i<D.length;i++){d=D[i];if(d.end)continue;var a=cz-d.dz;var w2=Math.exp(-Math.pow((a-3.4)/3,2));s+=-d.s*w2*YM}return s}
function focusIdx(cz){var b=-1,bd=99,i,d;
  if(portrait()){var bw=.3;for(i=0;i<D.length;i++){d=D[i];if(d.end){var a0=cz-d.dz;if(a0>2&&a0<9&&bw<.99){b=i;bw=.99}continue}var w=wgt(cz,d);if(w>bw){bw=w;b=i}}return b}
  for(i=0;i<D.length;i++){d=D[i];var a=cz-(d.end?d.dz+1:d.dz);var lo=d.end?2:-1.5,hi=d.end?9:7;if(a>lo&&a<hi){var q=Math.abs(a-(d.end?5:3.4));if(q<bd){bd=q;b=i}}}return b}
function goalZ(d){return (portrait()&&!d.end)?d.pz+1.4:d.cz0}
/* HUD */
var hud=document.getElementById('cine-hud');
var capEl=document.getElementById('cine-cap'),introEl=document.getElementById('cine-intro'),tipEl=document.getElementById('cine-tip'),chipsEl=document.getElementById('cine-chips'),fade=document.getElementById('cine-fade');
function buildChips(){chipsEl.innerHTML='';D.forEach(function(d,i){var b=document.createElement('button');b.type='button';b.textContent=d.chip;b.style.setProperty('--c',d.c);b.dataset.i=i;b.addEventListener('click',function(e){e.stopPropagation();goTo(i)});chipsEl.appendChild(b)})}
function setCap(i){
  if(i<0){capEl.classList.remove('on');return}
  var d=D[i],lb=d.end?T(d.lab[0],d.lab[1]):(d.lab?T(d.lab[0],d.lab[1]):T('ZAAL ','SCREEN ')+d.n);
  capEl.innerHTML='<small style="color:'+d.c+'"></small><b></b><span></span><button type="button"></button>';
  capEl.querySelector('small').textContent=lb;capEl.querySelector('b').textContent=T(d.t,d.t2||d.t);capEl.querySelector('span').textContent=T(d.r[0],d.r[1])+(d.y?' · '+d.y:'');
  var bt=capEl.querySelector('button');bt.textContent=d.end?T('Naar de kassa ▸','To the box office ▸'):T('Binnenkomen ▸','Enter ▸');bt.style.background=d.c;bt.onclick=function(e){e.stopPropagation();enter(i)};
  capEl.classList.add('on');
  [].forEach.call(chipsEl.children,function(c,n){c.classList.toggle('on',n===i)});
}
function goTo(i){if(fly)return;var d=D[i];pt=clamp(-goalZ(d),0,PMAX+4);lk=0;interacted()}
var inter=false;function interacted(){inter=true;var h=document.getElementById('cine-hint');if(h)h.classList.add('off')}

function enter(i){
  if(fly)return;var d=D[i];
  fly={t:0,t0:performance.now(),x0:cam.position.x,z0:cam.position.z,y0:yaw,x1:d.tx,z1:d.dz,y1:d.ty,i:i,nav:false};
  if(d.end)fly.z1=d.dz+1.3;
}
function navigate(d){
  var go=d.go;
  if(go.indexOf('classic:')===0){store('classic','1');var h=go.slice(8);setTimeout(function(){location.hash=h;if(location.hash===h)window.dispatchEvent(new HashChangeEvent('hashchange'))},0);}
  else{location.hash=go}
}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function pick(e){
  var r=cvs.getBoundingClientRect(),m=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);
  var rc=new THREE.Raycaster();rc.setFromCamera(m,cam);var h=rc.intersectObjects(hits,false);return h.length?h[0].object.userData.i:-1;
}

/* ---------- loop ---------- */
function frame(ts){
  raf=requestAnimationFrame(frame);var dt=Math.min(.25,(ts-last)/1000||.016);last=ts;tm+=dt;
  if(!fly){
    pt=clamp(pt,0,PMAX+4);p+=(pt-p)*Math.min(1,dt*3.2);
    cxt=0;var cz=-p,ty=autoYaw(cz)+lk;yaw+=(ty-yaw)*Math.min(1,dt*3.4);cxs+=(cxt-cxs)*Math.min(1,dt*3);
    if(!drag)lk*=Math.max(0,1-dt*1.2);
    var mv=Math.abs(pt-p);var bob=Math.min(1,mv*.6);
    cam.position.set(cxs+Math.sin(tm*1.3)*.02*bob,CAMY+Math.sin(p*2.4)*.035*bob,cz);
    cam.rotation.set(0,yaw,0);
    var f=focusIdx(cz);if(f!==focus){focus=f;setCap(f)}
    var a=1-p/3.5;introEl.style.opacity=a>0?a:0;introEl.style.visibility=a>0?'visible':'hidden';
  }else{
    fly.t=(performance.now()-fly.t0)/1100;var k=ease(Math.min(1,fly.t));
    cam.position.set(fly.x0+(fly.x1-fly.x0)*k,CAMY,fly.z0+(fly.z1-fly.z0)*k);
    yaw=fly.y0+(fly.y1-fly.y0)*k;cam.rotation.set(0,yaw,0);
    if(fly.t>.55)fade.classList.add('on');
    capEl.classList.remove('on');
    if(fly.t>=1&&!fly.nav){fly.nav=true;var d=D[fly.i];p=pt=-d.dz;navigate(d)}
  }
  camLight.position.copy(cam.position);
  for(var i=0;i<D.length;i++){var d=D[i],h=(i===hover)||(i===focus&&!d.end);var g=d.glow;if(!g)continue;var tg=d.end?0:(h?.95:.5);g.opacity+=(tg-g.opacity)*.15;d.spill.opacity+=((h?.55:.28)-d.spill.opacity)*.15;if(d.pm){var q=h?1.18:1;d.pm.color.setScalar(h?1:.92)}}
  renderer.render(scene,cam);
}

/* ---------- input ---------- */
cvs.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,m:false};try{cvs.setPointerCapture(e.pointerId)}catch(_){}});
cvs.addEventListener('pointermove',function(e){
  if(drag){var dx=e.clientX-drag.lx,dy=e.clientY-drag.ly;if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>8)drag.m=true;
    if(drag.m&&!fly){pt-=dy*.035;lk=clamp(lk+dx*.003,-.8,.8);interacted()}drag.lx=e.clientX;drag.ly=e.clientY;return}
  if(e.pointerType==='touch'||fly)return;var i=pick(e);if(i!==hover){hover=i;cvs.style.cursor=i>=0?'pointer':'grab';if(i>=0){tipEl.textContent=T('Klik om zaal te betreden','Click to enter')+' · '+D[i].chip;tipEl.classList.add('on')}else tipEl.classList.remove('on')}
  tipEl.style.left=e.clientX+14+'px';tipEl.style.top=e.clientY+16+'px';
});
cvs.addEventListener('pointerup',function(e){if(drag&&!drag.m&&!fly){var i=pick(e);if(i>=0)enter(i)}drag=null});
cvs.addEventListener('pointerleave',function(){hover=-1;tipEl.classList.remove('on')});
cvs.addEventListener('wheel',function(e){e.preventDefault();if(fly)return;pt+=clamp(e.deltaY,-120,120)*.012;interacted()},{passive:false});
document.addEventListener('keydown',function(e){
  if(!on||fly)return;var k=e.key;
  if(k==='ArrowUp'||k==='w'||k==='W'||k==='PageDown'){e.preventDefault();pt+=1.4;interacted()}
  else if(k==='ArrowDown'||k==='s'||k==='S'||k==='PageUp'){e.preventDefault();pt-=1.4;interacted()}
  else if(k==='ArrowLeft'||k==='a'){lk=clamp(lk+.35,-.8,.8)}
  else if(k==='ArrowRight'||k==='d'){lk=clamp(lk-.35,-.8,.8)}
  else if(k==='Enter'&&focus>=0){e.preventDefault();enter(focus)}
});

/* ---------- aan/uit ---------- */
function startLoop(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
function stopLoop(){if(raf){cancelAnimationFrame(raf);raf=0}}
function show(){
  if(on)return;on=true;root.style.display='block';document.body.classList.add('cine');fly=null;fade.classList.remove('on');size();focus=-2;startLoop();
}
function hide(){if(!on)return;on=false;root.style.display='none';document.body.classList.remove('cine');stopLoop()}
var tocine=document.getElementById('tocine');
function sync(){
  var h=location.hash,home=(h===''||h==='#');
  if(home&&store('classic')!=='1'){show()}else{hide()}
  if(tocine)tocine.style.display=(home&&store('classic')==='1')?'block':'none';
}
document.getElementById('cine-classic').addEventListener('click',function(e){e.stopPropagation();store('classic','1');sync()});
if(tocine)tocine.addEventListener('click',function(){store('classic',null);sync();window.scrollTo(0,0)});
window.addEventListener('hashchange',sync);
window.addEventListener('resize',function(){if(on)size()});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#langsw'))setTimeout(function(){redraw.forEach(function(f){f()});buildChips();focus=-2},60)});
buildChips();
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('700 60px Oswald'),document.fonts.load('500 40px Oswald')]).then(function(){redraw.forEach(function(f){f()})}).catch(function(){})}
window.__cine={setP:function(v){pt=p=v},get p(){return p},enter:enter,D:D};
sync();
})();
