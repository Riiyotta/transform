// Motion-4 hover sampler (BLOG-M6..M9, CS-M1, M12 on CMS pages). Real page.mouse input; values are
// sampled in-page on rAF, timestamped from the mouseover/mouseout dispatch, then picked at
// 0/60/150/300/600ms. Also: rest after out, 2nd hover (from the post-out rest), quick in/out x3.
// Usage: node recon/motion-4/hover.mjs <base> <width> <outfile>
import { createRequire } from 'module'; import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const W = +(process.argv[3] || 1440); const outFile = process.argv[4]
const live = base.includes('transform9')
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 900 } })
const p = await ctx.newPage()
const WANT = [0, 60, 150, 300, 600]

// probe = { key: [selectorRelativeToHoverEl | '' (self), cssProp] }
const PROBES = {
  card: { bottomBg: ['.post-bottom-wrap', 'background-color'], title: ['.post-bottom-wrap > :first-child', 'color'], meta: ['.post-cell > div', 'color'], rule: ['.post-cell', 'border-left-color'], img: ['.post-img-hor', 'transform'], arrow: ['.post-arrow-wrap', 'opacity'] },
  featured: { img: ['.blog-img-vert', 'transform'], head: ['.featured-head', 'opacity'], u1: ['.underline._1', 'width'], u2: ['.underline._2', 'width'] },
  back: { op: ['', 'opacity'], a1: ['.back-1', 'transform'], a2: ['.back-2', 'transform'] },
  share: { op: ['', 'opacity'] },
  cs: { cell: ['.post-img-wrap', 'background-color'], wh: ['.cl-wh-logo-on-cell', 'opacity'], bl: ['.cl-bl-logo-on-cell', 'opacity'], bottomBg: ['.post-bottom-wrap', 'background-color'], title: ['.post-bottom-wrap > :first-child', 'color'], text: ['.highlight-text-alt, .blog-point', 'color'], num: ['.testim-num', 'color'], rule: ['.testim-point-wrap', 'border-left-color'], arrow: ['.post-arrow-wrap', 'opacity'] },
  underline: { u1: ['.underline._1', 'width'], u2: ['.underline._2', 'width'] },
}

async function readNow(sel, idx, probe) {
  return p.evaluate(([sel, idx, probe]) => {
    const e = document.querySelectorAll(sel)[idx]; const o = {}
    for (const [k, [s, prop]] of Object.entries(probe)) { const t = s ? e.querySelector(s) : e; o[k] = t ? getComputedStyle(t).getPropertyValue(prop) : null }
    return o
  }, [sel, idx, probe])
}
function arm(sel, idx, probe, ev) {
  return p.evaluate(([sel, idx, probe, ev, WANT]) => new Promise((res) => {
    const e = document.querySelectorAll(sel)[idx]
    const read = () => { const o = {}; for (const [k, [s, prop]] of Object.entries(probe)) { const t = s ? e.querySelector(s) : e; o[k] = t ? getComputedStyle(t).getPropertyValue(prop) : null } return o }
    let t0 = null; const rows = []
    e.addEventListener(ev, () => { t0 = performance.now(); rows.push({ t: 0, ...read() }) }, { once: true, capture: true })
    // Read the frame's final (painted) state: after every rAF callback of the frame has run
    // (MessageChannel task), stamped with the frame time relative to the event.
    const mc = new MessageChannel(); let ft = 0
    mc.port1.onmessage = () => { if (t0 === null) return; const t = ft - t0; rows.push({ t: Math.round(t), ...read() }); if (t > 650) { done = true; res(WANT.map((w) => rows.reduce((a, r) => Math.abs(r.t - w) < Math.abs(a.t - w) ? r : a))) } }
    let done = false
    const tick = (ts) => { if (done) return; ft = ts; if (t0 !== null) mc.port2.postMessage(0); requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    setTimeout(() => res({ error: 'no ' + ev }), 4000)
  }), [sel, idx, probe, ev, WANT])
}
async function centre(sel, idx) { const bx = await p.locator(sel).nth(idx).boundingBox(); return [bx.x + bx.width / 2, bx.y + Math.min(bx.height / 2, 60)] }
async function curve(name, sel, idx, probe, { quick = true } = {}) {
  await p.evaluate(([sel, idx]) => { window.lenis?.stop?.(); document.querySelectorAll(sel)[idx].scrollIntoView({ block: 'center' }) }, [sel, idx])
  await p.waitForTimeout(900)
  await p.mouse.move(2, 2); await p.waitForTimeout(700)
  const r = { initialRest: await readNow(sel, idx, probe) }
  const [x, y] = await centre(sel, idx)
  for (const pass of ['1', '2']) {
    let pr = arm(sel, idx, probe, 'mouseover'); await p.waitForTimeout(40); await p.mouse.move(x, y, { steps: 1 }); r['in' + pass] = await pr
    await p.waitForTimeout(300)
    pr = arm(sel, idx, probe, 'mouseout'); await p.waitForTimeout(40); await p.mouse.move(2, 2); r['out' + pass] = await pr
    await p.waitForTimeout(500); r['restAfterOut' + pass] = await readNow(sel, idx, probe)
  }
  if (quick) {
    for (let i = 0; i < 3; i++) { await p.mouse.move(x, y); await p.waitForTimeout(70); await p.mouse.move(2, 2); await p.waitForTimeout(70) }
    await p.waitForTimeout(900); r.quickRest = await readNow(sel, idx, probe)
    // quick: stay in after the 3rd entry
    for (let i = 0; i < 3; i++) { await p.mouse.move(x, y); await p.waitForTimeout(70); if (i < 2) { await p.mouse.move(2, 2); await p.waitForTimeout(70) } }
    await p.waitForTimeout(900); r.quickEndIn = await readNow(sel, idx, probe)
    await p.mouse.move(2, 2); await p.waitForTimeout(900)
  }
  console.error(name, 'done'); return r
}
async function go(path) { await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 7000 : 4000) }
const out = { base, W }
await go('/blog')
out.card0 = await curve('card0', '.post-link-block.bl', 0, PROBES.card)
out.featured = await curve('featured', '.post-hor-wrap.featured', 0, PROBES.featured)
out.readArticle = await curve('readArticle', '._w-underline.featured, .w-underline-link.featured', 0, PROBES.underline, { quick: false }).catch((e) => ({ error: String(e) }))
out.loadMore = await curve('loadMore', 'a.load-more', 0, PROBES.underline, { quick: false })
// Load More click -> appended card hover
await p.locator('a.load-more').first().click(); await p.waitForTimeout(1500)
out.cardCount = await p.evaluate(() => document.querySelectorAll('.post-link-block.bl').length)
out.card5appended = await curve('card5', '.post-link-block.bl', 5, PROBES.card, { quick: false })
await go('/blog/redefining-healthcare-ai')
out.back = await curve('back', 'a.icon-w-text', 0, PROBES.back)
out.share = await curve('share', '.share-link-block', 0, PROBES.share, { quick: false })
out.sticky = await p.evaluate(() => { const s = document.querySelector('.left-sticky-block'); const cs = getComputedStyle(s); window.lenis?.start?.(); return { position: cs.position, top: cs.top } })
await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(800)
out.stickyTopAt1500 = await p.evaluate(() => document.querySelector('.left-sticky-block').getBoundingClientRect().top)
await go('/case-studies')
out.cs0 = await curve('cs0', '.post-link-block.cs', 0, PROBES.cs)
out.cs1 = await curve('cs1', '.post-link-block.cs', 1, PROBES.cs, { quick: false })
await go('/case-studies/southern-bone-joint')
out.csBack = await curve('csBack', 'a.icon-w-text', 0, PROBES.back, { quick: false })
out.readNext = await curve('readNext', '.read-next .post-link-block.cs', 0, PROBES.cs, { quick: false })
fs.writeFileSync(outFile, JSON.stringify(out, null, 1))
await b.close()
