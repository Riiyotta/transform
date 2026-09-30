// Route-level smoke, clone vs live: document height, horizontal overflow, console errors,
// non-localhost requests, title. Usage: node qa/routes.mjs <route,route,...> [widths]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const routes = process.argv[2].split(',')
const widths = (process.argv[3] || '1440,1024,768,390').split(',').map(Number)
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 }
const b = await chromium.launch(); let fail = 0
async function measure(url, w, local) {
  const p = await b.newPage({ viewport: { width: w, height: H[w] || 900 } }); const errs = [], ext = []
  if (local) { p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('request', (r) => { const h = new URL(r.url()).hostname; if (!['127.0.0.1', 'localhost'].includes(h) && !r.url().startsWith('data:')) ext.push(r.url()) }) }
  await p.goto(url, { waitUntil: local ? 'networkidle' : 'load', timeout: 90000 }); await p.evaluate(() => document.fonts.ready)
  for (let y = 0; y < 40000; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(15) }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(local ? 400 : 2500)
  const r = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, ox: document.documentElement.scrollWidth - innerWidth, t: document.title.replace(/&amp;/g, '&') }))
  await p.close(); return { ...r, errs, ext }
}
for (const route of routes) for (const w of widths) {
  const [c, l] = [await measure('http://127.0.0.1:5179' + route, w, true), await measure('https://www.transform9.com' + route, w, false)]
  const ok = Math.abs(c.h - l.h) <= 2 && c.ox === l.ox && !c.errs.length && !c.ext.length
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${route} ${w}: height ${c.h} / live ${l.h} (Δ${c.h - l.h}) overflowX ${c.ox} / live ${l.ox} errors ${c.errs.length} external ${c.ext.length} title "${c.t}" / live "${l.t}"`)
  for (const x of [...c.errs, ...c.ext].slice(0, 4)) console.log('    ', x)
}
await b.close(); process.exit(fail ? 1 : 0)
