import re,json,urllib.request,time
base='https://puppy.instabizweb.com'
sm=urllib.request.urlopen(urllib.request.Request(base+'/sitemap.xml',headers={'User-Agent':'Mozilla/5.0'})).read().decode()
slugs=[u.split('/puppies/')[1] for u in re.findall(r'<loc>([^<]*)',sm) if '/puppies/' in u]
print(len(slugs))
def bracket(txt,start):
    depth=0;instr=False;esc=False
    for k in range(start,len(txt)):
        c=txt[k]
        if instr:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c=='"': instr=False
        else:
            if c=='"': instr=True
            elif c in '[{': depth+=1
            elif c in ']}':
                depth-=1
                if depth==0: return k
    return -1
listing=json.load(open('../raw/puppies-rsc-raw.json'))
out=[]
for s in slugs:
    for attempt in range(3):
        try:
            html=urllib.request.urlopen(urllib.request.Request(f'{base}/puppies/{s}',headers={'User-Agent':'Mozilla/5.0'}),timeout=20).read().decode(); http=200
        except urllib.error.HTTPError as e:
            html=e.read().decode(); http=e.code
        except Exception as e:
            html='';http=0;time.sleep(2)
        if http==200: break
        time.sleep(1)
    if not html: print('FAILED',s); continue
    chunks=re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>',html,re.S)
    t=''
    for c in chunks:
        try: t+=json.loads('"'+c+'"')
        except: pass
    clean=re.sub(r'data:image/[a-z]+;base64,[A-Za-z0-9+/=]+','B64',t)
    open(f'../raw/rsc/puppy-{s}.clean.txt','w').write(clean)
    i=t.find('"media":[')
    media=[]
    if i>=0:
        j=i+len('"media":')
        k=bracket(t,j)
        media=json.loads(t[j:k+1])
        for m in media:
            m.pop('blurDataUrl',None)
            if m.get('poster'): m['poster'].pop('blurDataUrl',None)
            m['url']=base+m['url']
            if m.get('poster'): m['poster']['url']=base+m['poster']['url']
    def g(pat):
        m=re.search(pat,clean); return m.group(1) if m else None
    h1=g(r'"h1",null,\{"className":"font-plush[^"]*","children":"([^"]*)"') or g(r'"name":"([^"]*)","media"')
    breed=g(r'"className":"mt-2 text-lg font-semibold text-cocoa-soft","children":"([^"]*)"')
    dl={}
    for dt,dd in re.findall(r'"dt",null,\{"className":"[^"]*","children":"([^"]*)"\}\],\["\$","dd",null,\{"className":"[^"]*","children":"([^"]*)"',clean):
        dl[dt]=dd
    chip=g(r'"className":"chip","children":\[.*?\}\],"([A-Za-z ]+)"\]\}') or ('Gone home' if 'Gone home ♥' in clean else None)
    gone=('Gone home ♥' in clean)
    title=g(r'"title","0",\{"children":"([^"]*)"')
    desc=g(r'"name":"description","content":"([^"]*)"')
    chip=chip or ('Available' if s in listing else None)
    rec={'http':http,'gone':gone,'slug':s,'url':f'{base}/puppies/{s}','name':h1,'breedLabel':breed,'details':dl,'statusChip':chip,'metaTitle':title,'metaDescription':desc,'media':media}
    if s in listing:
        L=listing[s]; rec['listing']={k:L[k] for k in('id','displayName','gender','genderLabel','age','colour','status','featured','origin','breeds','collections') if k in L}
    out.append(rec)
    print(s,h1,breed,dl,chip,len(media))
    time.sleep(0.3)
json.dump(out,open('../puppies.json','w'),indent=1)
