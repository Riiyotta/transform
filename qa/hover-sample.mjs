// Real-mouse hover sampler for M5 (stats), M12 (hero Call Alex underline), M14 (integration block).
// Usage: node qa/hover-sample.mjs <url>
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2]
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500)
async function sample(label, hoverSel, readFn, arg) {
  const el = p.locator(hoverSel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200)
  await p.mouse.move(5, 5); await p.waitForTimeout(400)
  const box = await el.boundingBox()
  const t0 = await p.evaluate(readFn, arg)
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  const out = [['0', t0]]
  for (const ms of [120, 300, 700]) { await p.waitForTimeout(ms - (out.length > 1 ? [0, 120, 300][out.length - 1] : 0)); out.push([ms, await p.evaluate(readFn, arg)]) }
  console.log(label, JSON.stringify(out))
}
await sample('M5 stats block 2', '.stats-block >> nth=1', () => { const e = document.querySelectorAll('.stats-block')[1]; return [Math.round(e.getBoundingClientRect().width), getComputedStyle(e.querySelector('.stats-img-wrap')).opacity] })
await sample('M12 hero Call Alex', '.hero .hero-cta-link, [data-section="hero"] .hero-cta-link', () => { const u = document.querySelectorAll('.hero-cta-link .underline'); return [...u].slice(0, 2).map((x) => Math.round(x.getBoundingClientRect().width)) })
await sample('M14 integration block', 'a.integration-block', () => getComputedStyle(document.querySelector('a.integration-block')).backgroundColor)
await b.close()
