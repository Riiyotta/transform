// Shared Playwright helpers for Motion-2 evidence (live vs clone sampling).
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
export const LIVE = 'https://www.transform9.com/'
export const CLONE = 'http://127.0.0.1:5179/'

// In-page rAF sampler. Records `specs` every frame; t0 = first matching trigger event.
export const SAMPLER = `(() => {
  if (window.__m2) return;
  const num = (v) => Math.round(v * 100) / 100;
  const get = (el, f) => {
    const cs = getComputedStyle(el);
    if (f === 'op') return num(+cs.opacity);
    if (f === 'bg') return cs.backgroundColor;
    if (f === 'disp') return cs.display;
    if (f === 'vis') return cs.visibility;
    if (f === 'w') return num(el.getBoundingClientRect().width);
    if (f === 'h') return num(el.getBoundingClientRect().height);
    if (f === 'fb') return cs.flexBasis;
    if (f === 'tx' || f === 'ty') { const m = new DOMMatrixReadOnly(cs.transform === 'none' ? undefined : cs.transform); return num(f === 'tx' ? m.m41 : m.m42); }
    return cs[f];
  };
  window.__m2 = {
    get,
    read(specs) { const row = {}; for (const s of specs) { const el = document.querySelectorAll(s.sel)[s.i || 0]; row[s.k] = el ? get(el, s.f) : null; } return row; },
    arm(specs, triggerSel, types = ['mouseenter', 'mouseleave', 'click']) {
      this.samples = []; this.events = []; this.running = true; this.specs = specs;
      this.h = (e) => { const t = e.target; if (!t || t.nodeType !== 1) return; const hit = e.type === 'click' ? t.closest(triggerSel) : t.matches(triggerSel); if (hit) this.events.push({ type: e.type, t: e.timeStamp }); };
      this.types = types; types.forEach((ty) => document.addEventListener(ty, this.h, true));
      const loop = (now) => { if (!this.running) return; const row = this.read(specs); row.t = performance.now(); this.samples.push(row); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    },
    mark(type) { this.events.push({ type, t: performance.now() }); },
    stop() {
      this.running = false; this.types.forEach((ty) => document.removeEventListener(ty, this.h, true));
      const t0 = this.events.length ? this.events[0].t : this.samples[0].t;
      return { events: this.events.map((e) => ({ type: e.type, t: Math.round(e.t - t0) })), samples: this.samples.map((r) => ({ ...r, t: Math.round(r.t - t0) })) };
    },
  };
})()`

export async function open(browser, url, w, h = 900, opts = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, ...opts })
  page.__errors = []
  page.on('console', (m) => m.type() === 'error' && page.__errors.push(m.text()))
  page.on('pageerror', (e) => page.__errors.push(e.message))
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.evaluate(SAMPLER)
  return page
}

export async function center(page, sel, i = 0) {
  await page.evaluate(([sel, i]) => { const el = document.querySelectorAll(sel)[i]; el.scrollIntoView({ block: 'center' });}, [sel, i])
  await page.waitForTimeout(700)
  const box = await page.evaluate(([sel, i]) => { const r = document.querySelectorAll(sel)[i].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height } }, [sel, i])
  return box
}

// Value of each key at offsets after a given event time (last sample at or before).
export function at(rec, evIndex, offsets, keys) {
  const t0 = rec.events[evIndex]?.t ?? 0
  return offsets.map((o) => {
    const s = [...rec.samples].reverse().find((r) => r.t <= t0 + o) || rec.samples[0]
    const row = { dt: o }
    for (const k of keys) row[k] = s[k]
    return row
  })
}
