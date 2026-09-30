// Interaction/state checks + screenshots for Builder A sections at 1440 (and tasking at 768/390).
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
const OUT = '/Users/riyaghosh/V3/transform/recon/build-A';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
await p.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
const top = async (sel) => p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
// --- testimonials: arrow hover end state
let y = await top('.testimonials-slider'); await p.evaluate(v => scrollTo(0, v - 201.4), y); await p.waitForTimeout(300);
await p.hover('.test-arrow-wrap.right'); await p.waitForTimeout(100);
console.log('arrowHover', JSON.stringify(await p.evaluate(() => { const w = document.querySelector('.test-arrow-wrap.right'); return { bg: getComputedStyle(w).backgroundColor, rect: w.getBoundingClientRect().toJSON(), arrows: [...w.querySelectorAll('.arrow')].map(a => ({ x: a.getBoundingClientRect().x, t: getComputedStyle(a).transform })) }; })));
await p.screenshot({ path: `${OUT}/state-1440-arrow-hover.png` });
// --- next slide
await p.click('.test-arrow-wrap.right'); await p.mouse.move(10, 10); await p.waitForTimeout(200);
console.log('slideEnd', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.testim-slide')].map(s => ({ vis: getComputedStyle(s).visibility, op: getComputedStyle(s).opacity, x: s.getBoundingClientRect().x, count: s.querySelector('.sider-count').textContent })))));
await p.screenshot({ path: `${OUT}/state-1440-testimonial-2.png` });
await p.click('.test-arrow-wrap.right'); // clamp at end
console.log('afterExtraNext', await p.evaluate(() => document.querySelector('.testimonials-slider').dataset.current));
await p.click('.test-arrow-wrap.left'); await p.click('.test-arrow-wrap.left');
console.log('afterPrevPrev', await p.evaluate(() => document.querySelector('.testimonials-slider').dataset.current));
// --- HIW step states (attribute-driven)
y = await top('.how-works-sticky-cont');
for (const step of [0, 1, 2]) {
  await p.evaluate(({ v, step }) => { scrollTo(0, v); const s = document.querySelector('[data-section="how-it-works"]'); s.dataset.active = step; s.querySelectorAll('.hiw-right-wrap .hiw-text').forEach((w, i) => w.classList.toggle('is-active', i === step)); }, { v: y + 400, step });
  await p.waitForTimeout(150);
  console.log('hiw', step, JSON.stringify(await p.evaluate(() => ({ left: getComputedStyle(document.querySelector('.hiw-text-block.left')).transform, colors: [...document.querySelectorAll('.hiw-right-wrap .hiw-text')].map(w => getComputedStyle(w).color) }))));
  await p.screenshot({ path: `${OUT}/state-1440-hiw-step${step}.png` });
}
// --- stacking cards end state (attribute-driven, as Animation/prop would)
y = await top('.scheduling-card._4');
await p.evaluate(v => { const s = document.querySelector('[data-section="scheduling-agent"]'); s.dataset.stackStep = 3; [3, 2, 1].forEach((d, i) => { const c = s.querySelector(`.scheduling-card._${i + 1}`); c.dataset.depth = d; c.classList.add('is-stacked'); }); scrollTo(0, v - 300); }, y);
await p.waitForTimeout(300);
console.log('stack', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.scheduling-card')].map(c => ({ t: getComputedStyle(c).transform, bg: getComputedStyle(c).backgroundColor, top: c.getBoundingClientRect().top.toFixed(2) })))));
await p.screenshot({ path: `${OUT}/state-1440-stacking-cards.png` });
// --- tasking tabs
y = await top('[data-section="tasking-agent"]'); await p.evaluate(v => scrollTo(0, v + 10), y); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/state-1440-tasking-tab1.png` });
await p.click('.tab-link >> nth=2'); await p.waitForTimeout(300);
console.log('tabs', JSON.stringify(await p.evaluate(() => ({ cur: [...document.querySelectorAll('.tab-link')].map(t => t.classList.contains('w--current') + ':' + getComputedStyle(t).backgroundColor), panes: [...document.querySelectorAll('.tab-pane')].map(t => getComputedStyle(t).display) }))));
await p.screenshot({ path: `${OUT}/state-1440-tasking-tab3.png` });
for (const [w, h] of [[768, 1024], [390, 844]]) {
  await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(300);
  y = await top('[data-section="tasking-agent"]'); await p.evaluate(v => scrollTo(0, v - 60), y); await p.waitForTimeout(300);
  await p.click('.tab-link >> nth=1'); await p.waitForTimeout(200);
  console.log('tabs', w, JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.task-text-row')].map(t => getComputedStyle(t).display))));
  await p.screenshot({ path: `${OUT}/state-${w}-tasking.png` });
}
console.log('errors', errs);
await b.close();
