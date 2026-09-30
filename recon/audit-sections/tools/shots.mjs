// Usage: node shots.mjs <live|clone> <outdir> [widths] [sections(comma)] [maxSteps]
// Viewport screenshots per section at section-relative scroll offsets (k * vh), after a full scroll-through.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [side, outdir] = process.argv.slice(2, 4);
const widths = (process.argv[4] || '1440,390').split(',').map(Number);
const only = process.argv[5] && process.argv[5] !== 'all' ? process.argv[5].split(',') : null;
const maxSteps = +(process.argv[6] || 3);
const URL = side === 'live' ? 'https://www.transform9.com/' : 'http://127.0.0.1:5179/';
const H = { 1440: 900, 1200: 900, 1024: 900, 768: 1024, 600: 900, 390: 844 };
export const SECTIONS = [
  ['testimonials', 'section.testimonials'], ['how-it-works', 'section.how-it-works'], ['white-section', 'section.white-section'],
  ['trans-b2w', '.transition-cont.black-to-white'], ['scheduling', '.stacking-cards-section.schudule-agent'], ['tasking', '.half-split-wrap'],
  ['navigator', '.row-tabs-section'], ['outreach', '.split-cards-section'], ['trans-w2b', '.transition-cont.white-to-black'],
  ['specialties', 'section.specialty-section'], ['integrations', 'section.integration-section'], ['security', 'section.secure-section'], ['cta', 'section.cta-section'],
];
const FREEZE = `.logos-wrapper,.intagrations-row{transform:none!important;animation:none!important}*{caret-color:transparent!important}`;
fs.mkdirSync(outdir, { recursive: true });
const browser = await chromium.launch();
const meta = {};
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: H[w] || 900 }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(side === 'live' ? 3000 : 600);
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; }));
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForTimeout(side === 'live' ? 1500 : 300);
  meta[w] = {};
  for (const [name, sel] of SECTIONS) {
    if (only && !only.includes(name)) continue;
    const box = await page.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; }, sel);
    meta[w][name] = box; if (!box) continue;
    const vh = H[w] || 900; const steps = Math.min(maxSteps, Math.max(1, Math.ceil(box.h / vh)));
    for (let k = 0; k < steps; k++) {
      await page.evaluate((y) => scrollTo(0, y), Math.round(box.y + k * vh));
      await page.waitForTimeout(side === 'live' ? 1300 : 250);
      await page.screenshot({ path: `${outdir}/${side}-${w}-${name}-${k}.png` });
    }
  }
  await page.close();
  console.error('done', side, w);
}
fs.writeFileSync(`${outdir}/${side}-meta.json`, JSON.stringify(meta, null, 1));
await browser.close();
