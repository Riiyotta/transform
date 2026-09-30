import { useState } from 'react'
import { ASSETS } from '../data/assets'
import {
  FOOTER_BLURB,
  FOOTER_COLUMNS,
  FOOTER_CONTACT,
  FOOTER_COPYRIGHT,
  FOOTER_LEGAL,
  FOOTER_TOP_RIGHT,
} from '../data/footer'
import Noise from './ui/Noise'
import UnderlinePair from './ui/UnderlinePair'

// Footer — CLONE_SPEC §17. Two parts:
//   <FooterTop>    section.footer — last block INSIDE .page-wrap
//   <FooterBottom> .footer-bottom-wrap — sticky reveal OUTSIDE .page-wrap (z 1 < 2)
// Styles: FOOTER block in src/index.css.

function linkProps(link) {
  return link.target ? { href: link.href, target: link.target } : { href: link.href }
}

// `.footer-link-wrap` with the small underline pair. MOTION: M12b (desktop hover).
function FooterLink({ link }) {
  return (
    <a {...linkProps(link)} aria-current={link.current ? 'page' : undefined} className="footer-link-wrap" data-component="footer-link">
      <div className="footer-link">{link.label}</div>
      <div className="underline-small _1" />
      <div className="underline-small _2" />
    </a>
  )
}

// Zero-height replaced element that mimics the HubSpot iframe's 300px intrinsic width.
function HsSizer() {
  return <svg className="hs-embed__sizer" width="300" height="0" aria-hidden="true" focusable="false" />
}

// Static replica of the HubSpot embedded form (portal 48695808, form f337fd1d…),
// measured styles only. No script, no iframe, no submission. Client-side validation:
// empty / malformed email -> HubSpot error styling with the browser's validation
// message; valid -> success message.
function HubSpotForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const input = e.currentTarget.elements.email
    if (!input.checkValidity()) {
      setError(input.validationMessage)
      return
    }
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <div className="hs-embed" data-component="hubspot-form" data-state="success">
        <HsSizer />
        {/* SPEC GAP: HubSpot success copy was not measured (CLONE_SPEC §21.5). */}
        <div className="hs-success">Thanks for submitting the form.</div>
      </div>
    )
  }

  return (
    <div className="hs-embed" data-component="hubspot-form" data-state={error ? 'error' : 'default'}>
      <HsSizer />
      <form className="hs-form" noValidate onSubmit={onSubmit}>
        <div className={`hs-field${error ? ' error' : ''}`}>
          <label htmlFor="footer-hs-email">
            <span>Email</span>
            <span className="hs-form-required">*</span>
          </label>
          <div className="input">
            <input
              id="footer-hs-email"
              name="email"
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              className={`hs-input${error ? ' error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <ul className="hs-error-msgs" role="alert">
              <li>
                <label htmlFor="footer-hs-email">{error}</label>
              </li>
            </ul>
          )}
        </div>
        <div className="hs-submit">
          <div className="actions">
            <input type="submit" className="hs-button primary large" value="Submit" />
          </div>
        </div>
      </form>
    </div>
  )
}

export function FooterTop() {
  return (
    <section className="footer section" data-section="footer">
      <div className="footer-top-wrap">
        <Noise />
        <div className="footer-top-row">
          <div className="footer-top-left">
            <div className="footer-transp left">{FOOTER_BLURB}</div>
          </div>
          <div className="footer-top-right-side">
            <div className="footer-columns-wrap">
              {FOOTER_COLUMNS.map((col) => (
                <div className="footer-column" key={col.title}>
                  <div className="footer-transp">{col.title}</div>
                  <div className="footer-column-links">
                    {col.links.map((link) => (
                      <FooterLink link={link} key={link.label} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="footer-top-right">
              {FOOTER_TOP_RIGHT.map((link) => (
                <FooterLink link={link} key={link.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="footer-subs-wrap">
          <div className="subs-lefr-wrap">
            {/* The original's hidden "Call Us" block (.left-side.footer-subs.hide) is not rendered. */}
            <div className="footer-bottom-center">
              <div className="footer-transp">Contact Us</div>
              <a href={FOOTER_CONTACT.href} className="w-underline-link has-underline">
                <div className="text-block-4">{FOOTER_CONTACT.phone}</div>
                <div>{FOOTER_CONTACT.email}</div>
                <UnderlinePair />
              </a>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-transp">Stay Updated</div>
            <HubSpotForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export function FooterBottom() {
  return (
    <div className="footer-bottom-wrap" data-section="footer-bottom">
      <div className="footer-logo-wrap">
        <img src={ASSETS.logoFooter} loading="lazy" alt="" className="footer-logo" />
      </div>
      <div className="footer-bottom-row">
        <div className="footer-transp bottom">{FOOTER_COPYRIGHT}</div>
        <div className="footer-bottom-row-right">
          {FOOTER_LEGAL.map((link) => (
            <a key={link.label} href={link.href} className="footer-transp bottom-links">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
