import '../styles/testimonials.css'
import { useState } from 'react'
import { TESTIMONIALS, TESTIM_ARROWS } from '../data/testimonials'
import Noise from './ui/Noise'

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
