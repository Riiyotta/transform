import fs from 'fs';
const [a, b, only] = [process.argv[2], process.argv[3], process.argv[4]];
const L = JSON.parse(fs.readFileSync(a)), C = JSON.parse(fs.readFileSync(b));
const skip = new Set(['text', 'vy', 'backgroundImage', 'fontFamily', 'transition']);
const TOL = 1.0;
for (const w of Object.keys(L.widths)) {
  const l = L.widths[w], c = C.widths[w]; if (!c) continue;
  console.log(`\n######## ${w}  font live=${l.fontOK} clone=${c.fontOK} docW live=${l.docW} clone=${c.docW} menuDocW ${l.menuDocW}/${c.menuDocW} errs=${c.consoleErrors.length} ext=${JSON.stringify(c.external).slice(0,200)}`);
  for (const st of ['default', 'statsHover', 'navHover', 'bottom', 'menu', 'modal', 'modalError', 'modalSuccess']) {
    if (only && !only.split(',').includes(st)) continue;
    if (!l[st] || !c[st]) continue;
    for (const k of Object.keys(l[st])) {
      const ll = l[st][k].list, cl = (c[st][k] || { list: [] }).list;
      if (ll.length !== cl.length) { console.log(`[${st}] ${k}: count live ${ll.length} clone ${cl.length}`); }
      const n = Math.min(ll.length, cl.length);
      for (let i = 0; i < n; i++) {
        const x = ll[i], y = cl[i]; const d = [];
        const geo = x.ry != null ? ['x', 'ry', 'w', 'h'] : ['x', 'y', 'w', 'h'];
        const vis = !(x.display === 'none' && y.display === 'none');
        if (vis) for (const g of geo) if (Math.abs(x[g] - y[g]) > TOL) d.push(`${g} ${x[g]}→${y[g]}`);
        for (const p of Object.keys(x)) { if (skip.has(p) || geo.includes(p) || p === 'x' || p === 'y' || p === 'w' || p === 'h' || p === 'ry') continue;
          if (!vis && p !== 'display') continue;
          let xv = String(x[p]), yv = String(y[p]);
          if (p === 'transform') { xv = xv.replace('matrix(1, 0, 0, 1, 0, 0)', 'none'); yv = yv.replace('matrix(1, 0, 0, 1, 0, 0)', 'none'); }
          if (/^border/.test(p) && xv.startsWith('0px') && yv.startsWith('0px')) continue;
          if (p==='gap' && ['0px','normal'].includes(xv) && ['0px','normal'].includes(yv)) continue;
          if (['justifyContent','alignItems','flexDirection','gap'].includes(p) && !/flex|grid/.test(x.display+y.display)) continue;
          if (/^border/.test(p) && /rgba\(\d+, \d+, \d+, 0\)/.test(xv) && /rgba\(\d+, \d+, \d+, 0\)/.test(yv) && xv.split(' ')[0]===yv.split(' ')[0]) continue;
          if (xv !== yv) { if (/^[\d.]+px$/.test(xv) && /^[\d.]+px$/.test(yv) && Math.abs(parseFloat(xv) - parseFloat(yv)) <= 0.3) continue; d.push(`${p} ${xv} → ${yv}`); } }
        if (d.length) console.log(`[${st}] ${k}${n > 1 ? '#' + i : ''} "${x.text.slice(0, 20)}": ${d.join(' | ')}`);
      }
    }
  }
}
