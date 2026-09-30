// Inspect the runtime state of /blog?523ae0d4_page=2 (items, pagination links) before and after Load More.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await p.goto('https://www.transform9.com/blog?523ae0d4_page=2', { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(3000)
const st = () => p.evaluate(() => ({ url: location.href, items: [...document.querySelectorAll('.blogs-list.all .blogs-item a')].map(a => a.getAttribute('href').slice(6, 40)), pag: [...document.querySelectorAll('.w-pagination-wrapper > *')].map(e => [e.className, e.getAttribute('href'), getComputedStyle(e).display, e.textContent.trim()]) }))
console.log(JSON.stringify(await st()))
await p.evaluate(() => window.scrollTo(0, 2600)); await p.waitForTimeout(500)
await p.screenshot({ path: '/Users/riyaghosh/V3/transform/recon/pages/blog/shots/state-1440-page2-pagination.png' })
if (await p.locator('.load-more:visible').count()) { await p.click('.load-more'); await p.waitForTimeout(2500); console.log('after load more', JSON.stringify(await st())) }
await b.close()
