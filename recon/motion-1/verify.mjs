// Motion-1 verification sampler. Runs the same measurements against the live original and
// the clone and writes JSON. Usage: node recon/motion-1/verify.mjs <url> <label> <W> <H> [ids]
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const [url, label, W = '1440', H = '900', only = 'all'] = process.argv.slice(2)
const want = (id) => only === 'all' || only.split(',').includes(id)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +W, height: +H } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(2500)
await page.evaluate(() => {
  const val = (sel, prop) => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel
    if (!el) return null
    if (prop === 'y') { const m = new DOMMatrix(getComputedStyle(el).transform); return +m.m42.toFixed(2) }
    if (prop === 'scale') { const m = new DOMMatrix(getComputedStyle(el).transform); return +m.a.toFixed(4) }
    if (prop === 'opacity') return +(+getComputedStyle(el).opacity).toFixed(3)
    return getComputedStyle(el)[prop]
  }
  window.__val = val
  window.__startSample = (spec, ms) => {
    window.__p = new Promise((res) => {
      const out = []
      const t0 = performance.now()
      const f = () => {
        const t = performance.now() - t0
        out.push([Math.round(t), Math.round(scrollY), ...spec.map(([s, p]) => val(s, p))])
        if (t < ms) requestAnimationFrame(f)
        else res(out)
      }
      f()
    })
  }
})
const sample = async (spec, ms, action) => {
  await page.evaluate(([s, m]) => window.__startSample(s, m), [spec, ms])
  await action()
  return page.evaluate(() => window.__p)
}
const scroll = (y) => page.evaluate((y) => window.scrollTo(0, y), y)
const settle = (ms = 400) => page.waitForTimeout(ms)
const out = { url, label, viewport: [+W, +H] }

if (want('M3')) {
  await scroll(0); await settle(800)
  const spec = [['.bg-pixels-wrapper', 'opacity']]
  out.M3 = {
    down: await sample(spec, 750, () => scroll(300)),
    up: await sample(spec, 750, () => scroll(0)),
    at89: (await scroll(89), await settle(700), await page.evaluate(() => __val('.bg-pixels-wrapper', 'opacity'))),
    at91: (await scroll(91), await settle(700), await page.evaluate(() => __val('.bg-pixels-wrapper', 'opacity'))),
  }
  await scroll(0); await settle(700)
}

if (want('M4')) {
  const top = await page.evaluate(() => document.querySelector('.white-section').getBoundingClientRect().top + scrollY)
  const bottom = await page.evaluate(() => document.querySelector('.white-section').getBoundingClientRect().bottom + scrollY)
  const spec = [['.nav-menu', 'backgroundColor'], ['.nav-link-block', 'color'], ['.nav-text.hiden', 'color'], ['.logo-white', 'opacity'], ['.logo-black', 'opacity'], ['.burger-black', 'opacity'], ['.nav-border-on-white', 'opacity']]
  await scroll(top - 60 - 20); await settle(500)
  out.M4 = {
    whiteTop: top, whiteBottom: bottom,
    before: await page.evaluate((s) => s.map(([a, b]) => __val(a, b)), spec),
    enter: await sample(spec, 150, () => scroll(top - 60 + 20)),
    leave: await sample(spec, 150, () => scroll(bottom - 60 + 20)),
    enterBack: await sample(spec, 150, () => scroll(bottom - 60 - 20)),
    leaveBack: await sample(spec, 150, () => scroll(top - 60 - 20)),
  }
}

if (want('M7')) {
  const trig = await page.evaluate(() => ['_1', '_2', 'space'].map((c) => { const r = document.querySelector('.hiw-trigger.' + c).getBoundingClientRect(); return r.bottom + scrollY }))
  const vh = +H
  const p1 = Math.round(trig[0] - vh / 2), p2 = Math.round(trig[1] - vh / 2), p3 = Math.round(trig[2])
  const spec = [['.hiw-text-block.left', 'y'], ['.hiw-text._1', 'color'], ['.hiw-text._2', 'color'], ['.hiw-text._3', 'color']]
  await scroll(p1 - 150); await settle(600)
  out.M7 = { points: [p1, p2, p3], init: await page.evaluate((s) => s.map(([a, b]) => __val(a, b)), spec) }
  out.M7.step1 = await sample(spec, 400, () => scroll(p1 + 5))
  out.M7.step2 = await sample(spec, 400, () => scroll(p2 + 5))
  out.M7.space = await sample(spec, 400, () => scroll(p3 + 5))
  out.M7.spaceBack = await sample(spec, 400, () => scroll(p3 - 5))
  out.M7.step2Back = await sample(spec, 400, () => scroll(p2 - 5))
  out.M7.step1Back = await sample(spec, 400, () => scroll(p1 - 5))
}

if (want('M8')) {
  out.M8 = {}
  for (const sel of ['.transition-cont.black-to-white', '.transition-cont.white-to-black', '.transition-cont.black-to-img']) {
    const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel)
    const start = top - +H, end = top + 0.2 * +H
    const rows = []
    for (const p of [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]) {
      await scroll(Math.round(start + p * (end - start))); await settle(120)
      rows.push([p, await page.evaluate((s) => {
        const c = document.querySelector(s)
        return [5, 4, 3, 2, 1].map((r) => [...c.querySelectorAll('.transition-wrap')].map((w) => {
          const px = [...w.querySelectorAll(`.grid-row._${r} .pixel`)]
          return px.filter((e) => +getComputedStyle(e).opacity > 0.5).length
        }).join('/')).join(' ')
      }, sel)])
    }
    // back up to before the start: must revert (scrub reverse)
    await scroll(Math.round(start - 50)); await settle(150)
    const back = await page.evaluate((s) => [...document.querySelector(s).querySelectorAll('.pixel')].filter((e) => +getComputedStyle(e).opacity > 0.5).length, sel)
    out.M8[sel] = { start, end, rows, beforeStartOpaque: back }
  }
}

if (want('M9')) {
  const tops = await page.evaluate(() => [2, 3, 4].map((n) => { const e = document.querySelector('.scheduling-card._' + n); return e.getBoundingClientRect().top + scrollY }))
  // natural (un-stuck) tops only valid when not stuck — measure from scroll 0
  const spec = [1, 2, 3].flatMap((n) => [[`.scheduling-card._${n}`, 'y'], [`.scheduling-card._${n}`, 'scale'], [`.scheduling-card._${n}`, 'backgroundColor']]).concat([['.sch-img._3', 'opacity']])
  await scroll(0); await settle(300)
  const nat = await page.evaluate(() => [2, 3, 4].map((n) => { const e = document.querySelector('.scheduling-card._' + n); return e.getBoundingClientRect().top + scrollY }))
  out.M9 = { naturalTops: nat, settled: [] }
  const vh = +H
  for (const n of [0, 1, 2]) {
    const s = nat[n] - vh / 2, e = s + (await page.evaluate((k) => document.querySelector('.scheduling-card._' + k).offsetHeight, n + 2)) - vh / 2
    for (const p of [-0.5, 0, 0.25, 0.5, 0.75, 1, 1.5]) {
      const y = Math.round(s + p * (e - s))
      await scroll(y); await settle(1200)
      out.M9.settled.push([`card${n + 2}`, p, y, await page.evaluate((sp) => sp.map(([a, b]) => __val(a, b)), spec)])
    }
  }
  // scrub lag: jump from card2 start to card2 end and sample 1.2s
  const s2 = nat[0] - vh / 2
  await scroll(Math.round(s2 - 20)); await settle(1500)
  out.M9.lag = await sample(spec.slice(0, 2), 1200, () => scroll(Math.round(s2 + 200)))
  await scroll(99999); await settle(1500)
  out.M9.pageEnd = await page.evaluate((sp) => sp.map(([a, b]) => __val(a, b)), spec)
  await scroll(0); await settle(1500)
  out.M9.pageTop = await page.evaluate((sp) => sp.map(([a, b]) => __val(a, b)), spec)
}

if (want('M15') && +W >= 992) {
  await scroll(0); await settle(500)
  const spec = [['.nav-links-left .nav-link-block .nav-text', 'y'], ['.nav-links-left .nav-link-block .nav-text.hiden', 'y']]
  await page.mouse.move(700, 500)
  const box = await page.locator('.nav-links-left .nav-link-block').first().boundingBox()
  out.M15 = {
    in: await sample(spec, 350, () => page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)),
    out: await sample(spec, 350, () => page.mouse.move(700, 500)),
  }
}

if (want('M18') && +W <= 991) {
  await scroll(0); await settle(500)
  const spec = [['.nav-cross-white', 'opacity'], ['.menu-btn-wrap', 'borderLeftColor'], ['.menu-btn-wrap', 'borderBottomColor'], ['.burger-white', 'display'], ['.burger-black', 'display'], ['.nav-links-left .nav-link-block', 'color'], ['.nav-links', 'display']]
  out.M18 = { cycles: [] }
  for (let i = 0; i < 3; i++) {
    const open = await sample(spec, 350, () => page.evaluate(() => document.querySelector('.menu-btn').click()))
    const lock = await page.evaluate(() => ({ htmlOverflow: getComputedStyle(document.documentElement).overflow, menuOpen: document.documentElement.dataset.menuOpen ?? null, lenisStopped: document.documentElement.classList.contains('lenis-stopped') }))
    const y0 = await page.evaluate(() => scrollY)
    await page.mouse.move(+W / 2, +H / 2); await page.mouse.wheel(0, 400); await settle(600)
    const y1 = await page.evaluate(() => scrollY)
    const close = await sample(spec, 350, () => page.evaluate(() => document.querySelector('.menu-btn').click()))
    const unlock = await page.evaluate(() => ({ htmlOverflow: getComputedStyle(document.documentElement).overflow, menuOpen: document.documentElement.dataset.menuOpen ?? null }))
    out.M18.cycles.push({ open, lock, wheelWhileOpen: [y0, y1], close, unlock })
    await settle(300)
  }
}

if (want('M22')) {
  await scroll(0); await settle(800)
  await page.mouse.move(+W / 2, +H / 2)
  out.M22 = { wheel: await sample([], 1500, () => page.mouse.wheel(0, 500)) }
  out.M22.final = await page.evaluate(() => scrollY)
  await scroll(0); await settle(500)
}

if (want('M21')) {
  out.M21 = await page.evaluate(async () => {
    const v = document.querySelector('.bg-pixels-wrapper video')
    const t0 = v.currentTime
    await new Promise((r) => setTimeout(r, 1000))
    return { loop: v.loop, muted: v.muted, autoplay: v.autoplay, duration: +v.duration.toFixed(2), paused: v.paused, advanced: +(v.currentTime - t0).toFixed(2), hasVideo: document.documentElement.classList.contains('has-video'), w: v.videoWidth, h: v.videoHeight }
  })
}

out.errors = errors
fs.writeFileSync(new URL(`./${label}-${W}.json`, import.meta.url), JSON.stringify(out, null, 1))
console.log('wrote', `${label}-${W}.json`, 'errors', errors.length)
await browser.close()
