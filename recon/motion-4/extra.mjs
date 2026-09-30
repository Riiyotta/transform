// (a) prefers-reduced-motion: card hover values at 0/60/150/300ms (live vs clone).
// (b) back link across the 992 boundary: hover at 1440, resize to 900 while hovered, then back to
//     1440 and hover again (clone). Usage: node recon/motion-4/extra.mjs <base> <outfile>
import { createRequire } from 'module'; import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const outFile = process.argv[3]; const live = base.includes('transform9')
const b = await chromium.launch(); const out = {}
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage()
  await p.goto(base + '/blog', { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 7000 : 4000)
  await p.evaluate(() => { window.lenis?.stop?.(); document.querySelector('.post-link-block.bl').scrollIntoView({ block: 'center' }) }); await p.waitForTimeout(900)
  await p.mouse.move(2, 2); await p.waitForTimeout(500)
  const bx = await p.locator('.post-link-block.bl').first().boundingBox()
  const rd = () => p.evaluate(() => { const e = document.querySelector('.post-link-block.bl'); return [getComputedStyle(e.querySelector('.post-arrow-wrap')).opacity, getComputedStyle(e.querySelector('.post-img-hor')).transform] })
  await p.mouse.move(bx.x + bx.width / 2, bx.y + 60); const r = []
  for (const w of [60, 90, 150]) { await p.waitForTimeout(w); r.push(await rd()) }
  out.reduceCardIn = r
  await p.close()
}
if (!live) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage()
  await p.goto(base + '/blog/redefining-healthcare-ai', { waitUntil: 'load' }); await p.waitForTimeout(4000)
  const rd = () => p.evaluate(() => { const e = document.querySelector('a.icon-w-text'); return { ix: e.hasAttribute('data-ix'), op: getComputedStyle(e).opacity, inlineOp: e.style.opacity, a1: getComputedStyle(e.querySelector('.back-1')).transform, inlineA1: e.querySelector('.back-1').style.transform } })
  let bx = await p.locator('a.icon-w-text').boundingBox()
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(500); out.hovered1440 = await rd()
  await p.setViewportSize({ width: 900, height: 900 }); await p.waitForTimeout(500); out.resized900 = await rd()
  bx = await p.locator('a.icon-w-text').boundingBox(); await p.mouse.move(2, 2); await p.waitForTimeout(200); await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(500); out.hover900 = await rd()
  await p.mouse.move(2, 2); await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(500); out.back1440 = await rd()
  bx = await p.locator('a.icon-w-text').boundingBox(); await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(150); out.rehover1440_150ms = await rd(); await p.waitForTimeout(400); out.rehover1440_550ms = await rd()
  // listener count sanity after StrictMode double-mount: one hover = one tween set (values match live)
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); await b.close()
