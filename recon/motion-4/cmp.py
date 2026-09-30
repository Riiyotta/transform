# Compare live vs clone sample files: numeric max abs diff per key/phase (colours per channel,
# matrices per entry). Usage: python3 cmp.py live.json clone.json
import json,sys,re
L=json.load(open(sys.argv[1])); C=json.load(open(sys.argv[2]))
def nums(v):
    if v is None: return None
    if v=='none': return [1,0,0,1,0,0]
    n=[float(x) for x in re.findall(r'-?\d*\.?\d+(?:e-?\d+)?',str(v))]
    if str(v).startswith('rgb(') : n=n+[1.0]
    return n
worst={}
for k,lv in L.items():
    if not isinstance(lv,dict): print(k,'live',lv,'clone',C.get(k)); continue
    cv=C.get(k,{})
    for ph,lr in lv.items():
        cr=cv.get(ph)
        rows=list(zip(lr,cr)) if isinstance(lr,list) else [(lr,cr)]
        for a,b in rows:
            if not isinstance(a,dict): continue
            if b is None: print('MISSING',k,ph); continue
            for key in a:
                if key=='t': continue
                x,y=nums(a[key]),nums(b.get(key))
                if x is None and y is None: continue
                if x is None or y is None or len(x)!=len(y): print('SHAPE',k,ph,key,a[key],b.get(key)); continue
                d=max(abs(i-j)/(255 if (abs(i)>1.5 or abs(j)>1.5) and 'px' not in str(a[key]) and 'matrix' not in str(a[key]) else 1) for i,j in zip(x,y))
                if d>0.02: print(f'DIFF {k} {ph} t={a.get("t")} {key}: live {a[key]} | clone {b.get(key)}')
                worst[(k,key)]=max(worst.get((k,key),0),d)
print('max normalized diff per (element,prop):')
for (k,key),d in sorted(worst.items()): print(f'  {k}.{key}: {d:.3f}')
