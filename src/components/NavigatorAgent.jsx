import { useRef, useState } from 'react'
import '../styles/navigator-agent.css'
import { NAVIGATOR_TABS } from '../data/navigator'

// Navigator Agent #3 — CLONE_SPEC §10d (`div.row-tabs-section`, inside the white section).
// Webflow tabs (data-duration 0) + MemberScript #79 (`ms-code-onhover="click"`): hovering a
// row activates it, same as a click; the image pane swaps instantly.
// MOTION: M20 — instant pane swap + active style swap on mouseenter/click (no tween).
export default function NavigatorAgent() {
  const [current, setCurrent] = useState(0)
  const linkRefs = useRef([])

  // Webflow tab keyboard behaviour: arrows move focus + activate.
  const onKeyDown = (e, i) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + NAVIGATOR_TABS.length) % NAVIGATOR_TABS.length
    setCurrent(next)
    linkRefs.current[next]?.focus()
  }

  return (
    <div className="row-tabs-section" data-section="navigator-agent">
      <div className="horizontal-wrap navigator">
        <div className="left-side with-line" />
        <div className="right-side agent navigator">
          <h2 className="agent-head">
            Navigator
            <br />
            Agent
          </h2>
          <div className="agent-num">#3</div>
        </div>
      </div>

      <div className="row-tabs" data-component="row-tabs">
        <div className="row-tabs-menu" role="tablist">
          {NAVIGATOR_TABS.map((tab, i) => (
            <a
              key={tab.title}
              ref={(el) => (linkRefs.current[i] = el)}
              id={`navigator-tab-${i}`}
              href={`#navigator-pane-${i}`}
              role="tab"
              aria-controls={`navigator-pane-${i}`}
              aria-selected={current === i}
              tabIndex={current === i ? 0 : -1}
              className={`row-tab-link${current === i ? ' is-current' : ''}`}
              onMouseEnter={() => setCurrent(i)}
              onClick={(e) => {
                e.preventDefault()
                setCurrent(i)
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <div className="row-tab-head">{tab.title}</div>
              <div className="row-tab-text">{tab.text}</div>
            </a>
          ))}
        </div>

        <div className="row-tabs-content">
          {NAVIGATOR_TABS.map((tab, i) => (
            <div
              key={tab.title}
              id={`navigator-pane-${i}`}
              role="tabpanel"
              aria-labelledby={`navigator-tab-${i}`}
              className={`row-tab-pane${current === i ? ' is-active' : ''}`}
            >
              <div className="row-tab-pane-wrap">
                <div className="nav-agent-img-wrap">
                  <img src={tab.img} loading="eager" alt="" className="nav-agent-img" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
