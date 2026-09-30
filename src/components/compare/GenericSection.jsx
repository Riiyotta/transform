import { GENERIC_TEXT } from '../../data/compare'

// "Not Generic" — specs/compare.md §3 (`section.generic-section`).
// Rail = call-blue.avif image panel (background set in page-compare.css).
// "Why Transform9" sits absolutely above the section's top hairline (bottom:100%) at >=768.
export default function GenericSection() {
  return (
    <section className="generic-section" data-section="generic">
      <div className="left-side generic" />
      <div className="right-side generic">
        <div className="label-16 why-text">Why Transform9</div>
        <div className="gen-text-wrap">
          <h2 className="h1-text generic">
            <span className="generic-span">Not Generic</span> Call Center AI
          </h2>
          <p className="text-30 white generic-text">{GENERIC_TEXT}</p>
        </div>
      </div>
    </section>
  )
}
