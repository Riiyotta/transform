import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, IX2, ScrollTrigger } from '../motion/gsap'
import { getLenis } from '../motion/smoothScroll'
import { ASSETS } from '../data/assets'
import { NAV_CTA, NAV_LEFT, NAV_LOGIN } from '../data/nav'
import Noise from './ui/Noise'

// Navbar + mobile menu — CLONE_SPEC §3. Styles: NAVBAR block in src/index.css.
// There are no dropdowns or mega-menu on the original.

const DESKTOP_QUERY = '(min-width: 992px)'

// Rolling hover text: visible copy + white copy parked 100% below (desktop only).
// MOTION: M15 — hover roll 250ms outQuad (useNavRoll, GSAP inline like IX2).
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

// M4 — IX3 i-5ede2c9a (measured on live): trigger `.white-section`, start
// "clamp(top 60)", end "clamp(bottom 60)", toggleActions play/reverse/play/reverse on a
// paused timeline of 0.05s power2.out `to` tweens (force3D), as on live. The colour
// targets are the live hsla() strings: GSAP interpolates those in HSL space, which is what
// the original's in-between frames show. `onWhite` still
// toggles `.is-on-white` as the QA state hook; GSAP inline styles drive the values.
function useOnWhite(navRef) {
  const [onWhite, setOnWhite] = useState(false)
  useLayoutEffect(() => {
    const nav = navRef.current
    const target = document.querySelector('[data-section="white-section"]')
    if (!nav || !target) return undefined
    const ctx = gsap.context(() => {
      const D = { duration: 0.05, ease: 'power2.out', force3D: true }
      // `.is-on-white` (QA hook) is only committed from onComplete / onReverseComplete,
      // after the tweens have recorded their start values from the static CSS.
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => setOnWhite(true),
        onReverseComplete: () => setOnWhite(false),
      })
      const q = (sel) => nav.querySelectorAll(sel)
      tl.to(nav, { backgroundColor: 'hsla(0, 0.00%, 100.00%, 1.00)', ...D }, 0)
      tl.to(q('.nav-link-block'), { color: 'hsla(111.42857142857143, 77.78%, 1.76%, 1.00)', ...D }, 0)
      tl.to(q('.nav-text.hiden'), { color: 'hsla(205.8823529411765, 82.26%, 48.63%, 1.00)', ...D }, 0)
      tl.to(q('.logo-white'), { opacity: 0, ...D }, 0)
      tl.to(q('.burger-white'), { opacity: 0, ...D }, 0)
      tl.to(q('.logo-black'), { opacity: 1, ...D }, 0)
      tl.to(q('.burger-black'), { opacity: 1, ...D }, 0)
      tl.to(q('.nav-border-on-white'), { opacity: 1, ...D }, 0)
      ScrollTrigger.create({
        trigger: target,
        start: 'clamp(top 60)',
        end: 'clamp(bottom 60)',
        onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
      })
    })
    return () => ctx.revert()
  }, [navRef])
  return onWhite
}

// M18 — IX2 a-28 (open) / a-30 (close), measured values:
//   open : burgers display none (instant); `.nav-cross-white` opacity -> 1, 100ms after a
//          100ms delay, easeOut; `.menu-btn-wrap` border colour -> rgba(255,255,255,.2)
//          200ms easeOut; every `.nav-link-block` colour -> white 200ms easeOut.
//   close: border -> transparent 200ms easeOut; cross opacity -> 0 100ms easeOut; burgers
//          display back after 100ms.
// IX2 animates from the current values, so they are captured just before the toggle.
function captureMenuState(nav) {
  if (!nav) return null
  const cs = (el) => getComputedStyle(el)
  const wrap = nav.querySelector('.menu-btn-wrap')
  const cross = nav.querySelector('.nav-cross-white')
  return {
    border: cs(wrap).borderLeftColor,
    cross: cs(cross).opacity,
    links: [...nav.querySelectorAll('.nav-link-block')].map((el) => cs(el).color),
  }
}

// M15 — IX2 a-40 / a-41 (measured): on mouseover of a desktop nav link both `.nav-text`s
// translateY 0 -> -100% (-19.59px), 250ms outQuad; mouseout returns to 0 with the same
// timing, from wherever the roll currently is. Inline (like IX2) rather than a CSS
// transition, because the M4 tweens (force3D) also write inline transforms on
// `.nav-text.hiden`, which would override a stylesheet :hover transform.
function useNavRoll(navRef) {
  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return undefined
    const mq = window.matchMedia(DESKTOP_QUERY)
    const ctx = gsap.context(() => {})
    const offs = []
    nav.querySelectorAll('.nav-link-block').forEach((block) => {
      const texts = block.querySelectorAll('.nav-text')
      if (!texts.length) return
      ctx.add(() => gsap.set(texts, { y: 0 }))
      const roll = (y) => () => {
        if (!mq.matches) return
        ctx.add(() => gsap.to(texts, { y, duration: 0.25, ease: IX2.outQuad, overwrite: 'auto' }))
      }
      const enter = roll('-100%')
      const leave = roll('0%')
      block.addEventListener('mouseenter', enter)
      block.addEventListener('mouseleave', leave)
      offs.push(() => {
        block.removeEventListener('mouseenter', enter)
        block.removeEventListener('mouseleave', leave)
      })
    })
    return () => {
      offs.forEach((off) => off())
      ctx.revert()
    }
  }, [navRef])
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const onWhite = useOnWhite(navRef)
  useNavRoll(navRef)
  const captured = useRef(null)
  const menuTl = useRef(null)
  const prevOpen = useRef(false)

  const toggle = useCallback(() => {
    captured.current = captureMenuState(navRef.current)
    setOpen((v) => !v)
  }, [])

  // M18 icon/border/link-colour tweens + M22 Lenis stop/start + the menu-open flag that
  // Motion-2's tab autoplay (M10) reads: html[data-menu-open="true"|"false"].
  useLayoutEffect(() => {
    document.documentElement.dataset.menuOpen = String(open)
    const lenis = getLenis()
    if (lenis) {
      if (open) lenis.stop()
      else lenis.start()
    }
    const nav = navRef.current
    // Only animate real transitions (not the initial mount / StrictMode re-run).
    if (!nav || prevOpen.current === open) return undefined
    prevOpen.current = open
    const cap = captured.current || captureMenuState(nav)
    captured.current = null
    const wrap = nav.querySelector('.menu-btn-wrap')
    const cross = nav.querySelector('.nav-cross-white')
    const burgers = nav.querySelectorAll('.burger-white, .burger-black')
    const links = nav.querySelectorAll('.nav-link-block')
    if (menuTl.current) menuTl.current.kill()
    const ease = IX2.easeOut
    const border = (c) => ({ borderLeftColor: c, borderBottomColor: c })
    // Like IX2, the end values stay inline (e.g. border rgba(255,255,255,0) after close).
    const tl = gsap.timeline()
    if (open) {
      gsap.set(burgers, { clearProps: 'display' })
      // a-28 g0 is a "first group initial": the border is first set to rgba(255,255,255,0),
      // so the colour fades white-transparent -> white .2 (never via transparent black).
      tl.fromTo(wrap, border('rgba(255, 255, 255, 0)'), { ...border('rgba(255, 255, 255, 0.2)'), duration: 0.2, ease }, 0)
      tl.fromTo(links, { color: (i) => cap.links[i] }, { color: 'rgb(255, 255, 255)', duration: 0.2, ease }, 0)
      tl.fromTo(cross, { opacity: cap.cross }, { opacity: 1, duration: 0.1, ease }, 0.1)
    } else {
      // a-30 never reverts the links' colour: they keep IX2's inline white (measured on
      // live; invisible, since the menu hides instantly at <=991).
      gsap.set(burgers, { display: 'none' })
      tl.fromTo(wrap, border(cap.border), { ...border('rgba(255, 255, 255, 0)'), duration: 0.2, ease }, 0)
      tl.fromTo(cross, { opacity: cap.cross }, { opacity: 0, duration: 0.1, ease }, 0)
      tl.call(() => gsap.set(burgers, { clearProps: 'display' }), null, 0.1)
    }
    menuTl.current = tl
    return undefined
  }, [open])

  useEffect(
    () => () => {
      if (menuTl.current) menuTl.current.kill()
      delete document.documentElement.dataset.menuOpen
    },
    [],
  )

  // Scroll lock while the menu is open (§2: html overflow hidden, body
  // overscroll-behavior none / touch-action none). Lenis stop/start is in the M18 effect.
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
    <div ref={navRef} className={classes.join(' ')} id="book-demo-btn" role="banner" data-component="navbar">
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
