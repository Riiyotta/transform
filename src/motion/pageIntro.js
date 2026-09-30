// Page-load intros for the non-home families (Motion-3). Faithful ports of the live IX3
// `wf:load` timelines, decoded from recon/pages/compare/shared/ix3-pages-readable.txt and
// recon/pages/blog/shared/ix-{index,detail}-ix3-readable.txt:
//   compare / book-a-demo / legal  -> i-eccee64b / t-bd0be8f7  (CMP-M1, BAD-M1, LGL-M1)
//   blog + case-studies index      -> i-7723a9c6 / t-04b74f4a  (BLOG-M1..M4)
//   blog post + case-study detail  -> i-452c7296 / t-72fecfeb  (BLOG-M1, M2; M5 layers not rendered)
// IX3 ease map (CLONE_SPEC §18): 2 = power1.out, 26 = expo.out; no ease = GSAP default
// power1.out (verified on the preloader: .624 at 21ms, .397 at 37ms).
//
// D11: live starts these on window `load` (2.3-6s); the clone starts them ON MOUNT with the
// same positions, durations, eases and values. The static render is the SETTLED state; the
// "from" values are written here in a layout effect (before first paint) so the settled
// state never flashes. Targets are found by class, page-wide, exactly like IX3's
// `wf:class` targets, so no page component needs to know about the intro.
// Every animated property is paint-only (opacity, transform, width/height of absolutely
// positioned hairlines), so ScrollTrigger positions are unaffected and no refresh is needed.
// Reduced motion: the original runs these intros unchanged under prefers-reduced-motion
// (IX3 has no guard; re-verified on live, recon/motion-3), so no guard here either.
// When the timeline completes, the inline styles it wrote are cleared (the CSS settled
// state equals the IX3 end values), except on .bg-pixels-wrapper, which the M3 video-fade
// tween owns afterwards (live also keeps inline opacity 1 there).
import { useLayoutEffect } from 'react'
import { gsap } from './gsap'

const P1 = 'power1.out' // IX3 ease 2 and the GSAP default
const EXPO = 'expo.out' // IX3 ease 26

const all = (sel) => [...document.querySelectorAll(sel)]

// [selector, from, to, duration, position, ease, extra]
const PIXELS_IN = [
  ['.preloader-wrap', { opacity: 1 }, { opacity: 0 }, 0.1, 0, P1],
  ['.bg-pixels', { opacity: 0 }, { opacity: 1 }, 0.08, 0.02, P1],
  ['.bg-pixels-wrapper', { opacity: 0 }, { opacity: 1 }, 0.08, 0.02, P1],
  ['.nav-menu', { opacity: 0 }, { opacity: 1 }, 1.2, 0.1, EXPO],
]

const TIMELINES = {
  // t-bd0be8f7 (CMP-M1 / BAD-M1 / LGL-M1). `._16px-text.white-text.book-demo-hero` is a
  // target on live but does not exist in any page DOM, so it is omitted.
  eccee: [
    ...PIXELS_IN,
    ['.bg-pixels-overlay', { opacity: 1 }, { opacity: 0 }, 0.7, 1.1, P1],
    ['.hero-bottom-block.left', { opacity: 0 }, { opacity: 1 }, 1.2, 0.6, EXPO],
    ['.hero-bottom-block.full-width', { opacity: 0 }, { opacity: 1 }, 1.2, 0.6, EXPO],
    ['.hero-bottom-block.right', { opacity: 0 }, { opacity: 1 }, 1.2, 1.1, EXPO],
    ['.line-hor.on-hero', { width: '0%' }, { width: '100%' }, 1, 0.6, EXPO],
    ['.line-vert', { height: '0%' }, { height: '100%' }, 1, 1.1, EXPO],
  ],
  // t-04b74f4a (BLOG-M1..M4, case-studies index). The H1 (`.white-text.hero-home`) is split
  // into words by IX3 SplitText; the clone renders the word spans statically.
  index: [
    ...PIXELS_IN,
    ['.hero-heading .gsap_split_word', { opacity: 0, y: '50%' }, { opacity: 1, y: '0%' }, 1, 0.1, EXPO, { stagger: 0.1 }],
    ['.bg-pixels-overlay', { opacity: 1 }, { opacity: 0 }, 0.7, 0.61, P1],
    ['.featured-post', { opacity: 0 }, { opacity: 1 }, 1.2, 0.1, EXPO],
    ['.all-blogs-section', { opacity: 0 }, { opacity: 1 }, 1.2, 0.1, EXPO],
  ],
  // t-72fecfeb (BLOG-M1/M2 detail; the invisible .bg-pixels/overlay layers are not rendered).
  detail: [
    ...PIXELS_IN,
    ['.bg-pixels-overlay', { opacity: 1 }, { opacity: 0 }, 0.7, 0.6, P1],
    ['.blog-top-header', { opacity: 0 }, { opacity: 1 }, 1.2, 0.1, EXPO],
    ['.post-body-section', { opacity: 0 }, { opacity: 1 }, 1.2, 0.1, EXPO],
  ],
}

const FAMILY_TIMELINE = {
  compare: 'eccee',
  'book-a-demo': 'eccee',
  legal: 'eccee',
  'blog-index': 'index',
  'case-studies-index': 'index',
  'blog-post': 'detail',
  'case-study': 'detail',
}

// Owned by the M3 video fade after the intro; keep its inline end value (as live does).
const KEEP_INLINE = new Set(['.bg-pixels-wrapper', '.bg-pixels'])

export function usePageIntro(family = document.documentElement.dataset.page) {
  useLayoutEffect(() => {
    const spec = TIMELINES[FAMILY_TIMELINE[family]]
    if (!spec) return undefined
    const ctx = gsap.context(() => {
      const cleared = []
      const tl = gsap.timeline({
        onComplete: () => {
          for (const [els, props] of cleared) gsap.set(els, { clearProps: props })
        },
      })
      for (const [sel, from, to, duration, position, ease, extra] of spec) {
        const els = all(sel)
        if (!els.length) continue
        tl.fromTo(els, { ...from }, { ...to, duration, ease, immediateRender: true, ...extra }, position)
        if (!KEEP_INLINE.has(sel)) {
          const props = Object.keys(to).map((p) => (p === 'y' ? 'transform' : p))
          cleared.push([els, props.join(',')])
        }
      }
      if (import.meta.env.DEV) window.__pageIntro = { family, t0: performance.now(), tl }
    })
    return () => ctx.revert()
  }, [family])
}
