// Usage: node measureA.mjs [widths] [--shots]
// Measures Builder A sections on the clone and diffs against recon/measure-<w>.json (live).
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const ROOT = '/Users/riyaghosh/V3/transform';
const widths = (process.argv[2] || '1440,1024,768,390').split(',').map(Number);
const shots = process.argv.includes('--shots');
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 };
// [liveKey, cloneSelector, index]
const M = [
  ['section.testimonials', '[data-section="testimonials"]'],
  ['div.testimonials-top', '.testimonials-top'],
  ['div.testim-top-left', '.testim-top-left'],
  ['div.testim-top-right', '.testim-top-right'],
  ['h2.h1-text.white-text.testim-heading', '.testim-heading'],
  ['div.testimonials-slider.w-slider', '.testimonials-slider'],
  ['div.testim-slider-mask.w-slider-mask', '.testim-slider-mask'],
  ['div.testim-slide.w-slide', '.testim-slide'],
  ['div.testim-photo-block', '.testim-photo-block'],
  ['img.testim-photo', '.testim-photo'],
  ['div.testim-author-info-wrap', '.testim-author-info-wrap'],
  ['div.testim-author-name', '.testim-author-name'],
  ['div.testim-author-title', '.testim-author-title'],
  ['div.testim-right-side', '.testim-right-side'],
  ['p._30px-text.testimonial', '.testimonial'],
  ['span.testim-highlight', '.testim-highlight'],
  ['div.testim-bottom-cont', '.testim-bottom-cont'],
  ['div.testim-point-wrap', '.testim-point-wrap'],
  ['div._30px-text.white.testim-num', '.testim-num'],
  ['div._16px-text.white-text.testim-point', '.testim-point'],
  ['img.testim-logo', '.testim-logo'],
  ['div.sider-count', '.sider-count'],
  ['div._14px-text.white-text.slider-all', '.slider-all'],
  ['div.test-arrow-wrap.left.w-slider-arrow-left', '.test-arrow-wrap.left'],
  ['div.test-arrow-wrap.right.w-slider-arrow-right', '.test-arrow-wrap.right'],
  ['img.arrow.white', '.arrow.white'],
  ['img.arrow.black', '.arrow.black'],
  ['div.how-works-right.top', '.how-works-right.top'],
  ['div.how-works-sticky-cont', '.how-works-sticky-cont'],
  ['div.how-works-sticky', '.how-works-sticky'],
  ['div.how-works-right-text.top', '.how-works-right-text.top'],
  ['div.how-works-heads-wrap', '.how-works-heads-wrap'],
  ['div.hiw-left-wrap', '.hiw-left-wrap'],
  ['div.hiw-text-block.left-mob', '.hiw-text-block.left-mob'],
  ['div.hiw-right-wrap', '.hiw-right-wrap'],
  ['div.hiw-text-block', '.hiw-right-wrap .hiw-text-block'],
  ['div.h1-text.white-text.hiw-text._1', '.hiw-text._1'],
  ['div.h1-text.white-text.hiw-text._2', '.hiw-text._2'],
  ['div.hiw-text-block.last', '.hiw-text-block.last'],
  ['div.h1-text.white-text.hiw-text._3', '.hiw-text._3'],
  ['div.how-works-right.medium', '.how-works-right.medium'],
  ['div.hiw-trigger._1', '.hiw-trigger._1'],
  ['div.hiw-trigger.space', '.hiw-trigger.space'],
  ['div.how-works-right.full', '.how-works-right.full'],
  ['div.how-works-right-text.bottom-w-text', '.how-works-right-text.bottom-w-text'],
  ['div._16px-text.white-text.hiw-bottom', '.hiw-bottom'],
  ['div.how-works-right-text.bottom', '.how-works-right-text.bottom'],
  ['section.white-section', '[data-section="white-section"]'],
  ['div.transition-cont.black-to-white', '.transition-cont.black-to-white'],
  ['div.grid-row._1.b-w', '.black-to-white .transition-wrap.white .grid-row._1'],
  ['div.pixel', '.black-to-white .transition-wrap.white .pixel'],
  ['div.pixel.blue', '.black-to-white .pixel.blue'],
  ['div.right-side-w-line', '.right-side-w-line'],
  ['div.stacking-cards-section.schudule-agent', '[data-section="scheduling-agent"]'],
  ['div.horizontal-wrap.scheduling', '.horizontal-wrap.scheduling'],
  ['div.left-side.our-products', '.left-side.our-products'],
  ['div.right-side.agent.schedule', '.right-side.agent.schedule'],
  ['h2.h1-text.agent.sch', '.h1-text.agent.sch'],
  ['div._16px-text.num-agent-1', '.num-agent-1'],
  ['div.sheduling-top-space', '.sheduling-top-space'],
  ['div.scheduling-cards', '.scheduling-cards'],
  ['div.scheduling-card._1', '.scheduling-card._1'],
  ['div._30px-text.white.stack-card-left', '.stack-card-left'],
  ['div.stack-card-text-wrap', '.stack-card-text-wrap'],
  ['div._30px-text.white.stack-card-head', '.stack-card-head'],
  ['div._14px-text.white-text.stack-card-text', '.stack-card-text'],
  ['img.sch-img._1', '.sch-img._1'],
  ['div.bg-noise.cards', '.bg-noise.cards'],
  ['div.scheduling-card._2', '.scheduling-card._2'],
  ['div._30px-text.white.stack-card-head._2', '.stack-card-head._2'],
  ['div.scheduling-card._3', '.scheduling-card._3'],
  ['div.scheduling-card._4', '.scheduling-card._4'],
  ['img.sch-img._4', '.sch-img._4'],
  ['div.half-split-wrap', '[data-section="tasking-agent"]'],
  ['div.half-split-section', '.half-split-section'],
  ['div.tabs.w-tabs', '.half-split-section .tabs'],
  ['div.tabs-menu.w-tab-menu', '.tabs-menu'],
  ['a.tab-link.w-inline-block.w-tab-link.w--current', '.tab-link.w--current'],
  ['a.tab-link.w-inline-block.w-tab-link', '.tab-link:not(.w--current)'],
  ['div._14px-text.white-text.task-text-row', '.tab-link.w--current .task-text-row'],
  ['div.tabs-content.w-tab-content', '.tabs-content'],
  ['div.tab-pane-wrap', '.tab-pane.w--tab-active .tab-pane-wrap'],
  ['div.task-img-wrap', '.tab-pane.w--tab-active .task-img-wrap'],
  ['img.task-img', '.tab-pane.w--tab-active .task-img'],
  ['div._14px-text.white-text.task-text', '.tab-pane.w--tab-active .task-text'],
  ['div.half-head-text-wrap.task-agent', '.half-head-text-wrap.task-agent'],
  ['h2.h1-text.agent.task', '.h1-text.agent.task'],
  ['div.transition-cont.white-to-black', '.transition-cont.white-to-black'],
  ['div.pixel.black', '.pixel.black'],
  ['div.bg-noise.b-to-w', '.bg-noise.b-to-w'],
  ['div.row-tabs-section', '.row-tabs-section'],
  ['section.specialty-section', '.specialty-section'],
];
const PROPS = ['fontSize', 'lineHeight', 'color', 'backgroundColor', 'paddingTop', 'paddingLeft', 'marginTop', 'marginBottom', 'marginLeft', 'borderLeft', 'borderTop', 'borderBottom', 'position', 'display', 'opacity', 'maxWidth'];
const browser = await chromium.launch();
const report = {};
for (const w of widths) {
  const live = Object.fromEntries(JSON.parse(fs.readFileSync(`${ROOT}/recon/measure-${w}.json`)).els.map(e => [e.key, e]));
  const page = await browser.newPage({ viewport: { width: w, height: H[w] } });
  const errors = [], external = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('request', r => { const u = r.url(); if (!/^(https?:\/\/(127\.0\.0\.1|localhost)|data:|blob:)/.test(u)) external.push(u); });
  await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // trigger lazy images
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(400);
  const res = await page.evaluate(({ M, PROPS }) => {
    const out = {};
    for (const [k, sel] of M) {
      const el = document.querySelector(sel);
      if (!el) { out[k] = null; continue; }
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      out[k] = { rect: { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }, ...Object.fromEntries(PROPS.map(p => [p, cs[p]])) };
    }
    return { out, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight };
  }, { M, PROPS });
  const lines = [];
  for (const [k] of M) {
    if (only && !k.includes(only)) continue;
    const c = res.out[k], l = live[k];
    if (!c) { lines.push(`MISSING clone ${k}`); continue; }
    if (!l) { lines.push(`(no live) ${k} ${JSON.stringify(c.rect)}`); continue; }
    const d = [];
    for (const g of ['x', 'y', 'w', 'h']) { const a = l.rect[g], b = c.rect[g]; if (Math.abs(a - b) > 1) d.push(`${g} ${a.toFixed(1)}→${b.toFixed(1)}`); }
    for (const p of PROPS) { if (l[p] === undefined) continue; let a = String(l[p]), b = String(c[p]);
      if (/^[\d.]+px$/.test(a) && /^[\d.]+px$/.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= 0.3) continue;
      if (p === 'opacity' && k.includes('pixel')) continue;
      if (/^border/.test(p) && a.startsWith('0px') && b.startsWith('0px')) continue;
      if (a !== b) d.push(`${p} ${a}→${b}`); }
    lines.push(`${d.length ? 'DIFF' : 'ok  '} ${k}  [${c.rect.x.toFixed(1)},${c.rect.y.toFixed(1)} ${c.rect.w.toFixed(1)}x${c.rect.h.toFixed(1)}] ${d.join(' | ')}`);
  }
  console.log(`\n######## ${w}  docW=${res.docW} (overflow ${res.docW > w}) docH=${res.docH} errors=${errors.length} external=${external.length}`);
  errors.forEach(e => console.log('  ERR', e.slice(0, 200))); external.forEach(e => console.log('  EXT', e));
  console.log(lines.join('\n'));
  report[w] = { res, errors, external };
  if (shots) {
    for (const [name, sel] of [['testimonials', '[data-section="testimonials"]'], ['how-it-works', '[data-section="how-it-works"]'], ['transition-b2w', '.transition-cont.black-to-white'], ['scheduling', '[data-section="scheduling-agent"]'], ['tasking', '[data-section="tasking-agent"]'], ['transition-w2b', '.transition-cont.white-to-black']]) {
      const el = await page.$(sel); if (!el) continue;
      const bb = await el.boundingBox(); if (!bb) continue;
      await page.evaluate(y => window.scrollTo(0, y), 0);
      const top = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
      const hh = await page.evaluate(s => document.querySelector(s).getBoundingClientRect().height, sel);
      await page.screenshot({ path: `${ROOT}/recon/build-A/clone-${w}-${name}.png`, fullPage: true, clip: { x: 0, y: top, width: w, height: Math.min(hh, 4000) } });
    }
  }
  await page.close();
}
fs.writeFileSync(`${ROOT}/recon/build-A/tools/last.json`, JSON.stringify(report, null, 1));
await browser.close();
