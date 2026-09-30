// Motion-2 helpers: IX2-faithful eases and hover/group runners (CLONE_SPEC §18).
// Measured on the live site (recon/motion-2/*.json):
// - IX2 Penner eases are exact GSAP powers: outCubic = power2.out, outQuad = power1.out,
//   inOutQuad = power1.inOut. IX2 `easeOut` = CSS ease-out = cubic-bezier(0,0,.58,1).
//   Webflow slider `ease` = CSS ease = cubic-bezier(.25,.1,.25,1). IX3 26 = expo.out.
// - IX2 tweens start from the element's CURRENT value (no snap on re-hover), colours are
//   interpolated per channel (non-premultiplied, e.g. rgba(34,34,34,.13) at 16ms), and an
//   opposing action list does not cancel the other list; only the overlapping property
//   tween is overridden (GSAP overwrite:'auto'). A group advances to the next group only
//   if at least one of its tweens ran to completion (verified with a-32/a-44/a-45).
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

export const EASE = {
  outCubic: 'power2.out',
  outQuad: 'power1.out',
  inOutQuad: 'power1.inOut',
  easeOut: CustomEase.create('m2-ix2-easeOut', '0,0,0.58,1'),
  cssEase: CustomEase.create('m2-css-ease', '0.25,0.1,0.25,1'),
  expoOut: 'expo.out',
  linear: 'none',
}

export const MQ = {
  desktop: '(min-width: 992px)',
  medium: '(min-width: 768px) and (max-width: 991px)',
  small: '(max-width: 767px)',
  belowDesktop: '(max-width: 991px)',
}

// Run IX2-style action groups sequentially. `groups` = [[targets, vars], ...][].
// vars.duration (seconds) 0/undefined = instant set. A later list overrides only the
// overlapping property tweens of earlier lists (IX2 behaviour).
export function runGroups(groups, i = 0) {
  if (i >= groups.length) return
  const tweens = groups[i]
    .filter(([t]) => t && (!(t instanceof NodeList || Array.isArray(t)) || t.length))
    .map(([t, v]) => {
      // Kill the overlapped property tweens now (not on the new tween's first render, one
      // frame later), so the old tween cannot render one more frame.
      const props = Object.keys(v).filter((k) => !['duration', 'ease'].includes(k))
      gsap.killTweensOf(t, props.join(','))
      return v.duration ? gsap.to(t, v) : gsap.set(t, v)
    })
  if (i + 1 >= groups.length) return
  const d = Math.max(0, ...groups[i].map(([, v]) => v.duration || 0))
  const next = () => {
    if (!tweens.length || tweens.some((tw) => tw.totalProgress() === 1)) runGroups(groups, i + 1)
  }
  if (d === 0) next()
  else gsap.delayedCall(d, next)
}

// mouseenter/mouseleave binding (IX2 MOUSE_OVER/OUT behave as enter/leave: moving
// between children does not retrigger). Returns an unbind function.
export function bindHover(el, onEnter, onLeave) {
  el.addEventListener('mouseenter', onEnter)
  el.addEventListener('mouseleave', onLeave)
  return () => {
    el.removeEventListener('mouseenter', onEnter)
    el.removeEventListener('mouseleave', onLeave)
  }
}

export { gsap }

// Remove inline styles written by hover tweens (used on unmount / breakpoint exit, since
// tweens created later inside event handlers are not recorded by a gsap context).
export function clearInline(els, props) {
  for (const el of els) {
    if (!el) continue
    gsap.killTweensOf(el)
    for (const p of props) el.style.removeProperty(p)
  }
}

// M14 (IX2 a-10..a-13): block bg -> #fff over 200ms ease-out (channel-wise interpolation,
// as IX2), logos swap instantly (white 0 / black 1); mouseleave: bg -> rgba(2,8,1,0)
// (200ms ease-out), logos swap back instantly. Rest bg is written inline on mount so the
// CSS :hover end state cannot pre-empt the tween.
export function bindBlockHover(blocks, whiteSel, blackSel) {
  const unbinds = [...blocks].map((b) => {
    const white = b.querySelectorAll(whiteSel)
    const black = b.querySelectorAll(blackSel)
    gsap.set(b, { backgroundColor: getComputedStyle(b).backgroundColor })
    gsap.set(white, { opacity: 1 })
    gsap.set(black, { opacity: 0 })
    const v = { duration: 0.2, ease: EASE.easeOut }
    const off = bindHover(
      b,
      () => runGroups([[[b, { backgroundColor: 'rgba(255, 255, 255, 1)', ...v }], [white, { opacity: 0 }], [black, { opacity: 1 }]]]),
      () => runGroups([[[b, { backgroundColor: 'rgba(2, 8, 1, 0)', ...v }], [black, { opacity: 0 }], [white, { opacity: 1 }]]]),
    )
    return () => {
      off()
      clearInline([b], ['background-color'])
      clearInline([...white, ...black], ['opacity'])
    }
  })
  return () => unbinds.forEach((u) => u())
}
