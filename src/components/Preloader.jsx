import '../styles/preloader.css'

// `.preloader-wrap` (specs/compare.md §0, specs/legal.md §1): fixed full-screen #020801
// overlay, z 4, pointer-events none, display block. Rendered by App on routes with
// `preloader: true` (/compare, legal, blog, case studies), directly after the nav.
// Static render = the SETTLED state after the intro (opacity 0, still display:block).
// MOTION: CMP-M1 / LGL-M1 / BLOG-M1 — on load the intro sets opacity 1 and fades it 1 -> 0
//   (0.1s, power1.out, timeline position 0). Driven by src/motion/pageIntro.js (usePageIntro in App).
export default function Preloader() {
  return <div className="preloader-wrap" data-component="preloader" aria-hidden="true" />
}
