import UnderlinePair from './UnderlinePair'
import { useSite } from './SiteContext'

// `a.hero-cta-link.get-a-call` — "Call Alex" (hero + CTA section). Opens the popup (§16).
// `textClassName` lets the CTA section pass its own text class (original: `.footer-cta`).
export default function CallAlexLink({ textClassName = 'hero-cta' }) {
  const { openPopup } = useSite()
  const onClick = (e) => {
    e.preventDefault()
    openPopup() // MOTION: M11 (popup fade-in) — owned by Animation.
  }
  return (
    <a href="#" className="hero-cta-link get-a-call has-underline" data-component="call-alex-link" onClick={onClick}>
      <UnderlinePair />
      <div className={`text-56 ${textClassName}`}>Call Alex</div>
    </a>
  )
}
