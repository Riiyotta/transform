import { useLayoutEffect, useRef } from 'react'
import { PRIVACY_ROWS } from '../../data/compare'
import { bindHover, clearInline, EASE, gsap, runGroups } from '../ui/ixMotion'

// CMP-M2 (IX2 e-72/e-73 -> a-60/a-61, all breakpoints): one group, 200ms IX2 easeOut
// (cubic-bezier(0,0,.58,1)), targets scoped to the hovered block (measured on live: the
// other blocks' heads stay #fff). Tweens start from the current value, channel-wise, as IX2.
// Rest values are written inline on mount so the static :hover END state in
// page-compare.css cannot pre-empt the tween.
function usePrivacyHover(ref) {
  useLayoutEffect(() => {
    const blocks = [...ref.current.querySelectorAll('.privacy-block')]
    const v = { duration: 0.2, ease: EASE.easeOut }
    const unbinds = blocks.map((b) => {
      const head = b.querySelectorAll('.privacy-head')
      const text = b.querySelectorAll('.privacy-text')
      gsap.set(b, { backgroundColor: getComputedStyle(b).backgroundColor })
      gsap.set(head, { color: 'rgb(255, 255, 255)' })
      gsap.set(text, { color: 'rgba(255, 255, 255, 0.5)' })
      const off = bindHover(
        b,
        () => runGroups([[[b, { backgroundColor: 'rgba(255, 255, 255, 1)', ...v }], [head, { color: 'rgba(2, 8, 1, 1)', ...v }], [text, { color: 'rgba(2, 8, 1, 1)', ...v }]]]),
        () => runGroups([[[b, { backgroundColor: 'rgba(255, 255, 255, 0)', ...v }], [head, { color: 'rgba(255, 255, 255, 1)', ...v }], [text, { color: 'rgba(255, 255, 255, 0.5)', ...v }]]]),
      )
      return () => {
        off()
        clearInline([b], ['background-color'])
        clearInline([...head, ...text], ['color'])
      }
    })
    return () => unbinds.forEach((u) => u())
  }, [ref])
}

// "Privacy & Security" — specs/compare.md §7 (`section.privacy-section`).
// Rail = privacy-green.avif image panel (background set in page-compare.css).
// MOTION: CMP-M2 — .privacy-block hover: bg transparent -> #fff, head #fff -> #020801,
//   text rgba(255,255,255,.5) -> #020801 (200ms ease-out; out reverses). The END state is
//   static :hover CSS in page-compare.css; the tween is usePrivacyHover (above).
export default function PrivacySection() {
  const ref = useRef(null)
  usePrivacyHover(ref)
  return (
    <section ref={ref} className="privacy-section" data-section="privacy">
      <div className="privacy-top">
        <h2 className="h1-text privacy">
          <span className="privacy-span">Privacy &amp; Security</span>
        </h2>
      </div>
      <div className="privacy-bottom">
        <div className="privacy-left" />
        <div className="privacy-right">
          {PRIVACY_ROWS.map((row, r) => (
            <div key={r} className={`privacy-row${r === 1 ? ' _2' : ''}`}>
              {row.map((b) => (
                <div key={b.head} className="privacy-block" data-component="privacy-block">
                  <div className="text-30 white privacy-head">{b.head}</div>
                  <div className={`text-16 privacy-text${b.long ? ' long' : ''}`}>{b.text}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
