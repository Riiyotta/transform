// M22 — page smooth scroll. Original: Lenis 1.0.23 driven by its own rAF loop with
// {lerp: .1, wheelMultiplier: .7, gestureOrientation: 'vertical', normalizeWheel: false,
// smoothTouch: false} (measured from window.lenis.options on live). html gets
// `.lenis.lenis-smooth`. Lenis is stopped while the mobile menu is open (see Navbar).
import { useLayoutEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from './gsap'

let lenis = null

export function getLenis() {
  return lenis
}

function setup() {
  const instance = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    touchMultiplier: 1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
    infinite: false,
  })
  lenis = instance
  // Keep ScrollTrigger in step with Lenis' programmatic scroll.
  instance.on('scroll', ScrollTrigger.update)

  let rafId = 0
  const raf = (time) => {
    instance.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  // Page layout settles after first paint (web fonts; the stats accordion auto-opens its
  // first block at <=991 and animates its height): re-measure trigger positions whenever the
  // document height changes. Viewport resizes are left to ScrollTrigger's own resize refresh.
  const refresh = () => ScrollTrigger.refresh()
  let timer = 0
  const debounced = () => {
    clearTimeout(timer)
    timer = setTimeout(refresh, 150)
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(debounced)
  let lastH = document.documentElement.scrollHeight
  let lastVp = `${window.innerWidth}x${window.innerHeight}`
  const ro = new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight
    const vp = `${window.innerWidth}x${window.innerHeight}`
    if (vp !== lastVp) {
      lastVp = vp
      lastH = h
      return
    }
    if (h !== lastH) {
      lastH = h
      debounced()
    }
  })
  ro.observe(document.body)

  return () => {
    cancelAnimationFrame(rafId)
    clearTimeout(timer)
    ro.disconnect()
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

export function useSmoothScroll() {
  useLayoutEffect(() => setup(), [])
}
