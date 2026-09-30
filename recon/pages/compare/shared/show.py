import json,sys,re
# usage: show.py <prefix> <regex on key> [props]
pre=sys.argv[1]; rx=re.compile(sys.argv[2]); W=[1440,1024,768,390]
D={w:{e['key']:e for e in json.load(open(f'{pre}-{w}.json'))['els']} for w in W}
DEF=dict(display='block',position='static',paddingTop='0px',paddingRight='0px',paddingBottom='0px',paddingLeft='0px',marginTop='0px',marginRight='0px',marginBottom='0px',marginLeft='0px',backgroundColor='rgba(0, 0, 0, 0)',backgroundImage='none',opacity='1',transform='none',borderTop='0px none',borderRight='0px none',borderBottom='0px none',borderLeft='0px none',maxWidth='none',minHeight='0px',gap='normal',flexDirection='row',justifyContent='normal',alignItems='normal',gridTemplateColumns='none',textAlign='start',whiteSpace='normal',letterSpacing='normal',fontWeight='400',textTransform='none',boxShadow='none',backdropFilter='none',transition='all',zIndex='auto',overflow='visible',textDecorationLine='none',flexBasis='auto',flexGrow='0',flexShrink='1',minWidth='auto',visibility='visible',cursor='auto',objectFit='fill',listStyleType='disc',animation='none')
SKIP={'top','right','bottom','left','width','height','rowGap','columnGap','gridTemplateRows','fontFamily','backgroundSize','backgroundPosition','borderRadius','count','key','rect','id','text','placeholder','placeholderColor','fontFamily'}
keys=[k for k in dict.fromkeys(k for w in W for k in D[w]) if rx.search(k)]
for k in keys:
  print('##',k, '| count', D[1440].get(k,{}).get('count'), '|', (D[1440].get(k) or D[390].get(k) or {}).get('text','')[:70])
  rows={}
  for w in W:
    e=D[w].get(k)
    if not e: rows.setdefault('MISSING',[]).append(str(w)); continue
    r=e['rect']; rows.setdefault('rect',[]).append(f"{w}:{r['x']},{r['y']} {r['w']}x{r['h']}")
    for p,v in e.items():
      if p in SKIP and not (p in ('top','right','bottom','left') and e.get('position') in ('absolute','fixed','sticky')) : continue
      if p.startswith('border') and isinstance(v,str) and v.startswith('0px'): continue
      if DEF.get(p)==v or (p=='transform' and v in('none','matrix(1, 0, 0, 1, 0, 0)')): continue
      if p=='color' and v=='rgb(2, 8, 1)': pass
      rows.setdefault(p,{})
      rows[p][w]=v
    if e.get('placeholder'): rows.setdefault('placeholder',{})[w]=e['placeholder']+' / '+e.get('placeholderColor','')
  for p,v in rows.items():
    if isinstance(v,list): print('  ',p,' | '.join(v)); continue
    vals=[v.get(w,'-') for w in W]
    if len(set(vals))==1: print('  ',p,'=',vals[0])
    else: print('  ',p,' | '.join(f'{w}:{x}' for w,x in zip(W,vals)))
