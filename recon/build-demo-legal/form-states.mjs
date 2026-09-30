// /book-a-demo form states: empty submit, invalid email, valid submit -> Submitting... -> success,
// ?form=success / ?form=error QA hooks, focus border. Screenshots: form-{w}-{state}.png
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/riyaghosh/.nvm/versions/node/v20.20.2/lib/node_modules/playwright')
const URL = 'http://127.0.0.1:5179/book-a-demo'
const OUT = '/Users/riyaghosh/V3/transform/recon/build-demo-legal'
const b = await chromium.launch()
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  const errors = [], external = []
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  p.on('pageerror', (e) => errors.push(e.message))
  p.on('request', (r) => { const u = new globalThis.URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname)) external.push(r.url()) })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  const shot = async (name) => {
    const box = await p.locator('.book-demo-right').boundingBox()
    await p.screenshot({ path: `${OUT}/form-${w}-${name}.png`, clip: { x: box.x, y: Math.max(0, box.y), width: box.width, height: Math.min(box.height, 600) } })
  }
  const info = () => p.evaluate(() => ({
    state: document.querySelector('.w-form').dataset.state,
    active: document.activeElement?.id || document.activeElement?.className,
    msgs: [...document.querySelectorAll('.w-input')].map((i) => `${i.id}: ${i.validationMessage || '(valid)'}`),
    button: document.querySelector('.w-button')?.value, disabled: document.querySelector('.w-button')?.disabled,
    done: getComputedStyle(document.querySelector('.w-form-done')).display,
    fail: getComputedStyle(document.querySelector('.w-form-fail')).display,
  }))
  await p.locator('.book-demo-right').scrollIntoViewIfNeeded()
  await shot('default')
  // 1. empty submit
  await p.click('.w-button')
  console.log(`@${w} empty submit:`, JSON.stringify(await info()))
  await shot('empty-submit')
  // focus style
  const focus = await p.evaluate(() => { const i = document.querySelector('#first_name'); return [getComputedStyle(i).borderTopColor, getComputedStyle(i).outlineStyle] })
  console.log(`@${w} focused #first_name border/outline:`, focus)
  // 2. invalid email
  await p.fill('#first_name', 'Ada'); await p.fill('#last_name', 'Lovelace'); await p.fill('#email', 'not-an-email')
  await p.fill('#practice_name', 'Analytical Practice'); await p.fill('#emr_pms', 'athenahealth')
  await p.click('.w-button')
  console.log(`@${w} invalid email:`, JSON.stringify(await info()))
  await shot('invalid-email')
  // 3. valid submit
  await p.fill('#email', 'ada@example.com')
  await p.click('.w-button')
  const mid = await info()
  console.log(`@${w} valid submit (immediately):`, JSON.stringify({ state: mid.state, button: mid.button, disabled: mid.disabled }))
  await shot('submitting')
  await p.waitForSelector('.w-form-done.is-shown')
  const done = await info()
  const doneRect = await p.evaluate(() => { const r = document.querySelector('.w-form-done').getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height].map((v) => +v.toFixed(2)) })
  console.log(`@${w} after submit:`, JSON.stringify({ state: done.state, active: done.active, done: done.done, formPresent: await p.locator('form#wf-form-T9-demo-form').count() }), 'done rect', doneRect)
  await shot('success')
  // 4. QA hooks
  for (const s of ['success', 'error']) {
    await p.goto(`${URL}?form=${s}`, { waitUntil: 'networkidle' })
    const r = await p.evaluate((s) => { const el = document.querySelector(s === 'success' ? '.w-form-done' : '.w-form-fail'); const r = el.getBoundingClientRect(); return { state: document.querySelector('.w-form').dataset.state, text: el.textContent, rect: [r.x, r.y + scrollY, r.width, r.height].map((v) => +v.toFixed(2)), bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color } }, s)
    console.log(`@${w} ?form=${s}:`, JSON.stringify(r))
    await p.locator('.book-demo-right').scrollIntoViewIfNeeded()
    await shot(`qa-${s}`)
  }
  console.log(`@${w} console errors ${errors.length}, external requests ${external.length}`, errors, external)
  await p.close()
}
await b.close()
