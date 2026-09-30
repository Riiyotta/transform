// Usage: node pstates.mjs <live|clone> <out.json> <shotdir> <route> [widths]
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright');
import fs from 'fs';
const [side, out, shotdir, route, wArg] = process.argv.slice(2);
process.argv[3] = route; // pdump reads route from argv
const { pdump, open, SECS } = await import('./pdump.mjs');
const widths = (wArg || '1440,1024,768,390').split(',').map(Number);
const live = side === 'live'; fs.mkdirSync(shotdir, { recursive: true });
const T = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch(); const R = {};
const probe = (p, sels) => p.evaluate((sels) => { const o = {}; for (const [k, s, i] of sels) { const e = document.querySelectorAll(s)[i || 0]; if (!e) { o[k] = null; continue; } const r = e.getBoundingClientRect(), c = getComputedStyle(e);
  o[k] = { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), pos: c.position, top: c.top, bg: c.backgroundColor, color: c.color, bd: c.borderTopColor + ' ' + c.borderBottomColor + ' ' + c.borderLeftColor, blur: c.backdropFilter, op: c.opacity, disp: c.display, z: c.zIndex, outline: c.outlineStyle + ' ' + c.outlineWidth, shadow: c.boxShadow, deco: c.textDecorationLine, fw: c.fontWeight, pl: c.paddingLeft, pt: c.paddingTop }; } return o; }, sels);
const to = async (p, sel, off = -200, i = 0) => { await p.evaluate(([s, off, i]) => { const e = document.querySelectorAll(s)[i]; scrollTo(0, e.getBoundingClientRect().top + scrollY + off); }, [sel, off, i]); await T(live ? 1500 : 400); };
for (const w of widths) {
  const p = await open(b, w); const S = (R[w] = {});
  const snap = async (name, secs, sels = []) => { await T(live ? 1200 : 700); S[name] = { dump: await pdump(p, secs), probe: await probe(p, sels), scrollY: await p.evaluate(() => scrollY) }; await p.screenshot({ path: `${shotdir}/${side}-${w}-${name}.png` }); };
  const hover = async (sel, i = 0) => { const box = await p.evaluate(([s, i]) => { const r = document.querySelectorAll(s)[i].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, i]); await p.mouse.move(box.x, box.y, { steps: 3 }); };
  const click = async (sel, i = 0) => { await hover(sel, i); await p.mouse.down(); await p.mouse.up(); };
  if (route === '/compare') {
    const sec = (n) => SECS['/compare'].filter((s) => s[0] === n);
    await to(p, 'a.hero-cta-link.compare-demo', -300); await hover('a.hero-cta-link.compare-demo'); await snap('hero-link-hover', sec('hero'), [['u1', 'a.hero-cta-link.compare-demo .underline._1'], ['u2', 'a.hero-cta-link.compare-demo .underline._2']]);
    await p.mouse.move(2, 2);
    await to(p, '.table-bottom a', -300); await hover('.table-bottom a'); await snap('table-link-hover', sec('table'), [['u1', '.table-bottom a .underline._1'], ['u2', '.table-bottom a .underline._2']]); await p.mouse.move(2, 2);
    // sticky head: scroll into mid-table
    await to(p, '.table-row', 0, 5); await snap('table-mid', sec('table'), [['head', '.table-row.head'], ['row5', '.table-row', 5]]);
    // specialty: hover/click tab 4
    await to(p, '.specialty-tabs-menu.wh', -120);
    if (w >= 768) await hover('.specialty-tab-link.wh', 3); else await click('.specialty-tab-link.wh', 3);
    await p.mouse.move(2, 2); await snap('specialty-tab4', sec('white'), [['tab1', '.specialty-tab-link.wh', 0], ['tab4', '.specialty-tab-link.wh', 3], ['pane', '.specialty-tabs-content.wh']]);
    if (w < 480) { await click('.specialty-tab-link.wh', 0); await p.mouse.move(2, 2); await snap('specialty-tab1', sec('white'), [['tab1', '.specialty-tab-link.wh', 0]]); }
    // integration block hover (first linked block in row 1, visible)
    await to(p, '.integration-bottom-wrap', -200);
    const idx = await p.evaluate(() => [...document.querySelectorAll('.intagrations-row .integration-block.wh')].findIndex((e) => { const r = e.getBoundingClientRect(); return r.x >= 0 && r.right <= innerWidth && e.tagName === 'A'; }));
    await hover('.intagrations-row .integration-block.wh', idx); await T(800);
    S['integ-hover'] = { probe: await probe(p, [['blk', '.intagrations-row .integration-block.wh', idx]]), idx }; await p.screenshot({ path: `${shotdir}/${side}-${w}-integ-hover.png` }); await p.mouse.move(2, 2);
    // nav on white
    S['nav-on-white'] = { probe: await probe(p, [['nav', '.navbar, .nav, nav', 0], ['navlink', '.nav-link', 0]]) };
    // privacy hover
    await to(p, '.privacy-block', -200); await hover('.privacy-block', 0); await snap('privacy-hover', sec('privacy'), [['blk', '.privacy-block', 0]]); await p.mouse.move(2, 2);
    // ev tabs
    await to(p, '.ev-tab', -200); await click('.ev-tab', 1); await p.mouse.move(2, 2); await snap('ev-tab2', sec('ev'), [['t1', '.ev-tab', 0], ['t2', '.ev-tab', 1]]);
    await click('.ev-tab', 3); await p.mouse.move(2, 2); await snap('ev-tab4', sec('ev'), [['t4', '.ev-tab', 3], ['t2', '.ev-tab', 1]]);
  } else if (route === '/book-a-demo') {
    const sec = SECS['/book-a-demo'];
    await click('#first_name'); await snap('focus', sec, [['in', '#first_name'], ['in2', '#last_name']]);
    await p.mouse.move(2, 2); await p.evaluate(() => document.activeElement.blur());
    await hover('input[type=submit]'); await snap('submit-hover', sec, [['btn', 'input[type=submit]']]);
    for (const st of ['success', 'error']) {
      if (live) await p.evaluate((st) => { const f = document.querySelector('form'); if (st === 'success') { f.style.display = 'none'; document.querySelector('.w-form-done').style.display = 'block'; } else { f.style.display = ''; document.querySelector('.w-form-done').style.display = 'none'; document.querySelector('.w-form-fail').style.display = 'block'; } }, st);
      else { await p.goto('http://127.0.0.1:5179/book-a-demo?form=' + st, { waitUntil: 'load' }); await T(800); }
      await snap('form-' + st, sec, [['done', '.w-form-done'], ['fail', '.w-form-fail']]);
    }
  } else {
    const sec = SECS.legal;
    await to(p, 'a.link-transp', -300); await hover('a.link-transp'); await snap('link-hover', sec, [['a', 'a.link-transp']]);
  }
  await p.close(); console.error('done', side, route, w);
}
fs.writeFileSync(out, JSON.stringify(R)); await b.close();
