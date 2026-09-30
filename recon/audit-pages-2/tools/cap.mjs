// Usage: node cap.mjs <live|clone> <outdir> <keys> <widths> [--noshot] [--nodump]
// One load per key×width: settled state, scroll-through, videos hidden; full-page PNG <side>-<key>-<w>.png
// and element dump (dump-<side>-<key>.json, {w:{sec:{top,h,els}}}) compatible with diff.mjs.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs'; import { R, secsFor } from './routes.mjs';
const [side, outdir, keysA, wA] = process.argv.slice(2);
const keys = keysA === 'all' ? Object.keys(R) : keysA.split(','); const widths = (wA || '1440,390').split(',').map(Number);
const noshot = process.argv.includes('--noshot'), nodump = process.argv.includes('--nodump');
const BASE = side === 'live' ? 'https://www.transform9.com' : 'http://127.0.0.1:5179';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
const FREEZE = `*{caret-color:transparent!important} video,.bg-video,.background-video{visibility:hidden!important}`;
fs.mkdirSync(outdir, { recursive: true });
const b = await chromium.launch();
async function open(route, w) {
  for (let a = 1; ; a++) {
    const p = await b.newPage({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
    try {
      await p.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }); await p.evaluate(() => document.fonts.ready);
      if (side === 'live') { await p.waitForFunction(() => { const e = document.querySelector('.preloader-wrap'); return !e || getComputedStyle(e).opacity === '0' || getComputedStyle(e).display === 'none'; }, null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3500); }
      else await p.waitForTimeout(800);
      await p.addStyleTag({ content: FREEZE });
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await p.waitForTimeout(side === 'live' ? 2500 : 500);
      return p;
    } catch (e) { await p.close(); if (a === 3) throw e; console.error('retry', route, w, e.message.split('\n')[0]); }
  }
}
const DUMP = (sections) => {
  const P = ['display', 'position', 'fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'fontStyle', 'letterSpacing', 'color', 'backgroundColor', 'opacity', 'visibility', 'transform',
    'marginTop', 'marginBottom', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth', 'borderLeftColor', 'borderRightWidth', 'borderRightColor',
    'borderRadius', 'boxShadow', 'objectFit', 'objectPosition', 'textAlign', 'whiteSpace', 'textTransform', 'textDecorationLine', 'textDecorationColor', 'textUnderlineOffset', 'backgroundSize', 'backgroundPosition', 'backgroundImage', 'overflow', 'top', 'maxWidth', 'cursor', 'filter', 'listStyleType', 'listStylePosition', 'wordBreak', 'overflowWrap'];
  const res = {};
  for (const [name, sel] of sections) {
    const root = document.querySelector(sel); if (!root) { res[name] = null; continue; }
    const rr = root.getBoundingClientRect(); const top = rr.top + scrollY;
    res[name] = { top, h: rr.height, els: [root, ...root.querySelectorAll('*')].filter((e) => !['SCRIPT', 'STYLE', 'BR', 'path', 'svg', 'g', 'defs', 'clipPath', 'rect', 'circle', 'NOSCRIPT', 'SOURCE', 'VIDEO', 'IFRAME'].includes(e.tagName) && !e.closest('.example-for-edit,.w-condition-invisible,.hide')).map((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
      // line count for text containers
      let lines = 0; if (own) { const rg = document.createRange(); rg.selectNodeContents(e); const ys = new Set([...rg.getClientRects()].map((q) => Math.round(q.top))); lines = ys.size; }
      const o = { tag: e.tagName.toLowerCase(), cls: typeof e.className === 'string' ? e.className.trim().replace(/\s+/g, ' ') : '', own: own.slice(0, 50),
        text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80), x: +r.x.toFixed(1), y: +(r.top + scrollY - top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), lines };
      if (e.tagName === 'IMG') { o.src = (e.currentSrc || e.src).split('/').pop().replace(/^[0-9a-f]{24}_/, '').split('?')[0]; o.nat = e.naturalWidth + 'x' + e.naturalHeight; }
      if (e.tagName === 'A') o.href = e.getAttribute('href');
      for (const q of P) o[q] = cs[q];
      o.fontFamily = o.fontFamily.split(',')[0].replace(/"/g, '');
      o.backgroundImage = o.backgroundImage.replace(/url\("?[^)]*\/([^/")]+)"?\)/g, 'url($1)').replace(/[0-9a-f]{24}_/g, '').replace(/-p-\d+/g, '').slice(0, 120);
      return o;
    }) };
  }
  return res;
};
for (const k of keys) {
  const route = R[k]; const out = {};
  for (const w of widths) {
    const p = await open(route, w);
    if (!nodump) { out[w] = await p.evaluate(DUMP, secsFor(k)); Object.assign(out[w], await p.evaluate(() => ({ docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth }))); }
    if (!noshot) await p.screenshot({ path: `${outdir}/${side}-${k}-${w}.png`, fullPage: true });
    await p.close(); console.error(side, k, w);
  }
  if (!nodump) fs.writeFileSync(`${outdir}/dump-${side}-${k}.json`, JSON.stringify(out));
}
await b.close();
