import '../styles/motion-interactions.css'
import { CLIENT_LOGOS } from '../data/clientLogos'

// Client logo marquee — CLONE_SPEC §5. Two identical tracks side by side.
// MOTION: M1 — `.logos-wrapper` x2: translateX 0 -> -100% (44.99s linear, infinite),
// a CSS keyframe in src/styles/motion-interactions.css (imported here).
export default function ClientLogos() {
  return (
    <div className="div-block-3" data-section="client-logos">
      <section className="client-logos">
        {[0, 1].map((track) => (
          <div className="logos-wrapper" key={track} aria-hidden={track === 1 ? 'true' : undefined}>
            {CLIENT_LOGOS.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={track === 1 ? '' : logo.alt}
                loading="lazy"
                className={`client-logo${logo.sbj ? ' sbj' : ''}`}
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}
