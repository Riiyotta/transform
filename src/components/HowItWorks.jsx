import '../styles/how-it-works.css'

const WORDS = ['Speaks', 'Schedules', 'Supports Patients']

// How It Works — CLONE_SPEC §9.
// `activeIndex` (0 | 1 | 2) selects the green word and the "AI that" offset
// (0 / 12vw / 24vw). Default 0 = the measured initial state ("Speaks" green).
// MOTION: M7 — scroll-stepped highlight: each `.hiw-trigger._1/_2/.space` crossing
//   "bottom center" / "bottom top" steps `activeIndex` (0.25s; y power1.inOut,
//   colour power1.in). The `.hiw-trigger` divs are the ScrollTrigger targets.
export default function HowItWorks({ activeIndex = 0 }) {
  return (
    <section className="how-it-works" data-section="how-it-works" data-active={activeIndex}>
      <div className="how-works-right top" />
      <div className="how-works-sticky-cont">
        <div className="how-works-sticky">
          <div className="how-works-right-text top">
            <div className="label-16">How It Works</div>
          </div>
          <div className="how-works-heads-wrap" data-component="hiw-words">
            <div className="hiw-left-wrap">
              {/* MOTION: M7 — translateY 0 -> 12vw -> 24vw (data-active on the section). */}
              <div className="hiw-text-block left">
                <div className="hiw-text left">AI that</div>
              </div>
              <div className="hiw-text-block left-mob">
                <div className="hiw-text left">AI that</div>
              </div>
            </div>
            <div className="hiw-right-wrap">
              {WORDS.map((word, i) => (
                <div key={word} className={`hiw-text-block${i === WORDS.length - 1 ? ' last' : ''}`}>
                  <div className={`hiw-text _${i + 1}${i === activeIndex ? ' is-active' : ''}`} data-index={i}>
                    {word}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-works-right medium" />
        </div>
        <div className="hiw-triggers" aria-hidden="true">
          {['_1', '_2', '_3', 'space'].map((t) => (
            <div key={t} className={`hiw-trigger ${t}`}>
              <div className="how-works-right full" />
            </div>
          ))}
        </div>
      </div>
      <div className="how-works-right-text bottom-w-text">
        <div className="label-16 hiw-bottom">
          Built specifically for high-volume medical practices, our platform streamlines operations, enhances patient
          access, and drives revenue growth.
        </div>
      </div>
      <div className="how-works-right-text bottom" />
    </section>
  )
}
