// Reduced-motion check for M21: video should not play; still image shown. Usage: node qa/reduced-motion.mjs <url>
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2]
const b = await chromium.launch()
for (const rm of ['reduce', 'no-preference']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  const r = await p.evaluate(() => {
    const v = document.querySelector('video'); const t0 = v?.currentTime
    const still = document.querySelector('.bg-pic-pixels')
    return new Promise((res) => setTimeout(() => res({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, paused: v?.paused, advanced: +(v.currentTime - t0).toFixed(2), videoDisplay: v && getComputedStyle(v).display, videoOpacity: v && getComputedStyle(v).opacity, stillDisplay: still && getComputedStyle(still).display }), 1000))
  })
  const live = url.includes('transform9')
  console.log(url, rm, JSON.stringify(r))
  await ctx.close()
}
await b.close()
