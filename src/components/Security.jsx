import '../styles/security.css'
import { useLayoutEffect, useRef } from 'react'
import { SECURITY_ROWS } from '../data/security'
import { bindBlockHover } from './ui/ixMotion'

// Security — CLONE_SPEC §14 (`section.secure-section#security`).
// MOTION: M14 — `.secure-block` hover: bg -> #fff (200ms ease-out), logo swap white/black
// (0ms). The hover END state is applied instantly by CSS :hover; Animation owns the tween.
export default function Security() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!ref.current) return undefined
    return bindBlockHover(ref.current.querySelectorAll('.secure-block'), '.secure-logo.white', '.secure-logo.black')
  }, [])
  return (
    <section ref={ref} id="security" className="secure-section" data-section="security">
      <div className="left-side security" />
      <div className="right-side security">
        <div className="secure-right-top-wrap">
          <h2 className="secure-head">
            Secure. Compliant. <span className="secure-head-span">Trusted.</span>
          </h2>
          <div className="label-16 secure-text">
            We meet the highest standards of HIPAA compliance in healthcare data protection—so your patient information
            stays safe, secure, and compliant.
          </div>
        </div>

        <div className="secure-right-bottom-wrap">
          {SECURITY_ROWS.map((row, r) => (
            <div key={r} className={`security-row-of-2${row.variant ? ` ${row.variant}` : ''}`}>
              {row.cells.map((cell, c) => (
                <div
                  key={c}
                  className={`secure-block${cell.variant ? ` ${cell.variant}` : ''}`}
                  data-component="secure-block"
                >
                  {!cell.empty && (
                    <>
                      <img
                        src={cell.white}
                        loading="lazy"
                        alt={cell.alt}
                        className={`secure-logo white${cell.sm ? ' sm' : ''}`}
                      />
                      <img src={cell.black} loading="lazy" alt="" className={`secure-logo black${cell.sm ? ' sm' : ''}`} />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
