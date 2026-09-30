// Clone-only functional checks: M10 menu-open pause, M10b at 768, M11 at 390 + QA hook +
// Escape, M19 with click-anchored timing. Usage: node checks.mjs [live|clone]
import { chromium, LIVE, CLONE, open, center } from './lib.mjs'
import fs from 'fs'
const which = process.argv[2] || 'clone'
const url = which === 'live' ? LIVE : CLONE
const browser = await chromium.launch()
const R = {}
const cur = (p) => p.evaluate(() => [...document.querySelectorAll('#pairTabs .tab-link')].findIndex((a) => a.classList.contains('w--current')))

if (which === 'clone') {
  // M10 pause while menu open
  let p = await open(browser, url, 1440, 900)
  await p.evaluate(() => { document.documentElement.dataset.menuOpen = 'true' })
  const a = await cur(p); await p.waitForTimeout(9000); const b = await cur(p)
  await p.evaluate(() => { document.documentElement.dataset.menuOpen = 'false' })
  await p.waitForTimeout(4200); const c = await cur(p)
  R.M10_menuPause = { before: a, after9sOpen: b, after4sClosed: c, pass: a === b && c !== b }
  R.M10_errors = p.__errors; await p.close()

  // M10b at 768: no rotation, current row visible, click shows new row
  p = await open(browser, url, 768, 1024)
  const rows = () => p.evaluate(() => [...document.querySelectorAll('#pairTabs .task-text-row')].map((r) => getComputedStyle(r).display))
  const r0 = await rows(); const c0 = await cur(p); await p.waitForTimeout(4500); const c1 = await cur(p)
  const box = await center(p, '#pairTabs .tab-link', 2); await p.mouse.click(box.x, box.y); await p.waitForTimeout(50)
  const r1 = await rows()
  R.M10b_768 = { rowsOnLoad: r0, currentOnLoad: c0, currentAfter4_5s: c1, rowsAfterClickTab3: r1, pass: r0[0] === 'block' && c0 === c1 && r1[2] === 'block' && r1[0] === 'none' }
  await p.close()

  // M11 QA hook + Escape
  p = await open(browser, url + '?popup=success', 1440, 900)
  const q = await p.evaluate(() => { const m = document.querySelector('.modal-wrap'); return { op: getComputedStyle(m).opacity, disp: getComputedStyle(m).display, state: m.dataset.state } })
  await p.keyboard.press('Escape'); await p.waitForTimeout(700)
  const q2 = await p.evaluate(() => getComputedStyle(document.querySelector('.modal-wrap')).display)
  R.M11_qaHook = { onLoad: q, afterEscape: q2, pass: q.op === '1' && q.disp === 'flex' && q2 === 'none' }
  await p.close()
}

// M11 at 390 open/close sampled
{
  const p = await open(browser, url, 390, 844)
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300)
  const cta = await p.evaluate(() => { const r = document.querySelector('.hero-cta-link.get-a-call').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  const specs = [{ k: 'op', sel: '.modal-wrap', f: 'op' }, { k: 'disp', sel: '.modal-wrap', f: 'disp' }]
  await p.evaluate(([sp]) => window.__m2.arm(sp, '.hero-cta-link.get-a-call, .close-popup-wrap', ['click']), [specs])
  await p.mouse.click(cta.x, cta.y); await p.waitForTimeout(900)
  const cb = await p.evaluate(() => { const r = document.querySelector('.close-popup-wrap').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
  await p.mouse.click(cb.x, cb.y); await p.waitForTimeout(900)
  const rec = await p.evaluate(() => window.__m2.stop())
  const pick = (e, offs) => offs.map((o) => { const t0 = rec.events[e]?.t ?? 0; const s = [...rec.samples].reverse().find((r) => r.t <= t0 + o); return `${o}:${s?.op}/${s?.disp}` })
  R.M11_390 = { events: rec.events, open: pick(0, [0, 50, 100, 250, 500, 800]), close: pick(1, [0, 50, 100, 250, 450, 600, 800]), errors: p.__errors }
  await p.close()
}

// M19 with click-anchored events
for (const [id, w, h] of [['M19', 1440, 900], ['M19_390', 390, 844]]) {
  const p = await open(browser, url, w, h)
  const specs = [0, 1].flatMap((i) => [{ k: 'o' + i, sel: '.testim-slide', i, f: 'op' }, { k: 'v' + i, sel: '.testim-slide', i, f: 'vis' }])
  const r = await center(p, '.test-arrow-wrap.right')
  await p.evaluate(([sp]) => window.__m2.arm(sp, '.test-arrow-wrap', ['click']), [specs])
  await p.mouse.click(r.x, r.y); await p.waitForTimeout(800)
  const rec = await p.evaluate(() => window.__m2.stop())
  const t0 = rec.events[0]?.t ?? 0
  R[id] = { events: rec.events, at: [0, 50, 100, 150, 200, 300, 380, 450, 600].map((o) => { const s = [...rec.samples].reverse().find((x) => x.t <= t0 + o) || rec.samples[0]; return `${o}:${s.o0}${s.v0[0]}/${s.o1}${s.v1[0]}` }), errors: p.__errors }
  await p.close()
}
console.log(JSON.stringify(R, null, 1))
fs.writeFileSync(new URL(`../checks-${which}.json`, import.meta.url), JSON.stringify(R, null, 2))
await browser.close()
