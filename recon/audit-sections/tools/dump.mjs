// Usage: node dump.mjs <live|clone> <out.json> [widths] [sections]
// Dumps every rendered element in each in-scope section: rect relative to section, computed style, own text / img src.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [side, out] = process.argv.slice(2, 4);
const widths = (process.argv[4] || '1440,1200,1024,768,600,390').split(',').map(Number);
const only = process.argv[5] && process.argv[5] !== 'all' ? process.argv[5].split(',') : null;
const URL = side === 'live' ? 'https://www.transform9.com/' : 'http://127.0.0.1:5179/';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
const SECTIONS = [
  ['testimonials', 'section.testimonials'], ['how-it-works', 'section.how-it-works'], ['white-section', 'section.white-section', true],
  ['trans-b2w', '.transition-cont.black-to-white'], ['scheduling', '.stacking-cards-section.schudule-agent'], ['tasking', '.half-split-wrap'],
  ['navigator', '.row-tabs-section'], ['outreach', '.split-cards-section'], ['trans-w2b', '.transition-cont.white-to-black'],
  ['specialties', 'section.specialty-section'], ['integrations', 'section.integration-section'], ['security', 'section.secure-section'], ['cta', 'section.cta-section'],
];
const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}*{caret-color:transparent!important}`;
export async function dump(page, sections) {
  return page.evaluate((sections) => {
    const P = ['display', 'position', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'color', 'backgroundColor', 'opacity', 'visibility', 'transform',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth', 'borderLeftColor', 'borderRightWidth', 'borderRightColor',
      'boxShadow', 'objectFit', 'objectPosition', 'textAlign', 'whiteSpace', 'textTransform', 'zIndex', 'backgroundSize', 'backgroundPosition', 'backdropFilter', 'overflow', 'top', 'maxWidth'];
    const res = {};
    for (const [name, sel, shallow] of sections) {
      const root = document.querySelector(sel); if (!root) { res[name] = null; continue; }
      const rr = root.getBoundingClientRect(); const top = rr.top + scrollY;
      const els = shallow ? [root, ...root.children] : [root, ...root.querySelectorAll('*')];
      res[name] = { top, h: rr.height, els: els.filter((e) => !['SCRIPT', 'STYLE', 'BR', 'path', 'svg', 'g', 'defs', 'clipPath', 'rect', 'circle'].includes(e.tagName)).map((e) => {
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
        const o = { tag: e.tagName.toLowerCase(), cls: typeof e.className === 'string' ? e.className.trim().replace(/\s+/g, ' ') : '', own: own.slice(0, 50),
          text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80), x: +r.x.toFixed(1), y: +(r.top + scrollY - top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        if (e.tagName === 'IMG') { o.src = (e.currentSrc || e.src).split('/').pop().replace(/^[0-9a-f]{24}_/, '').split('?')[0]; o.nat = e.naturalWidth + 'x' + e.naturalHeight; }
        if (e.tagName === 'INPUT') o.ph = e.placeholder;
        for (const p of P) o[p] = cs[p];
        return o;
      }) };
    }
    return res;
  }, sections);
}
if (process.argv[1].endsWith('dump.mjs')) {
  const browser = await chromium.launch(); const result = {};
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(side === 'live' ? 3000 : 600);
    await page.addStyleTag({ content: FREEZE });
    await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; }));
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
    await page.waitForTimeout(side === 'live' ? 2500 : 400);
    result[w] = await dump(page, SECTIONS.filter((s) => !only || only.includes(s[0])));
    result[w].docH = await page.evaluate(() => document.documentElement.scrollHeight);
    result[w].docW = await page.evaluate(() => document.documentElement.scrollWidth);
    await page.close(); console.error('done', side, w);
  }
  fs.writeFileSync(out, JSON.stringify(result)); await browser.close();
}
