// Builder D verification: clone vs live recon JSON for /book-a-demo and the legal template.
// Usage: node recon/build-demo-legal/measure.mjs [route ...]   (default: all four routes)
// Writes clone-{page}-{w}.json + screenshots next to this file and prints a diff table.
import fs from 'node:fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')

const BASE = 'http://127.0.0.1:5179'
const OUT = '/Users/riyaghosh/V3/transform/recon/build-demo-legal'
const REC = '/Users/riyaghosh/V3/transform/recon/pages'
const VP = [[1440, 900], [1024, 900], [768, 1024], [390, 844]]

const LEGAL = (variant) => ({
  'section.hero.hide-on-scroll': '[data-section="hero"]',
  'h1.white-text.hero-home.legal': '.legal-hero h1',
  'div.hero-home-bottom.legal': '.legal-hero .hero-home-bottom',
  'div.hero-bottom-block.full-width': '.legal-hero .hero-bottom-block',
  'div._16px-text.white-text': '.legal-hero .label-16',
  [`p._30px-text.home-hero-text.white.legal-${variant}`]: '.legal-hero .home-hero-text',
  'section.legal-section': '.legal-section',
  'div.legal-cont': '.legal-cont',
  'div.legal-block': '.legal-block:not(.last)',
  'div.legal-text-wrap': '.legal-text-wrap',
  'h2._30px-text.white': '.legal-section h2',
  'p._16px-text.white-text.transp': '.legal-section .label-16.transp',
  'p._22px-text-green': '.text-22-green',
  'ul.list-white.transp': '.list-white',
  'li.list-item': '.list-item',
  'a.link-transp': '.link-transp',
  'div.legal-block.last': '.legal-block.last',
  'section.footer.section': '[data-section="footer"]',
  'div.footer-bottom-wrap': '.footer-bottom-wrap',
})
const PAGES = {
  'terms-of-use': { rec: 'legal/terms', map: LEGAL('terms') },
  'privacy-policy': { rec: 'legal/privacy', map: LEGAL('privacy') },
  hipaa: { rec: 'legal/hipaa', map: LEGAL('privacy') },
  'book-a-demo': {
    rec: 'book-a-demo/bad',
    map: {
      'section.hero.hide-on-scroll.demo': '[data-section="hero"]',
      'div.book-demo-left': '.book-demo-left',
      'h1.white-text.hero-home.demo': '.book-demo-left h1',
      'div.text-block-5': '.text-block-5',
      'div.book-demo-right': '.book-demo-right',
      'div.bg-noise.book-demo-form-noise': '.book-demo-form-noise',
      'div.w-form': '.book-demo-right .w-form',
      label: '.demo-form label',
      'input.w-input': '.demo-form .w-input',
      'input.w-button': '.demo-form .w-button',
      'div.footer-bottom-wrap': '.footer-bottom-wrap',
    },
  },
}
const PROPS = ['fontSize', 'lineHeight', 'color', 'marginTop', 'marginLeft', 'maxWidth', 'paddingTop', 'opacity']

const routes = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PAGES)
const browser = await chromium.launch()
const summary = []
for (const route of routes) {
  const cfg = PAGES[route]
  for (const [w, h] of VP) {
    const live = JSON.parse(fs.readFileSync(`${REC}/${cfg.rec}-${w}.json`, 'utf8'))
    const liveEls = Object.fromEntries(live.els.map((e) => [e.key, e]))
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    const errors = [], external = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data')) external.push(r.url()) })
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    const res = await page.evaluate(({ map, PROPS }) => {
      const out = {}
      for (const [key, sel] of Object.entries(map)) {
        const el = document.querySelector(sel)
        if (!el) { out[key] = null; continue }
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
        out[key] = { count: document.querySelectorAll(sel).length, rect: { x: +r.x.toFixed(2), y: +(r.y + scrollY).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }, ...Object.fromEntries(PROPS.map((p) => [p, cs[p]])) }
      }
      return {
        height: document.documentElement.scrollHeight,
        overflowX: document.documentElement.scrollWidth - innerWidth,
        font: document.fonts.check('16px "Polysans Neutral"'),
        title: document.title,
        els: out,
      }
    }, { map: cfg.map, PROPS })
    res.errors = errors
    res.external = external
    fs.writeFileSync(`${OUT}/clone-${route}-${w}.json`, JSON.stringify(res, null, 1))
    await page.screenshot({ path: `${OUT}/clone-${route}-${w}-top.png` })
    await page.screenshot({ path: `${OUT}/clone-${route}-${w}-full.png`, fullPage: true })
    console.log(`\n== ${route} @${w}: height ${res.height} (live ${live.scrollH}, Δ${(res.height - live.scrollH).toFixed(1)}) overflowX ${res.overflowX} font ${res.font} errors ${errors.length} external ${external.length} title "${res.title}"`)
    errors.slice(0, 5).forEach((e) => console.log('   ERR', e))
    external.slice(0, 5).forEach((e) => console.log('   EXT', e))
    summary.push([route, w, res.height, live.scrollH, res.overflowX, errors.length, external.length, res.font])
    for (const [key, c] of Object.entries(res.els)) {
      const l = liveEls[key]
      if (!l) { console.log(`   ${key}: (no live entry)`, c && c.rect); continue }
      if (!c) { console.log(`   ${key}: MISSING in clone (live ${JSON.stringify(l.rect)})`); continue }
      const d = ['x', 'y', 'w', 'h'].map((k) => +(c.rect[k] - l.rect[k]).toFixed(1))
      const bad = d.some((v) => Math.abs(v) > 1)
      const pd = ['fontSize', 'lineHeight', 'color'].filter((p) => l[p] && c[p] !== l[p]).map((p) => `${p} ${c[p]} vs ${l[p]}`)
      console.log(`   ${bad || pd.length ? '!!' : 'ok'} ${key} [${c.count}/${l.count}] clone ${c.rect.x},${c.rect.y} ${c.rect.w}x${c.rect.h} | live ${l.rect.x},${l.rect.y} ${l.rect.w}x${l.rect.h} | Δ ${d.join(',')} ${pd.join('; ')}`)
    }
    await page.close()
  }
}
await browser.close()
console.log('\nSUMMARY route,w,clone,live,overflowX,errors,external,font')
summary.forEach((s) => console.log(s.join(',')))
