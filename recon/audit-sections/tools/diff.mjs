// Usage: node diff.mjs live.json clone.json [widths] [sections] [--geo-only]
import fs from 'fs';
const [a, b, wf, sf] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(a)), C = JSON.parse(fs.readFileSync(b));
const TOL = 1;
const SKIP = new Set(['tag', 'cls', 'own', 'text', 'x', 'y', 'w', 'h', 'nat']);
const vis = (e) => e.w > 0 && e.h > 0 && e.display !== 'none' && e.visibility !== 'hidden';
const norm = (s) => s.replace(/[\u2028\u2029]/g, ' ').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
function keyed(els) {
  const m = new Map(), cnt = {};
  for (const e of els) {
    let k;
    if (e.tag === 'img') k = 'img:' + decodeURIComponent(e.src).toLowerCase().replace(/\.(avif|webp|png|jpe?g|svg)$/, '').replace(/-p-\d+$/, '').replace(/^[0-9a-f]{24}[-_]/, '').replace(/^[0-9a-f]{32}[-_]/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    else if (e.tag === 'input') k = 'input:' + (e.ph || e.cls);
    else if (e.own) k = 'txt:' + norm(e.own);
    else continue;
    cnt[k] = (cnt[k] || 0) + 1; m.set(k + '#' + cnt[k], e);
  }
  // class-keyed containers (exact class string)
  const cc = {};
  for (const e of els) { if (e.own || e.tag === 'img' || e.tag === 'input' || !e.cls) continue; const k = 'cls:' + e.cls; cc[k] = (cc[k] || 0) + 1; m.set(k + '#' + cc[k], e); }
  return m;
}
const fmt = (v) => String(v).replace(/rgba?\(([^)]+)\)/g, '($1)');
const widths = wf && wf !== 'all' ? wf.split(',') : Object.keys(L);
const secs = sf && sf !== 'all' ? sf.split(',') : null;
for (const w of widths) {
  console.log(`\n######## ${w}  docH live ${L[w].docH} clone ${C[w].docH}  docW ${L[w].docW}/${C[w].docW}`);
  for (const s of Object.keys(L[w])) {
    if (['docH', 'docW'].includes(s) || (secs && !secs.includes(s))) continue;
    const ls = L[w][s], cs = C[w][s]; if (!ls || !cs) { console.log(s, 'MISSING', !!ls, !!cs); continue; }
    const lm = keyed(ls.els), cm = keyed(cs.els); const lines = [];
    if (Math.abs(ls.top - cs.top) > TOL || Math.abs(ls.h - cs.h) > TOL) lines.push(`SECTION top ${ls.top}→${cs.top} h ${ls.h}→${cs.h}`);
    for (const [k, x] of lm) {
      const y = cm.get(k);
      if (!y) { if (vis(x) && !k.startsWith('cls:')) lines.push(`only-live ${k} [${x.x},${x.y} ${x.w}x${x.h}]`); continue; }
      const vx = vis(x), vy = vis(y);
      if (vx !== vy) { lines.push(`VIS ${k}: live ${vx} clone ${vy} (live ${x.display}/${x.visibility}/${x.w}x${x.h} clone ${y.display}/${y.visibility}/${y.w}x${y.h})`); continue; }
      if (!vx) continue;
      const d = [];
      for (const g of ['x', 'y', 'w', 'h']) if (Math.abs(x[g] - y[g]) > TOL) d.push(`${g} ${x[g]}→${y[g]}`);
      if (!process.argv.includes('--geo-only')) for (const p of Object.keys(x)) {
        if (SKIP.has(p) || p === 'src' || p === 'ph') continue;
        let xv = String(x[p]), yv = String(y[p]);
        if (xv === yv) continue;
        if (/^-?[\d.]+px$/.test(xv) && /^-?[\d.]+px$/.test(yv) && Math.abs(parseFloat(xv) - parseFloat(yv)) <= 0.3) continue;
        if (p === 'transform' && [xv, yv].every((v) => v === 'none' || v === 'matrix(1, 0, 0, 1, 0, 0)')) continue;
        if (/Color$/.test(p) && p.startsWith('border')) { const wp = p.replace('Color', 'Width'); if (parseFloat(x[wp]) === 0 && parseFloat(y[wp]) === 0) continue; }
        if (p === 'zIndex' || p === 'top' && x.position === 'static' && y.position === 'static') continue;
        if (p === 'opacity' && /pixel/.test(x.cls)) continue;
        d.push(`${p} ${fmt(xv)}→${fmt(yv)}`);
      }
      if (d.length) lines.push(`${k.slice(0, 60)} [${x.cls.slice(0, 40)}|${y.cls.slice(0, 40)}]: ${d.join(' | ')}`);
    }
    for (const [k, y] of cm) if (!lm.has(k) && vis(y) && !k.startsWith('cls:')) lines.push(`only-clone ${k} [${y.x},${y.y} ${y.w}x${y.h}]`);
    console.log(`--- ${s} (${lines.length})`); for (const l of lines.slice(0, 60)) console.log('  ' + l); if (lines.length > 60) console.log('  ... +' + (lines.length - 60));
  }
}
