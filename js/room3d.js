/* Realistische 3D-kamer: retro-tv, afstandsbediening in je hand, project = inzoomen op het scherm */
(function(){
if(!window.THREE||!THREE.EffectComposer)return;
var gl0;try{var tc=document.createElement('canvas');gl0=tc.getContext('webgl2')||tc.getContext('webgl')}catch(e){}
if(!gl0)return;
var IS2=!!(window.WebGL2RenderingContext&&gl0 instanceof WebGL2RenderingContext);
function lang(){try{return localStorage.getItem('lang')==='en'?'en':'nl'}catch(e){return 'nl'}}
function T(a){return lang()==='en'?a[1]:a[0]}

/* ============ menu-data ============ */
var MAIN=[
{n:'01',t:['WERK','WORK'],s:['Stage & opdrachten','Internships & assignments'],sub:'werk'},
{n:'02',t:['FICTIEF WERK','FICTIONAL WORK'],s:['Conceptcampagnes','Concept campaigns'],sub:'fictief'},
{n:'03',t:['PR-OTASI','PR-OTASI'],s:['Perssite & blog','Press site & blog'],go:'#/nieuws'},
{n:'04',t:['OVER MIJ','ABOUT ME'],s:['Wie is Dylan?','Who is Dylan?'],go:'#over'},
{n:'05',t:['CONTACT','CONTACT'],s:['Stuur me een bericht','Send me a message'],go:'#contact'}];
var SUB={
werk:[['KINEPOLIS FILM DISTRIBUTION',['Stage · marketing assistent','Internship · marketing assistant'],'#/kinepolis'],['HAMPTON BAYS',['Stage · Belgisch modemerk','Internship · Belgian fashion brand'],'#/hampton'],['PINKO',['Dagstage · Fashion Masterclass','Day internship · Fashion Masterclass'],'#/pinko'],['DISNEY WINTER VILLAGE',['Bachelorproef · retailconcept','Bachelor thesis · retail concept'],'#/disney'],['MAGAZINE THE FIFTH',['Eindwerk · magazine','Final project · magazine'],'#/fifth']],
fictief:[['RHODE · CHRISTMAS EDIT',['Fictieve campagne','Fictional campaign'],'#/rhode-xmas'],['RHODE · PEPTIDE LIP BOOST',['Fictieve campagne','Fictional campaign'],'#/rhode'],['IOAN · SUN SET 50',['Fictieve campagne','Fictional campaign'],'#/ioan']]};

/* ============ renderer ============ */
var root=document.createElement('div');root.id='tvroom3';
var cvs=document.createElement('canvas');cvs.id='tv3cv';root.appendChild(cvs);
var flash=document.createElement('div');flash.id='tv3fl';root.appendChild(flash);
var hintEl=document.createElement('div');hintEl.id='tv3hint';root.appendChild(hintEl);
var stl=document.createElement('style');stl.textContent='body.tvr{overflow:hidden}body.tvr:after{display:none}#tvroom3{position:fixed;inset:0;z-index:45;display:none;background:#05070b;touch-action:none}#tv3cv{position:absolute;inset:0;width:100%;height:100%;display:block;outline:none}#tv3fl{position:absolute;inset:0;background:#cfe4ff;opacity:0;pointer-events:none;transition:opacity .3s}#tv3fl.on{opacity:1}#tv3hint{position:absolute;left:50%;top:14px;transform:translateX(-50%);font:500 15px "IBM Plex Mono",monospace;color:#ffd36b;text-shadow:0 0 10px rgba(255,200,90,.6);letter-spacing:.04em;text-align:center;pointer-events:none;transition:opacity .4s;animation:t3bl 1.3s steps(2) infinite;max-width:70vw}#tv3hint.hide{opacity:0;animation:none}@keyframes t3bl{50%{opacity:.35}}@media(max-width:640px){#tv3hint{top:56px;font-size:13px}}';
document.head.appendChild(stl);
document.body.appendChild(root);
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:cvs,antialias:false,powerPreference:'high-performance'})}catch(e){document.body.removeChild(root);return}
window.TV3=true;
renderer.setClearColor(0x05070b);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
var DPR=Math.min(devicePixelRatio||1,innerWidth<700?1.25:1.6);
renderer.setPixelRatio(DPR);
var scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x07090e,.06);
var cam=new THREE.PerspectiveCamera(50,1.78,.03,40);scene.add(cam);

/* ============ helpers ============ */
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function cvx(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
function mkT(c,rep,srgb){var t=new THREE.CanvasTexture(c);if(srgb!==false)t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
function speckle(x,w,h,n,a){var r=rng(7);for(var i=0;i<n;i++){x.fillStyle='rgba('+(r()<.5?'0,0,0':'255,255,255')+','+(r()*a)+')';x.fillRect(r()*w,r()*h,1+r()*1.5,1+r()*1.5)}}
function noiseTex(rep){var a=cvx(256,256),x=a[1],r=rng(3);for(var i=0;i<4000;i++){var v=Math.floor(r()*255);x.fillStyle='rgb('+v+','+v+','+v+')';x.fillRect(r()*256,r()*256,2,2)}var t=mkT(a[0],[rep,rep],false);return t}
function woodCanvas(w,h,base,seed,planks,warm){
  var a=cvx(w,h),c=a[0],x=a[1],r=rng(seed);x.fillStyle=base;x.fillRect(0,0,w,h);var pn=planks||1,ph=h/pn;
  for(var p=0;p<pn;p++){var y0=p*ph,tone=r()*.16-.08;x.fillStyle=tone>0?'rgba(255,215,160,'+tone+')':'rgba(0,0,0,'+(-tone*2.2)+')';x.fillRect(0,y0,w,ph);
    for(var i=0;i<70;i++){var yy=y0+r()*ph,al=.03+r()*.08,lw=.5+r()*1.6;x.strokeStyle=r()<.55?'rgba(35,16,6,'+al+')':'rgba(255,225,185,'+(al*.55)+')';x.lineWidth=lw;x.beginPath();var amp=r()*4,f=r()*.02+.004,p0=r()*6;for(var xx=0;xx<=w;xx+=12){var yv=yy+Math.sin(xx*f+p0)*amp;if(xx)x.lineTo(xx,yv);else x.moveTo(xx,yv)}x.stroke()}
    if(r()<.4){var kx=r()*w,ky=y0+ph*.3+r()*ph*.4;for(var k=7;k>0;k--){x.strokeStyle='rgba(35,16,6,'+(.04+k*.014)+')';x.lineWidth=1.2;x.beginPath();x.ellipse(kx,ky,k*8,k*2.6,0,0,6.3);x.stroke()}}
    if(pn>1){x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,y0,w,2);x.fillRect(r()*w,y0,2,ph);x.fillStyle='rgba(255,230,190,.08)';x.fillRect(0,y0+2,w,1)}}
  speckle(x,w,h,2500,.1);return c}
function rrShape(w,h,r){var s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.absarc(x+w-r,y+r,r,-Math.PI/2,0,false);s.lineTo(x+w,y+h-r);s.absarc(x+w-r,y+h-r,r,0,Math.PI/2,false);s.lineTo(x+r,y+h);s.absarc(x+r,y+h-r,r,Math.PI/2,Math.PI,false);s.lineTo(x,y+r);s.absarc(x+r,y+r,r,Math.PI,Math.PI*1.5,false);return s}
function rbox(w,h,d,r,bev,mat,hole){var s=rrShape(w,h,r);if(hole){var hs=rrShape(hole[0],hole[1],hole[2]);var pts=hs.getPoints(12).map(function(p){return new THREE.Vector2(p.x+(hole[3]||0),p.y+(hole[4]||0))}).reverse();s.holes.push(new THREE.Path(pts))}
  var g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:10});g.translate(0,0,-d/2);var m=new THREE.Mesh(g,mat);m.castShadow=m.receiveShadow=true;return m}
function bx(w,h,d,mat,x,y,z,par,sh){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);if(sh!==false){m.castShadow=true;m.receiveShadow=true}(par||scene).add(m);return m}
function cyl(rt,rb,h,mat,x,y,z,par,seg){var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||28),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(par||scene).add(m);return m}
function std(o){return new THREE.MeshStandardMaterial(o)}
var NZ=noiseTex(1);

/* ============ licht ============ */
scene.add(new THREE.AmbientLight(0x303848,.3));
scene.add(new THREE.HemisphereLight(0x405478,0x24160e,.28));
var moon=new THREE.DirectionalLight(0x7f9fe0,.22);moon.position.set(4,3,1.5);scene.add(moon);
var lampL=new THREE.PointLight(0xffb866,1.5,6,1.6);lampL.position.set(-.64,.92,-1.9);lampL.castShadow=true;lampL.shadow.mapSize.set(1024,1024);lampL.shadow.bias=-.0008;lampL.shadow.radius=4;scene.add(lampL);
var scrL=new THREE.PointLight(0x6aa8ff,0,4.5,1.7);scrL.position.set(-.13,.82,-1.45);scene.add(scrL);
var remL=new THREE.PointLight(0xffd9a8,.35,1.2,2);remL.position.set(.05,.25,.2);cam.add(remL);

/* ============ kamer ============ */
var wallC=(function(){var a=cvx(1024,1024),x=a[1],r=rng(11);x.fillStyle='#2b3a47';x.fillRect(0,0,1024,1024);
  for(var i=0;i<18;i++){var g=x.createRadialGradient(r()*1024,r()*1024,10,r()*1024,r()*1024,300+r()*300);g.addColorStop(0,'rgba('+(r()<.5?'255,255,255':'0,0,0')+',.05)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,1024,1024)}
  for(var s=0;s<1024;s+=64){x.fillStyle='rgba(255,255,255,.035)';x.fillRect(s,0,28,1024);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(s+28,0,2,1024);
    for(var y=0;y<1024;y+=128){x.fillStyle='rgba(255,255,255,.03)';x.beginPath();x.ellipse(s+14,y+64,7,20,0,0,6.3);x.fill()}}
  speckle(x,1024,1024,9000,.07);return a[0]})();
var wallMat=std({map:mkT(wallC,[3,1.4]),bumpMap:null,roughness:.92,metalness:0});
var wallMatS=std({map:mkT(wallC,[3,1.4]),roughness:.92});
var RW=2.6,RZ0=-2.2,RZ1=2.7,RH=2.6;
function wall(w,h,x,y,z,ry,mat){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat||wallMat);m.position.set(x,y,z);m.rotation.y=ry||0;m.receiveShadow=true;scene.add(m);return m}
wall(RW*2,RH,0,RH/2,RZ0,0);
wall(RZ1-RZ0,RH,-RW,RH/2,(RZ0+RZ1)/2,Math.PI/2);
wall(RZ1-RZ0,RH,RW,RH/2,(RZ0+RZ1)/2,-Math.PI/2);
wall(RW*2,RH,0,RH/2,RZ1,Math.PI);
var ceil=new THREE.Mesh(new THREE.PlaneGeometry(RW*2,RZ1-RZ0),std({color:0x1a1d24,roughness:1}));ceil.rotation.x=Math.PI/2;ceil.position.set(0,RH,(RZ0+RZ1)/2);scene.add(ceil);
/* vloer */
var floorT=mkT(woodCanvas(1024,1024,'#6a4a30',21,8),[2.2,2.2]);
var floorBump=mkT(woodCanvas(1024,1024,'#808080',21,8),[2.2,2.2],false);
var floor=new THREE.Mesh(new THREE.PlaneGeometry(RW*2,RZ1-RZ0),std({map:floorT,bumpMap:floorBump,bumpScale:.6,roughness:.5,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.set(0,0,(RZ0+RZ1)/2);floor.receiveShadow=true;scene.add(floor);
/* plinten */
var baseM=std({color:0x7d7a72,roughness:.6});
bx(RW*2,.09,.018,baseM,0,.045,RZ0+.009,null,false);bx(.018,.09,RZ1-RZ0,baseM,-RW+.009,.045,(RZ0+RZ1)/2,null,false);bx(.018,.09,RZ1-RZ0,baseM,RW-.009,.045,(RZ0+RZ1)/2,null,false);
/* tapijt */
var rug=(function(){var a=cvx(1024,700),x=a[1],r=rng(5);x.fillStyle='#4a1621';x.fillRect(0,0,1024,700);
  x.strokeStyle='#d9b36a';x.lineWidth=6;x.strokeRect(40,40,944,620);x.strokeStyle='#1d2c4f';x.lineWidth=22;x.strokeRect(70,70,884,560);x.strokeStyle='#d9b36a';x.lineWidth=3;x.strokeRect(100,100,824,500);
  for(var i=0;i<7;i++)for(var j=0;j<4;j++){var cx=170+i*115,cy=190+j*110;x.fillStyle=(i+j)%2?'#1d2c4f':'#7a2a38';x.beginPath();x.moveTo(cx,cy-46);x.lineTo(cx+46,cy);x.lineTo(cx,cy+46);x.lineTo(cx-46,cy);x.closePath();x.fill();x.strokeStyle='#d9b36a';x.lineWidth=2.5;x.stroke();x.fillStyle='#d9b36a';x.beginPath();x.arc(cx,cy,7,0,6.3);x.fill()}
  speckle(x,1024,700,9000,.14);for(var k=0;k<2000;k++){x.strokeStyle='rgba(255,255,255,'+(r()*.05)+')';x.beginPath();var rx=r()*1024,ry=r()*700;x.moveTo(rx,ry);x.lineTo(rx+r()*6,ry+r()*3);x.stroke()}return a[0]})();
var rugM=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.82),std({map:mkT(rug),bumpMap:NZ,bumpScale:.05,roughness:1}));rugM.rotation.x=-Math.PI/2;rugM.position.set(0,.004,-.55);rugM.receiveShadow=true;scene.add(rugM);NZ.wrapS=NZ.wrapT=THREE.RepeatWrapping;NZ.repeat.set(30,30);

/* ============ kast ============ */
var woodT=mkT(woodCanvas(1024,512,'#7b4f2f',33,1),[1,1]);
var woodM=std({map:woodT,bumpMap:mkT(woodCanvas(1024,512,'#808080',33,1),[1,1],false),bumpScale:.5,roughness:.55,metalness:0});
var woodDk=std({map:mkT(woodCanvas(512,512,'#4a2d1a',34,1),[1,1]),roughness:.6});
var cab=new THREE.Group();cab.position.set(0,0,-1.95);scene.add(cab);
bx(1.5,.03,.5,woodM,0,.465,0,cab);
bx(.03,.36,.5,woodM,-.735,.27,0,cab);bx(.03,.36,.5,woodM,.735,.27,0,cab);bx(.03,.36,.5,woodM,0,.27,0,cab);
bx(1.44,.025,.5,woodM,0,.0925+.0,0,cab);bx(1.5,.36,.012,woodDk,0,.27,-.244,cab);
[[-.69,-.2],[.69,-.2],[-.69,.2],[.69,.2]].forEach(function(p){var l=cyl(.02,.013,.1,woodDk,p[0],.05,p[1],cab);});
/* VCR */
var vcr=new THREE.Group();vcr.position.set(-.37,.105,.03);cab.add(vcr);
var vcrM=std({color:0x2a2b30,roughness:.45,metalness:.35});
bx(.42,.08,.3,vcrM,0,.04,0,vcr);
var vA=cvx(256,64),vx=vA[1];
var vcrTex=mkT(vA[0],null,true);var vcrMat=new THREE.MeshBasicMaterial({map:vcrTex});vcrMat.color.setScalar(1.5);
var vp=new THREE.Mesh(new THREE.PlaneGeometry(.075,.018),vcrMat);vp.position.set(.12,.052,.1515);vcr.add(vp);
bx(.2,.025,.004,std({color:0x08080a,roughness:.3}),-.07,.05,.1515,vcr,false);
cyl(.01,.01,.004,std({color:0x777780,roughness:.35,metalness:.7}),-.17,.04,.152,vcr).rotation.x=Math.PI/2;
var vLed=new THREE.Mesh(new THREE.SphereGeometry(.0035,8,8),new THREE.MeshBasicMaterial({color:0x66ff88}));vLed.material.color.setScalar(1.6);vLed.position.set(.05,.04,.152);vcr.add(vLed);
function drawVcr(){var d=new Date(),h=('0'+d.getHours()).slice(-2),m=('0'+d.getMinutes()).slice(-2);vx.fillStyle='#04120a';vx.fillRect(0,0,256,64);vx.fillStyle='#7dff9a';vx.shadowColor='#7dff9a';vx.shadowBlur=8;vx.font='700 44px VT323,monospace';vx.textAlign='center';vx.fillText(h+(d.getSeconds()%2?' ':':')+m,128,46);vx.shadowBlur=0;vcrTex.needsUpdate=true}
/* cassettes in kast */
var rr0=rng(8);
for(var i=0;i<7;i++){var cc=[0x1d1f26,0x2d3a52,0x5a2430,0x1f3a2e,0x3a3a40][Math.floor(rr0()*5)];var tp=bx(.026,.19,.105,std({color:cc,roughness:.55}),.2+i*.032+rr0()*.004,.1+.095+.0,.04,cab);tp.rotation.z=(i===6?.14:0);var lb=new THREE.Mesh(new THREE.PlaneGeometry(.003,.14),std({color:0xe8e2d0,roughness:.8}));lb.rotation.y=Math.PI/2;lb.position.set(.014,0,0);tp.add(lb);tp.position.y=.125+.095*0}
/* ============ lamp ============ */
var lamp=new THREE.Group();lamp.position.set(-.64,.48,-1.9);scene.add(lamp);
var lampBase=new THREE.Mesh(new THREE.LatheGeometry([[0,0],[.055,0],[.06,.02],[.05,.08],[.032,.16],[.02,.22],[.02,.28],[.0,.28]].map(function(p){return new THREE.Vector2(p[0],p[1])}),32),std({color:0xe8dcc4,roughness:.25,metalness:.05}));lampBase.castShadow=true;lamp.add(lampBase);
var shadeA=cvx(256,128),sx=shadeA[1];sx.fillStyle='#d9a566';sx.fillRect(0,0,256,128);for(var i=0;i<256;i+=3){sx.fillStyle='rgba(255,255,255,'+(.04+Math.random()*.05)+')';sx.fillRect(i,0,1,128)}
var shadeMat=new THREE.MeshStandardMaterial({map:mkT(shadeA[0]),emissive:0xffb35a,emissiveIntensity:.9,roughness:.9,side:THREE.DoubleSide});
var shade=new THREE.Mesh(new THREE.CylinderGeometry(.075,.12,.16,32,1,true),shadeMat);shade.position.y=.34;lamp.add(shade);
/* ============ tv ============ */
var tv=new THREE.Group();tv.position.set(0,.79,-1.97);scene.add(tv);
var plastic=std({color:0x1e1f23,roughness:.48,metalness:.08});
var plasticDk=std({color:0x121316,roughness:.6,metalness:.05});
var body=rbox(.86,.62,.3,.05,.012,plastic);body.position.z=-.06;tv.add(body);
var hump=rbox(.6,.46,.34,.06,.01,plasticDk);hump.position.set(-.05,-.02,-.36);tv.add(hump);
var SCX=-.13,SCY=.015,SW=.5,SH=.375;
var front=rbox(.86,.62,.012,.05,.006,plastic,[SW+.045,SH+.045,.05,SCX,SCY]);front.position.z=.145;tv.add(front);
bx(SW+.05,SH+.05,.02,std({color:0x050506,roughness:.4}),SCX,SCY,.125,tv,false);
/* scherm */
var sc=cvx(1024,768),scx=sc[1],scTex=mkT(sc[0],null,false);scTex.minFilter=THREE.LinearFilter;scTex.generateMipmaps=false;
var scMat=new THREE.ShaderMaterial({uniforms:{tMap:{value:scTex},uOn:{value:0},uT:{value:0},uGl:{value:0},uRes:{value:new THREE.Vector2(1024,768)}},
vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'varying vec2 vUv;uniform sampler2D tMap;uniform float uOn,uT,uGl;uniform vec2 uRes;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}float sdr(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}void main(){vec2 p=vUv*2.-1.;vec2 q=p*(1.+.045*dot(p,p));float m=1.-smoothstep(-.015,.02,sdr(q,vec2(.985),.15));float sy=smoothstep(0.,.55,uOn),sx=smoothstep(.3,.8,uOn);vec2 s=q;s.y/=max(sy,.012);s.x/=max(sx,.05);vec2 uv=s*.5+.5;float tear=step(.985,h(vec2(floor(uv.y*60.),floor(uT*12.))))*uGl;uv.x+=tear*.06;vec3 col=vec3(0.);if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.){float ca=.0014+uGl*.008;col.r=texture2D(tMap,uv+vec2(ca,0.)).r;col.g=texture2D(tMap,uv).g;col.b=texture2D(tMap,uv-vec2(ca,0.)).b;}col=pow(col,vec3(2.2));col*=.74+.26*sin(vUv.y*uRes.y*3.14159);col*=.92+.08*sin(vUv.x*uRes.x*6.2832);col*=1.-.3*dot(p,p)*.55;col+=(h(vUv*uRes+uT)-.5)*.035*uOn;col*=1.+.025*sin(uT*47.);col+=vec3(.05,.1,.2)*.18*uOn*(1.-.5*dot(p,p));float ln=(1.-smoothstep(.55,1.,uOn))*smoothstep(0.,.15,uOn)*exp(-abs(q.y)*70.)*smoothstep(1.,.2,abs(q.x));gl_FragColor=vec4((col*1.9+vec3(1.4,1.5,1.7)*ln)*m,1.);}'});
var scGeo=new THREE.PlaneGeometry(SW,SH,44,34),pa=scGeo.attributes.position;
for(var i=0;i<pa.count;i++){var nx=pa.getX(i)/(SW/2),ny=pa.getY(i)/(SH/2);pa.setZ(i,.022*(1-.5*(nx*nx+ny*ny)))}
scGeo.computeVertexNormals();
var scr=new THREE.Mesh(scGeo,scMat);scr.position.set(SCX,SCY,.138);tv.add(scr);
var glassCube=new THREE.WebGLCubeRenderTarget(256,{generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter});
var cubeCam=new THREE.CubeCamera(.05,20,glassCube);
var glassMat=new THREE.MeshStandardMaterial({color:0x000000,roughness:.06,metalness:0,envMap:glassCube.texture,envMapIntensity:1.5,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
var glass=new THREE.Mesh(scGeo,glassMat);glass.position.set(SCX,SCY,.1395);tv.add(glass);
/* paneel rechts */
var pnl=rbox(.19,.5,.01,.018,.003,plasticDk);pnl.position.set(.325,0,.152);tv.add(pnl);
function knob(y){var g=new THREE.Group();g.position.set(.325,y,.158);tv.add(g);var k=new THREE.Mesh(new THREE.CylinderGeometry(.03,.034,.03,40),std({color:0x3b3c42,roughness:.35,metalness:.55}));k.rotation.x=Math.PI/2;k.castShadow=true;g.add(k);var top=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.004,32),std({color:0x55565c,roughness:.3,metalness:.7}));top.rotation.x=Math.PI/2;top.position.z=.016;g.add(top);bx(.005,.026,.004,std({color:0xe8e8ea,roughness:.4}),0,.012,.019,g,false);return g}
var kb1=knob(.17),kb2=knob(.085);
for(var i=0;i<7;i++)bx(.13,.006,.01,std({color:0x050506,roughness:.5}),.325,-.0-i*.0145,.158,tv,false);
bx(.012,.1,.008,std({color:0x050506}),.325,-.19,.158,tv,false);
var sld=bx(.034,.016,.01,std({color:0xdadada,roughness:.35,metalness:.4}),.325,-.16,.163,tv,false);
var tvLed=new THREE.Mesh(new THREE.SphereGeometry(.0065,12,12),new THREE.MeshBasicMaterial({color:0x330606}));tvLed.position.set(.325,-.255,.16);tv.add(tvLed);
/* merklabel */
var bd=cvx(256,64),bdx=bd[1];bdx.fillStyle='rgba(0,0,0,0)';bdx.font='700 34px "Oswald",Arial';bdx.textAlign='center';bdx.fillStyle='#c9ccd2';bdx.fillText('PROTASI',128,40);
var badge=new THREE.Mesh(new THREE.PlaneGeometry(.09,.0225),new THREE.MeshStandardMaterial({map:mkT(bd[0]),transparent:true,roughness:.3,metalness:.6}));badge.position.set(SCX,-.275,.152);tv.add(badge);
/* voetjes */
[[-.36,-.12],[.36,-.12],[-.36,.0],[.36,.0]].forEach(function(p){bx(.05,.012,.05,plasticDk,p[0],-.316,p[1]-.03,tv)});
/* antennes */
var antM=std({color:0xc9ccd2,roughness:.25,metalness:.85});
var antB=new THREE.Mesh(new THREE.SphereGeometry(.035,24,12,0,Math.PI*2,0,Math.PI/2),plasticDk);antB.position.set(-.12,.31,-.12);antB.castShadow=true;tv.add(antB);
[-1,1].forEach(function(s){var a=new THREE.Group();a.position.set(-.12,.33,-.12);a.rotation.z=-s*.62;a.rotation.x=-.12;tv.add(a);var r=cyl(.003,.0045,.5,antM,0,.25,0,a,10);cyl(.0075,.0075,.012,antM,0,.5,0,a,10)});
/* klok bovenop */
var ledA=cvx(256,96),ledx=ledA[1],ledT=mkT(ledA[0]);
var ledBody=rbox(.24,.085,.06,.04,.006,std({color:0x2b0a0f,roughness:.35}));ledBody.position.set(.2,.31+.04,-.04);tv.add(ledBody);
var ledMat=new THREE.MeshBasicMaterial({map:ledT});ledMat.color.setScalar(1.7);
var ledP=new THREE.Mesh(new THREE.PlaneGeometry(.215,.06),ledMat);ledP.position.set(.2,.31+.04,.0);tv.add(ledP);
var DG={0:'01110100011001110101110011000101110',1:'00100011000010000100001000010001110',2:'01110100010000100010001000100011111',3:'11111000100010000010000011000101110',4:'00010001100101010010111110001000010',5:'11111100001111000001000011000101110',6:'00110010001000011110100011000101110',7:'11111000010001000100010000100001000',8:'01110100011000101110100011000101110',9:'01110100011000101111000010001001100'};
function drawLed(){var d=new Date(),str=('0'+d.getHours()).slice(-2)+('0'+d.getMinutes()).slice(-2),blink=d.getSeconds()%2===0,pitch=8.6,r=3.4;ledx.fillStyle='#12060a';ledx.fillRect(0,0,256,96);var ox=(256-(5*4+3*4+3)*pitch)/2+pitch*.5,oy=(96-7*pitch)/2+pitch*.5,x=0;
  function dot(a,b,lit){ledx.beginPath();ledx.arc(a,b,r,0,6.3);ledx.fillStyle=lit?'#fff08a':'#3a2a14';if(lit){ledx.shadowColor='#ffd84a';ledx.shadowBlur=8}else ledx.shadowBlur=0;ledx.fill();ledx.shadowBlur=0}
  for(var i=0;i<4;i++){var g=DG[str[i]];for(var row=0;row<7;row++)for(var c=0;c<5;c++)dot(ox+(x+c)*pitch,oy+row*pitch,g[row*5+c]==='1');x+=6;if(i===1){for(var rr=0;rr<7;rr++)dot(ox+(x+1)*pitch,oy+rr*pitch,(rr===2||rr===4)&&blink);x+=3}}
  ledT.needsUpdate=true}
/* ============ decor ============ */
function frame(img,w,h,x,y,z,ry,rz){var g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;g.rotation.z=rz||0;scene.add(g);var fm=std({color:0x15110d,roughness:.5});var t=.028;bx(w+t*2,t,.035,fm,0,h/2+t/2,0,g);bx(w+t*2,t,.035,fm,0,-h/2-t/2,0,g);bx(t,h,.035,fm,-w/2-t/2,0,0,g);bx(t,h,.035,fm,w/2+t/2,0,0,g);
  var mat=std({color:0xffffff,roughness:.45});new THREE.TextureLoader().load(img,function(tx){tx.encoding=THREE.sRGBEncoding;tx.anisotropy=8;mat.map=tx;mat.needsUpdate=true});
  var p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);p.position.z=-.012;p.receiveShadow=true;g.add(p);return g}
frame('img/bn-rhode-xmas.jpg',.62,.349,-.72,1.55,RZ0+.02,0,.012);
frame('img/bn-kinepolis.jpg',.5,.281,.7,1.5,RZ0+.02,0,-.008);
/* cassettes op de kast */
var tapes=[[0x1d1f26,.62,.004],[0x5a2430,.61,.018],[0x2d3a52,.62,-.01]];
tapes.forEach(function(t,i){var m=bx(.19,.026,.105,std({color:t[0],roughness:.55}),t[1]+.0,.48+.013+i*.026,-1.9+t[2],null);m.rotation.y=t[2]*3;var lb=new THREE.Mesh(new THREE.PlaneGeometry(.12,.022),std({color:0xe8e2d0,roughness:.8}));lb.rotation.x=-Math.PI/2;lb.position.y=.0136;m.add(lb)});
/* plant */
var pot=cyl(.045,.035,.07,std({color:0xb5593b,roughness:.8}),.62,.515+.0,-2.05,null);pot.position.y=.5+.035;
for(var i=0;i<7;i++){var lf=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),std({color:0x2f6b3a,roughness:.7}));lf.scale.set(.32,1,.12);var a=i/7*6.28;lf.position.set(.62+Math.cos(a)*.03,.6+.04,-2.05+Math.sin(a)*.03);lf.rotation.z=Math.cos(a)*.7;lf.rotation.x=Math.sin(a)*.7;lf.castShadow=true;scene.add(lf)}
/* raam */
(function(){var wm=new THREE.MeshBasicMaterial({color:0xbcd0ff});wm.color.setScalar(1.3);var p=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.5),wm);p.position.set(RW-.01,1.4,.4);p.rotation.y=-Math.PI/2;scene.add(p);var fm=std({color:0x1a1a1c,roughness:.5});bx(.04,1.5,.05,fm,RW-.03,1.4,.4+.6,null,false);bx(.04,1.5,.05,fm,RW-.03,1.4,.4-.6,null,false);bx(.04,.05,1.2,fm,RW-.03,2.15,.4,null,false);bx(.04,.05,1.2,fm,RW-.03,.65,.4,null,false);bx(.04,.04,1.2,fm,RW-.03,1.4,.4,null,false);bx(.04,1.5,.04,fm,RW-.03,1.4,.4,null,false)})();
/* achter de kijker: een bank en een koffietafel, voor de reflecties */
bx(2.0,.45,.8,std({color:0x3a2a2a,roughness:.9}),0,.22,RZ1-.5,null);bx(2.0,.55,.2,std({color:0x3a2a2a,roughness:.9}),0,.6,RZ1-.15,null);

/* ============ afstandsbediening (in je hand) ============ */
var rem=new THREE.Group();cam.add(rem);
var remBody=rbox(.052,.205,.016,.022,.004,std({color:0x1b1b1f,roughness:.5,metalness:.15}));rem.add(remBody);
var btns=[],press={};
function lab(txt,col,fs,w,h){var a=cvx(w||128,h||128),x=a[1];x.fillStyle='rgba(0,0,0,0)';x.clearRect(0,0,a[0].width,a[0].height);x.fillStyle=col||'#f0f0f4';x.font='700 '+(fs||70)+'px "IBM Plex Mono",Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,a[0].width/2,a[0].height/2+4);return mkT(a[0])}
function mkBtn(k,txt,x,y,o){o=o||{};var g=new THREE.Group();g.position.set(x,y,.0125);rem.add(g);var m;
  var mat=std({color:o.color||0x3a3a42,roughness:o.rough||.45,metalness:.1});
  if(o.w){m=new THREE.Mesh(new THREE.BoxGeometry(o.w,o.h,.006),mat)}else{m=new THREE.Mesh(new THREE.CylinderGeometry(o.r||.0062,(o.r||.0062)*1.05,.006,28),mat);m.rotation.x=Math.PI/2}
  m.position.z=.003;m.castShadow=true;m.userData.k=k;g.add(m);
  if(txt){var pl=new THREE.Mesh(new THREE.PlaneGeometry(o.lw||(o.r||.0062)*1.5,o.lh||(o.r||.0062)*1.5),new THREE.MeshBasicMaterial({map:lab(txt,o.tc,o.fs,o.cw,o.ch),transparent:true}));pl.position.z=.0062;g.add(pl)}
  btns.push(m);m.userData.g=g;m.userData.mat=mat;return g}
bx(.021,.0045,.004,std({color:0x3a0a0e,roughness:.3}),0,.094,.0105,rem,false);
mkBtn('pw','⏻',.0155,.077,{r:.0088,color:0xc9261c,rough:.25,tc:'#fff',fs:80});
[['1',-.0155,.052],['2',0,.052],['3',.0155,.052],['4',-.0155,.0345],['5',0,.0345],['0',.0155,.0345]].forEach(function(b){mkBtn(b[0],b[0],b[1],b[2],{r:.0062,fs:78})});
var ring=new THREE.Mesh(new THREE.CylinderGeometry(.029,.029,.003,40),std({color:0x101013,roughness:.6}));ring.rotation.x=Math.PI/2;ring.position.set(0,-.004,.0128);rem.add(ring);
mkBtn('up','▲',0,.0175,{w:.015,h:.012,lw:.012,lh:.012,fs:70});mkBtn('dn','▼',0,-.0255,{w:.015,h:.012,lw:.012,lh:.012,fs:70});mkBtn('lf','◀',-.0215,-.004,{w:.012,h:.015,lw:.012,lh:.012,fs:70});mkBtn('rt','▶',.0215,-.004,{w:.012,h:.015,lw:.012,lh:.012,fs:70});
mkBtn('ok','OK',0,-.004,{r:.0092,color:0xe3a82a,rough:.35,tc:'#2a1a00',fs:62});
mkBtn('menu','MENU',-.0125,-.053,{w:.022,h:.0095,lw:.02,lh:.008,fs:44,cw:256,ch:100});mkBtn('back','BACK',.0125,-.053,{w:.022,h:.0095,lw:.02,lh:.008,fs:44,cw:256,ch:100});
for(var i=0;i<6;i++)mkBtn('x',null,-.016+(i%3)*.016,-.07-Math.floor(i/3)*.012,{w:.012,h:.007,color:0x2a2a30});btns=btns.filter(function(b){return b.userData.k!=='x'});
var brA=cvx(256,48),brx=brA[1];brx.fillStyle='#888';brx.font='700 22px "IBM Plex Mono",monospace';brx.textAlign='center';brx.fillText('P R O T A S I',128,34);
var brP=new THREE.Mesh(new THREE.PlaneGeometry(.038,.007),new THREE.MeshBasicMaterial({map:mkT(brA[0]),transparent:true}));brP.position.set(0,-.093,.0125);rem.add(brP);

/* ============ scherm-inhoud ============ */
var power=false,booting=false,bootLines=[],level=0,sel=[0,0],menuKey='werk',busy=false,on=false,bootTimer=0,uOn=0,uOnT=0,glitch=0,zoomK=0,zoomT=0,afterZoom=null,leftover=null;
function items(){return level===0?MAIN.map(function(m){return {n:m.n,t:T(m.t),s:T(m.s)}}):SUB[menuKey].map(function(p,i){return {n:('0'+(i+1)).slice(-2),t:p[0],s:T(p[1])}})}
function drawScreen(){
  var W=1024,H=768,x=scx;x.clearRect(0,0,W,H);var g=x.createRadialGradient(W/2,H*.45,60,W/2,H/2,W*.75);g.addColorStop(0,'#3a72c8');g.addColorStop(.6,'#2a5aa8');g.addColorStop(1,'#1c427f');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.textBaseline='alphabetic';x.shadowColor='rgba(150,200,255,.9)';x.shadowBlur=10;x.textAlign='left';
  var F='"IBM Plex Mono","Courier New",monospace';
  if(!power){scTex.needsUpdate=true;return}
  if(booting){x.fillStyle='#e8f2ff';x.font='500 38px '+F;bootLines.forEach(function(l,i){x.fillText(l,110,150+i*54)});scTex.needsUpdate=true;return}
  x.fillStyle='#a9d4ff';x.font='500 34px '+F;x.fillText(level===0?'DYLAN PROTASI // PORTFOLIO_INDEX':'PORTFOLIO_INDEX / '+T(MAIN[menuKey==='werk'?0:1].t),110,138);
  var it=items(),y0=222,lh=78;
  it.forEach(function(r,i){var y=y0+i*lh,on=i===sel[level];if(on){x.shadowBlur=0;x.fillStyle='rgba(180,215,255,.22)';x.fillRect(92,y-48,840,70);x.fillStyle='#ffd36b';x.fillRect(92,y-48,8,70);x.shadowBlur=10;x.shadowColor='rgba(150,200,255,.9)'}
    x.fillStyle=on?'#ffffff':'#a9bddb';x.font=(on?'600 ':'400 ')+'44px '+F;x.fillText((on?'> ':'  ')+r.n+': '+r.t,112,y)});
  x.fillStyle='#d3e6ff';x.font='400 32px '+F;x.fillText(it[sel[level]].s,134,y0+it.length*lh+22);
  x.fillStyle='#7f9cc7';x.font='400 26px '+F;x.fillText('▲▼ '+T(['kies','select'])+'   OK '+T(['open','open'])+(level?'   BACK '+T(['terug','back']):''),110,690);
  scTex.needsUpdate=true;
}
function setHint(){hintEl.textContent=T(['Druk op ⏻ op de afstandsbediening','Press ⏻ on the remote']);hintEl.classList.toggle('hide',power)}
function turnOn(){if(power)return;power=true;booting=true;uOnT=1;tvLed.material.color.set(0xff3b30);tvLed.material.color.multiplyScalar(2);setHint();
  var L=['DYLAN_OS v1.0',T(['Geheugen controleren... OK','Checking memory... OK']),T(['Portfolio laden... 8 projecten','Loading portfolio... 8 projects']),'> start menu'],i=0;bootLines=[];drawScreen();
  setTimeout(function nx(){if(!booting)return;if(i<L.length){bootLines.push(L[i++]);drawScreen();bootTimer=setTimeout(nx,380)}else{bootTimer=setTimeout(function(){booting=false;drawScreen()},400)}},600)}
function turnOff(){power=false;booting=false;clearTimeout(bootTimer);uOnT=0;tvLed.material.color.set(0x330606);level=0;setHint();drawScreen()}
function flick(){glitch=1;kb1.rotation.z=-(sel[level]*.7+level*1.4);kb2.rotation.z=sel[level]*.5;var n=items().length;sld.position.y=-.16-(n>1?sel[level]/(n-1):0)*.07}
function pressK(k){
  if(busy)return;if(k==='pw'){power?turnOff():turnOn();return}
  if(!power)return;if(booting){clearTimeout(bootTimer);booting=false;drawScreen();return}
  var n=items().length;
  if(k==='up'){sel[level]=(sel[level]+n-1)%n;flick();drawScreen()}
  else if(k==='dn'){sel[level]=(sel[level]+1)%n;flick();drawScreen()}
  else if(k==='ok'||k==='rt'){openItem(sel[level])}
  else if(k==='back'||k==='lf'){if(level){level=0;flick();drawScreen()}}
  else if(k==='menu'||k==='0'){level=0;flick();drawScreen()}
  else if(/^[1-9]$/.test(k)){var i=+k-1;if(i<n){sel[level]=i;flick();drawScreen();openItem(i)}}
}
function openItem(i){if(level===0){var m=MAIN[i];if(m.sub){level=1;menuKey=m.sub;sel[1]=0;flick();drawScreen();return}goTo(m.go)}else goTo(SUB[menuKey][i][2])}
function goTo(h){busy=true;zoomT=1;afterZoom=h;setTimeout(function(){flash.classList.add('on')},720)}

/* ============ camera ============ */
var port=false,mx=0,my=0,hov=null,pmx=0,pmy=0;
var composer,bloom,finalPass;
function size(){var w=root.clientWidth||innerWidth,h=root.clientHeight||innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;port=cam.aspect<.9;cam.fov=port?58:48;cam.updateProjectionMatrix();if(composer){composer.setSize(w,h);bloom.resolution.set(w/2,h/2);finalPass.uniforms.uRes.value.set(w,h)}
  var ht=Math.tan(cam.fov*Math.PI/360)*.5,hw=ht*cam.aspect;rem.position.set(port?Math.min(hw*.3,.06):Math.min(hw*.66,.36),-ht*(port?.55:.66),-.5);rem.rotation.set(-.95,port?-.1:-.2,port?.1:.16);var sc=port?1.1:.78;rem.scale.setScalar(sc);remBase.copy(rem.position);}
var remBase=new THREE.Vector3();
function camPose(t,out){
  var dist=port?2.0:1.2,px=port?0:-.02,py=port?1.04:.93,ly=port?.64:.8;
  var bx0=px+mx*(port?.02:.07),by0=py-my*.035+Math.sin(t*.7)*.003;
  var A=new THREE.Vector3(bx0,by0,-1.85+dist),LA=new THREE.Vector3(mx*.04+(port?0:-.06),ly+my*.02,-1.9);
  var halfH=SH/2*1.06,halfW=SW/2*1.05,tn=Math.tan(cam.fov*Math.PI/360),D=Math.max(halfH/tn,halfW/(tn*cam.aspect));
  var Z=new THREE.Vector3(SCX,.79+SCY,-1.85+.05+D),ZL=new THREE.Vector3(SCX,.79+SCY,-1.85);
  var k=zoomK*zoomK*(3-2*zoomK);out.pos.lerpVectors(A,Z,k);out.look.lerpVectors(LA,ZL,k)}
var pose={pos:new THREE.Vector3(),look:new THREE.Vector3()};

/* ============ post-processing ============ */
function initComposer(){
  var w=root.clientWidth||innerWidth,h=root.clientHeight||innerHeight,rt;
  var pars={type:THREE.HalfFloatType,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter};
  try{rt=IS2?new THREE.WebGLMultisampleRenderTarget(w*DPR,h*DPR,pars):new THREE.WebGLRenderTarget(w*DPR,h*DPR,pars);if(IS2)rt.samples=4}catch(e){rt=new THREE.WebGLRenderTarget(w*DPR,h*DPR,pars)}
  composer=new THREE.EffectComposer(renderer,rt);composer.addPass(new THREE.RenderPass(scene,cam));
  bloom=new THREE.UnrealBloomPass(new THREE.Vector2(w/2,h/2),.55,.7,.82);composer.addPass(bloom);
  finalPass=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uRes:{value:new THREE.Vector2(w,h)},uExp:{value:1.25}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 vUv;uniform sampler2D tDiffuse;uniform float uT,uExp;uniform vec2 uRes;vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*uExp;c=aces(c);c=pow(c,vec3(1./2.2));vec2 p=vUv-.5;c*=1.-dot(p,p)*.85;c+=(h(vUv*uRes+fract(uT)*100.)-.5)*.014;gl_FragColor=vec4(c,1.);}'});
  composer.addPass(finalPass);finalPass.renderToScreen=true}

/* ============ interactie ============ */
var rc=new THREE.Raycaster(),ndc=new THREE.Vector2();
function pick(e){var r=cvs.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(ndc,cam);var h=rc.intersectObjects(btns,false);return h.length?h[0].object:null}
function setHover(m){if(hov===m)return;if(hov&&hov.userData.mat)hov.userData.mat.emissive.setHex(0);hov=m;if(m&&m.userData.mat)m.userData.mat.emissive.setHex(0x332a10);cvs.style.cursor=m?'pointer':'default'}
cvs.addEventListener('pointermove',function(e){var r=cvs.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1;if(e.pointerType!=='touch')setHover(pick(e))});
cvs.addEventListener('pointerdown',function(e){var m=pick(e);if(m){press[m.userData.k]=performance.now();pressK(m.userData.k)}});
cvs.addEventListener('pointerleave',function(){setHover(null)});
document.addEventListener('keydown',function(e){
  if(!on)return;var k=e.key,m={ArrowUp:'up',ArrowDown:'dn',ArrowLeft:'lf',ArrowRight:'rt',Enter:'ok',' ':'ok',Escape:'back',Backspace:'back',m:'menu',p:'pw'};
  if(/^[0-9]$/.test(k)){press[k]=performance.now();pressK(k);return}
  if(m[k]){e.preventDefault();var kk=m[k];if(!power&&(k==='Enter'||k===' ')){turnOn();return}press[kk]=performance.now();pressK(kk)}});

/* ============ loop ============ */
var raf=0,last=0,tm=0,t0=performance.now();
function loop(ts){
  raf=requestAnimationFrame(loop);var dt=Math.min(.25,(ts-last)/1000||.016);last=ts;tm+=dt;
  uOn+=(uOnT-uOn)*Math.min(1,dt*(uOnT>uOn?2.4:7));if(Math.abs(uOn-uOnT)<.002)uOn=uOnT;
  glitch*=Math.max(0,1-dt*7);
  scMat.uniforms.uOn.value=uOn;scMat.uniforms.uT.value=tm;scMat.uniforms.uGl.value=glitch;
  scrL.intensity=uOn*(.55+.05*Math.sin(tm*40)+glitch*.4);
  if(Math.abs(zoomK-zoomT)>.001){zoomK+=(zoomT-zoomK)*Math.min(1,dt*(zoomT>zoomK?3.2:3.2));if(zoomT===1&&zoomK>.985&&afterZoom){var h=afterZoom;afterZoom=null;leftover=true;doNav(h)}if(zoomT===0&&zoomK<.01)zoomK=0}
  camPose(tm,pose);cam.position.copy(pose.pos);cam.lookAt(pose.look);
  var rk=1-Math.min(1,zoomK*2.2);rem.visible=rk>.02;rem.scale.setScalar((port?1.1:.78)*rk);
  var now=performance.now();btns.forEach(function(b){var p=press[b.userData.k],g=b.userData.g;var d=p?Math.max(0,1-(now-p)/130):0;g.position.z=.0125-.003*d});
  rem.position.set(remBase.x+Math.sin(tm*.9)*.0012+mx*.006,remBase.y+Math.cos(tm*1.1)*.0012-my*.004,remBase.z);
  if(Math.floor(tm)!==Math.floor(tm-dt)){drawLed();drawVcr()}
  shadeMat.emissiveIntensity=.9+Math.sin(tm*3.1)*.015;
  finalPass.uniforms.uT.value=tm;
  composer.render();
}
function doNav(h){setTimeout(function(){zoomedLeave=true;location.hash=h;if(location.hash===h)sync()},60)}
var zoomedLeave=false;

/* ============ tonen / verbergen ============ */
var crt=document.getElementById('crt'),tvb=document.getElementById('tvbtn');
if(!crt){crt=document.createElement('div');crt.id='crt';document.body.appendChild(crt)}
if(!tvb){tvb=document.createElement('button');tvb.type='button';tvb.id='tvbtn';tvb.textContent='📺 TV-menu';document.body.appendChild(tvb)}
function showRoom(){
  if(on)return;on=true;root.style.display='block';document.body.classList.add('tvr');document.body.classList.remove('tvfull');busy=false;flash.classList.remove('on');size();setHint();drawScreen();
  if(zoomedLeave){zoomK=1;zoomT=0;zoomedLeave=false;glitch=.6}else{zoomK=0;zoomT=0}
  last=performance.now();if(!raf)raf=requestAnimationFrame(loop);
}
function hideRoom(){if(!on)return;on=false;root.style.display='none';document.body.classList.remove('tvr');if(raf){cancelAnimationFrame(raf);raf=0}}
function sync(){var h=location.hash,home=(h===''||h==='#');if(home){showRoom();document.body.classList.remove('tvfull')}else{hideRoom();document.body.classList.add('tvfull')}}
tvb.addEventListener('click',function(){location.hash='';if(location.hash===''&&!on)sync()});
window.addEventListener('hashchange',sync);
window.addEventListener('resize',function(){if(on)size()});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#langsw'))setTimeout(function(){setHint();drawScreen()},60)});

/* ============ opstarten ============ */
initComposer();size();drawLed();drawVcr();drawScreen();
/* reflecties van de kamer vastleggen voor het glas */
glass.visible=false;scr.visible=false;cubeCam.position.set(tv.position.x+SCX,tv.position.y+SCY,tv.position.z+.3);scene.updateMatrixWorld(true);cubeCam.update(renderer,scene);glass.visible=true;scr.visible=true;
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('500 30px "IBM Plex Mono"'),document.fonts.load('700 40px VT323')]).then(function(){drawScreen();drawVcr()}).catch(function(){})}
window.__tv3={press:pressK,get zoom(){return zoomK}};
sync();
})();
