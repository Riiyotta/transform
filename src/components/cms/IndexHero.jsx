import { Fragment } from 'react'

// Index hero — `section.hero.blog.hide-on-scroll[.cs]` (specs/blog.md §3.2, specs/case-studies.md §3.2).
// The H1 reuses the homepage hero role (.hero-heading = .white-text.hero-home) with the `.blog`
// margin-right override, split into per-word inline-block spans (`.gsap_split_word`) as on live.
// `data-section="hero"` is the trigger for the shell video fade in PageLayers.
// MOTION: BLOG-M3 — per word opacity 0 -> 1, translateY 50% -> 0 (1.0s expo.out each), from
//   t 0.1, stagger 0.1s per word (blog 8 words, case studies 6). Static final state here.
// MOTION: M3b (shell) — .bg-pixels-wrapper fades once this hero scrolls past top −10%.
export default function IndexHero({ heading, cs = false, children }) {
  // SplitText also splits on the NBSP in the CMS text ("&\u00a0Growth"): live wraps there.
  const words = heading.split(/[ \u00a0]+/)
  return (
    <section className={`hero blog hide-on-scroll${cs ? ' cs' : ''}`} data-section="hero">
      <h1 className="hero-heading blog">
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && ' '}
            <span className={`gsap_split_word gsap_split_word${i + 1}`}>{w}</span>
          </Fragment>
        ))}
      </h1>
      {children}
    </section>
  )
}
