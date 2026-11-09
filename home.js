/* Accueil : équipe, réalisations, logos, vidéo, alimentés par /data/media.json (dossier photos/ du dépôt GitHub) */
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mq=matchMedia('(max-width:860px)');
const ACTS=[['garde-corps','Garde-corps','Balcons, terrasses, escaliers : garde-corps en acier ou inox, thermolaqués ou galvanisés, fabriqués et posés par M2S.','/garde-corps-clermont-ferrand/'],['portails','Portails','Portails battants ou coulissants, découpés et finis selon vos envies, fabriqués et posés par M2S.','/portails-clermont-ferrand/'],['escaliers','Escaliers','Escaliers droits, hélicoïdaux ou suspendus, conçus sur mesure, fabriqués et posés par M2S.','/escaliers-clermont-ferrand/'],['decoupe-plasma','Découpe plasma','Découpe précise de tôles pour motifs, enseignes et pièces techniques.','/decoupe-plasma-pliage-clermont-ferrand/'],['pliage','Pliage','Pliage de tôle à la demande, de la pièce unique à la petite série.','/decoupe-plasma-pliage-clermont-ferrand/'],['sur-mesure','Objets sur mesure','Mobilier, décoration, structures : si ça se soude, nous le réalisons.',null]];
let ACT=ACTS.map(a=>({y:'Activité',t:a[1],d:a[2],l:a[3],p:[]}));
let WORKS=['Garde-corps','Portail','Escalier','Découpe plasma','Pliage','Sur-mesure'].map(y=>({y,t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',place:'Clermont-Ferrand',p:[]}));
let TEAM=['Dirigeant','Dessinateur','Poseur','Poseur','Poseur','Soudeur','Soudeur','Soudeur','Soudeur','Soudeur'].map(r=>({n:'Prénom Nom',r,i:''}));
const pic=(u,a)=>`<img src="${u}" alt="${esc(a)}" loading="lazy">`;
const tm=$('team'),wg=document.querySelector('.works'),more=$('more'),M=$('modal');
let LST=WORKS,wi=0,pi=0,last=null,shown=0;
/* --- fenêtre carrousel --- */
function show(){const w=LST[wi],n=w.p.length||4;pi=(pi+n)%n;
 $('mimg').innerHTML=w.p.length?`<img src="${w.p[pi].f}" alt="${esc(w.y+' – '+w.t)}, photo ${pi+1}">`:`Photo ${pi+1} / ${n}`;
 $('mdots').innerHTML=Array.from({length:n},(_,i)=>`<i data-i="${i}" class="${i===pi?'on':''}"></i>`).join('');
 $('mtype').textContent=w.y+(w.place?' · '+w.place:'');$('mt').textContent=w.t;$('md').textContent=w.d;$('md').hidden=!w.d;$('mlink').hidden=!w.l;if(w.l)$('mlink').href=w.l}
function openM(list,i,el){LST=list;wi=i;pi=0;last=el;M.hidden=false;document.body.style.overflow='hidden';show();M.querySelector('.mx').focus()}
function closeM(){if(M.hidden)return;M.hidden=true;document.body.style.overflow='';if(last)last.focus()}
M.querySelector('.mx').onclick=closeM;
M.onclick=e=>{if(e.target===M)closeM();if(e.target.tagName==='I'){pi=+e.target.dataset.i;show()}};
M.querySelector('.prev').onclick=()=>{pi--;show()};M.querySelector('.next').onclick=()=>{pi++;show()};
addEventListener('keydown',e=>{if(M.hidden)return;if(e.key==='Escape')closeM();if(e.key==='ArrowLeft'){pi--;show()}if(e.key==='ArrowRight'){pi++;show()}});
let sx=0;const st=M.querySelector('.mstage');st.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});st.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){pi+=d<0?1:-1;show()}});
/* --- rendu des sections --- */
function rTeam(){tm.innerHTML=TEAM.map(t=>`<div class="card rv"><div class="ph tall">${t.i?pic(t.i,t.n+' – '+t.r):'Photo'}</div><h3>${esc(t.n)}</h3><p>${esc(t.r)}</p></div>`).join('')}
const step=()=>mq.matches?3:6;
function lay(){const n=WORKS.length;shown=Math.min(n,Math.max(shown,step()));wg.querySelectorAll('.work').forEach((b,i)=>b.classList.toggle('off',i>=shown));more.hidden=shown>=n}
function rWorks(){wg.innerHTML=WORKS.map((w,i)=>`<button class="work rv" data-i="${i}"><div class="ph">${w.p[0]?pic(w.p[0].t,w.y+' – '+w.t):'Photo'}</div><span>${esc(w.y)}<br><small>${esc(w.t)}${w.place?' · '+esc(w.place):''}</small></span></button>`).join('');
 wg.querySelectorAll('.work').forEach(b=>b.onclick=()=>openM(WORKS,+b.dataset.i,b));lay()}
more.onclick=()=>{const f=shown;shown=Math.min(WORKS.length,shown+step());wg.querySelectorAll('.work').forEach((b,i)=>{if(i>=f&&i<shown){b.classList.remove('off');b.classList.add('in','pop');b.style.animationDelay=(i-f)*.08+'s'}});more.hidden=shown>=WORKS.length};
mq.addEventListener('change',lay);
document.querySelectorAll('#activites .card').forEach((c,i)=>{c.tabIndex=0;c.setAttribute('role','button');c.style.cursor='pointer';c.onclick=e=>{e.preventDefault();openM(ACT,i,c)};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openM(ACT,i,c)}}});
document.querySelectorAll('.ar').forEach(b=>b.onclick=()=>tm.scrollBy({left:b.dataset.t*(tm.firstElementChild.offsetWidth+16),behavior:'smooth'}));
rTeam();rWorks();observe();
/* --- contenu venant des dossiers photos/ --- */
MEDIA.then(m=>{if(!m)return;
 if(m.team.length){TEAM=m.team.map(t=>({n:t.name,r:t.role,i:t.img}));rTeam()}
 if(m.realisations.length){WORKS=m.realisations.map(r=>({y:r.type,t:r.title,d:r.description,place:r.place,p:r.images}));shown=0;rWorks()}
 ACTS.forEach((a,i)=>{const p=m.activities[a[0]];if(p&&p.length)ACT[i].p=p;const ph=document.querySelectorAll('#activites .card')[i].querySelector('.ph');if(p&&p.length&&ph)ph.innerHTML=pic(p[0].t,a[1]+' – réalisation M2S')});
 if(m.logos.length){let a=[];while(a.length<12)a=a.concat(m.logos);const s=a.map(l=>`<div class="lg real"><img src="${l.src}" alt="${esc(l.alt)}" loading="lazy"></div>`).join('');document.querySelector('.mtrack').innerHTML=`<div class="mset">${s}</div><div class="mset" aria-hidden="true">${s}</div>`}
 const v=document.querySelector('.hero video');if(m.video&&v){v.src=m.video;v.load();v.play().catch(()=>{})}
 observe()});
