import { useRef } from 'react'
import '../styles/cta.css'
import { createPixelTransition } from '../motion/pixelTransition'
import { useGsapContext } from '../motion/useGsapContext'
import { useSite } from './ui/SiteContext'
import CallAlexLink from './ui/CallAlexLink'
import UnderlinePair from './ui/UnderlinePair'
import Noise from './ui/Noise'
import { CTA_AGENTS } from '../data/cta'

// Pixel grid of `.transition-cont.black-to-img`: 5 rows (`_5` top … `_1` bottom) × 20 pixels;
// pixels 11–20 carry `.mob-hide` (hidden ≤767). The mix layer alternates blue/green per row.
const ROWS = [5, 4, 3, 2, 1]
const COLS = Array.from({ length: 20 }, (_, i) => i)
const mixColor = (row, col) => ((row % 2 === 1) === (col % 2 === 0) ? 'blue' : 'green')

// MOTION: M8c — scroll scrub (container "top bottom" -> "top -20%"): every `.pixel` in both
// layers opacity 1 -> 0; row _1 at t0, _2 .2, _3 .4, _4 .6, _5 .8; random x-stagger (amount 1).
// Rendered here at the SETTLED end state (all pixels opacity 0, see cta.css); the GSAP
// timeline (src/motion/pixelTransition.js, measured IX3 i-967dd2ef values) sets opacity 1
// on mount (immediateRender) and scrubs each pixel to 0.
function BlackToImg() {
  const ref = useRef(null)
  useGsapContext(ref, (el) => createPixelTransition(el, { from: 1, to: 0 }))
  return (
    <div ref={ref} className="transition-cont black-to-img" data-component="transition-black-to-img" aria-hidden="true">
      <div className="transition-wrap black">
        {ROWS.map((row) => (
          <div key={row} className={`grid-row _${row} b-i`}>
            {COLS.map((col) => (
              <div key={col} className={`pixel black${col >= 10 ? ' mob-hide' : ''}`} />
            ))}
          </div>
        ))}
        <Noise />
      </div>
      <div className="transition-wrap mix">
        {ROWS.map((row) => (
          <div key={row} className={`grid-row _${row} b-i`}>
            {COLS.map((col) => (
              <div key={col} className={`pixel ${mixColor(row, col)}${col >= 10 ? ' mob-hide' : ''}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// CTA — CLONE_SPEC §15 (`section.cta-section`). The bottom row reuses the hero's
// `.hero-home-bottom` component; #input-footer-phone is value-synced via SiteContext.
export default function Cta() {
  const { phone, setPhone } = useSite()

  // The form has data-disable-enter="true" and is never submitted (§4, §16).
  const blockSubmit = (e) => e.preventDefault()
  const blockEnter = (e) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <section className="cta-section" data-section="cta">
      <BlackToImg />

      <div className="cta-content-wrap">
        <Noise />
        <div className="cta-top-wrap">
          <div className="cta-text-top-wrap">
            <div className="cta-top-text-left">
              <div className="label-16">AI Agents</div>
              <div className="cta-top-text-list">
                {CTA_AGENTS.map((a) => (
                  <div key={a} className="label-16">
                    {a}
                  </div>
                ))}
              </div>
            </div>
            <div className="cta-top-text-right">
              <div className="label-16">Quick Start</div>
              <div className="label-16">Live in 60 Days</div>
            </div>
          </div>
          <h2 className="cta-heading">
            Skip the Hold Music. <span className="cta-head-span">Forever.</span>
          </h2>
        </div>

        <div className="hero-home-bottom">
          <div className="hero-bottom-block bottom-left">
            <div className="label-16">Test Our AI Agent</div>
            <div className="hero-home-input-row">
              <div className="home-hero-form">
                <form
                  id="email-form"
                  name="email-form"
                  data-name="Email Form"
                  className="hero-home-input-row"
                  data-disable-enter="true"
                  onSubmit={blockSubmit}
                  onKeyDown={blockEnter}
                >
                  <div className="input-hero-wrap">
                    <input
                      className="input-white"
                      maxLength={256}
                      name="Phone"
                      data-name="Phone"
                      placeholder="Your phone number"
                      type="tel"
                      id="input-footer-phone"
                      aria-label="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <CallAlexLink textClassName="footer-cta" />
                  </div>
                </form>
                <div className="w-form-done" tabIndex={-1} role="region" aria-label="Email Form success">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail" tabIndex={-1} role="region" aria-label="Email Form failure">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-bottom-block bottom-right">
            <div className="bottom-cta-right">See It in Action</div>
            {/* MOTION: M12 — underline pair hover (shared, see index.css). */}
            <a href="/book-a-demo" className="hero-cta-link black has-underline" data-component="book-demo-link">
              <div className="text-56 footer-cta">Book a Demo</div>
              <UnderlinePair black />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
