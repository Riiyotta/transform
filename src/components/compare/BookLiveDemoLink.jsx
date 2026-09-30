import UnderlinePair from '../ui/UnderlinePair'
import { BOOK_LIVE_DEMO } from '../../data/compare'

// `a.hero-cta-link.compare-demo` "Book a Live Demo" -> /book-a-demo (specs/compare.md §2, §4).
// Used twice: hero right block and table bottom. Text = `._56-px-text.footer-cta` (.text-56).
// MOTION: M12 — underline pair hover (shared UnderlinePair: _1 -> 0 then _2 -> 100%).
export default function BookLiveDemoLink() {
  return (
    <a href={BOOK_LIVE_DEMO.href} className="hero-cta-link compare-demo has-underline" data-component="book-live-demo-link">
      <div className="text-56 footer-cta">{BOOK_LIVE_DEMO.label}</div>
      <UnderlinePair />
    </a>
  )
}
