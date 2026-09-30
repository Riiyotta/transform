import '../styles/outreach-agent.css'
import { OUTREACH_CARDS } from '../data/outreachCards'

// Outreach Agent #4 — CLONE_SPEC §10e (`div.split-cards-section`, inside the white section).
// Sticky left column + a column of sticky cards. The stacked-deck look is pure CSS in the
// original (sticky `top` + fixed per-card translateY offsets); there is no scripted motion
// for this section in §18. A transparent `.out-card.space` spacer closes the deck (hidden ≤991).
export default function OutreachAgent() {
  return (
    <div className="split-cards-section" data-section="outreach-agent">
      <div className="split-cards-left-wrap">
        <div className="half-head-text-wrap out-agent">
          <h2 className="agent-head">
            Outreach
            <br />
            Agent
          </h2>
          <div className="agent-num">#4</div>
        </div>
        <div className="out-left-bottom">Proactive Patient Engagement &amp; Follow-Ups</div>
      </div>

      <div className="split-cards-right-wrap">
        {OUTREACH_CARDS.map((card) => (
          <div key={card.index} className={`out-card ${card.variant}`} data-component="out-card">
            <div className="out-card-top-wrap">
              <div className="out-card-title">{card.title}</div>
              <div className="label-16 blue-card">{card.index}</div>
            </div>
            <div className="label-16 out-card-text-bottom">{card.text}</div>
            <img src={card.icon} loading="lazy" alt="" className="out-icon" />
          </div>
        ))}
        <div className="out-card space" aria-hidden="true" />
      </div>
    </div>
  )
}
