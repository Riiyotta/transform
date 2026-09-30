// Usage: node pshots.mjs <live|clone> <outdir> <routes> [widths]  -> full-page PNGs <side>-<slug>-<w>.png
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [side, outdir, routesArg, wArg] = process.argv.slice(2);
const routes = routesArg.split(','); const widths = (wArg || '1440,390').split(',').map(Number);
const BASE = side === 'live' ? 'https://www.transform9.com' : 'http://127.0.0.1:5179';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
export const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}*{caret-color:transparent!important}`;
fs.mkdirSync(outdir, { recursive: true });
const b = await chromium.launch();
async function one(route, w) {
  const p = await b.newPage({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
  await p.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }); await p.evaluate(() => document.fonts.ready);
  if (side === 'live') { await p.waitForFunction(() => { const e = document.querySelector('.preloader-wrap'); return !e || getComputedStyle(e).opacity === '0' || getComputedStyle(e).display === 'none'; }, null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3500); }
  else await p.waitForTimeout(800);
  await p.addStyleTag({ content: FREEZE });
  await p.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => new Promise((r) => { v.pause(); if (v.currentTime === 0) return r(); v.addEventListener('seeked', r, { once: true }); v.currentTime = 0; setTimeout(r, 5000); }))));
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(side === 'live' ? 2000 : 500);
  const slug = route.replace(/^\//, '') || 'home';
  await p.screenshot({ path: `${outdir}/${side}-${slug}-${w}.png`, fullPage: true });
  await p.close();
}
for (const r of routes) for (const w of widths) { await one(r, w); console.log(side, r, w); }
await b.close();
