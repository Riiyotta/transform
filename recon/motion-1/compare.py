# Summarise clone vs live samples written by verify.mjs. Usage: python3 compare.py <W> [cloneLabel] [liveLabel]
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
W = sys.argv[1]; cl = sys.argv[2] if len(sys.argv) > 2 else 'clone'; ll = sys.argv[3] if len(sys.argv) > 3 else 'live'
c = json.load(open(f'{D}/{cl}-{W}.json')); l = json.load(open(f'{D}/{ll}-{W}.json'))
def close(a, b):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)): return abs(a - b) <= 0.06 * max(1, abs(b)) or abs(a-b) < 0.6
    return a == b
def eq(a, b): return len(a) == len(b) and all(close(x, y) for x, y in zip(a, b))
res = {}
if 'M3' in c:
    res['M3 settled (89px / 91px)'] = ([c['M3']['at89'], c['M3']['at91']], [l['M3']['at89'], l['M3']['at91']])
    res['M3 down end / up end'] = ([c['M3']['down'][-1][2], c['M3']['up'][-1][2]], [l['M3']['down'][-1][2], l['M3']['up'][-1][2]])
    def t_half(rows, d):
        for r in rows:
            if (r[2] <= 0.5 if d else r[2] >= 0.5): return r[0]
    res['M3 ms to cross .5 (down, up)'] = ([t_half(c['M3']['down'], 1), t_half(c['M3']['up'], 0)], [t_half(l['M3']['down'], 1), t_half(l['M3']['up'], 0)])
if 'M4' in c:
    for k in ['enter', 'leave', 'enterBack', 'leaveBack']:
        res[f'M4 {k} settled'] = (c['M4'][k][-1][2:], l['M4'][k][-1][2:])
if 'M7' in c:
    res['M7 trigger scrollY'] = (c['M7']['points'], l['M7']['points'])
    for k in ['step1', 'step2', 'space', 'spaceBack', 'step2Back', 'step1Back']:
        res[f'M7 {k} settled'] = (c['M7'][k][-1][2:], l['M7'][k][-1][2:])
if 'M8' in c:
    for sel in c['M8']:
        a, b = c['M8'][sel], l['M8'][sel]
        sums = lambda rows: [[p, [sum(map(int, x.split('/'))) for x in s.split()]] for p, s in rows]
        res[f'M8 {sel} range'] = ([round(a['start']), round(a['end'])], [round(b['start']), round(b['end'])])
        res[f'M8 {sel} opaque px per row (_5.._1, both layers) at progress'] = (sums(a['rows']), sums(b['rows']))
        res[f'M8 {sel} opaque px before start'] = ([a['beforeStartOpaque']], [b['beforeStartOpaque']])
if 'M9' in c:
    res['M9 settled samples'] = ([s[3] for s in c['M9']['settled']], [s[3] for s in l['M9']['settled']])
    res['M9 page end'] = (c['M9']['pageEnd'], l['M9']['pageEnd'])
    res['M9 page top'] = (c['M9']['pageTop'], l['M9']['pageTop'])
if 'M18' in c:
    for i, (a, b) in enumerate(zip(c['M18']['cycles'], l['M18']['cycles'])):
        res[f'M18 cycle{i+1} open settled'] = (a['open'][-1][2:], b['open'][-1][2:])
        res[f'M18 cycle{i+1} close settled'] = (a['close'][-1][2:], b['close'][-1][2:])
        res[f'M18/M22 cycle{i+1} scroll lock (wheel while open moved?)'] = ([a['wheelWhileOpen'][1] - a['wheelWhileOpen'][0], a['lock']['htmlOverflow']], [b['wheelWhileOpen'][1] - b['wheelWhileOpen'][0], b['lock']['htmlOverflow']])
if 'M15' in c:
    res['M15 in/out settled'] = ([c['M15']['in'][-1][2:], c['M15']['out'][-1][2:]], [l['M15']['in'][-1][2:], l['M15']['out'][-1][2:]])
if 'M21' in c:
    k = ['loop', 'muted', 'duration', 'paused', 'hasVideo', 'w', 'h']
    res['M21 video'] = ([c['M21'][x] for x in k], [l['M21'][x] for x in k])
if 'M22' in c:
    pick = lambda rows, t: next((r[1] for r in rows if r[0] >= t), rows[-1][1])
    res['M22 wheel 500 -> scrollY at 100/200/400/800ms, final'] = ([pick(c['M22']['wheel'], t) for t in (100, 200, 400, 800)] + [c['M22']['final']], [pick(l['M22']['wheel'], t) for t in (100, 200, 400, 800)] + [l['M22']['final']])
out = {}
for k, (a, b) in res.items():
    ok = eq(a, b) if not (isinstance(a, list) and a and isinstance(a[0], list)) else all(eq(x if isinstance(x, list) else [x], y if isinstance(y, list) else [y]) if not (isinstance(x, list) and x and isinstance(x[1] if len(x) > 1 else None, list)) else eq(x[1], y[1]) for x, y in zip(a, b))
    out[k] = {'clone': a, 'live': b, 'match': ok}
    print('OK ' if ok else 'XX ', k, '\n     C', json.dumps(a)[:300], '\n     L', json.dumps(b)[:300])
json.dump(out, open(f'{D}/summary-{cl}-{W}.json', 'w'), indent=1)
