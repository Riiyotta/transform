import { COMPARE_HERO } from '../../data/compare'
import BookLiveDemoLink from './BookLiveDemoLink'

// Hero — specs/compare.md §2. The homepage hero (CLONE_SPEC §4, HERO block in index.css)
// with compare modifiers: h1 `.compare` (max 20ch at every width), right block
// `.comparison-hero` (no form; "Book a Live Demo" link bottom-right).
// Keep data-section="hero": PageLayers' M3 video fade triggers on it.
// MOTION: CMP-M1 — load intro: .hero-bottom-block.left opacity 0->1 (1.2s expo.out, pos .6),
//   .line-hor.on-hero width 0->100% (1s expo.out, pos .6), .hero-bottom-block.right
//   opacity 0->1 (1.2s expo.out, pos 1.1), .line-vert height 0->100% (1s expo.out, pos 1.1).
export default function CompareHero() {
  return (
    <section className="hero home" data-section="hero">
      <h1 className="hero-heading compare">
        <span className="compare-span-1">Compare</span> Our Solutions | Find Your Best Fit
      </h1>

      <div className="hero-home-bottom">
        {/* MOTION: CMP-M1 (left block fade, pos .6) */}
        <div className="hero-bottom-block left">
          <div className="label-16">{COMPARE_HERO.label}</div>
          <p className="home-hero-text">{COMPARE_HERO.text}</p>
          {/* MOTION: CMP-M1 (.line-vert height 0 -> 100%, pos 1.1) */}
          <div className="line-vert on-hero" />
        </div>

        {/* MOTION: CMP-M1 (right block fade, pos 1.1) */}
        <div className="hero-bottom-block right comparison-hero">
          <div className="label-16 full-width">{COMPARE_HERO.ctaLabel}</div>
          <BookLiveDemoLink />
        </div>

        {/* MOTION: CMP-M1 (.line-hor.on-hero width 0 -> 100%, pos .6) */}
        <div className="line-hor on-hero" />
      </div>
    </section>
  )
}
