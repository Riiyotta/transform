import '../styles/testimonials.css'
import { useLayoutEffect, useRef, useState } from 'react'
import { TESTIMONIALS, TESTIM_ARROWS } from '../data/testimonials'
import Noise from './ui/Noise'
import { EASE, bindHover, clearInline, gsap, runGroups } from './ui/ixMotion'

// MOTION M13 (IX2 a-34..a-37, all breakpoints): arrow mouseenter -> bg rgba(255,255,255,0)
// -> #fff, `.arrow.white` xPercent 0 -> +/-250, `.arrow.black` -/+250 -> 0, all 250ms
// outQuad from the current values; mouseleave reverses (measured 1:1 on live).
function useArrowMotion(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    const unbinds = [...scope.querySelectorAll('.test-arrow-wrap')].map((wrap) => {
      const dir = wrap.classList.contains('right') ? 1 : -1
      const white = wrap.querySelector('.arrow.white')
      const black = wrap.querySelector('.arrow.black')
      const v = { duration: 0.25, ease: EASE.outQuad }
      gsap.set(wrap, { backgroundColor: 'rgba(255, 255, 255, 0)' })
      gsap.set(white, { x: 0, xPercent: 0 })
      gsap.set(black, { x: 0, xPercent: -250 * dir })
      const off = bindHover(
        wrap,
        () => runGroups([[[white, { xPercent: 250 * dir, ...v }], [wrap, { backgroundColor: 'rgba(255, 255, 255, 1)', ...v }], [black, { xPercent: 0, ...v }]]]),
        () => runGroups([[[white, { xPercent: 0, ...v }], [wrap, { backgroundColor: 'rgba(255, 255, 255, 0)', ...v }], [black, { xPercent: -250 * dir, ...v }]]]),
      )
      return () => {
        off()
        clearInline([wrap], ['background-color'])
        clearInline([white, black], ['transform', 'translate'])
      }
    })
    return () => unbinds.forEach((u) => u())
  }, [scopeRef])
}

// MOTION M19 (Webflow slider data-animation="cross", duration 400, easing "ease"):
// outgoing slide opacity current -> 0 and incoming 0 -> 1, simultaneously, 400ms CSS
// `ease`; the incoming slide is raised (z-index++). At 400ms the other slides are reset to
// opacity 1 + visibility hidden. A click mid-fade restarts the incoming slide from 0 and
// fades the slide being left from its current opacity (measured on live, 1440 and 390).
function useSlideMotion(scopeRef, current) {
  const prevRef = useRef(current)
  const depthRef = useRef(1)
  const resetRef = useRef(null)
  useLayoutEffect(() => {
    const prev = prevRef.current
    prevRef.current = current
    const slides = [...(scopeRef.current?.querySelectorAll('.testim-slide') || [])]
    if (prev === current || !slides[current] || !slides[prev]) return
    const inEl = slides[current]
    const outEl = slides[prev]
    resetRef.current?.kill()
    gsap.killTweensOf(slides)
    // Webflow/tram starts CSS transitions ~2 frames after the click (measured ~30ms).
    const v = { duration: 0.4, ease: EASE.cssEase, delay: 0.03 }
    gsap.set(outEl, { visibility: 'visible' })
    gsap.to(outEl, { opacity: 0, ...v })
    gsap.set(inEl, { visibility: 'visible', opacity: 0, zIndex: ++depthRef.current })
    gsap.to(inEl, { opacity: 1, ...v })
    resetRef.current = gsap.delayedCall(0.43, () => {
      clearInline(slides.filter((s) => s !== inEl), ['opacity', 'visibility', 'z-index'])
      clearInline([inEl], ['opacity', 'visibility'])
    })
  }, [scopeRef, current])
  useLayoutEffect(() => () => resetRef.current?.kill(), [])
}

const pad2 = (n) => String(n).padStart(2, '0')

// Testimonials — CLONE_SPEC §8. Webflow slider: data-animation="cross", duration 400,
// easing "ease", autoplay off, infinite off, arrows always visible, dots hidden.
// Static state: the active slide is visible; the other is `visibility:hidden` (the
// measured cross-fade END state, both at opacity 1). Prev/next clamp at the ends.
// MOTION: M19 — 400ms `ease` cross-fade between `.testim-slide.is-active` and the
//                outgoing slide (owned by Animation).
// MOTION: M13 — arrow hover (bg + arrow swap, 250ms outQuad); static end state in CSS.
export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const total = TESTIMONIALS.length
  const go = (dir) => setCurrent((c) => Math.min(total - 1, Math.max(0, c + dir)))
  const sliderRef = useRef(null)
  useArrowMotion(sliderRef)
  useSlideMotion(sliderRef, current)

  return (
    <section id="testimonials" className="testimonials" data-section="testimonials">
      <div className="testimonials-top">
        <div className="testim-top-left">
          <div className="label-16">
            Featured <br />
            Testimonials
          </div>
        </div>
        <div className="testim-top-right">
          <h2 className="h1-text testim-heading">Don’t Just Take Our Word for It</h2>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="testimonials-slider"
        role="region"
        aria-label="carousel"
        data-component="testimonial-slider"
        data-current={current}
      >
        <div className="testim-slider-mask" id="testim-slider-mask">
          {TESTIMONIALS.map((t, i) => {
            const active = i === current
            return (
              <div
                key={t.name}
                className={`testim-slide${active ? ' is-active' : ''}`}
                role="group"
                aria-label={`${i + 1} of ${total}`}
                aria-hidden={active ? undefined : 'true'}
                data-index={i}
              >
                <div className="testim-slide-wrap">
                  <div className="testim-photo-block">
                    <img src={t.photo} loading="lazy" alt={t.photoAlt} className="testim-photo" />
                    <Noise />
                    <div className="testim-author-info-wrap">
                      <div className="testim-author-name">
                        <div className="text-16">{t.name}</div>
                      </div>
                      <div className="testim-author-title">
                        <div className="text-16">{t.title}</div>
                      </div>
                    </div>
                  </div>
                  <div className="testim-right-side">
                    <p className="testimonial">
                      {t.quote}
                      <span className="testim-highlight">{t.highlight}</span>
                      {t.closing}
                    </p>
                    <div className="testim-bottom-cont">
                      {t.points.map((p) => (
                        <div key={p.num} className="testim-point-wrap">
                          <div className={p.numPlain ? 'testim-num-plain' : 'testim-num'}>{p.num}</div>
                          <div className="label-16 testim-point">
                            {p.text}
                            {p.sub && <span className={p.subClass}>{p.sub}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <img src={t.logo} loading="lazy" alt={t.logoAlt} className="testim-logo" />
                    <div className="sider-count">
                      <div className="text-14-white slider-current">{pad2(i + 1)}</div>
                      <div className="text-14-white slider-all">/ {pad2(total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="test-arrow-wrap left"
          aria-controls="testim-slider-mask"
          aria-label="previous slide"
          data-component="testim-arrow"
          onClick={() => go(-1)}
        >
          <img src={TESTIM_ARROWS.leftWhite} loading="lazy" alt="" className="arrow white" />
          <img src={TESTIM_ARROWS.leftBlack} loading="lazy" alt="" className="arrow black" />
        </button>
        <button
          type="button"
          className="test-arrow-wrap right"
          aria-controls="testim-slider-mask"
          aria-label="next slide"
          data-component="testim-arrow"
          onClick={() => go(1)}
        >
          <img src={TESTIM_ARROWS.rightWhite} loading="lazy" alt="" className="arrow white" />
          <img src={TESTIM_ARROWS.rightBlack} loading="lazy" alt="" className="arrow black" />
        </button>
      </div>
    </section>
  )
}
