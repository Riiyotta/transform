import '../styles/scheduling-agent.css'
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
// MOTION: M9 — scroll-scrubbed (scrub .5) deck: card 2 "top center" -> "bottom bottom 20%"
//   drives step 0->1, card 3 drives 1->2, card 4 ("bottom bottom") drives 2->3
//   (+ `.sch-img._3` opacity .2, 0.1s power1.out). Owned by Animation; it can tween the
//   same properties directly on `.scheduling-card._N` instead of using the prop.
export default function SchedulingAgent({ stackStep = 0 }) {
  return (
    <div
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
