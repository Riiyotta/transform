// Usage: node measure.mjs <path> <outdir> <name> [widths]
// Loads https://www.transform9.com<path> at each width (fonts awaited, full scroll for lazy content),
// dumps outline + per-class computed styles + rects + network + screenshots.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [,, path, outdir, name, ws] = process.argv;
const widths = (ws || '1440,1024,768,390').split(',').map(Number);
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 };
fs.mkdirSync(outdir, { recursive: true });
const PROPS = ['display','position','top','right','bottom','left','zIndex','width','height','minHeight','maxWidth','minWidth','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','flexDirection','flexWrap','justifyContent','alignItems','flexGrow','flexShrink','flexBasis','gap','rowGap','columnGap','gridTemplateColumns','gridTemplateRows','fontFamily','fontSize','lineHeight','letterSpacing','fontWeight','textTransform','textAlign','textDecorationLine','whiteSpace','color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','borderTop','borderRight','borderBottom','borderLeft','borderRadius','boxShadow','opacity','transform','transition','animation','backdropFilter','overflow','objectFit','cursor','listStyleType','visibility'];
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: H[w] }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const net = [];
  page.on('response', (r) => { const q = r.request(); net.push({ status: r.status(), type: q.resourceType(), url: q.url() }); });
  await page.goto('https://www.transform9.com' + path, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  // top-of-page state (nav initial etc.) before scrolling
  const top = await page.evaluate(() => {
    const cs = (s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return { bg: c.backgroundColor, color: c.color, opacity: c.opacity, display: c.display, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)) }; };
    return { htmlClass: document.documentElement.className, nav: cs('.nav-menu'), logoWhite: cs('.nav-menu .logo-white'), logoBlack: cs('.nav-menu .logo-black'), navLink: cs('.nav-menu .nav-link-block'), navText: cs('.nav-menu .nav-text'), border: cs('.nav-border-on-white'), bgPixels: cs('.bg-pixels-wrapper'), bgVideo: cs('.bg-video-pixels'), bgPic: cs('.bg-pic-pixels'), noiseWrap: cs('.bg-noise-wrap'), solid: cs('.page-wrap-solid-bg'), modal: cs('.modal-wrap'), footerBottom: cs('.footer-bottom-wrap'), video: [...document.querySelectorAll('video')].map((v) => ({ src: v.currentSrc, paused: v.paused, w: v.videoWidth, h: v.videoHeight })) };
  });
  await page.screenshot({ path: `${outdir}/${name}-${w}-top.png` });
  // scroll through to trigger lazy loading / scroll interactions
  const sh = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < sh; y += Math.round(H[w] * 0.8)) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200);
  const data = await page.evaluate((PROPS) => {
    const sy = window.scrollY;
    const keyOf = (e) => e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '');
    const els = new Map();
    for (const e of document.querySelectorAll('body *')) {
      if (['SCRIPT','STYLE','NOSCRIPT','BR','PATH','G','DEFS','CLIPPATH','RECT','CIRCLE','LINE','POLYGON','STOP','LINEARGRADIENT','MASK','USE','SYMBOL','ELLIPSE','POLYLINE'].includes(e.tagName)) continue;
      const k = keyOf(e);
      if (els.has(k)) { els.get(k).count++; continue; }
      const c = getComputedStyle(e); const r = e.getBoundingClientRect();
      const o = { key: k, count: 1, id: e.id || undefined, rect: { x: +r.x.toFixed(2), y: +(r.y + sy).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) } };
      for (const p of PROPS) o[p] = c[p];
      const ph = getComputedStyle(e, '::placeholder'); if (e.matches('input,textarea')) { o.placeholderColor = ph.color; o.placeholder = e.placeholder; }
      const t = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim(); if (t) o.text = t.slice(0, 160);
      els.set(k, o);
    }
    // outline
    const lines = [];
    const walk = (e, d) => {
      if (['SCRIPT','STYLE','NOSCRIPT','svg'].includes(e.tagName) || e.tagName === 'svg') { if (e.tagName === 'svg') lines.push('  '.repeat(d) + '<svg>'); return; }
      const c = getComputedStyle(e); const r = e.getBoundingClientRect();
      const attrs = [];
      if (e.id) attrs.push('#' + e.id);
      for (const a of ['href','src','srcset','type','name','placeholder','required','data-name','action','method','target','data-wf-page','data-tab','data-w-tab','role','aria-label','loading','for','value','data-src','sizes','alt']) if (e.hasAttribute(a)) attrs.push(`${a}=${(e.getAttribute(a) || '').slice(0, 140)}`);
      const hid = c.display === 'none' ? ' [display:none]' : (c.visibility === 'hidden' ? ' [hidden]' : '');
      lines.push('  '.repeat(d) + `<${e.tagName.toLowerCase()}${e.classList.length ? ' .' + [...e.classList].join('.') : ''} ${attrs.join(' ')}>${hid} {${r.x.toFixed(0)},${(r.y + sy).toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)}}`);
      for (const n of e.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) lines.push('  '.repeat(d + 1) + JSON.stringify(n.textContent.trim().replace(/\s+/g, ' ')));
        else if (n.nodeType === 1) walk(n, d + 1);
      }
    };
    walk(document.body, 0);
    return { scrollH: document.documentElement.scrollHeight, title: document.title, metas: [...document.querySelectorAll('meta[name],meta[property],link[rel]')].map((m) => ({ n: m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('rel'), v: m.getAttribute('content') || m.getAttribute('href') })), iframes: [...document.querySelectorAll('iframe')].map((f) => { const r = f.getBoundingClientRect(); return { src: f.src, id: f.id, cls: f.className, title: f.title, rect: [r.x, r.y + sy, r.width, r.height].map((v) => +v.toFixed(1)) }; }), els: [...els.values()], outline: lines.join('\n') };
  }, PROPS);
  fs.writeFileSync(`${outdir}/${name}-${w}.json`, JSON.stringify({ w, h: H[w], top, ...data, outline: undefined, net }, null, 1));
  fs.writeFileSync(`${outdir}/${name}-${w}-outline.txt`, data.outline);
  await page.screenshot({ path: `${outdir}/${name}-${w}-full.png`, fullPage: true });
  console.log(name, w, 'scrollH', data.scrollH, 'els', data.els.length, 'net', net.length);
  await ctx.close();
}
await browser.close();
