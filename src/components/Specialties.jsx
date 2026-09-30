import { useRef, useState } from 'react'
import '../styles/specialties.css'
import { SPECIALTIES } from '../data/specialties'
import Noise from './ui/Noise'

// Specialties — CLONE_SPEC §12 (`section.specialty-section#specialties`).
// Webflow tabs (duration 0) + MemberScript #79 (`ms-code-onhover="click"`): hovering a
// tab link activates it, same as a click. The pane swap is instant.
// MOTION: M20 — instant pane swap + active style swap on mouseenter/click (no tween).
export default function Specialties() {
  const [current, setCurrent] = useState(0)
  const linkRefs = useRef([])

  // Webflow tab keyboard behaviour: arrows move focus + activate.
  const onKeyDown = (e, i) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + SPECIALTIES.length) % SPECIALTIES.length
    setCurrent(next)
    linkRefs.current[next]?.focus()
  }

  return (
    <section id="specialties" className="specialty-section" data-section="specialties">
      <div className="specialty-top-row">
        <div className="left-side specialty">
          <div className="specialty-left-side-wrap">
            <div className="label-16 specialty-title">
              Designed for <span className="text-span-13">Your Specialty</span>
            </div>
          </div>
        </div>

        <div className="right-side specialty">
          <div className="specialty-tabs" data-component="specialty-tabs">
            <div className="specialty-tabs-menu" role="tablist">
              {SPECIALTIES.map((s, i) => (
                <a
                  key={s.name}
                  ref={(el) => (linkRefs.current[i] = el)}
                  id={`specialty-tab-${i}`}
                  href={`#specialty-pane-${i}`}
                  role="tab"
                  aria-controls={`specialty-pane-${i}`}
                  aria-selected={current === i}
                  tabIndex={current === i ? 0 : -1}
                  className={`specialty-tab-link${current === i ? ' is-current' : ''}`}
                  onMouseEnter={() => setCurrent(i)}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrent(i)
                  }}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <div className="specialty-tab-text">{s.name}</div>
                </a>
              ))}
            </div>

            <div className="specialty-tabs-content">
              {SPECIALTIES.map((s, i) => (
                <div
                  key={s.name}
                  id={`specialty-pane-${i}`}
                  role="tabpanel"
                  aria-labelledby={`specialty-tab-${i}`}
                  className={`specialty-tab-pane${current === i ? ' is-active' : ''}`}
                >
                  <div className="specialty-tab-pane-wrap">
                    <img src={s.img} loading="lazy" alt="" className="specialty-img" />
                    <Noise className="specialty-noise" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="specialty-bottom-row">
        <div className="right-side specialty-bottom">
          <div className="label-16 specialty-bottom-text">And other specialties</div>
        </div>
      </div>
    </section>
  )
}
