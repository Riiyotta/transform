// Usage: node states.mjs <live|clone> <out.json> <shotdir> [widths] [states]
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
import { dump } from './dump.mjs';
const [side, out, shotdir] = process.argv.slice(2, 5);
const widths = (process.argv[5] || '1440,390').split(',').map(Number);
const only = process.argv[6] && process.argv[6] !== 'all' ? process.argv[6].split(',') : null;
const URL = side === 'live' ? 'https://www.transform9.com/' : 'http://127.0.0.1:5179/';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
const live = side === 'live';
const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}*{caret-color:transparent!important}`;
fs.mkdirSync(shotdir, { recursive: true });
const browser = await chromium.launch(); const result = {};
const S = (n, s, sh) => [n, s, sh];
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: H[w] }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'load', timeout: 90000 }); await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(live ? 3000 : 600); await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; }));
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
  await page.waitForTimeout(live ? 1500 : 300);
  const R = (result[w] = {});
  const top = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
  const go = async (y) => { await page.evaluate((y) => scrollTo(0, y), Math.round(y)); await page.waitForTimeout(live ? 1500 : 300); };
  const snap = async (name, secs) => { await page.waitForTimeout(live ? 900 : 400); R[name] = await dump(page, secs); R[name].scrollY = await page.evaluate(() => scrollY); await page.screenshot({ path: `${shotdir}/${side}-${w}-${name}.png` }); };
  const want = (n) => !only || only.includes(n);
  const T = S('testimonials', 'section.testimonials');
  if (want('testim')) {
    await go(await top('.testimonials-slider') - 100);
    await page.hover('.test-arrow-wrap.right'); await snap('testim-arrow-hover', [T]);
    await page.click('.test-arrow-wrap.right'); await page.mouse.move(5, 400); await page.waitForTimeout(800); await snap('testim-slide2', [T]);
    await page.click('.test-arrow-wrap.left'); await page.mouse.move(5, 400); await page.waitForTimeout(800);
  }
  if (want('hiw') && w >= 768) {
    const y0 = await top('.how-works-sticky-cont');
    for (const [step, off] of [[1, 0.3], [2, 0.6]]) {
      const hh = await page.evaluate(() => document.querySelector('.how-works-sticky-cont').getBoundingClientRect().height);
      await go(y0 + hh * off);
      if (!live) await page.evaluate((step) => { const s = document.querySelector('[data-section="how-it-works"]'); s.dataset.active = step; s.querySelectorAll('.hiw-right-wrap .hiw-text').forEach((e, i) => e.classList.toggle('is-active', i === step)); }, step);
      await snap('hiw-step' + step, [S('how-it-works', 'section.how-it-works')]);
    }
  }
  if (want('stack')) {
    const y4 = await top('.scheduling-card._4');
    await go(y4 - (w >= 992 ? 0.1 * w : 0.3 * w + 59) + 5);
    if (!live) await page.evaluate(() => { const s = document.querySelector('[data-section="scheduling-agent"]'); s.dataset.stackStep = 3; [3, 2, 1].forEach((d, i) => { const c = s.querySelector(`.scheduling-card._${i + 1}`); c.dataset.depth = d; c.classList.add('is-stacked'); }); });
    await snap('stack-end', [S('scheduling', '.stacking-cards-section.schudule-agent')]);
  }
  if (want('tasking')) {
    await go(await top('.half-split-wrap') + 10);
    for (const i of [0, 1, 2]) { await page.click(`.half-split-wrap .tab-link >> nth=${i}`); await page.mouse.move(5, 5); await page.waitForTimeout(live ? 300 : 0); await snap('tasking-tab' + (i + 1), [S('tasking', '.half-split-wrap')]); }
  }
  if (want('nav')) {
    await go(await top('.row-tabs-section') + 100);
    await page.hover('.row-tab-link >> nth=2'); await snap('navigator-hover3', [S('navigator', '.row-tabs-section')]);
    await page.mouse.move(5, 5);
  }
  if (want('spec')) {
    await go(await top('section.specialty-section'));
    await page.hover('.specialty-tab-link >> nth=4'); await snap('specialty-hover5', [S('specialties', 'section.specialty-section')]);
    await page.mouse.move(5, 5);
  }
  if (want('integ')) {
    await go(await top('.integration-bottom-wrap') - 200);
    const bb = await page.evaluate(() => { const r = document.querySelector('.intagrations-row._1 .integration-block').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.mouse.move(bb.x, bb.y); await snap('integration-hover1', [S('integrations', 'section.integration-section')]);
    await page.mouse.move(5, 5);
  }
  if (want('sec')) {
    await go(await top('.secure-right-bottom-wrap') - 200);
    await page.hover('.secure-block >> nth=0'); await snap('secure-hover1', [S('security', 'section.secure-section')]);
    await page.mouse.move(5, 5);
  }
  if (want('cta')) {
    const C = S('cta', 'section.cta-section');
    await go(await top('section.cta-section .hero-home-bottom') - 300);
    await page.hover('section.cta-section .hero-cta-link.black'); await snap('cta-demo-hover', [C]);
    await page.hover('section.cta-section .get-a-call'); await snap('cta-callalex-hover', [C]);
    await page.focus('#input-footer-phone'); await page.mouse.move(5, 5); await snap('cta-input-focus', [C]);
    await page.keyboard.type('5551234567'); await snap('cta-input-typed', [C]);
    await page.evaluate(() => document.activeElement.blur());
  }
  if (want('onwhite')) {
    for (const [nm, sel, off] of [['onwhite-sched', '.stacking-cards-section.schudule-agent', 200], ['onwhite-nav', '.row-tabs-section', 50], ['onwhite-exit', '.transition-cont.white-to-black', 100]]) {
      await go(await top(sel) + off); await snap(nm, [S('nav', '.nav-menu')]);
    }
  }
  await page.close(); console.error('done', side, w);
}
fs.writeFileSync(out, JSON.stringify(result)); await browser.close();
