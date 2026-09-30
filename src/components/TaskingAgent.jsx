import '../styles/tasking-agent.css'
import { useState } from 'react'
import { TASKING_TABS } from '../data/taskingTabs'
import Noise from './ui/Noise'

// Tasking Agent #2 — CLONE_SPEC §10c (`.half-split-wrap` > sticky `.half-split-section`).
// Webflow tabs `#pairTabs` (data-duration-in/out 300, easing ease-out). Tab 1 is current
// on load. Clicking a tab makes it `.w--current` and shows its pane.
// At <=991 the current tab also reveals its `.task-text-row` (IX2 a-29, instant — M10b).
// MOTION: M10 — >=992 only: auto-advance every 4000ms (1->2->3->1; a click restarts the
//   timer; paused while the mobile menu is open), `.tab-progress-vert` height 0 -> 100%
//   linear over 4s on the current tab (others reset to 0), pane opacity fade 300ms
//   ease-out. Owned by Animation — it can call the tab's click() to advance.
export default function TaskingAgent() {
  const [current, setCurrent] = useState(0)

  return (
    <div className="half-split-wrap" data-section="tasking-agent">
      <div className="half-split-section">
        <div id="pairTabs" className="tabs" data-current={`Tab ${current + 1}`} data-component="tasking-tabs">
          <div className="tabs-menu" role="tablist">
            {TASKING_TABS.map((tab, i) => {
              const active = i === current
              return (
                <a
                  key={tab.title}
                  href={`#tasking-pane-${i}`}
                  id={`tasking-tab-${i}`}
                  className={`tab-link${active ? ' w--current' : ''}`}
                  role="tab"
                  aria-controls={`tasking-pane-${i}`}
                  aria-selected={active}
                  data-w-tab={`Tab ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrent(i)
                  }}
                >
                  <div className="tab-title">{tab.title}</div>
                  <div className="task-text-row">{tab.text}</div>
                  {/* MOTION: M10 — height 0% -> 100% linear 4000ms on the current tab (>=992). */}
                  <div className="tab-progress-vert" data-component="tab-progress" />
                </a>
              )
            })}
          </div>
          <div className="tabs-content">
            {TASKING_TABS.map((tab, i) => (
              <div
                key={tab.title}
                id={`tasking-pane-${i}`}
                className={`tab-pane${i === current ? ' w--tab-active' : ''}`}
                role="tabpanel"
                aria-labelledby={`tasking-tab-${i}`}
                data-w-tab={`Tab ${i + 1}`}
              >
                <div className="tab-pane-wrap">
                  <div className="task-img-wrap">
                    <img loading="lazy" src={tab.img} alt="" className="task-img" />
                  </div>
                  <div className="text-14-white task-text">{tab.text}</div>
                  <Noise className="task-agent" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="half-head-text-wrap task-agent">
          <h2 className="h1-text agent task">Tasking Agent</h2>
          <div className="text-16">#2</div>
        </div>
      </div>
    </div>
  )
}
