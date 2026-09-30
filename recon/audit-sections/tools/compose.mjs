// Usage: node compose.mjs <dir> <outdir> [filter]  -> side-by-side live|clone PNGs + diff% (threshold 40)
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs'; import path from 'path';
const [dir, outdir, filt] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const files = fs.readdirSync(dir).filter((f) => f.startsWith('live-') && f.endsWith('.png') && (!filt || f.includes(filt)));
const b = await chromium.launch(); const p = await b.newPage();
for (const f of files) {
  const c = f.replace(/^live-/, 'clone-'); if (!fs.existsSync(path.join(dir, c))) continue;
  const a64 = fs.readFileSync(path.join(dir, f)).toString('base64'), c64 = fs.readFileSync(path.join(dir, c)).toString('base64');
  const res = await p.evaluate(async ({ a64, c64 }) => {
    const ld = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [A, C] = await Promise.all([ld(a64), ld(c64)]);
    const w = A.width, h = Math.max(A.height, C.height);
    const cv = document.createElement('canvas'); cv.width = w * 3 + 20; cv.height = h; const x = cv.getContext('2d');
    x.fillStyle = '#f0f'; x.fillRect(0, 0, cv.width, h); x.drawImage(A, 0, 0); x.drawImage(C, w + 10, 0);
    const da = x.getImageData(0, 0, w, h).data, dc = x.getImageData(w + 10, 0, w, h).data; const out = x.createImageData(w, h); let n = 0;
    for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - dc[i]), Math.abs(da[i + 1] - dc[i + 1]), Math.abs(da[i + 2] - dc[i + 2])); const bad = d > 40; if (bad) n++;
      out.data[i] = bad ? 255 : da[i] * 0.3; out.data[i + 1] = bad ? 0 : da[i + 1] * 0.3; out.data[i + 2] = bad ? 0 : da[i + 2] * 0.3; out.data[i + 3] = 255; }
    x.putImageData(out, 2 * w + 20, 0);
    return { pct: (100 * n / (w * h)).toFixed(2), url: cv.toDataURL('image/png') };
  }, { a64, c64 });
  fs.writeFileSync(path.join(outdir, f.replace(/^live-/, 'cmp-')), Buffer.from(res.url.split(',')[1], 'base64'));
  console.log(f.replace(/^live-|\.png$/g, '').padEnd(34), res.pct + '%');
}
await b.close();
