// Sample the IX3 load timeline relative to window 'load' on detail pages; screenshot the pre-load state.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const OUT = '/Users/riyaghosh/V3/transform/recon/pages'
const b = await chromium.launch()
const res = {}
const SAMPLER = `(() => {
  const S = window.__samples = []; let tl = null
  const sels = ['.preloader-wrap', '.nav-menu', '.bg-pixels', '.bg-pixels-overlay', '.blog-top-header', '.post-body-section', '.featured-post', '.all-blogs-section', '.gsap_split_word1', '.gsap_split_word2', '.gsap_split_word6']
  const snap = (t) => { const row = { t }; for (const s of sels) { const e = document.querySelector(s); if (e) { const cs = getComputedStyle(e); row[s] = cs.opacity + (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)' ? ' ' + cs.transform : '') + (cs.visibility === 'hidden' ? ' HID' : '') } } S.push(row) }
  addEventListener('load', () => { const t0 = performance.now(); window.__loadAt = Math.round(t0); const tick = () => { const t = performance.now() - t0; if (t > 2500) return; snap(Math.round(t)); requestAnimationFrame(tick) }; tick() })
  window.__pre = []; const iv = setInterval(() => { if (window.__loadAt) return clearInterval(iv); const e = document.querySelector('.preloader-wrap'); if (e) window.__pre.push([Math.round(performance.now()), getComputedStyle(e).opacity, getComputedStyle(e).visibility, getComputedStyle(e).display]) }, 1000)
})()`
for (const [key, path] of [['post', '/blog/redefining-healthcare-ai'], ['cs', '/case-studies/southern-bone-joint'], ['csindex', '/case-studies']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(SAMPLER)
  const p = await ctx.newPage()
  const pending = new Map(); p.on('request', r => pending.set(r, Date.now())); p.on('requestfinished', r => pending.delete(r)); p.on('requestfailed', r => pending.delete(r))
  p.goto('https://www.transform9.com' + path, { waitUntil: 'load', timeout: 120000 }).catch(() => {})
  await p.waitForTimeout(4000)
  await p.screenshot({ path: `${OUT}/${key === 'post' ? 'blog' : 'case-studies'}/shots/preload-${key}-4s.png` })
  const slow = [...pending.keys()].map(r => r.url().slice(0, 120))
  await p.waitForFunction(() => window.__loadAt, null, { timeout: 120000 }).catch(() => {})
  await p.waitForTimeout(3000)
  const s = await p.evaluate(() => ({ load: window.__loadAt, pre: window.__pre, samples: window.__samples }))
  const rows = []; let prev = ''
  for (const r of s.samples) { const k = JSON.stringify({ ...r, t: 0 }); if (k !== prev) { rows.push(r); prev = k } }
  res[key] = { path, loadAt: s.load, preloaderBeforeLoad: s.pre, pendingAt4s: slow, changes: rows }
  await ctx.close()
}
fs.writeFileSync(`${OUT}/load-timeline-detail.json`, JSON.stringify(res, null, 1))
await b.close()
