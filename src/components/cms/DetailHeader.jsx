import BackLink from './BackLink'

// Detail header — `section.blog-top-header` (margin-top 60) > `.post-hor-wrap` (specs/blog.md §4.2,
// specs/case-studies.md §4.2). `media` is the left rail cell (post hero image or case-study
// logo cell); `bottom` is the bottom slot (author/date, highlight or stats). `cs` adds the
// case-study divider (#3a3e39) and gradient edge.
// MOTION: BLOG-M2 — .blog-top-header opacity 0 -> 1 (1.2s expo.out, t 0.1) on load.
export default function DetailHeader({ cs = false, media, backLink, title, bottom }) {
  return (
    <section className="blog-top-header" data-section="post-header">
      <div className="post-hor-wrap">
        {media}
        <div className={`blog-header-right${cs ? ' cs' : ''}`}>
          <div className={`post-top-linear${cs ? ' cs' : ''}`} />
          <div className="blog-top">
            <BackLink href={backLink.href} text={backLink.text} />
            <h2 className="text-56 blog-page-title">{title}</h2>
          </div>
          {bottom}
        </div>
      </div>
    </section>
  )
}
