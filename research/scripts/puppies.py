import re,json
def extract(txt,key='"puppies":'):
    out=[]
    i=0
    while True:
        i=txt.find(key+'[',i)
        if i<0: break
        j=i+len(key); depth=0; k=j; instr=False; esc=False
        while k<len(txt):
            c=txt[k]
            if instr:
                if esc: esc=False
                elif c=='\\': esc=True
                elif c=='"': instr=False
            else:
                if c=='"': instr=True
                elif c=='[': depth+=1
                elif c==']':
                    depth-=1
                    if depth==0: break
            k+=1
        try: out.append(json.loads(txt[j:k+1]))
        except Exception as e: print('err',e)
        i=k
    return out
allp={}
for n in ['puppies','gone-home','home','puppy-copper-male']:
    t=open(f'../raw/rsc/{n}.rsc.txt').read()
    for arr in extract(t):
        print(n,len(arr), set(p.get('status') for p in arr))
        for p in arr: allp[p['slug']]=p
print(len(allp))
json.dump(allp,open('../raw/puppies-rsc-raw.json','w'),indent=1)
