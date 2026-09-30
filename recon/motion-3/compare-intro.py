# Diff live vs clone intro samples. Usage: python3 compare-intro.py <live.json> <clone.json>
import json, sys
L = json.load(open(sys.argv[1])); C = json.load(open(sys.argv[2]))
TOL = {'lh': 25, 'lv': 8, 'w1y': 1.5, 'w4y': 1.5, 'wLy': 1.5}
worst = []
for p in L:
    l, c = L[p], C.get(p)
    print(f"\n## {p}  live t0 via {l['how']}  clone t0 via {c['how']}  words live/clone {l['words']}/{c['words']}")
    diffc = {k: (l['counts'][k], c['counts'][k]) for k in l['counts'] if l['counts'][k] != c['counts'][k]}
    if diffc: print('  COUNT DIFF (live, clone):', diffc)
    print('  clone first painted frame:', c['firstFrame'])
    for a, b in zip(l['rows'], c['rows']):
        cells = []
        for k in a:
            if k == 'ms' or k not in b: continue
            if l['counts'].get(k.rstrip('oy'), 1) == 0: continue
            d = abs(a[k] - b[k]); tol = TOL.get(k, 0.06)
            flag = '' if d <= tol else ' !'
            if flag: worst.append((p, a['ms'], k, a[k], b[k]))
            cells.append(f"{k} {a[k]:g}/{b[k]:g}{flag}")
        print(f"  {a['ms']:>5}ms  " + '  '.join(cells))
print('\nOUT OF TOLERANCE:', worst if worst else 'none')
