// Converts recon/pages/legal/{slug}-content.html into src/data/legal/{name}.js
import fs from 'node:fs'
const ROOT = '/Users/riyaghosh/V3/transform'
const PAGES = [
  { slug: 'terms-of-use', name: 'termsOfUse', title: 'Terms of Use' },
  { slug: 'privacy-policy', name: 'privacyPolicy', title: 'Privacy Policy' },
  { slug: 'hipaa', name: 'hipaa', title: 'HIPAA' },
]
const VOID = new Set(['br', 'img', 'input', 'hr', 'meta', 'link'])
function decode(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
}
function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  const re = /<\/?([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g
  let m
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1]
    if (m[3] !== undefined) { top.children.push({ text: decode(m[3]) }); continue }
    const tag = m[1].toLowerCase()
    if (m[0].startsWith('</')) {
      const t = stack.pop()
      if (t.tag !== tag) throw new Error(`mismatch ${t.tag} vs ${tag}`)
      continue
    }
    const attrs = {}
    m[2].replace(/([\w-]+)(?:="([^"]*)")?/g, (_, k, v) => { attrs[k] = v === undefined ? '' : decode(v) })
    const node = { tag, attrs, children: [] }
    top.children.push(node)
    if (!VOID.has(tag) && !m[2].trim().endsWith('/')) stack.push(node)
  }
  if (stack.length !== 1) throw new Error('unclosed')
  return root
}
const els = (n) => n.children.filter((c) => c.tag)
const cls = (n) => (n.attrs?.class || '').split(/\s+/)
const has = (n, c) => cls(n).includes(c)
function textOf(n) {
  return n.children.map((c) => (c.text !== undefined ? c.text : c.tag === 'br' ? '\n' : textOf(c))).join('')
}
function strayText(n) {
  const t = n.children.filter((c) => c.text !== undefined && c.text.trim())
  if (t.length) throw new Error('stray text in ' + n.tag + ': ' + JSON.stringify(t))
}
// A paragraph: lines split on <br>; each line is a string, or an array of strings/links.
function lines(p) {
  const out = [[]]
  for (const c of p.children) {
    if (c.text !== undefined) out[out.length - 1].push(c.text)
    else if (c.tag === 'br') out.push([])
    else if (c.tag === 'a') {
      if (!has(c, 'link-transp')) throw new Error('unknown link class')
      if (els(c).length) throw new Error('nested in link')
      out[out.length - 1].push({ href: c.attrs.href, text: textOf(c), target: c.attrs.target })
    } else throw new Error('unexpected inline ' + c.tag)
  }
  return out.map((segs) => (segs.every((s) => typeof s === 'string') ? segs.join('') : segs))
}
function para(p) {
  if (p.tag !== 'p' || !has(p, '_16px-text') || !has(p, 'transp')) throw new Error('bad p ' + p.tag + ' ' + p.attrs.class)
  return { type: 'p', lines: lines(p) }
}
function list(ul) {
  if (!has(ul, 'list-white') || !has(ul, 'transp')) throw new Error('bad ul')
  strayText(ul)
  return {
    type: 'list',
    items: els(ul).map((li) => {
      if (li.tag !== 'li' || !has(li, 'list-item')) throw new Error('bad li')
      strayText(li)
      const ps = els(li)
      if (ps.length !== 1) throw new Error('li with ' + ps.length + ' children')
      return para(ps[0]).lines
    }),
  }
}
function convert({ slug, name, title }) {
  const html = fs.readFileSync(`${ROOT}/recon/pages/legal/${slug}-content.html`, 'utf8')
  const root = parse(html)
  const [hero, section] = els(root)
  const h1 = els(hero).find((n) => n.tag === 'h1')
  const bottom = els(hero).find((n) => has(n, 'hero-home-bottom'))
  const block = els(bottom).find((n) => has(n, 'hero-bottom-block'))
  const [label, intro] = els(block)
  if (textOf(label) !== 'About Page') throw new Error('label')
  const introVariant = has(intro, 'legal-terms') ? 'terms' : has(intro, 'legal-privacy') ? 'privacy' : null
  const cont = els(section)[0]
  const blocks = els(cont).map((b) => {
    if (!has(b, 'legal-block')) throw new Error('bad block')
    strayText(b)
    const out = { items: [] }
    if (has(b, 'last')) out.last = true
    for (const c of els(b)) {
      if (c.tag === 'h2') {
        if (out.items.length || out.h2) throw new Error('h2 not first')
        if (els(c).length) throw new Error('h2 children')
        out.h2 = textOf(c)
      } else if (has(c, 'legal-text-wrap')) {
        strayText(c)
        out.items.push({ type: 'wrap', items: els(c).map((x) => (x.tag === 'ul' ? list(x) : para(x))) })
      } else if (c.tag === 'p' && has(c, '_22px-text-green')) {
        if (els(c).length) throw new Error('green children')
        out.items.push({ type: 'green', text: textOf(c) })
      } else if (c.tag === 'p') out.items.push(para(c))
      else throw new Error('unknown block child ' + c.tag + ' ' + c.attrs.class)
    }
    // key order: h2, last, items
    return { ...(out.h2 !== undefined ? { h2: out.h2 } : {}), ...(out.last ? { last: true } : {}), items: out.items }
  })
  const data = { slug, title, h1: textOf(h1), intro: textOf(intro), introVariant, blocks }
  let json = JSON.stringify(data, null, 2)
    .replace(new RegExp('[' + [0xa0, 0x200b, 0x200d, 0x2028, 0x2029].map((n) => String.fromCharCode(n)).join('') + ']', 'g'), (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
  const stats = {
    blocks: blocks.length,
    h2: blocks.filter((b) => b.h2).length,
    green: html.split('_22px-text-green').length - 1,
    lists: html.split('<ul').length - 1,
    li: html.split('<li').length - 1,
    br: (html.match(/<br\s*\/?>/g) || []).length,
    links: html.split('<a ').length - 1,
  }
  const header = `// Legal page content: ${title} (/${slug}). GENERATED from recon/pages/legal/${slug}-content.html
// (verbatim server HTML, 2026-09-30) by recon/build-demo-legal/legal2js.mjs; do not paraphrase. Invisible
// characters from the source (U+00A0, U+200B, U+200D, U+2028) are kept as \\u escapes.
// Shape (specs/legal.md §0): { slug, title, h1, intro, introVariant: 'terms'|'privacy', blocks[] }
//   block = { h2?, last?, items[] }; item = { type: 'wrap', items: (p|list)[] } | { type: 'green', text } | p
//   p = { type: 'p', lines[] } — lines are separated by <br>; a line is a string or an array of
//   strings and links { href, text, target }. list = { type: 'list', items: lines[][] }.
// Source counts: ${JSON.stringify(stats)}
`
  fs.writeFileSync(`${ROOT}/src/data/legal/${name}.js`, `${header}const content = ${json}\n\nexport default content\n`)
  // verify round trip: rebuild HTML text and compare text content
  console.log(slug, stats)
}
fs.mkdirSync(`${ROOT}/src/data/legal`, { recursive: true })
PAGES.forEach(convert)
