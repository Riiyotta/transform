// Live interaction/motion probes at 1440: load-in timeline sampling, hover end-states, Load More, scroll-triggered fades.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const OUT = '/Users/riyaghosh/V3/transform/recon/pages'
const b = await chromium.launch()
const res = {}
const SAMPLER = `(() => {
  const S = window.__samples = []; const t0 = performance.now()
  const sels = ['.preloader-wrap', '.nav-menu', '.bg-pixels-wrapper', '.bg-pixels', '.bg-pixels-overlay', '.featured-post', '.all-blogs-section', '.blog-top-header', '.post-body-section', '.gsap_split_word1', '.gsap_split_word4', '.gsap_split_word8', 'h1.hero-home']
  const tick = () => { const now = performance.now(); if (now - t0 > 6000) return; const row = { t: Math.round(now) }; for (const s of sels) { const e = document.querySelector(s); if (e) { const cs = getComputedStyle(e); row[s] = cs.opacity + (cs.transform !== 'none' ? ' ' + cs.transform : '') + (cs.visibility === 'hidden' ? ' HID' : '') } } S.push(row); requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  addEventListener('load', () => { window.__loadAt = Math.round(performance.now()) })
  document.addEventListener('DOMContentLoaded', () => { window.__dclAt = Math.round(performance.now()) })
})()`
async function loadTimeline(path, key) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(SAMPLER)
  const p = await ctx.newPage()
  await p.goto('https://www.transform9.com' + path, { waitUntil: 'load', timeout: 90000 })
  await p.waitForTimeout(5000)
  const s = await p.evaluate(() => ({ load: window.__loadAt, dcl: window.__dclAt, samples: window.__samples }))
  // thin samples: keep rows where any value changed
  const rows = []; let prev = ''
  for (const r of s.samples) { const k = JSON.stringify({ ...r, t: 0 }); if (k !== prev) { rows.push(r); prev = k } }
  res[key] = { dcl: s.dcl, load: s.load, changes: rows }
  await ctx.close()
}
await loadTimeline('/blog', 'load-blog-index')
await loadTimeline('/blog/redefining-healthcare-ai', 'load-blog-post')

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const settle = async () => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(3000) }
const pick = (sel, props) => p.evaluate(([sel, props]) => [...document.querySelectorAll(sel)].slice(0, 1).map(e => { const cs = getComputedStyle(e); return Object.fromEntries(props.map(k => [k, cs.getPropertyValue(k)])) })[0], [sel, props])
// ---- blog index
await p.goto('https://www.transform9.com/blog', { waitUntil: 'networkidle', timeout: 90000 }); await settle()
res.navCurrent = await p.evaluate(() => [...document.querySelectorAll('.nav-link-block')].map(a => ({ cls: a.className, text: a.textContent.trim(), color: getComputedStyle(a).color, textColor: getComputedStyle(a.querySelector('.nav-text') || a).color })))
const card = '.blogs-list.all .blogs-item:first-child .post-link-block'
const cardProbe = async () => ({
  bottomBg: await pick(card + ' .post-bottom-wrap', ['background-color']),
  title: await pick(card + ' ._30px-text', ['color']),
  meta: await pick(card + ' ._14px-text', ['color']),
  cell: await pick(card + ' .testim-point-wrap', ['border-left-color']),
  img: await pick(card + ' .post-img-hor', ['transform']),
  arrow: await pick(card + ' .post-arrow-wrap', ['opacity'])
})
await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(800)
res.blogCardRest = await cardProbe()
await p.hover(card); await p.waitForTimeout(150); res.blogCardHover150 = await cardProbe(); await p.waitForTimeout(700); res.blogCardHover = await cardProbe()
await p.mouse.move(5, 5); await p.waitForTimeout(800); res.blogCardOut = await cardProbe()
await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(800)
const feat = '.post-hor-wrap.featured'
const featProbe = async () => ({ img: await pick(feat + ' .blog-img-vert', ['transform']), head: await pick(feat + ' .featured-head', ['opacity', 'color']), ul1: await pick(feat + ' .underline._1', ['width']), ul2: await pick(feat + ' .underline._2', ['width']) })
res.featRest = await featProbe(); await p.hover(feat); await p.waitForTimeout(800); res.featHover = await featProbe(); await p.mouse.move(5, 5); await p.waitForTimeout(800); res.featOut = await featProbe()
// bg video fade on scroll (hero.hide-on-scroll)
res.bgFade = []
for (const y of [0, 60, 100, 300]) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(900); res.bgFade.push({ y, wrapper: await pick('.bg-pixels-wrapper', ['opacity']) }) }
// Load More
await p.evaluate(() => window.scrollTo(0, 2700)); await p.waitForTimeout(800)
res.loadMoreBefore = await p.evaluate(() => ({ items: document.querySelectorAll('.blogs-list.all .blogs-item').length, url: location.href, pag: [...document.querySelectorAll('.w-pagination-wrapper > *')].map(e => [e.className, getComputedStyle(e).display]) }))
const lm = '.load-more'
await p.hover(lm); await p.waitForTimeout(700); res.loadMoreHover = { ul1: await pick(lm + ' .underline._1', ['width']), ul2: await pick(lm + ' .underline._2', ['width']) }
const reqs = []; p.on('request', r => { if (r.url().includes('page=')) reqs.push(r.url()) })
const t0 = Date.now()
await p.click(lm)
const trace = []
for (let i = 0; i < 20; i++) { await p.waitForTimeout(100); trace.push(await p.evaluate(() => ({ n: document.querySelectorAll('.blogs-list.all .blogs-item').length, op: [...document.querySelectorAll('.blogs-list.all .blogs-item')].slice(4, 5).map(e => getComputedStyle(e).opacity + ' ' + getComputedStyle(e).transform)[0] }))) }
await p.waitForTimeout(1500)
res.loadMoreAfter = await p.evaluate(() => ({ items: [...document.querySelectorAll('.blogs-list.all .blogs-item a')].map(a => a.getAttribute('href')), url: location.href, pag: [...document.querySelectorAll('.w-pagination-wrapper > *')].map(e => [e.className, getComputedStyle(e).display, e.getBoundingClientRect().height]), listRect: document.querySelector('.blogs-list.all').getBoundingClientRect().height, docH: document.documentElement.scrollHeight }))
res.loadMoreTrace = trace; res.loadMoreRequests = reqs
// hover a newly loaded card (does IX re-init?)
await p.hover('.blogs-list.all .blogs-item:nth-child(6) .post-link-block'); await p.waitForTimeout(700)
res.loadedCardHover = await p.evaluate(() => { const c = document.querySelector('.blogs-list.all .blogs-item:nth-child(6) .post-link-block'); return { bottomBg: getComputedStyle(c.querySelector('.post-bottom-wrap')).backgroundColor, img: getComputedStyle(c.querySelector('.post-img-hor')).transform } })
await p.screenshot({ path: `${OUT}/blog/shots/state-1440-load-more-after.png`, fullPage: true })
// ---- blog post
await p.goto('https://www.transform9.com/blog/redefining-healthcare-ai', { waitUntil: 'networkidle', timeout: 90000 }); await settle()
const back = '.icon-w-text'
const backProbe = async () => ({ link: await pick(back, ['opacity']), a1: await pick(back + ' .back-1', ['transform']), a2: await pick(back + ' .back-2', ['transform']) })
res.backRest = await backProbe(); await p.hover(back); await p.waitForTimeout(250); res.backHover250 = await backProbe(); await p.waitForTimeout(900); res.backHover = await backProbe(); await p.mouse.move(700, 800); await p.waitForTimeout(600); res.backOut = await backProbe()
res.shareRest = await pick('.share-link-block', ['opacity', 'transition']); await p.hover('.share-link-block'); await p.waitForTimeout(500); res.shareHover = await pick('.share-link-block', ['opacity'])
res.shareHrefs = await p.evaluate(() => [...document.querySelectorAll('.share-link-block')].map(a => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), net: a.getAttribute('fs-socialshare-element') })))
res.stickyShare = []
for (const y of [0, 800, 1600]) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(700); res.stickyShare.push({ y, top: await p.evaluate(() => document.querySelector('.left-sticky-block').getBoundingClientRect().top), nav: await pick('.nav-menu', ['background-color']) }) }
res.bgPixelsPost = await pick('.bg-pixels', ['opacity', 'background-image', 'display'])
res.richLinkHover = await p.evaluate(() => { const a = document.querySelector('.rich-text-post._1st a, .post-block-wrap:not(.w-condition-invisible) .rich-text-post a'); return a ? getComputedStyle(a).transition : null })
// ---- case studies index
await p.goto('https://www.transform9.com/case-studies', { waitUntil: 'networkidle', timeout: 90000 }); await settle()
const cs = '.blogs-list.cs .blogs-item:nth-child(2) .post-link-block'
const csProbe = async () => ({ imgWrap: await pick(cs + ' .post-img-wrap', ['background-color']), wh: await pick(cs + ' .cl-wh-logo-on-cell', ['opacity']), bl: await pick(cs + ' .cl-bl-logo-on-cell', ['opacity']), bottom: await pick(cs + ' .post-bottom-wrap', ['background-color']), title: await pick(cs + ' ._30px-text', ['color']), stat: await pick(cs + ' .blog-point', ['color']), num: await pick(cs + ' .testim-num', ['color']), cell: await pick(cs + ' .testim-point-wrap', ['border-left-color']), arrow: await pick(cs + ' .post-arrow-wrap', ['opacity']) })
await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(800)
res.csRest = await csProbe(); await p.hover(cs); await p.waitForTimeout(800); res.csHover = await csProbe(); await p.screenshot({ path: `${OUT}/case-studies/shots/state-1440-card-hover.png` }); await p.mouse.move(5, 5); await p.waitForTimeout(800); res.csOut = await csProbe()
const cs1 = '.blogs-list.cs .blogs-item:nth-child(1) .post-link-block'
await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(600); await p.hover(cs1); await p.waitForTimeout(800)
res.csHover1 = { highlight: await pick(cs1 + ' .highlight-text-alt', ['color']), bottom: await pick(cs1 + ' .post-bottom-wrap', ['background-color']) }
// ---- case study detail read-next hover
await p.goto('https://www.transform9.com/case-studies/southern-bone-joint', { waitUntil: 'networkidle', timeout: 90000 }); await settle()
const rn = '.read-next-section .post-link-block'
await p.evaluate(() => window.scrollTo(0, 3700)); await p.waitForTimeout(800)
const rnProbe = async () => ({ imgWrap: await pick(rn + ' .post-img-wrap', ['background-color']), wh: await pick(rn + ' .cl-wh-logo-on-cell', ['opacity']), bottom: await pick(rn + ' .post-bottom-wrap', ['background-color']), title: await pick(rn + ' ._30px-text', ['color']), arrow: await pick(rn + ' .post-arrow-wrap', ['opacity']) })
res.csReadNextRest = await rnProbe(); await p.hover(rn); await p.waitForTimeout(800); res.csReadNextHover = await rnProbe()
res.csBackRest = await pick('.icon-w-text', ['opacity']); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600); await p.hover('.icon-w-text'); await p.waitForTimeout(900); res.csBackHover = { link: await pick('.icon-w-text', ['opacity']), a1: await pick('.icon-w-text .back-1', ['transform']) }
fs.writeFileSync(`${OUT}/states-1440.json`, JSON.stringify(res, null, 1))
await b.close()
console.log('done')
