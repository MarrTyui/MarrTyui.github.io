#!/usr/bin/env python3
"""Construit le site : optimise les photos du dossier photos/ et génère data/media.json."""
import json,re,shutil,unicodedata
from pathlib import Path
from PIL import Image,ImageOps
try:
    import pillow_heif;pillow_heif.register_heif_opener()
except Exception:pass
ROOT=Path(__file__).resolve().parent.parent;PH=ROOT/'photos';OUT=ROOT/'_site'
IMG={'.jpg','.jpeg','.png','.webp','.heic','.heif'};VID={'.mp4','.webm','.mov'}
nat=lambda s:[int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)',str(s))]
def safe(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-') or 'x'
def conv(f):
    rel=f.relative_to(PH);b='/'.join(safe(p) for p in rel.parts[:-1])+'/'+safe(rel.stem);b=b.lstrip('/')
    full=OUT/'media'/(b+'.webp');th=OUT/'media'/(b+'.thumb.webp');full.parent.mkdir(parents=True,exist_ok=True)
    try:
        im=ImageOps.exif_transpose(Image.open(f));im=im.convert('RGBA' if ('A' in im.getbands() or im.mode=='P') else 'RGB')
        for p,n,q in((full,1800,80),(th,800,78)):
            c=im.copy();c.thumbnail((n,n));c.save(p,'WEBP',quality=q)
    except Exception as e:
        print('IGNORÉE (image illisible) :',f,e);return None
    return {'f':'/media/'+b+'.webp','t':'/media/'+b+'.thumb.webp'}
ls=lambda d:sorted(d.iterdir(),key=lambda p:nat(p.name)) if d.is_dir() else []
pics=lambda d:[c for c in (conv(f) for f in ls(d) if f.is_file() and f.suffix.lower() in IMG) if c]
def info(d):
    o={};k=None;f=d/'info.txt'
    if f.exists():
        for ln in f.read_text(encoding='utf-8-sig').splitlines():
            m=re.match(r'^\s*(titre|lieu|type|description)\s*:\s*(.*)$',ln,re.I)
            if m:k=m.group(1).lower();o[k]=m.group(2).strip()
            elif k and ln.strip():o[k]+=' '+ln.strip()
    return o
def guess(n):
    n=safe(n)
    for key,v in(('garde','Garde-corps'),('portail','Portail'),('escalier','Escalier'),('plasma','Découpe plasma'),('decoupe','Découpe plasma'),('pliage','Pliage')):
        if key in n:return v
    return 'Réalisation'
if OUT.exists():shutil.rmtree(OUT)
shutil.copytree(ROOT,OUT,ignore=shutil.ignore_patterns('.git','.github','tools','_site','photos','*.md','LISEZ-MOI*'))
M={'video':None,'activities':{},'realisations':[],'team':[],'logos':[]}
for x in ls(PH/'video'):
    if x.suffix.lower() in VID:
        (OUT/'media/video').mkdir(parents=True,exist_ok=True);n=safe(x.stem)+x.suffix.lower()
        shutil.copy2(x,OUT/'media/video'/n);M['video']='/media/video/'+n
        if x.stat().st_size>30e6:print('ATTENTION : vidéo de plus de 30 Mo, pensez à la compresser')
        break
for d in ls(PH/'activites'):
    if d.is_dir():M['activities'][safe(d.name)]=pics(d)
for d in sorted([x for x in ls(PH/'realisations') if x.is_dir()],key=lambda p:nat(p.name),reverse=True):
    p=pics(d)
    if not p:continue
    i=info(d);nm=re.sub(r'^(\d{4}[-_.]\d{2}([-_.]\d{2})?|\d+)[-_.\s]*','',d.name).replace('-',' ').replace('_',' ').strip()
    M['realisations'].append({'id':safe(d.name),'title':i.get('titre') or nm.capitalize() or d.name,'place':i.get('lieu',''),'type':i.get('type') or guess(d.name),'description':i.get('description',''),'images':p})
for f in ls(PH/'equipe'):
    if f.is_file() and f.suffix.lower() in IMG:
        n,_,r=re.sub(r'^\d+[\s._-]+','',f.stem).partition(' - ');c=conv(f)
        if c:M['team'].append({'name':n.strip(),'role':r.strip(),'img':c['t']})
for f in ls(PH/'logos'):
    if f.suffix.lower()=='.svg':
        dst=OUT/'media/logos'/(safe(f.stem)+'.svg');dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dst);M['logos'].append({'src':'/media/logos/'+dst.name,'alt':f.stem})
    elif f.is_file() and f.suffix.lower() in IMG:
        c=conv(f)
        if c:M['logos'].append({'src':c['t'],'alt':f.stem})
(OUT/'data').mkdir(exist_ok=True);(OUT/'data/media.json').write_text(json.dumps(M,ensure_ascii=False),encoding='utf-8')
print('Réalisations :',len(M['realisations']),'| Équipe :',len(M['team']),'| Logos :',len(M['logos']),'| Vidéo :',M['video'] or 'aucune','| Activités :',{k:len(v) for k,v in M['activities'].items()})
