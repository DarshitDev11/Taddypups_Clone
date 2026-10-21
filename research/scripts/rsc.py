import re,json,sys,urllib.request
base='https://puppy.instabizweb.com'
paths={'home':'/','puppies':'/puppies','puppy-copper-male':'/puppies/copper-male','gone-home':'/gone-home','happy-families':'/happy-families','how-it-works':'/how-it-works','faq':'/faq','contact':'/contact'}
for n,p in paths.items():
    s=urllib.request.urlopen(urllib.request.Request(base+p,headers={'User-Agent':'Mozilla/5.0'})).read().decode()
    open(f'../raw/rsc/{n}.html','w').write(s)
    chunks=re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>',s,re.S)
    txt=''
    for c in chunks:
        try: txt+=json.loads('"'+c+'"')
        except Exception: pass
    open(f'../raw/rsc/{n}.rsc.txt','w').write(txt)
    print(n,len(s),len(txt))
