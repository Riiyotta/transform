// Verifies the clone's legal hero + content text/markup against recon/pages/legal/{slug}-content.html.
import fs from 'node:fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const b = await chromium.launch()
const sig = () => {
  const q = (s) => document.querySelector(s)
  const legal = q('section.legal-section')
  return {
    h1: q('h1').textContent, intro: q('.hero-bottom-block p').textContent, label: q('.hero-bottom-block div').textContent,
    text: legal.textContent,
    br: legal.querySelectorAll('br').length, h2: legal.querySelectorAll('h2').length, blocks: legal.querySelectorAll('.legal-block').length,
    last: [...legal.querySelectorAll('.legal-block')].findIndex((e) => e.classList.contains('last')),
    wraps: legal.querySelectorAll('.legal-text-wrap').length, ul: legal.querySelectorAll('ul').length, li: legal.querySelectorAll('li').length,
    green: legal.querySelectorAll('p._22px-text-green, p.text-22-green').length,
    links: [...legal.querySelectorAll('a')].map((a) => [a.href, a.textContent, a.target, a.rel].join(' | ')),
    // child-structure signature of every block (tag + role)
    shape: [...legal.querySelectorAll('.legal-block')].map((bl) => [...bl.children].map((c) => c.tagName + (c.classList.contains('legal-text-wrap') ? '[' + [...c.children].map((x) => x.tagName).join(',') + ']' : '')).join(' ')).join(' / '),
  }
}
let fail = 0
for (const slug of ['terms-of-use', 'privacy-policy', 'hipaa']) {
  const p = await b.newPage()
  await p.setContent(fs.readFileSync(`recon/pages/legal/${slug}-content.html`, 'utf8'))
  const src = await p.evaluate(sig)
  await p.goto(`http://127.0.0.1:5179/${slug}`, { waitUntil: 'networkidle' })
  const clone = await p.evaluate(sig)
  for (const k of Object.keys(src)) {
    const a = JSON.stringify(src[k]), c = JSON.stringify(clone[k])
    const same = k === 'links' ? src.links.every((l, i) => clone.links[i]?.startsWith(l.replace(/ \| $/, ''))) && src.links.length === clone.links.length : a === c
    if (!same) { fail++; console.log(`DIFF ${slug}.${k}\n  src   ${a.slice(0, 300)}\n  clone ${c.slice(0, 300)}`) }
  }
  console.log(`${slug}: text ${clone.text.length} chars, br ${clone.br}, h2 ${clone.h2}, blocks ${clone.blocks}, wraps ${clone.wraps}, ul ${clone.ul}, li ${clone.li}, green ${clone.green}, links ${JSON.stringify(clone.links)}`)
  await p.close()
}
await b.close()
console.log(fail ? `FAIL ${fail}` : 'PASS: verbatim text, <br>, structure and links match the source')
