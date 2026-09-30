// M8c (CTA black-to-img pixel scrub) on CMS pages: fraction of `.transition-cont.black-to-img .pixel`
// still opaque when the container top is at 100/80/60/40/20/0/-20 % of the viewport height.
// Usage: node recon/motion-4/m8c.mjs <base> <width> <outfile>
import { createRequire } from 'module'; import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const W = +(process.argv[3] || 1440); const outFile = process.argv[4]; const live = base.includes('transform9')
const b = await chromium.launch(); const H = W < 500 ? 844 : 900
const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage()
const out = {}
for (const path of ['/blog', '/blog/redefining-healthcare-ai', '/case-studies/southern-bone-joint']) {
  await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 7000 : 4000)
  const top0 = await p.evaluate(() => document.querySelector('.transition-cont.black-to-img').getBoundingClientRect().top + scrollY)
  const rows = []
  for (const f of [1, 0.8, 0.6, 0.4, 0.2, 0, -0.2]) {
    const y = Math.round(top0 - f * H)
    await p.evaluate((y) => { if (window.lenis?.scrollTo) window.lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y) }, y)
    await p.waitForTimeout(700)
    rows.push(await p.evaluate((f) => { const px = [...document.querySelectorAll('.transition-cont.black-to-img .pixel')]; const on = px.filter((e) => +getComputedStyle(e).opacity > 0.5).length; const r = document.querySelector('.transition-cont.black-to-img').getBoundingClientRect(); return { f, topPct: +(r.top / innerHeight).toFixed(3), opaque: +(on / px.length).toFixed(3), n: px.length } }, f))
  }
  out[path] = rows
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); await b.close()
