import re,json
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
t=open('../raw/rsc/happy-families.rsc.txt').read()
i=t.find('"photos":[')+len('"photos":')
photos=json.loads(t[i:bracket(t,i)+1])
for p in photos:
    p.pop('blurDataUrl',None); p['url']='https://puppy.instabizweb.com'+p['url']
json.dump(photos,open('../happy-families.json','w'),indent=1)
print(len(photos),sum(1 for p in photos if p['caption']), [p['caption'] for p in photos if p['caption']][:12], set(p['kind'] for p in photos))
