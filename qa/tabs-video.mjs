// Behavioural check: specialty tabs swap the visible image on hover/click; hero video visible at top.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const url = process.argv[2] || 'http://127.0.0.1:5179/'
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800)
const topVideo = await p.evaluate(() => { const w = document.querySelector('.bg-pixels-wrapper'); return { wrapperOpacity: w && getComputedStyle(w).opacity, playing: !document.querySelector('video').paused } })
console.log('top of page video', JSON.stringify(topVideo))
await p.locator('[data-section="specialties"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200)
const visibleImg = () => p.evaluate(() => [...document.querySelectorAll('[data-section="specialties"] .specialty-tab-pane')].filter((e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0).map((e) => e.querySelector('img').getAttribute('src')))
const tabs = p.locator('[data-section="specialties"] .specialty-tab-link')
console.log('tabs', await tabs.count(), 'initial', await visibleImg())
for (const i of [1, 4, 9]) { await tabs.nth(i).hover(); await p.waitForTimeout(100); console.log(`hover ${i}:`, await tabs.nth(i).innerText(), await visibleImg()) }
await tabs.nth(6).click(); await p.waitForTimeout(100); console.log('click 6:', await tabs.nth(6).innerText(), await visibleImg())
await b.close()
