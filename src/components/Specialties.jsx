import { useRef, useState } from 'react'
import '../styles/specialties.css'
import { SPECIALTIES } from '../data/specialties'
import Noise from './ui/Noise'

// Specialties — CLONE_SPEC §12 (`section.specialty-section#specialties`).
// Webflow tabs (duration 0) + MemberScript #79 (`ms-code-onhover="click"`): hovering a
// tab link activates it, same as a click. The pane swap is instant.
// MOTION: M20 — instant pane swap + active style swap on mouseenter/click (no tween).
//
// variant="white" (specs/compare.md §6b, /compare only): `div.specialty-section.white`
// with no left-rail title; `.specialty-tabs.wh` is row-reverse so the image pane sits in
// the rail on the left; `.wh` links (the first also `._1`) with a green active tab;
// `bottomText` replaces "And other specialties". Same tabs, images and M20 behaviour.
// Styles: the `.white` / `.wh` rules in specialties.css. The default variant's DOM and CSS
// are unchanged.
export default function Specialties({ variant = 'default', bottomText }) {
  const white = variant === 'white'
  const wh = white ? ' wh' : ''
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

  const tabs = (
    <div className={`specialty-tabs${wh}`} data-component="specialty-tabs">
      <div className={`specialty-tabs-menu${wh}`} role="tablist">
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
            className={`specialty-tab-link${wh}${white && i === 0 ? ' _1' : ''}${current === i ? ' is-current' : ''}`}
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

      <div className={`specialty-tabs-content${wh}`}>
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
  )

  if (white) {
    return (
      <div id="specialties" className="specialty-section white" data-section="specialties" data-variant="white">
        <div className="specialty-top-row wh">{tabs}</div>
        <div className="specialty-bottom-row">
          <div className="right-side specialty-bottom wh">
            <div className="label-16 specialty-bottom-text wh">{bottomText}</div>
          </div>
        </div>
      </div>
    )
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

        <div className="right-side specialty">{tabs}</div>
      </div>

      <div className="specialty-bottom-row">
        <div className="right-side specialty-bottom">
          <div className="label-16 specialty-bottom-text">And other specialties</div>
        </div>
      </div>
    </section>
  )
}
