// M8a / M8b / M8c — pixel-grid transitions (IX3 i-13bbf4dd, i-65264235, i-967dd2ef).
// Measured on live (ScrollTrigger.getAll() + timeline children):
//   trigger = the `.transition-cont`, start "clamp(top bottom)", end "clamp(top -20%)", scrub 0
//   timeline: one fromTo per row over BOTH layers' `.pixel`s (DOM order: top layer row, then
//   mix row = 40 targets), opacity from -> to, duration .001, ease none,
//   stagger {amount 1, from 'random', grid 'auto', axis 'x'}; row _1 at 0, _2 .2, _3 .4,
//   _4 .6, _5 .8 (created _5 first, as IX3 does). Timeline duration 1.801.
import { gsap } from './gsap'

export function createPixelTransition(container, { from, to }) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'clamp(top bottom)',
      end: 'clamp(top -20%)',
      scrub: 0,
    },
  })
  ;[5, 4, 3, 2, 1].forEach((row) => {
    const pixels = container.querySelectorAll(`.grid-row._${row} .pixel`)
    tl.fromTo(
      pixels,
      { opacity: from },
      {
        opacity: to,
        duration: 0.001,
        ease: 'none',
        force3D: true,
        immediateRender: true,
        stagger: { amount: 1, from: 'random', grid: 'auto', axis: 'x' },
      },
      (row - 1) * 0.2,
    )
  })
  return tl
}
