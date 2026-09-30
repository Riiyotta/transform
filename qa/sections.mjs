// Print y/height of each data-section at one width. Usage: node qa/sections.mjs 390 844 [scroll]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const [w, h, scroll] = process.argv.slice(2).map(Number)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } })
await p.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
if (scroll) { for (let y = 0; y < 30000; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(20) } await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300) }
console.log(await p.evaluate(() => [...document.querySelectorAll('[data-section]')].map((e) => { const r = e.getBoundingClientRect(); return `${e.dataset.section.padEnd(28)} y ${(r.top + scrollY).toFixed(1).padStart(8)}  h ${r.height.toFixed(1)}` }).join('\n') + `\ndoc ${document.documentElement.scrollHeight}`))
await b.close()
