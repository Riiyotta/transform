import { useRef, useState } from 'react'
import { EV_TABS } from '../../data/compare'

// "Healthcare AI Evaluation" — specs/compare.md §8 (`section.ev-section`).
// Webflow tabs used as an accordion: only the tab links render; `.ev-tabs-content` panes are
// empty and display:none. Click activates (no hover); clicking the open tab keeps it open;
// exactly one is open. Keyboard: arrows / Home / End (Webflow tabs).
// `.is-current` = Webflow `.w--current` (bg #fff, text #020801, .ev-tab-text shown).
// MOTION: CMP-M4 — instant switch (no transition): tab bg/colour via CSS, .ev-tab-text
//   display none <-> block (IX2 TAB_ACTIVE / TAB_INACTIVE).
export default function EvSection() {
  const [current, setCurrent] = useState(0)
  const refs = useRef([])

  const activate = (i, focus = false) => {
    setCurrent(i)
    if (focus) refs.current[i]?.focus()
  }
  const onKeyDown = (e, i) => {
    const n = EV_TABS.length
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % n
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i - 1 + n) % n
          : e.key === 'Home' ? 0
            : e.key === 'End' ? n - 1
              : null
    if (next === null) return
    e.preventDefault()
    activate(next, true)
  }

  return (
    <section className="ev-section" data-section="healthcare-evaluation">
      <div className="ev-left" />
      <div className="ev-right">
        <div className="ev-top">
          <div className="text-16 half-white ev-label">Practices choose Transform9 for:</div>
          <h2 className="h1-text ev">
            Healthcare <br />AI Evaluation
          </h2>
        </div>
        <div className="ev-bottom">
          <div className="ev-tabs" data-component="ev-accordion" data-current={current + 1}>
            <div className="ev-tab-menu" role="tablist">
              {EV_TABS.map((t, i) => (
                <a
                  key={t.head}
                  ref={(el) => (refs.current[i] = el)}
                  id={`ev-tab-${i}`}
                  href={`#ev-pane-${i}`}
                  role="tab"
                  aria-controls={`ev-pane-${i}`}
                  aria-selected={current === i}
                  aria-expanded={current === i}
                  tabIndex={current === i ? 0 : -1}
                  className={`ev-tab${i === EV_TABS.length - 1 ? ' last' : ''}${current === i ? ' is-current' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    activate(i)
                  }}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <div className="text-30 ev-head">{t.head}</div>
                  <div className="text-16 ev-tab-text">{t.text}</div>
                </a>
              ))}
            </div>
            <div className="ev-tabs-content">
              {EV_TABS.map((t, i) => (
                <div key={t.head} id={`ev-pane-${i}`} role="tabpanel" aria-labelledby={`ev-tab-${i}`} className={`w-tab-pane${current === i ? ' is-active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
