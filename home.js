/* Accueil : équipe, réalisations, logos, vidéo, alimentés par /data/media.json (dossier photos/ du dépôt GitHub) */
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mq=matchMedia('(max-width:860px),(pointer:coarse)');
const ACTS=[['garde-corps','Garde-corps','Balcons, terrasses, escaliers : garde-corps en acier ou inox, thermolaqués ou galvanisés, fabriqués et posés par M2S.','/garde-corps-clermont-ferrand/'],['portails','Portails','Portails battants ou coulissants, découpés et finis selon vos envies, fabriqués et posés par M2S.','/portails-clermont-ferrand/'],['escaliers','Escaliers','Escaliers droits, hélicoïdaux ou suspendus, conçus sur mesure, fabriqués et posés par M2S.','/escaliers-clermont-ferrand/'],['decoupe-plasma','Découpe plasma','Découpe précise de tôles pour motifs, enseignes et pièces techniques.','/decoupe-plasma-pliage-clermont-ferrand/'],['pliage','Pliage','Pliage de tôle à la demande, de la pièce unique à la petite série.','/decoupe-plasma-pliage-clermont-ferrand/'],['sur-mesure','Objets sur mesure','Mobilier, décoration, structures : si ça se soude, nous le réalisons.',null]];
let ACT=ACTS.map(a=>({y:'Activité',t:a[1],d:a[2],l:a[3],p:[]}));
let WORKS=['Garde-corps','Portail','Escalier','Découpe plasma','Pliage','Sur-mesure','Garde-corps','Portail','Escalier'].map(y=>({y,t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',place:'Clermont-Ferrand',p:[]}));
let TEAM=['Dirigeant','Dessinateur','Poseur','Poseur','Poseur','Soudeur','Soudeur','Soudeur','Soudeur','Soudeur'].map(r=>({n:'Prénom Nom',r,i:''}));
const pic=(u,a)=>`<img src="${u}" alt="${esc(a)}" loading="lazy">`;
const tm=$('team'),wg=document.querySelector('.works'),more=$('more'),M=$('modal');
let shown=0;
/* --- fenêtre carrousel : défilement natif (suit le doigt 1:1, inertie et rebond du système) --- */
const box=M.querySelector('.mbox'),mi=$('mimg'),rm=matchMedia('(prefers-reduced-motion:reduce)');
let LST=WORKS,wi=0,pi=0,last=null,sl=null;
const nn=()=>LST[wi].p.length||4;
function dots(){$('mdots').innerHTML=Array.from({length:nn()},(_,i)=>`<i data-i="${i}" class="${i===pi?'on':''}"></i>`).join('')}
function go(i,smooth){pi=(i+nn())%nn();sl.scrollTo({left:pi*sl.clientWidth,behavior:smooth&&!rm.matches?'smooth':'auto'});dots()}
function render(){const w=LST[wi],n=nn();
 mi.innerHTML='<div class="mslides">'+Array.from({length:n},(_,i)=>w.p.length?`<div><img src="${w.p[i].f}" alt="${esc(w.y+' – '+w.t)}, photo ${i+1}"${i?' loading="lazy"':''} draggable="false"></div>`:`<div>Photo ${i+1} / ${n}</div>`).join('')+'</div>';
 sl=mi.firstChild;sl.addEventListener('scroll',()=>{const k=Math.round(sl.scrollLeft/sl.clientWidth);if(k!==pi&&k>=0&&k<n){pi=k;dots()}},{passive:true});
 $('mtype').textContent=w.y+(w.place?' · '+w.place:'');$('mt').textContent=w.t;$('md').textContent=w.d;$('md').hidden=!w.d;$('mlink').hidden=!w.l;if(w.l)$('mlink').href=w.l;dots()}
function openM(list,i,el){LST=list;wi=i;pi=0;last=el;render();
 const r=el.getBoundingClientRect(),bw=box.offsetWidth,bh=box.offsetHeight;
 box.style.setProperty('--ox',(r.left+r.width/2-(innerWidth-bw)/2)+'px');box.style.setProperty('--oy',(r.top+r.height/2-(innerHeight-bh)/2)+'px');
 M.inert=false;M.classList.add('open');document.body.style.overflow='hidden';M.querySelector('.mx').focus({preventScroll:true})}
function closeM(){if(!M.classList.contains('open'))return;M.classList.remove('open');M.inert=true;document.body.style.overflow='';if(last)last.focus({preventScroll:true})}
M.querySelector('.mx').onclick=closeM;
M.onclick=e=>{if(e.target===M)closeM();if(e.target.tagName==='I')go(+e.target.dataset.i,true)};
M.querySelector('.prev').onclick=()=>go(pi-1,true);M.querySelector('.next').onclick=()=>go(pi+1,true);
addEventListener('keydown',e=>{if(!M.classList.contains('open'))return;
 if(e.key==='Escape')closeM();else if(e.key==='ArrowLeft')go(pi-1,true);else if(e.key==='ArrowRight')go(pi+1,true);
 else if(e.key==='Tab'){const f=[...M.querySelectorAll('button,a[href]')].filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
/* --- rendu des sections --- */
function rTeam(){tm.innerHTML=TEAM.map(t=>`<div class="card rv"><div class="ph tall">${t.i?pic(t.i,t.n+' – '+t.r):'Photo'}</div><h3>${esc(t.n)}</h3><p>${esc(t.r)}</p></div>`).join('')}
const step=()=>mq.matches?3:6;
function lay(){const n=WORKS.length;shown=Math.min(n,Math.max(shown,step()));wg.querySelectorAll('.work').forEach((b,i)=>b.classList.toggle('off',i>=shown));more.hidden=shown>=n}
function rWorks(){wg.innerHTML=WORKS.map((w,i)=>`<button class="work rv" data-i="${i}"><div class="ph">${w.p[0]?pic(w.p[0].t,w.y+' – '+w.t):'Photo'}</div><span>${esc(w.y)}<br><small>${esc(w.t)}${w.place?' · '+esc(w.place):''}</small></span></button>`).join('');
 wg.querySelectorAll('.work').forEach(b=>b.onclick=()=>openM(WORKS,+b.dataset.i,b));lay()}
more.onclick=()=>{const f=shown;shown=Math.min(WORKS.length,shown+step());wg.querySelectorAll('.work').forEach((b,i)=>{if(i>=f&&i<shown){b.classList.remove('off');b.classList.add('in','pop');b.style.animationDelay=(i-f)*.08+'s'}});more.hidden=shown>=WORKS.length};
mq.addEventListener('change',lay);
document.querySelectorAll('#activites .card').forEach((c,i)=>{c.style.cursor='pointer';
 c.insertAdjacentHTML('beforeend','<div class="acts"><button type="button" class="more-link">Voir les photos</button><a class="more-link" href="'+(ACTS[i][3]||'/contact/')+'">'+(ACTS[i][3]?'En savoir plus':'Nous en parler')+' →</a></div>');
 c.onclick=e=>{if(e.target.closest('a'))return;openM(ACT,i,c)}});
document.querySelectorAll('.ar').forEach(b=>b.onclick=()=>tm.scrollBy({left:b.dataset.t*(tm.firstElementChild.offsetWidth+16),behavior:rm.matches?'auto':'smooth'}));
function upd(){const a=document.querySelectorAll('.ar');if(a.length<2)return;a[0].disabled=tm.scrollLeft<4;a[1].disabled=tm.scrollLeft+tm.clientWidth>=tm.scrollWidth-4}
tm.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);
(function(){const g=document.querySelector('#activites .grid');if(!g)return;const cs=[...g.children],d=document.createElement('div');d.className='adots';d.innerHTML=cs.map((_,i)=>`<i data-i="${i}"></i>`).join('');g.after(d);
 const st=()=>cs[0].offsetWidth+16,u=()=>{const k=Math.min(cs.length-1,Math.round(g.scrollLeft/st()));[...d.children].forEach((x,i)=>x.classList.toggle('on',i===k))};
 g.addEventListener('scroll',u,{passive:true});d.onclick=e=>{const i=e.target.dataset&&e.target.dataset.i;if(i!=null)g.scrollTo({left:i*st(),behavior:rm.matches?'auto':'smooth'})};u()})();
rTeam();rWorks();observe();upd();
/* --- contenu venant des dossiers photos/ --- */
MEDIA.then(m=>{if(!m)return;
 if(m.team.length){TEAM=m.team.map(t=>({n:t.name,r:t.role,i:t.img}));rTeam();upd()}
 if(m.realisations.length){WORKS=m.realisations.map(r=>({y:r.type,t:r.title,d:r.description,place:r.place,p:r.images}));shown=0;rWorks()}
 ACTS.forEach((a,i)=>{const p=m.activities[a[0]];if(p&&p.length)ACT[i].p=p;const ph=document.querySelectorAll('#activites .card')[i].querySelector('.ph');if(p&&p.length&&ph)ph.innerHTML=pic(p[0].t,a[1]+' – réalisation M2S')});
 if(m.logos.length){let a=[];while(a.length<12)a=a.concat(m.logos);const s=a.map(l=>`<div class="lg real"><img src="${l.src}" alt="${esc(l.alt)}" loading="lazy"></div>`).join('');document.querySelector('.mtrack').innerHTML=`<div class="mset">${s}</div><div class="mset" aria-hidden="true">${s}</div>`}
 const v=document.querySelector('.hero video');if(m.video&&v){v.src=m.video;v.load();v.play().catch(()=>{})}
 observe()});
