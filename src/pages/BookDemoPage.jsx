import '../styles/page-book-a-demo.css'
import DemoHero from '../components/demo/DemoHero'

// /book-a-demo — specs/book-a-demo.md. A single hero section; the shell (routes.jsx flags)
// renders only FooterBottom (no section.footer), no popup and no preloader.
// MOTION: BAD-M1 — page-load intro (IX3 i-eccee64b): .bg-pixels-wrapper 0 -> 1 (.08s power1.out
// at .02s), .nav-menu 0 -> 1 (1.2s expo.out at .1s). Start on mount (same decision as /compare).
export default function BookDemoPage() {
  return <DemoHero />
}
