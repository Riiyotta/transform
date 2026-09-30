import { PRIVACY_ROWS } from '../../data/compare'

// "Privacy & Security" — specs/compare.md §7 (`section.privacy-section`).
// Rail = privacy-green.avif image panel (background set in page-compare.css).
// MOTION: CMP-M2 — .privacy-block hover: bg transparent -> #fff, head #fff -> #020801,
//   text rgba(255,255,255,.5) -> #020801 (200ms ease-out; out reverses). The END state is
//   static :hover CSS in page-compare.css; Animation owns the tween.
export default function PrivacySection() {
  return (
    <section className="privacy-section" data-section="privacy">
      <div className="privacy-top">
        <h2 className="h1-text privacy">
          <span className="privacy-span">Privacy &amp; Security</span>
        </h2>
      </div>
      <div className="privacy-bottom">
        <div className="privacy-left" />
        <div className="privacy-right">
          {PRIVACY_ROWS.map((row, r) => (
            <div key={r} className={`privacy-row${r === 1 ? ' _2' : ''}`}>
              {row.map((b) => (
                <div key={b.head} className="privacy-block" data-component="privacy-block">
                  <div className="text-30 white privacy-head">{b.head}</div>
                  <div className={`text-16 privacy-text${b.long ? ' long' : ''}`}>{b.text}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
