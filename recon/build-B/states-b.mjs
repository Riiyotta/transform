// Usage: node states-b.mjs  — hover/active state screenshots for Builder B sections @1440 (+ mobile tabs)
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
const DIR = '/Users/riyaghosh/V3/transform/recon/build-B/';
const only = process.argv[2] || 'all';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const topOf = (s) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, s);
async function at(sel, offset) { const y = await topOf(sel); await page.evaluate((y) => window.scrollTo(0, y), y + offset); await page.waitForTimeout(400); }
const res = {};
if (only === 'all' || only === 'spec') {
  // live shot: specialty-section scrolled so the tabs menu top is at ~y 36 of viewport
  await at('.specialty-section', 20251.9 - 20214.9 - 96 + 60 - 36 + 36 - 36 + 36 + 29);
  await page.hover('.specialty-tab-link:nth-child(5)'); await page.waitForTimeout(500);
  await page.screenshot({ path: DIR + 'state-1440-specialty-hover.png' });
  res.spec = await page.evaluate(() => { const c = document.querySelector('.specialty-tab-link.is-current'); const cs = getComputedStyle(c); return { idx: [...c.parentNode.children].indexOf(c), bg: cs.backgroundColor, color: cs.color, pl: cs.paddingLeft }; });
}
if (only === 'all' || only === 'nav') {
  await at('.row-tabs-section', -60 + 12547.1 - 12547.1 + 227);
  await page.hover('.row-tab-link:nth-child(3)'); await page.waitForTimeout(500);
  await page.screenshot({ path: DIR + 'state-1440-navigator-hover.png' });
  res.nav = await page.evaluate(() => [...document.querySelectorAll('.row-tab-link')].map((l) => { const cs = getComputedStyle(l); return [cs.backgroundColor, cs.color]; }));
}
if (only === 'all' || only === 'int') {
  await at('.integration-section', 0);
  await page.hover('.intagrations-row._1 .integration-block:nth-child(2)'); await page.waitForTimeout(400);
  await page.screenshot({ path: DIR + 'state-1440-integration-hover.png' });
  res.int = await page.evaluate(() => { const b = document.querySelector('.intagrations-row._1 .integration-block:nth-child(2)'); return { bg: getComputedStyle(b).backgroundColor, white: getComputedStyle(b.querySelector('.white')).opacity, black: getComputedStyle(b.querySelector('.black')).opacity }; });
}
if (only === 'all' || only === 'sec') {
  await at('.secure-section', -11);
  await page.hover('.secure-block._2nd'); await page.waitForTimeout(400);
  await page.screenshot({ path: DIR + 'state-1440-secure-hover.png' });
  res.sec = await page.evaluate(() => { const b = document.querySelector('.secure-block._2nd'); return { bg: getComputedStyle(b).backgroundColor, white: getComputedStyle(b.querySelector('.white')).opacity, black: getComputedStyle(b.querySelector('.black')).opacity }; });
}
if (only === 'all' || only === 'out') {
  await at('.split-cards-section', 3500);
  await page.screenshot({ path: DIR + 'state-1440-outreach.png' });
}
if (only === 'all' || only === 'cta') {
  await at('.cta-section', 0);
  await page.screenshot({ path: DIR + 'state-1440-cta-top.png' });
  await at('.cta-section', 606);
  await page.hover('.cta-section .hero-cta-link.black'); await page.waitForTimeout(300);
  await page.screenshot({ path: DIR + 'state-1440-cta-bottom-hover.png' });
}
console.log(JSON.stringify(res));
await browser.close();
