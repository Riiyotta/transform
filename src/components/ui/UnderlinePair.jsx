import { useLayoutEffect, useRef } from 'react'
import { EASE, bindHover, clearInline, gsap, runGroups } from './ixMotion'

// `.underline._1` (anchored right, 100%) + `.underline._2` (anchored left, 0%).
// The parent must be position:relative and carry `has-underline` for the hover state.
// MOTION: M12 (IX2 a-32 / a-33), bound to the parent (.hero-cta-link, .submit-form-wrap,
// .w-underline-link), all breakpoints:
//   mouseenter: _1 width -> 0% (250ms inOutQuad, from current), THEN _2 width -> 100%
//               (250ms inOutQuad).
//   mouseleave: instant reset (_1 100%, _2 0%); a leave mid-sequence cancels the rest
//               (measured: _2 never grows after an early leave).
// Inline rest widths are set on mount so the CSS :hover end state (index.css) cannot
// pre-empt the tween.
export default function UnderlinePair({ black = false }) {
  const ref = useRef(null)
  const tone = black ? ' black' : ''

  useLayoutEffect(() => {
    const u1 = ref.current
    const u2 = u1?.nextElementSibling
    const parent = u1?.parentElement
    if (!u1 || !u2 || !parent) return undefined
    gsap.set(u1, { width: '100%' })
    gsap.set(u2, { width: '0%' })
    const onEnter = () =>
      runGroups([
        [[u1, { width: '0%', duration: 0.25, ease: EASE.inOutQuad }]],
        [[u2, { width: '100%', duration: 0.25, ease: EASE.inOutQuad }]],
      ])
    const onLeave = () => runGroups([[[u1, { width: '100%' }], [u2, { width: '0%' }]]])
    const unbind = bindHover(parent, onEnter, onLeave)
    return () => {
      unbind()
      clearInline([u1, u2], ['width'])
    }
  }, [])

  return (
    <>
      <div ref={ref} className={`underline${tone} _1`} data-component="underline-pair" />
      <div className={`underline${tone} _2`} />
    </>
  )
}
