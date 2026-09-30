# Cross-viewport compact table: for each class-combo on a page print rect + key styles at 1440/1024/768/390.
import json,sys
fam,name=sys.argv[1],sys.argv[2]
flt=sys.argv[3] if len(sys.argv)>3 else ''
V=[1440,1024,768,390]
D={w:json.load(open(f'{fam}/measure/{name}-{w}.json')) for w in V}
keys=list(D[1440]['combos'].keys())
for w in V:
    for k in D[w]['combos']:
        if k not in keys: keys.append(k)
KP=['display','font-size','line-height','color','background-color','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-bottom','margin-left','row-gap','column-gap','border-top','border-left','border-bottom','border-right','opacity','max-width','flex-direction','grid-template-columns','position','top','transform','white-space','text-decoration-line','list-style-type','font-style','background-size','background-position']
out=[]
for k in keys:
    if flt and flt not in k: continue
    row=[f'## {k}']
    for w in V:
        c=D[w]['combos'].get(k)
        if not c: row.append(f'  {w}: -'); continue
        st=c['style']
        s={p:st[p] for p in KP if p in st}
        DEFV={'background-color':'rgba(0, 0, 0, 0)','max-width':'none','flex-direction':'row','position':'static','top':'auto','list-style-type':'disc','background-size':'auto','background-position':'0% 0%','display':'block','font-style':'normal'}
        s={p:v for p,v in s.items() if DEFV.get(p)!=v}
        if not c['text'] and not k.startswith('RICH'):
            for p in ['font-size','line-height','color']: s.pop(p,None)
        if 'font-size' in s and st.get('font-family','').startswith('"Polysans'): pass
        row.append(f'  {w}: n={c["count"]} rect={c["rect"]} '+' '.join(f'{p}={v}' for p,v in s.items()) + (f' ff={st.get("font-family")[:30]}' if w==1440 and 'font-family' in st else '') + (f' "{c["text"][:40]}"' if w==1440 and c['text'] else ''))
    out.append('\n'.join(row))
print('\n'.join(out))
