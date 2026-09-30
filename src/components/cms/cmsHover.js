// CMS template hover motion (Motion-4): BLOG-M6 (blog card), BLOG-M7 (featured row),
// BLOG-M8 (back link, >=992), CS-M1 (case-study card + read-next card).
// Built on the shared IX2 helpers (src/components/ui/ixMotion.js). Values measured on live
// 2026-09-30 with real mouse input (recon/motion-4/live-1440.json, reentry-live.json,
// tap-live-390.json):
// - Every tween is 300ms outQuad (= power1.out, CLONE_SPEC §18), from the CURRENT value,
//   colours interpolated per channel (first blog-card hover: bottom bg from rgba(0,0,0,0)).
// - IX2 group 1 of a-48 / a-52 / a-46 (arrow -> 0, black logo -> 0 over 500ms, cell -> .01,
//   back link -> .5 / x 0 over 500ms) never shows: group 2 starts at t=0 both from rest and on
//   re-entry mid-mouseout (no dip, reentry-live.json). So one list per direction here.
// - STYLE_BORDER quirk: on the FIRST hover of a card the 1px rule starts from rgb(2,8,1) (the
//   element's currentColor/top-border colour that IX2 reads), not from the green rule:
//   rgb(2,17,44) at p=.21, rgb(1,29,98) at p=.48. Later hovers start from the current colour.
// - Blog card mouseout rests the image at scale(1.01) (a-49), not 1. Featured returns to 1.
// - Touch (390): the emulated mouseover/mouseout make a tap stick the hover end state until a
//   tap elsewhere (live); the same events drive these bindings. Not gated on reduced motion
//   (IX2 ignores prefers-reduced-motion).
// The CSS :hover END states in cms.css apply only without these bindings ([data-ix] unset).
import { EASE, MQ, bindHover, clearInline, gsap } from '../ui/ixMotion'

const V = { duration: 0.3, ease: EASE.outQuad }
const BLACK = 'rgb(2, 8, 1)'
const WHITE = 'rgb(255, 255, 255)'
const GREEN = 'rgb(162, 250, 142)'
const BLUE = 'rgb(0, 51, 204)'
// IX2 clock: live progress = power1.out(elapsed / 300ms) with elapsed counted from the LAST
// FRAME before the event (whole frames: p=.4787 = 5 frames at the 4th frame after the event,
// p=.803 = 10 frames; identical on every live hover, recon/motion-4/live-1440.json). GSAP's
// global clock is not tied to the event (autoSleep wake + lagSmoothing gave 0..3 frames of
// jitter, up to 0.14 in progress), so each list is a paused timeline advanced on rAF from
// document.timeline.currentTime (= that frame's time) read in the event handler.
const FRAME_MS = 1000 / 60
function frameTime(e) {
  const t = document.timeline?.currentTime
  if (typeof t === 'number') return t
  return (e?.timeStamp || performance.now()) - FRAME_MS
}

// One running list per hover target; a new list kills the previous one where it stands (both
// lists animate the same properties, so this equals IX2's per-property override).
function player() {
  let tl = null
  let raf = 0
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
    if (tl) tl.kill()
    tl = null
  }
  const play = (e, specs) => {
    stop()
    const t0 = frameTime(e)
    const own = gsap.timeline({ paused: true })
    for (const [targets, vars] of specs) {
      const list = [...targets].filter(Boolean)
      if (list.length) own.to(list, { ...vars, ...V }, 0)
    }
    tl = own
    const step = (ts) => {
      if (tl !== own) return
      own.time(Math.min(own.duration(), Math.max(0, ts - t0) / 1000))
      raf = own.progress() < 1 ? requestAnimationFrame(step) : 0
    }
    raf = requestAnimationFrame(step)
  }
  return { play, stop }
}

// Rule colour: the first tween of a given element starts from rgb(2,8,1) (IX2 STYLE_BORDER quirk).
function presetRules(rules) {
  for (const r of rules) if (!r.style.borderLeftColor) r.style.borderLeftColor = BLACK
}

// Transform targets: clearProps also resets GSAP's cached transform (removeProperty alone would
// leave a stale scale / xPercent for the next binding).
function clearTransform(els) {
  const list = [...els].filter(Boolean)
  if (!list.length) return
  gsap.killTweensOf(list)
  gsap.set(list, { clearProps: 'transform' })
}

function mark(el) {
  el.setAttribute('data-ix', '')
  return () => el.removeAttribute('data-ix')
}

// BLOG-M6 — a.post-link-block.bl (IX2 e-50/e-51 -> a-48/a-49), all breakpoints.
export function bindPostCardHover(link) {
  const q = (s) => link.querySelectorAll(s)
  const bottom = q('.post-bottom-wrap')
  const text = q('.blog-title, .blog-data')
  const rules = q('.testim-point-wrap.post-cell')
  const img = q('.post-img-hor')
  const arrow = q('.post-arrow-wrap')
  const unmark = mark(link)
  const pl = player()
  const off = bindHover(
    link,
    (e) => {
      presetRules(rules)
      pl.play(e, [
        [bottom, { backgroundColor: 'rgba(255, 255, 255, 1)' }],
        [text, { color: BLACK }],
        [rules, { borderLeftColor: BLUE }],
        [img, { scale: 1.1 }],
        [arrow, { opacity: 1 }],
      ])
    },
    (e) =>
      pl.play(e, [
        [bottom, { backgroundColor: 'rgba(255, 255, 255, 0)' }],
        [text, { color: WHITE }],
        [rules, { borderLeftColor: GREEN }],
        [img, { scale: 1.01 }],
        [arrow, { opacity: 0 }],
      ]),
  )
  return () => {
    off()
    pl.stop()
    unmark()
    clearInline(bottom, ['background-color'])
    clearInline(text, ['color'])
    clearInline(rules, ['border-left-color'])
    clearTransform(img)
    clearInline(arrow, ['opacity'])
  }
}

// BLOG-M7 — featured a.post-hor-wrap.featured (IX2 e-52/e-53 -> a-50/a-51): .blog-img-vert
// scale 1 -> 1.1 -> 1. (The featured-head opacity:1 action is a no-op and is omitted.)
export function bindFeaturedHover(link) {
  const img = link.querySelectorAll('.blog-img-vert')
  const unmark = mark(link)
  const pl = player()
  const off = bindHover(
    link,
    (e) => pl.play(e, [[img, { scale: 1.1 }]]),
    (e) => pl.play(e, [[img, { scale: 1 }]]),
  )
  return () => {
    off()
    pl.stop()
    unmark()
    clearTransform(img)
  }
}

// CS-M1 — a.post-link-block.cs (IX2 e-62/e-63 -> a-52/a-53), index cards and the read-next card.
export function bindCaseCardHover(link) {
  const q = (s) => link.querySelectorAll(s)
  const cell = q('.post-img-wrap.cs')
  const white = q('.cl-wh-logo-on-cell')
  const black = q('.cl-bl-logo-on-cell')
  const bottom = q('.post-bottom-wrap')
  const text = q('.cs-title, .rn-title, .testim-num, .blog-point.cs, .highlight-text-alt')
  const rules = q('.testim-point-wrap.blog.cs')
  const arrow = q('.post-arrow-wrap')
  const unmark = mark(link)
  const pl = player()
  const off = bindHover(
    link,
    (e) => {
      presetRules(rules)
      pl.play(e, [
        [cell, { backgroundColor: 'rgba(241, 243, 243, 1)' }],
        [white, { opacity: 0 }],
        [black, { opacity: 1 }],
        [bottom, { backgroundColor: 'rgba(255, 255, 255, 1)' }],
        [text, { color: BLACK }],
        [rules, { borderLeftColor: BLUE }],
        [arrow, { opacity: 1 }],
      ])
    },
    (e) =>
      pl.play(e, [
        [cell, { backgroundColor: 'rgba(255, 255, 255, 0.01)' }],
        [white, { opacity: 1 }],
        [black, { opacity: 0 }],
        [bottom, { backgroundColor: 'rgba(255, 255, 255, 0)' }],
        [text, { color: WHITE }],
        [rules, { borderLeftColor: GREEN }],
        [arrow, { opacity: 0 }],
      ]),
  )
  return () => {
    off()
    pl.stop()
    unmark()
    clearInline([...cell, ...bottom], ['background-color'])
    clearInline([...white, ...black, ...arrow], ['opacity'])
    clearInline(text, ['color'])
    clearInline(rules, ['border-left-color'])
  }
}

// BLOG-M8 — a.icon-w-text back link (IX2 e-42/e-43, e-60/e-61 -> a-46/a-47), >=992 only:
// link opacity .5 -> 1, .back-1 / .back-2 translateX 0 -> -100% (-28px); out -> .5 / 0.
// Bound through matchMedia; leaving desktop unbinds and clears inline styles (static .5).
export function bindBackLinkHover(link) {
  const arrows = link.querySelectorAll('.back-1, .back-2')
  const mq = window.matchMedia(MQ.desktop)
  let unbind = null
  const bind = () => {
    const unmark = mark(link)
    const pl = player()
    // Live rest at >=992 is an identity transform (matrix(1,0,0,1,0,0)), 'none' below.
    gsap.set(arrows, { xPercent: 0 })
    const off = bindHover(
      link,
      (e) => pl.play(e, [[[link], { opacity: 1 }], [arrows, { xPercent: -100 }]]),
      (e) => pl.play(e, [[[link], { opacity: 0.5 }], [arrows, { xPercent: 0 }]]),
    )
    return () => {
      off()
      pl.stop()
      unmark()
      clearInline([link], ['opacity'])
      clearTransform(arrows)
    }
  }
  const sync = () => {
    if (mq.matches && !unbind) unbind = bind()
    else if (!mq.matches && unbind) {
      unbind()
      unbind = null
    }
  }
  sync()
  mq.addEventListener('change', sync)
  return () => {
    mq.removeEventListener('change', sync)
    if (unbind) unbind()
  }
}
