// Usage: node measure.mjs <side:live|clone> <outfile> [widths] [shots-prefix]
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';

const side = process.argv[2];
const out = process.argv[3];
const widths = (process.argv[4] || '1440,1200,1024,768,600,390').split(',').map(Number);
const shotDir = process.argv[5] || '';
const URL = side === 'live' ? 'https://www.transform9.com/' : 'http://127.0.0.1:5179/';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };

// [key, liveSelector, cloneSelector, index(default 0 | 'all'), anchorKey]
const L = (k, l, c, i = 0, a = null) => [k, l, c ?? l, i, a];
const SPEC = [
  // NAV
  L('nav', '.nav-menu', '.nav-menu'),
  L('nav.logoWrap', '.nav-menu .logo-wrap'),
  L('nav.logo', '.nav-menu .logo-white'),
  L('nav.links', '.nav-menu .nav-links'),
  L('nav.linksLeft', '.nav-menu .nav-links-left'),
  L('nav.linksRight', '.nav-menu .nav-links-right'),
  L('nav.link', '.nav-menu .nav-link-block', null, 'all'),
  L('nav.textWrap', '.nav-menu .nav-text-wrap', null, 0),
  L('nav.text', '.nav-menu .nav-text', null, 0),
  L('nav.menuBtn', '.nav-menu .menu-btn'),
  L('nav.burger', '.nav-menu .burger-white'),
  L('nav.cross', '.nav-menu .nav-cross-white'),
  L('nav.menuBtnWrap', '.nav-menu .menu-btn-wrap'),
  // HERO
  L('hero', 'section.hero.home', '.hero.home'),
  L('hero.h1', 'h1.white-text.hero-home', '.hero .hero-heading'),
  L('hero.span3', '.head-span-3'),
  L('hero.bottom', '.hero .hero-home-bottom'),
  L('hero.blockL', '.hero .hero-bottom-block.left'),
  L('hero.blockR', '.hero .hero-bottom-block.right'),
  L('hero.labelL', '.hero .hero-bottom-block.left ._16px-text', '.hero .hero-bottom-block.left .label-16'),
  L('hero.labelR', '.hero .hero-bottom-block.right ._16px-text', '.hero .hero-bottom-block.right .label-16'),
  L('hero.p', '.home-hero-text'),
  L('hero.inputWrap', '.hero .input-hero-wrap'),
  L('hero.input', '.hero .input-white'),
  L('hero.cta', '.hero .hero-cta-link'),
  L('hero.ctaText', '.hero .hero-cta-link ._56-px-text', '.hero .hero-cta-link .text-56'),
  L('hero.underline', '.hero .hero-cta-link .underline._1'),
  L('hero.lineVert', '.hero .line-vert'),
  L('hero.lineHor', '.hero .line-hor'),
  // LOGOS
  L('logos', 'section.client-logos'),
  L('logos.track', '.logos-wrapper', null, 0),
  L('logos.logo0', '.logos-wrapper .client-logo:not(.hide)', null, 0),
  L('logos.logo1', '.logos-wrapper .client-logo:not(.hide)', null, 1),
  L('logos.sbj', '.logos-wrapper .client-logo.sbj', null, 0),
  L('logos.logo12', '.logos-wrapper .client-logo:not(.hide)', null, 12),
  // SPOTLIGHT
  L('spot', '.div-block-5'),
  L('spot.h2', '.div-block-5 h2'),
  L('spot.span', '.text-span-14'),
  L('spot.wrap', '.div-block-6'),
  L('spot.fig', '.yt-facade'),
  L('spot.thumb', '.yt-facade__thumb'),
  L('spot.play', '.yt-facade__play'),
  L('spot.svg', '.yt-facade__play svg'),
  // STATS
  L('stats', 'section.stats'),
  L('stats.left', '.stats-left'),
  L('stats.text', '.stats-left .stats-text'),
  L('stats.span', '.stats-span'),
  L('stats.img', '.img-stats'),
  L('stats.right', '.stats-right'),
  L('stats.block', '.stats-block', null, 'all'),
  L('stats.idx', '.stats-block ._14px-text', '.stats-block .text-14-white', 0),
  L('stats.bottom', '.stats-block .stats-bottom', null, 0),
  L('stats.head', '.stats-block .stat-head', null, 'all'),
  L('stats.descr', '.stats-block .stat-descr', null, 'all'),
  L('stats.imgWrap', '.stats-block .stats-img-wrap', null, 'all'),
  // FOOTER TOP (anchored to section.footer)
  L('ft', 'section.footer', 'section.footer', 0, 'ft'),
  L('ft.topWrap', '.footer-top-wrap', null, 0, 'ft'),
  L('ft.row', '.footer-top-row', null, 0, 'ft'),
  L('ft.left', '.footer-top-left', null, 0, 'ft'),
  L('ft.blurb', '.footer-top-left ._14px-text', '.footer-top-left .footer-transp', 0, 'ft'),
  L('ft.rightSide', '.footer-top-row .right-side', '.footer-top-right-side', 0, 'ft'),
  L('ft.cols', '.footer-columns-wrap', null, 0, 'ft'),
  L('ft.col', '.footer-column', null, 'all', 'ft'),
  L('ft.colHead', '.footer-column > ._14px-text', '.footer-column > .footer-transp', 0, 'ft'),
  L('ft.link', '.footer-column .footer-link-wrap', null, 0, 'ft'),
  L('ft.linkText', '.footer-column .footer-link', null, 0, 'ft'),
  L('ft.topRight', '.footer-top-row .footer-top-right:not(.right-side)', '.footer-top-right', 0, 'ft'),
  L('ft.subs', '.footer-subs-wrap', null, 0, 'ft'),
  L('ft.center', '.footer-bottom-center', null, 0, 'ft'),
  L('ft.contactHead', '.footer-bottom-center > ._14px-text', '.footer-bottom-center > .footer-transp', 0, 'ft'),
  L('ft.mail', '.footer-bottom-center ._w-underline', '.footer-bottom-center .w-underline-link', 0, 'ft'),
  L('ft.phone', '.text-block-4', null, 0, 'ft'),
  L('ft.bRight', '.footer-bottom-right', null, 0, 'ft'),
  L('ft.stayHead', '.footer-bottom-right > ._14px-text', '.footer-bottom-right > .footer-transp', 0, 'ft'),
  L('ft.hs', '.footer-bottom-right iframe, .footer-bottom-right .hbspt-form', '.hs-embed', 0, 'ft'),
  // FOOTER BOTTOM (anchored)
  L('fb', '.footer-bottom-wrap', null, 0, 'fb'),
  L('fb.logoWrap', '.footer-logo-wrap', null, 0, 'fb'),
  L('fb.logo', '.footer-logo', null, 0, 'fb'),
  L('fb.row', '.footer-bottom-row', null, 0, 'fb'),
  L('fb.copy', '.footer-bottom-row > div', null, 0, 'fb'),
  L('fb.legal', '.footer-bottom-row a', null, 'all', 'fb'),
];
const MODAL = [
  L('m.wrap', '.modal-wrap'),
  L('m.win', '.modal-window'),
  L('m.logo', '.logo-white.popup'),
  L('m.head', '.popup-head', null, 0),
  L('m.span', '.popup-head .text-span-8', null, 0),
  L('m.form', '#wf-form-Get-a-Call-Form'),
  L('m.row', '.form-row', null, 'all'),
  L('m.label', '.input-wrap .label, .input-wrap label', null, 0),
  L('m.input', '.form-input', null, 'all'),
  L('m.disc', '.popup-disc'),
  L('m.legal', '.popup-disc a', null, 0),
  L('m.bottom', '.popup-bottom-wrap'),
  L('m.captcha', '.captcha-popup'),
  L('m.submitWrap', '.submit-form-wrap'),
  L('m.submit', '.submit-form'),
  L('m.close', '.close-popup-wrap'),
  L('m.closeIcon', '.close-popup-wrap img', null, 0),
  L('m.success', '.success-popup-call-wrap'),
  L('m.successHead', '.success-popup-call-wrap .popup-head'),
  L('m.successTxt', '.success-popup-call-wrap ._16px-text', '.success-popup-call-wrap .label-16'),
  L('m.error', '.error-message.popup'),
  L('m.errorTxt', '.error-message.popup div', null, 0),
];

const PROPS = ['display', 'position', 'fontFamily', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'whiteSpace', 'color',
  'backgroundColor', 'backgroundImage', 'opacity', 'transform', 'padding', 'margin', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
  'boxShadow', 'backdropFilter', 'flexBasis', 'overflow', 'maxWidth', 'minHeight', 'textAlign', 'gap', 'justifyContent', 'alignItems', 'flexDirection', 'visibility', 'zIndex', 'objectFit', 'textDecorationLine'];

async function measure(page, spec, side) {
  return page.evaluate(({ spec, PROPS, side }) => {
    const res = {};
    const anchors = {};
    for (const [key, ls, cs, idx, anchor] of spec) {
      const sel = side === 'live' ? ls : cs;
      let nodes = [...document.querySelectorAll(sel)];
      if (idx !== 'all') nodes = nodes[idx] ? [nodes[idx]] : [];
      const list = nodes.map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const o = { x: +r.x.toFixed(1), y: +(r.y + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), vy: +r.y.toFixed(1) };
        for (const p of PROPS) o[p] = cs[p];
        const t = (el.innerText || '').trim().replace(/\s+/g, ' ');
        o.text = t.slice(0, 60);
        return o;
      });
      if (anchor && key === anchor && list[0]) anchors[anchor] = list[0].y;
      res[key] = { anchor, list };
    }
    for (const k in res) {
      const a = res[k].anchor;
      if (a && anchors[a] != null) for (const o of res[k].list) o.ry = +(o.y - anchors[a]).toFixed(1);
    }
    return res;
  }, { spec, PROPS, side });
}

const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}
*{caret-color:transparent!important}`;

const browser = await chromium.launch();
const result = { side, url: URL, widths: {} };
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const external = new Set();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!/^(https?:\/\/(127\.0\.0\.1|localhost)|data:|blob:)/.test(u)) external.add(u.slice(0, 120)); });
  const r = {};
  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(side === 'live' ? 3500 : 800);
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; }));
  r.fontOK = await page.evaluate(() => document.fonts.check('16px "Polysans Neutral"'));
  r.fontsLoaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight));
  r.docW = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth, document.body.scrollWidth]);
  r.docH = await page.evaluate(() => document.documentElement.scrollHeight);
  r.default = await measure(page, SPEC, side);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-top.png` });

  // stats hover (desktop) / accordion (tablet, mobile): state as-is plus hover block 2 at desktop
  if (w >= 992) {
    const blocks = await page.$$('.stats-block');
    await blocks[1].scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await blocks[1].hover();
    await page.waitForTimeout(1200);
    r.statsHover = await measure(page, SPEC.filter((s) => s[0].startsWith('stats')), side);
    if (shotDir) await (await page.$('section.stats')).screenshot({ path: `${shotDir}/${side}-${w}-stats-hover.png` });
    await page.mouse.move(5, 5);
    // nav hover
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const link = await page.$('.nav-menu .nav-link-block');
    await link.hover();
    await page.waitForTimeout(600);
    r.navHover = await measure(page, SPEC.filter((s) => s[0].startsWith('nav.text')), side);
    await page.mouse.move(700, 500);
  } else {
    const st = await page.$('section.stats');
    await st.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    if (shotDir) await st.screenshot({ path: `${shotDir}/${side}-${w}-stats.png` });
  }

  // footer at page bottom
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(side === 'live' ? 2500 : 700);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(800);
  r.bottom = await measure(page, SPEC.filter((s) => s[0].startsWith('f')), side);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-bottom.png` });
  // Footer-top in viewport
  await page.evaluate(() => { const f = document.querySelector('section.footer'); window.scrollTo(0, f.getBoundingClientRect().top + scrollY - 60); });
  await page.waitForTimeout(side === 'live' ? 1500 : 400);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-footer-top.png` });

  // mobile menu
  if (w < 992) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(side === 'live' ? 1200 : 300);
    await page.click('.nav-menu .menu-btn');
    await page.waitForTimeout(700);
    r.menu = await measure(page, SPEC.filter((s) => s[0].startsWith('nav')), side);
    r.menuDocW = await page.evaluate(() => document.documentElement.scrollWidth);
    if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-menu.png` });
    await page.click('.nav-menu .menu-btn');
    await page.waitForTimeout(500);
  }

  // popup
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(side === 'live' ? 1200 : 300);
  if (side === 'live') {
    await page.evaluate(() => document.querySelector('.hero .hero-cta-link').click());
  } else {
    await page.evaluate(() => document.querySelector('.hero .hero-cta-link').click());
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  r.modal = await measure(page, MODAL, side);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-modal.png` });
  // error state
  if (side === 'live') {
    await page.evaluate(() => { const e = document.querySelector('.error-message.popup'); if (e) e.style.display = 'block'; });
  } else {
    await page.goto(URL + '?popup=error'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
  }
  await page.waitForTimeout(300);
  r.modalError = await measure(page, MODAL, side);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-modal-error.png` });
  if (side === 'live') {
    await page.evaluate(() => {
      const e = document.querySelector('.error-message.popup'); if (e) e.style.display = 'none';
      document.querySelector('#wf-form-Get-a-Call-Form').style.display = 'none';
      document.querySelector('.success-popup-call-wrap').style.display = 'block';
    });
  } else {
    await page.goto(URL + '?popup=success'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
  }
  await page.waitForTimeout(300);
  r.modalSuccess = await measure(page, MODAL, side);
  if (shotDir) await page.screenshot({ path: `${shotDir}/${side}-${w}-modal-success.png` });
  r.consoleErrors = consoleErrors;
  r.external = side === 'clone' ? [...external] : external.size;
  result.widths[w] = r;
  await ctx.close();
  console.error('done', side, w);
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(result, null, 1));
