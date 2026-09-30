// Route smoke + integration sanity check (main session, independent of builders).
// Usage: node qa/smoke.mjs [baseUrl]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')

const BASE = process.argv[2] || 'http://127.0.0.1:5179/'
const VIEWPORTS = [[1440, 900, 25922], [1024, 900, 22731], [768, 1024, 14430], [390, 844, 17939]]
const SECTIONS = ['hero', 'client-logos', 'client-spotlight', 'stats', 'testimonials', 'how-it-works', 'white-section',
  'transition-black-to-white', 'scheduling-agent', 'tasking-agent', 'navigator-agent', 'outreach-agent',
  'transition-white-to-black', 'specialties', 'integrations', 'security', 'cta']

const browser = await chromium.launch()
let failures = 0
for (const [w, h, liveHeight] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const errors = [], external = [], failed = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data')) external.push(r.url()) })
  page.on('requestfailed', (r) => failed.push(r.url()))
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // Scroll through once so lazy images load (matches how recon measured the live page).
  for (let y = 0; y < 30000; y += 400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(20) }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300)
  const r = await page.evaluate((ids) => ({
    title: document.title,
    height: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth - innerWidth,
    font: document.fonts.check('16px "Polysans Neutral"'),
    missing: ids.filter((id) => !document.querySelector(`[data-section="${id}"]`)),
    stubs: [...document.querySelectorAll('[data-stub]')].map((e) => e.dataset.section),
    brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src),
  }), SECTIONS)
  const ok = !errors.length && !external.length && !failed.length && r.overflowX <= 0 && r.font && !r.missing.length && !r.stubs.length && !r.brokenImgs.length && r.title.startsWith('Transform9')
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${w}: height ${r.height} (live ${liveHeight}, Δ${r.height - liveHeight}) overflowX ${r.overflowX} font ${r.font} errors ${errors.length} external ${external.length} failed ${failed.length} missing [${r.missing}] stubs [${r.stubs}] brokenImgs ${r.brokenImgs.length}`)
  for (const x of [...errors, ...external, ...failed, ...r.brokenImgs].slice(0, 8)) console.log('   ', x)
  await page.close()
}
await browser.close()
process.exit(failures ? 1 : 0)
