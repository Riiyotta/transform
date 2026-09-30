import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
for (const url of ['http://127.0.0.1:5179/', 'http://127.0.0.1:5180/', 'https://www.transform9.com/']) {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000)
  await p.evaluate(() => scrollTo(0, 5000)); await p.waitForTimeout(1500)
  await p.mouse.move(700, 450); const y0 = await p.evaluate(() => scrollY); await p.mouse.wheel(0, 500)
  const out = []; const s = Date.now(); for (const t of [0, 100, 250, 500, 1000, 2000]) { const w = t - (Date.now() - s); if (w > 0) await p.waitForTimeout(w); out.push([t, await p.evaluate((y0) => Math.round(scrollY - y0), y0)]) }
  await p.keyboard.press('PageDown'); await p.waitForTimeout(1500); const kd = await p.evaluate((y0) => Math.round(scrollY - y0), y0)
  console.log(url, 'y0', y0, 'wheel', JSON.stringify(out), 'after PageDown Δ', kd); await b.close()
}
