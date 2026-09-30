import { ASSETS } from '../data/assets'
import { useSite } from './ui/SiteContext'
import Noise from './ui/Noise'
import UnderlinePair from './ui/UnderlinePair'

// "Call Alex" popup — CLONE_SPEC §16. Styles: "CALL ALEX" POPUP block in src/index.css.
// States: default · native `required`/email validation · success (w-form-done) ·
// error (w-form-fail). NO network submission: the original POST (hubspotonwebflow) and
// the AWS webhook fetch are intentionally not reproduced; a valid submit shows success.
// reCAPTCHA is stripped (an empty .captcha-popup box keeps its 304x78 footprint).
// MOTION: M11 (open, 0.5s expo.out fade) / M11b (close) — rendered instantly here.

function Field({ id, name, dataName, label, placeholder, type, value, onChange, autoFocus }) {
  return (
    <div className="input-wrap">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        className="form-input"
        maxLength={256}
        name={name}
        data-name={dataName}
        placeholder={placeholder}
        type={type}
        id={id}
        required
        autoFocus={autoFocus}
        {...(onChange ? { value, onChange } : {})}
      />
    </div>
  )
}

export default function CallAlexModal() {
  const { popupOpen, closePopup, popupState, setPopupState, phone, setPhone } = useSite()

  const onClose = (e) => {
    e.preventDefault()
    closePopup()
  }

  const onSubmit = (e) => {
    // Reached only when native validation passes. No fetch — show the success state.
    e.preventDefault()
    setPopupState('success')
  }

  const isSuccess = popupState === 'success'
  const isError = popupState === 'error'

  return (
    <div
      className={`modal-wrap${popupOpen ? ' is-open' : ''}`}
      data-component="call-alex-modal"
      data-state={popupState}
      role="dialog"
      aria-modal="true"
      aria-label="Get a Call Form"
      aria-hidden={popupOpen ? undefined : 'true'}
    >
      <div className="modal-overlay" onClick={closePopup} />
      <div className="modal-window">
        <div className="popup-top">
          <img src={ASSETS.logoWhite} loading="lazy" alt="transform9 logo" className="logo-white popup" />
        </div>

        <div className="call-form-block">
          {!isSuccess && (
            <form
              id="wf-form-Get-a-Call-Form"
              name="wf-form-Get-a-Call-Form"
              data-name="Get a Call Form"
              className="call-form"
              aria-label="Get a Call Form"
              onSubmit={onSubmit}
            >
              <div className="call-form-head-wrap">
                <div className="popup-head call-me">
                  A few details <span className="text-span-8">before AI calls</span>
                </div>
              </div>
              <div className="call-form-bottom">
                <div className="inputs">
                  <div className="form-row">
                    <Field id="First-Name" name="First-Name" dataName="First Name" label="First Name" placeholder="John" type="text" autoFocus />
                    <Field id="Last-Name" name="Last-Name" dataName="Last Name" label="Last Name" placeholder="Smith" type="text" />
                  </div>
                  <div className="form-row">
                    <Field
                      id="input-popup-phone"
                      name="Phone"
                      dataName="Phone"
                      label="Phone Number"
                      placeholder="1234567890"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Field id="Email" name="Email" dataName="Email" label="Email" placeholder="john.smith@company.com" type="email" />
                  </div>
                </div>
                <div className="popup-disc">
                  By continuing, you agree to our{' '}
                  <a href="/terms-of-use" className="links-legal">
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="/privacy-policy" className="links-legal">
                    Privacy Policy
                  </a>
                </div>
              </div>
              {/* Sibling of .call-form-bottom (not a child), as on the original: at <=767
                  .call-form-bottom is a 16px-gap flex column and nesting adds that gap. */}
              <div className="popup-bottom-wrap">
                <div className="captcha-popup" aria-hidden="true" />
                <div className="submit-form-wrap has-underline">
                  <input type="submit" value="Call Me Now" data-wait="Please wait..." className="submit-form call-me" />
                  <UnderlinePair />
                </div>
              </div>
            </form>
          )}

          {isSuccess && (
            <div className="success-popup-call-wrap" tabIndex={-1} role="region" aria-label="Get a Call Form success">
              <div className="success-call-cont">
                <div className="call-form-head-wrap success">
                  <div className="popup-head">
                    AI Agent <span className="text-span-8">is calling you...</span>
                  </div>
                </div>
                <div className="label-16">You can close this window</div>
              </div>
            </div>
          )}

          {isError && (
            <div className="error-message popup" tabIndex={-1} role="region" aria-label="Get a Call Form failure">
              <div className="error-text">Oops! Something went wrong while submitting the form.</div>
            </div>
          )}
        </div>

        {/* MOTION: M16 — close hover (250ms outQuad); static end state in CSS. */}
        <a href="#" className="close-popup-wrap" aria-label="Close" onClick={onClose}>
          <img src={ASSETS.closeWhite28} loading="lazy" alt="close icon" className="close-icon white" />
          <img src={ASSETS.closeBlack28} loading="lazy" alt="" className="close-icon black" />
        </a>
        <Noise className="popup-noise" />
      </div>
    </div>
  )
}
