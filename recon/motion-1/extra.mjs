// Extra checks: menu open/close while on the white section (M4 x M18) at 390, and
// prefers-reduced-motion (M21: still image instead of video). Usage: node extra.mjs <url> <label>
import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const [url, label] = process.argv.slice(2)
const browser = await chromium.launch()
const out = { url }
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }); await page.waitForTimeout(2000)
  const top = await page.evaluate(() => document.querySelector('.white-section').getBoundingClientRect().top + scrollY)
  await page.evaluate((y) => scrollTo(0, y), top + 1500); await page.waitForTimeout(600)
  const st = () => page.evaluate(() => {
    const cs = (s, p) => getComputedStyle(document.querySelector(s))[p]
    return { navBg: cs('.nav-menu', 'backgroundColor'), burgerWhite: [cs('.burger-white', 'opacity'), cs('.burger-white', 'display')], burgerBlack: [cs('.burger-black', 'opacity'), cs('.burger-black', 'display')], cross: cs('.nav-cross-white', 'opacity'), link: cs('.nav-links-left .nav-link-block', 'color'), menu: cs('.nav-links', 'display'), scrollY: Math.round(scrollY) }
  })
  out.onWhiteClosed = await st()
  await page.evaluate(() => document.querySelector('.menu-btn').click()); await page.waitForTimeout(500)
  out.onWhiteOpen = await st()
  await page.mouse.move(195, 400); await page.mouse.wheel(0, 600); await page.waitForTimeout(600)
  out.onWhiteOpenAfterWheel = await st()
  await page.evaluate(() => document.querySelector('.menu-btn').click()); await page.waitForTimeout(500)
  out.onWhiteClosedAgain = await st()
  await page.close()
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }); await page.waitForTimeout(2500)
  out.reducedMotion = await page.evaluate(() => {
    const v = document.querySelector('.bg-pixels-wrapper video')
    return { hasVideo: document.documentElement.classList.contains('has-video'), paused: v.paused, pic: getComputedStyle(document.querySelector('.bg-pic-pixels')).display, lenis: document.documentElement.classList.contains('lenis') }
  })
  await ctx.close()
}
fs.writeFileSync(new URL(`./extra-${label}.json`, import.meta.url), JSON.stringify(out, null, 1))
console.log(JSON.stringify(out))
await browser.close()
