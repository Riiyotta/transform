// Hover/timing scenarios (M5, M12, M12b, M13, M14, M17). Usage: node hover.mjs live|clone [ids...]
import { chromium, LIVE, CLONE, open, center, at } from './lib.mjs'
import fs from 'fs'
const which = process.argv[2] || 'clone'
const only = process.argv.slice(3)
const url = which === 'live' ? LIVE : CLONE
const OFF = [0, 16, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800]

// seq: ['in', ms] / ['out', ms]
const SCEN = {
  M5: { sel: '.stats-block', i: 1, specs: [
      { k: 'w2', sel: '.stats-block', i: 1, f: 'w' }, { k: 'head', sel: '.stat-head', i: 1, f: 'ty' },
      { k: 'descr', sel: '.stat-descr', i: 1, f: 'ty' }, { k: 'img', sel: '.stats-img-wrap', i: 1, f: 'op' }],
    seq: [['in', 900], ['out', 900], ['in', 900], ['out', 150], ['in', 900], ['out', 900]] },
  M12: { sel: '.hero-cta-link.get-a-call', i: 0, specs: [
      { k: 'u1', sel: '.hero-cta-link.get-a-call .underline._1', f: 'w' }, { k: 'u2', sel: '.hero-cta-link.get-a-call .underline._2', f: 'w' },
      { k: 'u1x', sel: '.hero-cta-link.get-a-call .underline._1', f: 'left' }],
    seq: [['in', 800], ['out', 300], ['in', 120], ['out', 80], ['in', 800], ['out', 300]] },
  M12x: { sel: '.hero-cta-link.get-a-call', i: 0, specs: [
      { k: 'u1', sel: '.hero-cta-link.get-a-call .underline._1', f: 'w' }, { k: 'u2', sel: '.hero-cta-link.get-a-call .underline._2', f: 'w' }],
    seq: [['in', 100], ['out', 700], ['in', 350], ['out', 700]] },
  M12b: { sel: '.footer-link-wrap', i: 0, specs: [
      { k: 'u1', sel: '.footer-link-wrap .underline-small._1', f: 'w' }, { k: 'u1op', sel: '.footer-link-wrap .underline-small._1', f: 'op' },
      { k: 'u2', sel: '.footer-link-wrap .underline-small._2', f: 'w' }],
    seq: [['in', 800], ['out', 800], ['in', 120], ['out', 120], ['in', 800], ['out', 800]] },
  M12b2: { sel: '.footer-link-wrap', i: 1, specs: [
      { k: 'u1', sel: '.footer-link-wrap .underline-small._1', i: 1, f: 'w' }, { k: 'u1op', sel: '.footer-link-wrap .underline-small._1', i: 1, f: 'op' },
      { k: 'u2', sel: '.footer-link-wrap .underline-small._2', i: 1, f: 'w' }],
    seq: [['in', 600], ['out', 100], ['in', 600], ['out', 150], ['in', 30], ['out', 600]] },
  M13: { sel: '.test-arrow-wrap.right', i: 0, specs: [
      { k: 'bg', sel: '.test-arrow-wrap.right', f: 'bg' }, { k: 'white', sel: '.test-arrow-wrap.right .arrow.white', f: 'tx' },
      { k: 'black', sel: '.test-arrow-wrap.right .arrow.black', f: 'tx' }],
    seq: [['in', 600], ['out', 600], ['in', 100], ['out', 100], ['in', 600], ['out', 600]] },
  M13L: { sel: '.test-arrow-wrap.left', i: 0, specs: [
      { k: 'bg', sel: '.test-arrow-wrap.left', f: 'bg' }, { k: 'white', sel: '.test-arrow-wrap.left .arrow.white', f: 'tx' },
      { k: 'black', sel: '.test-arrow-wrap.left .arrow.black', f: 'tx' }],
    seq: [['in', 600], ['out', 600]] },
  M14: { sel: '.integration-block.bl', i: 0, specs: [
      { k: 'bg', sel: '.integration-block.bl', f: 'bg' }, { k: 'wop', sel: '.integration-block.bl .integration-logo.white', f: 'op' },
      { k: 'bop', sel: '.integration-block.bl .integration-logo.black', f: 'op' }],
    seq: [['in', 400], ['out', 400], ['in', 80], ['out', 80], ['in', 400], ['out', 400]] },
  M14s: { sel: '.secure-block', i: 0, specs: [
      { k: 'bg', sel: '.secure-block', f: 'bg' }, { k: 'wop', sel: '.secure-block .secure-logo.white', f: 'op' },
      { k: 'bop', sel: '.secure-block .secure-logo.black', f: 'op' }],
    seq: [['in', 400], ['out', 400], ['in', 80], ['out', 80], ['in', 400], ['out', 400]] },
}

const browser = await chromium.launch()
const page = await open(browser, url, 1440, 900)
const result = {}
for (const [id, s] of Object.entries(SCEN)) {
  if (only.length && !only.includes(id)) continue
  await page.mouse.move(2, 2)
  const box = await center(page, s.sel, s.i)
  const outPt = { x: box.x, y: box.y - box.h / 2 - 30 }
  await page.mouse.move(outPt.x, outPt.y)
  await page.waitForTimeout(300)
  const rest = await page.evaluate((sp) => window.__m2.read(sp), s.specs)
  await page.evaluate(([sp, sel]) => window.__m2.arm(sp, sel), [s.specs, s.sel])
  for (const [dir, ms] of s.seq) {
    if (dir === 'in') await page.mouse.move(box.x, box.y); else await page.mouse.move(outPt.x, outPt.y)
    await page.waitForTimeout(ms)
  }
  const rec = await page.evaluate(() => window.__m2.stop())
  const keys = s.specs.map((x) => x.k)
  result[id] = { rest, events: rec.events, perEvent: rec.events.map((e, i) => ({ event: e.type, t: e.t, values: at(rec, i, OFF.filter((o) => i + 1 >= rec.events.length || o <= rec.events[i + 1].t - e.t), keys) })) }
  console.log(`\n== ${id} rest`, JSON.stringify(rest), 'events', rec.events.map((e) => e.type[5] + e.t).join(' '))
  for (const pe of result[id].perEvent) console.log(' ', pe.event, pe.t, pe.values.map((v) => `${v.dt}:` + keys.map((k) => v[k]).join('/')).join('  '))
}
result.errors = page.__errors
console.log('errors', page.__errors)
fs.writeFileSync(new URL(`../hover-${which}${only.length ? '-' + only.join('_') : ''}.json`, import.meta.url), JSON.stringify(result, null, 2))
await browser.close()
