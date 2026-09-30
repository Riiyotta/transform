import Noise from '../ui/Noise'

// Index list section — `section.all-blogs-section[.cs]` (specs/blog.md §3.3, specs/case-studies.md §3.3).
// Left rail: sticky label (hidden <=991). Right: `.blog-list-right > .posts-wrap > .blogs-wrapper`
// holding the card list (`children`) and, on the blog index, the pagination row (`footer`).
// The blog index has the "All Articles" head (`heading`); case studies have none but add a
// section-level noise overlay.
// MOTION: BLOG-M2 — .all-blogs-section opacity 0 -> 1 (1.2s expo.out, t 0.1) on load.
// MOTION: BLOG-M10-style sticky: .left-sticky-block.blogs is position:sticky top 60 (CSS, >=992).
export default function ListSection({ id, cs = false, heading, label, children, footer }) {
  const variant = cs ? 'cs' : 'all'
  return (
    <section className={`all-blogs-section${cs ? ' cs' : ''}`} data-section={id}>
      {heading && (
        <div className="articles-head-wrap">
          <div className="text-56 right-side-heading">{heading}</div>
        </div>
      )}
      <div className="blogs-list-wrap">
        <div className="left-sticky-wrap blogs">
          <div className="left-sticky-block blogs">
            <div className="label-16">{label}</div>
          </div>
        </div>
        <div className="blog-list-right">
          <div className={`posts-wrap${cs ? ' cs' : ''}`}>
            <div className={`blogs-wrapper ${variant}`}>
              <div className={`blogs-list ${variant}`} role="list" data-component="card-list">
                {children}
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
      {cs && <Noise />}
    </section>
  )
}
