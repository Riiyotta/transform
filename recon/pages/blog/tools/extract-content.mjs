// Parse the server-rendered HTML (JS disabled, no network) of every blog post / case study / index page into structured JSON.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const R = '/Users/riyaghosh/V3/transform'
const b = await chromium.launch()
const ctx = await b.newContext({ javaScriptEnabled: false })
await ctx.route('**/*', r => r.abort())
const page = await ctx.newPage()
const load = async (f) => { await page.setContent(fs.readFileSync(f, 'utf8'), { waitUntil: 'domcontentloaded' }) }
const ev = (fn) => page.evaluate(`${HELPERS}\n;(${fn.toString()})()`)

// shared in-page helpers
const HELPERS = `
window.__inl = function inl(node, marks) {
  const out = []
  for (const n of node.childNodes) {
    if (n.nodeType === 3) { if (n.textContent !== '') out.push(Object.assign({ text: n.textContent }, marks)); continue }
    if (n.nodeType !== 1) continue
    const t = n.tagName
    if (t === 'BR') { out.push(Object.assign({ text: '\\n', br: true }, marks)); continue }
    const m = Object.assign({}, marks)
    if (t === 'STRONG' || t === 'B') m.bold = true
    if (t === 'EM' || t === 'I') m.italic = true
    if (t === 'SUP') m.sup = true
    if (t === 'SUB') m.sub = true
    if (t === 'CODE') m.code = true
    if (t === 'A') { m.link = { href: n.getAttribute('href') }; if (n.getAttribute('target')) m.link.target = n.getAttribute('target'); if (n.getAttribute('rel')) m.link.rel = n.getAttribute('rel') }
    out.push(...inl(n, m))
  }
  // merge adjacent runs with identical marks
  const merged = []
  for (const r of out) { const p = merged[merged.length - 1]; const k = (x) => JSON.stringify(Object.assign({}, x, { text: 0 })); if (p && !p.br && !r.br && k(p) === k(r)) p.text += r.text; else merged.push(Object.assign({}, r)) }
  return merged
}
window.__blocks = function blocks(rt) {
  const out = []
  for (const el of rt.children) {
    const t = el.tagName.toLowerCase()
    const text = el.textContent
    if (/^h[1-6]$/.test(t) || t === 'p' || t === 'blockquote') { const b = { type: t, text, inlines: __inl(el, {}) }; if (t === 'p' && text.replace(/[\\u200d\\s]/g, '') === '') b.spacer = true; out.push(b) }
    else if (t === 'ul' || t === 'ol') out.push({ type: t, items: [...el.children].map(li => ({ text: li.textContent, inlines: __inl(li, {}) })) })
    else if (t === 'figure') { const img = el.querySelector('img'); const ifr = el.querySelector('iframe'); out.push({ type: img ? 'img' : 'embed', figureClass: el.className, src: img ? img.getAttribute('src') : ifr && ifr.getAttribute('src'), alt: img ? img.getAttribute('alt') : null, width: img && img.getAttribute('width'), height: img && img.getAttribute('height'), caption: el.querySelector('figcaption') ? el.querySelector('figcaption').textContent : null }) }
    else if (el.classList.contains('w-embed')) out.push({ type: 'embed', html: el.innerHTML })
    else out.push({ type: 'unknown', tag: t, html: el.outerHTML.slice(0, 500) })
  }
  return out
}
window.__bg = (el) => { if (!el) return null; const m = (el.getAttribute('style') || '').match(/url\\(["']?(?:&quot;)?([^"')&]+)/); return m ? m[1] : null }
window.__meta = () => { const g = (s) => { const e = document.querySelector(s); return e ? e.getAttribute('content') : null }; const ld = document.querySelector('script[type="application/ld+json"]'); return { title: document.title, description: g('meta[name=description]'), ogTitle: g('meta[property="og:title"]'), ogDescription: g('meta[property="og:description"]'), ogImage: g('meta[property="og:image"]'), twitterTitle: g('meta[name="twitter:title"]'), twitterImage: g('meta[name="twitter:image"]'), jsonLd: ld ? JSON.parse(ld.textContent) : null, wfPage: document.documentElement.getAttribute('data-wf-page'), wfCollection: document.documentElement.getAttribute('data-wf-collection'), wfItemSlug: document.documentElement.getAttribute('data-wf-item-slug') } }
window.__cards = (root) => [...root.querySelectorAll('.w-dyn-item')].map((it, i) => { const a = it.querySelector('a'); const pts = [...it.querySelectorAll('.testim-point-wrap')]; return {
  order: i + 1, href: a && a.getAttribute('href'), linkClass: a && a.className,
  title: (it.querySelector('._30px-text, ._56-px-text') || {}).textContent || null,
  image: __bg(it.querySelector('.post-img-hor, .blog-img-vert')),
  logoWhite: (it.querySelector('.cl-wh-logo-on-cell') || { getAttribute: () => null }).getAttribute('src'),
  logoBlack: (it.querySelector('.cl-bl-logo-on-cell') || { getAttribute: () => null }).getAttribute('src'),
  highlight: (it.querySelector('.highlight-text-alt') || {}).textContent || null,
  meta: pts.filter(p => !p.classList.contains('cs')).map(p => p.textContent.trim()),
  stats: pts.filter(p => p.classList.contains('cs')).map(p => ({ value: p.querySelector('.testim-num').textContent, label: p.querySelector('.blog-point').textContent })),
  hiddenConditional: [...it.querySelectorAll('.w-condition-invisible')].map(e => e.className)
} })
`
const out = { blog: [], cs: [] }
const slugsB = fs.readdirSync(`${R}/recon/pages/blog/html`).filter(f => !f.startsWith('_'))
for (const f of slugsB) {
  await load(`${R}/recon/pages/blog/html/${f}`); 
  const d = await ev(() => {
    const q = (s) => document.querySelector(s)
    const slots = [...document.querySelectorAll('.post-block-wrap')].map(w => ({ slot: w.classList.contains('bl-2') ? 'bl-2' : w.classList.contains('bl-3') ? 'bl-3' : w.classList.contains('bl-4') ? 'bl-4' : w.classList.contains('bl-5') ? 'bl-5' : '1st', visible: !w.classList.contains('w-condition-invisible'), empty: !!w.querySelector('.w-dyn-bind-empty'), blocks: __blocks(w.querySelector('.rich-text-post')) }))
    const pts = [...document.querySelectorAll('.blog-header-right .blog-point')].map(e => e.textContent)
    const rn = q('.read-next-section')
    return {
      meta: __meta(),
      title: q('.blog-page-title').textContent,
      author: pts[0], date: pts[1],
      heroImage: __bg(q('.blog-top-header .blog-img-vert')),
      backLink: { href: q('.icon-w-text').getAttribute('href'), text: q('.icon-w-text').textContent.trim() },
      shareLabel: q('.share-post').textContent,
      share: [...document.querySelectorAll('.share-link-block')].map(a => ({ network: a.getAttribute('fs-socialshare-element'), href: a.getAttribute('href'), icon: a.querySelector('img').getAttribute('src') })),
      slots,
      readNext: rn ? { sectionClass: rn.className, visible: !rn.classList.contains('hide'), eyebrow: rn.querySelector('.right-side-head-wrap ._16px-text').textContent, heading: rn.querySelector('.right-side-heading').textContent, items: __cards(rn) } : null
    }
  })
  const slug = f.replace('.html', '')
  const body = d.slots.filter(s => s.visible).flatMap(s => s.blocks.map(b => ({ slot: s.slot, ...b })))
  const rec = { slug, url: `https://www.transform9.com/blog/${slug}`, template: 'blog-post (wf page 6961001f74e092b614cb17b7)', ...d, summary: d.meta.description, category: null, tags: [], body }
  fs.writeFileSync(`${R}/content/blog/${slug}.json`, JSON.stringify(rec, null, 2)); out.blog.push({ slug, blocks: body.length, slots: d.slots.filter(s => s.visible).map(s => s.slot) })
}
for (const f of fs.readdirSync(`${R}/recon/pages/case-studies/html`).filter(f => !f.startsWith('_'))) {
  await load(`${R}/recon/pages/case-studies/html/${f}`); 
  const d = await ev(() => {
    const q = (s) => document.querySelector(s)
    const slots = [...document.querySelectorAll('.post-block-wrap')].map(w => ({ slot: ['bl-2', 'bl-3', 'bl-4', 'bl-5'].find(c => w.classList.contains(c)) || '1st', visible: !w.classList.contains('w-condition-invisible'), empty: !!w.querySelector('.w-dyn-bind-empty'), blocks: __blocks(w.querySelector('.rich-text-post')) }))
    const hdr = q('.blog-top-header')
    const rn = q('.read-next-section')
    return {
      meta: __meta(),
      title: q('.blog-page-title').textContent,
      logo: q('.cl-logo-on-post') && q('.cl-logo-on-post').getAttribute('src'),
      logoAlt: q('.cl-logo-on-post') && q('.cl-logo-on-post').getAttribute('alt'),
      highlight: hdr.querySelector('.highlight-text-alt') ? { text: hdr.querySelector('.highlight-text-alt').textContent, hiddenByCondition: hdr.querySelector('.highlight-text-alt').classList.contains('w-condition-invisible') } : null,
      stats: [...hdr.querySelectorAll('.testim-point-wrap')].map(p => ({ value: (p.querySelector('.testim-num') || {}).textContent, label: (p.querySelector('.blog-point') || {}).textContent, cls: p.className })),
      headerConditional: [...hdr.querySelectorAll('.w-condition-invisible')].map(e => ({ cls: e.className, text: e.textContent.slice(0, 200) })),
      backLink: { href: q('.icon-w-text').getAttribute('href'), text: q('.icon-w-text').textContent.trim() },
      shareLabel: q('.share-post').textContent,
      share: [...document.querySelectorAll('.share-link-block')].map(a => ({ network: a.getAttribute('fs-socialshare-element'), href: a.getAttribute('href'), icon: a.querySelector('img').getAttribute('src') })),
      slots,
      readNext: rn ? { sectionClass: rn.className, visible: !rn.classList.contains('hide'), eyebrow: rn.querySelector('.right-side-head-wrap ._16px-text').textContent, heading: rn.querySelector('.right-side-heading').textContent, items: __cards(rn) } : null
    }
  })
  const slug = f.replace('.html', '')
  const body = d.slots.filter(s => s.visible).flatMap(s => s.blocks.map(b => ({ slot: s.slot, ...b })))
  const rec = { slug, url: `https://www.transform9.com/case-studies/${slug}`, template: 'case-study (wf page 697149b061298badae113701)', ...d, summary: d.meta.description, category: null, tags: [], body }
  fs.writeFileSync(`${R}/content/case-studies/${slug}.json`, JSON.stringify(rec, null, 2)); out.cs.push({ slug, blocks: body.length, slots: d.slots.filter(s => s.visible).map(s => s.slot) })
}
// indexes
const idx = {}
for (const [k, f] of [['page1', 'blog/html/_index.html'], ['page2', 'blog/html/_index_page2.html']]) {
  await load(`${R}/recon/pages/${f}`); 
  idx[k] = await ev(() => ({ meta: __meta(), heroHeading: document.querySelector('h1.hero-home').textContent, featured: __cards(document.querySelector('.featured-post')), list: __cards(document.querySelector('.blogs-wrapper.all')), listHeading: document.querySelector('.articles-head-wrap').textContent.trim(), leftLabel: document.querySelector('.left-sticky-block.blogs').textContent.trim(), pagination: [...document.querySelectorAll('.w-pagination-wrapper > *')].map(e => ({ cls: e.className, href: e.getAttribute('href'), text: e.textContent.trim(), aria: e.getAttribute('aria-label') })), fsList: Object.fromEntries([...document.querySelector('.blogs-list.all').attributes].filter(a => a.name.startsWith('fs-')).map(a => [a.name, a.value])) }))
}
fs.writeFileSync(`${R}/content/blog/_index.json`, JSON.stringify({ url: 'https://www.transform9.com/blog', template: 'blog index (wf page 69664f533e7e9450caa2aa30)', paginationParam: '523ae0d4_page', pageSize: 4, ...idx }, null, 2))
await load(`${R}/recon/pages/case-studies/html/_index.html`); 
const cs = await ev(() => ({ meta: __meta(), heroHeading: document.querySelector('h1.hero-home').textContent, leftLabel: document.querySelector('.left-sticky-block.blogs').textContent.trim(), list: __cards(document.querySelector('.blogs-wrapper.cs')), pagination: document.querySelector('.w-pagination-wrapper') ? 'present' : 'none' }))
fs.writeFileSync(`${R}/content/case-studies/_index.json`, JSON.stringify({ url: 'https://www.transform9.com/case-studies', template: 'case-studies index (wf page 6971638a9ea15e3a1fb91fd5)', ...cs }, null, 2))
console.log(JSON.stringify(out))
await b.close()
