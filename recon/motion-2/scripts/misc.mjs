// Click/timer scenarios: M6 (768/390 incl. load), M10, M11/M11b, M16, M19.
// Usage: node misc.mjs live|clone [ids...]
import { chromium, LIVE, CLONE, SAMPLER, open, center } from './lib.mjs'
import fs from 'fs'
const which = process.argv[2] || 'clone'
const only = process.argv.slice(3)
const url = which === 'live' ? LIVE : CLONE
const want = (id) => !only.length || only.includes(id)
const browser = await chromium.launch()
const result = {}

// Condense: keep samples where any value changed (plus first/last).
function condense(rec, keys) {
  const out = []; let prev = null
  for (const s of rec.samples) {
    const sig = keys.map((k) => JSON.stringify(s[k])).join('|')
    if (sig !== prev) out.push(s); prev = sig
  }
  if (rec.samples.length) out.push(rec.samples[rec.samples.length - 1])
  return out
}
const show = (id, rec, keys) => {
  console.log(`\n== ${id} events`, rec.events.map((e) => `${e.type}@${e.t}`).join(' '))
  for (const s of condense(rec, keys)) console.log('  ', s.t, keys.map((k) => `${k}=${s[k]}`).join(' '))
}
const blocks = (f, k) => [0, 1, 2, 3].map((i) => ({ k: k + i, sel: '.stats-block', i, f }))
const heads = [0, 1, 2, 3].map((i) => ({ k: 'hd' + i, sel: '.stat-head', i, f: 'ty' }))
const imgs = [0, 1, 2, 3].map((i) => ({ k: 'im' + i, sel: '.stats-img-wrap', i, f: 'op' }))

async function stats(id, w, h, dim) {
  const specs = [...blocks(dim, dim), ...heads, ...imgs]
  const keys = specs.map((s) => s.k)
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  await ctx.addInitScript(`${SAMPLER}; window.__m2.arm(${JSON.stringify(specs)}, '.stats-block')`)
  const page = await ctx.newPage()
  const errors = []; page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(2500)
  const load = await page.evaluate(() => window.__m2.stop())
  load.samples = load.samples.filter((s) => s[keys[0]] != null)
  show(id + ' load (t rel. first sample)', load, keys)
  const box = await center(page, '.stats-block', 2)
  await page.evaluate(([sp]) => window.__m2.arm(sp, '.stats-block'), [specs])
  await page.mouse.click(box.x, box.y); await page.waitForTimeout(900)
  const b1 = await center(page, '.stats-block', 1)
  await page.mouse.click(b1.x, b1.y); await page.waitForTimeout(150)
  const b3 = await center(page, '.stats-block', 3)
  await page.mouse.click(b3.x, b3.y); await page.waitForTimeout(900)
  const rec = await page.evaluate(() => window.__m2.stop())
  show(id + ' clicks', rec, keys)
  result[id] = { load: condense(load, keys), clicks: { events: rec.events, samples: condense(rec, keys) }, errors }
  await ctx.close()
}
if (want('M6_768')) await stats('M6_768', 768, 1024, 'w')
if (want('M6_390')) await stats('M6_390', 390, 844, 'h')

if (want('M10')) {
  const page = await open(browser, url, 1440, 900)
  const specs = [0, 1, 2].flatMap((i) => [{ k: 'p' + i, sel: '#pairTabs .tab-progress-vert', i, f: 'h' },
    { k: 'd' + i, sel: '#pairTabs .tab-pane', i, f: 'disp' }, { k: 'o' + i, sel: '#pairTabs .tab-pane', i, f: 'op' }])
  const keys = specs.map((s) => s.k)
  // sample progress rate at load point (no interaction)
  const box1 = await center(page, '#pairTabs .tab-link', 1)
  await page.evaluate(([sp]) => window.__m2.arm(sp, '#pairTabs .tab-link', ['click']), [specs])
  await page.mouse.click(box1.x, box1.y); await page.waitForTimeout(1500)
  const box2 = await page.evaluate(() => { const r = document.querySelectorAll('#pairTabs .tab-link')[2].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  await page.mouse.click(box2.x, box2.y); await page.waitForTimeout(9000)
  const rec = await page.evaluate(() => window.__m2.stop())
  const pts = rec.samples.filter((s, i) => i % 6 === 0 || true)
  show('M10', { events: rec.events, samples: pts }, keys.filter((k) => !k.startsWith('p')))
  // progress: report heights every ~500ms
  const t0 = rec.events[0]?.t ?? 0
  const prog = []; for (let t = 0; t <= 10500; t += 250) { const s = [...rec.samples].reverse().find((r) => r.t <= t); if (s) prog.push({ t, p0: s.p0, p1: s.p1, p2: s.p2 }) }
  console.log('  progress', prog.map((p) => `${p.t}:${p.p0}/${p.p1}/${p.p2}`).join(' '))
  result.M10 = { events: rec.events, panes: condense(rec, keys.filter((k) => !k.startsWith('p'))), progress: prog, errors: page.__errors }
  await page.close()
}

if (want('M11') || want('M16')) {
  const page = await open(browser, url, 1440, 900)
  const specs = [{ k: 'op', sel: '.modal-wrap', f: 'op' }, { k: 'disp', sel: '.modal-wrap', f: 'disp' },
    { k: 'cbg', sel: '.close-popup-wrap', f: 'bg' }, { k: 'cw', sel: '.close-popup-wrap .close-icon.white', f: 'op' }, { k: 'cb', sel: '.close-popup-wrap .close-icon.black', f: 'op' }]
  const keys = ['op', 'disp']
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400)
  const cta = await page.evaluate(() => { const r = document.querySelector('.hero-cta-link.get-a-call').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  const rest = await page.evaluate((sp) => window.__m2.read(sp), specs)
  await page.evaluate(([sp]) => window.__m2.arm(sp, '.hero-cta-link.get-a-call, .modal-overlay, .close-popup-wrap', ['click']), [specs])
  await page.mouse.click(cta.x, cta.y); await page.waitForTimeout(1100)
  const focus1 = await page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.className))
  await page.mouse.click(40, 450); await page.waitForTimeout(1100) // overlay
  await page.mouse.click(cta.x, cta.y); await page.waitForTimeout(100)
  await page.mouse.click(40, 450); await page.waitForTimeout(150)   // close mid-open
  await page.mouse.click(cta.x, cta.y); await page.waitForTimeout(1200) // reopen mid-close
  const recA = await page.evaluate(() => window.__m2.stop())
  show('M11 open/close', recA, keys)
  // close button + M16 hover
  const st = await page.evaluate(() => getComputedStyle(document.querySelector('.modal-wrap')).display)
  if (st === 'none') { await page.mouse.click(cta.x, cta.y); await page.waitForTimeout(800) }
  const cb = await page.evaluate(() => { const r = document.querySelector('.close-popup-wrap').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  await page.mouse.move(cb.x - 200, cb.y + 200); await page.waitForTimeout(300)
  const restC = await page.evaluate((sp) => window.__m2.read(sp), specs)
  await page.evaluate(([sp]) => window.__m2.arm(sp, '.close-popup-wrap', ['mouseenter', 'mouseleave', 'click']), [specs])
  await page.mouse.move(cb.x, cb.y); await page.waitForTimeout(500)
  await page.mouse.move(cb.x - 200, cb.y + 200); await page.waitForTimeout(100)
  await page.mouse.move(cb.x, cb.y); await page.waitForTimeout(500)
  await page.mouse.click(cb.x, cb.y); await page.waitForTimeout(1100)
  const recB = await page.evaluate(() => window.__m2.stop())
  show('M16 hover + close click', recB, ['cbg', 'cw', 'cb', 'op', 'disp'])
  result.M11 = { rest, focusAfterOpen: focus1, openClose: { events: recA.events, samples: condense(recA, keys) }, errors: page.__errors }
  result.M16 = { rest: restC, events: recB.events, samples: condense(recB, ['cbg', 'cw', 'cb', 'op', 'disp']) }
  await page.close()
}

for (const [id, w, h] of [['M19', 1440, 900], ['M19_390', 390, 844]]) {
  if (!want(id)) continue
  const page = await open(browser, url, w, h)
  const specs = [0, 1].flatMap((i) => [{ k: 'o' + i, sel: '.testim-slide', i, f: 'op' }, { k: 'v' + i, sel: '.testim-slide', i, f: 'vis' }, { k: 'x' + i, sel: '.testim-slide', i, f: 'tx' }])
  const keys = specs.map((s) => s.k)
  const r = await center(page, '.test-arrow-wrap.right')
  const l = await page.evaluate(() => { const r = document.querySelector('.test-arrow-wrap.left').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  await page.evaluate(([sp]) => window.__m2.arm(sp, '.test-arrow-wrap', ['click']), [specs])
  await page.mouse.click(r.x, r.y); await page.waitForTimeout(1000)
  await page.mouse.click(l.x, l.y); await page.waitForTimeout(200)
  await page.mouse.click(r.x, r.y); await page.waitForTimeout(1000)
  await page.mouse.click(r.x, r.y); await page.waitForTimeout(600) // at end: no-op
  const rec = await page.evaluate(() => window.__m2.stop())
  show(id, rec, keys)
  result[id] = { events: rec.events, samples: condense(rec, keys), errors: page.__errors }
  await page.close()
}
fs.writeFileSync(new URL(`../misc-${which}${only.length ? '-' + only.join('_') : ''}.json`, import.meta.url), JSON.stringify(result, null, 2))
await browser.close()
