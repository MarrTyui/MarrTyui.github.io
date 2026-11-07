/* Équipe : remplacer par les vrais noms, rôles et photos */
const TEAM=[['Prénom Nom','Dirigeant'],['Prénom Nom','Dessinateur'],['Prénom Nom','Poseur'],['Prénom Nom','Poseur'],['Prénom Nom','Poseur'],['Prénom Nom','Soudeur'],['Prénom Nom','Soudeur'],['Prénom Nom','Soudeur'],['Prénom Nom','Soudeur'],['Prénom Nom','Soudeur']];
const tm=document.getElementById('team');
tm.innerHTML=TEAM.map(t=>`<div class="card rv"><div class="ph tall" role="img" aria-label="Photo de ${t[0]}">Photo</div><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join('');
document.querySelectorAll('.ar').forEach(b=>b.onclick=()=>tm.scrollBy({left:b.dataset.t*(tm.firstElementChild.offsetWidth+16),behavior:'smooth'}));
/* Réalisations : p = liste d'URL de photos (vide = 4 emplacements) */
const WORKS=[
{y:'Garde-corps',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]},
{y:'Portail',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]},
{y:'Escalier',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]},
{y:'Découpe plasma',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]},
{y:'Pliage',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]},
{y:'Sur-mesure',t:'Titre du chantier',d:'Description du chantier : lieu, ouvrage réalisé, matériaux, durée.',p:[]}
];
const ACT=[{"y": "Activité", "t": "Garde-corps", "d": "Balcons, terrasses, escaliers : garde-corps en acier ou inox, thermolaqués ou galvanisés, fabriqués et posés par M2S.", "p": [], "l": "/garde-corps-clermont-ferrand/"}, {"y": "Activité", "t": "Portails", "d": "Portails battants ou coulissants, découpés et finis selon vos envies, fabriqués et posés par M2S.", "p": [], "l": "/portails-clermont-ferrand/"}, {"y": "Activité", "t": "Escaliers", "d": "Escaliers droits, hélicoïdaux ou suspendus, conçus sur mesure, fabriqués et posés par M2S.", "p": [], "l": "/escaliers-clermont-ferrand/"}, {"y": "Activité", "t": "Découpe plasma", "d": "Découpe précise de tôles pour motifs, enseignes et pièces techniques.", "p": [], "l": "/decoupe-plasma-pliage-clermont-ferrand/"}, {"y": "Activité", "t": "Pliage", "d": "Pliage de tôle à la demande, de la pièce unique à la petite série.", "p": [], "l": "/decoupe-plasma-pliage-clermont-ferrand/"}, {"y": "Activité", "t": "Objets sur mesure", "d": "Mobilier, décoration, structures : si ça se soude, nous le réalisons.", "p": [], "l": null}];
const M=document.getElementById('modal'),$=id=>document.getElementById(id);let wi=0,pi=0,last=null,LST=WORKS;
function show(){const w=LST[wi],n=w.p.length||4;pi=(pi+n)%n;
 $('mimg').innerHTML=w.p.length?`<img src="${w.p[pi]}" alt="${w.y} – ${w.t}, photo ${pi+1}">`:`Photo ${pi+1} / ${n}`;
 $('mdots').innerHTML=Array.from({length:n},(_,i)=>`<i data-i="${i}" class="${i===pi?'on':''}"></i>`).join('');
 $('mtype').textContent=w.y;$('mt').textContent=w.t;$('md').textContent=w.d;$('mlink').hidden=!w.l;if(w.l)$('mlink').href=w.l}
function closeM(){if(M.hidden)return;M.hidden=true;document.body.style.overflow='';if(last)last.focus()}
function openM(list,i,el){LST=list;wi=i;pi=0;last=el;M.hidden=false;document.body.style.overflow='hidden';show();M.querySelector('.mx').focus()}
document.querySelectorAll('.work').forEach(b=>b.onclick=()=>openM(WORKS,+b.dataset.i,b));
document.querySelectorAll('#activites .card').forEach((c,i)=>{c.tabIndex=0;c.setAttribute('role','button');c.style.cursor='pointer';c.onclick=e=>{e.preventDefault();openM(ACT,i,c)};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openM(ACT,i,c)}}});
M.querySelector('.mx').onclick=closeM;
M.onclick=e=>{if(e.target===M)closeM();if(e.target.dataset&&e.target.tagName==='I'){pi=+e.target.dataset.i;show()}};
M.querySelector('.prev').onclick=()=>{pi--;show()};M.querySelector('.next').onclick=()=>{pi++;show()};
addEventListener('keydown',e=>{if(M.hidden)return;if(e.key==='Escape')closeM();if(e.key==='ArrowLeft'){pi--;show()}if(e.key==='ArrowRight'){pi++;show()}});
let sx=0;const st=M.querySelector('.mstage');st.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});st.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){pi+=d<0?1:-1;show()}});
observe();