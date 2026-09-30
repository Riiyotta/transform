// Resize check: trigger positions after 1440 -> 390 -> 1440 must equal fresh-load values.
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2] || 'http://127.0.0.1:5179/'
const browser = await chromium.launch()
const errors = []
const get = (page) => page.evaluate(() => {
  const ST = window.ScrollTrigger || window.__motion.ScrollTrigger
  return { cards: [1,2,3].map(n => (document.querySelector('.scheduling-card._'+n).style.transform)), scrollY: Math.round(scrollY), n: ST.getAll().length, docH: document.documentElement.scrollHeight, sts: ST.getAll().map((s) => [s.trigger.className, Math.round(s.start), Math.round(s.end)]).sort((a, b) => a[1] - b[1]) }
})
const fresh = {}
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } })
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000)
  fresh[w] = await get(p); await p.close()
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', (m) => m.type() === 'error' && errors.push(m.text())); page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(2000)
await page.evaluate(() => scrollTo(0, 8000)); await page.waitForTimeout(800)
await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500)
const at390 = await get(page)
await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(1500)
const back1440 = await get(page)
const same = (a, b) => JSON.stringify(a.sts) === JSON.stringify(b.sts)
const out = { url, fresh, at390, back1440, match390: same(at390, fresh[390]), match1440: same(back1440, fresh[1440]), errors }
fs.writeFileSync(new URL(`./resize-${url.includes('transform9.com') ? 'live' : 'clone'}.json`, import.meta.url), JSON.stringify(out, null, 1))
console.log('scrollY', at390.scrollY, back1440.scrollY, '390 match', out.match390, '1440 match', out.match1440, 'counts', fresh[1440].n, at390.n, back1440.n, 'errors', errors.length)
if (!out.match390) console.log(JSON.stringify(at390.sts), '\n', JSON.stringify(fresh[390].sts))
if (!out.match1440) console.log(JSON.stringify(back1440.sts), '\n', JSON.stringify(fresh[1440].sts))
await browser.close()
