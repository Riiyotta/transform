// Case-study data-driven variant (specs/case-studies.md §3.3, §4.2, §7): render the
// highlight text if non-null, otherwise the 2-stat block. The unused element is omitted
// (not hidden), as in the live server HTML.
//   Highlight: `._16px-text.white-text.highlight-text-alt[.post-page]`, white-space pre-wrap
//              (the CMS "\n" is preserved).
//   Stats:     `.testim-bottom-cont.blog[.open-page].cs` > 2 × `.testim-point-wrap.blog.cs`.
export default function CaseVariant({ highlight, stats, postPage = false }) {
  if (highlight) {
    return (
      <div className={`label-16 highlight-text-alt${postPage ? ' post-page' : ''}`} data-component="cs-highlight">
        {highlight}
      </div>
    )
  }
  return (
    <div className={`testim-bottom-cont blog${postPage ? ' open-page' : ''} cs`} data-component="cs-stats">
      {stats.map((s) => (
        <div key={s.value} className="testim-point-wrap blog cs">
          <div className="testim-num cs">{s.value}</div>
          <div className="label-16 blog-point cs">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
