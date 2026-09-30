import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../motion/gsap'
import { ASSETS } from '../data/assets'
import Noise from './ui/Noise'

// Fixed background layers inside `.page-wrap` — CLONE_SPEC §2. Back to front:
//   .page-wrap-solid-bg (z -3) · .bg-pixels-wrapper (z -2, fixed video) · .bg-noise-wrap (z -1)
// DOM order mirrors the original (noise, pixels, solid bg). Styles: PAGE LAYERS block.

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches
}

// Hero background video. The still (.bg-pic-pixels) shows until the video fires its
// first `playing` event, which adds `html.has-video`. Under prefers-reduced-motion the
// original never calls play(), so the still stays (verified on live, §2).
function HeroVideo() {
  const ref = useRef(null)
  const reduce = prefersReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduce) return undefined
    const onPlaying = () => document.documentElement.classList.add('has-video')
    video.muted = true
    video.addEventListener('playing', onPlaying, { once: true })
    const p = video.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
    return () => video.removeEventListener('playing', onPlaying)
  }, [reduce])

  // MOTION: M21 — 15.07s loop (native `loop`).
  return (
    <video
      ref={ref}
      autoPlay={!reduce}
      loop
      muted
      playsInline
      preload="auto"
      poster={ASSETS.heroVideoPoster}
      data-object-fit="cover"
    >
      <source src={ASSETS.heroVideoMp4} type="video/mp4" />
      <source src={ASSETS.heroVideoWebm} type="video/webm" />
    </video>
  )
}

// M3 — IX3 i-819b0df0 (measured on live via ScrollTrigger.getAll()/getTweensOf):
// trigger `.hero.home`, start "clamp(top top)", end "clamp(top -10%)" (0 -> 90px @900h),
// onLeave play / onEnterBack reverse of `opacity -> 0`, 0.5s power1.out, force3D.
function useVideoFade(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    const hero = document.querySelector('[data-section="hero"]')
    if (!el || !hero) return undefined
    const ctx = gsap.context(() => {
      // `.is-hidden` is kept as the QA state hook (SELECTORS.md). It is only added once the
      // tween has initialised (onComplete) so it can never leak into the recorded start
      // value; GSAP's inline opacity drives the visible value.
      const tween = gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.out',
        force3D: true,
        paused: true,
        onComplete: () => el.classList.add('is-hidden'),
      })
      ScrollTrigger.create({
        trigger: hero,
        start: 'clamp(top top)',
        end: 'clamp(top -10%)',
        onLeave: () => tween.play(),
        onEnterBack: () => {
          el.classList.remove('is-hidden')
          tween.reverse()
        },
      })
    })
    return () => ctx.revert()
  }, [ref])
}

// video: blog-post and case-study pages have no background video on live (specs/blog.md §1:
// replaced by invisible black-on-black layers, omitted here) but keep the noise + solid bg.
export default function PageLayers({ video = true }) {
  const wrapRef = useRef(null)
  useVideoFade(wrapRef)
  return (
    <>
      <div className="bg-noise-wrap" data-component="page-noise">
        <Noise />
      </div>
      {/* MOTION: M3 — this wrapper fades out after the hero scrolls 10% (GSAP, above). */}
      {video && (
      <div
        ref={wrapRef}
        className="bg-pixels-wrapper"
        data-component="hero-bg-video"
        aria-hidden="true"
      >
        <div className="bg-video-pixels">
          <HeroVideo />
        </div>
        <div className="bg-pic-pixels" />
      </div>
      )}
      <div className="page-wrap-solid-bg" />
    </>
  )
}
