import { useEffect, useRef, useState } from 'react'
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

// M3 trigger: `.hero.home` start "top top" -> end "top -10%" (leave = fade out,
// enterBack = fade in). The hero starts at y 0, so "past the end" == scrollY > 10vh.
// TODO(Animation): replace with the ScrollTrigger tween (M3: 0.5s power1.out). This only
// toggles the class so the static states (hero with video / rest of page without it,
// incl. the footer reveal) are correct.
function useVideoHidden() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const update = () => setHidden(window.scrollY > window.innerHeight * 0.1)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return hidden
}

export default function PageLayers() {
  const videoHidden = useVideoHidden()
  return (
    <>
      <div className="bg-noise-wrap" data-component="page-noise">
        <Noise />
      </div>
      {/* MOTION: M3 — this wrapper fades out after the hero scrolls 10% (see index.css). */}
      <div
        className={`bg-pixels-wrapper${videoHidden ? ' is-hidden' : ''}`}
        data-component="hero-bg-video"
        aria-hidden="true"
      >
        <div className="bg-video-pixels">
          <HeroVideo />
        </div>
        <div className="bg-pic-pixels" />
      </div>
      <div className="page-wrap-solid-bg" />
    </>
  )
}
