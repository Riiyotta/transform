// CMP-M4 accordion timing, CMP-M5 sticky header (390), BAD-M2 focus border, M3b video fade.
// Usage: node recon/motion-3/checks.mjs <base>
import { createRequire } from 'module'; const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const base = process.argv[2]; const live = base.includes('transform9')
const b = await chromium.launch(); const out = {}
const open = async (path, w) => { const ctx = await b.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 } }); const p = await ctx.newPage(); await p.goto(base + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(live ? 8000 : 3000); return { ctx, p } }
// CMP-M4
for (const w of [1440, 390]) {
  const { ctx, p } = await open('/compare', w)
  await p.evaluate(() => document.querySelectorAll('.ev-tab')[2].scrollIntoView({ block: 'center' })); await p.waitForTimeout(1500)
  const read = () => p.evaluate(() => [...document.querySelectorAll('.ev-tab')].map((t) => [getComputedStyle(t).backgroundColor, getComputedStyle(t.querySelector('.ev-tab-text')).display].join(' ')))
  const before = await read()
  await p.locator('.ev-tab').nth(2).click(); const t1 = await read(); await p.waitForTimeout(300); const t2 = await read()
  out[`CMP-M4 ${w}`] = { before, afterClickImmediate: t1, after300: t2 }
  // CMP-M5 sticky header
  if (w === 390) {
    const r = await p.evaluate(async () => {
      const sel = [...document.querySelectorAll('.table-section *')].find((e) => getComputedStyle(e).position === 'sticky')
      if (!sel) return null
      const sec = document.querySelector('.table-section'); window.scrollTo(0, sec.getBoundingClientRect().top + scrollY + sec.offsetHeight / 2)
      await new Promise((r) => setTimeout(r, 1200))
      return { cls: sel.className, pos: getComputedStyle(sel).position, top: getComputedStyle(sel).top, rectTop: Math.round(sel.getBoundingClientRect().top), transition: getComputedStyle(sel).transitionDuration }
    })
    out['CMP-M5 390'] = r
  }
  await ctx.close()
}
// BAD-M2
for (const w of [1440, 390]) {
  const { ctx, p } = await open('/book-a-demo', w)
  const inp = p.locator('.w-input').first()
  const bc = () => inp.evaluate((e) => [getComputedStyle(e).borderTopColor, getComputedStyle(e).transitionDuration].join(' '))
  const before = await bc(); await inp.click(); const t0 = await bc(); await p.waitForTimeout(300); const t300 = await bc()
  out[`BAD-M2 ${w}`] = { before, focusImmediate: t0, focus300: t300 }
  await ctx.close()
}
// M3b video fade
for (const path of ['/compare', '/book-a-demo', '/terms-of-use', '/blog']) for (const w of [1440, 390]) {
  const { ctx, p } = await open(path, w)
  const op = () => p.evaluate(() => +getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity)
  const s0 = await op()
  await p.evaluate(() => window.scrollTo(0, innerHeight * 0.3)); await p.waitForTimeout(900); const s1 = await op()
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(900); const s2 = await op()
  out[`M3b ${path} ${w}`] = { top: s0, scrolled30vh: s1, backToTop: s2 }
  await ctx.close()
}
console.log(JSON.stringify(out, null, 1)); await b.close()
