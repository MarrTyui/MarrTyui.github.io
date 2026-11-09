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
const KEYS=[[0,[255,248,220]],[.35,[255,172,62]],[.9,[226,82,26]],[1.7,[84,48,38]],[2.4,[80,80,86]]];
function color(a){for(let i=1;i<KEYS.length;i++){if(a<=KEYS[i][0]){const k0=KEYS[i-1],k1=KEYS[i],f=(a-k0[0])/(k1[0]-k0[0]);return k0[1].map((v,j)=>Math.round(v+(k1[1][j]-v)*f))}}return KEYS[KEYS.length-1][1]}
function addPoint(first){
  const X=px,Y=py+scrollY,t=performance.now();
  if(first||lx===null){lx=X;ly=Y;stamps.push({x:X,y:Y,t,r:5});return}
  const d=Math.hypot(X-lx,Y-ly);if(d<5)return;const n=Math.floor(d/5);
  for(let i=1;i<=n;i++){const f=i/n;stamps.push({x:lx+(X-lx)*f,y:ly+(Y-ly)*f,t,r:4.3+Math.random()*1.7})}
  lx=X;ly=Y}
function start(){on=true;document.body.classList.add('weld-on');const s=getSelection();s&&s.removeAllRanges();addPoint(true);kick()}
function stop(){down=false;on=false;lx=null;clearTimeout(timer);document.body.classList.remove('weld-on')}
addEventListener('pointerdown',e=>{
  if(e.button!==0||(e.target.closest&&e.target.closest(SKIP)))return;
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
      g.addColorStop(0,`rgba(255,190,90,${.38*(1-age/.6)*al})`);g.addColorStop(1,'rgba(255,90,20,0)');
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
    const r=s.age/s.max,col=r<.25?'255,248,214':r<.55?'255,210,74':r<.8?'255,138,42':'224,67,26';
    ctx.strokeStyle=`rgba(${col},${(1-r*r)*(.65+Math.random()*.35)})`;ctx.lineWidth=s.w;
    ctx.beginPath();ctx.moveTo(s.ox,s.oy);ctx.lineTo(s.x,s.y);ctx.stroke()}
  ctx.globalCompositeOperation='source-over'}
function drawGlow(){
  const f=.8+Math.random()*.3,g=ctx.createRadialGradient(px,py,0,px,py,46*f);
  g.addColorStop(0,'rgba(255,252,240,.95)');g.addColorStop(.12,'rgba(255,214,140,.6)');g.addColorStop(.4,'rgba(255,110,30,.22)');g.addColorStop(1,'rgba(255,90,20,0)');
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
