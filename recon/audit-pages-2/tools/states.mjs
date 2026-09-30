// Usage: node states.mjs <live|clone> <outdir> [widths]  -> states-<side>.json + <side>-<state>-<w>.png
// Hover END states, Load More result, sticky share column. Probes use selectors shared by both sides.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs'; import { R } from './routes.mjs';
const [side, outdir, wA] = process.argv.slice(2); const widths = (wA || '1440,768,390').split(',').map(Number);
const live = side === 'live'; const BASE = live ? 'https://www.transform9.com' : 'http://127.0.0.1:5179';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
fs.mkdirSync(outdir, { recursive: true }); const b = await chromium.launch(); const OUT = {};
const PROPS = ['color', 'backgroundColor', 'opacity', 'transform', 'borderLeftColor', 'textDecorationLine', 'display', 'position', 'visibility'];
async function open(route, w) {
  for (let a = 1; ; a++) { const p = await b.newPage({ viewport: { width: w, height: H[w] }, deviceScaleFactor: 1 });
    try { await p.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }); await p.evaluate(() => document.fonts.ready);
      if (live) { await p.waitForFunction(() => { const e = document.querySelector('.preloader-wrap'); return !e || getComputedStyle(e).opacity === '0'; }, null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3500); } else await p.waitForTimeout(800);
      await p.addStyleTag({ content: '*{caret-color:transparent!important} video{visibility:hidden!important}' });
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await p.waitForTimeout(live ? 2000 : 400); return p;
    } catch (e) { await p.close(); if (a === 3) throw e; } }
}
const probe = (p, root, sels) => p.evaluate(([root, sels, PROPS]) => { const r0 = typeof root === 'string' ? document.querySelector(root) : document; const o = {};
  for (const s of sels) { const e = s === ':root' ? r0 : r0?.querySelector(s); if (!e) { o[s] = null; continue; } const c = getComputedStyle(e), r = e.getBoundingClientRect();
    o[s] = { rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(1)) }; for (const q of PROPS) o[s][q] = c[q]; }
  return o; }, [root, sels, PROPS]);
const hoverState = async (p, name, w, target, root, sels) => {
  const pre = await probe(p, root, sels);
  await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), target); await p.waitForTimeout(live ? 1200 : 300);
  await p.hover(target); await p.waitForTimeout(live ? 2000 : 500);
  const post = await probe(p, root, sels);
  const el = await p.$(root); await (el || p).screenshot({ path: `${outdir}/${side}-${name}-${w}.png` });
  await p.mouse.move(1, 1); await p.waitForTimeout(live ? 1500 : 300);
  return { pre, post };
};
for (const w of widths) {
  const S = (OUT[w] = {});
  const CARD = ['.post-bottom-wrap', '.blog-title', '.blog-data', '.post-cell', '.post-img-hor', '.post-arrow-wrap', '.post-img-wrap'];
  let p = await open(R.blog, w);
  S.blogCard = await hoverState(p, 'blog-card-hover', w, '.blogs-list a.post-link-block', '.blogs-list .blogs-item', CARD);
  S.featured = await hoverState(p, 'featured-hover', w, 'a.post-hor-wrap.featured', 'a.post-hor-wrap.featured', ['.blog-img-vert', '.blog-header-right', '.featured-bottom', '.load-more, ._w-underline.featured, .w-underline-link.featured']);
  S.loadMoreHover = await hoverState(p, 'loadmore-hover', w, '.load-more', '.pagination', [':root', '.load-more', '.load-more div']);
  await p.click('.load-more'); await p.waitForTimeout(live ? 4000 : 800);
  S.loadMore = await p.evaluate(() => ({ items: document.querySelectorAll('.blogs-list .blogs-item').length, titles: [...document.querySelectorAll('.blogs-list .blog-title')].map((e) => e.textContent.trim().slice(0, 30)),
    moreVisible: (() => { const e = document.querySelector('.load-more'); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0; })(), url: location.pathname + location.search,
    listH: document.querySelector('.all-blogs-section').getBoundingClientRect().height, docH: document.documentElement.scrollHeight,
    rects: [...document.querySelectorAll('.blogs-list a.post-link-block')].map((e) => { const r = e.getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height].map((v) => +v.toFixed(1)); }) }));
  await p.evaluate(() => document.querySelector('.all-blogs-section').scrollIntoView()); await p.waitForTimeout(live ? 1500 : 300);
  await (await p.$('.all-blogs-section')).screenshot({ path: `${outdir}/${side}-loadmore-after-${w}.png` }); await p.close();
  p = await open(R.cs, w);
  S.csCard = await hoverState(p, 'cs-card-hover', w, '.blogs-list a.post-link-block', '.blogs-list .blogs-item', ['.post-img-wrap', '.cl-wh-logo-on-cell', '.cl-bl-logo-on-cell', '.post-bottom-wrap', '.cs-title', '.testim-num', '.blog-point', '.highlight-text-alt', '.testim-point-wrap', '.post-arrow-wrap']);
  await p.close();
  p = await open(R.athena, w);
  S.back = await hoverState(p, 'back-hover', w, 'a.icon-w-text', 'a.icon-w-text', [':root', '.back-1', '.back-2', '.back-icon-wrap']);
  S.share = await hoverState(p, 'share-hover', w, '.share-link-block', '.left-sticky-block', ['.share-link-block', '.share-links']);
  S.sticky = [];
  for (const f of [0, 0.3, 0.6, 0.98]) {
    const y = await p.evaluate((f) => { const s = document.querySelector('.post-body-section'); const r = s.getBoundingClientRect(); return Math.round(r.top + scrollY + f * r.height); }, f);
    await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(live ? 800 : 200);
    S.sticky.push(await p.evaluate(() => { const r = document.querySelector('.left-sticky-block').getBoundingClientRect(); return { scrollY, top: +r.top.toFixed(1), h: +r.height.toFixed(1), x: +r.x.toFixed(1) }; }));
  }
  await p.close();
  p = await open(R.sbj, w);
  S.rnCard = await hoverState(p, 'rn-card-hover', w, '.read-next-section a.post-link-block', '.read-next-section .blogs-item', ['.post-img-wrap', '.cl-wh-logo-on-cell', '.cl-bl-logo-on-cell', '.post-bottom-wrap', '._30px-text, .rn-title', '.testim-num', '.blog-point', '.highlight-text-alt', '.testim-point-wrap', '.post-arrow-wrap']);
  await p.close(); console.error(side, w);
}
fs.writeFileSync(`${outdir}/states-${side}.json`, JSON.stringify(OUT, null, 1)); await b.close();
