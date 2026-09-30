// Usage: node states.mjs — clone /compare interaction END states vs recon/pages/compare/shared/states.json.
// Hover end states are static CSS (motion is a later pass), so they are read after a settle wait.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const OUT = '/Users/riyaghosh/V3/transform/recon/build-compare';
const b = await chromium.launch();
const res = {};
const go = async (w, h) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto('http://127.0.0.1:5179/compare', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); return p; };
const scrollTo = async (p, y) => { await p.evaluate((y) => { window.scrollTo(0, y) }, y); await p.waitForTimeout(700); };
const ev = (p) => p.$$eval('.ev-tab', (t) => t.map((e) => ({ cur: e.classList.contains('is-current'), bg: getComputedStyle(e).backgroundColor, color: getComputedStyle(e).color, h: +e.getBoundingClientRect().height.toFixed(2), text: getComputedStyle(e.querySelector('.ev-tab-text')).display })));
const sp = (p) => p.$$eval('.specialty-tab-link.wh', (t) => t.slice(0, 3).map((e) => { const c = getComputedStyle(e); return { cur: e.classList.contains('is-current'), bg: c.backgroundColor, color: c.color, pt: c.paddingTop, pl: c.paddingLeft, h: +e.getBoundingClientRect().height.toFixed(2) }; }));
const nav = (p) => p.$eval('.nav-menu', (n) => ({ bg: getComputedStyle(n).backgroundColor, link: getComputedStyle(n.querySelector('.nav-link-block')).color, logoB: getComputedStyle(n.querySelector('.logo-black')).opacity }));

{ // 1440
  const p = await go(1440, 900); const r = (res['1440'] = {});
  const blk = await p.$('.privacy-block'); await blk.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const priv = () => p.$eval('.privacy-block', (e) => ({ bg: getComputedStyle(e).backgroundColor, head: getComputedStyle(e.querySelector('.privacy-head')).color, text: getComputedStyle(e.querySelector('.privacy-text')).color }));
  r.privacyBefore = await priv(); await blk.hover(); await p.waitForTimeout(700); r.privacyHover = await priv();
  await p.screenshot({ path: `${OUT}/state-1440-privacy-hover.png` });
  await p.mouse.move(5, 5); await p.waitForTimeout(700); r.privacyAfter = await priv();
  const t = await p.$$('.ev-tab'); await t[0].scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  r.evBefore = await ev(p); await t[1].hover(); await p.waitForTimeout(200); r.evHover2 = (await ev(p)).map((x) => x.cur);
  await t[1].click(); await p.waitForTimeout(30); r.evClick2_30ms = await ev(p);
  await p.mouse.move(5, 5); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/state-1440-ev-tab2.png` });
  await t[1].click(); await p.waitForTimeout(100); r.evClick2Again = (await ev(p)).map((x) => x.cur);
  const s = await p.$$('.specialty-tab-link.wh'); await s[2].scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  r.spBefore = await sp(p); await s[2].hover(); await p.waitForTimeout(200); r.spHover3 = { tabs: await sp(p), pane: await p.$$eval('.specialty-tabs-content.wh .specialty-tab-pane', (x) => x.findIndex((e) => getComputedStyle(e).display !== 'none')), nav: await nav(p) };
  await p.screenshot({ path: `${OUT}/state-1440-specialty-wh-hover.png` });
  // pause the marquee so the hover target stays under the pointer
  await p.addStyleTag({ content: '.intagrations-row{animation-play-state:paused!important}' });
  const ib = await p.$('div.integration-block.wh'); await ib.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  r.integBefore = await ib.evaluate((e) => getComputedStyle(e).backgroundColor);
  await ib.hover(); await p.waitForTimeout(300); r.integHover = await ib.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, logos: [...e.querySelectorAll('img')].map((i) => [i.className, getComputedStyle(i).opacity, getComputedStyle(i).display]) }));
  await p.screenshot({ path: `${OUT}/state-1440-integration-wh-hover.png` });
  await p.mouse.move(5, 5); await p.waitForTimeout(300); r.integAfter = await ib.evaluate((e) => getComputedStyle(e).backgroundColor);
  r.navByScroll = [];
  for (const y of [4728, 4788, 5228, 7609, 7809]) { await scrollTo(p, y); r.navByScroll.push({ y, actualY: await p.evaluate(() => Math.round(scrollY)), nav: await nav(p) }); }
  await p.close();
}
for (const [w, h] of [[768, 1024], [390, 844]]) {
  const p = await go(w, h); const r = (res[w] = {});
  const head = await p.$('.table-row.head'); const tbl = await p.$('.table-wrap');
  const ty = await tbl.evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await scrollTo(p, ty + 700);
  r.tableHeadAfterScroll = await head.evaluate((e) => ({ top: +e.getBoundingClientRect().top.toFixed(2), h: +e.getBoundingClientRect().height.toFixed(2), pos: getComputedStyle(e).position, bg: getComputedStyle(e).backgroundColor, blur: getComputedStyle(e).backdropFilter }));
  await p.screenshot({ path: `${OUT}/state-${w}-table-sticky.png` });
  const t = await p.$$('.ev-tab'); await t[2].scrollIntoViewIfNeeded(); await t[2].click(); await p.waitForTimeout(200);
  r.ev3 = (await ev(p)).map(({ cur, text, h }) => ({ cur, text, h }));
  await p.screenshot({ path: `${OUT}/state-${w}-ev-tab3.png` });
  const s = await p.$$('.specialty-tab-link.wh'); await s[1].scrollIntoViewIfNeeded(); await s[1].click(); await p.waitForTimeout(200);
  r.sp2 = (await sp(p)).map(({ cur, bg, color, pl, pt }) => ({ cur, bg, color, pl, pt }));
  await p.screenshot({ path: `${OUT}/state-${w}-specialty-wh.png` });
  // <=479: first tab active loses its highlight
  await s[0].click(); await p.waitForTimeout(100); r.sp1 = (await sp(p))[0];
  await p.close();
}
fs.writeFileSync(`${OUT}/clone-states.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 0).replace(/\},"/g, '},\n"'));
await b.close();
