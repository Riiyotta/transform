// Re-entry mid-mouseout: in (hold 400ms), out, re-enter after `gap` ms; sample after re-entry.
// Shows whether IX2 group 1 (arrow -> 0, black logo -> 0, back link op -> .5 / x -> 0) delays group 2.
// Usage: node recon/motion-4/reentry.mjs <base> <outfile>
import { createRequire } from 'module'; import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const outFile = process.argv[3]; const live = base.includes('transform9')
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const PR = {
  card: { bottomBg: ['.post-bottom-wrap', 'background-color'], img: ['.post-img-hor', 'transform'], arrow: ['.post-arrow-wrap', 'opacity'] },
  back: { op: ['', 'opacity'], a1: ['.back-1', 'transform'] },
  cs: { cell: ['.post-img-wrap', 'background-color'], wh: ['.cl-wh-logo-on-cell', 'opacity'], bl: ['.cl-bl-logo-on-cell', 'opacity'], arrow: ['.post-arrow-wrap', 'opacity'] },
}
const T = [0, 30, 60, 100, 150, 200, 300, 400, 500, 600, 800]
async function run(sel, probe, gap) {
  await p.evaluate((sel) => { window.lenis?.stop?.(); document.querySelector(sel).scrollIntoView({ block: 'center' }) }, sel)
  await p.waitForTimeout(900); await p.mouse.move(2, 2); await p.waitForTimeout(800)
  const bx = await p.locator(sel).first().boundingBox(); const x = bx.x + bx.width / 2, y = bx.y + Math.min(60, bx.height / 2)
  await p.mouse.move(x, y); await p.waitForTimeout(400); await p.mouse.move(2, 2); await p.waitForTimeout(gap)
  const pr = p.evaluate(([sel, probe, T]) => new Promise((res) => {
    const e = document.querySelector(sel); const rows = []; let t0 = null
    const read = () => { const o = {}; for (const [k, [s, prop]] of Object.entries(probe)) { const t = s ? e.querySelector(s) : e; o[k] = getComputedStyle(t).getPropertyValue(prop) } return o }
    e.addEventListener('mouseover', () => { t0 = performance.now(); rows.push({ t: 0, ...read() }) }, { once: true, capture: true })
    const mc = new MessageChannel(); let ft = 0, done = false
    mc.port1.onmessage = () => { if (t0 === null || done) return; const t = ft - t0; rows.push({ t: Math.round(t), ...read() }); if (t > 850) { done = true; res(T.map((w) => rows.reduce((a, r) => Math.abs(r.t - w) < Math.abs(a.t - w) ? r : a))) } }
    const tick = (ts) => { if (done) return; ft = ts; if (t0 !== null) mc.port2.postMessage(0); requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  }), [sel, probe, T])
  await p.waitForTimeout(20); await p.mouse.move(x, y); const rows = await pr
  await p.mouse.move(2, 2); await p.waitForTimeout(900); return rows
}
const out = {}
const go = async (path) => { await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 7000 : 4000) }
await go('/blog'); out.card = await run('.post-link-block.bl', PR.card, 80)
await go('/blog/redefining-healthcare-ai'); out.back = await run('a.icon-w-text', PR.back, 80)
await go('/case-studies'); out.cs = await run('.post-link-block.cs', PR.cs, 80)
fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); await b.close()
