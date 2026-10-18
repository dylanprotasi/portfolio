/* Retro-tv + afstandsbediening: startscherm van het portfolio */
(function(){
function lang(){try{return localStorage.getItem('lang')==='en'?'en':'nl'}catch(e){return 'nl'}}
function T(a){return lang()==='en'?a[1]:a[0]}
function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){}}
var MAIN=[
{n:'01',t:['WERK','WORK'],s:['Stage & opdrachten','Internships & assignments'],sub:'werk'},
{n:'02',t:['FICTIEF WERK','FICTIONAL WORK'],s:['Conceptcampagnes','Concept campaigns'],sub:'fictief'},
{n:'03',t:['PR-OTASI','PR-OTASI'],s:['Perssite & blog','Press site & blog'],go:'#/nieuws'},
{n:'04',t:['OVER MIJ','ABOUT ME'],s:['Wie is Dylan?','Who is Dylan?'],go:'#over'},
{n:'05',t:['CONTACT','CONTACT'],s:['Stuur me een bericht','Send me a message'],go:'#contact'}];
var SUB={
werk:[['KINEPOLIS FILM DISTRIBUTION',['Stage · marketing assistent','Internship · marketing assistant'],'#/kinepolis'],['HAMPTON BAYS',['Stage · Belgisch modemerk','Internship · Belgian fashion brand'],'#/hampton'],['PINKO',['Dagstage · Fashion Masterclass','Day internship · Fashion Masterclass'],'#/pinko'],['DISNEY WINTER VILLAGE',['Bachelorproef · retailconcept','Bachelor thesis · retail concept'],'#/disney'],['MAGAZINE THE FIFTH',['Eindwerk · magazine','Final project · magazine'],'#/fifth']],
fictief:[['RHODE · CHRISTMAS EDIT',['Fictieve campagne','Fictional campaign'],'#/rhode-xmas'],['RHODE · PEPTIDE LIP BOOST',['Fictieve campagne','Fictional campaign'],'#/rhode'],['IOAN · SUN SET 50',['Fictieve campagne','Fictional campaign'],'#/ioan']]};

var room=document.createElement('div');room.id='tvroom';
room.innerHTML='<div class="tvs" id="tvs"><div class="wall"></div><div class="pst p1"><img src="img/bn-rhode-xmas.jpg" alt=""></div><div class="pst p2"><img src="img/bn-kinepolis.jpg" alt=""></div>'
+'<div class="led"><canvas id="tvled" width="360" height="120"></canvas></div>'
+'<div class="rtv"><div class="bz"><div class="rscr" id="tvscr"><div class="rtx" id="tvtx"></div></div></div><div class="pnl"><i class="kb" id="kb1"></i><i class="kb" id="kb2"></i><div class="vent"></div><div class="sld"><b id="tvsl"></b></div><i class="lt" id="tvlt"></i></div></div>'
+'<div class="tbl"></div><div class="vcr"><span class="pb">⏻</span><span class="sl"></span><span class="dp" id="tvdp">--:--</span></div>'
+'<div class="hnt" id="tvhint"></div>'
+'<div class="rem" id="tvrem"><div class="top"><i class="ir"></i><button type="button" class="pw" data-k="pw" aria-label="Aan/uit">⏻</button></div>'
+'<div class="nums"><button type="button" data-k="1">1</button><button type="button" data-k="2">2</button><button type="button" data-k="3">3</button><button type="button" data-k="4">4</button><button type="button" data-k="5">5</button><button type="button" data-k="0">0</button></div>'
+'<div class="dp"><button type="button" class="up" data-k="up" aria-label="Omhoog">▲</button><button type="button" class="lf" data-k="lf" aria-label="Links">◀</button><button type="button" class="ok" data-k="ok">OK</button><button type="button" class="rt" data-k="rt" aria-label="Rechts">▶</button><button type="button" class="dn" data-k="dn" aria-label="Omlaag">▼</button></div>'
+'<div class="row"><button type="button" data-k="menu">MENU</button><button type="button" data-k="back">BACK</button></div><div class="brand">PROTASI</div></div>'
+'</div><div class="tvfl" id="tvfl"></div>';
document.body.appendChild(room);
var crt=document.createElement('div');crt.id='crt';document.body.appendChild(crt);
var tvb=document.createElement('button');tvb.type='button';tvb.id='tvbtn';tvb.textContent='📺 TV-menu';document.body.appendChild(tvb);

var tvs=document.getElementById('tvs'),scr=document.getElementById('tvscr'),tx=document.getElementById('tvtx'),hint=document.getElementById('tvhint'),fl=document.getElementById('tvfl'),sl=document.getElementById('tvsl'),lt=document.getElementById('tvlt');
var power=false,booting=false,level=0,sel=[0,0],menuKey='werk',busy=false,on=false,bootTimer=0;

/* ---- digitale klok ---- */
var DG={0:'01110100011001110101110011000101110',1:'00100011000010000100001000010001110',2:'01110100010000100010001000100011111',3:'11111000100010000010000011000101110',4:'00010001100101010010111110001000010',5:'11111100001111000001000011000101110',6:'00110010001000011110100011000101110',7:'11111000010001000100010000100001000',8:'01110100011000101110100011000101110',9:'01110100011000101111000010001001100'};
var led=document.getElementById('tvled'),lx=led.getContext('2d'),dpEl=document.getElementById('tvdp');
function drawLed(){var d=new Date(),h=('0'+d.getHours()).slice(-2),m=('0'+d.getMinutes()).slice(-2),blink=d.getSeconds()%2===0;
  lx.clearRect(0,0,360,120);var pitch=11.6,r=4.6,ox=(360-(5*4+3*4+3)*pitch)/2+pitch*.5,oy=(120-7*pitch)/2+pitch*.5,str=h+m,x=0;
  for(var i=0;i<4;i++){var g=DG[str[i]];for(var row=0;row<7;row++)for(var c=0;c<5;c++){var lit=g[row*5+c]==='1';dot(ox+(x+c)*pitch,oy+row*pitch,lit)}x+=6;if(i===1){for(var rr=0;rr<7;rr++){dot(ox+(x+1)*pitch,oy+rr*pitch,(rr===2||rr===4)&&blink)}x+=3}}
  dpEl.textContent=h+':'+m;
  function dot(a,b,lit){lx.beginPath();lx.arc(a,b,r,0,6.3);lx.fillStyle=lit?'#f7e57a':'#3a3118';if(lit){lx.shadowColor='#ffd84a';lx.shadowBlur=10}else lx.shadowBlur=0;lx.fill();lx.shadowBlur=0}}
drawLed();setInterval(drawLed,1000);

/* ---- scherm ---- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function items(){return level===0?MAIN.map(function(m){return {n:m.n,t:T(m.t),s:T(m.s)}}):SUB[menuKey].map(function(p,i){return {n:('0'+(i+1)).slice(-2),t:p[0],s:T(p[1])}})}
function render(){
  if(!power||booting)return;
  var it=items(),h='<div class="hd">'+(level===0?'DYLAN PROTASI // PORTFOLIO_INDEX':'PORTFOLIO_INDEX / '+esc(T(MAIN[menuKey==='werk'?0:1].t)))+'</div>';
  it.forEach(function(x,i){h+='<div class="it'+(i===sel[level]?' lit':'')+'"><span class="cu">'+(i===sel[level]?'&gt;':'&nbsp;')+'</span>'+x.n+': '+esc(x.t)+'<small>'+esc(x.s)+'</small></div>'});
  h+='<div class="ft"><span>▲▼ '+T(['kies','select'])+'  OK '+T(['open','open'])+'</span><span>'+(level?'BACK '+T(['terug','back']):'')+'</span></div>';
  tx.innerHTML=h;
  var n=it.length;sl.style.top='';sl.style.left='';var pct=n>1?sel[level]/(n-1):0;if(matchMedia('(max-aspect-ratio:1/1)').matches)sl.style.left=(pct*70)+'%';else sl.style.top=(pct*75)+'%';
}
function flick(){scr.classList.remove('fk');void scr.offsetWidth;scr.classList.add('fk');document.getElementById('kb1').style.transform='rotate('+(sel[level]*40+level*90)+'deg)';document.getElementById('kb2').style.transform='rotate('+(-sel[level]*30)+'deg)'}
function setHint(){hint.textContent=T(['Druk op ⏻ op de afstandsbediening','Press ⏻ on the remote']);hint.classList.toggle('hide',power)}
function turnOn(){
  if(power)return;power=true;booting=true;scr.classList.add('lit');lt.classList.add('lit');setHint();
  var L=['DYLAN_OS v1.0',T(['Geheugen controleren... OK','Checking memory... OK']),T(['Portfolio laden... 8 projecten gevonden','Loading portfolio... 8 projects found']),'> start menu'],i=0;tx.innerHTML='';
  (function nx(){if(!booting)return;if(i<L.length){tx.innerHTML+=esc(L[i++])+'<br>';bootTimer=setTimeout(nx,340)}else{bootTimer=setTimeout(function(){booting=false;render()},380)}})();
}
function turnOff(){power=false;booting=false;clearTimeout(bootTimer);scr.classList.remove('lit');lt.classList.remove('lit');tx.innerHTML='';level=0;setHint()}
function press(k){
  if(busy)return;
  if(k==='pw'){power?turnOff():turnOn();return}
  if(!power){return}
  if(booting){clearTimeout(bootTimer);booting=false;render();return}
  var n=items().length;
  if(k==='up'){sel[level]=(sel[level]+n-1)%n;flick();render()}
  else if(k==='dn'){sel[level]=(sel[level]+1)%n;flick();render()}
  else if(k==='ok'||k==='rt'){open(sel[level])}
  else if(k==='back'||k==='lf'){if(level){level=0;flick();render()}}
  else if(k==='menu'||k==='0'){level=0;flick();render()}
  else if(/^[1-9]$/.test(k)){var i=+k-1;if(i<n){sel[level]=i;flick();render();open(i)}}
}
function open(i){
  if(level===0){var m=MAIN[i];if(m.sub){level=1;menuKey=m.sub;sel[1]=0;flick();render();return}go(m.go)}
  else go(SUB[menuKey][i][2]);
}
function go(h){
  busy=true;var r=scr.getBoundingClientRect(),vw=innerWidth,vh=innerHeight,s=Math.max(vw/r.width,vh/r.height)*1.04,
  sr=tvs.getBoundingClientRect(),ox=r.left+r.width/2-sr.left,oy=r.top+r.height/2-sr.top;
  tvs.style.transformOrigin=ox+'px '+oy+'px';
  tvs.style.transform='translate('+(vw/2-(r.left+r.width/2))+'px,'+(vh/2-(r.top+r.height/2))+'px) scale('+s+')';
  setTimeout(function(){fl.classList.add('lit')},650);
  setTimeout(function(){zoomed={t:tvs.style.transform,o:tvs.style.transformOrigin};location.hash=h;if(location.hash===h)sync()},900);
}
var zoomed=null;
document.getElementById('tvrem').addEventListener('click',function(e){var b=e.target.closest('button');if(b){b.classList.add('pr');setTimeout(function(){b.classList.remove('pr')},120);press(b.getAttribute('data-k'))}});
document.addEventListener('keydown',function(e){
  if(!on)return;var k=e.key,m={ArrowUp:'up',ArrowDown:'dn',ArrowLeft:'lf',ArrowRight:'rt',Enter:'ok',' ':'ok',Escape:'back',Backspace:'back',m:'menu',p:'pw'};
  if(/^[0-9]$/.test(k)){press(k);return}
  if(m[k]){e.preventDefault();if(!power&&(k==='Enter'||k===' ')){turnOn();return}press(m[k])}
});

/* ---- tonen/verbergen ---- */
function showRoom(){
  if(on)return;on=true;room.style.display='flex';document.body.classList.add('tvr');document.body.classList.remove('tvfull');busy=false;fl.classList.remove('lit');setHint();render();
  if(zoomed){tvs.classList.add('nt');tvs.style.transformOrigin=zoomed.o;tvs.style.transform=zoomed.t;void tvs.offsetWidth;tvs.classList.remove('nt');requestAnimationFrame(function(){tvs.style.transform='none';});zoomed=null}else{tvs.style.transform='none'}
}
function hideRoom(){if(!on)return;on=false;room.style.display='none';document.body.classList.remove('tvr')}
function sync(){var h=location.hash,home=(h===''||h==='#');if(home){showRoom()}else{hideRoom();document.body.classList.add('tvfull')}if(home)document.body.classList.remove('tvfull')}
tvb.addEventListener('click',function(){location.hash='';if(location.hash===''&&!on)sync()});
window.addEventListener('hashchange',sync);
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#langsw'))setTimeout(function(){setHint();render()},60)});
sync();
})();
