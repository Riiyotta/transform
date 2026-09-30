// Breakpoint-edge + wide-viewport check: overflow, errors, H1 size vs spec formula. Usage: node qa/edges.mjs [url]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2] || 'http://127.0.0.1:5179/'
// Hero H1: 6.5vw; ≤991 75px; ≤767 12.8vw (CLONE_SPEC §1.4)
const h1 = (w) => (w <= 767 ? 0.128 * w : w <= 991 ? 75 : 0.065 * w)
const b = await chromium.launch(); let fail = 0
for (const w of [1920, 992, 991, 768, 767, 480, 479, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = []
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
  for (let y = 0; y < 30000; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(15) }
  const r = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, fs: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), burger: document.querySelector('.menu-btn-wrap').getBoundingClientRect().width > 0 }))
  const ok = r.ox <= 0 && !errs.length && Math.abs(r.fs - h1(w)) < 0.1 && r.burger === (w <= 991)
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${w}: overflowX ${r.ox} h1 ${r.fs.toFixed(2)} (spec ${h1(w).toFixed(2)}) burger visible ${r.burger} (expect ${w <= 991}) errors ${errs.length}`)
  await p.close()
}
await b.close(); process.exit(fail ? 1 : 0)
