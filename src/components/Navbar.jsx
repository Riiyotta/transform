import { useCallback, useEffect, useState } from 'react'
import { ASSETS } from '../data/assets'
import { NAV_CTA, NAV_LEFT, NAV_LOGIN } from '../data/nav'
import Noise from './ui/Noise'

// Navbar + mobile menu — CLONE_SPEC §3. Styles: NAVBAR block in src/index.css.
// There are no dropdowns or mega-menu on the original.

const DESKTOP_QUERY = '(min-width: 992px)'

// Rolling hover text: visible copy + white copy parked 100% below (desktop only).
// MOTION: M15 — hover roll 250ms outQuad (static end state is in CSS).
function RollText({ children }) {
  return (
    <div className="nav-text-wrap">
      <div className="nav-text">{children}</div>
      <div className="nav-text hiden" aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

function linkProps(link) {
  return link.target ? { href: link.href, target: link.target } : { href: link.href }
}

// M4 trigger: `.white-section` from "top 60" to "bottom 60" — i.e. while the white
// section intersects the 1px line at y = 60 (bottom edge of the nav).
// TODO(Animation): replace with the ScrollTrigger-driven tween (M4, 0.05s power2.out);
// this observer only toggles the class so the static on-white state can be audited.
function useOnWhite() {
  const [onWhite, setOnWhite] = useState(false)
  useEffect(() => {
    const target = document.querySelector('[data-section="white-section"]')
    if (!target || !('IntersectionObserver' in window)) return undefined
    let io
    const observe = () => {
      if (io) io.disconnect()
      const navH = 60
      const bottom = Math.max(0, window.innerHeight - navH - 1)
      io = new IntersectionObserver(([entry]) => setOnWhite(entry.isIntersecting), {
        rootMargin: `-${navH}px 0px -${bottom}px 0px`,
      })
      io.observe(target)
    }
    observe()
    window.addEventListener('resize', observe)
    return () => {
      window.removeEventListener('resize', observe)
      if (io) io.disconnect()
    }
  }, [])
  return onWhite
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const onWhite = useOnWhite()

  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Scroll lock while the menu is open (§2: html overflow hidden, body
  // overscroll-behavior none / touch-action none). Lenis stop is Animation's (M22).
  useEffect(() => {
    document.documentElement.classList.toggle('is-menu-open', open)
    return () => document.documentElement.classList.remove('is-menu-open')
  }, [open])

  // The collapsed menu only exists at <=991; close it if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onMenuKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  const classes = ['nav-menu', 'w-nav']
  if (onWhite) classes.push('is-on-white')
  if (open) classes.push('is-open')

  return (
    <div className={classes.join(' ')} id="book-demo-btn" role="banner" data-component="navbar">
      <div className="nav-container">
        <a href="/" aria-current="page" className="logo-wrap">
          <img src={ASSETS.logoWhite} alt="transform9 logo" className="logo-white" width="130" height="38" loading="eager" />
          <img src={ASSETS.logoBlack} alt="transform9 logo" className="logo-black" width="130" height="38" loading="eager" />
        </a>

        <nav className="nav-links" id="nav-menu-links" data-component="mobile-menu">
          <div className="nav-links-cont">
            <div className="nav-links-left">
              {NAV_LEFT.map((link, i) => (
                <a key={link.label} {...linkProps(link)} className={`nav-link-block${i === 0 ? ' _1st' : ''}`}>
                  <RollText>{link.label}</RollText>
                </a>
              ))}
            </div>
            <div className="nav-links-right">
              <a {...linkProps(NAV_LOGIN)} className="nav-link-block login">
                <RollText>{NAV_LOGIN.label}</RollText>
              </a>
              <a {...linkProps(NAV_CTA)} className="nav-link-block cta">
                <div className="nav-text-wrap">
                  <div className="cta">{NAV_CTA.label}</div>
                </div>
              </a>
            </div>
            <Noise className="nav-tabet" />
          </div>
        </nav>

        {/* <=767: "Book a Demo" in the bar itself */}
        <a {...linkProps(NAV_CTA)} className="nav-link-block cta mobil-top-cta">
          <div className="nav-text-wrap">
            <div className="cta">{NAV_CTA.label}</div>
          </div>
        </a>

        {/* <=991 burger. MOTION: M18 — icon/border transitions on open/close. */}
        <div
          className="menu-btn"
          role="button"
          tabIndex={0}
          aria-label="menu"
          aria-haspopup="menu"
          aria-controls="nav-menu-links"
          aria-expanded={open}
          onClick={toggle}
          onKeyDown={onMenuKey}
        >
          <div className="menu-btn-wrap">
            <img src={ASSETS.burgerWhite} alt="menu icon" className="burger-white" width="24" height="24" loading="eager" />
            <img src={ASSETS.crossWhite} alt="close icon" className="nav-cross-white" width="24" height="24" loading="eager" />
            <img src={ASSETS.burgerBlack} alt="" className="burger-black" width="24" height="24" loading="eager" />
          </div>
        </div>

        <div className="nav-border-on-white" />
      </div>
    </div>
  )
}
