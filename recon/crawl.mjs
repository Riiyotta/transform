// Same-host BFS crawl of www.transform9.com to build the route inventory (no sitemap exists).
// Records status, title, and Webflow page id per path; follows ?*_page= pagination links.
import fs from 'fs'
import { execFileSync } from 'child_process'
// Pages are fetched with curl (Node's fetch rejects this network's TLS chain; curl uses the system trust store).
const get = (url) => { const out = execFileSync('curl', ['-s', '-w', '\n%{http_code} %{redirect_url}', url], { maxBuffer: 1 << 26 }).toString(); const i = out.lastIndexOf('\n'); const [code, loc] = out.slice(i + 1).split(' '); return { status: +code, location: loc || '', html: out.slice(0, i) } }
const HOST = 'https://www.transform9.com'
const seen = new Map(); const queue = ['/']
const norm = (h) => { try { const u = new URL(h, HOST); if (u.host !== 'www.transform9.com' && u.host !== 'transform9.com') return null; const q = [...u.searchParams.keys()].some((k) => k.endsWith('_page')) ? u.search : ''; return (u.pathname.replace(/\/$/, '') || '/') + q } catch { return null } }
while (queue.length && seen.size < 600) {
  const path = queue.shift(); if (seen.has(path)) continue
  const res = get(HOST + path); const html = res.status === 200 ? res.html : ''
  const title = (html.match(/<title>([^<]*)/) || [])[1] || ''; const page = (html.match(/data-wf-page="([^"]+)"/) || [])[1] || ''
  const coll = (html.match(/data-wf-collection="([^"]+)"/) || [])[1] || ''
  seen.set(path, { status: res.status, location: res.location, title, page, coll })
  for (const m of html.matchAll(/href="([^"#]+)/g)) { const p = norm(m[1]); if (p && !seen.has(p) && !queue.includes(p) && !/\.(pdf|png|jpe?g|svg|webp|avif|css|js|xml|ico)$/i.test(p)) queue.push(p) }
}
const rows = [...seen].map(([p, v]) => ({ path: p, ...v }))
fs.writeFileSync('recon/routes.json', JSON.stringify(rows, null, 2))
console.log('pages', rows.length)
