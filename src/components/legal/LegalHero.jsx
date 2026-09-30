// Legal hero — specs/legal.md §3. `section.hero.hide-on-scroll` (+ `.legal-hero` scope class).
// Reuses the homepage hero primitives (.hero-heading = .white-text.hero-home, .label-16,
// .home-hero-text, .hero-home-bottom, .hero-bottom-block, .line-hor); legal overrides live in
// src/styles/page-legal.css. No `.line-vert` and no `.bg-circle` (display:none on live).
// `data-section="hero"` is the trigger for the M3b video fade in PageLayers.
// MOTION: M3b — .bg-pixels-wrapper fades after 10% hero scroll (IX3 i-37f61121, shell).
export default function LegalHero({ h1, intro, introVariant }) {
  return (
    <section className="hero hide-on-scroll legal-hero" data-section="hero">
      <h1 className="hero-heading legal">{h1}</h1>
      <div className="hero-home-bottom legal">
        {/* MOTION: LGL-M1 — opacity 0 -> 1, 1.2s expo.out at +.6s (IX3 i-eccee64b). Static final state here. */}
        <div className="hero-bottom-block full-width">
          <div className="label-16">About Page</div>
          <p className={`home-hero-text legal-${introVariant}`}>{intro}</p>
        </div>
        {/* MOTION: LGL-M1 — width 0 -> 100%, 1.0s expo.out at +.6s. Static final state (100%) here. */}
        <div className="line-hor on-hero" />
      </div>
    </section>
  )
}
