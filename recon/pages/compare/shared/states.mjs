// States + motion sampling for /compare, /book-a-demo, legal. Output: <family>/states-*.json + screenshots.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const OUT = '/Users/riyaghosh/V3/transform/recon/pages'; // run from compare/shared; writes states.json next to this script
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 };
const browser = await chromium.launch();
const SAMPLER = `(() => {
  const S = window.__s = []; const t0 = performance.now();
  const q = (s) => document.querySelector(s);
  const f = () => {
    const g = (s, p) => { const e = q(s); if (!e) return null; const c = getComputedStyle(e); return p === 'w' ? +e.getBoundingClientRect().width.toFixed(1) : p === 'h' ? +e.getBoundingClientRect().height.toFixed(1) : c[p]; };
    S.push({ t: Math.round(performance.now() - t0), html: document.documentElement.className.includes('w-mod-ix3'),
      pre: g('.preloader-wrap', 'opacity'), preVis: g('.preloader-wrap', 'visibility'), nav: g('.nav-menu', 'opacity'), navVis: g('.nav-menu', 'visibility'), px: g('.bg-pixels-wrapper', 'opacity'),
      ov: g('.bg-pixels-overlay', 'opacity'), L: g('.hero-bottom-block.left', 'opacity'), R: g('.hero-bottom-block.right', 'opacity'), FW: g('.hero-bottom-block.full-width', 'opacity'),
      lh: g('.line-hor.on-hero', 'w'), lv: g('.line-vert', 'h') });
    if (performance.now() - t0 < 5000) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
})();`;
async function open(path, w, init) {
  const ctx = await browser.newContext({ viewport: { width: w, height: H[w] }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  if (init) await page.addInitScript(init);
  await page.goto('https://www.transform9.com' + path, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}
const res = {};
// 1. Intro timeline sampling (terms, compare, book-a-demo) @1440
for (const [name, path] of [['legal', '/terms-of-use'], ['compare', '/compare'], ['book-a-demo', '/book-a-demo']]) {
  const { ctx, page } = await open(path, 1440, SAMPLER);
  await page.waitForTimeout(5500);
  const s = await page.evaluate(() => window.__s);
  // keep only samples where something changes
  const keep = s.filter((x, i) => i === 0 || JSON.stringify({ ...x, t: 0 }) !== JSON.stringify({ ...s[i - 1], t: 0 }));
  res[name + '-intro'] = keep;
  await ctx.close();
}
// 2. Compare hovers/tabs @1440
{
  const { ctx, page } = await open('/compare', 1440);
  await page.waitForTimeout(2500);
  const r = {};
  const cs = (sel, props) => page.evaluate(([sel, props]) => { const e = document.querySelector(sel); if (!e) return null; const c = getComputedStyle(e); const o = {}; for (const p of props) o[p] = c[p]; const b = e.getBoundingClientRect(); o.rect = [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(1)); return o; }, [sel, props]);
  const scrollTo = async (sel) => { await page.evaluate((sel) => { const e = document.querySelector(sel); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 200); }, sel); await page.waitForTimeout(900); };
  // privacy block hover
  await scrollTo('.privacy-block');
  const pb = page.locator('.privacy-block').first();
  r.privacyBefore = { block: await cs('.privacy-block', ['backgroundColor']), head: await cs('.privacy-block .privacy-head', ['color']), text: await cs('.privacy-block .privacy-text', ['color']) };
  await pb.hover(); await page.waitForTimeout(80);
  r.privacyMid80 = { block: await cs('.privacy-block', ['backgroundColor']) };
  await page.waitForTimeout(500);
  r.privacyHover = { block: await cs('.privacy-block', ['backgroundColor']), head: await cs('.privacy-block .privacy-head', ['color']), text: await cs('.privacy-block .privacy-text', ['color']) };
  await page.screenshot({ path: `${OUT}/compare/state-1440-privacy-hover.png` });
  await page.mouse.move(5, 5); await page.waitForTimeout(500);
  r.privacyAfter = { block: await cs('.privacy-block', ['backgroundColor']), head: await cs('.privacy-block .privacy-head', ['color']), text: await cs('.privacy-block .privacy-text', ['color']) };
  // ev tabs
  await scrollTo('.ev-tabs');
  const tabs = page.locator('.ev-tab');
  r.evBefore = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, color: getComputedStyle(t).color, h: t.getBoundingClientRect().height, text: getComputedStyle(t.querySelector('.ev-tab-text')).display })));
  await tabs.nth(1).hover(); await page.waitForTimeout(400);
  r.evHover2 = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, text: getComputedStyle(t.querySelector('.ev-tab-text')).display })));
  await tabs.nth(1).click(); await page.waitForTimeout(30);
  r.evClick2_30ms = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, text: getComputedStyle(t.querySelector('.ev-tab-text')).display, h: t.getBoundingClientRect().height })));
  await page.waitForTimeout(600);
  r.evClick2 = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, color: getComputedStyle(t).color, text: getComputedStyle(t.querySelector('.ev-tab-text')).display, h: +t.getBoundingClientRect().height.toFixed(2) })));
  await page.screenshot({ path: `${OUT}/compare/state-1440-ev-tab2.png` });
  // click current tab again (toggle?)
  await tabs.nth(1).click(); await page.waitForTimeout(500);
  r.evClick2Again = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), text: getComputedStyle(t.querySelector('.ev-tab-text')).display })));
  // specialty wh tabs hover
  await scrollTo('.specialty-tabs.wh');
  const st = page.locator('.specialty-tab-link.wh');
  r.spBefore = await page.evaluate(() => [...document.querySelectorAll('.specialty-tab-link.wh')].slice(0, 3).map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, color: getComputedStyle(t.firstElementChild).color, pt: getComputedStyle(t).paddingTop, pl: getComputedStyle(t).paddingLeft, h: t.getBoundingClientRect().height })));
  await st.nth(2).hover(); await page.waitForTimeout(400);
  r.spHover3 = await page.evaluate(() => ({ tabs: [...document.querySelectorAll('.specialty-tab-link.wh')].slice(0, 3).map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, color: getComputedStyle(t.firstElementChild).color, pl: getComputedStyle(t).paddingLeft, transition: getComputedStyle(t).transition })), pane: [...document.querySelectorAll('.specialty-tabs.wh .w-tab-pane')].findIndex((p) => getComputedStyle(p).display !== 'none'), navBg: getComputedStyle(document.querySelector('.nav-menu')).backgroundColor, navLink: getComputedStyle(document.querySelector('.nav-link-block')).color }));
  await page.screenshot({ path: `${OUT}/compare/state-1440-specialty-wh-hover.png` });
  // integration wh hover
  await scrollTo('.integration-section.white');
  const ib = page.locator('a.integration-block.wh').nth(2);
  r.integBefore = await ib.evaluate((e) => getComputedStyle(e).backgroundColor);
  await ib.hover({ force: true }); await page.waitForTimeout(80); r.integMid80 = await ib.evaluate((e) => getComputedStyle(e).backgroundColor);
  await page.waitForTimeout(400); r.integHover = await ib.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, logos: [...e.querySelectorAll('img')].map((i) => [i.className, getComputedStyle(i).opacity, getComputedStyle(i).display]) }));
  await page.screenshot({ path: `${OUT}/compare/state-1440-integration-wh-hover.png` });
  await page.mouse.move(5, 5); await page.waitForTimeout(400); r.integAfter = await ib.evaluate((e) => getComputedStyle(e).backgroundColor);
  // compare-demo link underline hover
  await scrollTo('.table-bottom-right');
  const cl = page.locator('.table-bottom-right .hero-cta-link');
  await cl.hover(); await page.waitForTimeout(120);
  r.ctaUnderline120 = await cl.evaluate((e) => [...e.querySelectorAll('.underline')].map((u) => u.getBoundingClientRect().width));
  await page.waitForTimeout(600);
  r.ctaUnderline720 = await cl.evaluate((e) => [...e.querySelectorAll('.underline')].map((u) => u.getBoundingClientRect().width));
  // table row hover check (any change?)
  const row = page.locator('.table-row:not(.head)').first();
  const rb = await row.evaluate((e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e.querySelector('.t9')).backgroundColor]);
  await row.hover(); await page.waitForTimeout(400);
  r.tableRowHover = { before: rb, after: await row.evaluate((e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e.querySelector('.t9')).backgroundColor]) };
  // nav state across sections (scroll sample)
  const pts = await page.evaluate(() => { const o = {}; for (const s of ['.access-section', '.white-section', '.specialty-white', '.integration-section.white', '.transition-cont.white-to-black', '.privacy-section']) { const e = document.querySelector(s); o[s] = [Math.round(e.getBoundingClientRect().top + window.scrollY), Math.round(e.getBoundingClientRect().height)]; } return o; });
  r.sectionY = pts;
  r.navByScroll = [];
  for (const y of [pts['.white-section'][0] - 100, pts['.white-section'][0] - 40, pts['.white-section'][0] + 400, pts['.white-section'][0] + pts['.white-section'][1] - 100, pts['.white-section'][0] + pts['.white-section'][1] + 100]) {
    await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(700);
    r.navByScroll.push({ y, nav: await page.evaluate(() => ({ bg: getComputedStyle(document.querySelector('.nav-menu')).backgroundColor, link: getComputedStyle(document.querySelector('.nav-link-block')).color, logoB: getComputedStyle(document.querySelector('.logo-black')).opacity, px: getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity })) });
  }
  res['compare-1440'] = r;
  await ctx.close();
}
// 3. Compare mobile / tablet specifics
for (const w of [390, 768]) {
  const { ctx, page } = await open('/compare', w);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/compare/compare-${w}-hero.png` });
  const r = {};
  // sticky table header
  const y0 = await page.evaluate(() => { const e = document.querySelector('.table-row.head'); return e.getBoundingClientRect().top + window.scrollY; });
  await page.evaluate((y) => window.scrollTo(0, y + 700), y0); await page.waitForTimeout(900);
  r.tableHeadAfterScroll = await page.evaluate(() => { const e = document.querySelector('.table-row.head'); const b = e.getBoundingClientRect(); return { top: b.top, h: b.height, pos: getComputedStyle(e).position }; });
  await page.screenshot({ path: `${OUT}/compare/state-${w}-table-sticky.png` });
  // ev tab click at mobile
  await page.evaluate(() => document.querySelector('.ev-tabs').scrollIntoView()); await page.waitForTimeout(800);
  await page.locator('.ev-tab').nth(2).click(); await page.waitForTimeout(600);
  r.ev3 = await page.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => ({ cur: t.classList.contains('w--current'), text: getComputedStyle(t.querySelector('.ev-tab-text')).display, h: +t.getBoundingClientRect().height.toFixed(2) })));
  await page.screenshot({ path: `${OUT}/compare/state-${w}-ev-tab3.png` });
  // specialty wh tap
  await page.evaluate(() => document.querySelector('.specialty-tabs.wh').scrollIntoView()); await page.waitForTimeout(800);
  await page.locator('.specialty-tab-link.wh').nth(1).click(); await page.waitForTimeout(400);
  r.sp2 = await page.evaluate(() => [...document.querySelectorAll('.specialty-tab-link.wh')].slice(0, 3).map((t) => ({ cur: t.classList.contains('w--current'), bg: getComputedStyle(t).backgroundColor, color: getComputedStyle(t.firstElementChild).color, pl: getComputedStyle(t).paddingLeft, pt: getComputedStyle(t).paddingTop })));
  await page.screenshot({ path: `${OUT}/compare/state-${w}-specialty-wh.png` });
  res['compare-' + w] = r;
  await ctx.close();
}
// 4. Book-a-demo form states
for (const w of [1440, 390]) {
  const { ctx, page } = await open('/book-a-demo', w);
  await page.waitForTimeout(2500);
  const r = {};
  const f = (sel) => page.evaluate((sel) => { const e = document.querySelector(sel); const c = getComputedStyle(e); return { border: c.borderTopColor + ' / ' + c.borderBottomColor, bg: c.backgroundColor, color: c.color, outline: c.outlineStyle + ' ' + c.outlineColor + ' ' + c.outlineWidth, shadow: c.boxShadow, transition: c.transition }; }, sel);
  r.inputDefault = await f('#first_name');
  await page.click('#first_name'); await page.waitForTimeout(300);
  r.inputFocus = await f('#first_name');
  await page.screenshot({ path: `${OUT}/book-a-demo/state-${w}-focus.png` });
  const btn = page.locator('input.w-button');
  r.btnDefault = await f('input.w-button');
  await btn.hover(); await page.waitForTimeout(300); r.btnHover = await f('input.w-button');
  // validation: click submit empty
  await btn.click(); await page.waitForTimeout(400);
  r.validation = await page.evaluate(() => [...document.querySelectorAll('#wf-form-T9-demo-form input')].map((i) => ({ name: i.name, valid: i.validity.valid, msg: i.validationMessage })));
  r.activeAfterSubmit = await page.evaluate(() => document.activeElement && document.activeElement.id);
  await page.fill('#email', 'not-an-email');
  r.emailMsg = await page.evaluate(() => document.querySelector('#email').validationMessage);
  r.labels = await page.evaluate(() => [...document.querySelectorAll('#wf-form-T9-demo-form label')].map((l) => ({ t: l.textContent, color: getComputedStyle(l).color, fw: getComputedStyle(l).fontWeight })));
  // force success / fail blocks visible for screenshots (no submission)
  await page.evaluate(() => { const d = document.querySelector('.w-form-done'); d.style.display = 'block'; document.querySelector('#wf-form-T9-demo-form').style.display = 'none'; });
  r.done = await f('.w-form-done');
  r.doneRect = await page.evaluate(() => { const b = document.querySelector('.w-form-done').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
  await page.screenshot({ path: `${OUT}/book-a-demo/state-${w}-success-forced.png` });
  await page.evaluate(() => { document.querySelector('.w-form-done').style.display = 'none'; document.querySelector('#wf-form-T9-demo-form').style.display = ''; document.querySelector('.w-form-fail').style.display = 'block'; });
  r.fail = await f('.w-form-fail');
  r.failRect = await page.evaluate(() => { const b = document.querySelector('.w-form-fail').getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; });
  await page.screenshot({ path: `${OUT}/book-a-demo/state-${w}-fail-forced.png` });
  // noise overlay pointer-events
  r.noise = await page.evaluate(() => { const n = document.querySelector('.book-demo-form-noise'); const c = getComputedStyle(n); return { pe: c.pointerEvents, z: c.zIndex, op: c.opacity }; });
  // scroll: bg video fade (hide-on-scroll) + footer reveal
  await page.evaluate(() => window.scrollTo(0, 200)); await page.waitForTimeout(900);
  r.scroll200 = await page.evaluate(() => ({ px: getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity, sy: scrollY }));
  await page.evaluate(() => window.scrollTo(0, 99999)); await page.waitForTimeout(900);
  r.bottom = await page.evaluate(() => ({ sy: scrollY, px: getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity }));
  await page.screenshot({ path: `${OUT}/book-a-demo/state-${w}-scrolled-bottom.png` });
  res['book-a-demo-' + w] = r;
  await ctx.close();
}
// 5. Legal: scroll fade + link hover
{
  const { ctx, page } = await open('/privacy-policy', 1440);
  await page.waitForTimeout(2500);
  const r = {};
  for (const y of [50, 89, 120, 400]) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(800); r['px@' + y] = await page.evaluate(() => getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity); }
  const a = page.locator('a.link-transp').first();
  await a.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
  r.linkBefore = await a.evaluate((e) => [getComputedStyle(e).opacity, getComputedStyle(e).transition]);
  await a.hover(); await page.waitForTimeout(400);
  r.linkHover = await a.evaluate((e) => [getComputedStyle(e).opacity, getComputedStyle(e).color]);
  r.navAtContent = await page.evaluate(() => getComputedStyle(document.querySelector('.nav-menu')).backgroundColor);
  res['legal-privacy-1440'] = r;
  await ctx.close();
}
fs.writeFileSync(`${OUT}/compare/shared/states.json`, JSON.stringify(res, null, 1));
console.log('done');
await browser.close();
