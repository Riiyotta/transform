import { COMPARE_ASSETS, COMPARE_ROWS, TABLE_BOTTOM_TEXT } from '../../data/compare'
import BookLiveDemoLink from './BookLiveDemoLink'

// Comparison table — specs/compare.md §4 (`section.table-section`). Static div table:
// no hover, no sort. Only the Transform9 column (.right-cell.t9) is tinted.
// At <=767 the header row (.table-row.head) is sticky under the nav (top 60, blur 80).
// MOTION: CMP-M5 — the sticky header is plain CSS position:sticky (not animated).
export default function ComparisonTable() {
  return (
    <section className="table-section" data-section="comparison-table">
      <div className="table-top-wrap">
        <h2 className="h1-text table-head">
          How Transform9 <span className="table-span">Compares</span>
        </h2>
      </div>

      <div className="table-wrap" data-component="comparison-table" role="table" aria-label="How Transform9 compares">
        <div className="table-row head" role="row">
          <div className="table-cell left-cell head-left" role="columnheader" />
          <div className="table-right">
            <div className="table-cell right-cell head" role="columnheader">
              <img src={COMPARE_ASSETS.logoTable} loading="lazy" alt="transform9 logo" className="logo-table" />
            </div>
            <div className="table-cell right-cell head" role="columnheader">
              <p className="text-30 white table-head">Other AI Agents</p>
            </div>
          </div>
        </div>

        {COMPARE_ROWS.map(([label, t9, other]) => (
          <div key={label} className="table-row" role="row">
            <div className="table-cell left-cell" role="rowheader">
              <div className="text-16 half-white table-text">{label}</div>
            </div>
            <div className="table-right">
              <div className="table-cell right-cell t9" role="cell">
                <img src={COMPARE_ASSETS.tick} loading="lazy" alt="" className="tick-img" />
                <div className="label-16 table-text">{t9}</div>
              </div>
              <div className="table-cell right-cell" role="cell">
                <div className="text-16 half-white table-text">{other}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-bottom">
        <div className="table-bottom-left">
          <div className="text-16 half-white table-bottom-left-text">{TABLE_BOTTOM_TEXT}</div>
        </div>
        <div className="table-bottom-right">
          <BookLiveDemoLink />
        </div>
      </div>
    </section>
  )
}
