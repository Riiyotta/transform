import '../../styles/white-section.css'
import TransitionPixels from '../TransitionPixels'
import Specialties from '../Specialties'
import Integrations from '../Integrations'
import { INTEGRATIONS_WHITE_TEXT, SPECIALTY_WHITE_BOTTOM } from '../../data/compare'

// White section — specs/compare.md §6: 6a black-to-white pixels (no .right-side-w-line on
// this page; hidden in page-compare.css), 6b `div.specialty-white` (heading + WHITE variant
// of the homepage Specialties), 6c WHITE variant of the homepage Integrations.
// Keep data-section="white-section": the navbar's M4 on-white observer queries it.
export default function CompareWhiteSection() {
  return (
    <section className="white-section" data-section="white-section" data-variant="compare">
      {/* MOTION: M8a — pixel transition (owned by TransitionPixels). */}
      <TransitionPixels variant="black-to-white" railLine={false} />

      <div className="specialty-white" data-section="specialty-white">
        <div className="sp-wh-top">
          <div className="sp-top-left" />
          <div className="sp-top-right">
            <div className="text-16 sp-label">Specialty-specific workflows</div>
            <h2 className="h1-text sp-wh">Built for Specialty Practices</h2>
          </div>
        </div>
        {/* MOTION: M20 — hover = click, instant pane swap (Specialties component). */}
        <Specialties variant="white" bottomText={SPECIALTY_WHITE_BOTTOM} />
      </div>

      {/* MOTION: M2a/M2b marquees (same classes); CMP-M3 block hover (bg #fff -> #a2fa8e). */}
      <Integrations variant="white" text={INTEGRATIONS_WHITE_TEXT} />
    </section>
  )
}
