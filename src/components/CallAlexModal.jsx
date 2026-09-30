import { useLayoutEffect, useRef } from 'react'
import { ASSETS } from '../data/assets'
import { EASE, bindHover, clearInline, gsap, runGroups } from './ui/ixMotion'
import { useSite } from './ui/SiteContext'
import Noise from './ui/Noise'
import UnderlinePair from './ui/UnderlinePair'

// "Call Alex" popup — CLONE_SPEC §16. Styles: "CALL ALEX" POPUP block in src/index.css.
// States: default · native `required`/email validation · success (w-form-done) ·
// error (w-form-fail). NO network submission: the original POST (hubspotonwebflow) and
// the AWS webhook fetch are intentionally not reproduced; a valid submit shows success.
// reCAPTCHA is stripped (an empty .captcha-popup box keeps its 304x78 footprint).
// MOTION (measured on live, recon/motion-2/misc-live-*.json):
// M11  open (IX3 i-75f1d5f3): display none -> flex instantly, opacity fromTo 0 -> 1, 0.5s
//      expo.out (.68 at ~80ms).
// M11b close (IX3 i-138c644f, close button or overlay): opacity fromTo 1 -> 0, 0.5s
//      expo.out, display -> none at 0.5s. Each close click restarts it from opacity 1
//      (measured: an overlay click during the close fade jumps back to .8 at +16ms).
// M16  close button hover (IX2 a-38/a-39): bg -> #fff, white icon -> 0, black icon -> 1,
//      250ms outQuad; mouseleave reverses. First hover only: IX2 has no stored opacity for
//      the black icon and starts it from its default 1, so it appears at once (measured).
// ?popup=… (QA hook) opens instantly at opacity 1 on load.
// Focus: on open, focus moves to the dialog window; Escape closes; on close focus returns
// to the element that opened it.

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

  const wrapRef = useRef(null)
  const tlRef = useRef(null)
  const firstRef = useRef(true)
  const returnFocusRef = useRef(null)

  const play = (open) => {
    const el = wrapRef.current
    if (!el) return
    tlRef.current?.kill()
    if (open) {
      gsap.set(el, { display: 'flex', opacity: 0 })
      tlRef.current = gsap.to(el, { opacity: 1, duration: 0.5, ease: EASE.expoOut })
    } else {
      gsap.set(el, { opacity: 1 })
      tlRef.current = gsap
        .timeline()
        .to(el, { opacity: 0, duration: 0.5, ease: EASE.expoOut })
        .set(el, { display: 'none' }, 0.5)
    }
  }

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (firstRef.current) {
      firstRef.current = false
      gsap.set(el, { display: popupOpen ? 'flex' : 'none', opacity: popupOpen ? 1 : 0 })
      return
    }
    play(popupOpen)
    if (popupOpen) {
      returnFocusRef.current = document.activeElement
      el.querySelector('.modal-window')?.focus({ preventScroll: true })
    } else {
      const back = returnFocusRef.current
      returnFocusRef.current = null
      if (back && typeof back.focus === 'function' && el.contains(document.activeElement)) back.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupOpen])

  useLayoutEffect(() => {
    const el = wrapRef.current
    return () => {
      tlRef.current?.kill()
      firstRef.current = true
      if (el) clearInline([el], ['display', 'opacity'])
    }
  }, [])

  useLayoutEffect(() => {
    if (!popupOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && closePopup()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [popupOpen, closePopup])

  // M16 close-button hover.
  useLayoutEffect(() => {
    const btn = wrapRef.current?.querySelector('.close-popup-wrap')
    if (!btn) return undefined
    const white = btn.querySelector('.close-icon.white')
    const black = btn.querySelector('.close-icon.black')
    gsap.set(btn, { backgroundColor: getComputedStyle(btn).backgroundColor })
    gsap.set(white, { opacity: 1 })
    const v = { duration: 0.25, ease: EASE.outQuad }
    const off = bindHover(
      btn,
      () => {
        if (!black.style.opacity) gsap.set(black, { opacity: 1 }) // IX2 default-origin quirk
        runGroups([[[btn, { backgroundColor: 'rgba(255, 255, 255, 1)', ...v }], [white, { opacity: 0, ...v }], [black, { opacity: 1, ...v }]]])
      },
      () => runGroups([[[btn, { backgroundColor: 'rgba(255, 255, 255, 0)', ...v }], [white, { opacity: 1, ...v }], [black, { opacity: 0, ...v }]]]),
    )
    return () => {
      off()
      clearInline([btn], ['background-color'])
      clearInline([white, black], ['opacity'])
    }
  }, [])

  // A close click while already closing restarts the close fade (IX3 click: "each").
  const requestClose = () => {
    if (!popupOpen) play(false)
    closePopup()
  }

  const onClose = (e) => {
    e.preventDefault()
    requestClose()
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
      ref={wrapRef}
      className={`modal-wrap${popupOpen ? ' is-open' : ''}`}
      data-component="call-alex-modal"
      data-state={popupState}
      role="dialog"
      aria-modal="true"
      aria-label="Get a Call Form"
      aria-hidden={popupOpen ? undefined : 'true'}
    >
      <div className="modal-overlay" onClick={requestClose} />
      <div className="modal-window" tabIndex={-1}>
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
