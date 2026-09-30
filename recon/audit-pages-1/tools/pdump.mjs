// Usage: node pdump.mjs <live|clone> <route> <out.json> [widths]
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [side, route, out, wArg] = process.argv.slice(2);
const widths = (wArg || '1440,1200,1024,768,600,390').split(',').map(Number);
const BASE = side === 'live' ? 'https://www.transform9.com' : 'http://127.0.0.1:5179';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}*{caret-color:transparent!important}`;
export const SECS = {
  '/compare': [['hero', 'section.hero'], ['generic', 'section.generic-section'], ['table', 'section.table-section'], ['access', 'section.access-section'], ['white', 'section.white-section'], ['trans-w2b', '.transition-cont.white-to-black'], ['privacy', 'section.privacy-section'], ['ev', 'section.ev-section'], ['cta', 'section.cta-section']],
  '/book-a-demo': [['hero', 'section.hero']],
  legal: [['hero', 'section.hero'], ['content', 'section.legal-section']],
};
export async function pdump(page, sections) {
  return page.evaluate((sections) => {
    const P = ['display', 'position', 'fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'color', 'backgroundColor', 'opacity', 'visibility', 'transform',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth', 'borderLeftColor', 'borderRightWidth', 'borderRightColor',
      'borderRadius', 'boxShadow', 'objectFit', 'objectPosition', 'textAlign', 'whiteSpace', 'textTransform', 'textDecorationLine', 'backgroundSize', 'backgroundPosition', 'backgroundImage', 'backdropFilter', 'overflow', 'top', 'maxWidth', 'cursor', 'filter', 'mixBlendMode', 'listStyleType'];
    const res = {};
    for (const [name, sel] of sections) {
      const root = document.querySelector(sel); if (!root) { res[name] = null; continue; }
      const rr = root.getBoundingClientRect(); const top = rr.top + scrollY;
      res[name] = { top, h: rr.height, els: [root, ...root.querySelectorAll('*')].filter((e) => !['SCRIPT', 'STYLE', 'BR', 'path', 'svg', 'g', 'defs', 'clipPath', 'rect', 'circle', 'NOSCRIPT'].includes(e.tagName)).map((e) => {
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
        const o = { tag: e.tagName.toLowerCase(), cls: typeof e.className === 'string' ? e.className.trim().replace(/\s+/g, ' ') : '', own: own.slice(0, 50),
          text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80), x: +r.x.toFixed(1), y: +(r.top + scrollY - top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        if (e.tagName === 'IMG') { o.src = (e.currentSrc || e.src).split('/').pop().replace(/^[0-9a-f]{24}_/, '').split('?')[0]; o.nat = e.naturalWidth + 'x' + e.naturalHeight; }
        if (e.tagName === 'INPUT') o.ph = e.placeholder || e.value || e.name;
        for (const p of P) o[p] = cs[p];
        o.backgroundImage = o.backgroundImage.replace(/url\("?[^)]*\/([^/")]+)"?\)/g, 'url($1)').replace(/[0-9a-f]{24}_/g, '').slice(0, 120);
        return o;
      }) };
    }
    return res;
  }, sections);
}
export async function open(b, w) {
  const p = await b.newPage({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
  await p.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }); await p.evaluate(() => document.fonts.ready);
  if (side === 'live') { await p.waitForFunction(() => { const e = document.querySelector('.preloader-wrap'); return !e || getComputedStyle(e).opacity === '0' || getComputedStyle(e).display === 'none'; }, null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3500); }
  else await p.waitForTimeout(800);
  await p.addStyleTag({ content: FREEZE });
  await p.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => new Promise((r) => { v.pause(); if (v.currentTime === 0) return r(); v.addEventListener('seeked', r, { once: true }); v.currentTime = 0; setTimeout(r, 5000); }))));
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p.waitForTimeout(side === 'live' ? 2500 : 500);
  return p;
}
if (process.argv[1].endsWith('pdump.mjs')) {
  const b = await chromium.launch(); const result = {};
  const secs = SECS[route] || SECS.legal;
  for (const w of widths) {
    const p = await open(b, w);
    result[w] = await pdump(p, secs);
    result[w].docH = await p.evaluate(() => document.documentElement.scrollHeight);
    result[w].docW = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.close(); console.error('done', side, route, w);
  }
  fs.writeFileSync(out, JSON.stringify(result)); await b.close();
}
