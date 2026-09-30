import '../styles/tasking-agent.css'
import { useLayoutEffect, useRef, useState } from 'react'
import { TASKING_TABS } from '../data/taskingTabs'
import Noise from './ui/Noise'
import { EASE, MQ, clearInline, gsap } from './ui/ixMotion'

const ROTATE_MS = 4000

// MOTION M10 / M10b — measured on live (recon/motion-2/misc-live-*.json, extra-live.json):
// - Rotation (>=992 only, the original inline script): every 4000ms click the next tab
//   (1->2->3->1). Any tab click restarts the 4000ms wait. If the nav menu is open at the
//   tick (`html[data-menu-open="true"]`, set by Navbar) the wait simply restarts.
// - Progress bar (IX2 a-4/a-5, >=992): on tab activation the current `.tab-progress-vert`
//   grows 0 -> 100% height, linear over 4000ms; the others are reset to 0 instantly.
//   Clicking the already-current tab does not restart the bar (Webflow fires no
//   TAB_ACTIVE) but does restart the timer.
// - Breakpoint switching (measured): leaving >=992 stops rotation and resets every bar to
//   0 and hides every `.task-text-row` (IX2 resets to its initial state; the row reappears
//   on the next tab change). Returning to >=992 restarts the timer; bars stay at 0 until
//   the next activation.
// - Pane change (Webflow tabs, all breakpoints): the visible pane fades out 300ms
//   ease-out, then the new pane fades in 300ms ease-out (600ms total).
function useTaskingMotion(scopeRef, current, setCurrent, count) {
  const restartRef = useRef(() => {})
  const prevRef = useRef(current)
  const paneTl = useRef(null)
  const rowsHidden = useRef(false)

  // Timer + breakpoint handling.
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    const mq = window.matchMedia(MQ.desktop)
    const bars = () => scope.querySelectorAll('.tab-progress-vert')
    let timer = null
    const loop = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (document.documentElement.dataset.menuOpen === 'true') return loop()
        setCurrent((c) => (c + 1) % count)
        return loop()
      }, ROTATE_MS)
    }
    const onChange = () => {
      clearTimeout(timer)
      timer = null
      if (mq.matches) {
        loop()
      } else {
        gsap.killTweensOf(bars())
        gsap.set(bars(), { height: '0%' })
        scope.querySelectorAll('.task-text-row').forEach((r) => (r.style.display = 'none'))
        rowsHidden.current = true
      }
    }
    restartRef.current = () => mq.matches && loop()
    if (mq.matches) {
      loop()
      gsap.fromTo(bars()[0], { height: '0%' }, { height: '100%', duration: ROTATE_MS / 1000, ease: EASE.linear })
    }
    mq.addEventListener('change', onChange)
    return () => {
      clearTimeout(timer)
      mq.removeEventListener('change', onChange)
      restartRef.current = () => {}
      clearInline(bars(), ['height'])
      clearInline(scope.querySelectorAll('.task-text-row'), ['display'])
    }
  }, [scopeRef, setCurrent, count])

  // Tab activation: bar + pane fade.
  useLayoutEffect(() => {
    const scope = scopeRef.current
    const prev = prevRef.current
    prevRef.current = current
    if (!scope || prev === current) return
    if (rowsHidden.current) {
      clearInline(scope.querySelectorAll('.task-text-row'), ['display'])
      rowsHidden.current = false
    }
    const bars = [...scope.querySelectorAll('.tab-progress-vert')]
    gsap.killTweensOf(bars)
    gsap.set(bars.filter((_, i) => i !== current), { height: '0%' })
    if (window.matchMedia(MQ.desktop).matches) {
      gsap.fromTo(bars[current], { height: '0%' }, { height: '100%', duration: ROTATE_MS / 1000, ease: EASE.linear })
    }

    const panes = [...scope.querySelectorAll('.tab-pane')]
    const next = panes[current]
    paneTl.current?.kill()
    const visible = panes.filter((p) => p.style.display === 'block' && +getComputedStyle(p).opacity > 0)
    const out = visible.find((p) => p !== next) || (visible.includes(next) ? null : panes[prev])
    panes.forEach((p) => p !== out && p !== next && clearInline([p], ['display', 'opacity']))
    const v = { duration: 0.3, ease: EASE.easeOut }
    const done = () => clearInline(panes, ['display', 'opacity'])
    if (!out) {
      paneTl.current = gsap.timeline({ onComplete: done }).to(next, { opacity: 1, ...v })
      return
    }
    gsap.set(out, { display: 'block' })
    gsap.set(next, { display: 'none', opacity: 0 })
    paneTl.current = gsap
      .timeline({ onComplete: done })
      .to(out, { opacity: 0, ...v })
      .set(out, { display: 'none' })
      .set(next, { display: 'block', opacity: 0 })
      .to(next, { opacity: 1, ...v })
  }, [scopeRef, current])

  useLayoutEffect(() => () => paneTl.current?.kill(), [])
  return restartRef
}

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
  const ref = useRef(null)
  const restartTimer = useTaskingMotion(ref, current, setCurrent, TASKING_TABS.length)

  return (
    <div ref={ref} className="half-split-wrap" data-section="tasking-agent">
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
                    restartTimer.current() // any tab click restarts the 4000ms wait
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
