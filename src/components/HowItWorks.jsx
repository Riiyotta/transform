import { useRef } from 'react'
import '../styles/how-it-works.css'
import { gsap, ScrollTrigger } from '../motion/gsap'
import { useGsapContext } from '../motion/useGsapContext'

const GREEN = '#a2fa8e'
// IX3 stores some colour targets as hsla(); GSAP then interpolates in HSL space (measured
// in-between frames on live pass through yellow), so the same strings are used here.
const GREEN_HSLA = 'hsla(108.88888888888889, 91.53%, 76.86%, 1.00)'
const GRAY = '#4c4c4c'

// M7 — IX3 i-d17e6d2e (space), i-25416c39 (_2), i-874c7080 (_1); values measured on live
// (ScrollTrigger.getAll / getTweensOf). Each is a 0.25s timeline played on the trigger's
// onEnter and reversed on onEnterBack (no scrub). "AI that" y uses power1.inOut, colours
// power1.in, force3D. Triggers: `.hiw-trigger._1` / `._2` at "bottom center" (start = end),
// `.hiw-trigger.space` at "bottom top". Created in the live order (space, _2, _1) so the
// immediate renders leave the same initial inline state (y 0vw, _1 green, _2/_3 gray).
function setupHiw(scope) {
  const left = scope.querySelector('.hiw-text-block.left')
  const w1 = scope.querySelector('.hiw-text._1')
  const w2 = scope.querySelector('.hiw-text._2')
  const w3 = scope.querySelector('.hiw-text._3')
  const Y = { duration: 0.25, ease: 'power1.inOut', force3D: true }
  const C = { duration: 0.25, ease: 'power1.in', force3D: true }
  const trigger = (sel, tl, pos) =>
    ScrollTrigger.create({
      trigger: scope.querySelector(sel),
      start: pos,
      end: pos,
      onEnter: () => tl.play(),
      onEnterBack: () => tl.reverse(),
    })

  // space: "from" tweens back to the initial state once the section has left the viewport.
  const space = gsap.timeline({ paused: true })
  space.from(left, { y: '24vw', ...Y }, 0)
  space.from(w2, { color: GRAY, ...C }, 0)
  space.from(w1, { color: GRAY, ...C }, 0)
  space.from(w3, { color: GREEN, ...C }, 0)
  trigger('.hiw-trigger.space', space, 'bottom top')

  const step2 = gsap.timeline({ paused: true })
  step2.fromTo(left, { y: '12vw' }, { y: '24vw', ...Y }, 0)
  step2.fromTo(w2, { color: GREEN }, { color: GRAY, ...C }, 0)
  step2.fromTo(w3, { color: GRAY }, { color: GREEN_HSLA, ...C }, 0)
  trigger('.hiw-trigger._2', step2, 'bottom center')

  const step1 = gsap.timeline({ paused: true })
  step1.fromTo(left, { y: '0vw' }, { y: '12vw', ...Y }, 0)
  step1.fromTo(w1, { color: GREEN }, { color: GRAY, ...C }, 0)
  step1.fromTo(w2, { color: GRAY }, { color: GREEN_HSLA, ...C }, 0)
  trigger('.hiw-trigger._1', step1, 'bottom center')
}

const WORDS = ['Speaks', 'Schedules', 'Supports Patients']

// How It Works — CLONE_SPEC §9.
// `activeIndex` (0 | 1 | 2) selects the green word and the "AI that" offset
// (0 / 12vw / 24vw). Default 0 = the measured initial state ("Speaks" green).
// MOTION: M7 — scroll-stepped highlight, GSAP inline styles (setupHiw above); the static
//   `activeIndex` hooks stay at 0.
export default function HowItWorks({ activeIndex = 0 }) {
  const ref = useRef(null)
  useGsapContext(ref, setupHiw)
  return (
    <section ref={ref} className="how-it-works" data-section="how-it-works" data-active={activeIndex}>
      <div className="how-works-right top" />
      <div className="how-works-sticky-cont">
        <div className="how-works-sticky">
          <div className="how-works-right-text top">
            <div className="label-16">How It Works</div>
          </div>
          <div className="how-works-heads-wrap" data-component="hiw-words">
            <div className="hiw-left-wrap">
              {/* MOTION: M7 — translateY 0 -> 12vw -> 24vw (data-active on the section). */}
              <div className="hiw-text-block left">
                <div className="hiw-text left">AI that</div>
              </div>
              <div className="hiw-text-block left-mob">
                <div className="hiw-text left">AI that</div>
              </div>
            </div>
            <div className="hiw-right-wrap">
              {WORDS.map((word, i) => (
                <div key={word} className={`hiw-text-block${i === WORDS.length - 1 ? ' last' : ''}`}>
                  <div className={`hiw-text _${i + 1}${i === activeIndex ? ' is-active' : ''}`} data-index={i}>
                    {word}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-works-right medium" />
        </div>
        <div className="hiw-triggers" aria-hidden="true">
          {['_1', '_2', '_3', 'space'].map((t) => (
            <div key={t} className={`hiw-trigger ${t}`}>
              <div className="how-works-right full" />
            </div>
          ))}
        </div>
      </div>
      <div className="how-works-right-text bottom-w-text">
        <div className="label-16 hiw-bottom">
          Built specifically for high-volume medical practices, our platform streamlines operations, enhances patient
          access, and drives revenue growth.
        </div>
      </div>
      <div className="how-works-right-text bottom" />
    </section>
  )
}
