window.m2sToast=function(h){let t=document.getElementById('m2stoast');if(!t){t=document.createElement('div');t.id='m2stoast';t.setAttribute('role','status');document.documentElement.appendChild(t)}clearTimeout(t._h);t.innerHTML='<i>✦</i>'+h;t.classList.add('on');t._h=setTimeout(()=>t.classList.remove('on'),4200)};
window.MEDIA=fetch('/data/media.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null);
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;function observe(){document.querySelectorAll('.rv:not(.in)').forEach(e=>io?io.observe(e):e.classList.add('in'))}observe();const pg=document.getElementById('prog'),hd=document.querySelector('header');function sc(){const m=document.documentElement.scrollHeight-innerHeight;pg.style.width=(m>0?scrollY/m*100:0)+'%';hd.classList.toggle('sc',scrollY>8)}addEventListener('scroll',sc,{passive:true});sc();(function(){const h=document.querySelector('header'),b=h&&h.querySelector('.burger');if(!b)return;const set=o=>{h.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')};b.onclick=()=>set(!h.classList.contains('open'));h.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>set(false)));addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});matchMedia('(min-width:861px)').addEventListener('change',()=>set(false))})();
/* Effet « soudure » : maintenir le clic (ou appui long) et glisser. Étincelles + cordon qui refroidit puis disparaît. */
(function(){
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const cv=document.createElement('canvas');cv.id='weld';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
const ctx=cv.getContext('2d');let W,H;
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
size();addEventListener('resize',size);
const SKIP='a,button,input,select,textarea,summary,label,video,.modal,.burger';
let down=false,on=false,touch=false,px=0,py=0,sx=0,sy=0,lx=null,ly=0,timer=0,raf=0,last=0;
const stamps=[],sparks=[],LIFE=3400;
const KEYS=[[0,[254,243,226]],[.35,[244,174,82]],[.9,[212,98,26]],[1.7,[84,52,38]],[2.4,[80,80,86]]];
function color(a){for(let i=1;i<KEYS.length;i++){if(a<=KEYS[i][0]){const k0=KEYS[i-1],k1=KEYS[i],f=(a-k0[0])/(k1[0]-k0[0]);return k0[1].map((v,j)=>Math.round(v+(k1[1][j]-v)*f))}}return KEYS[KEYS.length-1][1]}
function addPoint(first){
  const X=px,Y=py+scrollY,t=performance.now();
  if(first||lx===null){lx=X;ly=Y;stamps.push({x:X,y:Y,t,r:5});return}
  const d=Math.hypot(X-lx,Y-ly);if(d<5)return;const n=Math.floor(d/5);
  for(let i=1;i<=n;i++){const f=i/n;stamps.push({x:lx+(X-lx)*f,y:ly+(Y-ly)*f,t,r:4.3+Math.random()*1.7})}
  lx=X;ly=Y}
function start(){on=true;document.body.classList.add('weld-on');const s=getSelection();s&&s.removeAllRanges();addPoint(true);kick()}
let firstW=true;function stop(){if(on&&firstW){firstW=false;setTimeout(()=>window.m2sToast&&m2sToast('<b>Première soudure</b> réussie : bravo, vous avez la main !'),300)}down=false;on=false;lx=null;clearTimeout(timer);document.body.classList.remove('weld-on')}
addEventListener('pointerdown',e=>{
  if(e.button!==0||e.ctrlKey||(e.target.closest&&e.target.closest(SKIP)))return;
  down=true;touch=e.pointerType==='touch';px=sx=e.clientX;py=sy=e.clientY;on=false;
  clearTimeout(timer);timer=setTimeout(()=>{if(down&&!on)start()},touch?320:140)});
addEventListener('pointermove',e=>{
  if(!down)return;px=e.clientX;py=e.clientY;
  if(!on){if(!touch&&Math.hypot(px-sx,py-sy)>5)start();return}
  addPoint()});
['pointerup','pointercancel','blur'].forEach(ev=>addEventListener(ev,stop));
addEventListener('scroll',()=>{if(on)addPoint()},{passive:true});
addEventListener('touchmove',e=>{if(on)e.preventDefault()},{passive:false});
addEventListener('contextmenu',e=>{if(down)e.preventDefault()});
addEventListener('dragstart',e=>{if(down)e.preventDefault()});
function spark(){
  const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.7,v=2+Math.random()*7.5;
  sparks.push({x:px,y:py,ox:px,oy:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,age:0,max:.45+Math.random()*.8,w:.8+Math.random()*1.5,fy:py+20+Math.random()*90,b:0})}
function drawBead(now){
  for(const s of stamps){
    const age=(now-s.t)/1000;if(age<0)continue;
    const c=color(age),al=age<2.4?1:Math.max(0,1-(age-2.4)/1);
    if(age<.6){const g=ctx.createRadialGradient(s.x,s.y-scrollY,0,s.x,s.y-scrollY,s.r*4.5);
      g.addColorStop(0,`rgba(244,174,82,${.38*(1-age/.6)*al})`);g.addColorStop(1,'rgba(212,98,26,0)');
      ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y-scrollY,s.r*4.5,0,6.3);ctx.fill();ctx.globalCompositeOperation='source-over'}
    ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${al})`;ctx.beginPath();ctx.arc(s.x,s.y-scrollY,s.r,0,6.3);ctx.fill();
    if(age>.5){ctx.strokeStyle=`rgba(255,255,255,${Math.min(.22,(age-.5)*.2)*al})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(s.x,s.y-scrollY,s.r*.7,Math.PI*.95,Math.PI*1.85);ctx.stroke()}
  }}
function drawSparks(dt){
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i];s.age+=dt/60;if(s.age>s.max){sparks.splice(i,1);continue}
    s.ox=s.x;s.oy=s.y;s.vy+=.3*dt;s.vx*=.99;s.x+=s.vx*dt;s.y+=s.vy*dt;
    if(s.y>s.fy&&s.vy>0&&s.b<2){s.vy*=-.38;s.vx*=.75;s.b++;s.y=s.fy}
    const r=s.age/s.max,col=r<.25?'254,243,226':r<.55?'244,174,82':r<.8?'232,143,52':'212,98,26';
    ctx.strokeStyle=`rgba(${col},${(1-r*r)*(.65+Math.random()*.35)})`;ctx.lineWidth=s.w;
    ctx.beginPath();ctx.moveTo(s.ox,s.oy);ctx.lineTo(s.x,s.y);ctx.stroke()}
  ctx.globalCompositeOperation='source-over'}
function drawGlow(){
  const f=.8+Math.random()*.3,g=ctx.createRadialGradient(px,py,0,px,py,46*f);
  g.addColorStop(0,'rgba(255,252,240,.95)');g.addColorStop(.12,'rgba(244,174,82,.6)');g.addColorStop(.4,'rgba(212,98,26,.22)');g.addColorStop(1,'rgba(212,98,26,0)');
  ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,46*f,0,6.3);ctx.fill();
  ctx.fillStyle='rgba(200,225,255,.9)';ctx.beginPath();ctx.arc(px,py,2.6*f,0,6.3);ctx.fill();ctx.globalCompositeOperation='source-over'}
function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
function tick(now){
  raf=0;const dt=Math.min(3,(now-last)/16.67);last=now;ctx.clearRect(0,0,W,H);
  const t=performance.now();while(stamps.length&&t-stamps[0].t>LIFE)stamps.shift();
  if(on)for(let i=0;i<7;i++)spark();
  drawBead(t);drawSparks(dt);if(on)drawGlow();
  if(on||stamps.length||sparks.length)raf=requestAnimationFrame(tick)}
})();

/* Effet « découpe plasma » : Ctrl + clic droit maintenu, on trace ; en fermant une forme, ce morceau de page tombe puis revient. */
(function(){
if(matchMedia('(prefers-reduced-motion:reduce)').matches||!matchMedia('(pointer:fine)').matches)return;
const root=document.documentElement,body=document.body;
const cv=document.createElement('canvas');cv.id='cutfx';cv.setAttribute('aria-hidden','true');root.appendChild(cv);
const ctx=cv.getContext('2d');let W,H;
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
size();addEventListener('resize',size);
const MIN=2500,LIFE=2300,HOLD=3200;
let armed=false,cutting=false,busy=false,pts=[],tip=null,raf=0,last=0,mute=0;
const trails=[],sparks=[],flashes=[];
const area=p=>{let s=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];s+=a.x*b.y-b.x*a.y}return Math.abs(s/2)};
function inter(p1,p2,p3,p4){const d=(p2.x-p1.x)*(p4.y-p3.y)-(p2.y-p1.y)*(p4.x-p3.x);if(!d)return null;
  const t=((p3.x-p1.x)*(p4.y-p3.y)-(p3.y-p1.y)*(p4.x-p3.x))/d,u=((p3.x-p1.x)*(p2.y-p1.y)-(p3.y-p1.y)*(p2.x-p1.x))/d;
  return t>=0&&t<=1&&u>=0&&u<=1?{x:p1.x+t*(p2.x-p1.x),y:p1.y+t*(p2.y-p1.y)}:null}
function endCut(){cutting=false;body.classList.remove('cut-on');mute=performance.now()+500}
let firstC=true;function closeShape(poly){endCut();flashes.push({poly,t:performance.now()});if(firstC){firstC=false;setTimeout(()=>window.m2sToast&&m2sToast('<b>Première découpe</b> validée : nette et précise, bravo !'),900)}drop(poly)}
function check(){const n=pts.length;if(n<6)return;const a=pts[n-2],b=pts[n-1];
  for(let i=0;i<n-3;i++){const ip=inter(pts[i],pts[i+1],a,b);if(ip){const poly=[ip,...pts.slice(i+1,n-1)];if(area(poly)>=MIN){closeShape(poly);return}}}
  const s=pts[0];if(n>14&&Math.hypot(b.x-s.x,b.y-s.y)<16&&area(pts)>=MIN)closeShape(pts.slice())}
function addPt(x,y){const l=pts[pts.length-1];if(Math.hypot(x-l.x,y-l.y)<3)return;pts.push({x,y,t:performance.now()});check()}
addEventListener('pointerdown',e=>{
  if(busy||e.button!==0||!e.ctrlKey)return;e.preventDefault();
  cutting=armed=true;tip={x:e.clientX,y:e.clientY};pts=[{x:tip.x,y:tip.y,t:performance.now()}];trails.push(pts);body.classList.add('cut-on');const s=getSelection();s&&s.removeAllRanges();kick()},true);
addEventListener('pointermove',e=>{if(!cutting)return;if(!(e.buttons&3)||!e.ctrlKey){endCut();return}tip={x:e.clientX,y:e.clientY};addPt(tip.x,tip.y)},true);
['pointerup','pointercancel','blur'].forEach(ev=>addEventListener(ev,()=>{if(cutting)endCut();if(armed){armed=false;mute=performance.now()+400}},true));
addEventListener('contextmenu',e=>{if(cutting||performance.now()<mute||(busy&&e.ctrlKey))e.preventDefault()},true);
addEventListener('click',e=>{if(cutting||armed||performance.now()<mute){e.preventDefault();e.stopPropagation()}},true);
addEventListener('dragstart',e=>{if(cutting)e.preventDefault()},true);
/* --- le morceau de page qui tombe --- */
function drop(poly){
  busy=true;const sy=scrollY,Wd=root.clientWidth,D=root.scrollHeight;
  const piece=document.createElement('div');piece.className='cutpiece';
  const clip=document.createElement('div');clip.className='cutclip';clip.style.clipPath='polygon('+poly.map(p=>p.x.toFixed(1)+'px '+p.y.toFixed(1)+'px').join(',')+')';
  const wrap=document.createElement('div');wrap.className='cutwrap';const cs=getComputedStyle(body);
  Object.assign(wrap.style,{width:Wd+'px',top:-sy+'px',fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,color:cs.color,backgroundColor:cs.backgroundColor});
  body.childNodes.forEach(n=>{if(n.nodeType===1)wrap.appendChild(n.cloneNode(true))});
  wrap.querySelectorAll('script,.modal,#prog,canvas').forEach(e=>e.remove());wrap.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  const hd=wrap.querySelector('header');if(hd){hd.style.position='absolute';hd.style.top=sy+'px';hd.style.left='0';hd.style.right='0'}
  clip.appendChild(wrap);piece.appendChild(clip);root.appendChild(piece);
  const hole='M0 0H'+Wd+'V'+D+'H0Z M'+poly.map(p=>p.x.toFixed(1)+' '+(p.y+sy).toFixed(1)).join(' L')+' Z';
  body.style.clipPath="path(evenodd,'"+hole+"')";root.style.background='#000';
  const cx=poly.reduce((s,p)=>s+p.x,0)/poly.length,cy=poly.reduce((s,p)=>s+p.y,0)/poly.length;
  const dir=Math.random()<.5?-1:1,rot=dir*(16+Math.random()*28),dx=dir*(30+Math.random()*110);
  piece.style.transformOrigin=cx+'px '+cy+'px';
  piece.animate([{transform:'translate(0,0) rotate(0deg)',easing:'ease-out'},{transform:`translate(${dx*.08}px,${H*.03}px) rotate(${rot*.14}deg)`,offset:.18,easing:'cubic-bezier(.5,0,1,.55)'},{transform:`translate(${dx}px,${H*1.5}px) rotate(${rot}deg)`}],{duration:1500,fill:'forwards'});
  setTimeout(()=>{
    const dy=sy-scrollY;
    const back=piece.animate([{transform:`translate(${dx}px,${H*1.5}px) rotate(${rot}deg)`},{transform:`translate(0px,${dy}px) rotate(0deg)`}],{duration:800,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
    back.onfinish=()=>{piece.remove();body.style.clipPath='';root.style.background='';busy=false}},HOLD)}
/* --- rendu : arc plasma, entaille, étincelles --- */
const seg=(a,b)=>{ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()};
function drawTrails(now){
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='lighter';
  for(const tr of trails)for(let i=1;i<tr.length;i++){
    const a=tr[i-1],b=tr[i],age=(now-b.t)/1000,hot=Math.max(0,1-age/.4),cool=Math.max(0,1-age/(LIFE/1000));if(cool<=0)continue;
    if(hot>0){ctx.strokeStyle=`rgba(90,170,255,${.35*hot})`;ctx.lineWidth=11;seg(a,b);ctx.strokeStyle=`rgba(255,255,255,${.95*hot})`;ctx.lineWidth=2.6;seg(a,b)}
    ctx.strokeStyle=`rgba(212,98,26,${.55*cool*(1-hot*.5)})`;ctx.lineWidth=1.6;seg(a,b)}
  for(const f of flashes){const al=1-(now-f.t)/500;if(al<=0)continue;ctx.strokeStyle=`rgba(170,215,255,${al})`;ctx.lineWidth=3;ctx.beginPath();f.poly.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke()}
  ctx.globalCompositeOperation='source-over'}
function spark(){const a=Math.PI/2+(Math.random()-.5)*Math.PI*1.3,v=2+Math.random()*6;
  sparks.push({x:tip.x,y:tip.y,ox:tip.x,oy:tip.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,age:0,max:.4+Math.random()*.7,w:.8+Math.random()*1.4})}
function drawSparks(dt){ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
  for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.age+=dt/60;if(s.age>s.max){sparks.splice(i,1);continue}
    s.ox=s.x;s.oy=s.y;s.vy+=.32*dt;s.vx*=.99;s.x+=s.vx*dt;s.y+=s.vy*dt;
    const r=s.age/s.max,c=r<.25?'254,243,226':r<.55?'244,174,82':r<.8?'232,143,52':'212,98,26';
    ctx.strokeStyle=`rgba(${c},${(1-r*r)*(.6+Math.random()*.4)})`;ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.ox,s.oy);ctx.lineTo(s.x,s.y);ctx.stroke()}
  ctx.globalCompositeOperation='source-over'}
function drawTip(){const f=.85+Math.random()*.25,g=ctx.createRadialGradient(tip.x,tip.y,0,tip.x,tip.y,44*f);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.14,'rgba(170,215,255,.75)');g.addColorStop(.45,'rgba(80,140,255,.25)');g.addColorStop(1,'rgba(60,100,255,0)');
  ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(tip.x,tip.y,44*f,0,6.3);ctx.fill();ctx.globalCompositeOperation='source-over'}
function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
function tick(now){raf=0;const t=performance.now(),dt=Math.min(3,(t-last)/16.67);last=t;ctx.clearRect(0,0,W,H);
  while(trails.length&&t-trails[0][trails[0].length-1].t>LIFE+100)trails.shift();
  while(flashes.length&&t-flashes[0].t>500)flashes.shift();
  if(cutting)for(let i=0;i<5;i++)spark();
  drawTrails(t);drawSparks(dt);if(cutting)drawTip();
  if(cutting||trails.length||sparks.length||flashes.length)raf=requestAnimationFrame(tick)}
})();
