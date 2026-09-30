// Extra checks: M10 load + resize, M6 resize, M14 (visible integration block), M17 CSS, M20 instant.
// Usage: node extra.mjs live|clone [ids...]
import { chromium, LIVE, CLONE, SAMPLER, open, center, at } from './lib.mjs'
import fs from 'fs'
const which = process.argv[2] || 'clone'
const only = process.argv.slice(3)
const url = which === 'live' ? LIVE : CLONE
const want = (id) => !only.length || only.includes(id)
const browser = await chromium.launch()
const result = {}
const tabState = (page) => page.evaluate(() => ({
  current: [...document.querySelectorAll('#pairTabs .tab-link')].findIndex((a) => a.classList.contains('w--current')),
  prog: [...document.querySelectorAll('#pairTabs .tab-progress-vert')].map((p) => Math.round(p.getBoundingClientRect().height * 10) / 10),
  row: [...document.querySelectorAll('#pairTabs .task-text-row')].map((p) => getComputedStyle(p).display),
}))

if (want('M10load')) {
  const page = await open(browser, url, 1440, 900)
  const seq = []
  for (let i = 0; i < 12; i++) { seq.push({ t: i * 500, ...(await tabState(page)) }); await page.waitForTimeout(500) }
  console.log('M10load', seq.map((s) => `${s.t}:${s.current}[${s.prog}]`).join(' '))
  // nav-open pause (tablet-only burger on live; desktop check just reads the rule)
  result.M10load = seq
  // resize to 768: rotation must stop, bar state
  await page.setViewportSize({ width: 768, height: 1024 }); await page.waitForTimeout(300)
  const r1 = []; for (let i = 0; i < 6; i++) { r1.push(await tabState(page)); await page.waitForTimeout(1000) }
  console.log('M10 @768', r1.map((s) => `${s.current}[${s.prog}] ${s.row}`).join(' | '))
  await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(300)
  const r2 = []; for (let i = 0; i < 10; i++) { r2.push(await tabState(page)); await page.waitForTimeout(500) }
  console.log('M10 back@1440', r2.map((s) => `${s.current}[${s.prog}]`).join(' | '))
  result.M10resize = { at768: r1, back1440: r2, errors: page.__errors }
  await page.close()
}

if (want('M6resize')) {
  const page = await open(browser, url, 1440, 900)
  const read = () => page.evaluate(() => [...document.querySelectorAll('.stats-block')].map((b) => ({
    w: Math.round(b.getBoundingClientRect().width * 10) / 10, h: Math.round(b.getBoundingClientRect().height * 10) / 10,
    hd: Math.round(new DOMMatrixReadOnly(getComputedStyle(b.querySelector('.stat-head')).transform === 'none' ? undefined : getComputedStyle(b.querySelector('.stat-head')).transform).m42 * 10) / 10,
    im: +getComputedStyle(b.querySelector('.stats-img-wrap')).opacity })))
  const s = { d1440: await read() }
  await page.setViewportSize({ width: 768, height: 1024 }); await page.waitForTimeout(1200); s.to768 = await read()
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1200); s.to390 = await read()
  await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(1200); s.back1440 = await read()
  for (const [k, v] of Object.entries(s)) console.log('M6resize', k, v.map((b) => `${b.w}x${b.h} hd${b.hd} im${b.im}`).join(' | '))
  result.M6resize = s
  await page.close()
}

if (want('M14')) {
  const page = await open(browser, url, 1440, 900)
  const specs = (i) => [{ k: 'bg', sel: '.integration-block.bl', i, f: 'bg' }, { k: 'wop', sel: '.integration-block.bl .integration-logo.white', i, f: 'op' }, { k: 'bop', sel: '.integration-block.bl .integration-logo.black', i, f: 'op' }]
  await center(page, '.integ-row-cont')
  const i = await page.evaluate(() => { const els = [...document.querySelectorAll('.integration-block.bl')]; let best = 0, d = 1e9; els.forEach((e, j) => { const r = e.getBoundingClientRect(); const dd = Math.abs(r.x + r.width / 2 - innerWidth / 2) + Math.abs(r.y - innerHeight / 2) * 0.1; if (dd < d && r.y > 0) { d = dd; best = j } }); return best })
  const box = await page.evaluate((i) => { const r = document.querySelectorAll('.integration-block.bl')[i].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, h: r.height } }, i)
  const out = { x: box.x, y: box.y - box.h / 2 - 200 }
  await page.mouse.move(out.x, out.y); await page.waitForTimeout(200)
  const rest = await page.evaluate((sp) => window.__m2.read(sp), specs(i))
  await page.evaluate(([sp]) => window.__m2.arm(sp, '.integration-block.bl'), [specs(i)])
  for (const [dir, ms] of [['in', 400], ['out', 400], ['in', 80], ['out', 80], ['in', 400], ['out', 400]]) { await page.mouse.move(dir === 'in' ? box.x : out.x, dir === 'in' ? box.y : out.y); await page.waitForTimeout(ms) }
  const rec = await page.evaluate(() => window.__m2.stop())
  const OFF = [0, 16, 50, 100, 150, 200, 250, 300]
  const per = rec.events.map((e, j) => ({ event: e.type, t: e.t, values: at(rec, j, OFF.filter((o) => j + 1 >= rec.events.length || o <= rec.events[j + 1].t - e.t), ['bg', 'wop', 'bop']) }))
  console.log('M14 rest', JSON.stringify(rest)); for (const p of per) console.log(' ', p.event, p.t, p.values.map((v) => `${v.dt}:${v.bg}/${v.wop}/${v.bop}`).join('  '))
  result.M14 = { index: i, rest, perEvent: per }
  await page.close()
}

if (want('M17')) {
  const page = await open(browser, url, 1440, 900)
  result.M17 = await page.evaluate(() => Object.fromEntries(['.links-legal', '.footer-transp.bottom-links', '.bottom-links', '.yt-facade__play', '.nav-link-block.cta', '.stats-block', '.hs-button'].map((s) => {
    const el = document.querySelector(s); return [s, el ? getComputedStyle(el).transition : null] })))
  console.log('M17', result.M17)
  await page.close()
}

if (want('M20')) {
  const page = await open(browser, url, 1440, 900)
  result.M20 = {}
  for (const [name, tab, pane] of [['navigator', '.row-tab-link', '.row-tab-pane'], ['specialty', '.specialty-tab-link', '.specialty-tab-pane']]) {
    const box = await center(page, tab, 1)
    await page.mouse.move(box.x, box.y - box.h * 3); await page.waitForTimeout(200)
    const specs = [0, 1].flatMap((i) => [{ k: 'd' + i, sel: pane, i, f: 'disp' }, { k: 'o' + i, sel: pane, i, f: 'op' }])
    await page.evaluate(([sp, t]) => window.__m2.arm(sp, t), [specs, tab])
    await page.mouse.move(box.x, box.y); await page.waitForTimeout(400)
    const rec = await page.evaluate(() => window.__m2.stop())
    const vals = at(rec, 0, [0, 16, 33, 50, 100, 200, 300], ['d0', 'o0', 'd1', 'o1'])
    console.log('M20', name, rec.events.map((e) => e.type + '@' + e.t).join(' '), vals.map((v) => `${v.dt}:${v.d0}/${v.o0} ${v.d1}/${v.o1}`).join('  '))
    result.M20[name] = { events: rec.events, values: vals }
  }
  await page.close()
}
fs.writeFileSync(new URL(`../extra-${which}${only.length ? '-' + only.join('_') : ''}.json`, import.meta.url), JSON.stringify(result, null, 2))
await browser.close()
