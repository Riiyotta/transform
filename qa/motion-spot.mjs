// Main-session motion spot checks, clone vs live, real mouse input.
// M13 testimonial arrow hover, M14 security block hover, M16 popup close hover, M19 slide cross-fade, M22 wheel curve.
// Usage: node qa/motion-spot.mjs <url>
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2]
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500)
const goTo = async (sel) => { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await p.waitForTimeout(1500) }
const timeline = async (read, arg, times = [0, 60, 150, 300, 600]) => { const out = []; const start = Date.now(); for (const t of times) { const w = t - (Date.now() - start); if (w > 0) await p.waitForTimeout(w); out.push([t, await p.evaluate(read, arg)]) } return out }
async function hover(label, sel, read) {
  await goTo(sel); await p.mouse.move(2, 450); await p.waitForTimeout(500)
  const bx = await p.locator(sel).first().boundingBox()
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2)
  console.log(label, JSON.stringify(await timeline(read, sel)))
}
await hover('M14 security block', '.secure-block', (s) => getComputedStyle(document.querySelector(s)).backgroundColor)
await hover('M13 testim arrow right', '.test-arrow-wrap.right', (s) => getComputedStyle(document.querySelector(s)).backgroundColor)
// M19: click next arrow, sample slide opacities
await goTo('.test-arrow-wrap.right'); const ab = await p.locator('.test-arrow-wrap.right').boundingBox()
await p.mouse.click(ab.x + ab.width / 2, ab.y + ab.height / 2)
console.log('M19 slides opacity', JSON.stringify(await timeline(() => [...document.querySelectorAll('.testim-slide, .w-slide')].slice(0, 2).map((e) => (+getComputedStyle(e).opacity).toFixed(2)), null, [0, 100, 200, 300, 500])))
// M16: open popup, hover close
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800)
await p.locator('.hero-cta-link').first().click(); await p.waitForTimeout(1200)
await p.mouse.move(2, 2); await p.waitForTimeout(300)
const cb = await p.locator('.close-popup-wrap').first().boundingBox()
await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2)
console.log('M16 close bg', JSON.stringify(await timeline(() => getComputedStyle(document.querySelector('.close-popup-wrap')).backgroundColor)))
await p.keyboard.press('Escape'); await p.mouse.click(5, 5); await p.waitForTimeout(1200)
// M22: one wheel event of 500 at scrollY 5000
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2000)
await p.evaluate(() => scrollTo(0, 5000)); await p.waitForTimeout(1500)
await p.mouse.move(700, 450); const y0 = await p.evaluate(() => scrollY); await p.mouse.wheel(0, 500)
console.log('M22 wheel Δ', JSON.stringify(await timeline((y0) => Math.round(scrollY - y0), y0, [0, 100, 250, 500, 1000, 2000])))
await b.close()
