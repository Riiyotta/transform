// Render live pages at a viewport and dump a DOM outline (tag.classes #id "text" [x,y,w,h]) for everything inside .page-wrap except footer/cta deep content.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const [,, outDir, width, ...paths] = process.argv
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: +width, height: 900 } })
for (const p of paths) {
  const page = await ctx.newPage()
  await page.goto('https://www.transform9.com' + p, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('nav', e.message))
  await page.evaluate(() => document.fonts.ready)
  // scroll through to trigger lazy loads
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } window.scrollTo(0, 0) })
  await page.waitForTimeout(800)
  const out = await page.evaluate(() => {
    const lines = []
    const walk = (el, d) => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
      const cls = typeof el.className === 'string' ? el.className.trim().replace(/\s+/g, '.') : ''
      let txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim()
      const attrs = []
      if (el.id) attrs.push('#' + el.id)
      if (el.getAttribute('href')) attrs.push('href=' + el.getAttribute('href'))
      if (el.tagName === 'IMG') attrs.push('src=' + (el.currentSrc || el.src).split('/').pop() + ` nat=${el.naturalWidth}x${el.naturalHeight}`)
      if (cs.backgroundImage !== 'none' && cs.backgroundImage.includes('url')) attrs.push('bg=' + cs.backgroundImage.slice(0, 140))
      for (const a of el.attributes) if (a.name.startsWith('fs-') || a.name.startsWith('data-w-id') || a.name === 'target') attrs.push(a.name + '=' + a.value)
      lines.push(`${'  '.repeat(d)}${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} ${attrs.join(' ')} ${cs.display === 'none' ? '[NONE]' : `[${r.x.toFixed(1)},${(r.y + scrollY).toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)}]`}${txt ? ' "' + txt.slice(0, 200) + '"' : ''}`)
      if (el.matches('.pixel, .grid-row, svg, .footer-bottom-wrap *, .modal-wrap *, .nav-menu *')) return
      for (const c of el.children) if (!['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META'].includes(c.tagName)) walk(c, d + 1)
    }
    walk(document.body, 0)
    return { title: document.title, wfPage: document.documentElement.dataset.wfPage, wfColl: document.documentElement.dataset.wfCollection, wfItem: document.documentElement.dataset.wfItemSlug, htmlClass: document.documentElement.className, bodyClass: document.body.className, docH: document.documentElement.scrollHeight, lines }
  })
  const name = (p.replace(/^\/(blog|case-studies)\/?/, '') || '_index').replace(/[?=]/g, '_')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(`${outDir}/outline-${name}-${width}.txt`, `${p}\ntitle: ${out.title}\nwf-page ${out.wfPage} coll ${out.wfColl} item ${out.wfItem}\nhtml.${out.htmlClass}\nbody.${out.bodyClass}\ndocH ${out.docH}\n\n` + out.lines.join('\n'))
  console.log(p, out.docH, out.lines.length)
  await page.close()
}
await b.close()
