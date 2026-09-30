import { useRef } from 'react'
import '../styles/scheduling-agent.css'
import { gsap } from '../motion/gsap'
import { useGsapContext } from '../motion/useGsapContext'
import { SCHEDULING_CARDS } from '../data/schedulingCards'
import Noise from './ui/Noise'

// Scheduling Agent #1 — CLONE_SPEC §10b (`.stacking-cards-section.schudule-agent#products`).
// Four sticky `.scheduling-card`s form a deck.
//
// `stackStep` (0-3) = how many later cards have entered: 0 is the static/initial state;
// 3 is the measured end state (card 4 in view). For card i (1-based, cards 1-3):
//   depth = max(0, stackStep - (i - 1))  ->  translateY(-1.8vw * depth) scale(1 - .03 * depth)
//   and, once depth >= 1, its tint (#e9e9eb / #c1c0c7 / #858391). At step 3 `.sch-img._3`
//   drops to opacity .2.
// MOTION: M9 — scroll-scrubbed deck, GSAP inline styles (setupDeck below); the static
//   `stackStep` hooks stay at 0.
// M9 — IX3 i-50410ed3 / i-9a9d6453 / i-e19166ac, replicated call-for-call from the live
// runtime (ScrollTrigger.getAll + timeline children, GSAP 3.15):
//   card _2: start "top center", end "bottom bottom 20%" (ScrollTrigger ignores the 3rd
//            token, so = "bottom bottom": a 57px range @1440x900), scrub .5.
//            card1 fromTo {y 0vw, scale 1} -> {y -1.8vw, scale .97} + fromTo {} -> bg
//            #e9e9eb, 0.25s, default ease (power1.out; measured .4375 at t=.25).
//   card _3: same range, ease none: to card2 y -1.8vw scale .97 + bg #c1c0c7;
//            fromTo card1 {} -> y -3.6vw scale .94.
//   card _4: end "bottom bottom", ease none: to card3 y -1.8vw scale .97 + bg #858391;
//            fromTo card2 {} -> -3.6vw/.94; fromTo card1 {} -> -5.4vw/.91;
//            to .sch-img._3 opacity .2 (0.1s power1.out).
// All tweens force3D, overwrite false. Timelines created in the live order (_2, _3, _4).
function setupDeck(scope) {
  const card = (n) => scope.querySelector(`.scheduling-card._${n}`)
  const base = { duration: 0.25, force3D: true, overwrite: false }
  // ScrollTrigger measures "top center" / "bottom bottom" with getBoundingClientRect, which
  // includes the deck's own transforms. Live measures the cards un-transformed (fresh load
  // at scrollY 0), but a refresh mid-deck (e.g. after a resize) would measure them scaled /
  // shifted. So the same positions are computed from the cards' natural (static-flow,
  // untransformed, un-stuck) boxes: container top + padding + previous cards + row gaps.
  // Values are identical to the string positions on a fresh load (verified 1440/1024/768/390).
  // Computed height = fractional, untransformed border-box height (box-sizing border-box).
  const boxH = (el) => parseFloat(getComputedStyle(el).height) || el.offsetHeight
  const naturalTop = (n) => {
    const cont = scope.querySelector('.scheduling-cards')
    const cs = getComputedStyle(cont)
    const gap = parseFloat(cs.rowGap) || 0
    let y = cont.getBoundingClientRect().top + window.scrollY + (parseFloat(cs.paddingTop) || 0)
    for (let i = 1; i < n; i += 1) y += boxH(card(i)) + gap
    return y
  }
  const topCenter = (n) => () => naturalTop(n) - window.innerHeight / 2
  const bottomBottom = (n) => () => naturalTop(n) + boxH(card(n)) - window.innerHeight
  // `end` for cards 2/3 is "bottom bottom 20%" on live; ScrollTrigger ignores the 3rd token.
  const st = (n) => ({ trigger: card(n), start: topCenter(n), end: bottomBottom(n), scrub: 0.5 })

  const tl2 = gsap.timeline({ scrollTrigger: st(2) })
  tl2.fromTo(card(1), { y: '0vw', scale: 1 }, { y: '-1.8vw', scale: 0.97, ...base }, 0)
  tl2.fromTo(card(1), {}, { backgroundColor: '#e9e9eb', ...base }, 0)

  const lin = { ...base, ease: 'none' }
  const tl3 = gsap.timeline({ scrollTrigger: st(3) })
  tl3.to(card(2), { y: '-1.8vw', scale: 0.97, ...lin }, 0)
  tl3.to(card(2), { backgroundColor: '#c1c0c7', ...lin }, 0)
  tl3.fromTo(card(1), {}, { y: '-3.6vw', scale: 0.94, stagger: { each: 0 }, ...lin }, 0)

  const tl4 = gsap.timeline({ scrollTrigger: st(4) })
  tl4.to(card(3), { y: '-1.8vw', scale: 0.97, ...lin }, 0)
  tl4.to(card(3), { backgroundColor: '#858391', ...lin }, 0)
  tl4.fromTo(card(2), {}, { y: '-3.6vw', scale: 0.94, stagger: { each: 0 }, ...lin }, 0)
  tl4.fromTo(card(1), {}, { y: '-5.4vw', scale: 0.91, stagger: { each: 0 }, ...lin }, 0)
  tl4.to(scope.querySelector('.sch-img._3'), { opacity: 0.2, duration: 0.1, ease: 'power1.out', force3D: true, overwrite: false }, 0)
}

export default function SchedulingAgent({ stackStep = 0 }) {
  const ref = useRef(null)
  useGsapContext(ref, setupDeck)
  return (
    <div
      ref={ref}
      id="products"
      className="stacking-cards-section schudule-agent"
      data-section="scheduling-agent"
      data-stack-step={stackStep}
    >
      <div className="horizontal-wrap scheduling">
        <div className="left-side our-products">
          <div className="text-16">Our Products</div>
        </div>
        <div className="right-side agent schedule">
          <h2 className="h1-text agent sch">Scheduling Agent</h2>
          <div className="text-16 num-agent-1">#1</div>
        </div>
      </div>
      <div className="sheduling-top-space">
        <div className="left-side empty-white" />
      </div>
      <div className="scheduling-cards">
        {SCHEDULING_CARDS.map((card, idx) => {
          const n = idx + 1
          const depth = n < SCHEDULING_CARDS.length ? Math.max(0, stackStep - idx) : 0
          return (
            <div
              key={card.index}
              className={`scheduling-card _${n}${depth > 0 ? ' is-stacked' : ''}`}
              data-component="scheduling-card"
              data-card={n}
              data-depth={depth}
            >
              <div className="stack-card-left">{card.index}</div>
              <div className="stack-card-text-wrap">
                <div className={`stack-card-head${card.headMod ? ` ${card.headMod}` : ''}`}>{card.head}</div>
                <div className={`stack-card-text${card.textMod ? ` ${card.textMod}` : ''}`}>{card.text}</div>
              </div>
              <img src={card.img} loading="lazy" alt="" className={`sch-img _${n}`} />
              <Noise className="cards" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
