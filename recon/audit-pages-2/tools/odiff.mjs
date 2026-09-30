// DOM-order diff (element i vs element i among rendered elements). Usage: node odiff.mjs live.json clone.json
import fs from 'fs';
const [a, b] = process.argv.slice(2); const L = JSON.parse(fs.readFileSync(a)), C = JSON.parse(fs.readFileSync(b));
const SKIP = new Set(['cls', 'own', 'text', 'src', 'nat', 'href', 'backgroundImage', 'fontFamily']);
const vis = (e) => e.w > 0 && e.display !== 'none';
let total = 0;
for (const w in L) for (const s in L[w]) { const ls = L[w][s], cs = C[w]?.[s]; if (!ls?.els || !cs?.els) continue;
  const le = ls.els.filter(vis), ce = cs.els.filter(vis);
  if (le.length !== ce.length) { console.log(w, s, 'COUNT', le.length, ce.length); continue; }
  le.forEach((x, i) => { const y = ce[i]; const d = [];
    if (x.tag !== y.tag) d.push(`tag ${x.tag}→${y.tag}`);
    for (const k of Object.keys(x)) { if (SKIP.has(k)) continue; const xv = String(x[k]), yv = String(y[k]); if (xv === yv) continue;
      if (typeof x[k] === 'number' && Math.abs(x[k] - y[k]) <= 0.6) continue;
      if (/^-?[\d.]+px$/.test(xv) && /^-?[\d.]+px$/.test(yv) && Math.abs(parseFloat(xv) - parseFloat(yv)) <= 0.3) continue;
      if (k === 'transform' && [xv, yv].every((v) => v === 'none' || v === 'matrix(1, 0, 0, 1, 0, 0)')) continue;
      if (/Color$/.test(k) && k.startsWith('border') && parseFloat(x[k.replace('Color', 'Width')]) === 0 && parseFloat(y[k.replace('Color', 'Width')]) === 0) continue;
      if (k === 'textDecorationColor' && x.textDecorationLine === 'none' && y.textDecorationLine === 'none') continue;
      if (k === 'zIndex' || (k === 'top' && x.position === 'static')) continue;
      d.push(`${k} ${xv}→${yv}`); }
    if (d.length) { total++; if (total < 400) console.log(w, s, i, `${x.tag}.${x.cls.slice(0, 40)} | ${y.cls.slice(0, 40)} "${(x.own || '').slice(0, 25)}"`, d.join(' ; ')); } }); }
console.log('diffs', total);
