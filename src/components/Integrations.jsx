import '../styles/integrations.css'
import { useLayoutEffect, useRef } from 'react'
import { INTEGRATIONS_ROW_1, INTEGRATIONS_ROW_2 } from '../data/integrations'
import { bindBlockHover } from './ui/ixMotion'

// One `.integration-block.bl`: white logo shown, black logo stacked at opacity 0.
// Linked blocks are real external links (target _blank, as on live).
// MOTION: M14 — hover: bg -> #fff (200ms ease-out), logo swap white/black (0ms). The
// hover END state is applied instantly by CSS :hover; Animation owns the 200ms bg tween.
function IntegrationBlock({ item }) {
  const logos = (
    <>
      <img src={item.white} loading="lazy" alt={item.alt} className="integration-logo white" />
      <img src={item.black} loading="lazy" alt="" className="integration-logo black" />
    </>
  )
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener" className="integration-block bl" data-component="integration-block">
        {logos}
      </a>
    )
  }
  return (
    <div className="integration-block bl" data-component="integration-block">
      {logos}
    </div>
  )
}

// Marquee track: rendered twice per row (duplicated track), static at translateX(0).
// MOTION: M2a — `.intagrations-row._1` ×2: translateX 0 -> -100%, 29.99s linear, infinite.
// MOTION: M2b — `.intagrations-row._2` ×2: translateX 0 -> +100%, 29.99s linear, infinite.
function Track({ items, variant }) {
  return (
    <div className={`intagrations-row ${variant}`} data-component="integration-track">
      {items.map((item) => (
        <IntegrationBlock key={item.alt} item={item} />
      ))}
    </div>
  )
}

// Integrations — CLONE_SPEC §13 (`section.integration-section#integrations`).
// MOTION: M2a/M2b marquees are CSS keyframes in src/styles/motion-interactions.css;
// M14 hover is bindBlockHover (src/components/ui/ixMotion.js), all breakpoints.
export default function Integrations() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!ref.current) return undefined
    return bindBlockHover(ref.current.querySelectorAll('.integration-block.bl'), '.integration-logo.white', '.integration-logo.black')
  }, [])
  return (
    <section ref={ref} id="integrations" className="integration-section" data-section="integrations">
      <div className="integration-top-wrap">
        <h2 className="integration-head">
          Built to <span className="integration-head-span">Connect</span>
        </h2>
        <div className="integration-top-right-wrap">
          <div className="label-16 integration-text">
            Connect instantly with your EMR, phone system, and workflows—no extra overhead, no missed steps.
          </div>
          <div className="integration-label">Native Integrations</div>
        </div>
      </div>

      <div className="integration-bottom-wrap">
        <div className="integ-row-cont">
          <Track items={INTEGRATIONS_ROW_1} variant="_1" />
          <Track items={INTEGRATIONS_ROW_1} variant="_1" />
        </div>
        <div className="integ-row-cont _2">
          <Track items={INTEGRATIONS_ROW_2} variant="_2" />
          <Track items={INTEGRATIONS_ROW_2} variant="_2" />
        </div>
      </div>
    </section>
  )
}
