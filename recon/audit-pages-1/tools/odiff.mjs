// DOM-order diff for sections whose element counts match. Usage: node odiff.mjs live.json clone.json [widths]
import fs from 'fs';
const [a, b, wf] = process.argv.slice(2); const L = JSON.parse(fs.readFileSync(a)), C = JSON.parse(fs.readFileSync(b));
const SKIP = new Set(['cls', 'own', 'text', 'src', 'nat', 'ph']);
const bg = (v) => v.replace(/url\(([^)]*)\)/g, (m, f) => 'url(' + f.replace(/^[0-9a-f]{8,32}[-_]?/, '').replace(/^7f73b64e/, '') + ')');
for (const w of (wf ? wf.split(',') : Object.keys(L))) for (const s of Object.keys(L[w])) {
  const ls = L[w][s], cs = C[w][s]; if (!ls?.els) continue;
  if (ls.els.length !== cs.els.length) {
    const lc = ls.els.map((e) => e.tag + '.' + e.cls), cc = cs.els.map((e) => e.tag + '.' + e.cls);
    console.log(`${w} ${s} COUNT ${ls.els.length}/${cs.els.length}`); let i = 0, j = 0; const out = [];
    for (const e of ls.els) if (!cs.els.some((f) => f.cls === e.cls && f.tag === e.tag)) out.push('live-only ' + e.tag + '.' + e.cls + ` ${e.w}x${e.h} ${e.display}/${e.opacity}`);
    for (const e of cs.els) if (!ls.els.some((f) => f.cls === e.cls && f.tag === e.tag)) out.push('clone-only ' + e.tag + '.' + e.cls + ` ${e.w}x${e.h} ${e.display}/${e.opacity}`);
    console.log('   ' + out.join('\n   ')); continue;
  }
  let n = 0;
  ls.els.forEach((x, i) => { const y = cs.els[i]; const d = [];
    if (x.tag !== y.tag) d.push(`tag ${x.tag}→${y.tag}`);
    for (const g of ['x', 'y', 'w', 'h']) if (Math.abs(x[g] - y[g]) > 1) d.push(`${g} ${x[g]}→${y[g]}`);
    for (const p of Object.keys(x)) { if (SKIP.has(p) || ['x', 'y', 'w', 'h', 'tag'].includes(p)) continue; let xv = String(x[p]), yv = String(y[p]);
      if (p === 'backgroundImage') { xv = bg(xv); yv = bg(yv); }
      if (xv === yv) continue; if (/^-?[\d.]+px$/.test(xv) && /^-?[\d.]+px$/.test(yv) && Math.abs(parseFloat(xv) - parseFloat(yv)) <= 0.3) continue;
      if (/Color$/.test(p) && p.startsWith('border') && parseFloat(x[p.replace('Color', 'Width')]) === 0 && parseFloat(y[p.replace('Color', 'Width')]) === 0) continue;
      d.push(`${p} ${xv}→${yv}`); }
    if (d.length) { n++; if (n <= 25) console.log(`${w} ${s} #${i} ${x.tag}.${x.cls.slice(0, 50)} | ${y.cls.slice(0, 40)} "${x.own.slice(0, 20)}": ${d.join(' | ').slice(0, 400)}`); } });
  console.log(`${w} ${s} total-diff-els ${n}/${ls.els.length}`);
}
