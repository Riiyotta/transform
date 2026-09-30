// Extract IX3 register(interactions, timelines) and IX2 init data from a Webflow page bundle; write JSON + readable text.
import fs from 'fs'
const matchFrom = (src, j) => { const open = src[j], close = { '(': ')', '[': ']', '{': '}' }[open]; let d = 0, inS = null; for (let k = j; k < src.length; k++) { const c = src[k]; if (inS) { if (c === '\\') { k++; continue } if (c === inS) inS = null; continue } if (c === '"' || c === "'" || c === '`') { inS = c; continue } if (c === open) d++; else if (c === close && --d === 0) return src.slice(j, k + 1) } }
const [f, out] = process.argv.slice(2)
const src = fs.readFileSync(f, 'utf8')
const i3 = src.indexOf('a.register([')
const args = (0, eval)('[' + matchFrom(src, i3 + 'a.register'.length).slice(1, -1) + ']')
const i2 = src.indexOf('ix2").init(')
const ix2 = (0, eval)('(' + matchFrom(src, i2 + 'ix2").init('.length) + ')')
const [interactions, timelines] = args
fs.writeFileSync(out + '.json', JSON.stringify({ ix3: { interactions, timelines }, ix2 }, null, 1))
const tl = Object.fromEntries((timelines || []).map(t => [t.id, t]))
const tgt = (t) => { if (!t) return '?'; const [k, v, o] = t; return k === 'wf:selector' ? `wf:selector:${JSON.stringify(v)}` : `${k}:${JSON.stringify(v)}${o && o.relationship && o.relationship !== 'none' ? ' rel=' + o.relationship : ''}` }
let txt = ''
for (const it of interactions) {
  txt += `\n### ${it.id} scope=${JSON.stringify(it.scope)} deleted=${!!it.deleted}\n`
  for (const tr of it.triggers || []) txt += `  TRIGGER ${tr[0]} ${JSON.stringify(tr[1])} ON ${tgt(tr[2])}\n`
  for (const tid of it.timelineIds || []) { const t = tl[tid]; txt += `  TL ${tid} ${t ? JSON.stringify(t.settings || {}) : '(missing)'}\n`; if (t) for (const a of t.actions || []) txt += `    - ${JSON.stringify(a.targets)} timing=${JSON.stringify(a.timing)} tt=${a.tt} props=${JSON.stringify(a.properties)}\n` }
}
fs.writeFileSync(out + '-ix3-readable.txt', txt)
console.log(interactions.length, (timelines || []).length, Object.keys(ix2.events).length)
