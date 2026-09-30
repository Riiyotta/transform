import { ACCESS_BLOCKS } from '../../data/compare'

// "Built for Real Patient Access" — specs/compare.md §5 (`section.access-section`).
// The H2 is 5vw at EVERY width (19.5px @390) — live behaviour, reproduced on purpose.
export default function AccessSection() {
  return (
    <section className="access-section" data-section="access">
      <div className="access-left" />
      <div className="access-right">
        <div className="access-right-top">
          <div className="text-16 half-white access-top-label">No Guessing. Only Defined Workflows.</div>
          <h2 className="h1-text access">
            Built for Real <span className="access-span">Patient Access</span>
          </h2>
        </div>
        <div className="access-right-bottom">
          {ACCESS_BLOCKS.map((b, i) => (
            <div key={b.head} className={`access-block${i === 1 ? ' _2nd' : ''}`}>
              <p className="text-30 white access-block-head">{b.head}</p>
              <div className={`text-16 half-white access-block-text${i === 1 ? ' _2' : ''}`}>{b.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
