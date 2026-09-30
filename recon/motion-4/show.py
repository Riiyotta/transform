import json,sys
d=json.load(open(sys.argv[1]))
keys=sys.argv[2:] or [k for k in d if isinstance(d[k],dict)]
for k in keys:
  v=d[k]
  if not isinstance(v,dict): print(k,v); continue
  print('==',k)
  for ph,rows in v.items():
    if isinstance(rows,list):
      for r in rows: print(' ',ph,json.dumps(r,separators=(',',':')))
    else: print(' ',ph,json.dumps(rows,separators=(',',':')))
