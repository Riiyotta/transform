// Usage: node measure.mjs [widths] [--shots]
// Loads the clone /compare at each width, checks console errors / external requests / horizontal
// overflow / font, and diffs key element rects + font sizes against the live recon
// (recon/pages/compare/compare-{w}.json, first instance of each class combo).
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const ROOT = '/Users/riyaghosh/V3/transform';
const widths = (process.argv[2] || '1440,1024,768,390').split(',').map(Number);
const SHOTS = process.argv.includes('--shots');
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 };
const LIVE_DOC = { 1440: 12791, 1024: 11313, 768: 9853, 390: 12625 };
// [label, live key (tag.classes), clone selector]
const MAP = [
  ['hero', 'section.hero.home', '[data-section="hero"]'],
  ['hero h1', 'h1.white-text.hero-home.compare', '.hero-heading.compare'],
  ['hero bottom', 'div.hero-home-bottom', '.hero.home .hero-home-bottom'],
  ['hero left', 'div.hero-bottom-block.left', '.hero.home .hero-bottom-block.left'],
  ['hero p', 'p._30px-text.home-hero-text.white', '.hero.home .home-hero-text'],
  ['hero right', 'div.hero-bottom-block.right.comparison-hero', '.comparison-hero'],
  ['hero label', 'div._16px-text.white-text.full-width', '.comparison-hero .full-width'],
  ['live demo link', 'a.hero-cta-link.compare-demo.w-inline-block', '.hero .compare-demo'],
  ['live demo text', 'div._56-px-text.footer-cta', '.hero .compare-demo .footer-cta'],
  ['generic', 'section.generic-section', '.generic-section'],
  ['generic rail', 'div.left-side.generic', '.left-side.generic'],
  ['generic right', 'div.right-side.generic', '.right-side.generic'],
  ['why-text', 'div._16px-text.white-text.why-text', '.why-text'],
  ['gen-text-wrap', 'div.gen-text-wrap', '.gen-text-wrap'],
  ['generic h2', 'h2.h1-text.white-text.generic', '.h1-text.generic'],
  ['generic p', 'p._30px-text.white.generic-text', '.generic-text'],
  ['table', 'section.table-section', '.table-section'],
  ['table top', 'div.table-top-wrap', '.table-top-wrap'],
  ['table h2', 'h2.h1-text.white-text.table-head', 'h2.table-head'],
  ['table wrap', 'div.table-wrap', '.table-wrap'],
  ['table head row', 'div.table-row.head', '.table-row.head'],
  ['head-left', 'div.table-cell.left-cell.head-left', '.head-left'],
  ['head cell', 'div.table-cell.right-cell.head', '.right-cell.head'],
  ['logo-table', 'img.logo-table', '.logo-table'],
  ['other agents', 'p._30px-text.white.table-head', 'p.table-head'],
  ['row 1', 'div.table-row', '.table-row:not(.head)'],
  ['left-cell 1', 'div.table-cell.left-cell', '.table-cell.left-cell:not(.head-left)'],
  ['label text 1', 'div._16px-text.half-white.table-text', '.left-cell .table-text'],
  ['t9 cell 1', 'div.table-cell.right-cell.t9', '.right-cell.t9'],
  ['tick 1', 'img.tick-img', '.tick-img'],
  ['t9 text 1', 'div._16px-text.white-text.table-text', '.t9 .table-text'],
  ['other cell 1', 'div.table-cell.right-cell', '.right-cell:not(.t9):not(.head)'],
  ['table bottom', 'div.table-bottom', '.table-bottom'],
  ['table bottom left', 'div.table-bottom-left', '.table-bottom-left'],
  ['table bottom text', 'div._16px-text.half-white.table-bottom-left-text', '.table-bottom-left-text'],
  ['table bottom right', 'div.table-bottom-right', '.table-bottom-right'],
  ['access', 'section.access-section', '.access-section'],
  ['access top', 'div.access-right-top', '.access-right-top'],
  ['access label', 'div._16px-text.half-white.access-top-label', '.access-top-label'],
  ['access h2', 'h2.h1-text.white-text.access', '.h1-text.access'],
  ['access bottom', 'div.access-right-bottom', '.access-right-bottom'],
  ['access block 1', 'div.access-block', '.access-block'],
  ['access head', 'p._30px-text.white.access-block-head', '.access-block-head'],
  ['access text 1', 'div._16px-text.half-white.access-block-text', '.access-block-text'],
  ['access block 2', 'div.access-block._2nd', '.access-block._2nd'],
  ['access text 2', 'div._16px-text.half-white.access-block-text._2', '.access-block-text._2'],
  ['white section', 'section.white-section', '.white-section'],
  ['b2w transition', 'div.transition-cont.black-to-white', '.transition-cont.black-to-white'],
  ['specialty-white', 'div.specialty-white', '.specialty-white'],
  ['sp-wh-top', 'div.sp-wh-top', '.sp-wh-top'],
  ['sp-top-right', 'div.sp-top-right', '.sp-top-right'],
  ['sp-label', 'div._16px-text.sp-label', '.sp-label'],
  ['sp-wh h2', 'h2.h1-text.sp-wh', '.h1-text.sp-wh'],
  ['specialty-section.white', 'div.specialty-section.white', '.specialty-section.white'],
  ['spec menu', 'div.specialty-tabs-menu.wh.w-tab-menu', '.specialty-tabs-menu.wh'],
  ['spec tab 1 (current)', 'a.specialty-tab-link.wh._1.w-inline-block.w-tab-link.w--current', '.specialty-tab-link.wh._1'],
  ['spec tab 2', 'a.specialty-tab-link.wh.w-inline-block.w-tab-link', '.specialty-tab-link.wh:not(._1)'],
  ['spec tab text', 'div._30px-text', '.specialty-tab-link.wh .specialty-tab-text'],
  ['spec pane', 'div.specialty-tabs-content.wh.w-tab-content', '.specialty-tabs-content.wh'],
  ['spec bottom', 'div.right-side.specialty-bottom.wh', '.right-side.specialty-bottom.wh'],
  ['spec bottom text', 'div._16px-text.white-text.specialty-bottom.wh', '.specialty-bottom-text.wh'],
  ['integrations.white', 'section.integration-section.white', '.integration-section.white'],
  ['integ top', 'div.integration-top-wrap.wh', '.integration-top-wrap.wh'],
  ['integ h2', 'h2.h1-text.white-text.integration-head.wh', '.integration-head.wh'],
  ['integ text', 'div._16px-text.white-text.integration.wh-top', '.integration-text.wh-top'],
  ['integ bottom', 'div.integration-bottom-wrap.wh', '.integration-bottom-wrap.wh'],
  ['integ block', 'div.integration-block.wh', 'div.integration-block.wh'],
  ['w2b transition', 'div.transition-cont.white-to-black', '.transition-cont.white-to-black'],
  ['privacy', 'section.privacy-section', '.privacy-section'],
  ['privacy top', 'div.privacy-top', '.privacy-top'],
  ['privacy h2', 'h2.h1-text.white-text.privacy', '.h1-text.privacy'],
  ['privacy bottom', 'div.privacy-bottom', '.privacy-bottom'],
  ['privacy left', 'div.privacy-left', '.privacy-left'],
  ['privacy row 1', 'div.privacy-row', '.privacy-row'],
  ['privacy block 1', 'div.privacy-block', '.privacy-block'],
  ['privacy head 1', 'div._30px-text.white.privacy-head', '.privacy-head'],
  ['privacy text 1', 'div._16px-text.half-white.privacy-text', '.privacy-text'],
  ['privacy row 2', 'div.privacy-row._2', '.privacy-row._2'],
  ['privacy text long', 'div._16px-text.half-white.privacy-text.long', '.privacy-text.long'],
  ['ev', 'section.ev-section', '.ev-section'],
  ['ev top', 'div.ev-top', '.ev-top'],
  ['ev label', 'div._16px-text.half-white.ev-label', '.ev-label'],
  ['ev h2', 'h2.h1-text.white-text.ev', '.h1-text.ev'],
  ['ev bottom', 'div.ev-bottom', '.ev-bottom'],
  ['ev tab current', 'a.ev-tab.w-inline-block.w-tab-link.w--current', '.ev-tab.is-current'],
  ['ev head', 'div._30px-text.ev-head', '.ev-head'],
  ['ev text', 'div._16px-text.ev-tab-text', '.ev-tab.is-current .ev-tab-text'],
  ['ev tab closed', 'a.ev-tab.w-inline-block.w-tab-link', '.ev-tab:not(.is-current):not(.last)'],
  ['ev tab last', 'a.ev-tab.last.w-inline-block.w-tab-link', '.ev-tab.last'],
  ['cta', 'section.cta-section', '.cta-section'],
  ['footer', 'section.footer.section', 'section.footer.section'],
  ['footer bottom', 'div.footer-bottom-wrap', '.footer-bottom-wrap'],
];
const browser = await chromium.launch();
const report = {};
for (const w of widths) {
  const live = Object.fromEntries(JSON.parse(fs.readFileSync(`${ROOT}/recon/pages/compare/compare-${w}.json`)).els.map((e) => [e.key, e]));
  const page = await browser.newPage({ viewport: { width: w, height: H[w] }, deviceScaleFactor: 1 });
  const errors = [], external = [], failed = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data')) external.push(r.url()) });
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  await page.goto('http://127.0.0.1:5179/compare', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (SHOTS) await page.screenshot({ path: `${ROOT}/recon/build-compare/clone-${w}-top.png` });
  const sh = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < sh; y += Math.round(H[w] * 0.8)) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(40); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
  const r = await page.evaluate((MAP) => {
    const out = {};
    for (const [label, , sel] of MAP) {
      const e = document.querySelector(sel); if (!e) { out[label] = null; continue; }
      const b = e.getBoundingClientRect(); const c = getComputedStyle(e);
      out[label] = { x: +b.x.toFixed(2), y: +(b.y + scrollY).toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), fs: c.fontSize, color: c.color, bg: c.backgroundColor, op: c.opacity };
    }
    return { docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth, overflowX: document.documentElement.scrollWidth > innerWidth,
      font: document.fonts.check('16px "Polysans Neutral"'), fontStatus: [...document.fonts].map((f) => f.family + ':' + f.status).join(','), title: document.title, els: out };
  }, MAP);
  if (SHOTS) await page.screenshot({ path: `${ROOT}/recon/build-compare/clone-${w}-full.png`, fullPage: true });
  console.log(`\n######## ${w}  docH clone ${r.docH} live ${LIVE_DOC[w]} (Δ ${(r.docH - LIVE_DOC[w]).toFixed(1)})  overflowX ${r.overflowX} (docW ${r.docW})  font ${r.font} [${r.fontStatus}]  title "${r.title}"`);
  console.log(`   console errors: ${errors.length}${errors.length ? ' ' + JSON.stringify(errors.slice(0, 5)) : ''} | external requests: ${external.length}${external.length ? ' ' + JSON.stringify(external.slice(0, 5)) : ''} | 4xx/5xx: ${failed.length}${failed.length ? ' ' + JSON.stringify(failed.slice(0, 5)) : ''}`);
  let bad = 0;
  for (const [label, key] of MAP) {
    const c = r.els[label], l = live[key];
    if (!c) { console.log(`   MISSING clone ${label}`); bad++; continue; }
    if (!l) { console.log(`   (no live) ${label}: ${c.x},${c.y} ${c.w}x${c.h} fs ${c.fs}`); continue; }
    const d = ['x', 'y', 'w', 'h'].map((k) => [k, +(c[k] - l.rect[k]).toFixed(2)]).filter(([, v]) => Math.abs(v) > 1);
    const fsd = l.fontSize && Math.abs(parseFloat(c.fs) - parseFloat(l.fontSize)) > 0.1 ? ` fs ${l.fontSize}→${c.fs}` : '';
    const flag = d.length || fsd ? '!!' : 'ok';
    if (flag === '!!') bad++;
    if (flag === '!!' || process.argv.includes('--all')) console.log(`   ${flag} ${label.padEnd(24)} live ${l.rect.x},${l.rect.y} ${l.rect.w}x${l.rect.h} | clone ${c.x},${c.y} ${c.w}x${c.h}${d.length ? ' Δ ' + d.map(([k, v]) => k + v).join(' ') : ''}${fsd}`);
  }
  console.log(`   mismatches (>1px or fs): ${bad}/${MAP.length}`);
  report[w] = { ...r, errors, external, failed };
  await page.close();
}
fs.writeFileSync(`${ROOT}/recon/build-compare/clone-measure.json`, JSON.stringify(report, null, 1));
await browser.close();
