// Usage: node measure-b.mjs [widths] [--shots]
// Builder B verification: section heights, key element rects/fonts, console errors,
// non-localhost requests, horizontal overflow. Clone only (http://127.0.0.1:5179/).
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const widths = (process.argv[2] || '1440,1024,768,390').split(',').map(Number);
const shots = process.argv.includes('--shots');
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 };
const DIR = '/Users/riyaghosh/V3/transform/recon/build-B/';
const SEL = {
  navigator: '[data-section="navigator-agent"]', outreach: '[data-section="outreach-agent"]',
  specialties: '[data-section="specialties"]', integrations: '[data-section="integrations"]',
  security: '[data-section="security"]', cta: '[data-section="cta"]',
};
const KEYS = [
  ['nav.head', '.row-tabs-section h2'], ['nav.num', '.row-tabs-section .agent-num'],
  ['nav.hwrap', '.row-tabs-section .horizontal-wrap'], ['nav.tabs', '.row-tabs-section .row-tabs'],
  ['nav.menu', '.row-tabs-section .row-tabs-menu'], ['nav.link0', '.row-tabs-section .row-tab-link'],
  ['nav.head0', '.row-tabs-section .row-tab-head'], ['nav.text0', '.row-tabs-section .row-tab-text'],
  ['nav.content', '.row-tabs-section .row-tabs-content'], ['nav.imgwrap', '.row-tabs-section .is-active .nav-agent-img-wrap'],
  ['nav.img', '.row-tabs-section .is-active .nav-agent-img'],
  ['out.left', '.split-cards-left-wrap'], ['out.headwrap', '.split-cards-section .half-head-text-wrap'],
  ['out.head', '.split-cards-section h2'], ['out.leftBottom', '.out-left-bottom'], ['out.right', '.split-cards-right-wrap'],
  ['out.card1', '.out-card._1'], ['out.card5', '.out-card._5'], ['out.space', '.out-card.space'], ['out.title1', '.out-card._1 .out-card-title'],
  ['out.num1', '.out-card._1 .blue-card'], ['out.text1', '.out-card._1 .out-card-text-bottom'], ['out.icon1', '.out-card._1 .out-icon'],
  ['spec.left', '.specialty-section .left-side'], ['spec.title', '.specialty-title'], ['spec.span', '.text-span-13'],
  ['spec.tabs', '.specialty-tabs'], ['spec.menu', '.specialty-tabs-menu'], ['spec.link0', '.specialty-tab-link'],
  ['spec.link1', '.specialty-tab-link:nth-child(2)'], ['spec.content', '.specialty-tabs-content'], ['spec.img', '.specialty-tab-pane.is-active .specialty-img'],
  ['spec.bottom', '.specialty-bottom-row'], ['spec.bottomText', '.specialty-bottom-text'],
  ['int.top', '.integration-top-wrap'], ['int.head', '.integration-head'], ['int.topRight', '.integration-top-right-wrap'],
  ['int.text', '.integration-text'], ['int.label', '.integration-label'], ['int.bottom', '.integration-bottom-wrap'],
  ['int.row1', '.intagrations-row._1'], ['int.row2', '.intagrations-row._2'], ['int.block', '.integration-block'], ['int.logo', '.integration-logo.white'],
  ['sec.left', '.secure-section .left-side'], ['sec.right', '.secure-section .right-side'], ['sec.top', '.secure-right-top-wrap'],
  ['sec.head', '.secure-head'], ['sec.text', '.secure-text'], ['sec.bottom', '.secure-right-bottom-wrap'], ['sec.block0', '.secure-block'],
  ['sec.logoSm', '.secure-logo.white.sm'], ['sec.logoSoc', '.secure-logo.white:not(.sm)'],
  ['cta.trans', '.cta-section .transition-cont'], ['cta.row', '.cta-section .grid-row'], ['cta.content', '.cta-content-wrap'], ['cta.topWrap', '.cta-top-wrap'],
  ['cta.textTop', '.cta-text-top-wrap'], ['cta.left', '.cta-top-text-left'], ['cta.list', '.cta-top-text-list'], ['cta.right', '.cta-top-text-right'],
  ['cta.head', '.cta-heading'], ['cta.span', '.cta-head-span'], ['cta.bl', '.cta-section .hero-bottom-block.bottom-left'],
  ['cta.br', '.cta-section .hero-bottom-block.bottom-right'], ['cta.input', '#input-footer-phone'], ['cta.callAlex', '.cta-section .get-a-call'], ['cta.demo', '.cta-section .hero-cta-link.black'],
];
const out = {};
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: H[w] || 900 } });
  const page = await ctx.newPage();
  const errors = [], external = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => { const u = r.url(); if (!/^(https?:\/\/(127\.0\.0\.1|localhost)|data:|blob:)/.test(u)) external.push(u); });
  await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // scroll through to trigger lazy images
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < docH; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  const r = await page.evaluate(({ SEL, KEYS }) => {
    const rect = (el) => { const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +(b.y + scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
    const sections = {}; for (const [k, s] of Object.entries(SEL)) { const el = document.querySelector(s); sections[k] = el ? rect(el) : null; }
    const els = {}; for (const [k, s] of KEYS) { const el = document.querySelector(s); if (!el) { els[k] = null; continue; } const cs = getComputedStyle(el); els[k] = { ...rect(el), fs: cs.fontSize, lh: cs.lineHeight, display: cs.display, color: cs.color, op: cs.opacity }; }
    return { sections, els, docW: document.documentElement.scrollWidth, innerW: innerWidth, docH: document.documentElement.scrollHeight };
  }, { SEL, KEYS });
  out[w] = { ...r, errors, external };
  if (shots) {
    for (const [k, s] of Object.entries(SEL)) {
      const el = await page.$(s); if (!el) continue;
      const b = await el.boundingBox(); if (!b) continue;
      await page.screenshot({ path: `${DIR}clone-${w}-${k}.png`, fullPage: true, clip: { x: 0, y: b.y + (await page.evaluate(() => scrollY)), width: w, height: Math.min(b.height, 2400) } });
    }
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(DIR + 'measure-b.json', JSON.stringify(out, null, 1));
for (const w of widths) {
  const o = out[w];
  console.log(`\n=== ${w}  docW=${o.docW} innerW=${o.innerW} overflow=${o.docW > o.innerW} errors=${o.errors.length} external=${o.external.length} docH=${o.docH}`);
  if (o.errors.length) console.log('  ERR', o.errors.slice(0, 5));
  if (o.external.length) console.log('  EXT', o.external.slice(0, 5));
  for (const [k, v] of Object.entries(o.sections)) console.log(`  [${k}] ${v ? `y=${v.y} h=${v.h}` : 'MISSING'}`);
  for (const [k, v] of Object.entries(o.els)) console.log(`   ${k}: ${v ? `x=${v.x} y=${v.y} w=${v.w} h=${v.h} fs=${v.fs} lh=${v.lh} d=${v.display} op=${v.op}` : 'null'}`);
}
