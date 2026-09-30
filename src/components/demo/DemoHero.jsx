import Noise from '../ui/Noise'
import DemoForm from './DemoForm'
import { DEMO_HEADING, DEMO_TEXT } from '../../data/bookDemo'

// /book-a-demo hero — specs/book-a-demo.md §2. `section.hero.hide-on-scroll.demo`
// (+ `.book-demo-hero` scope class). Left: green H1 + #e0e0e0 paragraph over the
// transparent background (the fixed video shows through). Right: black form column whose
// noise overlay is positioned and so paints ABOVE the (unpositioned) form, as on live.
// `data-section="hero"` is the M3b video-fade trigger used by PageLayers.
// MOTION: M3b — .bg-pixels-wrapper opacity -> 0 after 10% hero scroll (shell, IX3 i-37f61121).
// MOTION: BAD-M1 — load intro targets only the shell (.bg-pixels-wrapper, .nav-menu); the
// H1, paragraph and form have NO entrance animation.
export default function DemoHero() {
  return (
    <section className="hero hide-on-scroll demo book-demo-hero" data-section="hero">
      <div className="book-demo-left">
        <h1 className="hero-heading demo">
          {DEMO_HEADING[0]}
          <br />
          {DEMO_HEADING[1]}
        </h1>
        <div className="text-block-5">
          {DEMO_TEXT}
          <br />
        </div>
      </div>
      <div className="book-demo-right">
        <Noise className="book-demo-form-noise" />
        <DemoForm />
      </div>
    </section>
  )
}
