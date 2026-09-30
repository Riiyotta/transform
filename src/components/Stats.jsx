import { useLayoutEffect, useRef, useState } from 'react'
import { ASSETS } from '../data/assets'
import { STATS } from '../data/stats'
import Noise from './ui/Noise'
import { EASE, MQ, bindHover, clearInline, gsap, runGroups } from './ui/ixMotion'

// MOTION M5 (>=992, IX2 a-14/a-15) and M6 (<=991, IX2 a-17 medium / a-31 small+tiny).
// Values measured on the live site (recon/motion-2/hover-live.json, misc-live-*.json):
// M5  mouseenter: .stat-head + .stat-descr yPercent 100 -> 0 (500ms outCubic, from current),
//     .stats-img-wrap opacity -> 1 (200ms ease-out); mouseleave reverses. The flex-basis
//     grow stays the original CSS transition (.6s cubic-bezier(.645,.045,.355,1)).
// M6  click: clicked block width -> 70% (768-991) / height -> 260px (<=767), siblings ->
//     10% / auto (500ms ease-out); other images -> 0 and clicked image -> 1 (200ms
//     ease-out); other head/descr -> 100% (200ms outCubic), clicked -> 0 (500ms outCubic).
//     On page load at <=991 the IX2 initial state (25% widths / auto heights, all images 1,
//     heads 100%) is shown and block 1 is auto-clicked (Webflow inline script). Entering
//     <=991 by resizing shows that initial state WITHOUT the auto-click (measured on live).
function useStatsMotion(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    const blocks = [...scope.querySelectorAll('.stats-block')]
    const texts = (b) => [...b.querySelectorAll('.stat-head, .stat-descr')]
    const img = (b) => b.querySelector('.stats-img-wrap')
    const allTexts = blocks.flatMap(texts)
    const allImgs = blocks.map(img)
    let loading = true
    const mm = gsap.matchMedia()

    mm.add(MQ.desktop, () => {
      gsap.set(allTexts, { y: 0, yPercent: 100 })
      gsap.set(allImgs, { opacity: 0 })
      const unbinds = blocks.map((b) =>
        bindHover(
          b,
          () => runGroups([[[texts(b), { yPercent: 0, duration: 0.5, ease: EASE.outCubic }], [img(b), { opacity: 1, duration: 0.2, ease: EASE.easeOut }]]]),
          () => runGroups([[[texts(b), { yPercent: 100, duration: 0.5, ease: EASE.outCubic }], [img(b), { opacity: 0, duration: 0.2, ease: EASE.easeOut }]]]),
        ),
      )
      return () => {
        unbinds.forEach((u) => u())
        clearInline(allTexts, ['transform', 'translate'])
        clearInline(allImgs, ['opacity'])
      }
    })

    const accordion = (dim) => () => {
      const isW = dim === 'width'
      gsap.set(blocks, isW ? { width: '25%' } : { height: 'auto' })
      gsap.set(allTexts, { y: 0, yPercent: 100 })
      gsap.set(allImgs, { opacity: 1 })
      const open = (i) => {
        const b = blocks[i]
        const sib = blocks.filter((x) => x !== b)
        runGroups([[
          [sib, { [dim]: isW ? '10%' : 'auto', duration: 0.5, ease: EASE.easeOut }],
          [b, { [dim]: isW ? '70%' : '260px', duration: 0.5, ease: EASE.easeOut }],
          [sib.map(img), { opacity: 0, duration: 0.2, ease: EASE.easeOut }],
          [img(b), { opacity: 1, duration: 0.2, ease: EASE.easeOut }],
          [sib.flatMap(texts), { yPercent: 100, duration: 0.2, ease: EASE.outCubic }],
          [texts(b), { yPercent: 0, duration: 0.5, ease: EASE.outCubic }],
        ]])
      }
      const handlers = blocks.map((b, i) => {
        const h = () => open(i)
        b.addEventListener('click', h)
        return () => b.removeEventListener('click', h)
      })
      if (loading) open(0) // Webflow: `firstStat.click()` on load at <=991
      return () => {
        handlers.forEach((u) => u())
        clearInline(blocks, ['width', 'height'])
        clearInline(allTexts, ['transform', 'translate'])
        clearInline(allImgs, ['opacity'])
      }
    }
    mm.add(MQ.medium, accordion('width'))
    mm.add(MQ.small, accordion('height'))
    loading = false
    return () => mm.revert()
  }, [scopeRef])
}

// Stats — CLONE_SPEC §7. Styles: STATS block in src/index.css.
// >=992: CSS :hover expands a block (flex-basis 16% -> 100%) and reveals its heading,
//        description and image (static end state; MOTION: M5).
// <=991: click accordion; block 1 is active on load (MOTION: M6). `.is-active` has no
//        effect at >=992.
export default function Stats() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  useStatsMotion(ref)

  return (
    <section ref={ref} className="stats" data-section="stats">
      <div className="stats-row">
        <div className="stats-left">
          <div className="stats-text">
            Proven Results. <span className="stats-span">Powerful Impact.</span>
          </div>
          <img src={ASSETS.statsGradient} loading="lazy" alt="" className="img-stats" />
        </div>
        <div className="stats-right">
          {STATS.map((stat, i) => (
            <div
              key={stat.index}
              className={`stats-block${stat.variant ? ` ${stat.variant}` : ''}${active === i ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <div className="text-14-white">{stat.index}</div>
              <div className="stats-bottom">
                <div className="stat-head-text-wrap">
                  <div className="stat-head">{stat.value}</div>
                </div>
                <div className="stat-descr-wrap">
                  <div className="stat-descr">{stat.label}</div>
                </div>
              </div>
              <div className="stats-img-wrap">
                <div className={`stats-img${stat.img ? ` ${stat.img}` : ''}`} />
                <Noise className="stat-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
