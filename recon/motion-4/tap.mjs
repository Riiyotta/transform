// 390 touch: tap an element (navigation blocked in-page), read state 500ms later, then tap
// neutral text elsewhere and read again. Usage: node recon/motion-4/tap.mjs <base> <outfile>
import { createRequire } from 'module'; import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const outFile = process.argv[3]; const live = base.includes('transform9')
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 })).newPage()
const PR = {
  card: { bottomBg: ['.post-bottom-wrap', 'background-color'], title: ['.post-bottom-wrap > :first-child', 'color'], rule: ['.post-cell', 'border-left-color'], img: ['.post-img-hor', 'transform'], arrow: ['.post-arrow-wrap', 'opacity'] },
  featured: { img: ['.blog-img-vert', 'transform'] },
  back: { op: ['', 'opacity'], a1: ['.back-1', 'transform'] },
  share: { op: ['', 'opacity'] },
  cs: { cell: ['.post-img-wrap', 'background-color'], wh: ['.cl-wh-logo-on-cell', 'opacity'], bl: ['.cl-bl-logo-on-cell', 'opacity'], bottomBg: ['.post-bottom-wrap', 'background-color'], title: ['.post-bottom-wrap > :first-child', 'color'] },
}
const read = (sel, probe) => p.evaluate(([sel, probe]) => { const e = document.querySelector(sel); const o = {}; for (const [k, [s, prop]] of Object.entries(probe)) { const t = s ? e.querySelector(s) : e; o[k] = t ? getComputedStyle(t).getPropertyValue(prop) : null } return o }, [sel, probe])
async function tap(sel, probe) {
  await p.evaluate((sel) => { window.lenis?.stop?.(); const e = document.querySelector(sel); e.scrollIntoView({ block: 'center' }); document.addEventListener('click', (ev) => ev.preventDefault(), true) }, sel)
  await p.waitForTimeout(900)
  const r = { rest: await read(sel, probe) }
  const bx = await p.locator(sel).first().boundingBox()
  await p.touchscreen.tap(bx.x + bx.width / 2, bx.y + Math.min(40, bx.height / 2)); await p.waitForTimeout(500)
  r.afterTap = await read(sel, probe)
  await p.touchscreen.tap(8, 420); await p.waitForTimeout(600)
  r.afterTapElsewhere = await read(sel, probe)
  return r
}
const go = async (path) => { await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 7000 : 4000) }
const out = {}
await go('/blog'); out.card = await tap('.post-link-block.bl', PR.card); out.featured = await tap('.post-hor-wrap.featured', PR.featured)
await go('/blog/redefining-healthcare-ai'); out.back = await tap('a.icon-w-text', PR.back); out.share = await tap('.share-link-block', PR.share)
await go('/case-studies'); out.cs = await tap('.post-link-block.cs', PR.cs)
fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); await b.close()
