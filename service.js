/* Pages d'activité : galerie alimentée par /data/media.json */
const MAP={'garde-corps-clermont-ferrand':['garde-corps'],'portails-clermont-ferrand':['portails'],'escaliers-clermont-ferrand':['escaliers'],'decoupe-plasma-pliage-clermont-ferrand':['decoupe-plasma','pliage']};
MEDIA.then(m=>{const ks=MAP[location.pathname.split('/').filter(Boolean)[0]];if(!m||!ks)return;
 const im=ks.flatMap(k=>m.activities[k]||[]),ph=document.querySelector('.hero-ph');if(!im.length||!ph)return;
 const t=document.querySelector('h1').textContent;
 ph.outerHTML=`<img class="hero-img" src="${im[0].f}" alt="${t} – photo 1" fetchpriority="high">`+(im.length>1?'<div class="gal">'+im.slice(1).map((x,i)=>`<a href="${x.f}" target="_blank" rel="noopener"><img src="${x.t}" alt="${t} – photo ${i+2}" loading="lazy"></a>`).join('')+'</div>':'')});
