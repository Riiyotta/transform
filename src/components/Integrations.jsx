import '../styles/integrations.css'
// M2a/M2b marquee keyframes live here (also imported by ClientLogos for M1).
import '../styles/motion-interactions.css'
import { useLayoutEffect, useRef } from 'react'
import { INTEGRATIONS_ROW_1, INTEGRATIONS_ROW_2 } from '../data/integrations'
import { bindBlockHover, bindHover, clearInline, EASE, gsap, runGroups } from './ui/ixMotion'

// One `.integration-block.bl`: white logo shown, black logo stacked at opacity 0.
// Linked blocks are real external links (target _blank, as on live).
// MOTION: M14 — hover: bg -> #fff (200ms ease-out), logo swap white/black (0ms). The
// hover END state is applied instantly by CSS :hover; Animation owns the 200ms bg tween.
//
// White variant (`.integration-block.wh`, /compare): bg #fff, black logo only
// (`img.integration-logo.black.on-wh`), no logo swap.
// MOTION: CMP-M3 — white-variant hover: bg #fff -> #a2fa8e (200ms ease-out; out reverses).
// Its END state is static :hover CSS in integrations.css; the tween is bound below.
function IntegrationBlock({ item, white }) {
  const logos = white ? (
    <img src={item.black} loading="lazy" alt="" className="integration-logo black on-wh" />
  ) : (
    <>
      <img src={item.white} loading="lazy" alt={item.alt} className="integration-logo white" />
      <img src={item.black} loading="lazy" alt="" className="integration-logo black" />
    </>
  )
  const cls = white ? 'integration-block wh' : 'integration-block bl'
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener" className={cls} data-component="integration-block">
        {logos}
      </a>
    )
  }
  return (
    <div className={cls} data-component="integration-block">
      {logos}
    </div>
  )
}

// Marquee track: rendered twice per row (duplicated track), static at translateX(0).
// MOTION: M2a — `.intagrations-row._1` ×2: translateX 0 -> -100%, 29.99s linear, infinite.
// MOTION: M2b — `.intagrations-row._2` ×2: translateX 0 -> +100%, 29.99s linear, infinite.
function Track({ items, variant, white }) {
  return (
    <div className={`intagrations-row ${variant}${white ? ' wh' : ''}`} data-component="integration-track">
      {items.map((item) => (
        <IntegrationBlock key={item.alt} item={item} white={white} />
      ))}
    </div>
  )
}

// Integrations — CLONE_SPEC §13 (`section.integration-section#integrations`).
// MOTION: M2a/M2b marquees are CSS keyframes in src/styles/motion-interactions.css;
// M14 hover is bindBlockHover (src/components/ui/ixMotion.js), all breakpoints.
//
// variant="white" (specs/compare.md §6c, /compare only): `section.integration-section.white`
// with a single top block (`.integration-top-wrap.wh`: "Works With Leading EHR Platforms"
// + `text`), no "Native Integrations" line, white blocks with black logos. Same rows and
// classes, so M2a/M2b apply unchanged. M14 is not bound (it targets `.bl` blocks only).
// The default variant's DOM and CSS are unchanged.
export default function Integrations({ variant = 'default', text }) {
  const white = variant === 'white'
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!ref.current) return undefined
    return bindBlockHover(ref.current.querySelectorAll('.integration-block.bl'), '.integration-logo.white', '.integration-logo.black')
  }, [])
  // CMP-M3 (IX2 e-70/e-71 -> a-58/a-59, all breakpoints): `.integration-block.wh` bg
  // #fff -> #a2fa8e / back to #fff, 200ms IX2 easeOut, no logo swap. White variant only;
  // the default variant has no `.wh` blocks, so the homepage is unaffected.
  useLayoutEffect(() => {
    if (!white || !ref.current) return undefined
    const v = { duration: 0.2, ease: EASE.easeOut }
    const unbinds = [...ref.current.querySelectorAll('.integration-block.wh')].map((b) => {
      gsap.set(b, { backgroundColor: getComputedStyle(b).backgroundColor })
      const off = bindHover(
        b,
        () => runGroups([[[b, { backgroundColor: 'rgba(162, 250, 142, 1)', ...v }]]]),
        () => runGroups([[[b, { backgroundColor: 'rgba(255, 255, 255, 1)', ...v }]]]),
      )
      return () => {
        off()
        clearInline([b], ['background-color'])
      }
    })
    return () => unbinds.forEach((u) => u())
  }, [white])

  const rows = (
    <div className={`integration-bottom-wrap${white ? ' wh' : ''}`}>
      <div className="integ-row-cont">
        <Track items={INTEGRATIONS_ROW_1} variant="_1" white={white} />
        <Track items={INTEGRATIONS_ROW_1} variant="_1" white={white} />
      </div>
      <div className="integ-row-cont _2">
        <Track items={INTEGRATIONS_ROW_2} variant="_2" white={white} />
        <Track items={INTEGRATIONS_ROW_2} variant="_2" white={white} />
      </div>
    </div>
  )

  if (white) {
    return (
      <section ref={ref} id="integrations" className="integration-section white" data-section="integrations" data-variant="white">
        <div className="integration-top-wrap wh">
          <h2 className="integration-head wh">
            Works With Leading <span className="integ-span">EHR Platforms</span>
          </h2>
          <div className="label-16 integration-text wh-top">{text}</div>
        </div>
        {rows}
      </section>
    )
  }

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

      {rows}
    </section>
  )
}
