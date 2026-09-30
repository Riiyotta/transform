// Batched live measurement per page × viewport: distinct class-combo styles/rects, rich-text typography,
// shell probes, network assets, full-page screenshot. Usage: node measure.mjs <width> <path>...
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const ROOT = '/Users/riyaghosh/V3/transform/recon/pages'
const [,, W, ...paths] = process.argv
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 }[W] || 900
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: +W, height: H } })
for (const p of paths) {
  const fam = p.startsWith('/case-studies') ? 'case-studies' : 'blog'
  const name = (p.replace(/^\/(blog|case-studies)\/?/, '') || '_index').replace(/[?=]/g, '_')
  const page = await ctx.newPage()
  const net = []
  page.on('response', r => { const t = r.request().resourceType(); if (['image', 'font', 'media', 'stylesheet'].includes(t)) net.push({ type: t, status: r.status(), url: r.url(), ct: r.headers()['content-type'] || '', len: +(r.headers()['content-length'] || 0) }) })
  await page.goto('https://www.transform9.com' + p, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('nav', e.message))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(2500)
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)) } window.scrollTo(0, 0) })
  await page.waitForTimeout(1200)
  const data = await page.evaluate(() => {
    const P = ['display', 'position', 'top', 'z-index', 'width', 'height', 'min-height', 'max-width', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top', 'border-right', 'border-bottom', 'border-left', 'flex-direction', 'justify-content', 'align-items', 'row-gap', 'column-gap', 'grid-template-columns', 'font-family', 'font-size', 'line-height', 'letter-spacing', 'font-weight', 'font-style', 'color', 'background-color', 'background-image', 'background-size', 'background-position', 'opacity', 'transform', 'text-decoration-line', 'white-space', 'overflow', 'transition', 'backdrop-filter', 'box-shadow', 'list-style-type', 'object-fit', 'aspect-ratio']
    const DEF = { 'z-index': 'auto', 'transform': 'none', 'backdrop-filter': 'none', 'box-shadow': 'none', 'background-image': 'none', 'opacity': '1', 'row-gap': 'normal', 'column-gap': 'normal', 'grid-template-columns': 'none', 'overflow': 'visible', 'transition': 'all', 'letter-spacing': 'normal', 'font-style': 'normal', 'white-space': 'normal', 'text-decoration-line': 'none', 'aspect-ratio': 'auto', 'object-fit': 'fill' }
    const sty = (el) => { const cs = getComputedStyle(el); const o = {}; for (const k of P) { let v = cs.getPropertyValue(k); if (k === 'transition' && v.startsWith('all 0s')) continue; if (DEF[k] === v) continue; if (k.startsWith('border') && v.startsWith('0px')) continue; if (k.startsWith('margin') || k.startsWith('padding')) { if (v === '0px') continue } o[k] = v } return o }
    const rect = (el) => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +(r.y + scrollY).toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
    const key = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '')
    const pw = document.querySelector('.page-wrap')
    const skip = (el) => el.closest('.cta-section, .footer, .example-for-edit, .w-embed, .hbspt-form, .grid-row, pre') 
    const combos = {}
    for (const el of pw.querySelectorAll('*')) {
      if (skip(el) || ['SCRIPT', 'STYLE', 'SOURCE', 'BR', 'svg', 'path'].includes(el.tagName)) continue
      const inRich = el.closest('.rich-text-post')
      const k = inRich ? 'RICH ' + key(el) + (el.parentElement.closest('li,blockquote,h2,h3,p') ? ' in ' + el.parentElement.closest('li,blockquote,h2,h3,p').tagName.toLowerCase() : '') : key(el)
      if (combos[k]) { combos[k].count++; continue }
      const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim()
      combos[k] = { count: 1, rect: rect(el), text: t.slice(0, 80), style: sty(el) }
    }
    // style guide clone: make hidden example block visible inside first post-block-wrap to measure h4-h6/figure/figcaption/pre
    const guide = {}
    const ex = document.querySelector('.rich-text-post.example-for-edit')
    const host = document.querySelector('.post-block-wrap')
    if (ex && host) {
      const c = ex.cloneNode(true); c.classList.remove('example-for-edit'); c.querySelectorAll('.w-embed').forEach(e => e.remove()); host.appendChild(c)
      for (const el of c.querySelectorAll('*')) { const k = key(el) + (el.parentElement !== c ? ' in ' + key(el.parentElement) : ''); if (!guide[k]) guide[k] = { rect: rect(el), text: [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 60), style: sty(el) } }
      guide._container = { style: sty(c) }
      c.remove()
    }
    const shell = {}
    for (const s of ['html', 'body', '.nav-menu', '.nav-links', '.logo-wrap', '.page-wrap', '.page-wrap-solid-bg', '.bg-noise-wrap', '.bg-pixels-wrapper', '.bg-pixels', '.bg-pixels-overlay', '.bg-video-pixels', '.preloader-wrap', '.modal-wrap', '.cta-section', '.transition-cont', '.footer', '.footer-bottom-wrap', '.w-nav-overlay', '.nav-link-block.w--current', '.footer-link-wrap.w--current', '.menu-btn']) {
      const els = document.querySelectorAll(s); if (!els.length) { shell[s] = null; continue }
      shell[s] = { count: els.length, rect: rect(els[0]), cls: els[0].className, style: sty(els[0]) }
    }
    const sections = [...pw.children, ...[...document.body.children].filter(e => e !== pw)].map(e => ({ k: key(e), rect: rect(e), display: getComputedStyle(e).display }))
    return { url: location.href, title: document.title, htmlClass: document.documentElement.className, wf: { page: document.documentElement.dataset.wfPage, coll: document.documentElement.dataset.wfCollection, item: document.documentElement.dataset.wfItemSlug }, docH: document.documentElement.scrollHeight, viewport: [innerWidth, innerHeight], sections, shell, combos, guide }
  })
  data.network = net
  const dir = `${ROOT}/${fam}/measure`; fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(`${ROOT}/${fam}/shots`, { recursive: true })
  fs.writeFileSync(`${dir}/${name}-${W}.json`, JSON.stringify(data, null, 1))
  await page.screenshot({ path: `${ROOT}/${fam}/shots/${name}-${W}-full.png`, fullPage: true }).catch(e => console.log('shot', e.message))
  console.log(W, p, data.docH, Object.keys(data.combos).length, 'combos', net.length, 'net')
  await page.close()
}
await b.close()
