// Intro sampler (CMP-M1, BAD-M1, LGL-M1, BLOG-M1..M4) on a shared timebase.
// t0 is derived analytically from the first in-flight sample of the preloader (1 -> 0, .1s
// power1.out at pos 0) or, without a preloader, the pixels wrapper (0 -> 1, .08s power1.out
// at pos .02) - identical method for live and clone. Values are linearly interpolated from
// rAF samples at t0 + 0/100/300/600/1000/1500/2500ms.
// Usage: node recon/motion-3/intro.mjs <base> <width> [reduce] > out.json
import { createRequire } from 'module'; const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const W = +(process.argv[3] || 1440); const reduce = process.argv[4] === 'reduce'
const live = base.includes('transform9')
const PATHS = (process.env.PATHS || '/compare,/book-a-demo,/terms-of-use,/blog,/case-studies,/blog/ai-voice-agents-for-athenahealth-7-questions-to-ask-before-choosing-a-platform,/case-studies/southern-bone-joint').split(',')
const AT = [0, 100, 300, 600, 1000, 1500, 2500]
const SEL = { pre: '.preloader-wrap', nav: '.nav-menu', px: '.bg-pixels-wrapper', ov: '.bg-pixels-overlay', L: '.hero-bottom-block.left', R: '.hero-bottom-block.right', FW: '.hero-bottom-block.full-width', featured: '.featured-post', list: '.all-blogs-section', header: '.blog-top-header', body: '.post-body-section' }
const SAMPLER = `(() => {
  const SEL = ${JSON.stringify(SEL)}; const S = window.__s = []; const T0 = performance.now()
  const words = () => document.querySelectorAll('h1 .gsap_split_word, h1 [class*="gsap_split_word"]')
  const f = () => {
    const r = { t: performance.now() }
    for (const k in SEL) { const e = document.querySelector(SEL[k]); r[k] = e ? +getComputedStyle(e).opacity : null }
    const lh = document.querySelector('.line-hor.on-hero'); r.lh = lh ? +lh.getBoundingClientRect().width.toFixed(1) : null
    const lv = document.querySelector('.line-vert'); r.lv = lv ? +lv.getBoundingClientRect().height.toFixed(1) : null
    const w = [...words()]; r.nw = w.length
    const wv = (e) => { if (!e) return [null, null]; const c = getComputedStyle(e); const m = new DOMMatrix(c.transform === 'none' ? undefined : c.transform); return [+c.opacity, +m.m42.toFixed(2)] }
    ;[r.w1o, r.w1y] = wv(w[0]); [r.w4o, r.w4y] = wv(w[3]); [r.wLo, r.wLy] = wv(w[w.length - 1])
    r.intro = window.__pageIntro ? window.__pageIntro.t0 : null
    S.push(r); if (performance.now() - T0 < 60000 && !window.__stop) requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
})();`
const b = await chromium.launch()
const res = {}
for (const path of PATHS) {
  const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 900 }, reducedMotion: reduce ? 'reduce' : 'no-preference' })
  const p = await ctx.newPage(); await p.addInitScript(SAMPLER)
  await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }).catch(() => {})
  // wait until the intro has run + 3s
  const deadline = Date.now() + 60000
  let S
  for (;;) {
    await p.waitForTimeout(1000)
    S = await p.evaluate(() => window.__s)
    const k = S.some((r) => r.pre !== null) ? 'pre' : 'px'
    const i = S.findIndex((r, j) => j > 0 && r[k] !== null && (k === 'pre' ? r.pre < 1 && S[j - 1].pre === 1 : r.px > 0 && r.px < 1))
    if ((i > 0 && S[S.length - 1].t - S[i].t > 3000) || Date.now() > deadline) break
  }
  await p.evaluate(() => { window.__stop = true })
  const counts = await p.evaluate((SEL) => { const o = {}; for (const k in SEL) o[k] = document.querySelectorAll(SEL[k]).length; o.lh = document.querySelectorAll('.line-hor.on-hero').length; o.lv = document.querySelectorAll('.line-vert').length; return o }, SEL)
  // t0
  const hasPre = S.some((r) => r.pre !== null)
  let t0 = null, how = null
  for (let j = 1; j < S.length; j++) {
    const r = S[j]
    if (hasPre && r.pre !== null && r.pre < 1 && r.pre > 0 && S[j - 1].pre === 1) { t0 = r.t - 100 * (1 - Math.sqrt(r.pre)); how = `pre ${r.pre}`; break }
    if (hasPre && r.pre === 0 && S[j - 1].pre === 1) { t0 = r.t - 100; how = 'pre jumped 1->0 (upper bound)'; break }
    if (!hasPre && r.px !== null && r.px > 0 && r.px < 1 && S[j - 1].px === 0) { t0 = r.t - 20 - 80 * (1 - Math.sqrt(1 - r.px)); how = `px ${r.px}`; break }
  }
  // Robust t0: median over all in-flight nav samples of the inverse of expo.out (1.2s at .1).
  if (t0 !== null) {
    const ests = S.filter((r) => r.nav > 0.05 && r.nav < 0.95 && r.t > t0 - 500 && r.t < t0 + 2000).map((r) => r.t - 100 - 1200 * (-Math.log2(1 - r.nav) / 10)).sort((a, b) => a - b)
    if (ests.length >= 3) { const m = ests[ests.length >> 1]; how += ` | nav-fit median of ${ests.length} (Δ ${Math.round(m - t0)}ms vs single-sample)`; t0 = m }
  }
  const firstSeen = S.find((r) => r.nav !== null)
  const interp = (k, t) => { let a = null; for (const r of S) { if (r.t < t0 - 0.5) continue; if (r[k] === null || r[k] === undefined) continue; if (r.t <= t) a = r; else { if (!a) return r[k]; const f = (t - a.t) / (r.t - a.t); return +(a[k] + (r[k] - a[k]) * f).toFixed(3) } } return a ? a[k] : null }
  const keys = ['pre', 'nav', 'px', 'ov', 'L', 'R', 'FW', 'lh', 'lv', 'featured', 'list', 'header', 'body', 'w1o', 'w1y', 'w4o', 'w4y', 'wLo', 'wLy']
  const rows = t0 === null ? null : AT.map((ms) => { const o = { ms }; for (const k of keys) { const v = interp(k, t0 + ms); if (v !== null) o[k] = v } return o })
  const firstFrame = firstSeen && Object.fromEntries(['pre', 'nav', 'px', 'L', 'FW', 'lh', 'featured', 'list', 'header', 'w1o', 'w1y'].map((k) => [k, firstSeen[k]]))
  res[path] = { counts, t0: t0 && Math.round(t0), how, mountToT0: S.find((r) => r.intro)?.intro && t0 ? Math.round(t0 - S.find((r) => r.intro).intro) : null, firstFrame, rows, words: S[S.length - 1].nw }
  console.error(path, W, how, t0 && Math.round(t0))
  await ctx.close()
}
console.log(JSON.stringify(res, null, 1))
await b.close()
