// Usage: node sdiff.mjs live.json clone.json -> probe diffs + flattened dumps for diff.mjs
import fs from 'fs';
const [a, b] = process.argv.slice(2); const L = JSON.parse(fs.readFileSync(a)), C = JSON.parse(fs.readFileSync(b));
const fl = (D) => { const R = {}; for (const w in D) { R[w] = { docH: 0, docW: 0 }; for (const st in D[w]) if (D[w][st].dump) for (const s in D[w][st].dump) R[w][st + '/' + s] = D[w][st].dump[s]; } return R; };
fs.writeFileSync(a.replace('.json', '.flat.json'), JSON.stringify(fl(L))); fs.writeFileSync(b.replace('.json', '.flat.json'), JSON.stringify(fl(C)));
for (const w in L) for (const st in L[w]) { const lp = L[w][st].probe || {}, cp = C[w]?.[st]?.probe || {};
  if (L[w][st].scrollY !== undefined && Math.abs(L[w][st].scrollY - C[w][st].scrollY) > 1) console.log(w, st, 'scrollY', L[w][st].scrollY, C[w][st].scrollY);
  for (const k in lp) { const x = lp[k], y = cp[k]; if (!x || !y) { console.log(w, st, k, 'missing', !!x, !!y); continue; }
    const d = []; for (const f in x) { if (typeof x[f] === 'number' ? Math.abs(x[f] - y[f]) > 1 : x[f] !== y[f]) d.push(`${f} ${x[f]}→${y[f]}`); }
    console.log(w, st, k, d.length ? d.join(' | ') : 'OK'); } }
