import { useSite } from './ui/SiteContext'
import CallAlexLink from './ui/CallAlexLink'

// Hero — CLONE_SPEC §4. Styles: HERO block in src/index.css.
// Background is transparent; the fixed video from PageLayers shows through.
export default function Hero() {
  const { phone, setPhone } = useSite()

  // #email-form-1 has data-disable-enter="true" and is never submitted (§4, §16).
  const blockSubmit = (e) => e.preventDefault()
  const blockEnter = (e) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <section className="hero home" data-section="hero">
      <h1 className="hero-heading">
        Maximize Every <span className="head-span-1">Call </span>
        <span className="head-span-2">with a&nbsp;</span>
        <span className="head-span-3">Custom AI Agent</span>
      </h1>

      <div className="hero-home-bottom">
        <div className="hero-bottom-block left">
          <div className="label-16">Who We Are:</div>
          <p className="home-hero-text">
            Uniquely built AI voice agents for specialty physician practices that eliminate hold times, reduce call
            center costs, and fill physician schedules 24/7
          </p>
          <div className="line-vert on-hero" />
        </div>

        <div className="hero-bottom-block right">
          <div className="label-16">Test Our AI Agent</div>
          <div className="hero-home-input-row">
            <div className="home-hero-form">
              <form
                id="email-form-1"
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
                    id="input-main-phone"
                    aria-label="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <CallAlexLink />
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

        <div className="line-hor on-hero" />
      </div>
    </section>
  )
}
