// CMP-M2 / CMP-M3 hover curves: bg/text colour at 0/60/150/300ms after mouseenter and after mouseleave.
// Usage: node recon/motion-3/hover.mjs <base-url> <width>
import { createRequire } from 'module'; const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const W = +(process.argv[3] || 1440)
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 900 } })
const p = await ctx.newPage()
await p.goto(base + '/compare', { waitUntil: 'load', timeout: 120000 })
await p.waitForTimeout(base.includes('transform9') ? 7000 : 3000)
const out = {}
async function curve(sel, idx, probes) {
  await p.evaluate(([sel, idx]) => { const e = document.querySelectorAll(sel)[idx]; e.scrollIntoView({ block: 'center' }); window.lenis?.stop?.() }, [sel, idx])
  await p.waitForTimeout(1200)
  const box = await p.locator(sel).nth(idx).boundingBox()
  await p.mouse.move(2, 2); await p.waitForTimeout(400)
  // sample in-page with rAF timestamps relative to the event dispatch
  const sample = (phase) => p.evaluate(([sel, idx, probes, phase]) => new Promise((res) => {
    const e = document.querySelectorAll(sel)[idx]
    const read = () => { const o = { bg: getComputedStyle(e).backgroundColor }; for (const [k, s] of probes) { const t = s === 'other-head' ? document.querySelectorAll(sel)[idx + 1]?.querySelector('.privacy-head') : e.querySelector(s); o[k] = t && getComputedStyle(t).color } return o }
    const ev = phase === 'in' ? 'mouseover' : 'mouseout'
    let t0 = null; const rows = []; const want = [0, 60, 150, 300, 600]
    e.addEventListener(ev, () => { t0 = performance.now() }, { once: true, capture: true })
    const tick = () => { if (t0 !== null) { const t = performance.now() - t0; rows.push({ t: Math.round(t), ...read() }); if (t > 650) { res(want.map((w) => rows.reduce((a, r) => Math.abs(r.t - w) < Math.abs(a.t - w) ? r : a))); return } } requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  }), [sel, idx, probes, phase])
  const pin = sample('in'); await p.waitForTimeout(50); const box2 = await p.locator(sel).nth(idx).boundingBox(); await p.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2); const inRows = await pin
  const pout = sample('out'); await p.waitForTimeout(50); await p.mouse.move(2, 2); const outRows = await pout
  return { in: inRows, out: outRows }
}
out.privacy = await curve('.privacy-block', 0, [['head', '.privacy-head'], ['text', '.privacy-text'], ['otherHead', 'other-head']])
out.integrationWh = await curve('.integration-block.wh', 3, [])
console.log(JSON.stringify(out, null, 1))
await b.close()
