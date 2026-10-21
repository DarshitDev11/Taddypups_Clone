import json,os,urllib.request,concurrent.futures as cf,re
base='https://puppy.instabizweb.com'
R='..'
os.makedirs(f'{R}/assets/puppies',exist_ok=True); os.makedirs(f'{R}/assets/happy-families',exist_ok=True); os.makedirs(f'{R}/assets/brand',exist_ok=True); os.makedirs(f'{R}/assets/videos',exist_ok=True)
jobs=[]  # (url,dest)
puppies=json.load(open(f'{R}/puppies.json'))
for p in puppies:
    for i,m in enumerate(p['media']):
        ext=os.path.splitext(m['url'])[1] or '.jpg'
        if m['kind']=='image':
            jobs.append((m['url'],f"{R}/assets/puppies/{p['slug']}/{i+1:02d}{ext}"))
        else:
            if m.get('poster'): jobs.append((m['poster']['url'],f"{R}/assets/puppies/{p['slug']}/{i+1:02d}-video-poster{os.path.splitext(m['poster']['url'])[1]}"))
            jobs.append((m['url'],f"{R}/assets/videos/{p['slug']}-{i+1:02d}{ext}"))
for i,m in enumerate(json.load(open(f'{R}/happy-families.json'))):
    jobs.append((m['url'],f"{R}/assets/happy-families/{i+1:02d}{os.path.splitext(m['url'])[1]}"))
for u,d in [('/brand/logo.png','brand/logo.png'),('/icon.png','brand/icon.png'),('/apple-icon.png','brand/apple-icon.png'),('/cursor/paw-press.svg','brand/paw-press-cursor.svg'),('/favicon.ico','brand/favicon.ico'),('/robots.txt','brand/robots.txt')]:
    jobs.append((base+u,f'{R}/assets/{d}'))
def dl(j):
    u,d=j
    os.makedirs(os.path.dirname(d),exist_ok=True)
    if os.path.exists(d) and os.path.getsize(d)>0: return (u,d,'cached',os.path.getsize(d))
    for a in range(3):
        try:
            data=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read()
            open(d,'wb').write(data); return (u,d,'ok',len(data))
        except Exception as e: err=str(e)
    return (u,d,'ERR '+err,0)
with cf.ThreadPoolExecutor(6) as ex: res=list(ex.map(dl,jobs))
json.dump([{'url':u,'file':d.replace(R+'/',''),'status':s,'bytes':b} for u,d,s,b in res],open(f'{R}/assets/mapping.json','w'),indent=1)
print(len(res),sum(1 for r in res if r[2].startswith('ERR')),sum(r[3] for r in res)/1e6,'MB')
print([r for r in res if r[2].startswith('ERR')][:5])
big=sorted(res,key=lambda r:-r[3])[:8]; print([(r[1],r[3]) for r in big])
