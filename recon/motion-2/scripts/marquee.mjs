// M1/M2 marquee speed: sample translateX of each track over 2s. Usage: node marquee.mjs live|clone
import { chromium, LIVE, CLONE, open } from './lib.mjs'
import fs from 'fs'
const which = process.argv[2] || 'clone'
const url = which === 'live' ? LIVE : CLONE
const browser = await chromium.launch()
const out = {}
for (const [w, h] of [[1440, 900], [1024, 900], [768, 1024], [390, 844]]) {
  const page = await open(browser, url, w, h)
  const read = () => page.evaluate(() => {
    const f = (sel) => [...document.querySelectorAll(sel)].map((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform)
      return { x: m.m41, w: el.getBoundingClientRect().width, anim: getComputedStyle(el).animationName + ' ' + getComputedStyle(el).animationDuration + ' ' + getComputedStyle(el).animationTimingFunction }
    })
    return { t: performance.now(), logos: f('.logos-wrapper'), r1: f('.intagrations-row._1'), r2: f('.intagrations-row._2') }
  })
  const a = await read(); await page.waitForTimeout(2000); const b = await read()
  const dt = (b.t - a.t) / 1000
  const speed = (k) => a[k].map((v, i) => {
    let d = b[k][i].x - v.x
    if (Math.abs(d) > v.w / 2) d += d > 0 ? -v.w : v.w // wrapped during window
    return { width: +v.w.toFixed(1), pxPerSec: +(d / dt).toFixed(2), expected: +((k === 'r2' ? 1 : -1) * v.w / (k === 'logos' ? 44.99 : 29.99)).toFixed(2), x0: +v.x.toFixed(1), anim: v.anim }
  })
  out[w] = { logos: speed('logos'), r1: speed('r1'), r2: speed('r2') }
  console.log(w, JSON.stringify(out[w].logos[0]), JSON.stringify(out[w].r1[0]), JSON.stringify(out[w].r2[0]), 'errors', page.__errors.length)
  await page.close()
}
fs.writeFileSync(new URL(`../marquee-${which}.json`, import.meta.url), JSON.stringify(out, null, 2))
await browser.close()
