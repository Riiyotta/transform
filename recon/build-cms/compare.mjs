// Diff clone vs live measure JSON by normalized class-combo key.
import { chromium } from '/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const R = '/Users/riyaghosh/V3/transform/recon/pages/'
// jobs: [clonePath, measureFile]
const jobs = JSON.parse(process.argv[2])
const widths = (process.argv[3] || '1440,1024,768,390').split(',').map(Number)
const H = { 1440: 900, 1024: 900, 768: 1024, 390: 844 }
const TOL = +(process.env.TOL || 1.5)
const MAP = { 'label-16': '_16px-text white-text', 'text-56': '_56-px-text white', 'text-14-white': '_14px-text white-text', 'hero-heading': 'white-text hero-home',
  'w-underline-link': '_30px-text white _w-underline', 'blog-title': '_30px-text white blog-title', 'cs-title': '_30px-text white cs-title', 'rn-title': '_30px-text white', 'testim-num': '_30px-text white testim-num', 'has-underline': '' }
const norm = (k) => { const [tag, ...cls] = k.replace(/^RICH /, '').split(' in ')[0].split('.'); const rest = k.startsWith('RICH') ? 'RICH ' : ''; const inn = k.includes(' in ') ? ' in ' + k.split(' in ')[1] : ''
  return rest + tag + [...new Set(cls.filter(c => c && !(c.startsWith('w-') && !c.startsWith('w-pagination'))))].sort().map(c => '.' + c).join('') + inn }
const PROPS = ['display','position','top','z-index','width','min-height','max-width','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','border-top','border-right','border-bottom','border-left','flex-direction','justify-content','align-items','row-gap','column-gap','font-size','line-height','font-weight','font-style','color','background-color','background-size','background-position','opacity','transform','text-decoration-line','white-space','overflow','list-style-type']
const SKIP = new Set(['transition','background-image','font-family','height','grid-template-columns','letter-spacing','backdrop-filter','box-shadow','aspect-ratio','object-fit'])
const DEF = { 'z-index': 'auto', 'transform': 'none', 'opacity': '1', 'row-gap': 'normal', 'column-gap': 'normal', 'overflow': 'visible', 'font-style': 'normal', 'white-space': 'normal', 'text-decoration-line': 'none' }
const numEq = (a, b) => { const na = a.match(/-?[\d.]+/g), nb = b.match(/-?[\d.]+/g); if (!na || !nb || na.length !== nb.length) return a === b; if (a.replace(/-?[\d.]+/g,'#') !== b.replace(/-?[\d.]+/g,'#')) return false; return na.every((x, i) => Math.abs(x - nb[i]) < 0.15) }
const b = await chromium.launch()
const out = []
for (const w of widths) for (const [path, mf] of jobs) {
  const file = `${R}${mf}-${w}.json`; if (!fs.existsSync(file)) continue
  const live = JSON.parse(fs.readFileSync(file))
  const p = await b.newPage({ viewport: { width: w, height: H[w] } })
  const errs = [], ext = []
  p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)))
  p.on('request', r => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol.startsWith('http')) ext.push(r.url()) })
  await p.goto('http://127.0.0.1:5179' + path, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(700)
  const c = await p.evaluate(([MAP, P]) => {
    const rect = (el) => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +(r.y + scrollY).toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
    const cls = (el) => (typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).flatMap(c => (MAP[c] ?? c).split(' ').filter(Boolean)) : [])
    const key = (el) => el.tagName.toLowerCase() + cls(el).map(c => '.' + c).join('')
    const pw = document.querySelector('.page-wrap')
    const combos = {}
    for (const el of pw.querySelectorAll('*')) {
      if (el.closest('.cta-section, .footer') || ['SCRIPT', 'STYLE', 'SOURCE', 'BR', 'svg', 'path'].includes(el.tagName)) continue
      const inRich = el.closest('.rich-text-post')
      const k = inRich ? 'RICH ' + key(el) + (el.parentElement.closest('li,blockquote,h2,h3,p') ? ' in ' + el.parentElement.closest('li,blockquote,h2,h3,p').tagName.toLowerCase() : '') : key(el)
      if (combos[k]) { combos[k].count++; continue }
      const cs = getComputedStyle(el)
      const st = {}; for (const q of P) st[q] = cs.getPropertyValue(q)
      combos[k] = { count: 1, rect: rect(el), fs: cs.fontSize, st }
    }
    const sections = [...pw.children, ...[...document.body.children].filter(e => e !== pw)].map(e => ({ k: key(e), rect: rect(e) }))
    const fontOk = document.fonts.check('16px "Polysans Neutral"')
    return { combos, sections, docH: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, fontOk }
  }, [MAP, PROPS])
  const cmap = {}; for (const [k, v] of Object.entries(c.combos)) cmap[norm(k)] ??= v
  const lines = []
  const secL = live.sections.filter(s => /^section|footer-bottom/.test(s.k) && s.rect[3] > 0)
  const secC = c.sections.filter(s => /^section|footer-bottom/.test(s.k))
  lines.push(`== ${path} @${w}  docH live ${live.docH} clone ${c.docH}  scrollW ${c.sw} font ${c.fontOk} errs ${errs.length} ext ${ext.length}`)
  errs.forEach(e => lines.push('  ERR ' + e)); ext.forEach(e => lines.push('  EXT ' + e))
  lines.push('  sections live: ' + secL.map(s => `${s.k.split('.')[1]} ${s.rect[1]}/${s.rect[3]}`).join(' | '))
  lines.push('  sections clone: ' + secC.map(s => `${s.k.split('.')[1]} ${s.rect[1]}/${s.rect[3]}`).join(' | '))
  let miss = 0, bad = 0
  for (const [k, v] of Object.entries(live.combos)) {
    if (!v.rect || v.rect[2] === 0 && v.rect[3] === 0) continue
    const cv = cmap[norm(k)]
    if (!cv) { if (!/bg-pixels|example|condition-invisible|dyn-bind-empty|w-dyn-empty|page-count|pagination-previous/.test(k)) { lines.push(`  MISSING ${k}`); miss++ } continue }
    const d = v.rect.map((x, i) => Math.abs(x - cv.rect[i]))
    const lfs = v.style?.['font-size'], cfs = cv.fs
    const fsBad = lfs && Math.abs(parseFloat(lfs) - parseFloat(cfs)) > 0.1
    const sd = []
    for (const [q, lv] of Object.entries(v.style || {})) { if (SKIP.has(q) || !(q in cv.st)) continue; if (!numEq(String(lv), String(cv.st[q]))) sd.push(`${q}: ${lv} | ${cv.st[q]}`) }
    for (const q of PROPS) { if (SKIP.has(q) || (v.style && q in v.style)) continue; const cvq = cv.st[q]; const isDef = DEF[q] === cvq || ((q.startsWith('margin') || q.startsWith('padding')) && cvq === '0px') || (q.startsWith('border') && cvq.startsWith('0px'))
      if (!isDef && ['opacity','transform','row-gap','column-gap','white-space','overflow','font-style','text-decoration-line'].includes(q)) sd.push(`${q}: (default) | ${cvq}`)
      if (!isDef && (q.startsWith('border') || q.startsWith('margin') || q.startsWith('padding'))) sd.push(`${q}: (none) | ${cvq}`) }
    if (sd.length) { bad++; lines.push(`  STYLE ${k}: ${sd.join('; ')}`) }
    if (Math.max(...d) > TOL || fsBad || v.count !== cv.count) { bad++; lines.push(`  DIFF ${k} n ${v.count}/${cv.count} live ${JSON.stringify(v.rect)} clone ${JSON.stringify(cv.rect)}${fsBad ? ` fs ${lfs}/${cfs}` : ''}`) }
  }
  lines.push(`  combos: ${Object.keys(live.combos).length} live, ${bad} diffs, ${miss} missing`)
  console.log(lines.join('\n')); out.push(lines.join('\n'))
  await p.close()
}
await b.close()
